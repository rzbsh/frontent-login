import { Component, OnInit } from '@angular/core';
import { CustomKcAuthService } from 'src/app/services/custom-kc-auth.service';
import { ProtectedInfoService } from 'src/app/services/protected-info.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loggedIn = false;

  constructor(private readonly protectedInfo: ProtectedInfoService,
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

  getResource() { this.protectedInfo.getResource(); }

}
