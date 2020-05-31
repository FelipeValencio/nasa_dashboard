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

  public series: any[];

  public options: any = {

      title: {
          text: 'Solar Employment Growth by Sector, 2010-2016'
      },
      subtitle: {
          text: 'Source: thesolarfoundation.com'
      },
      yAxis: {
          title: {
              text: 'Number of Employees'
          }
      },
      xAxis: {
          accessibility: {
              rangeDescription: 'Range: 2010 to 2017'
          }
      },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
      },

      plotOptions: {
          series: {
              label: {
                  connectorAllowed: false
              },
              pointStart: 2010
          }
      },

      series: [{
          name: 'Installation',
          data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
      }, {
          name: 'Manufacturing',
          data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
      }, {
          name: 'Sales & Distribution',
          data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
      }, {
          name: 'Project Development',
          data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
      }, {
          name: 'Other',
          data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
      }],

      responsive: {
          rules: [{
              condition: {
                  maxWidth: 500
              },
              chartOptions: {
                  legend: {
                      layout: 'horizontal',
                      align: 'center',
                      verticalAlign: 'bottom'
                  }
              }
          }]
      }
  }

  processData(res) {

    /* for(let r of res) {
      this.series.push({
        name: r.Country,
        data: null
      });
    } */
    this.buildChart(res);
  }

  buildChart(res) {

    console.log(res)

    this.options.series = res;

    Highcharts.chart('container', this.options);
  }

}
