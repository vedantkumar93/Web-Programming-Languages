var express = require('express');
var router = express.Router();
var MovieService = require('../services/service.movie');

router.post('/', function(req, res, next) {
	console.log('in post');
	const body = req.body;
	try
	{
		MovieService.addMovie(body,res);
	}
	catch(err)
	{
		return next(err);
	}

});

router.put('/', function(req, res, next) {
	console.log('in put');
	const body = req.body;
	try
	{
		MovieService.editMovie(body,res);
	}
	catch(err)
	{
		return next(err);
	}

});

router.delete('/', function(req, res, next) {
	console.log('in delete');
	const body = req.body;
	try
	{
		MovieService.deleteMovie(body,res);
	}
	catch(err)
	{
		return next(err);
	}

});



router.get('/', function(req, res, next) {
	try
	{
		MovieService.getMovies(req.query,res);
	}
	catch(err)
	{
		return next(err);
	}

});


router.get('/genres', function(req, res, next) {
	const body = req.body;
	try
	{
		MovieService.getGenres(body,res);
	}
	catch(err)
	{
		return next(err);
	}

});

router.get('/years', function(req, res, next) {
	const body = req.body;
	try
	{
		MovieService.getYears(body,res);
	}
	catch(err)
	{
		return next(err);
	}

});

router.get('/:id', function(req, res, next) {
	console.log("here in id");
	try
	{
		MovieService.getMovie(req.params.id,res);
	}
	catch(err)
	{
		return next(err);
	}

});



module.exports = router;