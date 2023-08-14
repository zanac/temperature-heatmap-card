# Temperature Heatmap card for Home Assistant v0.9
Temperature Hetmap for Home Assistant
![image](https://github.com/zanac/temperature-heatmap-card/assets/21194919/f4b28ad0-5282-46de-acd1-50ad82ecb614)


Custom card enabling [Temperature Heat maps](https://en.wikipedia.org/wiki/Heat_map) in Home Assistant. Makes it simple to visualize the temperature data in your Home Assistant, as a heatmap, in a very cool way.
  
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
