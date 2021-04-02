import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cookie } from 'ng2-cookies';
import myAppConfig from '../config/my-app-config';

@Injectable({
  providedIn: 'root'
})
export class ProtectedInfoService {

  constructor(private _http: HttpClient) { }

  public getResource() {
    var headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8', 'Authorization': 'Bearer '+ Cookie.get(myAppConfig.kc.accessTokenCookieName)});
    return this._http.get<Info>("http://localhost:8081/resource-server/api/foos/1", { headers: headers })
    .subscribe(
      data => console.log('Info id: ' + data.id + ' name: ' + data.name),
      error => console.log('Error'));
  } 
}

class Info {
  constructor(
      public id: number,
      public name: string) { }
}
