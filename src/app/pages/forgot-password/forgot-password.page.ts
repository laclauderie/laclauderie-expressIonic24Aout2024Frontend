import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service'; // Adjust the path as needed
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  forgotPasswordForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    console.log('forgot password');
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    } 

    const { email } = this.forgotPasswordForm.value;

    this.userService.requestPasswordReset(email).subscribe({
      next: (response: any) => {
        console.log('Password reset email sent', response);
        this.showAlert('Success', 'Password reset email sent. Check your inbox.');
      },
      error: (error: any) => {
        console.error('Error sending password reset email', error);
        this.showAlert('Error', 'Failed to send password reset email.');
      }
    });
  }

}
