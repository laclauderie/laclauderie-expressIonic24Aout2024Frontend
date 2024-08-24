import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { CommercesService } from '../../services/commerces.service';
import { VillesService } from '../../services/villes.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-commerces',
  templateUrl: './create-commerces.page.html',
  styleUrls: ['./create-commerces.page.scss'],
})
export class CreateCommercesPage implements OnInit {

  @Input() businessOwnerId!: string;
  commerceForm: FormGroup;
  villes: any[] = [];
  commerceImage: string | undefined;

  constructor(
    private fb: FormBuilder,
    private commercesService: CommercesService,
    private villesService: VillesService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {
    this.commerceForm = this.fb.group({
      commerce_name: ['', Validators.required],
      ville_name: ['', Validators.required],
      services: ['', Validators.required],
      image_commerce: [null] // For file input
    });
  }

  ngOnInit() {
    this.loadVilles();
  }

  private loadVilles() {
    this.villesService.getAllVilles().subscribe({
      next: (data) => {
        this.villes = data;
      },
      error: (error) => {
        console.error('Error fetching villes:', error);
      }
    });
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  async selectImage() {
    let image;

    if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios') {
      image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      if (image && image.webPath) {
        const base64String = await this.readAsBase64(image);
        const blob = await this.base64ToBlob(base64String);
        this.commerceForm.patchValue({ image_commerce: blob });
        this.commerceImage = URL.createObjectURL(blob);
      }
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (event: any) => {
        const file = event.target.files[0];
        const blob = new Blob([file], { type: file.type });
        const url = URL.createObjectURL(blob);
        this.commerceForm.patchValue({ image_commerce: blob });
        this.commerceImage = url;
      };

      input.click();
    }
  }

  async readAsBase64(photo: any) {
    const response = await fetch(photo.webPath);
    const blob = await response.blob();

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async base64ToBlob(base64String: string): Promise<Blob> {
    const byteString = atob(base64String.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: 'image/jpeg' });
  }

  async submitForm() {
    if (this.commerceForm.invalid) {
      return;
    }
  
    const formData = new FormData();
    formData.append('commerce_name', this.commerceForm.get('commerce_name')!.value);
    formData.append('ville_name', this.commerceForm.get('ville_name')!.value);
    formData.append('services', this.commerceForm.get('services')!.value);
  
    const image = this.commerceForm.get('image_commerce')!.value;
    if (image) {
      formData.append('image_commerce', image, 'image.jpg');
    }
  
    try {
      const newCommerce = await firstValueFrom(this.commercesService.createCommerce(formData));
      
      // Show success alert
      const successAlert = await this.alertController.create({
        header: 'Success',
        message: 'Commerce created successfully!',
        buttons: ['OK']
      });
  
      await successAlert.present();
  
      // Dismiss the modal and return the newCommerceId
      await this.modalController.dismiss({ newCommerceId: newCommerce.id });
    } catch (error: any) {
      console.error('Error creating commerce:', error); // Log the error
      await this.showErrorAlert('Error creating commerce: ' + error.message);
    }
  }


  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  dismiss() {
    this.modalController.dismiss();
  }


}
