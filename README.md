# Temperature Heatmap card for Home Assistant
Temperature Hetmap for Home Assistant v0.9.9.1
![image](https://github.com/zanac/temperature-heatmap-card/assets/21194919/b0ea847c-fb91-4f28-84d0-d468e89a7af5)


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
temp_adj: numeric_value (+- adj temperture of forecast by the value entered)
```

## About me
My real name is Vanni Brutto, for friends... just call me Zanac

## General thanks
* [Home Assistant](https://www.home-assistant.io/)
* kandsten that make ha-heatmap-card that i use to get some idea of how to implement my card https://github.com/kandsten/ha-heatmap-card/
