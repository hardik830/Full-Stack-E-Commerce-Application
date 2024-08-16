import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {





  cartItems:CartItem[]=[];
  totalPrice:number=0;
  totalQuantity:number=0;

  constructor(private cartService:CartService) { }

  ngOnInit(): void {

    this.listCartDetails();
  }
  listCartDetails() {
    
    //initiallize array from cart service 
    this.cartItems=this.cartService.cartItems;
    //subscribe to the totalprice
    this.cartService.totalPrice.subscribe(
      data=>this.totalPrice=data
    );
    //subscribe to the totalQuantity

    this.cartService.totalQuantity.subscribe(
      data=>this.totalQuantity=data
    );
//now computing totalprice and totalquantity
this.cartService.computeCartTotals();

  }

  incrementQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  
  }

  decrementQuantity(cartItem: CartItem) {
    this.cartService.decrementQuantity(cartItem);

  }
  removeItem(cartItem: CartItem) {
   this.cartService.remove(cartItem);
    }

}
