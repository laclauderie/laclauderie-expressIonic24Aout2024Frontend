import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';
import { DetailsService } from 'src/app/services/details.service';



@Component({
  selector: 'app-create-details',
  templateUrl: './create-details.page.html',
  styleUrls: ['./create-details.page.scss'],
})
export class CreateDetailsPage implements OnInit {

  @Input() commerceId!: string;
  @Input() categoryId!: string;
  @Input() productId!: string;

  detailForm: FormGroup;
  detailImage?: string;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private detailsService: DetailsService
  ) {
    this.detailForm = this.formBuilder.group({
      detail_name: ['', Validators.required],
      description: [''],
      image_detail: ['']
    });
  }

  ngOnInit() {
    // Optionally, use the inputs here
    console.log('Commerce ID:', this.commerceId);
    console.log('Category ID:', this.categoryId);
    console.log('Product ID:', this.productId);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async createDetail() {
    if (this.detailForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const detail = {
      detail_name: this.detailForm.get('detail_name')!.value,
      description: this.detailForm.get('description')!.value,
      image_detail: this.detailForm.get('image_detail')!.value
    };

    console.log('detail', detail);
    try {
      const newDetail = await firstValueFrom(this.detailsService.createDetail(this.commerceId, this.categoryId, this.productId, detail));

      // Show success alert
      const successAlert = await this.alertController.create({
        header: 'Success',
        message: 'Detail created successfully!',
        buttons: ['OK']
      });

      await successAlert.present();

      // Dismiss the modal and return the newDetailId
      await this.modalController.dismiss({ newDetailId: newDetail.id });
    } catch (error: any) {
      console.error('Error creating detail:', error);
      await this.showErrorAlert('Error creating detail: ' + error.message);
    }
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
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
        this.detailForm.patchValue({ image_detail: blob });
        this.detailImage = URL.createObjectURL(blob);
      }
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (event: any) => {
        const file = event.target.files[0];
        const blob = new Blob([file], { type: file.type });
        const url = URL.createObjectURL(blob);
        this.detailForm.patchValue({ image_detail: blob });
        this.detailImage = url;
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

}
