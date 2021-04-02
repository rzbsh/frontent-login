import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cookie } from 'ng2-cookies';
import myAppConfig from '../config/my-app-config';

@Injectable({
  providedIn: 'root'
})
export class CustomKcAuthService {

  private readonly tokenUrl: string = myAppConfig.kc.authServerUrl + 'realms/' + myAppConfig.kc.realm + '/protocol/openid-connect/token';

  constructor(private _http: HttpClient) { }

  isLoggedIn(): boolean {
    if (Cookie.get(myAppConfig.kc.accessTokenCookieName))
      return true;
    else if (Cookie.get(myAppConfig.kc.refreshTokenCookieName)) {
      console.log('no access, but refresh')   
      this.refreshLogin()
      return true;
    } else
      return false;
  }
  
  public async login(userName: string, password: string) {
    let params = new URLSearchParams();   
    params.append('client_id', myAppConfig.kc.clientId);
    params.append('username', userName);
    params.append('password', password);
    params.append('grant_type','password');

    let headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'});

    this._http.post(this.tokenUrl, params.toString(), { headers: headers })
    .subscribe(
      data => this.saveToken(data),
      err => alert('Invalid Credentials')
    );
  }

  refreshLogin() {
    let params = new URLSearchParams();   
    params.append('client_id', myAppConfig.kc.clientId);
    params.append('grant_type','refresh_token');
    params.append('refresh_token', Cookie.get(myAppConfig.kc.refreshTokenCookieName));

    let headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'});

    this._http.post(this.tokenUrl, params.toString(), { headers: headers })
    .subscribe(
      data => this.saveToken(data),
      err => alert('Invalid Credentials')
    );
  }

  saveToken(token){
    let expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + token.expires_in);
    let refreshExpireDate = new Date();
    refreshExpireDate.setTime(refreshExpireDate.getTime() + token.refresh_expires_in);
    Cookie.set(myAppConfig.kc.accessTokenCookieName, token.access_token, (token.expires_in - 2) / (24*60*60));
    Cookie.set(myAppConfig.kc.refreshTokenCookieName, token.refresh_token, (token.refresh_expires_in - 2) / (24*60*60));

    console.log('Obtained Access token');
    console.log("access: "+ token.access_token);
    console.log("refresh: "+ token.refresh_token);
    console.log("expires: "+ token.expires_in);
    //window.location.href = myAppConfig.kc.redirectUri;
  }

  /*

  private _instance: Keycloak.KeycloakInstance;
  private _silentRefresh: boolean;

  async isLoggedIn(): Promise<boolean> {
    try {
      if (!this._instance.authenticated) {
        return false;
      }
      await this.updateToken(20);
      return true;
    } catch (error) {
      return false;
    }
  }

  public async updateToken(minValidity = 5) {
    // TODO: this is a workaround until the silent refresh (issue #43)
    // is not implemented, avoiding the redirect loop.
    if (this._silentRefresh) {
      if (this.isTokenExpired()) {
        throw new Error(
          'Failed to refresh the token, or the session is expired'
        );
      }

      return true;
    }

    if (!this._instance) {
      throw new Error('Keycloak Angular library is not initialized.');
    }

    return this._instance.updateToken(minValidity);
  }

  isTokenExpired(minValidity: number = 0): boolean {
    return this._instance.isTokenExpired(minValidity);
  }

  */

}
