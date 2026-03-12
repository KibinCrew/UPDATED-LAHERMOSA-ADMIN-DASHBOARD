import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  contactForm: FormGroup;
  isSubmitting = false;
  // Added to track status: 'idle' | 'success' | 'error'
  submitStatus: 'idle' | 'success' | 'error' = 'idle';

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      occasion: [''],
      budget: [''],
      message: ['', Validators.required]
    });
  }

onSubmit() {
  if (this.contactForm.valid && !this.isSubmitting) {
    this.isSubmitting = true;
    this.submitStatus = 'idle'; // Reset status

    const serviceId = 'service_tzrklab'; 
    const templateId = 'template_41qjk1z';
    const publicKey = 'toQI3IN5k8Qmd2rr3';

    const templateParams = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      occasion: this.contactForm.value.occasion,
      budget: this.contactForm.value.budget,
      message: this.contactForm.value.message,
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then(() => {
        this.submitStatus = 'success';
        this.contactForm.reset();
        this.isSubmitting = false; // Reset spinner on success
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        this.submitStatus = 'error';
        this.isSubmitting = false; // Reset spinner on error
      });
  }
}
}