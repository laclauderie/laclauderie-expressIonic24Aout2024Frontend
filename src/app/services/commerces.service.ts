import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommercesService {
  private commercesUrl = environment.apiUrlCommerces;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    const token = localStorage.getItem('token'); // Adjust the token retrieval method as needed
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      }),
    };
  }

  // Get all commerces for the logged-in user
  getCommerces(): Observable<any> {
    return this.http.get<any>(
      `${this.commercesUrl}/get-commerces`,
      this.getHttpOptions()
    );
  }

  // Get a specific commerce by ID for the logged-in user
  getCommerceById(id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `${localStorage.getItem('token')}`,
      }),
    };

    return this.http.get<any>(
      `${this.commercesUrl}/get-commerce/${id}`,
      httpOptions
    );
  }

  // Create a new commerce for the logged-in user
  createCommerce(commerceData: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `${localStorage.getItem('token')}`,
      }),
    };

    return this.http
      .post<any>(
        `${this.commercesUrl}/create-commerce`,
        commerceData,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error); // Log the error
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  // Update commerce details for the logged-in user
  updateCommerce(id: string, commerceData: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `${localStorage.getItem('token')}`,
      }),
    };

    return this.http.put<any>(
      `${this.commercesUrl}/update-commerce/${id}`,
      commerceData,
      httpOptions
    );
  }

  // Delete a commerce for the logged-in user
  deleteCommerce(id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `${localStorage.getItem('token')}`,
      }),
    };

    return this.http.delete<any>(
      `${this.commercesUrl}/delete-commerce/${id}`,
      httpOptions
    );
  }

  // Get all commerces for business owners who have paid their monthly fees
  getCommercesByPaidBusinessOwners(): Observable<any> {
    // No token needed, no headers
    return this.http
      .get<any>(`${this.commercesUrl}/commerces-paid-business-owners`)
      .pipe(catchError(this.handleError));
  }

  // services/commerces.service.ts
  searchCommerces(query: string): Observable<any> {
    return this.http
      .get<any>(`${this.commercesUrl}/search-commerces`, {
        params: { searchTerm: query },
      })
      .pipe(catchError(this.handleError));
  }

  getVillesFromCommerces(commerceIds: number[]): Observable<any> {
    return this.http.get(`${this.commercesUrl}/villes-from-commerces`, { params: { commerceIds: commerceIds.join(',') } });
  }

  getUniqueSortedVilles(commerceIds: number[]): Observable<any> {
    return this.http.get(`${this.commercesUrl}/unique-sorted-villes`, { params: { commerceIds: commerceIds.join(',') } });
  }

  // Method to get commerces by ville
  getCommercesByVille(villeName: string): Observable<any> {
    return this.http.get<any>(`${this.commercesUrl}/commerces-by-ville/${villeName}`);
  }

  // Get commerce by ID for non-logged-in users
  getCommerceByIdForNonLoggedUser(id: string): Observable<any> {
    return this.http.get<any>(
      `${this.commercesUrl}/public-commerce/${id}`
    ).pipe(catchError(this.handleError));
  }
}
