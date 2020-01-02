import { Injectable } from '@angular/core';
import { Movie } from './_models/movie';
import { Subject } from 'rxjs';
import { UserDataService } from './user-data.service';


@Injectable({
  providedIn: 'root'
})
export class CartDataService {
  
  constructor(private userDataService: UserDataService) { }
  cart:any = [];
  // totalQuantity = 0;
  private messageSource = new Subject<any>();
  changeInQuantity = this.messageSource.asObservable();
  
  getCart(){
    return this.cart;
  }

  
  getTotalQuantity(){
    var totalQuantity = 0;
    for(var i=0;i<this.cart.length;i++){
      totalQuantity += this.cart[i].quantity;
    }
    return totalQuantity;
  }
  
  addItem(movie:Movie){
    var itemExists = false;
    var isInStock = true;
    for(var i=0;i<this.cart.length;i++){
      if(this.cart[i].id == movie.id ){
        itemExists = true;
        if(this.cart[i].quantity+movie.quantity <= movie.stock){
          this.cart[i].quantity += movie.quantity;
          this.cart[i].totalAmount += movie.totalAmount;          
        }
        else{
          this.cart[i].quantity = movie.stock;
          this.cart[i].totalAmount = parseFloat((movie.stock * movie.price).toFixed(2));
          isInStock =false;
        }       
      }
    }
    if(!itemExists){
      if(movie.quantity<= movie.stock){
        this.cart.push(movie);     
      }else{
        movie.quantity = movie.stock;
        this.cart.push(movie);
        isInStock =false;
      }

    }
    this.messageSource.next({'totalQuantity':this.getTotalQuantity()});
    return isInStock;
  }

  removeItem(movieId){
    var status = false;
    for(var i=0;i<this.cart.length;i++){
      if(this.cart[i].id == movieId){
        this.cart.splice(i, 1);
        status = true;
      }
    }
    this.messageSource.next({'totalQuantity':this.getTotalQuantity()});
    return status;
  }

  updateItem(movieId,newQuantity){
    for(var i=0;i<this.cart.length;i++){
      if(this.cart[i].id == movieId){
        this.cart[i].quantity = newQuantity;
        this.cart[i].totalAmount =parseFloat((this.cart[i].price * this.cart[i].quantity).toFixed(2)); 
      }
    }
    this.messageSource.next({'totalQuantity':this.getTotalQuantity()});
    return this.cart;
  }

  getTotalAmount(){
    var totalAmount = 0;
    for(var i=0;i<this.cart.length;i++){
      totalAmount += this.cart[i].price * this.cart[i].quantity;
    }
    return totalAmount.toFixed(2);
  }

  clearCart(){
    this.cart = [];
    this.messageSource.next({'totalQuantity':this.getTotalQuantity()});
  }


}
