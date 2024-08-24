import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetailsService } from '../../services/details.service';
import { firstValueFrom } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-edit-delete-details',
  templateUrl: './edit-delete-details.page.html',
  styleUrls: ['./edit-delete-details.page.scss'],
})
export class EditDeleteDetailsPage implements OnInit {

  @Input() commerceId!: string;
  @Input() categoryId!: string;
  @Input() productId!: string;
  @Input() detailId!: string;
  @Input() detail: any;

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
      image_detail: [null]
    });
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    if (this.detail) {
      this.detailForm.patchValue({
        detail_name: this.detail.detail_name,
        description: this.detail.description,
        image_detail: this.detail.image_detail
      });
      this.loadDetailImage(this.detailForm.value.image_detail);
    }
  }

  loadDetailImage(imageBuffer: any) {
    console.log('zaratrustra ainsi disait ...')
    if (imageBuffer) {
      const byteArray = new Uint8Array(imageBuffer.data);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const reader = new FileReader();
      reader.onloadend = () => {
        this.detailImage = reader.result as string;
      };
      reader.readAsDataURL(blob);
    } else {
      this.detailImage = undefined;
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async updateDetail() {
    if (this.detailForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const updatedDetail = {
      ...this.detail,
      detail_name: this.detailForm.get('detail_name')!.value,
      description: this.detailForm.get('description')!.value,
      image_detail: this.detailForm.get('image_detail')!.value
    };

    const changesDetected = Object.keys(this.detailForm.controls).some(key => {
      return this.detail[key] !== this.detailForm.get(key)!.value;
    });

    if (!changesDetected) {
      const noChangesAlert = await this.alertController.create({
        header: 'No Changes Detected',
        message: 'No changes were made to the detail.',
        buttons: ['OK']
      });

      await noChangesAlert.present();
      return;
    }

    try {
      const response = await firstValueFrom(this.detailsService.updateDetail(this.commerceId, this.categoryId, this.productId, this.detailId, updatedDetail));
      const successAlert = await this.alertController.create({
        header: 'Success',
        message: 'Detail updated successfully!',
        buttons: ['OK']
      });

      await successAlert.present();
      this.modalController.dismiss({ updatedDetail: response });
    } catch (error: any) {
      console.error('Error updating detail:', error);
      await this.showErrorAlert('Error updating detail: ' + error.message);
    }
  }

  async deleteDetail() {
    const alert = await this.alertController.create({
      header: 'Warning',
      message: 'Are you sure you want to delete this detail?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Delete canceled');
          }
        },
        {
          text: 'Delete',
          handler: async () => {
            try {
              await firstValueFrom(this.detailsService.deleteDetail(this.commerceId, this.categoryId, this.productId, this.detailId));
              const successAlert = await this.alertController.create({
                header: 'Success',
                message: 'Detail deleted successfully!',
                buttons: ['OK']
              });
              await successAlert.present();
              this.modalController.dismiss({ deletedDetailId: this.detailId });
            } catch (error: any) {
              console.error('Error deleting detail:', error);
              await this.showErrorAlert('Error deleting detail: ' + error.message);
            }
          }
        }
      ]
    });

    await alert.present();
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
