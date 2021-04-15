import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import myAppConfig from '../config/my-app-config';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomKcAuthService implements OnInit, OnDestroy {

  subscription: Subscription;
  intervalId: number;
  //window.location.href = myAppConfig.kc.redirectUri;
  // http://localhost:8083/auth/realms/myservice/.well-known/openid-configuration
  private readonly openidConnectUrl: string = myAppConfig.kc.authServerUrl + 'realms/' + myAppConfig.kc.realm + '/protocol/openid-connect/';
  private readonly tokenUrl: string = this.openidConnectUrl + 'token';
  private readonly userInfoUrl: string = this.openidConnectUrl + 'userinfo';
  private readonly logoutUrl: string = this.openidConnectUrl + 'logout'; // doesn't work

  private loggedIn: BehaviorSubject<boolean>;


  getLoggedInValue(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
  setLoggedInValue(newValue: boolean): void {
    this.loggedIn.next(newValue);
  }

  constructor(private httpClient: HttpClient,
    private cookieService: CookieService) { 
      this.loggedIn = new BehaviorSubject<boolean>(false); 
    }

  ngOnInit() {

    //this.loggedIn = new BehaviorSubject<boolean>(false);
    this.periodicallyCheckCredentials();

  }

  ngOnDestroy() {

    this.unsubscribeCheckCredentials()

  }

  periodicallyCheckCredentials() {

    if (this.isLoggedIn()) {
      const source = interval(500000);
      this.subscription = source.subscribe(val => this.isLoggedIn());
    } else
      this.unsubscribeCheckCredentials();

  }

  unsubscribeCheckCredentials() {

    this.subscription && this.subscription.unsubscribe();

  }

  isLoggedIn(): boolean {

    let result: boolean = false;
    if (this.cookieService.check(myAppConfig.kc.accessTokenCookieName))
      this.setLoggedInValue(true);
    else if (this.cookieService.check(myAppConfig.kc.refreshTokenCookieName)) {
      console.log('no access, but refresh')
      //result = this.refreshLogin();
      this.setLoggedInValue(this.refreshLogin());
      this.setLoggedInValue(true);
    } else {
      //result = false;
      this.setLoggedInValue(false);
      this.unsubscribeCheckCredentials();
    }

    return result;

  }

  public login(userName: string, password: string): boolean {

    let result: boolean = false;
    let params = new URLSearchParams();
    params.append('client_id', myAppConfig.kc.clientId);
    params.append('username', userName);
    params.append('password', password);
    params.append('grant_type', 'password');

    let headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded; charset=utf-8' });

    this.httpClient.post(this.tokenUrl, params.toString(), { headers: headers })
      .subscribe(
        data => {
          this.saveToken(data);
          this.periodicallyCheckCredentials();
          result = true;
        }, err => {
          result = false;
          alert ('Invalid Credentials!')
        }
      );
    
    return result;

  }

  refreshLogin(): boolean {

    let result: boolean = false;
    let params = new URLSearchParams();
    params.append('client_id', myAppConfig.kc.clientId);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', this.cookieService.get(myAppConfig.kc.refreshTokenCookieName));

    let headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded; charset=utf-8' });

    this.httpClient.post(this.tokenUrl, params.toString(), { headers: headers })
      .subscribe(
        data => {
          this.saveToken(data);
          result = true;
        }, err =>
        result = false

      );
    return result;

  }

  saveToken(token) {

    let expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + token.expires_in);
    let refreshExpireDate = new Date();
    refreshExpireDate.setTime(refreshExpireDate.getTime() + token.refresh_expires_in);
    // ng2-cookies: CommonJS or AMD dependencies can cause optimization bailouts.
    // For more info see: https://angular.io/guide/build#configuring-commonjs-dependencies
    // removed 'import { Cookie } from 'ng2-cookies';' and 'Cookie.set' and 'Cookie.get'
    // removed ng2-cookies in favour of ngx-cookie and later ngx-cookie-service.
    //Cookie.set(myAppConfig.kc.accessTokenCookieName, token.access_token, (token.expires_in - 2) / (24*60*60));
    //this.cookieService.put(myAppConfig.kc.accessTokenCookieName, token.access_token);
    this.cookieService.set(myAppConfig.kc.accessTokenCookieName, token.access_token, (token.expires_in - 2) / (24 * 60 * 60), '/');

    //Cookie.set(myAppConfig.kc.refreshTokenCookieName, token.refresh_token, (token.refresh_expires_in - 2) / (24*60*60));
    //this.cookieService.put(myAppConfig.kc.refreshTokenCookieName, token.refresh_token);
    this.cookieService.set(myAppConfig.kc.refreshTokenCookieName, token.refresh_token, (token.refresh_expires_in - 2) / (24 * 60 * 60), '/');

    /*
    console.log('Obtained Access token');
    console.log("access: " + token.access_token);
    console.log("refresh: " + token.refresh_token);
    console.log("expires: " + token.expires_in);
    */
    
  }

  getUserProfile() {

    let headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded; charset=utf-8', 'Authorization': 'Bearer ' + this.cookieService.get(myAppConfig.kc.accessTokenCookieName) });

    this.httpClient.get(this.userInfoUrl, { headers: headers })
      .subscribe(
        data => console.log(data),
        err => alert('Invalid Credentials')
      );

  }

  logout() {

    this.cookieService.delete(myAppConfig.kc.accessTokenCookieName);
    this.cookieService.delete(myAppConfig.kc.refreshTokenCookieName);

    /* 
    let params = new URLSearchParams();
    params.append('client_id', myAppConfig.kc.regClientId);
    params.append('refresh_token', this.cookieService.get(myAppConfig.kc.refreshTokenCookieName));

    if (this.isLoggedIn()) {

      let headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + this.cookieService.get(myAppConfig.kc.accessTokenCookieName) });
      this.httpClient.post(this.logoutUrl, params.toString(), { headers: headers })
        .subscribe(
          data => alert('Logged out'),
          err => alert('Invalid Credentials')
        );

    } else
      alert('Not logged in')
    */

  }

}
