import { Component, OnInit } from '@angular/core';
import { OrderDataService } from '../order-data.service';
import { MovieDataService } from '../movie-data.service';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  currentOrder : any;
  imageUrl :any;
  faHome = faHome;
  constructor(private orderDataService: OrderDataService,private movieDataService: MovieDataService,private router: Router) { }
  
  ngOnInit() {
    this.currentOrder = this.orderDataService.getCurrentOrder();
    this.imageUrl = this.movieDataService.getImageUrl();
  }

  goToHomePage(){
    this.router.navigate(['/home']);
  }

  goToMovieDetail(movieId){
    this.router.navigate(['/movieDetail/'+movieId]);
  }



}
