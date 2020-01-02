import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDataService } from '../user-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  authenticationError = false;
  
  constructor(private formBuilder:FormBuilder,private router: Router,private userDataService: UserDataService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      emailAddress: ['', Validators.required],
      password: ['', Validators.required]
  });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.authenticationError = false;
    if (this.loginForm.invalid) {
        return;
    }
  this.userDataService.login(this.loginForm.value)
            .subscribe(
                data => {
                    this.userDataService.setCurrentUser(data);
                    this.userDataService.userChange('new user');
                    this.router.navigate(['/home']);
                },
                error => {
                    let currentServerError = error.error;
                    if(currentServerError.type == 'authentication'){
                      this.authenticationError = true;                     
                    }
                    else if(currentServerError.type == 'database'){
                      alert(currentServerError.message);
                    }
                });
}

onReset(){
  this.submitted = false;
  this.loginForm.reset();
  this.authenticationError = false;

}
}
