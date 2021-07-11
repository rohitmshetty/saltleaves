import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { map , take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFireDatabase) { }

  create(product){
    return this.db.list('/products').push(product);
  }

  getAll(){
    return this.db.list('/products').snapshotChanges()
    .pipe(map(actions => {
      return actions.map(snap => {
        let key = snap.payload.key;
        let data = { key, ...snap.payload.val() };
        return data;
      })
    }));
  }

  //getProducts(){
  //  return this.db.list('products/').valueChanges();
  //}

  get(productId): Observable<any>{
    return this.db.object('products/'+productId).valueChanges()
  }

  update(productId, product){
    return this.db.object('/products/'+ productId).update(product);
  }

  delete(productId){
    return this.db.object('/products/'+ productId).remove();
  }
}
