import { Component, Inject, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { SQLRequest, CosmosRequest } from '../SQLRequest';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DataService } from '../DataService';

interface Alert {
  Name: string,
  Condition: string,
  Frequency: string,
  ActionGroup: string,
  SelectSource: string,
  Request: string,
  Threshold: string
}

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  private heroservice: HeroService;
  public data: any = [{}];
  public sources: any;
  public selectedSource: any = "";
  public base_url: any;
  public resultCount: any = 0;
  public rowData$!: Observable<any[]>;
  public loading: any = false;
  public statusMessage: any = "";
  public showAlert: any = false;
  public alerts: any = [];

  constructor(heroService: HeroService, @Inject('BASE_URL') baseUrl: string, private router: Router, private dataservice: DataService) {
    this.heroservice = heroService;
    this.base_url = baseUrl;
  }

  public defaultColDef: ColDef = {
    sortable: true,
    filter: false,
  };

  onGridReady(event: any) {
    //this.rowData$ = this.hserice.submitQuery(this.sqlRequest, this.base_url);

  }

  onCellClicked(e: CellClickedEvent): void {
    console.log('cellClicked', e);
    this.dataservice.setSelectedAlert(e.data);
    this.router.navigate(['/viewalert'])
    //this.showAlert = true;
  }

  columnDefs: ColDef[] = [
    { field: "Name" },
    { field: "Condition" },
    { field: "Frequency" },
    { field: "ActionGroup" },
    { field: "SelectSource" },
    { field: "Request" },
    { field: "Threshold" }
  ];

  ngOnInit(): void {
    this.onGet();
  }

  createNewClicked() {
    this.router.navigate(['/createalert']);
  }

  buildAlerts(data: any) {
    for (var i = 0; i < data.length; i++) {
      // const alert: Alert = {
      //   Name: data[i].name,
      //   Condition: data[i].condition,
      //   Frequency: data[i].frequencyofEvaluation,
      //   ActionGroup: data[i].actiongroup,
      //   SelectSource: data[i].source,
      //   Request: data[i].request,
      //   Threshold: data[i].threshold
      // }

      const alert = {
        Name: data[i].name,
        Condition: data[i].condition,
        Frequency: data[i].frequencyofEvaluation,
        ActionGroup: data[i].actiongroup,
        SelectSource: data[i].source ? data[i].source : "",
        Request: data[i].request ?  data[i].request : "",
        Threshold: data[i].threshold ? data[i].threshold  : ""
      }
      this.alerts.push(alert);
    }    
  }

  onGet() {
    this.loading = true;
    // this.rowData$ = this.heroservice.GetAlerts({ "size": "10" }, this.base_url);
    this.statusMessage = "Processing";

    this.heroservice.GetAlerts({ "size": "10" }, this.base_url).subscribe(res => {
      if (res) {
        if (res.status == "success") {
          this.data = res.response;
          this.buildAlerts(this.data);
          this.resultCount = res.response.length;
        }
        else {
          this.statusMessage = res.message;
          this.data = [];
          this.resultCount = 0;
        }
      }
      this.loading = false;
    },
      err => {
        this.data = []
        this.loading = false;

      });
  }

}

