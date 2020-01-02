export class Movie {
    id: string;
    price: any;
    title: string;
    image: string;
    quantity:any;
    stock:any;
    totalAmount: any;
    
     constructor(id,title,image,price,quantity,stock){
         this.id =id;
         this.price= price;
         this.title = title;
         this.image = image;
         this.quantity = quantity;
         this.stock = stock;
         this.totalAmount = parseFloat((price * quantity).toFixed(2));
    }
}