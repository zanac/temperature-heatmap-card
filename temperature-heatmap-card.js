class TemperatureHeatmapCard extends HTMLElement {
  // Whenever the state changes, a new `hass` object is set. Use this to
  // update your content.
  set hass(hass) {
    this.myhass = hass;
    // Initialize the content if it's not there yet.
    if (!this.content) {
      this.innerHTML = `
        <ha-card header="${this.config.title}">
          <div class="card-content"></div>
        </ha-card>
      `;
      this.content = this.querySelector("div");
    }

    const entityId = this.config.entity;
    const state = hass.states[entityId];
    const stateStr = state ? state.state : "unavailable";
    
    this.get_recorder([entityId], 7);

    this.render();
  }

  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }

  tempToRGB(temp) {
    if (isNaN(Math.round(temp))) return "d1d1d1";
    if (temp == -999) return "d1d1d1";
    var minimum = -5;
    var maximum = 35;
    var valTemp = temp;
    if (valTemp < minimum) valTemp = minimum;
    if (valTemp > maximum) valTemp = maximum;
    var _ratio = 2 * (valTemp-minimum) / (maximum - minimum);
    var b = parseInt(Math.max(0, 255*(1-_ratio)));
    var r = parseInt(Math.max(0, 255*(_ratio-1)));
    var g = 255 - b - r;
    return r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
  }

  tempToLabel(temp) {
    if (temp == -999) return "";
    else if (isNaN(temp)) return ""
    else return temp;
  }


  render() {
        // We may be trying to render before we've received the recorder data.
      var gridHTML = "";
      var grid7 = [[-999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999],
                   [-999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999],
                   [-999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999],
                   [-999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999],
                   [-999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999],
                   [-999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999],
                   [-999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999]]
    if (this.grid === undefined) gridHTML = "";
    else {
      var i;
      for (i=0; i<this.grid.length; i++) {
        var j = 0;
        if (this.grid[i].date == this.Day0) j = 0;
        if (this.grid[i].date == this.Day1) j = 1;
        if (this.grid[i].date == this.Day2) j = 2;
        if (this.grid[i].date == this.Day3) j = 3;
        if (this.grid[i].date == this.Day4) j = 4;
        if (this.grid[i].date == this.Day5) j = 5;
        if (this.grid[i].date == this.Day6) j = 6;
        var arrTemp = String(this.grid[i].vals).split(",");
        var hour00 = ((parseFloat(arrTemp[0]) + parseFloat(arrTemp[1]))/2);
        var hour02 = ((parseFloat(arrTemp[2]) + parseFloat(arrTemp[3]))/2);
        var hour04 = ((parseFloat(arrTemp[4]) + parseFloat(arrTemp[5]))/2);
        var hour06 = ((parseFloat(arrTemp[6]) + parseFloat(arrTemp[7]))/2);
        var hour08 = ((parseFloat(arrTemp[8]) + parseFloat(arrTemp[9]))/2);
        var hour10 = ((parseFloat(arrTemp[10]) + parseFloat(arrTemp[11]))/2);
        var hour12 = ((parseFloat(arrTemp[12]) + parseFloat(arrTemp[13]))/2);
        var hour14 = ((parseFloat(arrTemp[14]) + parseFloat(arrTemp[15]))/2);
        var hour16 = ((parseFloat(arrTemp[16]) + parseFloat(arrTemp[17]))/2);
        var hour18 = ((parseFloat(arrTemp[18]) + parseFloat(arrTemp[19]))/2);
        var hour20 = ((parseFloat(arrTemp[20]) + parseFloat(arrTemp[21]))/2);
        var hour22 = ((parseFloat(arrTemp[22]) + parseFloat(arrTemp[23]))/2);
        grid7[j][0] = hour00;
        grid7[j][1] = hour02;
        grid7[j][2] = hour04;
        grid7[j][3] = hour06;
        grid7[j][4] = hour08;
        grid7[j][5] = hour10;
        grid7[j][6] = hour12;
        grid7[j][7] = hour14;
        grid7[j][8] = hour16;
        grid7[j][9] = hour18;
        grid7[j][10] = hour20;
        grid7[j][11] = hour22;
      }
      if (this.lastHour !== undefined) {
           if (this.lastTime == "00") i = 0;
           if (this.lastTime == "01") i = 0;
           if (this.lastTime == "02") i = 1;
           if (this.lastTime == "03") i = 1;
           if (this.lastTime == "04") i = 2;
           if (this.lastTime == "05") i = 2;
           if (this.lastTime == "06") i = 3;
           if (this.lastTime == "07") i = 3;
           if (this.lastTime == "08") i = 4;
           if (this.lastTime == "09") i = 4;
           if (this.lastTime == "10") i = 5;
           if (this.lastTime == "11") i = 5;
           if (this.lastTime == "12") i = 6;
           if (this.lastTime == "13") i = 6;
           if (this.lastTime == "14") i = 7;
           if (this.lastTime == "15") i = 7;
           if (this.lastTime == "16") i = 8;
           if (this.lastTime == "17") i = 8;
           if (this.lastTime == "18") i = 9;
           if (this.lastTime == "19") i = 9;
           if (this.lastTime == "20") i = 10;
           if (this.lastTime == "21") i = 10;
           if (this.lastTime == "22") i = 11;
           if (this.lastTime == "23") i = 11;
           grid7[6][this.hourIndex] = this.lastHour;
      }
    }
    
    gridHTML = gridHTML + this.tempToRGB(grid7[0][0]) + "<br>";

    this.content.innerHTML = `<table cellspacing="0" cellpadding="0" style="margin: 0 auto;width:98%" >
      <thead>
          <tr>                    
              <td width="16%" ></td>
                  <td width="12%" style="white-space: nowrap;text-align:center;vertical-align:middle;">${this.Day0}</td>
                  <td width="12%" style="white-space: nowrap;text-align:center;vertical-align:middle;">${this.Day1}</td>
                  <td width="12%" style="white-space: nowrap;text-align:center;vertical-align:middle;">${this.Day2}</td>
                  <td width="12%" style="white-space: nowrap;text-align:center;vertical-align:middle;">${this.Day3}</td>
                  <td width="12%" style="white-space: nowrap;text-align:center;vertical-align:middle;">${this.Day4}</td>
                  <td width="12%" style="white-space: nowrap;text-align:center;vertical-align:middle;">${this.Day5}</td>
                  <td width="12%" style="white-space: nowrap;text-align:center;vertical-align:middle;">${this.Day6}</td>
          </tr>
      </thead>
      <tbody>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>00:00</td>
                          <td style="background-color:#${this.tempToRGB(grid7[0][0])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[0][0]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[1][0])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[1][0]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[2][0])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[2][0]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[3][0])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[3][0]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[4][0])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[4][0]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[5][0])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[5][0]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[6][0])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[6][0]))}
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>02:00</td>
                          <td style="background-color:#${this.tempToRGB(grid7[0][1])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[0][1]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[1][1])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[1][1]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[2][1])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[2][1]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[3][1])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[3][1]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[4][1])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[4][1]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[5][1])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[5][1]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[6][1])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[6][1]))}
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>04:00</td>
                          <td style="background-color:#${this.tempToRGB(grid7[0][2])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[0][2]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[1][2])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[1][2]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[2][2])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[2][2]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[3][2])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[3][2]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[4][2])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[4][2]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[5][2])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[5][2]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[6][2])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[6][2]))}
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>06:00</td>
                          <td style="background-color:#${this.tempToRGB(grid7[0][3])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[0][3]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[1][3])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[1][3]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[2][3])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[2][3]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[3][3])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[3][3]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[4][3])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[4][3]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[5][3])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[5][3]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[6][3])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[6][3]))}
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>08:00</td>
                          <td style="background-color:#${this.tempToRGB(grid7[0][4])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[0][4]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[1][4])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[1][4]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[2][4])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[2][4]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[3][4])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[3][4]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[4][4])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[4][4]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[5][4])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[5][4]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[6][4])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[6][4]))}
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>10:00</td>
                          <td style="background-color:#${this.tempToRGB(grid7[0][5])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[0][5]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[1][5])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[1][5]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[2][5])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[2][5]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[3][5])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[3][5]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[4][5])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[4][5]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[5][5])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[5][5]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[6][5])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[6][5]))}
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>12:00</td>
                          <td style="background-color:#${this.tempToRGB(grid7[0][6])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[0][6]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[1][6])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[1][6]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[2][6])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[2][6]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[3][6])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[3][6]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[4][6])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[4][6]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[5][6])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[5][6]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[6][6])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[6][6]))}
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>14:00</td>
                          <td style="background-color:#${this.tempToRGB(grid7[0][7])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[0][7]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[1][7])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[1][7]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[2][7])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[2][7]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[3][7])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[3][7]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[4][7])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[4][7]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[5][7])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[5][7]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[6][7])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[6][7]))}
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>16:00</td>
                          <td style="background-color:#${this.tempToRGB(grid7[0][8])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[0][8]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[1][8])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[1][8]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[2][8])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[2][8]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[3][8])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[3][8]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[4][8])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[4][8]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[5][8])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[5][8]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[6][8])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[6][8]))}
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>18:00</td>
                          <td style="background-color:#${this.tempToRGB(grid7[0][9])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[0][9]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[1][9])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[1][9]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[2][9])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[2][9]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[3][9])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[3][9]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[4][9])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[4][9]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[5][9])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[5][9]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[6][9])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[6][9]))}
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>20:00</td>
                          <td style="background-color:#${this.tempToRGB(grid7[0][10])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[0][10]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[1][10])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[1][10]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[2][10])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[2][10]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[3][10])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[3][10]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[4][10])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[4][10]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[5][10])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[5][10]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[6][10])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[6][10]))}
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>22:00</td>
                          <td style="background-color:#${this.tempToRGB(grid7[0][11])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[0][11]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[1][11])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[1][11]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[2][11])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[2][11]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[3][11])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[3][11]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[4][11])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[4][11]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[5][11])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[5][11]))}
                          </td>
                          <td style="background-color:#${this.tempToRGB(grid7[6][11])};color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              ${this.tempToLabel(Math.round(grid7[6][11]))}
                          </td>
              </tr>
       </tbody>
  </table>
    `;

      return "";
  }

  loaderFailed(error) {
        console.log("In Errore!!!!!");
        console.log(error);
  }

  loaderResponse(recorderResponse) {
        var customtable = JSON.stringify(recorderResponse);
        //this.grid = customtable;
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

                if (dateRep !== prevDate && prevDate !== null) {
                    gridTemp = Array(24).fill(null);
                    grid.push({'date': dateRep, 'nativeDate': start, 'vals': gridTemp});
                }
                if (entry.mean) gridTemp[hour] = entry.mean;
                prevDate = dateRep;
            }
            gridTemp.splice(hour + 1);
            this.grid = grid;
        }
  }

  loaderResponse5(recorderResponse) {
        var customtable = JSON.stringify(recorderResponse);
        //this.grid = customtable;
        var consumers = [this.config.entity];
        var grid = [];
        var lastHour = 0;
        var countHour = 0;
        var lastTime = 0;
        for (const consumer of consumers) {
            const consumerData = recorderResponse[consumer];
            var gridTemp = [];
            var prevDate = null;
            var hour;
            for (const entry of consumerData) {
                const start = new Date(entry.start);
                hour = start.getHours();
                lastTime = start.toLocaleDateString("en-EN", {day: '2-digit'});
                lastHour = lastHour + entry.mean;
                countHour = countHour + 1;
            }
        }
        this.lastHour = lastHour / countHour;
        this.lastTime = lastTime;
    }

  get_recorder(consumers, days) {
        const now = new Date();
        this.grid_status = undefined;
        var startTime = new Date(now - (days * 86400000))
        startTime.setHours(0, 0, 0);
        var endTime = new Date(now)
        this.myhass.callWS({
            'type': 'recorder/statistics_during_period',
            'statistic_ids': [this.config.entity],
            "period": "hour",
            "start_time": startTime,
            "end_time": endTime
        }).then(this.loaderResponse.bind(this),
                this.loaderFailed.bind(this));
        
        startTime = new Date(now - (days * 86400000))
        var hour = startTime.getHours();
        this.Day6 = endTime.getDate();
        this.Day5 = (new Date(now - (1 * 86400000))).getDate();
        this.Day4 = (new Date(now - (2 * 86400000))).getDate();
        this.Day3 = (new Date(now - (3 * 86400000))).getDate();
        this.Day2 = (new Date(now - (4 * 86400000))).getDate();
        this.Day1 = (new Date(now - (5 * 86400000))).getDate();
        this.Day0 = (new Date(now - (6 * 86400000))).getDate();
        if (hour == 1) hour = 0;
        if (hour == 3) hour = 2;
        if (hour == 5) hour = 4;
        if (hour == 7) hour = 6;
        if (hour == 9) hour = 8;
        if (hour == 11) hour = 10;
        if (hour == 13) hour = 12;
        if (hour == 15) hour = 14;
        if (hour == 17) hour = 16;
        if (hour == 19) hour = 18;
        if (hour == 21) hour = 20;
        if (hour == 23) hour = 22;
        this.hourIndex = parseInt(hour / 2);
        var startTime5 = new Date(now);
        var endTime5 = new Date(now);
        startTime5.setHours(hour, 0, 0);
        endTime5.setHours(23, 55, 0);
        this.myhass.callWS({
            'type': 'recorder/statistics_during_period',
            'statistic_ids': [this.config.entity],
            "period": "5minute",
            "start_time": startTime5,
            "end_time": endTime5
        }).then(this.loaderResponse5.bind(this),
                this.loaderFailed.bind(this));
    }

}

customElements.define("temperature-heatmap-card", TemperatureHeatmapCard);
