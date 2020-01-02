import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieDataService } from '../movie-data.service';
import { ModalService } from '../modal.service';
import { CartDataService } from '../cart-data.service';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.css']
})
export class EditMovieComponent implements OnInit {
  editMovieForm: FormGroup;
  submitted = false;
  serverError = {};
  imageURL = null;
  imageTypeError = false;
  routeSub:any;
  movie:any;
  baseImageUrl : any;
  loading = true;
  imageChanged = false;
  constructor(private route: ActivatedRoute,private formBuilder:FormBuilder,private router: Router,private movieDataService: MovieDataService,private userDataService: UserDataService,private cartDataService: CartDataService,private modalService: ModalService) { }
  currentYear = new Date().getFullYear();
  ngOnInit() {

    if(this.userDataService.getCurrentUser()==null || this.userDataService.getCurrentUser().isAdmin == false){
      this.router.navigate(['/home/']);
    }
    else{
    this.routeSub = this.route.params.subscribe(params => {
      this.movieDataService.getMovie(params['id'])
            .subscribe(
                data => {
                  this.movie = data;
                  this.editMovieForm = this.formBuilder.group({
                    title: [this.movie.title,Validators.required],
                    description: [this.movie.description, Validators.required],
                    rating: [this.movie.rating, [Validators.required,Validators.min(0),Validators.max(5),Validators.pattern('[0-9]+(\.[0-9]?)?')]],
                    year: [this.movie.year, [Validators.required, Validators.min(1950),Validators.max(this.currentYear),Validators.pattern('[0-9]+')]],
                    duration: [this.movie.duration, [Validators.required, Validators.min(1),Validators.max(480),Validators.pattern('[0-9]+')]],
                    director: [this.movie.director, Validators.required],
                    cast: [this.movie.cast, Validators.required],
                    price: [this.movie.price, [Validators.required,Validators.min(1),Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]],
                    quantity: [this.movie.quantity, [Validators.required,Validators.min(1),Validators.pattern('[0-9]+')]],
                    inStock : [this.movie.inStock.toString(),Validators.required],
                    isDeleted : [this.movie.isDeleted.toString(),Validators.required],
                    genre :[this.movie.genre, Validators.required],
                    image :[""]
                });
                this.loading = false;
                },
                error => {
                    let currentServerError = error.error;
                    //TODO show dialog unable to connect to database 
                });
    });
    this.baseImageUrl = this.movieDataService.getImageUrl();
  }
  }

  get f() { return this.editMovieForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.editMovieForm.invalid ) {
        return;
    }
    this.serverError = {};
    this.movieDataService.updateMovie(this.editMovieForm.value,this.movie._id,this.imageChanged,this.imageURL)
            .subscribe(
                data => {
                    this.router.navigate(['/home']);
                    var status =this.cartDataService.removeItem(this.movie._id);
                    if(status){
                        this.modalService.showCartMovieDeletedDialog(this.movie.title);
                    }
                  },
                error => {
                    let currentServerError = error.error;
                    if(currentServerError.type == 'validation'){
                      for(let errorType of currentServerError.message){
                          this.serverError[errorType.field]= {};
                          this.serverError[errorType.field][errorType.type]=true;
                      }                    
                    }
                    else if(currentServerError.type == 'database'){
                      alert(currentServerError.message);
                    }
                });
}

preview(event){
  var selectedFile = <File> event.target.files[0];
  if(!selectedFile){
    this.imageURL = null;
    this.imageChanged = false;
    return;
  }
  var mimeType = selectedFile.type;
    if (mimeType.match(/image\/*/) == null) {      
      this.imageTypeError = true;
      this.imageChanged = false;
      this.modalService.showImageTypeErrorDialog();
      return;
    }
  var reader = new FileReader();
    reader.readAsDataURL(selectedFile); 
    reader.onload = (_event) => { 
      this.imageURL = reader.result;
      this.imageChanged = true; 
    }
}

onReset(){
  this.imageChanged = false;
  this.imageURL = "";
  this.imageTypeError = false;
  this.editMovieForm = this.formBuilder.group({
    title: [this.movie.title,Validators.required],
    description: [this.movie.description, Validators.required],
    rating: [this.movie.rating, [Validators.required,Validators.min(0),Validators.max(5),Validators.pattern('[0-9]+(\.[0-9]?)?')]],
    year: [this.movie.year, [Validators.required, Validators.min(1950),Validators.max(this.currentYear),Validators.pattern('[0-9]+')]],
    duration: [this.movie.duration, [Validators.required, Validators.min(1),Validators.max(480),Validators.pattern('[0-9]+')]],
    director: [this.movie.director, Validators.required],
    cast: [this.movie.cast, Validators.required],
    price: [this.movie.price, [Validators.required,Validators.min(1),Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]],
    quantity: [this.movie.quantity, [Validators.required,Validators.min(1),Validators.pattern('[0-9]+')]],
    inStock : [this.movie.inStock.toString(),Validators.required],
    isDeleted : [this.movie.isDeleted.toString(),Validators.required],
    genre :[this.movie.genre, Validators.required],
    image :[""]
});
  this.submitted = false;

}

}
