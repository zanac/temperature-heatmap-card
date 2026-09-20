# Temperature Heatmap card for Home Assistant
Temperature Heatmap for Home Assistant v1.1.2
![Screenshot](https://github.com/zanac/temperature-heatmap-card/assets/21194919/b0ea847c-fb91-4f28-84d0-d468e89a7af5)


Custom card enabling [Temperature Heat maps](https://en.wikipedia.org/wiki/Heat_map) in Home Assistant. Makes it simple to visualize the temperature data in your Home Assistant, as a heatmap, in a very cool way.

## About this fork
This is an unofficial fork of [zanac/temperature-heatmap-card](https://github.com/zanac/temperature-heatmap-card) (based on v1.1.2) that fixes how the card handles missing sensor data. The card itself and all credit belong to zanac; this fork is not affiliated with the upstream project.

### What's fixed
**Missing hourly data no longer shows up as false low temperatures.** The card averages the sensor's hourly statistics in pairs of hours. Previously, an hour with no recorded statistic was treated as a real reading of `0` and averaged with its partner hour. A 78° reading next to a missing hour was drawn as 39°, and two missing hours were drawn as a literal 0.0. This shows up with sensors that don't report every hour or that had a gap in reporting.

<img width="446" height="482" alt="630181984-fccbe55f-f120-4359-a2d5-e7c8ab9f39a0" src="https://github.com/user-attachments/assets/7e97b787-834a-4ab5-acbf-84dc84e0dcaa" />

| Hours in the pair | Before | Now |
|---|---|---|
| Both present | Average | Average (unchanged) |
| One missing | (real value + 0) / 2 | The real value |
| Both missing | 0.0 | Gray "no data" cell |

Three smaller changes go with it:
* **A real reading of exactly 0 is kept.** It used to be skipped as if the hour were missing.
* **The first day of fetched data is no longer dropped.** The original loader threw it away. That day is normally outside the 7 visible days, so it only mattered for a sensor with less than a week of history, whose first day was missing.
* **Forecast fill still works.** With `day_forecast` on, today's not-yet-recorded hours are still filled from the forecast, adjusted for the new "no data" handling.

Also included from upstream v1.1.2: the entity picker fix in the visual editor ("Fix entity picker domain filters").

### Where the changes are
All changes are in `temperature-heatmap-card.js` in the repo root, which is the file HACS installs (see `hacs.json`). `dist/` is unchanged from upstream.

### Testing
The old and new averaging code were run against synthetic data: a full day, a day with gaps, a partly recorded current day, and a brand-new sensor. With no gaps, the output is identical to upstream. With gaps, the old code produced the false values above and the new code produces the real value or "no data".

### Installing this fork with HACS
1. If you have zanac's version installed, remove it in HACS first (the two can't share the same folder).
2. HACS → ⋮ → **Custom repositories** → add `https://github.com/way-lo/temperature-heatmap-card` with type **Dashboard**.
3. Download it, then hard-refresh your browser (and clear the app's frontend cache on mobile).


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
[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=way-lo&repository=temperature-heatmap-card&category=Lovelace)

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
