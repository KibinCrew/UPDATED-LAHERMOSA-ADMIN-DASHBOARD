import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-features',
  imports: [CommonModule],
  templateUrl: './features.html',
  styleUrl: './features.css',
})
export class Features {
  selectedFilter: string = 'Images';

  setFilter(filterValue: string) {
    this.selectedFilter = filterValue;
  }
}