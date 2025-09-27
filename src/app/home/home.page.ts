import { Component } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  chatbubbles, 
  pricetag, 
  location, 
  megaphone, 
  restaurant, 
  phonePortrait 
} from 'ionicons/icons';
import { Router } from '@angular/router'; // ← Añade esta importación

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonIcon
  ]
})
export class HomePage {
  constructor(private router: Router) { // ← Inyecta Router
    // Registrar los íconos que vamos a utilizar
    addIcons({
      chatbubbles,
      pricetag,
      location,
      megaphone,
      restaurant,
      'phone-portrait': phonePortrait
    });
  }
  // ← Añade este método
  navigateToPriceCheck() {
    this.router.navigate(['/price-check']);
  }

  // 🔗 MÉTODO PARA IR A DÓNDE COMPRAR (STORE LOCATOR) - ESTE FALTA
  navigateToStoreLocator() {
    this.router.navigate(['/store-locator']);
  }

  navigateToRecipes() {
    this.router.navigate(['/recipes']);
  }

    // 🔗 MÉTODO PARA IR A OFERTAS (QUE FALTABA)
  navigateToOffers() {
    // Por ahora redirige a price-check, luego crearás la página de ofertas
    this.router.navigate(['/offers']);
  }

}
