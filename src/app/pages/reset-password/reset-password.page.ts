import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  resetPasswordForm: FormGroup;
  token: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    const tokenFromRoute = this.route.snapshot.paramMap.get('token');
    this.token = tokenFromRoute ? tokenFromRoute : '';
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
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const { newPassword } = this.resetPasswordForm.value;

    this.userService.resetPassword(this.token, newPassword).subscribe({
      next: async (response: any) => {
        console.log('Password reset successful', response);

        // Show success alert
        await this.showAlert('Success', 'Your password has been reset successfully. Redirecting to login.');

        // Redirect to login page
        this.router.navigate(['/login']);
      },
      error: async (error: any) => {
        console.error('Password reset error', error);

        let errorMessage = 'An error occurred while resetting the password. Please try again.';
        if (error.status === 401) {
          errorMessage = 'Unauthorized access. The reset link may have expired.';
        } else if (error.status === 400) {
          errorMessage = 'Bad request. Please ensure the new password meets the requirements.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        // Show error alert
        await this.showAlert('Error', errorMessage);
      }
    });
  }

}
