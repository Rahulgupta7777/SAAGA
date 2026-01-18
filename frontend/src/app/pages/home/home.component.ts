import { Component } from '@angular/core';

@Component({
    selector: 'app-home',
    template: `
    <div class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content animate-bloom">
        <h2>Unveil Your Inner Radiance</h2>
        <p>Where nature meets luxury in the heart of Delhi.</p>
        <button class="human-btn" routerLink="/services">Explore Services</button>
      </div>
      
      <!-- Decorative Elements (Simulated Flowers) -->
      <div class="flower f1 animate-float">🌸</div>
      <div class="flower f2 animate-float" style="animation-delay: 1s">🌺</div>
    </div>
  `,
    styles: [`
    .hero {
      height: 80vh;
      background: url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80') center/cover no-repeat;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      overflow: hidden;
    }
    .hero-overlay {
      position: absolute;
      top:0; left:0; right:0; bottom:0;
      background: rgba(74, 59, 50, 0.3); /* Brown tint */
    }
    .hero-content {
      position: relative;
      color: white;
      z-index: 10;
      max-width: 600px;
    }
    h2 {
      font-size: 3.5rem;
      margin-bottom: 1rem;
      color: white;
      text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      font-family: 'Playfair Display', serif;
    }
    
    .flower {
      position: absolute;
      font-size: 3rem;
      opacity: 0.8;
    }
    .f1 { top: 10%; left: 10%; }
    .f2 { bottom: 20%; right: 15%; font-size: 4rem; }
  `]
})
export class HomePageComponent { }
