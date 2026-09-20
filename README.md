Recently one of my temperature sensors became less reliable in providing temperatures.  This heatmap integration began averaging no data with existing data, creating very odd looking heatmaps:

<img width="446" height="482" alt="image" src="https://github.com/user-attachments/assets/fccbe55f-f120-4359-a2d5-e7c8ab9f39a0" />

With the assistance of Claude troubleshooting, we identified that missing hourly statistics are coerced to 0 instead of skipped, corrupting averages and producing false 0.0/near-0.0 cells

Description:

When an hour has no recorder statistic for the configured entity (a normal occurrence — most sensors don't report on exact clock-hour boundaries), the heatmap displays badly wrong values instead of the actual temperature: cells land far below the real reading, and some cells show a literal 0.0.

Root cause

In `loaderResponse()`, missing hours are stored as `null` in the 24-slot `gridTemp` array:

```
gridTemp = Array(24).fill(null);
...
if (entry.mean) gridTemp[hour] = entry.mean;`
```

In `render()`, that array is coerced to a string and re-parsed:

```
var arrTemp = String(this.grid[i].vals).split(",");
if (arrTemp[0] == "") arrTemp[0] = 0;`
```

`Array.prototype.toString()` renders `null/undefined` elements as empty strings, and the `== ""` check then substitutes literal `0` — not "no data," an actual zero — for any missing hour. That zero is then blindly averaged with its paired hour:
```
var hour00 = ((parseFloat(arrTemp[0]) + parseFloat(arrTemp[1]))/2);
```

So a real 78°F reading paired with one missing hour renders as `(78 + 0) / 2 = 39`, and two missing hours in the same pair render as a literal `0.0`. This also feeds `tempToRGB()`, which — for a Fahrenheit entity — converts `0` to Celsius and lands in the "extreme cold" branch, rendering the cell in a violet/magenta color rather than flagging it as missing data.

There's a second, related bug in the same function: `gridTemp` is only pushed into `grid` when the date changes (`prevDate !== null`), so the very first day's readings are collected into an array that's discarded when the loop rolls over to day two — the first day of every query window is silently dropped.

Suggested fix: push each day's array immediately (not only on date-change-after-the-first), and average hour-pairs by checking for `null/undefined` directly on the array rather than round-tripping through a stringified/re-split representation, returning the existing `-999` "no data" sentinel (which `tempToRGB()` already handles → gray cell) when both hours in a pair are missing.

The code fix

Two changes, both in `temperature-heatmap-card.js`.

1. `loaderResponse()` — stop dropping the first day, keep null as null:

```
// BEFORE
loaderResponse(recorderResponse) {
      var customtable = JSON.stringify(recorderResponse);
      var consumers = [this.config.entity];
      var grid = [];
      for (const consumer of consumers) {
          const consumerData = recorderResponse[consumer];
          var gridTemp = [];
          var prevDate = null;
          var hour;
          for (const entry of consumerData) {
              const start = new Date(entry.start);
              hour = start.getHours();
              const dateRep = start.toLocaleDateString("en-EN", {day: '2-digit'});
              if (dateRep !== prevDate) {
                  gridTemp = Array(24).fill(null);
                  grid.push({'date': dateRep, 'nativeDate': start, 'vals': gridTemp});
              }
              if (entry.mean !== undefined && entry.mean !== null) {
                  gridTemp[hour] = entry.mean;
              }
              prevDate = dateRep;
          }
          this.grid = grid;
      }
      this.refreshRender();
}
```

```
// AFTER
loaderResponse(recorderResponse) {
      var consumers = [this.config.entity];
      var grid = [];
      for (const consumer of consumers) {
          const consumerData = recorderResponse[consumer];
          var gridTemp = null;
          var prevDate = null;
          for (const entry of consumerData) {
              const start = new Date(entry.start);
              const hour = start.getHours();
              const dateRep = start.toLocaleDateString("en-EN", {day: '2-digit'});
              if (dateRep !== prevDate) {
                  gridTemp = Array(24).fill(null);
                  grid.push({'date': dateRep, 'nativeDate': start, 'vals': gridTemp});
              }
              if (entry.mean !== undefined && entry.mean !== null) {
                  gridTemp[hour] = entry.mean;
              }
              prevDate = dateRep;
          }
          this.grid = grid;
      }
      this.refreshRender();
}
```

Key changes: `if (dateRep !== prevDate)` (dropped the `&& prevDate !== null` guard) so day one gets pushed like every other day; dropped the trailing `gridTemp.splice(hour + 1)` truncation, which isn't needed once we're not relying on array length for anything; and the `entry.mean` check is now an explicit null/undefined check (the original if `(entry.mean)` also has a minor edge case — a genuine `0` reading would be falsy and get skipped — not your bug here, but worth fixing while in there).

2. `render()` — average real values, don't coerce gaps to zero:

Replace this whole block (the `String(...).split(",")` line, all 24 of the `if (arrTemp[n] == "") arrTemp[n] = 0;` lines, and all 12 `hourNN` average lines):

```
// AFTER — drop-in replacement for that entire section
var vals = this.grid[i].vals;
var pairAvg = function(h1, h2) {
    var v1 = vals[h1], v2 = vals[h2];
    var has1 = (v1 !== null && v1 !== undefined);
    var has2 = (v2 !== null && v2 !== undefined);
    if (!has1 && !has2) return -999;
    if (has1 && has2) return (parseFloat(v1) + parseFloat(v2)) / 2;
    return parseFloat(has1 ? v1 : v2);
};
var hour00 = pairAvg(0, 1);
var hour02 = pairAvg(2, 3);
var hour04 = pairAvg(4, 5);
var hour06 = pairAvg(6, 7);
var hour08 = pairAvg(8, 9);
var hour10 = pairAvg(10, 11);
var hour12 = pairAvg(12, 13);
var hour14 = pairAvg(14, 15);
var hour16 = pairAvg(16, 17);
var hour18 = pairAvg(18, 19);
var hour20 = pairAvg(20, 21);
var hour22 = pairAvg(22, 23);
```

This uses the array directly (`this.grid[i].vals`) instead of the string round-trip, and returns `-999` — the sentinel the card already uses everywhere else for "no data" — when both hours in a pair are missing. `tempToRGB()` and `tempToLabel()` both already handle `-999` correctly (gray cell, blank label), so no changes needed downstream.

I've made the changes in temperature-heatmap-card.js and after clearing cache, etc, the heatmap is repaired (mostly):

<img width="435" height="415" alt="image" src="https://github.com/user-attachments/assets/5c341293-0817-4d8a-a897-394e1e6d1a81" />

Figuring out why the sensor data is not as consistent as before is another problem to tackle.


# Temperature Heatmap card for Home Assistant
Temperature Heatmap for Home Assistant v1.1.2
![Screenshot](https://github.com/zanac/temperature-heatmap-card/assets/21194919/b0ea847c-fb91-4f28-84d0-d468e89a7af5)


Custom card enabling [Temperature Heat maps](https://en.wikipedia.org/wiki/Heat_map) in Home Assistant. Makes it simple to visualize the temperature data in your Home Assistant, as a heatmap, in a very cool way.

## About this card
  * About trend icon algorithm: icons show the trend of the day compared previous two days. It's not the right way, it's just a naif implementation.
  * About humidity: heatmap scale for humidity is not complete, it's just a POC!
  * About footer labels: footer is in English format, sorry.

## Support
Hey dude! Help me out for a couple of :beers: or a :coffee:!<br/>
[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://bmc.link/zanac)

## Current state?
* Spaghetti code
* Need a lot of small feature that i plan
* Now with fahrenheit!
* Anyway... it works!

## Installation
### HACS
[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=zanac&repository=temperature-heatmap-card&category=Lovelace)

If you use [HACS](https://hacs.xyz) as-is, this card can be added as a **custom repository**.
(As always, you should be careful with software which lets you pull random code from the Internet and run it)


### Manual install
  * Download `temperature-heatmap-card.js`, place it in your `config/www` directory.
  * Add `/local/temperature-heatmap-card.js` in your Resource config, type of `JavaScript Module`.

### Configuration using the GUI
Just add a temperature sensor a card title and play with options! The preview, sorry, don't work you should save after change an option.
![image](https://github.com/zanac/temperature-heatmap-card/assets/21194919/73afea00-83a2-45aa-bb72-2da965f30a29)


### Configuration using YAML
Minimal example
```
type: custom:temperature-heatmap-card
entity: sensor.your_sensor
title: Card Title
month_label: true/false
day_label: true/false
footer: true/false
day_trend: true/false
day_forecast: true/false add forecast
forecast_entity: enter a weather forecast sensor
force_fahrenheit: true/false
temp_adj: numeric_value (+- adj temperture of forecast by the value entered)
decimal_point: true/false
```

## About me
My real name is Vanni Brutto, for friends... just call me Zanac

## General thanks
* [Home Assistant](https://www.home-assistant.io/)
* kandsten that make ha-heatmap-card that i use to get some idea of how to implement my card https://github.com/kandsten/ha-heatmap-card/
