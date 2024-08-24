import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessOwnerService {
 
  private baseUrl = environment.apiUrlBusinessOwner;

  constructor(private http: HttpClient) { }

  getBusinessOwner(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-business-owner`, this.getHttpOptions());
  }

  createBusinessOwner(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-business-owner`, data, this.getHttpOptions());
  }

  updateBusinessOwner(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-business-owner`, data, this.getHttpOptions());
    // console.log('data to update is :', data)
  }

  updateBusinessOwnerNonImageFields(businessOwnerData: any): Observable<any> {
    const url = `${this.baseUrl}/update-business-owner-non-image`;
    return this.http.put(url, businessOwnerData, this.getHttpOptions());
  }

  updateBusinessOwnerImage(image: File): Observable<any> {
    const url = `${this.baseUrl}/update-business-owner-image`;
    const formData: FormData = new FormData();
    formData.append('image_owner', image, image.name);

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `${localStorage.getItem('token')}`
      })
    };

    return this.http.put(url, formData, httpOptions);
  }

  getBusinessOwnerImage(): Observable<Blob> {
    const url = `${this.baseUrl}/get-business-owner-image`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `${localStorage.getItem('token')}`
      }),
      responseType: 'blob' as 'json' // Ensure response is handled as a Blob
    };

    return this.http.get<Blob>(url, httpOptions);
  }

  deleteBusinessOwner(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-business-owner`, this.getHttpOptions());
  } 

  findBusinessOwnerByEmail(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/find-business-owner/${email}`, this.getHttpOptions());
  }

  private getHttpOptions() {
    const token = localStorage.getItem('token'); // Adjust the token retrieval method as needed
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      })
    };
  }

  // Get a specific business owner by ID for non-logged-in users
  getBusinessOwnerById(id: string): Observable<any> {
    const url = `${this.baseUrl}/public-business-owner/${id}`;
    return this.http.get<any>(url);
  }
}
