import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  returnUrl: string = '/login/callback';

  constructor(private formBuilder: FormBuilder,
    //private route: ActivatedRoute,
    private router: Router,
    private readonly customKcAuth: CustomKcAuthService,
    private cdRef:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loggedIn = this.isLoggedIn();
    this.customKcAuth.getLoggedInValue().subscribe((value) => {
      this.loggedIn = value;
    });
    this.loginFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.customKcAuth.login('tr', 'tr');
  }

  logout() {
    this.customKcAuth.logout();
    this.loggedIn = false;
  }

  isLoggedIn(): boolean {
    return this.customKcAuth.isLoggedIn();
  }

  refreshLogin() {
    this.customKcAuth.refreshLogin();
  }

  onSubmit() {

    this.submitted = true;
    if (this.loginFormGroup.valid) {
      this.loading = true;
      this.loggedIn = this.customKcAuth.login(this.controls.username.value, this.controls.password.value)
      this.loading = false;
      this.cdRef.detectChanges();
      this.router.navigate([this.returnUrl]);
    }  else 
      alert('Please fill the form fiels');
  }

  get controls() { return this.loginFormGroup.controls; }

}
