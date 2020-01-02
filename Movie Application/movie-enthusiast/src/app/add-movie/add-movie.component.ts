import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieDataService } from '../movie-data.service';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {
  addMovieForm: FormGroup;
  submitted = false;
  serverError = {};
  imageURL = null;
  imageTypeError = false;
  constructor(private formBuilder:FormBuilder,private router: Router,private movieDataService: MovieDataService,private userDataService: UserDataService) { }
  currentYear = new Date().getFullYear();
  ngOnInit() {

    if(this.userDataService.getCurrentUser()==null || this.userDataService.getCurrentUser().isAdmin == false){
      this.router.navigate(['/home/']);
    }
    else{
    this.addMovieForm = this.formBuilder.group({
      title: ['',Validators.required],
      description: ['', Validators.required],
      rating: ['', [Validators.required,Validators.min(0),Validators.max(5),Validators.pattern('[0-9]+(\.[0-9]?)?')]],
      year: ['', [Validators.required, Validators.min(1950),Validators.max(this.currentYear),Validators.pattern('[0-9]+')]],
      duration: ['', [Validators.required, Validators.min(1),Validators.max(480),Validators.pattern('[0-9]+')]],
      director: ['', Validators.required],
      cast: ['', Validators.required],
      price: ['', [Validators.required,Validators.min(1),Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]],
      quantity: ['', [Validators.required,Validators.min(1),Validators.pattern('[0-9]+')]],
      inStock : ["true",Validators.required],
      isDeleted : ["false",Validators.required],
      genre :['', Validators.required],
      image :['', Validators.required]
  });
}
  }

  get f() { return this.addMovieForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.addMovieForm.invalid || this.imageTypeError) {
        return;
    }
    this.serverError = {};
    this.movieDataService.addMovie(this.addMovieForm.value,this.imageURL)
            .subscribe(
                data => {
                    this.router.navigate(['/home']);
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

preview(event){
  var selectedFile = <File> event.target.files[0];
  if(!selectedFile){
    this.imageURL = "";
    return;
  }
  var mimeType = selectedFile.type;
    if (mimeType.match(/image\/*/) == null) {
      this.imageTypeError = true;
      return;
    }
  var reader = new FileReader();
    reader.readAsDataURL(selectedFile); 
    reader.onload = (_event) => { 
      this.imageURL = reader.result; 
    }
}

onReset(){
  this.submitted = false;
  this.addMovieForm.reset();
  this.imageURL = "";
  this.addMovieForm.controls.inStock.setValue("true");
  this.addMovieForm.controls.isDeleted.setValue("false");
}

}
