import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface RestaurantRegistration {
  name: string;
  email: string;
  password: string;
  cuisineType: string;
  image: string | ArrayBuffer | null;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

@Component({
  selector: 'app-restaurant-register',
  imports:[CommonModule, ReactiveFormsModule],
  templateUrl: './restaurant-register.html',
  styleUrl: './restaurant-register.css',
})
export class RestaurantRegister {
   registrationForm: FormGroup;
  showPreview = signal(false);
  imagePreview = signal<string | null>(null);
  isDragOver = signal(false);

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cuisineType: ['', Validators.required],
      image: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['Gujarat', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
      })
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.validateAndSetImage(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.validateAndSetImage(file);
    }
  }

  private validateAndSetImage(file: File): void {
    // Check file type
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
      this.registrationForm.patchValue({
        image: reader.result
      });
      this.registrationForm.get('image')?.markAsTouched();
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imagePreview.set(null);
    this.registrationForm.patchValue({
      image: ''
    });
    this.registrationForm.get('image')?.markAsTouched();
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const formData: RestaurantRegistration = this.registrationForm.value;
      console.log('Restaurant Registration Data:', formData);
      
      // Here you would typically send the data to your backend
      this.showPreview.set(true);
      
      // Show success message
      alert('Restaurant registered successfully! Welcome to our platform!');
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.registrationForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
