import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { AlertsComponent } from './alerts/alerts.component';
import { CreateAlertsComponent } from './create-alerts/create-alerts.component'
import { FlyoutComponent } from './Flyout/flyout.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AgGridModule } from 'ag-grid-angular';
import { ViewAlertComponent } from './Viewalerts/view-alert.component';
import { QueryComponent } from './Query-Selector/query.component';
import { DataService } from './DataService';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    AlertsComponent,
    CreateAlertsComponent,
    FlyoutComponent,
    ViewAlertComponent,
    QueryComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    NgxJsonViewerModule,
    AgGridModule,
    
    RouterModule.forRoot([
      { path: '', component: AlertsComponent, pathMatch: 'full' },
      { path: 'counter', component: FetchDataComponent },
      { path: 'alerts', component: AlertsComponent },
      { path: 'createalert', component: CreateAlertsComponent }    ,
      { path:'viewalert',component:ViewAlertComponent}

    ])
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
