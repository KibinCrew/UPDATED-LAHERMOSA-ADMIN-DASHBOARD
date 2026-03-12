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
    // Look for 'slug' in the URL instead of 'id'
    const slug = this.route.snapshot.paramMap.get('slug') || this.route.snapshot.paramMap.get('id');
    if (slug) {
      this.fetchBlogDetail(slug);
    }
  }

  fetchBlogDetail(identifier: string) {
    this.isLoading = true;
    this.blogService.getBlogById(identifier).subscribe({
      next: (data) => {
        this.blog = data;
        this.isLoading = false;
        this.generateBlogSchema(data); 
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error fetching blog detail:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getImageUrl(url: string): string {
    return url || 'https://placehold.co/600x400?text=No+Image';
  }

  generateBlogSchema(blog: any) {
    const blogUrlIdentifier = blog.slug || blog._id; // Fallback to ID if slug missing
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
        "@id": `https://lahermosa.shop/blogs/${blogUrlIdentifier}`
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