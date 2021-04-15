import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import myAppConfig from '../config/my-app-config';
import { CustomKcAuthService } from './custom-kc-auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProtectedInfoService {

  constructor(private httpClient: HttpClient,
    private cookieService: CookieService,
    private readonly customKcAuth: CustomKcAuthService
  ) { }

  public getResource() {

    console.log(this.customKcAuth.isLoggedIn());
    let headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8', 'Authorization': 'Bearer '+ this.cookieService.get(myAppConfig.kc.accessTokenCookieName)});
    return this.httpClient.get<Info>("http://localhost:8081/resource-server/api/foos/1", { headers: headers })
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
