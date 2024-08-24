import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VillesService {

  private villesUrl = environment.apiUrlVilles;
  constructor(private http: HttpClient) { }

  private getHttpOptions() {
    const token = localStorage.getItem('token'); // Adjust the token retrieval method as needed
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      })
    };
  }

  // Method to get all villes (public)
  getAllVilles(): Observable<any> {
    return this.http.get(`${this.villesUrl}/get-all-villes`);
  }

  // Method to get villeId by ville_name (protected)
  getVilleId(villeName: string): Observable<any> {
    return this.http.get(`${this.villesUrl}/id/${villeName}`);
  }

  // Method to get villeName by ville_id (protected)
  getVilleName(villeId: string): Observable<any> {
    return this.http.get(`${this.villesUrl}/name/${villeId}`);
  }
}
