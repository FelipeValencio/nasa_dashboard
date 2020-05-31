import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HttpService {
  constructor(private httpClient: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'text/plain',
      'Accept': 'text/plain',
    }),
  };

  public sendGetRequest(): Observable<String> {
    return this.httpClient.get<String>(
      'http://localhost:3000/getAllData',
      this.httpOptions,
    );
  }
}