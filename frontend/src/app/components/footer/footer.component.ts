import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="col">
          <h3>SAAGAA</h3>
          <p>The Family Salon</p>
          <p>Delhi, India</p>
        </div>
        <div class="col">
          <h3>Contact</h3>
          <p>+91 98765 43210</p>
          <p>hello&#64;saagaa.com</p>
        </div>
        <div class="col">
          <h3>Follow Us</h3>
          <div class="socials">
            <span>Instagram</span>
            <span>Facebook</span>
          </div>
        </div>
      </div>
      
      <div class="easter-egg">
        <button (click)="revealStory()" class="story-btn">Wait... what's our story?</button>
        <div *ngIf="showStory" class="story-panel animate-bloom">
          <p>It started 15 years ago in a small room with just two chairs...</p>
          <p>We aren't just a business. We are a family. And now, you are too.</p>
        </div>
      </div>

      <div class="copyright">
        © 2026 SAAGAA Salon. Crafted with Soul.
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--dark-brown);
      color: var(--beige);
      padding: 3rem 2rem;
      margin-top: 4rem;
      border-radius: 50% 50% 0 0 / 20px 20px 0 0;
    }
    .footer-content {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
    }
    h3 { color: var(--gold); }
    .story-btn {
      background: none;
      border: 1px dashed var(--gold);
      color: var(--gold);
      padding: 0.5rem 1rem;
      cursor: pointer;
      margin-top: 2rem;
      border-radius: 20px;
      font-size: 0.8rem;
    }
    .story-panel {
      margin-top: 1rem;
      padding: 1rem;
      background: rgba(255,255,255,0.05);
      border-radius: 10px;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
    .copyright {
      text-align: center;
      margin-top: 3rem;
      font-size: 0.8rem;
      opacity: 0.6;
    }
  `]
})
export class FooterComponent {
  showStory = false;

  revealStory() {
    this.showStory = !this.showStory;
  }
}
