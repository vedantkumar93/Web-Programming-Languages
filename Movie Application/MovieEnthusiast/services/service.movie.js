const monk = require('monk');
var database = monk('localhost:27017/movieEnthusiast')
var moviesCollection = database.get('movies');
const ErrorModel = require("../models/model.error");
const databaseErrorMessage = "Error in connecting to MongoDB";
var fs = require('fs');
var path = require('path');
let Validator = require('fastest-validator');
/* use the same patterns as on the client to validate the request */
let ratingPattern = /([0-9]+(\.[0-9]?)?)/;
let yearPattern = /([0-9]+)/;
let pricePattern = /([0-9]+(\.[0-9][0-9]?)?)/;
let quantityPattern = /([0-9]+)/;

/* create an instance of the validator */
let movieValidator = new Validator();

/* movie validator shema */
const movieSchema = {		
		title: { type: "string"},
		description: { type: "string"},
		rating: { type: "number",min:0,max:5,pattern:ratingPattern},
		year: { type: "number",min:1950,max:2019,pattern:yearPattern},
		director: { type: "array"},
		cast: { type: "array"},
		price: { type: "number",min:1,pattern:pricePattern},
		quantity: { type: "number",min:1,pattern:quantityPattern},
		inStock : { type: "boolean"},
		isDeleted : { type: "boolean"},
		genre : { type: "string"},
		image : { type: "string",optional:true}
};

class MovieService
{
	static getMovies(data,res)
	{
		var condition = [];
		condition.push({'isDeleted' : false})
		if(data.searchTerm && data.searchTerm != "") {
        condition.push({ 'title': { '$regex': data.searchTerm, '$options': 'i' } });
    	}


    	if(data.genre) {
    		if(typeof(data.genre) == "string"){
    			condition.push({'genre':data.genre});
    		}else{
    			var orCondition = [];
    			for(var i=0;i<data.genre.length;i++){       		
        			orCondition.push({'genre':data.genre[i]});        		
	        	}
	        	condition.push({$or : orCondition});
    		}
        	
    	}

    	if(data.year) {
    		if(typeof(data.year) == "string"){
    			condition.push({'year':parseInt(data.year)});
    		}else{
    			var orCondition = [];
    			for(var i=0;i<data.year.length;i++){       		
        			orCondition.push({'year':parseInt(data.year[i])});        		
	        	}
	        	condition.push({$or : orCondition});
    		}
        	
    	}
		
    	if(condition.length == 0) {
        	condition.push({});
    	}

    	console.log(condition);
 		moviesCollection.find({ $and: condition },{ 'fields': { 'title':1, 'image':1 , 'isDeleted':1 , 'price':1 ,'inStock':1,'quantity':1}}, function(err, movies){
		// moviesCollection.find({ $and: condition }).project({ title:1, image:1, isDeleted:1, price:1, inStock:1}).exec(function(err, movies){
        	if (err) {

        		return res.status(400).json( {
			    type: "database",
			    message: databaseErrorMessage
				});		
        	}
        	//console.log(movies);
        	return res.status(201).json(movies);
        })
	}

	static getGenres(data,res)
	{

		moviesCollection.distinct("genre",{'isDeleted' : false},function(err, genres){
        	if (err) {
        		return res.status(400).json( {
			    type: "database",
			    message: databaseErrorMessage
				});		
        	}
        	return res.status(201).json(genres);
        })	
	}

	static getYears(data,res)
	{
		moviesCollection.distinct("year",{'isDeleted' : false},function(err, years){
        	if (err) {
        		return res.status(400).json( {
			    type: "database",
			    message: databaseErrorMessage
				});		
        	}
        	return res.status(201).json(years);
        })	
	}

	static getMovie(movieId,res)
	{

		moviesCollection.findOne({_id:movieId},function(err, movie){
        	if (err) {
        		return res.status(400).json( {
			    type: "database",
			    message: databaseErrorMessage
				});		
        	}
        	return res.status(201).json(movie);
        })	
	}

	static addMovie(movie,res){
		console.log('here in add Movie');
		var validationErrors;
		console.log('here1');
		//Validating the given input
		validationErrors = movieValidator.validate(movie, movieSchema);			
		/* validation failed */
		console.log('here2');

		if(!(validationErrors === true))
		{
			console.log('here3');

			let errors = [], item;

			for(const index in validationErrors)
			{
				item = validationErrors[index];
				errors.push(new ErrorModel(item.type,item.field,item.message));
			}
			
			console.log(errors);
			return res.status(400).json({
			    type: "validation",
			    message: errors
			});
		}
		console.log('here4');
		var matches = movie.imageUrl.match(/^data:.+\/(.+);base64,(.*)$/);
		var ext = matches[1];
		var base64_data = matches[2];
		var buffer = new Buffer(base64_data, 'base64');
		console.log(buffer);
		var baseImageUrl = "./public/images/";
		fs.writeFile(baseImageUrl+movie.image, buffer, (err) => {
  		 	if (err) {
  		 		console.log("in error");
  		 		console.log(err);
        			return res.status(400).json({
			    	type: "file write",
			    	message: "Cannot write image"
					});		
        	}
  			console.log('The file has been saved!');
  			delete movie.imageUrl;
  			console.log(movie);
  			moviesCollection.insert(movie, function(err, movie){
        		if (err) {
        			return res.status(400).json({
			    	type: "database",
			    	message: databaseErrorMessage
					});		
        		}
			return res.status(201).json(movie);        	
    		})	
		});
			
	}

	static editMovie(movie,res){
		var validationErrors;
		//Validating the given input
		validationErrors = movieValidator.validate(movie, movieSchema);			
		/* validation failed */

		if(!(validationErrors === true))
		{
			let errors = [], item;

			for(const index in validationErrors)
			{
				item = validationErrors[index];
				errors.push(new ErrorModel(item.type,item.field,item.message));
			}
			
			console.log(errors);
			return res.status(400).json({
			    type: "validation",
			    message: errors
			});
		}

		console.log('after validation');
		if(movie.imageUrl){
		console.log('in if');
		var matches = movie.imageUrl.match(/^data:.+\/(.+);base64,(.*)$/);
		var ext = matches[1];
		var base64_data = matches[2];
		var buffer = new Buffer(base64_data, 'base64');
		var baseImageUrl = "./public/images/";
		fs.writeFile(baseImageUrl+movie.image, buffer, (err) => {
  		 	if (err) {
        			return res.status(400).json({
			    	type: "file write",
			    	message: "Cannot write image"
					});		
        	}
  			delete movie.imageUrl;
  			var movieId = movie._id;
  			delete movie._id;
  			moviesCollection.findOneAndUpdate({_id : movieId},
       			{ $set: movie},function(err, movie){
        		if (err) {
        			return res.status(400).json({
			    	type: "database",
			    	message: databaseErrorMessage
					});		
        		}
			return res.status(201).json(movie);        	
    		})	
		});
		}else{
			console.log("in else");
			var movieId = movie._id;
  			delete movie._id;
  			console.log('deleted movie id');
  			moviesCollection.findOneAndUpdate({_id : movieId},
       			{ $set: movie},function(err, movie){
        		if (err) {
        			return res.status(400).json({
			    	type: "database",
			    	message: databaseErrorMessage
					});		
        		}
			return res.status(201).json(movie);        	
    		})
		}
			
	
	}

	static deleteMovie(data,res){
		console.log(data);
		moviesCollection.findOneAndUpdate({_id : data.id},
       			{ $set: {'isDeleted':true}},function(err, movie){
        		if (err) {
        			return res.status(400).json({
			    	type: "database",
			    	message: databaseErrorMessage
					});		
        		}
			return res.status(201).json(movie);        	
    		})
	}

}

module.exports = MovieService;