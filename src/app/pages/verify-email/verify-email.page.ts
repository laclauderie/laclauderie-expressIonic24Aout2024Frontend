import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {

  token: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    public router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.verifyEmail();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  verifyEmail() {
    this.userService.verifyEmail(this.token).subscribe({
      next: (response) => {
        if (response.message === 'Email already verified') {
          this.showAlert('Information', 'Your email is already verified. You can now log in.')
            .then(() => {
              this.router.navigate(['/login']);
            });
        } else {
          this.errorMessage = ''; // Clear any previous error message
          this.showAlert('Success', 'Your email has been successfully verified. You can now log in.')
            .then(() => {
              this.router.navigate(['/login']);
            });
        }
      },
      error: (error) => {
        console.error('Email verification error', error);
        this.errorMessage = 'Email verification failed. Please try again.';
        if (error.status === 400 && error.error) {
          this.errorMessage = error.error.error || error.message || this.errorMessage;
        }
        this.showAlert('Error', this.errorMessage);
      },
    });
  }

  retryVerification() {
    this.verifyEmail();
  }

}
