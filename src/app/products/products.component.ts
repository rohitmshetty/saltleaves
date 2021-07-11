import { ShoppingCart } from './../models/shopping-cart';
import { Product } from './../models/product';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from './../category.service';
import { ProductService } from './../product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { pipe, Subscription, Observable } from 'rxjs';
import { AngularFireList } from '@angular/fire/database';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy{
  products: any[];
  subscription: Subscription;
  paramSub : Subscription;
  //cartSub : Subscription;
  filteredProducts: any[]=[];
  category;
  cart$: Observable<ShoppingCart>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private shoppingCartService : ShoppingCartService) { }

   async ngOnInit(){
        this.cart$ = (await this.shoppingCartService.getCart())
          //.subscribe(cart => this.cart = cart);
        this.populateProducts();
   }

   private populateProducts(){
    this.paramSub = this.route.queryParamMap
    .subscribe(params =>  {
      this.category = params.get('category');
      this.subscription = this.productService.getAll()
        .subscribe(p => {
          this.products = p;
            this.applyFilter();
       });
    });
   }

   private applyFilter(){
    this.filteredProducts = (this.category)? 
      this.products.filter(p => p.category === this.category):
        this.products;
   }

   ngOnDestroy(){
      this.subscription.unsubscribe();
      this.paramSub.unsubscribe();
      //this.cartSub.unsubscribe();
   }
}
