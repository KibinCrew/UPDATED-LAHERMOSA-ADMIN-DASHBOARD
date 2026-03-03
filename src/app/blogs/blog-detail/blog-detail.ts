import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.css'
})
export class BlogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private cdr = inject(ChangeDetectorRef);
  private location = inject(Location);
  private sanitizer = inject(DomSanitizer);

  blog: any = null;
  isLoading = true;
  dynamicSchema: SafeHtml | undefined;

  ngOnInit() {
    // Correctly getting ID from the 'blogs/:id' route
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchBlogDetail(id);
    }
  }

  fetchBlogDetail(id: string) {
    this.isLoading = true;
    this.blogService.getBlogById(id).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.blog = data;
          this.isLoading = false;
          
          // Generate the Schema when data arrives
          this.generateBlogSchema(data); 
          
          this.cdr.detectChanges(); 
        }, 500);
      },
      error: (err) => {
        console.error('Error fetching blog detail:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Helper to ensure image URLs are correct
  getImageUrl(url: string): string {
    if (!url) return 'https://placehold.co/600x400?text=No+Image';
    return url;
  }

  generateBlogSchema(blog: any) {
    const schemaJson = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.content ? blog.content.substring(0, 160) : '',
      "image": [this.getImageUrl(blog.imageUrl), this.getImageUrl(blog.imageUrl2)].filter(img => img),
      "author": {
        "@type": "Person",
        "name": blog.author || "La Hermosa Admin"
      },
      "publisher": {
        "@type": "Organization",
        "name": "La Hermosa Flower Shop",
        "logo": {
          "@type": "ImageObject",
          "url": "https://lahermosa.shop/assets/images/favlogo.png"
        }
      },
      "datePublished": blog.createdAt || new Date().toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        // Matched URL to blogs/:id route for SEO consistency
        "@id": `https://lahermosa.shop/blogs/${blog._id || blog.id}`
      }
    };

    const jsonString = JSON.stringify(schemaJson);
    this.dynamicSchema = this.sanitizer.bypassSecurityTrustHtml(
      `<script type="application/ld+json">${jsonString}</script>`
    );
  }

  goBack() {
    this.location.back();
  }
}