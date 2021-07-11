import { Product } from './product';
import { ShoppingCartItem } from './shopping-cart-item';
export class ShoppingCart{
    items: ShoppingCartItem[] = [];

    constructor(private itemsMap: {[productId: string]: ShoppingCartItem}){
        for(let productId in itemsMap){
            let item = itemsMap[productId];
            this.items.push(new ShoppingCartItem(item.product, item.quantity))
        }
    }

    get totolPrice(){
        let sum=0;
        for(let productId in this.items)
            sum += this.items[productId].totalPrice;
        return sum;    
    }

    get totalItemsCount() {
        let count=0;
        for(let productId in this.items)
            count += this.items[productId].quantity;
        return count;
    }

    getQuantity(product : Product){
        let item;
        if(this.itemsMap) 
            item =this.itemsMap[product.key];
        return item ? item.quantity : 0;
    }
}