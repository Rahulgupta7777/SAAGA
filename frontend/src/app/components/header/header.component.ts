import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common'; // Needed for async pipe if standalone, but we are module-based

@Component({
  selector: 'app-header',
  template: `
    <header class="header">
      <div class="logo-container">
        <h1 class="logo">SAAGAA</h1>
        <p class="tagline">Transforming Beauty, Transforming You</p>
      </div>
      
      <nav class="nav-menu">
        <a routerLink="/services" class="nav-link">
          <span class="text">Services</span>
          <span class="vine">🌿</span>
        </a>
        <a routerLink="/shop" class="nav-link">
          <span class="text">Shop</span>
          <span class="vine">🌸</span>
        </a>
        <a href="#" class="nav-link">
          <span class="text">Offers</span>
          <span class="vine">✨</span>
        </a>
        <a href="#" class="nav-link">
          <span class="text">Locate Us</span>
        </a>
      </nav>

      <div class="header-actions">
        <button class="human-btn schedule-btn">Schedule Visit</button>
        <div class="cart-icon">
          🛒 <span class="badge">{{ cartCount$ | async }}</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 3rem;
      background: rgba(245, 240, 233, 0.95); /* Semi-transparent beige */
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 20px rgba(0,0,0,0.05);
      border-bottom: 3px solid var(--gold);
      border-radius: 0 0 50% 50% / 0 0 10px 10px; /* Subtle arch at bottom */
    }

    .logo-container {
      text-align: center;
      cursor: pointer;
    }
    .logo {
      margin: 0;
      font-size: 2.5rem;
      color: var(--dark-brown);
      letter-spacing: 2px;
    }
    .tagline {
      margin: 0;
      font-size: 0.8rem;
      font-style: italic;
      color: var(--gold);
    }

    .nav-menu {
      display: flex;
      gap: 2rem;
    }

    .nav-link {
      text-decoration: none;
      color: var(--dark-brown);
      font-family: 'Playfair Display', serif;
      font-size: 1.1rem;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      
      .vine {
        font-size: 0.8rem;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      &:hover .vine {
        opacity: 1;
        transform: translateY(-5px) scale(1.2);
      }
      &:hover .text {
        color: var(--gold);
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .cart-icon {
      font-size: 1.5rem;
      cursor: pointer;
      position: relative;
      
      .badge {
        position: absolute;
        top: -5px;
        right: -8px;
        background: var(--gold);
        color: white;
        font-size: 0.7rem;
        padding: 2px 6px;
        border-radius: 50%;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  cartCount$!: Observable<number>;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cartCount$ = this.cartService.count$;
  }
}
