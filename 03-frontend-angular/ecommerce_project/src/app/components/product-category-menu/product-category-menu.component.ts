import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCatogeries:ProductCategory[]=[];
  selectedCategory!: ProductCategory | undefined;

  constructor(private productService:ProductService) { }

  ngOnInit(): void {
    this.listProductCategories();
    
  }
  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log('Product Categories = ' +JSON.stringify(data));
        this.productCatogeries=data
      },
    
    );
  }
    // Function to set the selected category
    setSelectedCategory(category: ProductCategory) {
      this.selectedCategory = category;
    }
  }


