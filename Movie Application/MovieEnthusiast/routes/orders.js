var express = require('express');
var router = express.Router();
var OrderService = require('../services/service.order');

router.post('/', function(req, res, next) {
	const body = req.body;
	try
	{
		OrderService.addOrder(body,res);
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

module.exports = router;
