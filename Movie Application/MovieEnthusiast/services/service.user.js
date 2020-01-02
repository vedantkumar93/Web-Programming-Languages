const UserModel = require("../models/model.user");
const ErrorModel = require("../models/model.error");
const bcrypt = require('bcrypt');
const monk = require('monk');
var database = monk('localhost:27017/movieEnthusiast')
var usersCollection = database.get('users');
var ordersCollection = database.get('orders');
var moviesCollection = database.get('movies');

const databaseErrorMessage = "Error in connecting to MongoDB";
let Validator = require('fastest-validator');


let users = {};
let counter = 0;

/* create an instance of the validator */
let userValidator = new Validator();

/* use the same patterns as on the client to validate the request */
let passwordPattern = /[a-zA-Z\d$_@]+$/;
let phoneNumberPattern = /([\d{10}])/;;
/* user validator shema */
const userSchema = {		
		name: { type: "string", min: 1, max: 64},
		emailAddress: { type: "email"},
		phoneNumber: { type: "string",optional:true,pattern:phoneNumberPattern},
		password: { type: "string",  pattern: passwordPattern, min:6}
};



class UserService
{
	static addUser(data,res)
	{
		var validationErrors;
		//Validating the given input
		if(data.phoneNumber == ""){
			delete data.phoneNumber;
			validationErrors = userValidator.validate(data, userSchema);
		} else{
			validationErrors = userValidator.validate(data, userSchema);			
		}
		/* validation failed */		
		if(!(validationErrors === true))
		{
			let errors = [], item;

			for(const index in validationErrors)
			{
				item = validationErrors[index];
				errors.push(new ErrorModel(item.type,item.field,item.message));
			}
			console.log(data.phoneNumber);
			console.log(errors);
			return res.status(400).json({
			    type: "validation",
			    message: errors
			});
		}
		//Checking of the a user with the given email address already exists
		usersCollection.findOne({emailAddress: data.emailAddress}, function(err, user){
        	if (err) {
        		return res.status(400).json( {
			    type: "database",
			    message: databaseErrorMessage
				});		
        	}
        	//If the user already exists throw an error
			else if(user!=null) {
				return res.status(400).json( {
			    type: "exists",
			    message: "User with the given email address already exists"
				});	
			} 
			//If the user does not exist hash the user's password and add him to the database 
			else{
				let hashedPassword = bcrypt.hashSync(data.password, 10);
				let user = new UserModel(data.name,data.emailAddress,data.phoneNumber,hashedPassword);
		
    			usersCollection.insert(user, function(err, user){
        		if (err) {
        			return res.status(400).json({
			    	type: "database",
			    	message: databaseErrorMessage
					});		
        		}
			return res.status(201).json(user);        	
    		});
			}     	
    	});

		
    	
	}

	static login(data,res){
		usersCollection.findOne({emailAddress: data.emailAddress}, function(err, user){
        	if (err) {
        		return res.status(400).json( {
			    type: "database",
			    message: databaseErrorMessage
				});

        	}else if(user == null){
        		console.log("no such user");

        		return res.status(400).json( {
			    type: "authentication",
			    message: "Incorrect Email Address or Password"
				});
        	}else if(!bcrypt.compareSync(data.password, user.password)){
        		console.log("password is wrong");
        		return res.status(400).json( {
			    type: "authentication",
			    message: "Incorrect Email Address or Password"
				});        		
        	}
        	else{
        		return res.status(201).json(user);
        	}
        })
	}

	static getPurchaseHistory(userId,res){
		console.log('in service');
		usersCollection.findOne({_id: userId},{'fields': { 'purchaseHistory':1}},function(err, user){
        	if (err) {
        		return res.status(400).json( {
			    type: "database",
			    message: databaseErrorMessage
				});

        	}
        	else{
        		ordersCollection.find( { _id: { $in: user.purchaseHistory} },function(err,orders){
        			if (err) {
        				return res.status(400).json( {
			    		type: "database",
			    		message: databaseErrorMessage
					});
        			}	
        			else{

        				return res.status(201).json(orders);
        			}	
        		} )
        		
        	}
        })	
	}
}

module.exports = UserService;