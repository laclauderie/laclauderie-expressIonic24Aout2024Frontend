import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  errorMessage: string = '';
  passwordType: string = 'password';
  passwordToggleIcon: string = 'eye-off';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordToggleIcon = this.passwordToggleIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  async onSubmit(){
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.userService.login(email, password).subscribe({
      next: async (response) => {
        // Store the token in local storage
        localStorage.setItem('token', response.token);

        // Show success alert
        await this.showAlert('Success', 'Login successful! Redirecting to home.');

        // Redirect to home or dashboard page
        this.router.navigate(['/dashboard']); // Adjust path based on your routes
      },  
      error: async (error) => {
        console.error('Login error', error);
        let errorMessage = 'Invalid email or password. Please try again.';
        if (error.status === 401) {
          errorMessage = 'Unauthorized access. Please check your credentials.';
        } else if (error.status === 400) {
          errorMessage = 'Bad request. Please enter valid credentials.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        // Show error alert
        await this.showAlert('Error', errorMessage);
      }
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
  
  ngOnInit() {
    console.log('login')
  }

}
