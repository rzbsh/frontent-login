import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomKcAuthService } from 'src/app/services/custom-kc-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loggedIn: boolean = false;
  loginFormGroup: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(private formBuilder: FormBuilder,
    //private route: ActivatedRoute,
    private router: Router,
    private readonly customKc: CustomKcAuthService,
  ) { }

  ngOnInit(): void {
    this.loggedIn = this.isLoggedIn();
    this.loginFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.customKc.login('tr', 'tr');
  }

  logout() {

  }

  isLoggedIn(): boolean {
    return this.customKc.isLoggedIn();
  }

  refreshLogin() {
    this.customKc.refreshLogin();
  }

  get controls() { return this.loginFormGroup.controls; }


  onSubmit() {
    this.submitted = true;
    if (this.loginFormGroup.valid) {
      this.loading = true;
      this.customKc.login(this.controls.username.value, this.controls.password.value)
      this.loading = false;
      //this.router.navigate([this.returnUrl]);
    } // else form is invalid
  }

}
