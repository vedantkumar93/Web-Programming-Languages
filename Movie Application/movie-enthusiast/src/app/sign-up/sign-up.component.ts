import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDataService } from '../user-data.service';
import { Router } from '@angular/router';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  submitted = false;  
  serverError = {};
  parameterCount = 0;
    constructor( private formBuilder:FormBuilder,private router: Router,private userDataService: UserDataService,private modalService: ModalService) { }
  strengthLevels = [
    {value : 'Poor',class: "poor"},
    {value : 'Weak',class: "weak"},
    {value : 'Weak',class: "weak"},
    {value : 'Medium',class: "medium"},
    {value : 'Strong',class: "strong"},
    {value : 'Very Strong',class: "very-strong"}
  ];
  passwordStrength = {};
  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      name: ['',Validators.required],
      emailAddress: ['', [Validators.email,Validators.required,Validators.pattern('[^@]+@[^\.]+\..+')]],
      phoneNumber: ['', [Validators.pattern('\\d{10}')]],
      password: ['', [Validators.required, Validators.minLength(6),Validators.pattern('[a-zA-Z\\d$@_]+')]]
  });
  }

  get f() { return this.signUpForm.controls; }

  checkPasswordStrength(event){
    let passwordValue = this.f.password.value;
    this.parameterCount = 0;
    var regexpressions = ['\\d','[A-Z]','[a-z]','\[$@_]']
    if(passwordValue!=null && passwordValue.length >= 6){
      this.parameterCount = 1;
      for (let expression of regexpressions){
        let regex = new RegExp(expression);
        if(regex.test(passwordValue)){
          this.parameterCount += 1;
        }
      }
    }
    this.passwordStrength = this.strengthLevels[this.parameterCount];
  
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.signUpForm.invalid) {
        return;
    }
    this.serverError = {}
  this.userDataService.addUser(this.signUpForm.value)
            .subscribe(
                data => {
                    this.userDataService.setCurrentUser(data);
                    this.userDataService.userChange('new user');
                    this.router.navigate(['/home']);
                    this.modalService.showSignInSuccessDialog(this.userDataService.getCurrentUser().name);
                  },
                error => {
                    let currentServerError = error.error;
                    if(currentServerError.type == 'validation'){
                      for(let errorType of currentServerError.message){
                          this.serverError[errorType.field]= {};
                          this.serverError[errorType.field][errorType.type]=true;
                      }                    
                    }
                    else if(currentServerError.type == 'exists'){
                        this.serverError['emailAddress'] = {};
                        this.serverError['emailAddress']['exists'] = true ;
                    }
                    else if(currentServerError.type == 'database'){
                      alert(currentServerError.message);
                    }
                });
}

onEmailAddressChange(){
  console.log('here');
  if(this.submitted){
    this.serverError['emailAddress'] ={};
  }
}

onReset(){
  this.submitted = false;
  this.signUpForm.reset();

}
}
