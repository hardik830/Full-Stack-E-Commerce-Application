import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  

  cartItems:CartItem[]=[];

  //making the subscribers for toatalprice and quantity
  //and it will recieve by performing some events
  //the addtocart perform

  totalPrice:Subject<number>=new BehaviorSubject<number>(0);
  totalQuantity:Subject<number>=new BehaviorSubject<number>(0);

storage:Storage=localStorage

  constructor() {
    //read data from local storage of browser
   let data=JSON.parse( this.storage.getItem('cartItems')!);

   if(data!=null){
    this.cartItems=data;
   }
   //now compute totals that is recived from stotage
   this.computeCartTotals();
   }
  

  addToCart(theCartItem:CartItem){
    //check if the item is already present in the cart
    let alreadyExistsInCart:boolean=false;
    let exsistingCartItem:CartItem=undefined;

//if it is present then find item and increase the quantity
    //find the item in the cart with item id

  if(this.cartItems.length>0){

    exsistingCartItem=this.cartItems.find(tempCartItem =>tempCartItem.id===theCartItem.id );

    // for(let tempCartItem of this.cartItems){
    //   if(tempCartItem.id===theCartItem.id){
    //     exsistingCartItem=tempCartItem;
    //     break;
    //   }
    // }

    //check if we found it
    alreadyExistsInCart=(exsistingCartItem!=undefined);
  }
  //if we found same item in the cart then increament the quantity
  if(alreadyExistsInCart){
    exsistingCartItem.quantity++;
  }else{
    //add item in the cart
    this.cartItems.push(theCartItem);
  }

  //compute the totalprice and quantity
  this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue:number=0;
    let totalQuantityValue:number=0;


    for(let currentCartItem of this.cartItems){
      totalPriceValue+=currentCartItem.quantity*currentCartItem.unitPrice;
      totalQuantityValue+=currentCartItem.quantity;
    }

    //now publish this calcualated values which subscribe thi cart service
    //which accepting the value add update the cart element in ui
    //publishing these values to all subscribers
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //checking this value for debugging purposes
    this.logCartData(totalPriceValue,totalQuantityValue);
    this.persistsCartItems();
  }
  persistsCartItems(){
    this.storage.setItem('cartItems',JSON.stringify(this.cartItems));
   }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }

  decrementQuantity(cartItem: CartItem) {
    //decrease the quantity
    cartItem.quantity--;

    if(cartItem.quantity===0){
      this.remove(cartItem);
    }else{
      this.computeCartTotals();
    }
  
  }
  remove(cartItem: CartItem) {
 //find index in the cartItems array then remove by splice method

 let cartItemIndex=this.cartItems.findIndex((tempItem)=>tempItem.id==cartItem.id);

 if(cartItemIndex>-1){
  //then remove by a index
  this.cartItems.splice(cartItemIndex,1);
  this.computeCartTotals();
 }

 
  }

 
}
