import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterLink], // Ensure RouterLink is imported
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop implements OnInit {
  // Your full inventory
 allProducts = [
    { id: 1, name: '1 DZ Roses', price: 'PHP 2200', category: 'Bouquets', description: 'A stunning arrangement of fresh red roses.', image: 'assets/images/f1.png' },
    { id: 2, name: '6 PCS Sunflower', price: 'PHP 2000', category: 'Flowers', description: 'Beautiful seasonal blooms for any occasion.', image: 'assets/images/f2.png' },
    { id: 3, name: '1 DZ Imported Roses', price: 'PHP 6000', category: 'Arrangements', description: 'Elegant tulips arranged in a minimalist style.', image: 'assets/images/f3.png' },
    { id: 4, name: '1 PC Tulip', price: 'PHP 600', category: 'Bouquets', description: 'A premium box of luxury flowers.', image: 'assets/images/f4.png' },
    { id: 5, name: '1 DZ Sunflower', price: 'PHP 3500', category: 'Bouquets', description: 'A stunning arrangement of fresh red roses.', image: 'assets/images/f5.png' },
    { id: 6, name: '100 PCS Roses', price: 'PHP 12000', category: 'Flowers', description: 'Beautiful seasonal blooms for any occasion.', image: 'assets/images/f6.png' },
    { id: 7, name: '3 DZ Roses', price: 'PHP 5000', category: 'Arrangements', description: 'Elegant tulips arranged in a minimalist style.', image: 'assets/images/f7.png' },
    { id: 8, name: '2 DZ Roses', price: 'PHP 4500', category: 'Bouquets', description: 'A premium box of luxury flowers.', image: 'assets/images/f8.png' },
  ];

  filteredProducts: any[] = [];
  selectedCategory: string = 'All';

  ngOnInit() {
    this.filteredProducts = this.allProducts;
  }

  filterCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredProducts = this.allProducts;
    } else {
      this.filteredProducts = this.allProducts.filter(p => p.category === category);
    }
  }

  onDropdownChange(event: any) {
  const value = event.target.value;
  this.filterCategory(value);
}
}