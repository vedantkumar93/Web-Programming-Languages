class ErrorModel
{
	constructor(type,field,message)
	{
		this.type = type;
		this.field = field;
		this.message = message;
	}

}

module.exports = ErrorModel;