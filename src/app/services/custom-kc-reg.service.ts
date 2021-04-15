import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import myAppConfig from '../config/my-app-config';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class CustomKcRegService {

  returnUrl: string = '/register/callback';

  constructor(private httpClient: HttpClient,
    private router: Router,) { }

  register(newUser: User) {
   
    let tokenUrl: string = myAppConfig.kc.authServerUrl + 'realms/' + myAppConfig.kc.realm + '/protocol/openid-connect/token';
    let headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'});
    let params = new URLSearchParams();   
    params.append('grant_type','client_credentials');
    params.append('client_id', myAppConfig.kc.regClientId);
    params.append('client_secret', myAppConfig.kc.regClientSecret);

    this.httpClient.post(tokenUrl, params.toString(), { headers: headers })
    .subscribe(
      data => this.postData(data, newUser),
      err => alert('Invalid Credentials')
    );

  }

  postData(data, newUser: User) {

    let userRegUrl: string = myAppConfig.kc.authServerUrl + 'admin/realms/' + myAppConfig.kc.realm + '/users';
    let headers = new HttpHeaders({'Content-type': 'application/json', 'Authorization': 'Bearer ' + data.access_token});
    let enabled: string = newUser.enabled? 'true' : 'false';
    
    this.httpClient.post(
      userRegUrl
      , '{"firstName":"' + newUser.firstName
      + '","lastName":"' + newUser.lastName
      + '", "email":"' + newUser.email
      + '", "attributes": {"country":"' + newUser.address.country
      + '", "state":"' + newUser.address.state
      + '", "city":"' + newUser.address.city
      + '", "street":"' + newUser.address.street
      + '", "zipCode":"' + newUser.address.zipCode
      + '"}, "enabled":"' + enabled
      + '", "username":"' + newUser.username 
      + '", "credentials":[{"type": "password","value": "' + newUser.password 
      + '","temporary": false}]}'
      , { headers: headers }
    ).subscribe(
      data => {
        alert('New User Registered');
        this.router.navigate([this.returnUrl]);
      },
      err => alert('User exists with same username and/or email.')
    );

  }

}
