import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';

import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-grid-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {


  skeletonProducts: Product[] = Array(8).fill({}); // Create skeleton cards
 currentCategoryId:number=1;
 previousCategoryId: number = 1;
  products:Product[]=[];
  currentCategoryName: string = "";
  searchMode:boolean=false;
  previousKeyword: string = "";
  //new properties of pagination
  thePageNumber:number=1;
  thePageSize:number=5;
  theTotalElements:number=0;
  //injecting product service
  //injecting the current active route 
  constructor(
    private ProductService:ProductService,
    private route:ActivatedRoute,
    private cartService:CartService,
    
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
    this.getListProducts();
  });
  

  }
 
 
  getListProducts() {
    this.searchMode=this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handlesearchProducts();
    }
else{
  this.handleListProduct()
}
  }
  handlesearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!.trim();

    // if we have a different keyword than previous
    // then set thePageNumber to 1

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    // now search for the products using keyword
    this.ProductService.searchProductsPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               theKeyword).subscribe(this.processResult());
    
    // const theKeyword:string=this.route.snapshot.paramMap.get('keyword')!;
    // //now search for a product
    // this.ProductService.searchProduct(theKeyword).subscribe(
    //   data=>{
    //     this.products=data
    //   }
  
    //   )

  }

  handleListProduct(){
        //checking the availaible active route it has category id present or not
  const hascategoryId:boolean=this.route.snapshot.paramMap.has('id');

  //conerting into a number
  if(hascategoryId){
    this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
     // get the "name" param string
          this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;

  }
  else {
    // not category id available ... default to category id 1
    this.currentCategoryId = 1;
    this.currentCategoryName = 'Books';
  }
   // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed
    //

    // if we have a different category id than previous
    // then set thePageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

     // now get the products for the given category id
     this.ProductService.getListProductsPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId)
      .subscribe(
      this.processResult()                                  
      );




    //once you subscribe this method i=this method will invoke
    // this.ProductService.getListProducts(this.currentCategoryId).subscribe(
    // data=>{
    //   this.products=data
    // }

    // )

    

  }
  updatePageSize(pagesize: string) {
    this.thePageSize=+pagesize;
    this.thePageNumber=1;
    this.getListProducts();
    
  }
  processResult() {
    return (data: any) => {
      // Reset the skeleton loader by setting skeletonProducts to an empty array
      this.skeletonProducts = [];
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart : ${theProduct.name} , ${theProduct.unitPrice}` );

    const theCartItem=new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
    
    
    
    }
}
