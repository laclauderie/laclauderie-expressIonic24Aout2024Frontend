import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  passwordType: string = 'password';
  passwordToggleIcon: string = 'eye-off';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      this.userService.register(email, password).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.showAlert('Success', 'Registration successful! Please check your email to confirm your registration.')
            .then(() => {
              this.router.navigate(['/login']); // Navigate to the login page after registration
            });
        },
        error: (error) => {
          console.error('Registration error', error);
          let errorMessage = 'Registration failed. Please try again.';
          if (error.status === 400 && error.error) {
            errorMessage = error.error.error || error.message || errorMessage;
          }
          this.showAlert('Error', errorMessage);
        }
      });
    }
  }
  ngOnInit() {
    console.log('register');
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordToggleIcon = this.passwordToggleIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

}
