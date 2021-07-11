import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private db: AngularFireDatabase) { }

  getCategories(){
    return this.db.list('categories', ref=> ref.orderByChild('name'))
    .snapshotChanges()
    .pipe(map(actions => {
      return actions.map(snap => {
        let key = snap.payload.key;
        let data = { key, ...snap.payload.val() };
        return data;
      })
    }));;
  }
}
