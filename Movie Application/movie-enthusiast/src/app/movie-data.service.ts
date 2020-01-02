import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { ninvoke } from 'q';


@Injectable({
  providedIn: 'root'
})
export class MovieDataService {

  constructor(private http: HttpClient) { }
  moviesApiUrl = "/api/movies/";
  searchTerm = "";
  filters =[];
  getMovies(data){
    var params = new HttpParams().set('searchTerm', data.searchTerm)
    for(let filter of data.filters){
      params= params.append(filter.type,filter.value.toString());
    }
    return this.http.get(this.moviesApiUrl, {params});
  }

  getGenres(){
    return this.http.get(this.moviesApiUrl+'genres');
  }

  getYears(){
    return this.http.get(this.moviesApiUrl+'years');
  }

  getImageUrl(){
    return 'http://localhost:3000/images/';
  }

  getMovie(movieId){
    return this.http.get(this.moviesApiUrl+movieId);
  }

  addMovie(movie,imageUrl){
    //pre processing the data
    movie.rating = parseFloat(movie.rating.toFixed(1));
    movie.year = parseInt(movie.year);
    movie.duration = parseInt(movie.duration);
    movie.price = parseFloat(movie.price.toFixed(2));
    movie.quantity = parseInt(movie.quantity);
    movie.cast = movie.cast.toString();
    if(movie.cast.includes(',')){
      movie.cast = movie.cast.split(",");
    }else{
      var cast = [];
      cast.push(movie.cast);
      movie.cast = cast;
    }
    movie.director = movie.director.toString();
    if(movie.director.includes(',')){
      movie.director = movie.director.split(",");
    }else{
      var director = [];
      director.push(movie.director);
      movie.director = director;
    }
    movie.image =movie.image.replace("C:\\fakepath\\", "");
    movie.imageUrl = imageUrl;
    if(movie.inStock == "true"){
      movie.inStock = true;
    }else{
      movie.inStock = false;
    }
    if(movie.isDeleted == "true"){
      movie.isDeleted = true;
    }else{
      movie.isDeleted = false;
    }
    console.log(movie);
    return this.http.post(this.moviesApiUrl,movie);
  }

  updateMovie(movie,movieId,imageChanged,imageUrl){
      //pre processing the data
      movie._id = movieId;
      movie.rating = parseFloat(movie.rating.toFixed(1));
      movie.year = parseInt(movie.year);
      movie.duration = parseInt(movie.duration);
      movie.price = parseFloat(movie.price.toFixed(2));
      movie.quantity = parseInt(movie.quantity);
      movie.cast = movie.cast.toString()
      if(movie.cast.includes(',')){
        movie.cast = movie.cast.split(",");
      }else{
        var cast = [];
        cast.push(movie.cast);
        movie.cast = cast;
      }
      movie.director = movie.director.toString()
      if(movie.director.includes(',')){
        movie.director = movie.director.split(",");
      }else{
        var director = [];
        director.push(movie.director);
        movie.director = director;
      }
      if(imageChanged){
        movie.image =movie.image.replace("C:\\fakepath\\", "");
        movie.imageUrl = imageUrl;
      }
      else{
        delete movie.image;
      }
      if(movie.inStock == "true"){
        movie.inStock = true;
      }else{
        movie.inStock = false;
      }
      if(movie.isDeleted == "true"){
        movie.isDeleted = true;
      }else{
        movie.isDeleted = false;
      }
      var params = new HttpParams().set('_method', 'put');
      var options ={'params': params};
      return this.http.post(this.moviesApiUrl,movie,options);
  }

  
  deleteMovie(movieId){
    var params = new HttpParams().set('_method', 'delete');
    var options ={'params': params};
    return this.http.post(this.moviesApiUrl,{'id' :movieId},options);
  }

  setSearchTerm(searchTerm){
    this.searchTerm = searchTerm;
  }

  setFilters(filters){
    this.filters = filters;
  }

  getFilters(){
    return this.filters;
  }

  getSearchTerm(){
    return this.searchTerm;
  }
}
