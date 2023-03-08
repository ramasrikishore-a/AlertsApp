import { Component, Inject, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { SQLRequest, CosmosRequest } from '../SQLRequest';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-create-alerts',
  templateUrl: './create-alerts.component.html',
  styleUrls: ['./create-alerts.component.css']
})
export class CreateAlertsComponent implements OnInit {

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


  ngOnInit(): void {
    this.sources = ["Sql", "Cosmos Db"];
  }
  sqlRequest: SQLRequest = {
    connectionString: "data source=Kishore; database=DBConnector; User ID=newuser; Password=Admin@123",
    querystring: "select * from employees where salary < 90000"
  }
  cosmosRequest: CosmosRequest = {
    accountEndPoint: "AccountEndpoint=https://kishoredb.documents.azure.com:443/;AccountKey=ZDn6rp3P54gyZBdHrMpmkEsjv6HKfw4zCOcU2upXy5FgbcWvK0bcUAYzn1K0PpPNNJDfoCtVdOtsACDbIK0c6w==;",
    querystring: "SELECT * FROM employees e where e.salary > 90000",
    database: "SampleDB",
    container: "Employee"
  }

  columnDefs: ColDef[] = [
    //{ field: 'make' },
    //{ field: 'model' },
    //{ field: 'price' }
  ];

  onGet() {
    this.loading = true;
    this.rowData$ = this.hserice.submitQuery(this.sqlRequest, this.base_url);
    this.statusMessage = "Processing";

    this.hserice.submitQuery(this.sqlRequest, this.base_url).subscribe(res => {
      if (res) {
        if (res.status == "success") {
          this.data = res.response;
          this.resultCount = res.response.length;
          var keys = Object.keys(this.data[0]);
          this.columnDefs = [{}];
          for (let i = 0; i < keys.length; i++) {
            this.columnDefs.push({ field: keys[i] })
          }
          this.statusMessage = "Success";
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

  onGridReady(event: any) {
    //this.rowData$ = this.hserice.submitQuery(this.sqlRequest, this.base_url);

  }

  onCsSubmit() {
    this.loading = true;
    this.data = [];
    this.columnDefs.length = 0;
    this.statusMessage = "Processing";
    this.hserice.submitcsQuery(this.cosmosRequest, this.base_url).subscribe(res => {
      if (res) {
        if (res.status == "success") {
          this.data = JSON.parse(res.response);
          this.resultCount = JSON.parse(res.response).length;
          var keys = Object.keys(this.data[0]);
          this.columnDefs = [{}];
          for (let i = 0; i < keys.length; i++) {
            this.columnDefs.push({ field: keys[i] })
          }
          this.statusMessage = "Success";

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
        this.data = [{}]
        this.loading = false;

      });
  }

  clear() {

  }
  savealert() {
    var alertSaveObject = {
      "id": "",
      "name": this.alertName,
      "frequencyofEvaluation": this.freqofeval,
      "condition": this.condition,
      "actiongroup": this.actiongroup,
      "source": this.selectedSource,
      "request": this.selectedSource == 'sql' ? JSON.stringify(this.sqlRequest) : JSON.stringify(this.cosmosRequest),
      "user": "kishore"
    }
    this.loading = true;
    var response = this.hserice.SaveAlert(alertSaveObject, this.base_url).subscribe(res => {
      if (res) {
        if (res.status == "success") {
          console.log(res.data);
        }
        else {
          this.statusMessage = res.message;

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
