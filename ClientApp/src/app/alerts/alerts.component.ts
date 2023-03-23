import { Component, Inject, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { SQLRequest, CosmosRequest } from '../SQLRequest';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

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

  constructor(heroService: HeroService, @Inject('BASE_URL') baseUrl: string, private router: Router) {
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

  columnDefs: ColDef[] = [
    { field: "alertname" },
    { field: "id" },
    { field: "source" }
  ];

  ngOnInit(): void {  
   this.onGet();
  }

  createNewClicked() {
    this.router.navigate(['/createalert']);
  }

  onGet() {
    this.loading = true;
   // this.rowData$ = this.heroservice.GetAlerts({ "size": "10" }, this.base_url);
    this.statusMessage = "Processing";

    this.heroservice.GetAlerts({ "size": "10" }, this.base_url).subscribe(res => {
      if (res) {
        if (res.status == "success") {
          this.data = res.response;
          this.resultCount = res.response.length;
          var keys = Object.keys(this.data[0]);
          this.columnDefs = [];
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

}

