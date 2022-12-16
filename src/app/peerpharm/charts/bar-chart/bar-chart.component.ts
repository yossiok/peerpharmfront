import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{}],
      yAxes: [
        {
          display: true,
          ticks: {
            suggestedMin: 0,
            beginAtZero: true,
          },
        },
      ],
    },
  };
  @Input() barChartLabels: Label[] = [];
  barChartType: ChartType = "bar";
  barChartLegend = true;
  barChartPlugins = [];
  @Input() barChartData: ChartDataSets[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
