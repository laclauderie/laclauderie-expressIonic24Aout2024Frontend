import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

// Define and export the Product interface
export interface Product {
  id: string;
  product_name: string;
  price: number;
  reference?: string; // optional field
  description?: string; // optional field
  category_id: string;
  image_product?: string; // optional field
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private productsUrl = environment.apiUrlProducts;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    return {
      headers: new HttpHeaders({
        Authorization: `${token}`, // Ensure Bearer prefix
      }),
    };
  }

  // Create a new product
  createProduct(
    commerceId: string,
    categoryId: string,
    product: any //?
  ): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `${localStorage.getItem('token')}`,
      }),
    };

    const formData = new FormData();
    formData.append('product_name', product.product_name);
    formData.append('price', product.price);
    formData.append('reference', product.reference);
    formData.append('description', product.description);
    formData.append('commerce_id', commerceId);
    formData.append('category_id', categoryId);

    if (product.image_product) {
      formData.append('image_product', product.image_product);
    }

    return this.http
      .post<any>(
        `${this.productsUrl}/create-product/${commerceId}/${categoryId}`,
        formData,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  // Get all products for a specific commerce and category
  getAllProducts(commerceId: string, categoryId: string): Observable<any> {
    return this.http
      .get<any>(
        `${this.productsUrl}/get-products/${commerceId}/${categoryId}`,
        this.getHttpOptions()
      )
      .pipe(catchError(this.handleError));
  }

  // Get a specific product by ID
  getProductById(
    commerceId: string,
    categoryId: string,
    productId: string
  ): Observable<any> {
    return this.http
      .get<any>(
        `${this.productsUrl}/get-product/${commerceId}/${categoryId}/${productId}`,
        this.getHttpOptions()
      )
      .pipe(catchError(this.handleError));
  }

  // Update a product
  updateProduct(
    commerceId: string,
    categoryId: string,
    productId: string,
    product: any
  ): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `${localStorage.getItem('token')}`,
      }),
    };

    const formData = new FormData();
    formData.append('product_name', product.product_name);
    formData.append('product_description', product.product_description);

    if (product.image_product) {
      formData.append('image_product', product.image_product);
    }

    return this.http
      .put<any>(
        `${this.productsUrl}/update-product/${commerceId}/${categoryId}/${productId}`,
        formData,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  // Delete a product
  deleteProduct(
    commerceId: string,
    categoryId: string,
    productId: string
  ): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `${localStorage.getItem('token')}`,
      }),
    };

    return this.http
      .delete<any>(
        `${this.productsUrl}/delete-product/${commerceId}/${categoryId}/${productId}`,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage)); // Use arrow function
  }

  // Method to get products by category ID for non-logged-in users
  getProductsByCategoryId(categoryId: string): Observable<Product[]> {
    const url = `${this.productsUrl}/public-products/${categoryId}`;
    return this.http.get<Product[]>(url).pipe(catchError(this.handleError));
  }
}
