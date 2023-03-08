import { Component, Inject, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { SQLRequest, CosmosRequest } from '../SQLRequest';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  private hserice: HeroService;
  public data: any = [{}];
  public sources: any;
  public selectedSource: any = "";
  public base_url: any;
  public resultCount: any = 0;
  public rowData$!: Observable<any[]>;
  public loading: any = false;
  public statusMessage: any = "";
  public alertName = "";
  public threshold = "";
  public freqofeval = "";
  public condition = "";
  public actiongroup = "";



  constructor(heroService: HeroService, @Inject('BASE_URL') baseUrl: string) {
    this.hserice = heroService;
    this.base_url = baseUrl;
  }

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };
  onGridReady(event: any) {
    //this.rowData$ = this.hserice.submitQuery(this.sqlRequest, this.base_url);

  }

  columnDefs: ColDef[] = [
    //{ field: 'make' },
    //{ field: 'model' },
    //{ field: 'price' }
  ];

  ngOnInit(): void {
    this.sources = ["Sql", "Cosmos Db"];
    this.data = [{
      "id": "",
      "name": "alert 1",
      "frequencyofEvaluation": "4",
      "condition": "productprice > 10",
      "actiongroup": "manoj@gmail.com",
      "source": "sql",
     // "request": this.selectedSource == 'sql' ? JSON.stringify(this.sqlRequest) : JSON.stringify(this.cosmosRequest),
      "user": "kishore"
    }, {
        "id": "",
        "name": "alert 2",
        "frequencyofEvaluation": "3",
        "condition": "productprice < 10",
        "actiongroup": "kishore@gmail.com",
        "source": "cosmosdb",
    //    "request": this.selectedSource == 'sql' ? JSON.stringify(this.sqlRequest) : JSON.stringify(this.cosmosRequest),
        "user": "kishore"
      }, {
      "id": "",
      "name": "alert 4",
      "frequencyofEvaluation": "3",
      "condition": "productprice < 10",
      "actiongroup": "kishore@gmail.com",
      "source": "cosmosdb",
      //    "request": this.selectedSource == 'sql' ? JSON.stringify(this.sqlRequest) : JSON.stringify(this.cosmosRequest),
      "user": "kishore"
      }]
  }
 
}

