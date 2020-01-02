import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieDataService } from '../movie-data.service';
import { CartDataService } from '../cart-data.service';
import { ModalService } from '../modal.service';
import { Router } from '@angular/router';


import { Movie } from '../_models/movie';
import { faShoppingCart,faHome,faPlus,faMinus } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute,private movieDataService: MovieDataService,private router: Router,private modalService: ModalService,private cartDataService: CartDataService) { }
  routeSub;
  movie:any ={};
  faShoppingCart = faShoppingCart; 
  faPlus = faPlus;
  faMinus = faMinus;
  faHome = faHome;
  imageUrl :any;
  quantity = 1;
  loading = true;
  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.movieDataService.getMovie(params['id'])
            .subscribe(
                data => {
                  this.movie = data;
                  this.loading = false;
                  if(this.movie.isDeleted){
                    this.router.navigate(['/home/']);
                  }
                },
                error => {
                    let currentServerError = error.error;
                    this.modalService.showDatabaseErrorDialog(currentServerError); 
                });
    });
    this.imageUrl = this.movieDataService.getImageUrl();
  }
  isString(data){
    return typeof(data) === 'string';
  }

  addToCart(){ 
      if(this.quantity >= 1 ){
        var newMovie = new Movie(this.movie._id,this.movie.title,this.movie.image,this.movie.price,this.quantity,this.movie.quantity);
        var success =this.cartDataService.addItem(newMovie);
        if(success){
          this.modalService.showSuccessDialog(this.movie.title,this.quantity);
        }else{
          this.modalService.showOutOfStockDialog(this.movie.title);
        }
        this.router.navigate(['/home']);    
      }
      else{
        this.modalService.showInvalidQuantityDialog();
        this.quantity = 1;
      }
      
  }

  goToHomePage(){
    this.router.navigate(['/home']);
  }

}
