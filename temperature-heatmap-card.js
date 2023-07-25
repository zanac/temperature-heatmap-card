const LitElement = Object.getPrototypeOf(customElements.get("ha-panel-lovelace"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

const style = css`
  ha-icon {
    --mdc-icon-size: 40px;
  }`

export default style;

class TemperatureHeatmapCard extends LitElement {
  hass_inited = false;
  // Whenever the state changes, a new `hass` object is set. Use this to
  // update your content.
  set hass(hass) {
    if (this.hass_inited === true) { return }
    this.myhass = hass;
    this.id = Math.random()
      .toString(36)
      .substr(2, 9);

    const entityId = this.config.entity;
    const state = hass.states[entityId];
    const stateStr = state ? state.state : "unavailable";
    if (!this.shiftDay) this.shiftDay = 0;
    this.get_recorder([entityId], 7);
    this.hass_inited = true;
  }

  static getConfigElement() {
    return document.createElement("temperature-heatmap-card-editor");
  }

  static get styles() {
    return style;
  }

  onClickLeft(ev, shiftDay) {
    ev.stopPropagation();
    this.shiftDay = this.shiftDay + shiftDay;
    const entityId = this.config.entity;
    this.get_recorder([entityId], 7);
  }
  onClickRight(ev, shiftDay) {
    this.shiftDay = this.shiftDay - shiftDay;
    const entityId = this.config.entity;
    this.get_recorder([entityId], 7);
    ev.stopPropagation();
  }
  onClickNumber(ev) {
    ev.stopPropagation();
    var e;
    e = new Event('hass-more-info', { composed: true });
    const entityId = this.config.entity;
    if (this.config.entity) e.detail = { entityId };
    this.dispatchEvent(e);
  }

  replaceText(posxy, text) {
    var theDiv = this.shadowRoot.getElementById(this.id+posxy);
    var theTD = this.shadowRoot.getElementById(this.id+"td"+posxy);
    if (theDiv) {
      theDiv.innerHTML = this.tempToLabel(Math.round(text));
      theTD.style.backgroundColor = "#"+this.tempToRGB(text);
    }
  }

  replaceDay(pos, text) {
    var theDiv = this.shadowRoot.getElementById(this.id+"DAY"+pos);
    if (theDiv) {
      theDiv.innerHTML = text;
    }
  }

  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this.config = config;
    this.hass_inited = false;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }

  tempToRGB(temp) {
    if (isNaN(Math.round(temp))) return "d1d1d1";
    if (temp == -999) return "d1d1d1";
    if (Math.round(temp) >= 37) return "ff006a";
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

  render({ config } = this) {
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
           if (this.DayNOW == this.Day6) grid7[6][this.hourIndex] = this.lastHour;
      }
    }
    
    this.replaceText("00", grid7[0][0]);
    this.replaceText("10", grid7[1][0]);
    this.replaceText("20", grid7[2][0]);
    this.replaceText("30", grid7[3][0]);
    this.replaceText("40", grid7[4][0]);
    this.replaceText("50", grid7[5][0]);
    this.replaceText("60", grid7[6][0]);
    this.replaceText("01", grid7[0][0]);
    this.replaceText("11", grid7[1][1]);
    this.replaceText("21", grid7[2][1]);
    this.replaceText("31", grid7[3][1]);
    this.replaceText("41", grid7[4][1]);
    this.replaceText("51", grid7[5][1]);
    this.replaceText("61", grid7[6][1]);
    this.replaceText("02", grid7[0][2]);
    this.replaceText("12", grid7[1][2]);
    this.replaceText("22", grid7[2][2]);
    this.replaceText("32", grid7[3][2]);
    this.replaceText("42", grid7[4][2]);
    this.replaceText("52", grid7[5][2]);
    this.replaceText("62", grid7[6][2]);
    this.replaceText("03", grid7[0][3]);
    this.replaceText("13", grid7[1][3]);
    this.replaceText("23", grid7[2][3]);
    this.replaceText("33", grid7[3][3]);
    this.replaceText("43", grid7[4][3]);
    this.replaceText("53", grid7[5][3]);
    this.replaceText("63", grid7[6][3]);
    this.replaceText("04", grid7[0][4]);
    this.replaceText("14", grid7[1][4]);
    this.replaceText("24", grid7[2][4]);
    this.replaceText("34", grid7[3][4]);
    this.replaceText("44", grid7[4][4]);
    this.replaceText("54", grid7[5][4]);
    this.replaceText("64", grid7[6][4]);
    this.replaceText("05", grid7[0][5]);
    this.replaceText("15", grid7[1][5]);
    this.replaceText("25", grid7[2][5]);
    this.replaceText("35", grid7[3][5]);
    this.replaceText("45", grid7[4][5]);
    this.replaceText("55", grid7[5][5]);
    this.replaceText("65", grid7[6][5]);
    this.replaceText("06", grid7[0][6]);
    this.replaceText("16", grid7[1][6]);
    this.replaceText("26", grid7[2][6]);
    this.replaceText("36", grid7[3][6]);
    this.replaceText("46", grid7[4][6]);
    this.replaceText("56", grid7[5][6]);
    this.replaceText("66", grid7[6][6]);
    this.replaceText("07", grid7[0][7]);
    this.replaceText("17", grid7[1][7]);
    this.replaceText("27", grid7[2][7]);
    this.replaceText("37", grid7[3][7]);
    this.replaceText("47", grid7[4][7]);
    this.replaceText("57", grid7[5][7]);
    this.replaceText("67", grid7[6][7]);
    this.replaceText("08", grid7[0][8]);
    this.replaceText("18", grid7[1][8]);
    this.replaceText("28", grid7[2][8]);
    this.replaceText("38", grid7[3][8]);
    this.replaceText("48", grid7[4][8]);
    this.replaceText("58", grid7[5][8]);
    this.replaceText("68", grid7[6][8]);
    this.replaceText("09", grid7[0][9]);
    this.replaceText("19", grid7[1][9]);
    this.replaceText("29", grid7[2][9]);
    this.replaceText("39", grid7[3][9]);
    this.replaceText("49", grid7[4][9]);
    this.replaceText("59", grid7[5][9]);
    this.replaceText("69", grid7[6][9]);
    this.replaceText("0a", grid7[0][10]);
    this.replaceText("1a", grid7[1][10]);
    this.replaceText("2a", grid7[2][10]);
    this.replaceText("3a", grid7[3][10]);
    this.replaceText("4a", grid7[4][10]);
    this.replaceText("5a", grid7[5][10]);
    this.replaceText("6a", grid7[6][10]);
    this.replaceText("0b", grid7[0][11]);
    this.replaceText("1b", grid7[1][11]);
    this.replaceText("2b", grid7[2][11]);
    this.replaceText("3b", grid7[3][11]);
    this.replaceText("4b", grid7[4][11]);
    this.replaceText("5b", grid7[5][11]);
    this.replaceText("6b", grid7[6][11]);
    this.replaceDay(0, this.Day0);
    this.replaceDay(1, this.Day1);
    this.replaceDay(2, this.Day2);
    this.replaceDay(3, this.Day3);
    this.replaceDay(4, this.Day4);
    this.replaceDay(5, this.Day5);
    this.replaceDay(6, this.Day6);
    var rightButton = this.shadowRoot.getElementById(this.id+"rightButton");
    var leftButton = this.shadowRoot.getElementById(this.id+"leftButton");
    if (rightButton) {
      if (this.DayNOW == this.Day6) { rightButton.style.visibility = "hidden"; }
      else { rightButton.style.visibility = "visible"; }

    }
    if (leftButton) {
      if (grid7[0][0] == -999 && grid7[0][11] == -999) { leftButton.style.visibility = "hidden"; }
      else { leftButton.style.visibility = "visible"; }
    }


    return html`
        <ha-card header="${this.config.title}" id="card">
            <div class="card-content">
                              <table @click=${e => this.onClickNumber(e)} cellspacing="0" cellpadding="0" style="margin: 0 auto;width:98%" >
      <thead>
          <tr>                    
              <td width="16%" ></td>
                  <td width="12%" style="white-space: nowrap;text-align:center;vertical-align:middle;"><div id="${this.id}DAY0">${this.Day0}</div></td>
                  <td width="12%" style="white-space: nowrap;text-align:center;vertical-align:middle;"><div id="${this.id}DAY1">${this.Day1}</div></td>
                  <td width="12%" style="white-space: nowrap;text-align:center;vertical-align:middle;"><div id="${this.id}DAY2">${this.Day2}</div></td>
                  <td width="12%" style="white-space: nowrap;text-align:center;vertical-align:middle;"><div id="${this.id}DAY3">${this.Day3}</div></td>
                  <td width="12%" style="white-space: nowrap;text-align:center;vertical-align:middle;"><div id="${this.id}DAY4">${this.Day4}</div></td>
                  <td width="12%" style="white-space: nowrap;text-align:center;vertical-align:middle;"><div id="${this.id}DAY5">${this.Day5}</div></td>
                  <td width="12%" style="white-space: nowrap;text-align:center;vertical-align:middle;"><div id="${this.id}DAY6">${this.Day6}</div></td>
          </tr>
      </thead>
      <tbody>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>00:00</td>
                          <td id="${this.id}td00" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}00"></div>
                          </td>
                          <td id="${this.id}td10" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}10"></div>
                          </td>
                          <td id="${this.id}td20" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}20"></div>
                          </td>
                          <td id="${this.id}td30" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}30"></div>
                          </td>
                          <td id="${this.id}td40" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}40"></div>
                          </td>
                          <td id="${this.id}td50" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}50"></div>
                          </td>
                          <td id="${this.id}td60" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}60"></div>
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>02:00</td>
                          <td id="${this.id}td01" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}01"></div>
                          </td>
                          <td id="${this.id}td11" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}11"></div>
                          </td>
                          <td id="${this.id}td21" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}21"></div>
                          </td>
                          <td id="${this.id}td31" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}31"></div>
                          </td>
                          <td id="${this.id}td41" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}41"></div>
                          </td>
                          <td id="${this.id}td51" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}51"></div>
                          </td>
                          <td id="${this.id}td61" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}61"></div>
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>04:00</td>
                          <td id="${this.id}td02" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}02"></div>
                          </td>
                          <td id="${this.id}td12" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}12"></div>
                          </td>
                          <td id="${this.id}td22" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}22"></div>
                          </td>
                          <td id="${this.id}td32" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}32"></div>
                          </td>
                          <td id="${this.id}td42" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}42"></div>
                          </td>
                          <td id="${this.id}td52" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}52"></div>
                          </td>
                          <td id="${this.id}td62" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}62"></div>
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>06:00</td>
                          <td id="${this.id}td03" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}03"></div>
                          </td>
                          <td id="${this.id}td13" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}13"></div>
                          </td>
                          <td id="${this.id}td23" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}23"></div>
                          </td>
                          <td id="${this.id}td33" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}33"></div>
                          </td>
                          <td id="${this.id}td43" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}43"></div>
                          </td>
                          <td id="${this.id}td53" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}53"></div>
                          </td>
                          <td id="${this.id}td63" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}63"></div>
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>08:00</td>
                          <td id="${this.id}td04" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}04"></div>
                          </td>
                          <td id="${this.id}td14" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}14"></div>
                          </td>
                          <td id="${this.id}td24" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}24"></div>
                          </td>
                          <td id="${this.id}td34" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}34"></div>
                          </td>
                          <td id="${this.id}td44" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}44"></div>
                          </td>
                          <td id="${this.id}td54" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}54"></div>
                          </td>
                          <td id="${this.id}td64" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}64"></div>
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>10:00</td>
                          <td id="${this.id}td05" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}05"></div>
                          </td>
                          <td id="${this.id}td15" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}15"></div>
                          </td>
                          <td id="${this.id}td25" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}25"></div>
                          </td>
                          <td id="${this.id}td35" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}35"></div>
                          </td>
                          <td id="${this.id}td45" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}45"></div>
                          </td>
                          <td id="${this.id}td55" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}55"></div>
                          </td>
                          <td id="${this.id}td65" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}65"></div>
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>12:00</td>
                          <td id="${this.id}td06" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}06"></div>
                          </td>
                          <td id="${this.id}td16" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}16"></div>
                          </td>
                          <td id="${this.id}td26" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}26"></div>
                          </td>
                          <td id="${this.id}td36" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}36"></div>
                          </td>
                          <td id="${this.id}td46" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}46"></div>
                          </td>
                          <td id="${this.id}td56" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}56"></div>
                          </td>
                          <td id="${this.id}td66" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}66"></div>
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>14:00</td>
                          <td id="${this.id}td07" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}07"></div>
                          </td>
                          <td id="${this.id}td17" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}17"></div>
                          </td>
                          <td id="${this.id}td27" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}27"></div>
                          </td>
                          <td id="${this.id}td37" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}37"></div>
                          </td>
                          <td id="${this.id}td47" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}47"></div>
                          </td>
                          <td id="${this.id}td57" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}57"></div>
                          </td>
                          <td id="${this.id}td67" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}67"></div>
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>16:00</td>
                          <td id="${this.id}td08" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}08"></div>
                          </td>
                          <td id="${this.id}td18" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}18"></div>
                          </td>
                          <td id="${this.id}td28" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}28"></div>
                          </td>
                          <td id="${this.id}td38" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}38"></div>
                          </td>
                          <td id="${this.id}td48" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}48"></div>
                          </td>
                          <td id="${this.id}td58" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}58"></div>
                          </td>
                          <td id="${this.id}td68" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}68"></div>
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>18:00</td>
                          <td id="${this.id}td09" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}09"></div>
                          </td>
                          <td id="${this.id}td19" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}19"></div>
                          </td>
                          <td id="${this.id}td29" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}29"></div>
                          </td>
                          <td id="${this.id}td39" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}39"></div>
                          </td>
                          <td id="${this.id}td49" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}49"></div>
                          </td>
                          <td id="${this.id}td59" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}59"></div>
                          </td>
                          <td id="${this.id}td69" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}69"></div>
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>20:00</td>
                          <td id="${this.id}td0a" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}0a"></div>
                          </td>
                          <td id="${this.id}td1a" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}1a"></div>
                          </td>
                          <td id="${this.id}td2a" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}2a"></div>
                          </td>
                          <td id="${this.id}td3a" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}3a"></div>
                          </td>
                          <td id="${this.id}td4a" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}4a"></div>
                          </td>
                          <td id="${this.id}td5a" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}5a"></div>
                          </td>
                          <td id="${this.id}td6a" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}6a"></div>
                          </td>
              </tr>
              <tr><td style='white-space: nowrap;text-align:center;vertical-align:middle;'>22:00</td>
                          <td id="${this.id}td0b" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}0b"></div>
                          </td>
                          <td id="${this.id}td1b" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}1b"></div>
                          </td>
                          <td id="${this.id}td2b" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}2b"></div>
                          </td>
                          <td id="${this.id}td3b" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}3b"></div>
                          </td>
                          <td id="${this.id}td4b" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}4b"></div>
                          </td>
                          <td id="${this.id}td5b" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}5b"></div>
                          </td>
                          <td id="${this.id}td6b" style="background-color:#d1d1d1;color:#ffffff;white-space: nowrap;text-align:center;vertical-align:middle;">
                              <div id="${this.id}6b"></div>
                          </td>
              </tr>
           </tbody>
        </table>
        <table cellspacing="0" cellpadding="0" style="margin: 0 auto;width:98%" >
           </tbody>
              <tr>
                   <td width="16%"></td>
                   <td width="10%" style="white-space:nowrap;">
		      <ha-icon style='color:#7d8db8;' id="${this.id}leftButton" icon='mdi:chevron-left-box-outline' @click=${e => this.onClickLeft(e, 1)}></ha-icon>
                   </td>
                   <td width="58%"></td>
                   <td width="10%" style="white-space:nowrap;">
		      <ha-icon style='color:#7d8db8;' id="${this.id}rightButton" icon='mdi:chevron-right-box-outline' @click=${e => this.onClickRight(e, 1)}></ha-icon>
                   </td>
                   <td width="6%"></td>
              </tr>
       </tbody>
  </table>
  </div>
  </ha-card>`;
    //<div style="height:50px;float:right;padding-right:30px;">
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
        this.render();
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
        var shiftDay = this.shiftDay;
        const now = new Date();
        this.grid_status = undefined;
        var startTime = new Date(now - ((days+shiftDay) * 86400000))
        startTime.setHours(0, 0, 0);
        var endTime = new Date(now - (shiftDay * 86400000))
        endTime.setHours(23, 59, 0);
        this.myhass.callWS({
            'type': 'recorder/statistics_during_period',
            'statistic_ids': [this.config.entity],
            "period": "hour",
            "start_time": startTime,
            "end_time": endTime
        }).then(this.loaderResponse.bind(this),
                this.loaderFailed.bind(this));
        
        startTime = new Date(now - ((days+shiftDay) * 86400000))
        var hour = startTime.getHours();
        this.DayNOW = new Date(now).getDate();
        this.Day6 = (new Date(now - ((0+shiftDay) * 86400000))).getDate();
        this.Day5 = (new Date(now - ((1+shiftDay) * 86400000))).getDate();
        this.Day4 = (new Date(now - ((2+shiftDay) * 86400000))).getDate();
        this.Day3 = (new Date(now - ((3+shiftDay) * 86400000))).getDate();
        this.Day2 = (new Date(now - ((4+shiftDay) * 86400000))).getDate();
        this.Day1 = (new Date(now - ((5+shiftDay) * 86400000))).getDate();
        this.Day0 = (new Date(now - ((6+shiftDay) * 86400000))).getDate();
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

class ContentCardEditor extends LitElement {
  async setConfig(config) {
        this._config = config;
  }

  set hass(hass) {
    this.myhass = hass;
  }
}

customElements.define("temperature-heatmap-card-editor", ContentCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "temperature-heatmap-card",
  name: "Temperature Heatmap Card",
  preview: false, // Optional - defaults to false
  description: "A cool temperature heatmap card!",
});
