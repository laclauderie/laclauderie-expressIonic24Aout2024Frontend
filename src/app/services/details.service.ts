import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http'; 

export interface Detail {
  id: string;
  detail_name: string;
  description?: string;
  product_id: string;
  image_detail?:string;
}

@Injectable({
  providedIn: 'root'
})
export class DetailsService {

  private detailsUrl = environment.apiUrlDetails;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    return {
      headers: new HttpHeaders({
        Authorization: `${token}`, // Ensure Bearer prefix
      }),
    };
  }

  // Create a new detail
  createDetail(commerceId: string, categoryId: string, productId: string, detail: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `${localStorage.getItem('token')}`,
      }),
    };

    const formData = new FormData();
    formData.append('detail_name', detail.detail_name);
    formData.append('description', detail.description);
    formData.append('product_id', productId);

    if (detail.image_detail) {
      formData.append('image_detail', detail.image_detail);
    }

    return this.http
      .post<any>(`${this.detailsUrl}/create-detail/${commerceId}/${categoryId}/${productId}`, formData, httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Get all details for a specific product
  getDetailsByProduct(commerceId: string, categoryId: string, productId: string): Observable<any> {
    return this.http
      .get<any>(`${this.detailsUrl}/get-details-by-product/${commerceId}/${categoryId}/${productId}`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  // Get a specific detail by ID
  getDetailById(commerceId: string, categoryId: string, productId: string, detailId: string): Observable<any> {
    return this.http
      .get<any>(`${this.detailsUrl}/get-detail/${commerceId}/${categoryId}/${productId}/${detailId}`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  // Update a detail
  updateDetail(commerceId: string, categoryId: string, productId: string, detailId: string, detail: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `${localStorage.getItem('token')}`,
      }),
    };

    const formData = new FormData();
    formData.append('detail_name', detail.detail_name);
    formData.append('description', detail.description);

    if (detail.image_detail) {
      formData.append('image_detail', detail.image_detail);
    }

    return this.http
      .put<any>(`${this.detailsUrl}/update-detail/${commerceId}/${categoryId}/${productId}/${detailId}`, formData, httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Delete a detail
  deleteDetail(commerceId: string, categoryId: string, productId: string, detailId: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `${localStorage.getItem('token')}`,
      }),
    };

    return this.http
      .delete<any>(`${this.detailsUrl}/delete-detail/${commerceId}/${categoryId}/${productId}/${detailId}`, httpOptions)
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

  // Method to get details by product ID for non-logged-in users
  getDetailsByProductId(productId: string): Observable<Detail[]> {
    const url = `${this.detailsUrl}/public-detail-product/${productId}`;
    return this.http.get<Detail[]>(url).pipe(
      catchError(this.handleError)
    );
  }
}
