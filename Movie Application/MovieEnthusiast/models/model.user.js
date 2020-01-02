class UserModel
{
	constructor(name,emailAddress,phoneNumber,password)
	{
		this.name = name;
		this.emailAddress = emailAddress;
		this.password = password;
		this.phoneNumber = phoneNumber;
		this.purchaseHistory = [];
		this.isAdmin = false;
	}
}

module.exports = UserModel;