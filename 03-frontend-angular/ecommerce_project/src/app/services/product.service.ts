import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { finalize, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
 

  
 

  private baseUrl = environment.luv2shopApiUrl + '/products';

  private categoryUrl = environment.luv2shopApiUrl + '/product-category';


  //now injecting the service


  constructor(private httpClient:HttpClient,) { }

 

  getListProducts(categoryIdNumber:number):Observable<Product[]>{
     //build url based on this getting the category id
     const searchUrl=`${this.baseUrl}/search/findByCategoryId?id=${categoryIdNumber}`;
     return this.getProducts(searchUrl);
   
    
  }

  searchProductsPaginate(thePage: number, 
    thePageSize: number, 
    theKeyword: string): Observable<GetResponseProduct> {

// need to build URL based on keyword, page and size 
const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
+ `&page=${thePage}&size=${thePageSize}`;

return this.httpClient.get<GetResponseProduct>(searchUrl);
}

  

  getListProductsPaginate(
    thePage:number,
    thePageSize:number,
    categoryIdNumber:number):Observable<GetResponseProduct>{
    //build url based on this getting the category id
    const searchUrl=`${this.baseUrl}/search/findByCategoryId?id=${categoryIdNumber}`
                    + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
   
 }


  getProductCategories() :Observable<ProductCategory[]>{
    

   return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
     map(
       response=>response._embedded.productCategory
     )
   )
 }

 searchProduct(theKeyword: string):Observable<Product[]> {
  const searchUrl=`${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
}

getProduct(productId: number): Observable<Product> {
  const productUrl=`${this.baseUrl}/${productId}`
  return this.httpClient.get<Product>(productUrl)
 
}

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(
        response => response._embedded.products
      )
    );
  }
}
//define what type of GetResponseProduct
interface GetResponseProduct{
  _embedded:{
    products:Product[]
  },
  page: {
  size: number,
  totalElements: number,
  totalPages: number,
  number: number
  }
}

interface GetResponseProductCategory{
  _embedded:{
    productCategory:ProductCategory[]
  }
}

