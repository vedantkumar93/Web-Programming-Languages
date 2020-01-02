import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(private modalService: ModalService,private router: Router) { }
  currentMovie : any;
  username : any;
  quantity : any;
  movieTitle : any;
  message : any;
  ngOnInit() {
    this.modalService.showDialog.subscribe(message => this.onShowDialog(message));
  }

  onShowDialog(parameters){
    if(parameters.type == 'outOfStock'){
      this.currentMovie = parameters.currentMovie;
      $("#outOfStockModal").modal('show');

    }
    else if(parameters.type == 'success'){
      this.currentMovie = parameters.currentMovie;
      this.quantity = parameters.quantity;
      $("#successModal").modal('show');
      setTimeout(function(){
        $("#successModal").modal('hide');
      },2000)      
    }
    else if(parameters.type == 'invalid quantity'){
      $("#invalidQuantityModal").modal('show');
    }
    else if(parameters.type == 'sign in error'){
      $("#signInErrorModal").modal('show');
    }
    else if(parameters.type == 'sign in success'){
      $("#signInSuccessModal").modal('show');
      this.username = parameters.name;
    }
    else if(parameters.type == 'image type error'){
      $("#imageTypeErrorModal").modal('show');
    }
    else if(parameters.type == 'movie deleted error'){
      $("#movieDeletedErrorModal").modal('show');
    }
    else if(parameters.type == 'cart movie deleted'){
      $("#cartMovieDeletedModal").modal('show');
      this.movieTitle = parameters.movieTitle;
    }
    else if(parameters.type == 'logout'){
      $("#logoutModal").modal('show');
    }
    else if(parameters.type == 'database error'){
      $("#databaseErrorModal").modal('show');
      this.message = parameters.message;
    }
    
    
  }

  goToLoginPage(){
    this.router.navigate(['/login']);
    $("#signInErrorModal").modal('hide');
  }

  goToSignUpPage(){
    this.router.navigate(['/sign-up']);
    $("#signInErrorModal").modal('hide');
  }

}
