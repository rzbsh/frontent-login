import { Component, OnInit } from '@angular/core';
import { CustomKcAuthService } from './services/custom-kc-auth.service';
import { ProtectedInfoService } from './services/protected-info.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend-login';
  public isLoggedIn = false;

  constructor(private readonly customKc: CustomKcAuthService,
              private readonly protectedInfo: ProtectedInfoService) {}

  public async ngOnInit() {
    //this.isLoggedIn = await this.customKc.isLoggedIn();

    //if (this.isLoggedIn) {
    //  this.userProfile = await this.keycloak.loadUserProfile();
    //}
  }

  getResource() {
    this.protectedInfo.getResource();
  }
}
