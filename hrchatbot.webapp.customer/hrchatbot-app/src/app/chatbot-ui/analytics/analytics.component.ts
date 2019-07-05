import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {RepositoryService} from "../../shared/repository.service";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-analytics',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  constructor(
              private repo: RepositoryService,
              private auth: AuthService) {}

  ngOnInit() {
    this.generateDailyCount();

  }

  public async generateDailyCount() {

    let dailyCountObject = await this.repo.getDailyCounts();

    console.log(dailyCountObject['queries']);
  }


}
