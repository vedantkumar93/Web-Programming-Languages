import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { CartComponent } from './cart/cart.component';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { EditMovieComponent } from './edit-movie/edit-movie.component';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';



const routes: Routes = [
  {path:  "", pathMatch:  "full",redirectTo:  "home"},
  {path: "home", component: HomeComponent},
  {path: "sign-up", component: SignUpComponent},
  {path: "login", component: LoginComponent},
  {path: "movieDetail/:id", component: MovieDetailComponent},
  {path: "cart", component:CartComponent},
  {path: "orderConfirmation", component:OrderConfirmationComponent},
  {path: "addMovie", component:AddMovieComponent},
  {path: "editMovie/:id", component:EditMovieComponent},
  {path: "purchaseHistory", component:PurchaseHistoryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
