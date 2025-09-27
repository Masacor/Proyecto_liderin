import { Component, ViewChild, ElementRef } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonInput, IonItem, IonCard, 
  IonCardTitle, IonCardContent, IonIcon, 
  IonButtons, IonBackButton, IonSpinner, IonCardSubtitle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { barcode, search, camera, close, scan, qrCode } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProductsService, Product } from '../services/products';

@Component({
  selector: 'app-price-check',
  templateUrl: './price-check.page.html',
  styleUrls: ['./price-check.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonInput, IonItem, IonCard, 
    IonCardTitle, IonCardContent, IonIcon, 
    IonButtons, IonBackButton, IonSpinner, IonCardSubtitle, // ✅ Agregado IonCardSubtitle
    FormsModule,
    CommonModule
  ]
})
export class PriceCheckPage {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  
  productName: string = '';
  searchResults: Product[] = [];
  isLoading: boolean = false;
  showResults: boolean = false;
  scannedBarcode: string = '';
  isScanning: boolean = false;
  scanError: string = '';
  showManualInput: boolean = false;
  manualBarcode: string = '';
  
  private mediaStream: MediaStream | null = null;
  private scanInterval: any = null;
  private scanAttempts: number = 0;
  private maxScanAttempts: number = 10;

  constructor(private productsService: ProductsService) {
    addIcons({ barcode, search, camera, close, scan, qrCode });
  }

  // 🔍 BUSCAR POR TEXTO
  async searchProduct() {
    if (!this.productName.trim()) return;
    
    this.stopScanner();
    this.isLoading = true;
    this.showResults = false;
    this.scannedBarcode = '';
    this.scanError = '';
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    this.searchResults = this.productsService.searchProducts(this.productName);
    this.isLoading = false;
    this.showResults = true;
  }

  // 📷 ESCANEAR CÓDIGO DE BARRAS CON CÁMARA NATIVA
  async startBarcodeScan() {
    this.stopScanner();
    this.isScanning = true;
    this.isLoading = true;
    this.showResults = false;
    this.scanError = '';
    this.scanAttempts = 0;

    try {
      if (!this.isCameraSupported()) {
        throw new Error('Cámara no compatible');
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      this.videoElement.nativeElement.srcObject = this.mediaStream;
      await this.videoElement.nativeElement.play();
      
      this.isLoading = false;
      this.startBarcodeDetection();

    } catch (error) {
      this.handleCameraError(error);
    }
  }

  // 🔧 VERIFICAR SI LA CÁMARA ES COMPATIBLE
  private isCameraSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  // 🔄 INICIAR DETECCIÓN DE CÓDIGOS
  private startBarcodeDetection() {
    this.scanInterval = setInterval(() => {
      this.scanAttempts++;
      this.analyzeCameraFrame();
      
      if (this.scanAttempts >= this.maxScanAttempts && !this.scannedBarcode) {
        this.offerManualInput();
      }
    }, 1000);
  }

  // 🖼️ ANALIZAR FRAME DE LA CÁMARA
  private analyzeCameraFrame() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (this.scanAttempts === 3) {
      this.simulateBarcodeDetection();
    }
  }

  // 🎯 SIMULAR DETECCIÓN
  private simulateBarcodeDetection() {
    if (this.scannedBarcode) return;
    this.offerBarcodeSelection();
  }

  // 🔢 OFRECER SELECCIÓN DE CÓDIGOS
  private offerBarcodeSelection() {
    this.stopScanner();
    
    const allProducts = this.productsService.getAllProducts();
    const productNames = allProducts.map(p => `${p.barcode} - ${p.name} (${p.brand})`);
    
    const selectedIndex = prompt(
      `🔍 Cámara activada. Selecciona el producto:\n\n` +
      productNames.map((name, index) => `${index + 1}. ${name}`).join('\n') +
      `\n\nO ingresa un código manualmente:`,
      '1'
    );

    if (selectedIndex !== null) {
      const index = parseInt(selectedIndex) - 1;
      
      if (index >= 0 && index < allProducts.length) {
        this.processScannedBarcode(allProducts[index].barcode);
      } else if (selectedIndex.trim() !== '') {
        this.processScannedBarcode(selectedIndex.trim());
      } else {
        this.isScanning = false;
      }
    } else {
      this.isScanning = false;
    }
  }

  // ✅ PROCESAR CÓDIGO ESCANEADO
  private processScannedBarcode(barcode: string) {
    this.scannedBarcode = barcode;
    const product = this.productsService.findProductByBarcode(barcode);
    
    if (product) {
      this.searchResults = [product];
      this.scanError = '';
    } else {
      this.searchResults = [];
      this.scanError = `Producto con código "${barcode}" no encontrado`;
    }
    
    this.showResults = true;
    this.isScanning = false;
  }

  // ⌨️ OFRECER ENTRADA MANUAL DIRECTA
  private offerManualInput() {
    this.stopScanner();
    
    const manualCode = prompt(
      '🔍 Ingresa el código de barras manualmente:\n\n' +
      'Ejemplos de códigos en tu sistema:\n' +
      '• 7801234567890 - Leche Entera Soprole\n' +
      '• 7801875032010 - Té Supremo\n' +
      '• 7801234567894 - Aceite Maravilla Chef',
      '7801234567890'
    );

    if (manualCode && manualCode.trim()) {
      this.processScannedBarcode(manualCode.trim());
    } else {
      this.isScanning = false;
    }
  }

  // ❌ MANEJAR ERRORES DE CÁMARA
  private handleCameraError(error: any) {
    console.error('Error de cámara:', error);
    
    let errorMessage = 'Error al acceder a la cámara';
    
    if (error.name === 'NotAllowedError') {
      errorMessage = 'Permiso de cámara denegado';
    } else if (error.name === 'NotFoundError') {
      errorMessage = 'No se encontró cámara';
    }
    
    this.scanError = errorMessage;
    this.isScanning = false;
    this.isLoading = false;
    
    setTimeout(() => {
      this.offerManualInput();
    }, 2000);
  }

  // 🛑 DETENER CÁMARA Y LIMPIAR - CAMBIADO A PÚBLICO
  stopScanner() {
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.srcObject = null;
    }
    
    this.scanAttempts = 0;
  }

  // 🧹 LIMPIAR BÚSQUEDA
  clearSearch() {
    this.stopScanner();
    this.productName = '';
    this.searchResults = [];
    this.showResults = false;
    this.scannedBarcode = '';
    this.scanError = '';
    this.isLoading = false;
    this.showManualInput = false;
    this.manualBarcode = '';
  }

  // 📱 AL SALIR DE LA PÁGINA
  ionViewWillLeave() {
    this.stopScanner();
  }
}