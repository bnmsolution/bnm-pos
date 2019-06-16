import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable()
export class HttpService {
  private baseUrl = environment.posApiUrl;

  constructor(private http: HttpClient) {
  }

  get options() {
    return {
      headers: new HttpHeaders().set(
        'Authorization', `Bearer ${localStorage.getItem('access_token')}`
      )
    };
  }

  public get(url: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${url}`, this.options)
      .pipe(
        catchError(this.handleError)
      );
  }

  public post(url: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${url}`, data, this.options)
      .pipe(
        catchError(this.handleError)
      );
  }

  public put(url: string, data: any, id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${url}`, data, this.options)
      .pipe(
        catchError(this.handleError)
      );
  }

  public delete(url: string, id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${url}/${id}`, this.options)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body: any = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
