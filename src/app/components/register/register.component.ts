import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { Address } from 'src/app/models/address';

import { Country } from 'src/app/models/country';
import { State } from 'src/app/models/state';
import { CustomKcRegService } from 'src/app/services/custom-kc-reg.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registrationFormGroup: FormGroup;
  countries: Country[] = [];
  states: State[] = [];


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private customKcReg: CustomKcRegService) { }

  ngOnInit(): void {

    this.registrationFormGroup = this.formBuilder.group({
      user: this.formBuilder.group({
        username: new FormControl('', [Validators.required, Validators.minLength(2), this.notOnlyWhitespace]),
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), this.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), this.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        //birthDate: new FormControl('', [Validators.required]) // validator
        password: new FormControl('', [Validators.required, Validators.minLength(2), this.notOnlyWhitespace]),
      }),
      address: this.formBuilder.group({
        street: new FormControl(''),// [Validators.required, Validators.minLength(2), this.notOnlyWhitespace]),
        city: new FormControl(''),// [Validators.required, Validators.minLength(2), this.notOnlyWhitespace]),
        //state: new FormControl('', [Validators.required]),
        //country: new FormControl('', [Validators.required]),
        zipCode: new FormControl(''),// [Validators.required, Validators.minLength(2), this.notOnlyWhitespace])
      })
    });
    const startMonth: number = new Date().getMonth() + 1;
    //this.registrationForm.getBirthDateMonths(startMonth).subscribe(data => this.creditCardMonths = data);
    //this.registrationForm.getBirthDayYears().subscribe(data => this.creditCardYears = data);
    //this.registrationForm.getCountries().subscribe(data => this.countries = data);

  }

  notOnlyWhitespace(control: FormControl): ValidationErrors | null {

    // check if string only contains whitespace
    if ((control.value != null) && (control.value.trim().length === 0))
      return { 'notOnlyWhitespace': true };
    else
      return null;

  }



  onSubmit() {

    console.log(this.registrationFormGroup.get('user')?.value);
    console.log(this.registrationFormGroup.get('address')?.value);
    //console.log(this.registrationFormGroup.get('address')?.value);
    //console.log(this.registrationFormGroup.get('address.state'));
    if (this.registrationFormGroup.invalid) {
      // touching all fields triggers the display of the error messsages
      alert('Invalid Input! \nPlease check fields requirements.');
      this.registrationFormGroup.markAllAsTouched();
    } else {
      
      //alert('Valid Input!');
      let newUser = new User();
      newUser = this.registrationFormGroup.controls['user'].value;
      newUser.enabled = true;
      newUser.address = this.registrationFormGroup.get('address')?.value;

      //newUser.address = this.registrationFormGroup.controls['address'].value;
      //const state: State = JSON.parse(JSON.stringify(newUser.address.state));
      //const country: Country = JSON.parse(JSON.stringify(newUser.address.country));
      //newUser.address.state = state.name;
      newUser.address.state = 'undefinedState'
      //newUser.address.country = country.name;
      newUser.address.country = 'undefinedCountry'
      /*
            // call REST API 
            this.checkoutService.placeOrder(purchase).subscribe({
              // success
              next: response => {
                alert('Your order has been received.\
                      \nOrder traacking number: ' + response.orderTrackingNumber);
                this.resetCart();
              },
              // exception
              error: err => {
                alert('Ther was an error: ' + err.message);
              }
            }); */
      this.customKcReg.register(newUser);

    }

  }

  resetForm() {

    // reset form data
    this.registrationFormGroup.reset();

    // navigate back to home page
    this.router.navigateByUrl('');

  }

  handleMonths() {

    const creditCardFormGroup = this.registrationFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);
    const currentMonth: number = new Date().getMonth() + 1;
    const startMonth: number = currentYear === selectedYear ? currentMonth : 1;
    //this.shoppingForm.getCreditCardMonths(startMonth).subscribe(data => this.creditCardMonths = data);

  }

  getStates(formGroupName: string) {
    /*
        const formGroup = this.checkoutFormGroup.get(formGroupName);
        const countryCode = formGroup?.value.country.code;
        this.shoppingForm.getStates(countryCode).subscribe(
          data => {
            if (formGroupName === 'shippingAddress')
              this.shippingAddressStates = data;
            else
              this.billingAddressStates = data;
            formGroup?.get('state')?.setValue(data[0]); // no effect on UI
          }
        );
    */
  }

  get username() { return this.registrationFormGroup.get('user.username'); }
  get firstName() { return this.registrationFormGroup.get('user.firstName'); }
  get lastName() { return this.registrationFormGroup.get('user.lastName'); }
  get email() { return this.registrationFormGroup.get('user.email'); }
  get birthDate() { return this.registrationFormGroup.get('user.birthDate'); }
  get password() { return this.registrationFormGroup.get('user.password'); }

  get addressStreet() { return this.registrationFormGroup.get('address.street'); }
  get addressCity() { return this.registrationFormGroup.get('address.city'); }
  get addressState() { return this.registrationFormGroup.get('address.state'); }
  get addressCountry() { return this.registrationFormGroup.get('address.country'); }
  get addressZipCode() { return this.registrationFormGroup.get('address.zipCode'); }

}