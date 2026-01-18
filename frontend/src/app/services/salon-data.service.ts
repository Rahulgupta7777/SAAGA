import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServiceCategory, Product, Offer } from '../models/salon-data.model';

@Injectable({
    providedIn: 'root'
})
export class SalonDataService {

    private services: ServiceCategory[] = [
        {
            id: 'nails',
            title: 'Nails & Artistry',
            description: 'Nurture your nails with artistry that speaks to your soul.',
            items: [
                { id: 'n1', name: 'French/Ombre Extensions', price: 2000 },
                { id: 'n2', name: 'Chrome Extensions', price: 2000 },
                { id: 'n3', name: 'Cat Eye Extensions', price: 2000 },
                { id: 'n4', name: 'Acrylic/Gel Extensions', priceRange: '1700/1500' },
                { id: 'n5', name: 'Acrylic/Gel Refill', priceRange: '1400/1200' },
                { id: 'n6', name: 'Gel Overlays', price: 1000 },
                { id: 'n7', name: 'Gel Polish (Hands)', price: 700 },
                { id: 'n8', name: 'Gel Polish (Feet)', price: 600 },
                { id: 'n9', name: 'Acrylic Removal (Hands/Feet)', price: 600 },
                { id: 'n10', name: 'Gel Removal (Hands/Feet)', price: 500 },
                { id: 'n11', name: 'Gel Polish Removal', price: 300 },
                { id: 'n12', name: '3D/Chrome/Stones Art', price: 100, unit: 'PF' }, // PF = Per Finger
                { id: 'n13', name: 'Nail Art', price: 50, unit: 'PF' }
            ]
        },
        {
            id: 'hair-his',
            title: 'Hair (His)',
            description: 'Precision cuts and styling for the modern gentleman.',
            items: [
                { id: 'hh1', name: 'Creative Haircut', price: 500 },
                { id: 'hh2', name: 'Standard Haircut', price: 300 },
                { id: 'hh3', name: 'Baby Boy Haircut', price: 300 },
                { id: 'hh4', name: 'Styling', price: 200 },
                { id: 'hh5', name: 'Beard Shave/Trim', price: 200 }
            ]
        },
        {
            id: 'hair-her',
            title: 'Hair (Her)',
            description: 'Flowing, vibrant, and uniquely yours.',
            items: [
                { id: 'hher1', name: 'Creative Haircut', price: 1000 },
                { id: 'hher2', name: 'Standard Haircut', price: 600 },
                { id: 'hher3', name: 'Baby Girl Haircut', price: 400 },
                { id: 'hher4', name: 'Fringe/Flick', price: 400 },
                { id: 'hher5', name: 'Straight/U-Cut', price: 400 }
            ],
            subcategories: [
                {
                    id: 'styling-her',
                    title: 'Styling (Her)',
                    items: [
                        { id: 'st1', name: 'Blow Dry', price: 300, isAddOn: true }, // OP = Onwards Price essentially
                        { id: 'st2', name: 'Wash', price: 500, isAddOn: true },
                        { id: 'st3', name: 'Updo/Curls/Straight', price: 500, isAddOn: true },
                        { id: 'st4', name: 'Crimping', price: 1000, isAddOn: true }
                    ]
                },
                {
                    id: 'texture',
                    title: 'Texture Services',
                    items: [
                        { id: 'tx1', name: 'Perming', malePrice: 4500, femalePrice: 8000, isAddOn: true },
                        { id: 'tx2', name: 'Botoplastia/Nanoplastia/Botox', malePrice: 4500, femalePrice: 7000, isAddOn: true },
                        { id: 'tx3', name: 'Tanino', malePrice: 4000, femalePrice: 7000, isAddOn: true },
                        { id: 'tx4', name: 'Straightening/Keratin', malePrice: 3000, femalePrice: 6000, isAddOn: true }
                    ]
                }
            ]
        },
        {
            id: 'skin',
            title: 'Skin Care',
            description: 'Radiant glow that comes from within.',
            items: [
                { id: 'sk1', name: 'Pro Glow Facial', price: 4500 },
                { id: 'sk2', name: 'O3 Bridal Facial', price: 4500 },
                { id: 'sk3', name: 'O3 Anti Aging', price: 4000 },
                { id: 'sk4', name: 'O3 Shine & Glow', price: 3500 },
                { id: 'sk5', name: 'Korean Facial', price: 3000 },
                { id: 'sk6', name: 'Whitening/Acne/Hydra/Wrinkle', price: 2500 }
            ]
        },
        {
            id: 'body-care',
            title: 'Body Care',
            items: [
                { id: 'bc1', name: 'Rica Wax - Full Body', malePrice: 4500, femalePrice: 3000 },
                { id: 'bc2', name: 'Honey Wax - Full Body', malePrice: 3500, femalePrice: 2000 },
                { id: 'bc3', name: 'Body Polishing - Korean', price: 4500 },
                { id: 'bc4', name: 'Body Polishing - Signature', price: 4000 }
            ]
        }
    ];

    private offers: Offer[] = [
        { id: 'off1', title: 'Advance Mani+Pedi Deal', description: 'Get Free Feet Gel Polish' },
        { id: 'off2', title: 'Facial Special', description: 'Get Free Arms/Half Legs Honey Wax' },
        { id: 'mem1', title: 'Salon Membership', description: '20% Off Services', price: 2000 }
    ];

    constructor() { }

    getServices(): Observable<ServiceCategory[]> {
        return of(this.services);
    }

    getOffers(): Observable<Offer[]> {
        return of(this.offers);
    }
}
