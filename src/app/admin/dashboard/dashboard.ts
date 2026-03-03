import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  isModalOpen = false;
  isLoading = false;
  isEditMode = false;
  currentBlogId: string | null = null;
  allBlogs: any[] = [];

  // Used for file tracking
  selectedFile1: File | null = null;
  selectedFile2: File | null = null;
  imagePreview1: string | null = null;
  imagePreview2: string | null = null;

  blogData = {
    title: '',
    author: '', 
    altText: '',
    header1: '',
    content: '',
    altText2: '',
    header2: '',
    content2: '',
    isFeatured: false
  };

  ngOnInit() {
    this.fetchBlogs();
  }

  fetchBlogs() {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:3000/api/blogs').subscribe({
      next: (data) => {
        this.allBlogs = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Fetch error:', err);
        this.isLoading = false;
      }
    });
  }

  // Handle file selection and preview
  onFileSelected(event: any, imageNumber: number) {
    const file = event.target.files[0];
    if (!file) return;

    if (imageNumber === 1) {
      this.selectedFile1 = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview1 = reader.result as string;
      reader.readAsDataURL(file);
    } else {
      this.selectedFile2 = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview2 = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onPostBlog() {
    this.isLoading = true;

    // Use FormData to send files + text
    const formData = new FormData();
    formData.append('title', this.blogData.title);
    formData.append('author', this.blogData.author);
    formData.append('altText', this.blogData.altText);
    formData.append('header1', this.blogData.header1);
    formData.append('content', this.blogData.content);
    formData.append('altText2', this.blogData.altText2);
    formData.append('header2', this.blogData.header2);
    formData.append('content2', this.blogData.content2);
    formData.append('isFeatured', String(this.blogData.isFeatured));

    if (this.selectedFile1) formData.append('image1', this.selectedFile1);
    if (this.selectedFile2) formData.append('image2', this.selectedFile2);

    if (this.isEditMode && this.currentBlogId) {
      // Update existing blog
      this.http.put(`http://localhost:3000/api/blogs/${this.currentBlogId}`, formData).subscribe({
        next: () => this.handleSuccess('Blog Updated!'),
        error: (err) => this.handleError(err)
      });
    } else {
      // Create new blog
      this.http.post('http://localhost:3000/api/blogs', formData).subscribe({
        next: () => this.handleSuccess('Blog Published!'),
        error: (err) => this.handleError(err)
      });
    }
  }

  handleSuccess(message: string) {
    this.isModalOpen = false;
    this.resetForm();
    this.fetchBlogs();
    alert(message);
  }

  handleError(err: any) {
    console.error('Operation error:', err);
    alert('Error processing request.');
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  editBlog(blog: any) {
    this.isEditMode = true;
    this.isModalOpen = true;
    this.currentBlogId = blog._id;

    // Fill form with existing data
    this.blogData = {
      title: blog.title,
      author: blog.author,
      altText: blog.altText || '',
      header1: blog.header1,
      content: blog.content,
      altText2: blog.altText2 || '',
      header2: blog.header2,
      content2: blog.content2,
      isFeatured: blog.isFeatured
    };
    
    // Set previews to existing URLs
    this.imagePreview1 = blog.imageUrl;
    this.imagePreview2 = blog.imageUrl2;
  }

  deleteBlog(id: string) {
    if (confirm('Delete this blog?')) {
      this.http.post(`http://localhost:3000/api/blogs/delete/${id}`, {}).subscribe({
        next: () => {
          this.fetchBlogs();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Delete failed', err)
      });
    }
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentBlogId = null;
    this.resetForm();
    this.isModalOpen = true;
  }

  resetForm() {
    this.blogData = {
      title: '', author: '', altText: '', header1: '', content: '',
      altText2: '', header2: '', content2: '', isFeatured: false
    };
    this.selectedFile1 = null;
    this.selectedFile2 = null;
    this.imagePreview1 = null;
    this.imagePreview2 = null;
  }

  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}