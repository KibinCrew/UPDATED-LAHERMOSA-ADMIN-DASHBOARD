import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blogs.html',
  styleUrl: './blogs.css'
})
export class Blogs implements OnInit {
  private http = inject(HttpClient);

  blogPosts: any[] = [];
  featuredPosts: any[] = [];
  latestPosts: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.fetchBlogs();
  }

  fetchBlogs() {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:3000/api/blogs').subscribe({
      next: (data) => {
        this.blogPosts = data;
        
        // Filter for Featured section
        this.featuredPosts = data.filter(post => post.isFeatured);
        
        // Take the 3 most recent for the Latest section
        this.latestPosts = data.slice(0, 3);
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching blogs', err);
        this.isLoading = false;
      }
    });
  }
}