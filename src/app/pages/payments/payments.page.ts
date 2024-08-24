import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { PaymentsService } from '../../services/payments.service';
import { MakePaymentsPage } from '../make-payments/make-payments.page';
import { RenewPaymentsPage } from '../renew-payments/renew-payments.page';
import { HttpErrorResponse } from '@angular/common/http';
import { Payment } from '../../models/payment.model'; // Adjust the path as needed

type DurationKey =
  | 'duration0'
  | 'duration1'
  | 'duration2'
  | 'duration3'
  | 'duration4'
  | 'duration5'
  | 'duration6';
type AmountKey =
  | 'amount0'
  | 'amount1'
  | 'amount2'
  | 'amount3'
  | 'amount4'
  | 'amount5'
  | 'amount6';

const my_durations: { [key in DurationKey]: number } = {
  duration0: 0.1,
  duration1: 0.5,
  duration2: 1,
  duration3: 3,
  duration4: 6,
  duration5: 9,
  duration6: 12,
};

const my_amounts: { [key in AmountKey]: number } = {
  amount0: 0.1,
  amount1: 0.5,
  amount2: 1,
  amount3: 3,
  amount4: 6,
  amount5: 9,
  amount6: 12,
};

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {
  hasMadePayment: boolean = false;
  paymentForm: FormGroup;

  constructor(
    private paymentsService: PaymentsService,
    private modalController: ModalController,
    private fb: FormBuilder,
    private alertController: AlertController
  ) {
    this.paymentForm = this.fb.group({
      amount: [{ value: '', disabled: true }, Validators.required],
      payment_date: [{ value: '', disabled: true }, Validators.required],
      expiry_date: [{ value: '', disabled: true }, Validators.required],
      days_remaining: [{ value: '', disabled: true }],
    });
  }

  ngOnInit() {
    console.log(this.isDurationOf(12));
    this.checkPaymentStatus();
  }

  checkPaymentStatus() {
    this.paymentsService.getPaymentsForBusinessOwner().subscribe({
      next: (payments: Payment[]) => {
        if (payments.length > 0) {
          const sortedPayments = payments.sort(
            (a, b) =>
              new Date(b.expiry_date).getTime() -
              new Date(a.expiry_date).getTime()
          );
          this.setPaymentForm(sortedPayments[0]); // Set the payment with the latest expiry date
          this.hasMadePayment = true;
          console.log('this.hasMadePayment', this.hasMadePayment);
        } else {
          console.log('this.hasMadePayment', this.hasMadePayment);
          this.hasMadePayment = false;
        }
      },
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 404) {
            this.hasMadePayment = false;
          } else {
            console.error('Error checking payment status:', error);
            this.hasMadePayment = false;
            console.log('this.hasMadePayment', this.hasMadePayment);
          }
        } else {
          console.error('An unknown error occurred:', error);
          this.hasMadePayment = false;
          console.log('this.hasMadePayment', this.hasMadePayment);
        }
      },
    });
  }

  setPaymentForm(payment: Payment) {
    this.paymentForm.patchValue({
      amount: payment.amount,
      payment_date: payment.payment_date,
      expiry_date: payment.expiry_date,
    });
    this.updateDaysRemaining(); // Update days remaining after setting form values
  }

  updateDaysRemaining() {
    const expiryDate = this.paymentForm.get('expiry_date')?.value;
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      const today = new Date();
      const timeDiff = expiry.getTime() - today.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
      this.paymentForm.get('days_remaining')?.setValue(daysRemaining);
    } else {
      this.paymentForm.get('days_remaining')?.setValue('');
    }
  }

  async openMakePaymentModal() {
    try {
      const modal = await this.modalController.create({
        component: MakePaymentsPage
      });

      modal.onDidDismiss().then(async (result) => {
        if (result.data && result.data.dismissed === 'confirm') {
          // Reload payment status after the modal is closed
          this.checkPaymentStatus();
        } else if (result.data && result.data.dismissed === 'cancel') {
          console.log('Make Payment modal dismissed with cancel role');
        } else {
          console.log('Make Payment modal dismissed with unexpected role:', result.data ? result.data.dismissed : 'unknown');
        }
      });

      await modal.present();
    } catch (error) {
      console.error('Error opening make payment modal:', error);
    }
  }

  async openRenewPaymentModal() {
    const amount = this.paymentForm.get('amount')?.value;
    const expiryDate = this.paymentForm.get('expiry_date')?.value;
    
    // Check if there is no payment yet
    if (!amount || !expiryDate) {
      await this.showAlert('No Payment Found', 'You cannot renew the payment because no payment has been made yet.');
      return;
    }
      
    const today = new Date();
    const expiry = new Date(expiryDate);
  
    if (today <= expiry) {
      // If the current date is on or before the expiry date, prevent renewal and show an alert
      await this.showAlert('Cannot Renew Payment', 'You can only renew your payment if the current date is after the expiry date.');
      return;
    }
  
    // Get the corresponding duration value for the amount
    const duration = this.isDurationOf(amount);
  
    try {
      const modal = await this.modalController.create({
        component: RenewPaymentsPage,
        componentProps: {
          amount: amount,
          duration: duration // Pass the corresponding duration value
        }
      });
  
      modal.onDidDismiss().then(async (result) => {
        if (result.data && result.data.dismissed === 'confirm') {
          // Reload payment status after the modal is closed
          this.checkPaymentStatus();
        } else if (result.data && result.data.dismissed === 'cancel') {
          console.log('Renew Payment modal dismissed with cancel role');
        } else {
          console.log('Renew Payment modal dismissed with unexpected role:', result.data ? result.data.dismissed : 'unknown');
        }
      });
  
      await modal.present();
    } catch (error) {
      console.error('Error opening renew payment modal:', error);
    }
  }
  
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  isAmountOf(amount: number): number | null {
    const amounts = Object.values(my_amounts);
    return amounts.includes(amount) ? amount : null;
  }

  isDurationOf(duration: number): number | null {
    const durations = Object.values(my_durations);
    for (const [key, value] of Object.entries(my_durations)) {
      if (value === duration) {
        const correspondingAmountKey = key.replace(
          'duration',
          'amount'
        ) as AmountKey;
        return my_amounts[correspondingAmountKey] || null;
      }
    }
    return null;
  }
}
