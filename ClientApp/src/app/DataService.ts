import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private sharedData: string = '';
  private selectedAlert : any;

  constructor() { }

  setSharedData(data: string) {
    this.sharedData = data;
  }

  getSharedData(): string {
    return this.sharedData;
  }

  setSelectedAlert(data:any){
    this.selectedAlert = data;
  }

  getSelectedAlert():any {
    return this.selectedAlert;
  }

}
