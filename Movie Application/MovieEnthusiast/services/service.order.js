const monk = require('monk');
var database = monk('localhost:27017/movieEnthusiast')
var moviesCollection = database.get('movies');
var usersCollection = database.get('users');
var ordersCollection = database.get('orders');
var vm ;
const databaseErrorMessage = "Error in connecting to MongoDB";

class OrderService
{

	static addOrder(data,res){
		var user = data.user;
		var cart = data.cart;
		var totalAmount = data.totalAmount;
		var currentOrder;
		var insertOrder = this.insertOrder;
		this.updateStock(cart,res,function(){
			insertOrder(cart,totalAmount,res,function(order){
				currentOrder = order;
				usersCollection.findOneAndUpdate({_id : user._id},
       			{ $push: { purchaseHistory : order._id}}, function(err, user){
       				return res.status(201).json(currentOrder);
       			})
			})
		});
	}

	static updateStock(cart,res,callback){
		// var i=0;
		// var previous = false;
		var feedback = cart.length;
		for(var i=0;i<cart.length;i++){
			var quantityLeft = cart[i].stock - cart[i].quantity;
			var setObject = {} ;
			if(quantityLeft == 0){
				setObject={quantity : quantityLeft, inStock : false};
			}
			else{
				setObject={quantity : quantityLeft};				
			}
			moviesCollection.findOneAndUpdate({_id : cart[i].id},
       			{ $set: setObject}, function(err, movie){
        		if (err) {
        		console.log('error');
        		return res.status(400).json( {
			    type: "database",
			    message: databaseErrorMessage
				});		
        		}
        		console.log('done');
        		feedback--;
        		if(feedback == 0){
       	 			callback();
        		}
    		});
			
		}
		

	}

	static insertOrder(cart,totalAmount,res,callback){
		var date_ob = new Date();
		// current date
		// adjust 0 before single digit date
		var date = ("0" + date_ob.getDate()).slice(-2);
		// current month
		var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
		// current year
		var year = date_ob.getFullYear();
		// current hours
		var hours = date_ob.getHours();
		// current minutes
		var minutes = date_ob.getMinutes();		
		var currentDate =year + "-" + month + "-" + date;
		var currentTime = hours + ":" + minutes;
		var itemList =[];
		for(var i=0;i<cart.length;i++){
			itemList.push({
				id : cart[i].id,
				title : cart[i].title,
				image : cart[i].image,
				price : cart[i].price,
				quantity : cart[i].quantity
			});
		}
		console.log(itemList);
		var orderObject ={ date : currentDate,
							time : currentTime,
							totalAmount : totalAmount,
							items : itemList};
		console.log(orderObject);
		ordersCollection.insert(orderObject, function(err, order){
        		if (err) {
        			return res.status(400).json({
			    	type: "database",
			    	message: databaseErrorMessage
					});		
        		}
        	console.log('done');
			callback(order);        	
    	});

	}

}

module.exports = OrderService;