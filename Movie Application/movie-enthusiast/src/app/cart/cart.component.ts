import { Component, OnInit } from '@angular/core';
import { CartDataService } from '../cart-data.service';
import { ModalService } from '../modal.service';
import { UserDataService } from '../user-data.service';
import { OrderDataService } from '../order-data.service';
import { MovieDataService } from '../movie-data.service';

import { faTrash,faHome,faCreditCard,faDumpster,faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

declare var $: any;


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  faTrash = faTrash;
  faHome= faHome;
  faCreditCard = faCreditCard;
  faDumpster = faDumpster;
  faShoppingCart = faShoppingCart;
  cart : any;
  currentMovie = "";
  constructor(private cartDataService: CartDataService,private movieDataService: MovieDataService,private orderDataService: OrderDataService,private modalService: ModalService,private userDataService: UserDataService,private router: Router) { }
  imageUrl :any;
  totalAmount : any;
  emptyCart = "../../assets/images/empty-cart.svg";
  ngOnInit() {
    this.cart = this.cartDataService.getCart();
    this.totalAmount = this.cartDataService.getTotalAmount();    
    this.imageUrl = this.movieDataService.getImageUrl();
  }

  goToMovieDetail(movieId){
    this.router.navigate(['/movieDetail/'+movieId]);
  }

  updateQuantity(title,movieId,newQuantity,stock){
    
    if(newQuantity<=0){
      this.modalService.showInvalidQuantityDialog();
      this.cart = this.cartDataService.updateItem(movieId,1);
      this.totalAmount = this.cartDataService.getTotalAmount();      
    }
    else if(newQuantity<=stock){
      this.cart = [...this.cartDataService.updateItem(movieId,newQuantity)];
      this.totalAmount = this.cartDataService.getTotalAmount();
    }
    
    else{
      this.modalService.showOutOfStockDialog(title);
      this.cart = this.cartDataService.updateItem(movieId,stock);
      this.totalAmount = this.cartDataService.getTotalAmount();
    }
    
  }

  deleteMovie(movieId){
    this.cartDataService.removeItem(movieId);
    this.cart = this.cartDataService.getCart();
    this.totalAmount = this.cartDataService.getTotalAmount();
  }

  clearCart(){
    this.cartDataService.clearCart();
    this.cart = this.cartDataService.getCart();
    this.totalAmount = this.cartDataService.getTotalAmount();
  }

  goToHomePage(){
    this.router.navigate(['/home']);
  }

  checkout(){
    var currentUser = this.userDataService.getCurrentUser();
    if(currentUser== null){
      this.modalService.showSignInErrorDialog();
    }else{
       this.orderDataService.addOrder(currentUser,this.cart,this.totalAmount).subscribe(
        data => {
            this.orderDataService.setCurrentOrder(data);
            this.cartDataService.clearCart();
            this.router.navigate(['/orderConfirmation/']);
        },
        error => {
            this.modalService.showDatabaseErrorDialog(error);
        });
    }
  }

}
