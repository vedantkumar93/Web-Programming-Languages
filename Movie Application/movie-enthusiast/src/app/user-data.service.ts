import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { User } from './_models/user';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  usersApiUrl = "/api/users/"; 
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient) { }
  currentUser = null;
  addUser(user: User) {
    return this.http.post(this.usersApiUrl, user);
  }

  login(user) {
    return this.http.post(this.usersApiUrl+`login`, user);
  }

  setCurrentUser(user){
    this.currentUser = user;
    console.log(this.currentUser);
  }

  getCurrentUser(){
    return this.currentUser;
  }

  userChange(message: string) {
    this.messageSource.next(message);
  }

  getPurchaseHistory(){
    return this.http.get(this.usersApiUrl+this.currentUser._id+'/purchaseHistory' );
  }
}
