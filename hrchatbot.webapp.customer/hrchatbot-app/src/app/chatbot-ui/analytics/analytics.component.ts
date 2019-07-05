import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {RepositoryService} from "../../shared/repository.service";
import {AuthService} from "../../auth/auth.service";
import {MatTabChangeEvent} from "@angular/material";

@Component({
  selector: 'app-analytics',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  private barChartOptions = {
    // scaleDownVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          min: 0,
          beginAtZero: true
        }
      }],
      xAxes: [{
        barPercentage: 0.4
      }]
    }
  };
  private barChartOptionsIntent = {
    // scaleDownVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          min: 0,
          beginAtZero: true
        }
      }],
      xAxes: [{
        display: false //this will remove all the x-axis grid lines
      }]
    }
  };
  private barChartType = 'bar';
  private barChartLegend = false;

  private dailyCounter = [];
  private entityCounter = [];
  private entityList = [];
  private intentCounter = [];

  private barChartLabelsEntity = [];
  private barChartDataEntity = [
    {
      data: this.entityCounter,
      label: "Prepoznat ovaj entitet"
    }
  ];

  private barChartLabelsIntent = [];
  private barChartDataIntent = [
    {
      data: this.intentCounter,
      label: 'Broj upita'
    }
  ];

  private barChartLabels = [];
  private barChartData = [
    {
      data: this.dailyCounter,
      label: 'Broj upita'
    }
  ];

  private gotEntities = false;
  private gotIntents = false;

  constructor(
              private repo: RepositoryService
  ) {}

  ngOnInit() {
    this.generateDailyCount();
    // this.generateEntityCount();
    // this.generateIntentCount();
  }

  onLinkClick(event: MatTabChangeEvent) {
    if(event.index == 1 && !this.gotEntities) {
      this.generateEntityCount();
      this.getEntitiesList();
      this.gotEntities = true;
    }
    if(event.index == 2 && !this.gotIntents) {
      this.generateIntentCount();
      this.gotIntents = true;
    }

  }

  public async generateDailyCount() {

    let dailyCountObject = await this.repo.getDailyCounts();
    for (let i = 0; i < dailyCountObject['queries'].length; i++) {
      let date = JSON.stringify((dailyCountObject['queries'][i]['doc']));
      let fullData = `${date.substring(7,9)}.${date.substring(5,7)}.${date.substring(1,5)}.`;
      this.barChartLabels.push(fullData);
      this.dailyCounter.push((dailyCountObject['queries'][i]['count']));
    }
  }

  public async generateEntityCount() {
    let dailyCountObject = await this.repo.getEntityCounts();
    for (let i = 0; i < dailyCountObject['queries'].length; i++) {
      this.barChartLabelsEntity.push(dailyCountObject['queries'][i]['entity']);
      this.entityCounter.push(dailyCountObject['queries'][i]['count']);
    }
  }

  public async generateIntentCount() {
    let dailyCountObject = await this.repo.getIntentCounts();
    for (let i = 0; i < dailyCountObject['queries'].length; i++) {
      this.barChartLabelsIntent.push(dailyCountObject['queries'][i]['intent']);
      this.intentCounter.push(dailyCountObject['queries'][i]['count']);
    }
  }

  public async getEntitiesList() {
    let entityList = await this.repo.getEntityList();
    for(let i=0; i < entityList['queries']; i++) {
      this.entityList.push(entityList['queries'][i]['entity']);
    }
  }

}
