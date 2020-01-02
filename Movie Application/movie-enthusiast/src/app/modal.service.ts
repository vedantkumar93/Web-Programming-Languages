import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }
  private messageSource = new Subject<any>();
  showDialog = this.messageSource.asObservable();
  private messageSource1 = new Subject<any>();
  logout = this.messageSource1.asObservable();
  
  onLogout(){
    this.messageSource1.next();
  }

  showOutOfStockDialog(currentMovie){
    var parameters ={
      'type' : 'outOfStock',
      'currentMovie' : currentMovie
    };
    this.messageSource.next(parameters);
  }

  showSuccessDialog(currentMovie,quantity){
    var parameters ={
      'type' : 'success',
      'currentMovie' : currentMovie,
      'quantity' : quantity
    };
    console.log("success");
    this.messageSource.next(parameters);
  }

  showInvalidQuantityDialog(){
    var parameters ={
      'type' : 'invalid quantity'
    };
    this.messageSource.next(parameters);
  }

  showSignInErrorDialog(){
    var parameters ={
      'type' : 'sign in error'
    };
    this.messageSource.next(parameters);
  }

  showSignInSuccessDialog(name){
    var parameters ={
      'type' : 'sign in success',
      'name' : name
    };
    this.messageSource.next(parameters);
  }
  showImageTypeErrorDialog(){
    var parameters ={
      'type' : 'image type error'
    };
    this.messageSource.next(parameters);
  }

  showMovieDeletedDialog(){
    var parameters ={
      'type' : 'movie deleted error'
    };
    this.messageSource.next(parameters);
  }

  showCartMovieDeletedDialog(movieTitle){
    var parameters ={
      'type' : 'cart movie deleted',
      'movieTitle' : movieTitle
    };
    this.messageSource.next(parameters);
  }

  showLogoutDialog(){
    var parameters ={
      'type' : 'logout'
    };
    this.messageSource.next(parameters);
  }
  showDatabaseErrorDialog(message){
    var parameters ={
      'type' : 'database error',
      'message' : message
    };
    this.messageSource.next(parameters);
  }

}
