import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { JwPaginationComponent } from 'jw-angular-pagination';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { RatingModule } from 'ng-starrating';
import { CartComponent } from './cart/cart.component';
import { ModalComponent } from './modal/modal.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { EditMovieComponent } from './edit-movie/edit-movie.component';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignUpComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    JwPaginationComponent,
    MovieDetailComponent,
    CartComponent,
    ModalComponent,
    OrderConfirmationComponent,
    AddMovieComponent,
    EditMovieComponent,
    PurchaseHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RatingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
