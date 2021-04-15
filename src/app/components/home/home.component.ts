import { Component, OnInit } from '@angular/core';
import { Info } from 'src/app/models/info';
import { CustomKcAuthService } from 'src/app/services/custom-kc-auth.service';
import { ProtectedInfoService } from 'src/app/services/protected-info.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loggedIn = false;
  public protectedInfo = new Info(1, 'No Info');

  constructor(private readonly protectedInfoService: ProtectedInfoService,
    private customKcAuth: CustomKcAuthService) { }

  ngOnInit(): void {

    this.loggedIn = this.customKcAuth.isLoggedIn();
    this.customKcAuth.getLoggedInValue().subscribe((value) => {
      this.loggedIn = value;
    });

  }

  logout() { 

    this.customKcAuth.logout();
    this.loggedIn = false;

  }

  getResource() {
    this.protectedInfoService.getResource().subscribe(
      data => this.protectedInfo = data,
      error => this.protectedInfo.name = 'Error');
  }

}
