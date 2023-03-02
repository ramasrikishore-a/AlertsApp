import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { SQLRequest, CosmosRequest } from './SQLRequest';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private http: HttpClient) { }

  public submitQuery(sqlreq: SQLRequest,url:string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = { headers: headers };
    var url = url + "Database/Executesql";
    return this.http.post(url, sqlreq, options).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('error in ' + err); return throwError(err.error.errorMessage);
      })
    );

  }

  public submitcsQuery(sqlreq: CosmosRequest, url: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = { headers: headers };
    var url = url + "Database/ExecuteCosmosQ";
    return this.http.post(url, sqlreq, options).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('error in ' + err); return throwError(err.error.errorMessage);
      })
    );

  }
}
