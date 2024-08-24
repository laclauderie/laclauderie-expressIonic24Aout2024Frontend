import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentsService } from '../../services/payments.service';
import { formatDate } from '@angular/common';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-renew-payments',
  templateUrl: './renew-payments.page.html',
  styleUrls: ['./renew-payments.page.scss'],
})
export class RenewPaymentsPage implements OnInit {
  @Input() amount!: number;
  @Input() duration!: number;

  paymentForm: FormGroup;
  durationValues: number[] = [0.1, 0.5, 1, 3, 6, 9, 12];
  loading = false;
  my_durations: { [key: string]: number } = {
    '0.1': 3,   // Duration in days
    '0.5': 15,
    '1': 30,
    '3': 90,
    '6': 180,
    '9': 270,
    '12': 365
  };

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private alertController: AlertController,
    private paymentsService: PaymentsService,
    private loadingController: LoadingController,
  ) {
    // Initialize form with the appropriate controls and validators
    this.paymentForm = this.fb.group({
      amount: [{ value: '', disabled: true }, Validators.required],
      duration: ['', Validators.required],
      payment_date: [{ value: '', disabled: false }, Validators.required],
      expiry_date: [{ value: '', disabled: true }, Validators.required]
    });
  }

  ngOnInit() {
    // Set initial form values
    const today = new Date().toISOString(); // Current date in ISO format
    this.paymentForm.patchValue({
      amount: this.amount,
      duration: this.duration,
      payment_date: today // Set current date in ISO format
    });

    // Calculate and set expiry date based on today's date and duration
    this.updateAmount(this.duration);
    this.updateExpiryDate();

    // Subscribe to duration and payment date changes to update the amount and expiry date
    this.paymentForm.get('duration')?.valueChanges.subscribe((selectedDuration) => {
      this.updateAmount(selectedDuration);
      this.updateExpiryDate();
    });

    this.paymentForm.get('payment_date')?.valueChanges.subscribe(() => {
      this.updateExpiryDate();
    });
  }

  updateAmount(duration: number) {
    const amount = duration; // The amount is equal to the duration
    this.paymentForm.patchValue({ amount });
  }

  calculateExpiryDate(durationKey: number): string {
    const durationInDays = this.my_durations[durationKey];
    const startDate = new Date(); // Today's date
    const expiryDate = new Date(startDate.getTime() + durationInDays * 24 * 60 * 60 * 1000);
    return expiryDate.toISOString(); // Ensure ISO string format
  }

  updateExpiryDate() {
    const duration = this.paymentForm.get('duration')?.value;
    const expiryDate = this.calculateExpiryDate(duration);
    this.paymentForm.patchValue({ expiry_date: expiryDate });
  }

  onCancel() {
    // Close modal with cancel status
    this.modalController.dismiss({ dismissed: 'cancel' });
  }

  async onSubmit() {
    if (this.paymentForm.valid) {
      
      const amount = this.paymentForm.get('amount')?.value;
      const duration = this.paymentForm.get('duration')?.value;
      const paymentDate = this.paymentForm.get('payment_date')?.value;
      const expiryDate = this.paymentForm.get('expiry_date')?.value;
  
      const alert = await this.alertController.create({
        header: 'Confirm Payment',
        message: `
          Amount: ${amount}
          Duration: ${duration} Months
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
                duration_months: duration,
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
                await firstValueFrom(this.paymentsService.createOrRenewPayment(amount, duration));
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
}
