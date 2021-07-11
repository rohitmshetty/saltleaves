import { pipe, Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { Product } from './models/product';
import { take, map } from 'rxjs/operators';
import { ShoppingCart } from './models/shopping-cart';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db : AngularFireDatabase) { }

  private create(){
    return this.db.list('/shopping-carts').push({
      dataCreated: new Date().getTime()      
    })
  }

  async getCart(): Promise<Observable<ShoppingCart>>{
    let cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId).valueChanges()
      .pipe(map((c: any) => {
        if(c) return new ShoppingCart(c.items)
        else return new ShoppingCart({});
    }));
  } 

   async getOrCreateCartId(){
    let cartId = localStorage.getItem('cartId');
    if(cartId) return cartId;
  
    let result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }

  private getItem(cartId: string, productId: string){
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  async addToCart(product: Product){
    this.updateItemQuantity(product, 1);
  }

  removeFromCart(product: Product){
      this.updateItemQuantity(product, -1);
  }

  private async updateItemQuantity(product: Product, change: number){
    let cartId = await this.getOrCreateCartId();
    let items =  this.getItem(cartId,product.key);
    let items$ = items.valueChanges();
    items$.pipe(take(1)).subscribe((item: any) => {
        if(item) {
          let quantity = item.quantity + change;
          if(quantity === 0) items.remove();
          else items.update({quantity: quantity});
        }
        else items.set({product:product, quantity:1})
    })
  }

  async clearCart(){
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/'+ cartId + '/items').remove();
  }
}
