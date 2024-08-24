import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentsService } from '../../services/payments.service';
import { formatDate } from '@angular/common';
import { AlertController, ModalController, LoadingController } from '@ionic/angular'; // Import AlertController
import { firstValueFrom } from 'rxjs';

type DurationKey = 'duration0' | 'duration1' | 'duration2' | 'duration3' | 'duration4' | 'duration5' | 'duration6';


@Component({
  selector: 'app-make-payments',
  templateUrl: './make-payments.page.html',
  styleUrls: ['./make-payments.page.scss'],
})
export class MakePaymentsPage implements OnInit {

  paymentForm!: FormGroup;
  loading: boolean = false;
  my_durations: { [key in DurationKey]: number } = {
    duration0: 0.1,
    duration1: 0.5,
    duration2: 1,
    duration3: 3,
    duration4: 6,
    duration5: 9,
    duration6: 12
  };

  my_amounts: { [key in DurationKey]: number } = {
    duration0: 0.1,
    duration1: 0.5,
    duration2: 1,
    duration3: 3,
    duration4: 6,
    duration5: 9,
    duration6: 12
  };

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
    private paymentsService: PaymentsService,
    private loadingController: LoadingController,
  ) {}

  ngOnInit() {
    this.paymentForm = this.fb.group({
      amount: [{ value: '', disabled: true }, Validators.required],
      duration_months: ['duration0', Validators.required],
      payment_date: [new Date().toISOString()],
      expiry_date: [{ value: '', disabled: true }, Validators.required]
    });

    this.onDurationChange(); 

    const durationControl = this.paymentForm.get('duration_months');
    if (durationControl) {
      durationControl.valueChanges.subscribe(value => {
        this.onDurationChange();
      });
    }
  }

  isAmountOf(durationKey: DurationKey): number {
    return this.my_amounts[durationKey];
  }

  calculateExpiryDate(durationKey: DurationKey): string {
    const durationInMonths = this.my_durations[durationKey];
    const daysInMonth = 30; // Assuming a 30-day month for simplicity
    const durationInDays = durationInMonths * daysInMonth;

    const startDate = new Date();
    const expiryDate = new Date(startDate.getTime() + durationInDays * 24 * 60 * 60 * 1000);
    return expiryDate.toISOString(); // Ensure ISO string format
  }

  onDurationChange() {
    const durationControl = this.paymentForm.get('duration_months');
    if (durationControl) {
      const durationKey = durationControl.value as DurationKey;
      const amount = this.isAmountOf(durationKey);
      if (amount !== undefined) {
        this.paymentForm.patchValue({
          amount: amount,
          expiry_date: this.calculateExpiryDate(durationKey)
        });
      }
    }
  }
  
  async onSubmit() {
    if (this.paymentForm.valid) {
      const durationKey = this.paymentForm.get('duration_months')?.value as DurationKey;
      const durationValue = this.my_durations[durationKey];
      const amount = this.isAmountOf(durationKey);
      const paymentDate = this.paymentForm.get('payment_date')?.value;
      const expiryDate = this.paymentForm.get('expiry_date')?.value;
  
      const alert = await this.alertController.create({
        header: 'Confirm Payment',
        message: `
          Amount: ${amount}
          Duration: ${durationValue} Months
          Payment Date: ${formatDate(paymentDate, 'MMM dd, yyyy HH:mm', 'en')}
          Expiry Date: ${formatDate(expiryDate, 'MMM dd, yyyy HH:mm', 'en')}
        `,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Payment cancelled');
            }
          },
          {
            text: 'OK',
            handler: async () => {
              const formData = {
                amount: amount,
                duration_months: durationValue,
                payment_date: paymentDate,
                expiry_date: expiryDate
              };
              console.log('Form Submitted:', formData);

              this.loading = true;
  
              const loading = await this.loadingController.create({
                message: 'Processing payment...',
                spinner: 'circles',
              });
  
              await loading.present();
  
              try {
                await firstValueFrom(this.paymentsService.createOrRenewPayment(amount, durationValue));
                await this.showAlert('Success', 'Payment successfully processed.');
                this.modalController.dismiss({ dismissed: 'confirm' });
              } catch (error) {
                console.error('Error processing payment:', error);
                await this.showAlert('Error', 'Failed to process payment.');
              } finally {
                this.loading = false;
                await loading.dismiss();
              }
            }
          }
        ]
      });
  
      await alert.present();
    } else {
      await this.showAlert('Invalid Input', 'Please complete all required fields.');
    }
  }
  
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async onCancel() {
    await this.modalController.dismiss({ dismissed: 'cancel' });
  }
} 
