// your js code goes here...
/*
appendchild
display: none, inline, block
visibility: hidden, visible
*/
// var span1 = document.createElement("span");
// span1.setAttribute("id", "span1");
// span1.style.display = "none";
// // span1.innerHTML = "Text";
// var username = document.getElementById("username");
// username.parentNode.insertBefore(span1, username.nextSibling);

var userspan = document.createElement("span");
var passspan = document.createElement("span");
var emailspan = document.createElement("span");
var username = document.getElementById("username");
var password = document.getElementById("password");
var email = document.getElementById("email");

userspan.setAttribute("id", "userspan");
userspan.style.display = "inline";
passspan.setAttribute("id", "userspan");
passspan.style.display = "inline";
emailspan.setAttribute("id", "userspan");
emailspan.style.display = "inline";

username.parentNode.insertBefore(userspan, username.nextSibling);
password.parentNode.insertBefore(passspan, password.nextSibling);
email.parentNode.insertBefore(emailspan, email.nextSibling);

username.onfocus = function(){
	userspan.innerHTML = "Enter alphanumeric characters only.";
	userspan.className = "info";
}

username.onblur = function(){
	let val = username.value;
	if(val.length>0){
		if(val.match(/^[a-zA-Z0-9]+$/)!=null){
		userspan.className = "ok";
		userspan.innerHTML = "OK";
	}
	else{
		userspan.className = "error";
		userspan.innerHTML = "Error";
		}
	}
	else{
		userspan.className = null;
		userspan.innerHTML = null;
	}
	
}

password.onfocus = function(){
	passspan.innerHTML = "Enter minimum six characters";
	passspan.className = "info";
}

password.onblur = function(){
	let val = password.value;
	if(val.length>0){
		if(val.length>5){
			passspan.className = "ok";
			passspan.innerHTML = "OK";
		}
		else{
			passspan.className = "Error";
			passspan.innerHTML = "error";
		}
	}
	else{
		passspan.className = null;
		passspan.innerHTML = null;
	}
}	

email.onfocus = function(){
	emailspan.innerHTML = "Enter valid email address";
	emailspan.className = "info";
}

email.onblur = function(){
	let val = email.value;
	if(val.length>0){
		if(val.match(/^\w+\@{1}\w+\.{1}\w+$/)){
		emailspan.className = "ok";
		emailspan.innerHTML = "OK";
	}
	else{
		emailspan.className = "error";
		emailspan.innerHTML = "Error";
		}
	}
	else{
		emailspan.className = null;
		emailspan.innerHTML = null;
	}
}