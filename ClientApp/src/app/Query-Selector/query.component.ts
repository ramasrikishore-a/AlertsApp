import { Component, Inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HeroService } from '../hero.service';
import { SQLRequest, CosmosRequest } from '../SQLRequest';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent, RowClickedEvent } from 'ag-grid-community';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DataService } from '../DataService';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {
  @Input() source: string="";
  @Input() request: string="";
  @Output() updateRequest = new EventEmitter<number>();

  private hserice: HeroService;
  public data: any = [{}];
  public sources: any = ["Sql", "Cosmos Db"];
  public selectedSource: any = "";
  public base_url: any;
  public resultCount: any = 0;
  public rowData$!: Observable<any[]>;
  public loading: any = false;
  public statusMessage: any = "";
  public selectedRequest: any = {};

  public isOpen = false;

  constructor(heroService: HeroService, @Inject('BASE_URL') baseUrl: string, public router: Router, private dataService: DataService) {
    this.hserice = heroService;
    this.base_url = baseUrl;
  }

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };


  ngOnInit(): void {
    this.selectedSource = this.source;
    this.selectedRequest = JSON.parse(this.request);
    if (this.selectedSource == 'sql') {
      this.sqlRequest.connectionString = this.selectedRequest.connectionString;
      this.sqlRequest.querystring = this.selectedRequest.querystring;
    }
    else if (this.selectedSource == 'coCosmos Db') {
      this.cosmosRequest.accountEndPoint = this.selectedRequest.accountEndPoint;
      this.cosmosRequest.querystring = this.selectedRequest.querystring;
      this.cosmosRequest.database = this.selectedRequest.database;
      this.cosmosRequest.container = this.selectedRequest.container;
    }

  }
  sqlRequest: SQLRequest = {
    connectionString: "data source=Kishore; database=DBConnector; User ID=newuser; Password=Kishore@08",
    querystring: "select * from employees where salary < 90000"
  }
  cosmosRequest: CosmosRequest = {
    accountEndPoint: "AccountEndpoint=https://kishoredb.documents.azure.com:443/;AccountKey=ZDn6rp3P54gyZBdHrMpmkEsjv6HKfw4zCOcU2upXy5FgbcWvK0bcUAYzn1K0PpPNNJDfoCtVdOtsACDbIK0c6w==;",
    querystring: "SELECT * FROM employees e where e.salary > 90000",
    database: "SampleDB",
    container: "Employee"
  }

  columnDefs: ColDef[] = [];
  onGridReady(event: any) {
    console.log(event.data);
  }

  updateGrid(data: any) {
    var keys = Object.keys(data);
    this.columnDefs = [];
    for (let i = 0; i < keys.length; i++) {
      this.columnDefs.push({ field: keys[i] })
    }
  }

  onSubmit() {
    this.updateRequest.emit(this.selectedRequest);
    this.loading = true;
    this.data = [];
    this.columnDefs.length = 0;
    this.statusMessage = "Processing";
    var url = this.selectedSource == 'sql' ? this.base_url + 'Database/Executesql' : this.base_url + 'Database/ExecuteCosmosQ'
    this.hserice.PostQuery(this.request, url).subscribe({
      next: (res => {
        if (res) {
          if (res.status == "success") {
            if (this.selectedSource == 'sql') {
              this.data = res.response;
              this.resultCount = res.response.length;
            }
            else if (this.selectedSource == 'cosmos Db') {
              this.data = JSON.parse(res.response);
              this.resultCount = JSON.parse(res.response).length;
            }
            this.updateGrid(this.data[0]);
            this.statusMessage = "Success";
          }
          else {
            this.statusMessage = res.message;
            this.data = [];
            this.resultCount = 0;
          }
        }
        this.loading = false;
      }
      ),
      error: (err => {
        this.data = [{}]
        this.loading = false;
      }),
      complete: () => console.info('complete')
    })
  }
  toggleFlyout() {
    this.isOpen = !this.isOpen;
  }

  clear() {
  }

}
