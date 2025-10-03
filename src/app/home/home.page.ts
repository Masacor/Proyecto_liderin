import { Component } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonItem, IonLabel, IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  chatbubbles, pricetag, location, 
  megaphone, restaurant, phonePortrait,
  personCircleOutline, sparkles, star
} from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonList, IonItem, IonLabel, IonIcon
  ]
})
export class HomePage {
  currentAvatar = 'assets/images/liderin.png';

  constructor(private router: Router) {
    addIcons({
      chatbubbles,
      pricetag,
      location,
      megaphone,
      restaurant,
      'phone-portrait': phonePortrait,
      'person-circle-outline': personCircleOutline,
      sparkles,
      star
    });
  }

  changeAvatar(avatarPath: string) {
    this.currentAvatar = avatarPath;
  }

  navigateToPriceCheck() {
    this.router.navigate(['/price-check']);
  }

  navigateToStoreLocator() {
    this.router.navigate(['/store-locator']);
  }

  navigateToOffers() {
    this.router.navigate(['/offers']);
  }

  navigateToRecipes() {
    this.router.navigate(['/recipes']);
  }

  // ✅ CORREGIDO: Dentro de la clase
  navigateToAppDownload() {
    this.router.navigate(['/app-download']);
  }
}