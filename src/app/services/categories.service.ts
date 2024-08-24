import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

export interface Category {
  id?: string;
  category_name: string;
  commerce_id: string; // Added commerce_id to match backend requirements
  image_category?: File | null; // Optional image file
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private categoriesUrl = environment.apiUrlCategories;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    return {
      headers: new HttpHeaders({
        Authorization: `${token}`, // Ensure Bearer prefix
        'Content-Type': 'application/json', // Default content-type
      }),
    };
  }

  // Create a new category
  createCategory(category: Category): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `${localStorage.getItem('token')}`,
      }),
    };
 
    const formData = new FormData();
    formData.append('category_name', category.category_name);
    formData.append('commerce_id', category.commerce_id);

    if (category.image_category) {
      formData.append('image_category', category.image_category);
    }

    return this.http
      .post<any>(`${this.categoriesUrl}/create-category`, formData, httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Get categories for a specific commerce
  getCategories(commerceId: string): Observable<any> {
    return this.http
      .get<any>(
        `${this.categoriesUrl}/get-categories/${commerceId}`,
        this.getHttpOptions()
      )
      .pipe(catchError(this.handleError));
  }

  // Get a specific category by ID and commerce ID
  getCategoryById(categoryId: string, commerceId: string): Observable<any> {
    return this.http
      .get<any>(
        `${this.categoriesUrl}/get-category/${commerceId}/${categoryId}`,
        this.getHttpOptions()
      )
      .pipe(catchError(this.handleError));
  }

  // Update a category
  updateCategory(commerceId: string, categoryId: string, category: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `${localStorage.getItem('token')}`,
      }),
    };
  
    const formData = new FormData();
    formData.append('category_name', category.category_name);
  
    if (category.image_category) {
      formData.append('image_category', category.image_category);
    }
  
    return this.http
      .put<any>(
        `${this.categoriesUrl}/update-category/${commerceId}/${categoryId}`,
        formData,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  
  // Delete a category
  deleteCategory(commerceId: string, categoryId: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `${localStorage.getItem('token')}`,
      }),
    };
  
    return this.http
      .delete<any>(`${this.categoriesUrl}/delete-category/${commerceId}/${categoryId}`, httpOptions)
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

  // Fetch categories by commerce ID for non-logged-in users
  getCategoriesByCommerceId(commerceId: string): Observable<Category[]> {
    return this.http
      .get<Category[]>(`${this.categoriesUrl}/public-categories/${commerceId}`)
      .pipe(catchError(this.handleError));
  }
}
