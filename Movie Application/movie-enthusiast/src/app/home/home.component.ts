import { Component, OnInit } from '@angular/core';
import { faShoppingCart,faSearch,faTrash,faEdit,faFilter,faPlus } from '@fortawesome/free-solid-svg-icons';
import { MovieDataService } from '../movie-data.service';
import { CartDataService } from '../cart-data.service';
import { ModalService } from '../modal.service';


import { Router } from '@angular/router';
import { Movie } from '../_models/movie';
import { UserDataService } from '../user-data.service';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  faShoppingCart= faShoppingCart;
  faSearch = faSearch;
  faTrash = faTrash;
  faEdit = faEdit;
  faFilter = faFilter;
  faPlus = faPlus;
  isAdmin = false;
  pageOfMovies: Array<any>;
  imageUrl :any;
  movies: any;
  genres: any;
  years: any;
  searchTerm = "";
  filters: any[] =[];
  currentMovie ="";
  initialPage =1;
  currentPage =1;
  loading = true;

  constructor(private movieDataService: MovieDataService,private userDataService: UserDataService,private cartDataService: CartDataService,private modalService: ModalService,private router: Router) { }

  ngOnInit() {
    this.modalService.logout.subscribe(message => this.initialize());
  this.initialize();  
    
  }

  initialize(){
    this.filters =  this.movieDataService.getFilters();
    this.searchTerm = this.movieDataService.getSearchTerm();
    this.movieDataService.getMovies({'filters':this.filters,'searchTerm':this.searchTerm})
            .subscribe(
                data => {
                  this.movies = data;
                  this.loading = false;
                },
                error => {
                    let currentServerError = error.error;
                    this.modalService.showDatabaseErrorDialog(currentServerError); 
                });
  	this.movieDataService.getGenres()
    .subscribe(
      data => {
        this.genres = data;
      },
      error => {
          let currentServerError = error.error;
          this.modalService.showDatabaseErrorDialog(currentServerError); 
      });
    this.movieDataService.getYears()
    .subscribe(
      data => {
        this.years = data;
        this.years = this.years.sort((a,b) => b - a);
      },
      error => {
          let currentServerError = error.error;
          this.modalService.showDatabaseErrorDialog(currentServerError); 
      });
    
      this.imageUrl = this.movieDataService.getImageUrl();
      var currentUser =this.userDataService.getCurrentUser();
      if(currentUser !=null){
        this.isAdmin = currentUser.isAdmin;
      }
  
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfMovies = pageOfItems;
    let index = this.movies.findIndex( record => record._id === pageOfItems[0]._id );
    this.currentPage = index/8 + 1;
  }

  addFilter(type,value){
    var filterExists = false;
    this.loading = true;
    for(let filter of this.filters){
      if(filter.type == type && filter.value == value){
        filterExists = true;
        this.loading = false;        
      }
    }
    if(!filterExists){     
    this.filters.push({'type':type,'value':value});
    this.movieDataService.getMovies({'filters':this.filters,'searchTerm':this.searchTerm})
            .subscribe(
                data => {
                  this.movies = data;
                  this.loading = false;
                },
                error => {
                    let currentServerError = error.error;
                    this.modalService.showDatabaseErrorDialog(currentServerError); 
                });
    }
    this.movieDataService.setFilters(this.filters);
  }

  removeFilter(filter){
    this.loading = true;
    for( var i = 0; i < this.filters.length; i++){ 
      if (this.filters[i].type === filter.type &&  this.filters[i].value === filter.value) {
        this.filters.splice(i, 1); 
      }
   }
   this.movieDataService.getMovies({'filters':this.filters,'searchTerm':this.searchTerm})
            .subscribe(
                data => {
                  this.movies = data;
                  this.loading = false;
                },
                error => {
                    let currentServerError = error.error;
                    this.modalService.showDatabaseErrorDialog(currentServerError); 
                });
    this.movieDataService.setFilters(this.filters);   
  }  

  removeAllFilters(){
    this.filters=[];
    this.loading = true;
    this.movieDataService.getMovies({'filters':this.filters,'searchTerm':this.searchTerm})
            .subscribe(
                data => {
                  this.movies = data;
                  this.loading = false;
                },
                error => {
                    let currentServerError = error.error;
                    this.modalService.showDatabaseErrorDialog(currentServerError); 
                });
    this.movieDataService.setFilters(this.filters);
   }
  

  onSearch(){
    this.loading = true;
    this.movieDataService.getMovies({'filters':this.filters,'searchTerm':this.searchTerm})
            .subscribe(
                data => {
                  this.movies = data;
                  this.loading = false;
                },
                error => {
                    let currentServerError = error.error;
                    this.modalService.showDatabaseErrorDialog(currentServerError); 
    });
    this.movieDataService.setSearchTerm(this.searchTerm);

  }

  onKeydown(event) {
    if (event.key === "Enter") {
      this.onSearch();
    }
  }

  goToMovieDetail(movieId){
    this.router.navigate(['/movieDetail/'+movieId]);
  }

  addToCart(movie){
    var newMovie = new Movie(movie._id,movie.title,movie.image,movie.price,1,movie.quantity);
    var success =this.cartDataService.addItem(newMovie);
    if(success){
      this.modalService.showSuccessDialog(movie.title,1);
    }else{
      this.modalService.showOutOfStockDialog(movie.title);
    }
  }

  addMovie(){
    this.router.navigate(['/addMovie/']);
  }

  editMovie(movieId){
    this.router.navigate(['/editMovie/'+movieId]);
  }

  deleteMovie(movieId,movieTitle){
    this.movieDataService.deleteMovie(movieId).subscribe(
      data => {
          this.initialize();
          var status = this.cartDataService.removeItem(movieId);
          if(status){
            this.modalService.showCartMovieDeletedDialog(movieTitle);
          }  
          this.initialPage =this.currentPage;
        },
      error => {
          this.modalService.showDatabaseErrorDialog(error);          
      });
  }
}
