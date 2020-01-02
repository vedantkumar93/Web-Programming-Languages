var express = require('express');
var router = express.Router();
var UserService = require('../services/service.user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:id/purchaseHistory', function(req, res, next) {
  console.log('in purchase history');
  try
	{
		UserService.getPurchaseHistory(req.params.id,res);
	}
	catch(err)
	{
		return next(err);
	}
});



router.post('/', function(req, res, next) {
	const body = req.body;
	try
	{
		UserService.addUser(body,res);
	}
	catch(err)
	{
		console.log(err);
		if (err.type === 'validation' || err.type === 'database' || err.type === 'exists')
		{
        	return res.status(400).json(err);
		}

		// unexpected error
		return next(err);
	}
});

router.post('/login', function(req, res, next) {
	const body = req.body;
	// console.log('login');
	try
	{
		UserService.login(body,res);
	}
	catch(err)
	{
		console.log(err);
		if (err.type === 'authentication' || err.type === 'database' )
		{
        	return res.status(400).json(err);
		}

		// unexpected error
		return next(err);
	}
});


module.exports = router;
