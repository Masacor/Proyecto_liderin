import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  barcode: string;
  category: string;
  inOffer?: boolean;
  offerPrice?: number;
  // NUEVA PROPIEDAD: ubicación en el supermercado
  supermarketLocation?: {
    aisle: string;     // Pasillo
    section: string;   // Sección dentro del pasillo
    shelf: string;     // Estante
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private mockProducts: Product[] = [
    {
      id: 1,
      name: 'Leche Entera',
      brand: 'Soprole',
      price: 1250,
      image: 'assets/images/leche-soprole.jpg',
      barcode: '7801234567890',
      category: 'Lácteos',
      inOffer: true,
      offerPrice: 999,
      supermarketLocation: {
        aisle: 'Pasillo 1',
        section: 'Refrigerados',
        shelf: 'Estante 3'
      }
    },
    {
      id: 2,
      name: 'Leche Deslactosada',
      brand: 'Colun',
      price: 1350,
      image: 'assets/images/leche-colun.jpg',
      barcode: '7801234567891',
      category: 'Lácteos',
      inOffer: false,
      supermarketLocation: {
        aisle: 'Pasillo 1',
        section: 'Refrigerados',
        shelf: 'Estante 3'
      }
    },
    {
      id: 3,
      name: 'Leche Semidescremada',
      brand: 'Loncoleche',
      price: 1200,
      image: 'assets/images/leche-loncoleche.jpg',
      barcode: '7801234567892',
      category: 'Lácteos',
      inOffer: true,
      offerPrice: 899,
      supermarketLocation: {
        aisle: 'Pasillo 1',
        section: 'Refrigerados',
        shelf: 'Estante 4'
      }
    },
    {
      id: 4,
      name: 'Arroz Grado 1',
      brand: 'Tucapel',
      price: 1850,
      image: 'assets/images/arroz-tucapel.jpg',
      barcode: '7801234567893',
      category: 'Abarrotes',
      inOffer: false,
      supermarketLocation: {
        aisle: 'Pasillo 2',
        section: 'Granos y Cereales',
        shelf: 'Estante 1'
      }
    },
    {
      id: 5,
      name: 'Te Supremo',
      brand: 'Supremo',
      price: 2000,
      image: 'assets/images/arroz-tucapel.jpg',
      barcode: '7801875032010',
      category: 'Abarrotes',
      inOffer: false,
      supermarketLocation: {
        aisle: 'Pasillo 3',
        section: 'Bebidas Calientes',
        shelf: 'Estante 2'
      }
    },
    {
      id: 6,
      name: 'Aceite Maravilla',
      brand: 'Chef',
      price: 2450,
      image: 'assets/images/aceite-chef.jpg',
      barcode: '7801234567894',
      category: 'Aceites',
      inOffer: true,
      offerPrice: 1990,
      supermarketLocation: {
        aisle: 'Pasillo 4',
        section: 'Aceites y Vinagres',
        shelf: 'Estante 1'
      }
    }
  ];

  constructor() {}

  // MÉTODOS EXISTENTES (NO CAMBIAN)
  searchProducts(query: string): Product[] {
    if (!query.trim()) return [];
    
    return this.mockProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase())
    );
  }

  findProductByBarcode(barcode: string): Product | undefined {
    return this.mockProducts.find(product => product.barcode === barcode);
  }

  getAllProducts(): Product[] {
    return this.mockProducts;
  }

  getProductsOnOffer(): Product[] {
    return this.mockProducts.filter(product => product.inOffer);
  }

  // NUEVO MÉTODO: Buscar productos por categoría para ubicación
  getProductsByCategory(category: string): Product[] {
    return this.mockProducts.filter(product => 
      product.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  // NUEVO MÉTODO: Obtener ubicación de un producto
  getProductLocation(productName: string): Product['supermarketLocation'] | null {
    const product = this.mockProducts.find(p => 
      p.name.toLowerCase().includes(productName.toLowerCase())
    );
    return product?.supermarketLocation || null;
  }
}