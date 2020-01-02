import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';
import { UserDataService } from '../user-data.service';
import { MovieDataService } from '../movie-data.service';
import { Router } from '@angular/router';

import { faHome } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.css']
})
export class PurchaseHistoryComponent implements OnInit {

  constructor(private modalService: ModalService,private userDataService: UserDataService,private movieDataService: MovieDataService,private router: Router) { }
  orders : any;
  imageUrl : any;
  loading = true;
  faHome = faHome;
  emptyCart = "../../assets/images/empty-purchase-history.png";

  ngOnInit() {
    if(this.userDataService.getCurrentUser() == null || this.userDataService.getCurrentUser() == {}){
      this.router.navigate(['/home/']);
    }else{
      this.userDataService.getPurchaseHistory().subscribe(
        data => {
            this.orders = data;
            this.loading = false; 
            console.log(this.orders);
          },
        error => {
            console.log(error);          
        });
        this.imageUrl = this.movieDataService.getImageUrl();
    }
    
  }

  goToMovieDetail(movieId){
    this.movieDataService.getMovie(movieId)
            .subscribe(
                data => {
                  var movie:any = data;
                  if(movie.isDeleted){
                    this.modalService.showMovieDeletedDialog();
                  }
                  else{
                    this.router.navigate(['/movieDetail/'+movieId]);
                  }
                  
                },
                error => {
                    let currentServerError = error.error;
                    //TODO show dialog unable to connect to database 
                });
   
  }

  goToHomePage(){
    this.router.navigate(['/home/']);
    
  }

}
