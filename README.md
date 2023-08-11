# Temperature Heatmap card for Home Assistant
Temperature Hetmap for Home Assistant
![image](https://github.com/zanac/temperature-heatmap-card/assets/21194919/3a0bc046-e769-42c1-950e-7715c43a747e)

Custom card enabling [Temperature Heat maps](https://en.wikipedia.org/wiki/Heat_map) in Home Assistant. Makes it simple to visualize the temperature data in your Home Assistant, as a heatmap, in a very cool way.

## About this card
About trend icon algorithm: icons show the trend of the day compared previous two days.

## Current state?
* Spaghetti code
* Need a lot of small feature that i plan
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
Just add a temperature sensor and a card title!

### Configuration using YAML
Sorry, for now the only way is use YAML!
Minimal example
```
type: custom:temperature-heatmap-card
entity: sensor.your_sensor
title: Card Title
month_label: true/false
day_label: true/false
footer: true/false
```

## About me
My real name is Vanni Brutto, for friends... just call me Zanac

## General thanks
* [Home Assistant](https://www.home-assistant.io/)
* kandsten that make ha-heatmap-card that i use to get some idea of how to implement my card https://github.com/kandsten/ha-heatmap-card/
