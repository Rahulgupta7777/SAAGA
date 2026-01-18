import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ServiceItem, Product } from '../models/salon-data.model';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    type: 'service' | 'product';
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItems = new BehaviorSubject<CartItem[]>([]);
    cartItems$ = this.cartItems.asObservable();

    private cartTotal = new BehaviorSubject<number>(0);
    cartTotal$ = this.cartTotal.asObservable();

    addToCart(item: ServiceItem | Product, type: 'service' | 'product') {
        const currentItems = this.cartItems.value;
        const existingItem = currentItems.find(i => i.id === item.id);

        // Logic: If service, usually one quantity per booking, but simple counter here
        if (existingItem) {
            existingItem.quantity += 1;
            this.cartItems.next([...currentItems]);
        } else {
            const newItem: CartItem = {
                id: item.id,
                name: item.name,
                price: item.price || 0, // Handle price range logic later or assume base
                type,
                quantity: 1
            };
            this.cartItems.next([...currentItems, newItem]);
        }
        this.calculateTotal();
    }

    private calculateTotal() {
        const total = this.cartItems.value.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        this.cartTotal.next(total);
    }

    get count$() {
        // Return total item count
        return new BehaviorSubject(this.cartItems.value.reduce((acc, i) => acc + i.quantity, 0));
        // Note: simplifiction, better to mapping the observable
    }
}
