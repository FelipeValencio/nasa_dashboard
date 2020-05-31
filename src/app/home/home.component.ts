import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../http/http.service';
import * as Highcharts from 'highcharts';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  private originalData: any;

  public countries = ["Canada", "France", "Germany", "Italy", "Japan", "United Kingdom", "United States"];

  public selectedTopics: string[] = ["1"]

  constructor(
    private httpService: HttpService,
  ) { }

  ngOnInit() {

    this.httpService.sendGetRequest().subscribe(res => {

      this.originalData = res;

      for (let r of this.originalData) r.dates = this.processDateTime(r.dates);

      this.processData()
      this.processDataGeneral(1);

    });
  }

  processData() {

    let i = 0;

    for (let r of this.originalData) {

      let dataArray = this.getWhatData(r);

      this.buildIndividualChart(dataArray, i);

      i++;
    }

  }

  handleTopics(value) {

    this.processDataGeneral(value)

    if (this.selectedTopics.includes(`${value}`))
      this.selectedTopics.splice(this.selectedTopics.indexOf(`${value}`), 1);
    else
      this.selectedTopics.push(`${value}`);

    this.processData();
    
  }

  getWhatData(r) {

    let list = [];

    if (this.selectedTopics.includes("1")){

      var dummy = this.divideDummy(r.confirmed)

      list.push({ name: "confirmed", data: dummy, color: "#0ed9ee" });

    }
    if (this.selectedTopics.includes("2")){

      var dummy = this.divideDummy(r.confirmedChange)

      list.push({ name: "confirmedChange", data: dummy, color: "#139ea7" });

    }
    if (this.selectedTopics.includes("3")){

      var dummy = this.divideDummy(r.deaths)

      list.push({ name: "deaths", data: dummy, color: "#d95045" });

    }
    if (this.selectedTopics.includes("4"))
      list.push({ name: "deathsChange", data: r.deathsChange.map(Number), color: "#8c380e" });
    if (this.selectedTopics.includes("5"))
      list.push({ name: "recovered", data: r.recovered.map(Number), color: "#0d0f88" });
    if (this.selectedTopics.includes("6"))
      list.push({ name: "recoveredChange", data: r.recoveredChange.map(Number), color: "#8687f1" });
    if (this.selectedTopics.includes("7"))
      list.push({ name: "retail", data: r.retail.map(Number), color: "#d75efa" });
    if (this.selectedTopics.includes("8"))
      list.push({ name: "grocery", data: r.grocery.map(Number), color: "#e71165" });
    if (this.selectedTopics.includes("9"))
      list.push({ name: "parks", data: r.parks.map(Number), color: "#dae711" });
    if (this.selectedTopics.includes("10"))
      list.push({ name: "station", data: r.station.map(Number), color: "#dae711" });
    if (this.selectedTopics.includes("11"))
      list.push({ name: "workplaces", data: r.workplaces.map(Number), color: "#d99011" });
    if (this.selectedTopics.includes("12"))
      list.push({ name: "residential", data: r.residential.map(Number), color: "#e64adf" });

    return list;
  }

  processDateTime(date: any[]) {

    let newDate: string[] = [];

    for (let d of date) {

      let dummy = new Date(d);

      newDate.push(`${this.getMonthText(dummy.getMonth())} ${dummy.getDate()}`)

    }

    return newDate;

  }

  getMonthText(month: number) {

    switch (month) {
      case 1: return "Feb"
      case 2: return "Mar"
      case 3: return "Apr"
      case 4: return "May"
    }

  }

  buildIndividualChart(countryData: any[], i) {

    var optionLocal: Highcharts.Options = {
      chart: {
        type: 'line',
      },
      subtitle: {
        text: `Number of ${countryData[0].name}`
      },
      title: {
        text: this.countries[i]
      },
      xAxis: {
        categories: this.originalData[0].dates
      },
      yAxis: {
        title: {
          text: countryData[0].name
        }
      },
      series: countryData,
    };

    Highcharts.chart(this.countries[i], optionLocal);

  }

  processDataGeneral(value) {
    let data = [];

    for(let r of this.originalData) {

      r.confirmed = r.confirmed.map(Number);

      data.push({

        name: r.country,

        data: this.getWhatDataGeneral(value, r)

      });

    }
    
    this.buildGeneralChart(data);
  }
  

  getWhatDataGeneral(value, r) {
    console.log(value)
    switch(value) {
      case 1:
        return this.divideDummy(r.confirmed);
      case 2:
        return this.divideDummy(r.confirmedChange);
      case 3:
        return this.divideDummy(r.deaths);
      case 4:
        return r.deathsChange.map(Number);
      case 5:
        return r.recovered.map(Number);
      case 6:
        return r.recoveredChange.map(Number);
      case 7:
        return r.retail.map(Number);
      case 8:
        return r.grocery.map(Number);
      case 9:
        return r.parks.map(Number);
      case 10:
        return r.station.map(Number);
      case 11:
        return r.workplaces.map(Number);
      case 12:
        return r.residential.map(Number);
    }
     
  }

  buildGeneralChart(d) {

    var optionLocal: Highcharts.Options = {
      chart: {
        type: 'line'
      },
      title: {
        text: 'G7'
      },
      subtitle: {
        text: "Canada, France, Germany, Italy, Japan, United Kingdom, United States"
      },
      xAxis: {
        categories: this.originalData[0].dates,
        ordinal: true,
      },
      series: d,
    };

    Highcharts.chart('container', optionLocal);

  }

  divideDummy(data: any[]) {
    var dummy = data.map(Number);

    if(this.selectedTopics.includes("7") || this.selectedTopics.includes("8") || this.selectedTopics.includes("10")){
      dummy = dummy.map(function(element) {

        return element/100;

      });
    }

    return dummy
  }

}