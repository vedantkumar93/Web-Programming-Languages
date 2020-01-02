import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OrderDataService {
  ordersApiUrl = "/api/orders/";
  constructor(private http: HttpClient) { }
  order: any;

  addOrder(user,cart,totalAmount){
    return this.http.post(this.ordersApiUrl, {'user':user,'cart':cart,'totalAmount':totalAmount });
  }

  setCurrentOrder(order){
    this.order = order;
  }

  getCurrentOrder(){
    return this.order;
  }
  

}
