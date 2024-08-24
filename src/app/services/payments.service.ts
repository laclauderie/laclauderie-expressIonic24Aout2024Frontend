import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private paymentsUrl = environment.apiUrlPayments;

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

  createOrRenewPayment(amount: number, durationMonths: number): Observable<any> {
    const body = { amount, durationMonths };
    return this.http.post(`${this.paymentsUrl}/create-or-renew-payment`, body, this.getHttpOptions());
  }

  getPaymentsForBusinessOwner(): Observable<any> {
    return this.http.get(`${this.paymentsUrl}/payments`, this.getHttpOptions());
  }

  getCurrentPaymentForBusinessOwner(): Observable<any> {
    return this.http.get(`${this.paymentsUrl}/current-payment`, this.getHttpOptions());
  }

}
