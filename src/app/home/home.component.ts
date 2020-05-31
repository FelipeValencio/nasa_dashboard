import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http/http.service';
import * as Highcharts from 'highcharts';
import { Data } from '../entity/data';

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

  constructor(
    private httpService: HttpService,
  ) { }

  ngOnInit() {
    this.httpService.sendGetRequest().subscribe(res => this.processData(res));
  }

  public options: any = {

    chart: {
      type: 'line'
    },
    title: {
      text: 'Monthly Average Temperature'
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: 'Contaminado sla'
      }
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true
        },
        enableMouseTracking: false
      }
    },
    series: [],
  }

  processData(res) {

    let data = [];

    for(let r of res) {
      r.confirmed = r.confirmed.map(Number);
      data.push({
        name: r.country,
        data: r.confirmed
      });
    }
    

    this.buildChart(data, res[0].dates);
  }

  buildChart(data, dates) {

    this.options.xAxis.categories = dates;
    this.options.series = data;

    console.log(data)

    Highcharts.chart('container', this.options);
  }

}
