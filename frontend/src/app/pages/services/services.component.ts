import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important for standalone, but we are using NgModule
import { SalonDataService } from '../../services/salon-data.service';
import { CartService } from '../../services/cart.service';
import { ServiceCategory, ServiceItem } from '../../models/salon-data.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-services-page',
  template: `
    <div class="services-container">
      <h2 class="page-title">Our Menu</h2>
      <p class="page-subtitle">Curated treatments for your body and soul.</p>

      <div *ngIf="categories$ | async as categories" class="category-list">
        <div *ngFor="let cat of categories" class="category-section">
          <div class="category-header">
            <h3>{{ cat.title }}</h3>
            <p *ngIf="cat.description" class="cat-desc">{{ cat.description }}</p>
          </div>

          <!-- Items in this category -->
          <div class="items-grid">
            <div *ngFor="let item of cat.items" class="service-card animate-float" [style.animation-delay]="'0.' + item.id + 's'">
              <div class="card-content">
                <h4>{{ item.name }}</h4>
                <div class="price-tag">
                   <span *ngIf="item.price">₹{{ item.price }}</span>
                   <span *ngIf="item.priceRange">₹{{ item.priceRange }}</span>
                   <span *ngIf="item.unit" class="unit"> / {{ item.unit }}</span>
                </div>
                <div class="actions">
                  <button (click)="addToCart(item)" class="add-btn">+</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Subcategories (Recursive in a real app, flattened here for simplicity) -->
          <div *ngIf="cat.subcategories" class="subcategories">
             <div *ngFor="let sub of cat.subcategories">
                <h4 class="sub-title">{{ sub.title }}</h4>
                <div class="items-grid">
                  <div *ngFor="let subItem of sub.items" class="service-card">
                    <div class="card-content">
                      <h5>{{ subItem.name }}</h5>
                      <div class="price-tag">
                        <span *ngIf="subItem.price">₹{{ subItem.price }}</span>
                        <!-- Handle varied prices like male/female display if needed, simplifying for now -->
                         <span *ngIf="subItem.malePrice">M: ₹{{subItem.malePrice}} / F: ₹{{subItem.femalePrice}}</span>
                      </div>
                       <button (click)="addToCart(subItem)" class="add-btn">+</button>
                    </div>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .services-container {
      padding: 2rem 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .page-title {
      text-align: center;
      font-size: 3rem;
      color: var(--gold);
    }
    .page-subtitle {
      text-align: center;
      margin-bottom: 3rem;
      font-style: italic;
    }
    
    .category-section {
      margin-bottom: 4rem;
    }
    .category-header {
      margin-bottom: 2rem;
      border-bottom: 1px dashed var(--gold);
      padding-bottom: 1rem;
      h3 { font-size: 2rem; margin: 0; }
      .cat-desc { color: var(--dark-brown); opacity: 0.8; }
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .service-card {
      background: white;
      padding: 1.5rem;
      border-radius: 20px 5px 20px 5px; /* Asymmetric */
      box-shadow: 0 5px 15px rgba(0,0,0,0.05);
      transition: transform 0.3s;
      border: 1px solid transparent;

      &:hover {
        transform: translateY(-5px);
        border-color: var(--gold);
      }
    }

    .card-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    h4 { margin: 0; font-size: 1.2rem; }
    h5 { margin: 0; font-size: 1.1rem; }

    .price-tag {
      font-weight: bold;
      color: var(--gold);
    }

    .add-btn {
      align-self: flex-end;
      background: var(--dark-brown);
      color: white;
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      
      &:hover { background: var(--gold); }
    }

    .subcategories {
      margin-top: 2rem;
      margin-left: 1rem;
      border-left: 2px solid var(--beige);
      padding-left: 1rem;
    }
    .sub-title {
      font-family: 'Playfair Display', serif;
      color: var(--text-color);
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }
  `]
})
export class ServicesPageComponent implements OnInit {
  categories$!: Observable<ServiceCategory[]>;

  constructor(private salonService: SalonDataService, private cartService: CartService) { }

  ngOnInit() {
    this.categories$ = this.salonService.getServices();
  }

  addToCart(item: ServiceItem) {
    this.cartService.addToCart(item, 'service');
  }
}
