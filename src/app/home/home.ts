import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../services/blog'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private blogService = inject(BlogService);
  private cdr = inject(ChangeDetectorRef);

  images = [
    {img:'assets/images/f6.png', alt: "Red rose bouquet" }, 
    {img:'assets/images/f2.png', alt: "Sunflower bouquet" }, 
    {img:'assets/images/f8.png', alt: "Mixed flower bouquet" }
  ];
  currentImage = 0;
  
  // Real dynamic data
  blogs: any[] = []; 
  isLoadingBlogs = true;

  buoquets = [
    { name: '6 PCS Sunflower Bouquet', price: "PHP 2000", image: 'assets/images/f2.png', alt: "Sunflower bouquet wrapped in black paper" },
    { name: 'Sunflower w/ Asst.Flower', price: "PHP 1500", image: 'assets/images/f4.png', alt: "Mixed flower bouquet in pink wrap" },
    { name: '100 PCS Roses', price: "PHP 12000", image: 'assets/images/f6.png', alt: "Red rose bouquet" },
    { name: '1 DOZ Roses', price: "PHP 2200", image: 'assets/images/f1.png', alt: "Red roses in blush wrap" }
  ];

  galleryImages = [
    {images: "assets/images/gallery2.jpg", alt:"Large colorful event flower arrangement"}, 
    {images: "assets/images/gallery3.jpg", alt:"Stage floral decoration for special event"}, 
    {images: "assets/images/gallery4.jpg", alt:"Church wedding flower aisle decoration"}];

  ngOnInit() {
    this.fetchLatestBlogs();
  }

  selectImage(index: number) {
    this.currentImage = index;
  }

  fetchLatestBlogs() {
    this.isLoadingBlogs = true;
    this.blogService.getBlogs().subscribe({
      next: (data) => {
        // Take the first 3 latest posts
        this.blogs = (data || []).slice(0, 3);
        this.isLoadingBlogs = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error fetching blogs for home:', err);
        this.isLoadingBlogs = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Helper to handle both external URLs and local uploads
  getImageUrl(url: string): string {
    if (!url) return 'https://placehold.co/400x300?text=La+Hermosa';
    return url;
  }
}