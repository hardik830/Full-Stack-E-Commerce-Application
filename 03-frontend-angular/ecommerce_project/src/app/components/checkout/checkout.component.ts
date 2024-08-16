import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2shopformService } from 'src/app/services/luv2shopform.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {



  checkOutFormGroup:FormGroup;

  
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonth:number[]=[];
  creditCardYear:number[]=[];

  //Countries and states

  countries:Country[]=[];
  states:State[]=[];
  //showing billing address states
  //and shipping adrress states dropdowns

  shippingAddressStates:State[]=[];
  billingAddressStates:State[]=[];

  storage:Storage=sessionStorage;
  
  // initialize Stripe API
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";
  isDisabled: boolean = false;


  constructor(private formBuilder:FormBuilder,
              private luv2shopService:Luv2shopformService,
              private cartService:CartService,
              private checkoutService: CheckoutService,
              private router: Router
  ) { }

  ngOnInit(): void {

     // setup Stripe payment form
     this.setupStripePaymentForm();
    //retrieve the stored email during the login which stored at web session storage

    const  theEmail= JSON.parse(this.storage.getItem('userEmail')!)

    this.checkOutFormGroup=this.formBuilder.group({
      //name of groupform is customer and key of this group 'customer'
      customer:
      //then define its fied
      this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
           Validators.minLength(2),
           Luv2ShopValidators.notOnlyWhiteSpaces]),

        lastName:  new FormControl('', [
          Validators.required,
           Validators.minLength(2)
          ,Luv2ShopValidators.notOnlyWhiteSpaces
        ]),

        email: new FormControl(theEmail,
                              [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),

      }),
      shippingAddress: this.formBuilder.group({
        street:  new FormControl('', [
          Validators.required,
           Validators.minLength(2),
           Luv2ShopValidators.notOnlyWhiteSpaces]),

        city:  new FormControl('', [
          Validators.required,
           Validators.minLength(2),
           Luv2ShopValidators.notOnlyWhiteSpaces]),

        state: new FormControl('', [
          Validators.required,],),

        country: new FormControl('', [
          Validators.required,],),

        zipCode:  new FormControl('', [
          Validators.required,
           Validators.minLength(2),
           Luv2ShopValidators.notOnlyWhiteSpaces]),
      }),
      billingAddress: this.formBuilder.group({
        street:  new FormControl('', [
          Validators.required,
           Validators.minLength(2),
           Luv2ShopValidators.notOnlyWhiteSpaces]),

        city:  new FormControl('', [
          Validators.required,
           Validators.minLength(2),
           Luv2ShopValidators.notOnlyWhiteSpaces]),

        state: new FormControl('', [
          Validators.required,],),

        country: new FormControl('', [
          Validators.required,],), 

        zipCode:  new FormControl('', [
          Validators.required,
           Validators.minLength(2),
           Luv2ShopValidators.notOnlyWhiteSpaces]),

      }),
      creditCard: this.formBuilder.group({

        // cardType: new FormControl('', [Validators.required]),
        // nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), 
        //   Luv2ShopValidators.notOnlyWhiteSpaces]),
        // cardNumber: new FormControl('', [Validators.required, Validators.pattern( '^[0-9]{16}$')]),
        // securityCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$')]),
        // expirationMonth: [''],
        // expirationYear: ['']

      })
    });


    //now populate credit months

    // let startMonth:number= new Date().getMonth()+1;
    // console.log(`Current Month : ${startMonth}`);
    
    // this.luv2shopService.getCreditCardMonth(startMonth).subscribe(
    //   data =>{ this.creditCardMonth=data}
    // );

    // //now populate the years
    // this.luv2shopService.getCreditCardYears().subscribe(
    //   data=>{
    //     console.log("Retrived credit card years"+JSON.stringify(data));
        
    //     this.creditCardYear=data;
    //   }
    // );


    //now populate countries and state
    this.luv2shopService.getCountries().subscribe(
      data=>{
        console.log("Retrieved Countries :"+JSON.stringify(data));
        
        this.countries=data;
      }
    );


   
    this.reviewCartsDetails();

    
  }

  setupStripePaymentForm() {

    // get a handle to stripe elements
    var elements = this.stripe.elements();

    // Create a card element ... and hide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // Add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    // Add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {

      // get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        // show validation error to customer
        this.displayError.textContent = event.error.message;
      }

    });

  }

  reviewCartsDetails() {
    this.cartService.totalPrice.subscribe(
      data=>this.totalPrice=data
    )

    this.cartService.totalQuantity.subscribe(
      data=>this.totalQuantity=data
    )
  }
//acessing the fields to show some error message for invalid validations
//that are applied ont his field
  get firstName() { return this.checkOutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkOutFormGroup.get('customer.lastName'); }
  get email() { return this.checkOutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkOutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkOutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkOutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkOutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkOutFormGroup.get('shippingAddress.country'); }

  
  get billingAddressStreet() { return this.checkOutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkOutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkOutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkOutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkOutFormGroup.get('billingAddress.country'); }

  
  get creditCardType() { return this.checkOutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkOutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkOutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkOutFormGroup.get('creditCard.securityCode'); }

 

  


  copyShippingAddressToBillingAddress(event) {
 
    if (event.target.checked) {
      this.checkOutFormGroup.controls['billingAddress']
            .setValue(this.checkOutFormGroup.controls['shippingAddress'].value);
 
       // bug fix for states
       this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkOutFormGroup.controls['billingAddress'].reset();
 
      // bug fix for states
      this.billingAddressStates = [];
    }
   
  }


  onSubmit(){
    //method called when submit button is clicked
        console.log('Handling the submit Button');
    console.log(this.checkOutFormGroup.get('customer').value);

    if (this.checkOutFormGroup.invalid) {
      this.checkOutFormGroup.markAllAsTouched();
      return;
    }
 // set up order
 let order = new Order(this.totalQuantity, this.totalPrice);

 // get cart items
 const cartItems = this.cartService.cartItems;
//make an orderItems
 let orderItems:OrderItem[]= cartItems.map(cartItem => new OrderItem(cartItem));
 //setup purchase
 let purchase=new Purchase();
   // populate purchase - customer
   purchase.customer = this.checkOutFormGroup.controls['customer'].value;
    // populate purchase - shipping address
    purchase.shippingAddress = this.checkOutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkOutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;
  
    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;
      // compute payment info
      this.paymentInfo.amount = Math.round(this.totalPrice * 100);
      this.paymentInfo.currency = "USD";
      this.paymentInfo.receiptEmail = purchase.customer.email;

      console.log(`Amount is :${this.paymentInfo.amount}`)
  
      // if valid form then
      // - create payment intent
      // - confirm card payment
      // - place order

      if (!this.checkOutFormGroup.invalid && this.displayError.textContent === "") {

        this.isDisabled = true;

        this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
          (paymentIntentResponse) => {
            this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
              {
                payment_method: {
                  card: this.cardElement,
                  billing_details: {
                    email: purchase.customer.email,
                    name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                    address: {
                      line1: purchase.billingAddress.street,
                      city: purchase.billingAddress.city,
                      state: purchase.billingAddress.state,
                      postal_code: purchase.billingAddress.zipCode,
                      country: this.billingAddressCountry.value.code,
                      

                    }
                  }
                }
              }, { handleActions: false })
            .then((result: any) => {
              if (result.error) {
                // inform the customer there was an error
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
              } else {
                // call REST API via the CheckoutService
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
  
                    // reset cart
                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error: (err: any) => {
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled = false;
                  }
                })
              }            
            });
          }
        );
      } else {
        this.checkOutFormGroup.markAllAsTouched();
        return;
      }




  //   // call REST API via the CheckoutService
  //   this.checkoutService.placeOrder(purchase).subscribe({
  //     next: response => {
  //       alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

  //       // reset cart
  //       this.resetCart();

  //     },
  //     error: err => {
  //       alert(`There was an error: ${err.message}`);
  //     }
  //   }
  // );



  
    
    
  }
  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistsCartItems();
    
    // reset the form
    this.checkOutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");
  }


  handleMonthAndYear() {
   
    let creditCardCheckoutForm =this.checkOutFormGroup.get('creditCard');

    let currentYear:number=new Date().getFullYear();

    let selectedYear:number= Number(creditCardCheckoutForm.value.expirationYear);

    let startMonth:number;
    if(currentYear===selectedYear){
      startMonth=new Date().getMonth()+1;
    }else{
      startMonth=1;
    }

    this.luv2shopService.getCreditCardMonth(startMonth).subscribe(
      data=>{
        this.creditCardMonth=data;
      }
    )


    }

    getStates(formGroupName: string) {
      const formGroup = this.checkOutFormGroup.get(formGroupName);

      const countryCode = formGroup.value.country.code;
      const countryName = formGroup.value.country.name;
  
      console.log(`${formGroupName} country code: ${countryCode}`);
      console.log(`${formGroupName} country name: ${countryName}`);
 
       

      this.luv2shopService.getStates(countryCode).subscribe(
        data=>{
          if (formGroupName === 'shippingAddress') {
            this.shippingAddressStates = data; 
          }
          else {
            this.billingAddressStates = data;
          }
  
          // select first item by default
          formGroup.get('state').setValue(data[0]);
        }
      );
   
      }

 

}
