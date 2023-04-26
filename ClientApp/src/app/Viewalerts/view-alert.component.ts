import { Component, Inject, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { SQLRequest, CosmosRequest } from '../SQLRequest';
import { AgGridAngular } from 'ag-grid-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CellClickedEvent, ColDef, GridReadyEvent, RowClickedEvent } from 'ag-grid-community';
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
  Request : string,
  Threshold : string
}

@Component({
  selector: 'app-view-alert',
  templateUrl: './view-alert.component.html',
  styleUrls: ['./view-alert.component.css']
})
export class ViewAlertComponent implements OnInit {


  public data: any = [{}];
  public base_url: any;
  public loading: any = false;
  public rowData$!: Observable<any[]>;
  public request: any = "";
  public hService: any;
  public statusMessage: string = "";
  public currentAlert: Alert = {
    Name: '',
    Condition: '',
    Frequency: '',
    ActionGroup: '',
    SelectSource: '',
    Request: '',
    Threshold: ''
  };

  constructor(@Inject('BASE_URL') baseUrl: string, public router: Router, private dataservice: DataService, public heroService: HeroService) {
    this.base_url = baseUrl;
    this.hService = heroService;
  }

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  onUpdateRequest(data:any): void {
    this.currentAlert.Request = JSON.stringify(data);
  }

  ngOnInit(): void {
    this.currentAlert = this.dataservice.getSelectedAlert();
  }

  clear() {

  }
  savealert() {
    var alertSaveObject = {
      "id": "",
      "name": this.currentAlert.Name,
      "frequencyofEvaluation": this.currentAlert.Frequency,
      "condition": this.currentAlert.Condition,
      "actiongroup": this.currentAlert.ActionGroup,
      "source": this.currentAlert.SelectSource,
      "request": this.currentAlert.Request,
      "user": "kishore",
      "threshold": this.currentAlert.Threshold
    }
    this.loading = true;

    var response = this.hService.SaveAlert(alertSaveObject, this.base_url).subscribe(
      {
        next:((res:any) => {
          if (res) {
            if (res.status == "success") {
              this.router.navigate(['/alerts']);
              console.log(res.data);
            }
            else {
              this.statusMessage = res.message;
            }
          }
          this.loading = false;
        }),
        error:((err:any) => {
          this.data = []
          this.loading = false;
  
        })
      })
  
    }
}
