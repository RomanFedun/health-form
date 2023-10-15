import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Condition } from '../intefaces/condition';

@Injectable({
  providedIn: 'root'
})
export class ConditionsService {

  constructor(
    private http: HttpClient,
  ) { }

  getConditions(url: string, params: any): Observable<any> {
    return this.http.get<Condition[]>(url, {
      params: params
    })
  }

  setGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
}
