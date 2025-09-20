import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ProductForm } from './models/product';
import { FirebaseService } from './services/firebase.service';
import { Router } from '@angular/router';

import { LucideAngularModule, ShoppingCart, Search, QrCode, Edit, Tag, Palette, Ruler, Folder, X } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected readonly title = signal('ikeaBot');

  // Lucide icons
  protected readonly icons = {
    ShoppingCart,
    Search,
    QrCode,
    Edit,
    Tag,
    Palette,
    Ruler,
    Folder,
    X
  };

  // Form builder injection
  private fb = inject(FormBuilder);
  
  // Signals for state management
  protected readonly activeTab = signal<'qr' | 'manual'>('manual');
  protected readonly isLoading = signal(false);
  protected readonly searchResult = signal<any>(null);
  protected readonly errorMessage = signal<string | null>(null);
  
  // Reactive form
  protected productForm!: FormGroup;
  
  constructor(private router: Router, private firebaseService: FirebaseService) {}
  
  ngOnInit(): void {
    this.initializeForm();
  }
  
  private initializeForm(): void {
    this.productForm = this.fb.group({
      articleNumber: [''],
      productName: [''],
      color: [''],
      dimensions: [''],
      series: [''],
      category: ['']
    });
  }
  
  protected switchTab(tab: 'qr' | 'manual'): void {
    this.activeTab.set(tab);
    this.clearError();
  }
  
  protected formatArticleNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 3) {
      value = value.slice(0, 3) + '.' + value.slice(3);
    }
    if (value.length > 7) {
      value = value.slice(0, 7) + '.' + value.slice(7, 9);
    }
    
    this.productForm.get('articleNumber')?.setValue(value);
  }
  
  // Simple method like addItemToList from your working project
  addProductToList() {
    const formData = this.productForm.value;
    
    const newProduct = {
      articleNumber: formData.articleNumber || this.generateArticleNumber(),
      productName: formData.productName || 'Unknown Product',
      color: formData.color || '',
      dimensions: formData.dimensions || '',
      series: formData.series || '',
      category: formData.category || ''
    };
    
    // Same pattern as your SellComponent
    this.firebaseService.addToList("/products", newProduct);
    console.log('Product added:', newProduct);
    
    // Show success result
    this.searchResult.set({
      articleNumber: newProduct.articleNumber,
      name: newProduct.productName,
      color: newProduct.color,
      dimensions: newProduct.dimensions,
      series: newProduct.series,
      category: newProduct.category,
      price: '$59.99',
      availability: 'In stock'
    });
    
    // Clear form like your SellComponent does
    this.productForm.reset();
  }
  
  // Simple onSubmit - same pattern as your working project
  protected onSubmit(): void {
    console.log('Form submitted!');
    
    const formData = this.productForm.value;
    
    if (!formData.articleNumber && !formData.productName) {
      this.errorMessage.set('Please enter either an Article Number or Product Name');
      return;
    }
    
    this.addProductToList();
  }
  
  private generateArticleNumber(): string {
    const part1 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const part2 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const part3 = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${part1}.${part2}.${part3}`;
  }
  
  protected startQrScanner(): void {
    console.log('Starting QR scanner...');
    alert('QR Scanner would start here');
  }
  
  protected clearError(): void {
    this.errorMessage.set(null);
  }
  
  protected resetForm(): void {
    this.productForm.reset();
    this.searchResult.set(null);
    this.clearError();
  }
  
  protected getFieldError(fieldName: string): string | null {
    const field = this.productForm.get(fieldName);
    if (field?.errors && field.touched) {
      return 'Please enter a valid value';
    }
    return null;
  }
  
  protected hasFieldError(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }
}