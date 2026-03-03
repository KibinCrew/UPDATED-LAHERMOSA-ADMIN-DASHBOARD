import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private http = inject(HttpClient);
  
  // Your live Render URL
  private apiUrl = 'https://la-hermosa-files.onrender.com/api/blogs';

  // Get all blogs
  getBlogs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl); 
  }

  // Get a single blog by ID
  getBlogById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new blog post
   * @param formData - The FormData object containing text and files
   */
  createBlog(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  /**
   * Update an existing blog post
   * @param id - The ID of the blog to update
   * @param formData - The FormData object containing updated text and files
   */
  updateBlog(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Delete a blog post
   * @param id - The ID of the blog to delete
   */
  deleteBlog(id: string): Observable<any> {
    // Matching your server.js route: app.post('/api/blogs/delete/:id')
    return this.http.post(`${this.apiUrl}/delete/${id}`, {});
  }
}