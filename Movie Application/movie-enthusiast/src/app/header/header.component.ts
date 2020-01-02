import { Component, OnInit } from '@angular/core';
import { faUser,faSignInAlt,faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { UserDataService } from '../user-data.service';
import { CartDataService } from '../cart-data.service';
import { ModalService } from '../modal.service';
import { MovieDataService } from '../movie-data.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  faUser = faUser;
  faSignInAlt = faSignInAlt;
  faShoppingCart= faShoppingCart;
  newUser = true;
  totalQuantity;
  currentUser = {};
  movieIcon = "../../assets/images/movie-icon.png";
  constructor(private userDataService: UserDataService,private movieDataService: MovieDataService,private modalService: ModalService,private cartDataService: CartDataService,private router: Router) { }

  ngOnInit() {
    this.userDataService.currentMessage.subscribe(message => this.onUserChange(message));
    this.cartDataService.changeInQuantity.subscribe(message => this.onQuantityChange(message));
    this.totalQuantity = this.cartDataService.getTotalQuantity();
  }

  onUserChange(message){
      if(message== 'new user'){
        this.newUser = false;
        this.currentUser = this.userDataService.getCurrentUser();
      }
      
  }

  onQuantityChange(parameters){
      this.totalQuantity = parameters.totalQuantity;
  }

  logout(){
    this.userDataService.setCurrentUser(null);
    this.cartDataService.clearCart();
    this.newUser = true;
    this.currentUser = {};
    this.modalService.showLogoutDialog();
    this.movieDataService.setFilters([]);
    this.movieDataService.setSearchTerm("");
    // this.router.navigate(['/home/']);
    this.modalService.onLogout();

  }

}
