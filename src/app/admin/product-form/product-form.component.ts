import { Product } from './../../models/product';
import { ProductService } from './../../product.service';
import { CategoryService } from './../../category.service';
import { Component, OnInit } from '@angular/core';
import { take, map, retryWhen } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  categories$: Observable<any[]>;
  product: Product={key: '',title: '',price: 0,category: '',imageUrl: ''};
  id;

  constructor(
    private router : Router,
    private activatedRoute : ActivatedRoute,
    private categoryService: CategoryService, 
    private productService: ProductService) { 
    this.categories$ = categoryService.getCategories();
    
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.id) {this.productService.get(this.id).pipe(take(1)).subscribe(p => this.product = p);
    console.log(this.product)}
  }

  ngOnInit() {
  }

  save(product){
    if(this.id) this.productService.update(this.id, product) 
    else this.productService.create(product);

    this.router.navigate(['/admin/products']);
  }

  delete(){
    if(!confirm('Are your sure you want to delete this product?')) return;

    this.productService.delete(this.id);
    this.router.navigate(['/admin/products']);

  }
}
