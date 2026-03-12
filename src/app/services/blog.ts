import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private http = inject(HttpClient);
  
  private isLocal = window.location.hostname === 'localhost';

  private apiUrl = this.isLocal 
    ? 'http://localhost:3000/api/blogs' 
    : 'https://la-hermosa-files.onrender.com/api/blogs';

  /**
   * Smart image fixer that identifies Cloudinary URLs vs local paths
   */
  private fixImageUrl(url: string): string {
    if (!url) return 'https://placehold.co/600x400?text=No+Image';

    // 1. If it's a full Cloudinary URL (starts with http), return it as is!
    if (url.startsWith('http')) {
      return url;
    }

    // 2. If it's an old relative path (like /uploads/filename.jpg), fix the base domain
    const filename = url.split('/').pop();
    const base = this.isLocal 
      ? 'http://localhost:3000' 
      : 'https://la-her-mosa-files.onrender.com';

    return `${base}/uploads/${filename}`;
  }

  getBlogs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(blogs => blogs.map(blog => ({
        ...blog,
        imageUrl: this.fixImageUrl(blog.imageUrl),
        imageUrl2: this.fixImageUrl(blog.imageUrl2)
      })))
    );
  }

  getBlogById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(blog => ({
        ...blog,
        imageUrl: this.fixImageUrl(blog.imageUrl),
        imageUrl2: this.fixImageUrl(blog.imageUrl2)
      }))
    );
  }

  createBlog(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  updateBlog(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deleteBlog(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete/${id}`, {});
  }
}