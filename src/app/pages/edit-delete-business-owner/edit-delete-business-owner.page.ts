import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessOwnerService } from '../../services/business-owner.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';

@Component({ 
  selector: 'app-edit-delete-business-owner',
  templateUrl: './edit-delete-business-owner.page.html',
  styleUrls: ['./edit-delete-business-owner.page.scss'],
})
export class EditDeleteBusinessOwnerPage implements OnInit {
  @Input() businessOwner: any;
  businessOwnerForm: FormGroup;
  initialBusinessOwner: any;
  businessOwnerImage: string | null = null;
  originalFormValue: any;
  imageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private businessOwnerService: BusinessOwnerService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {
    this.businessOwnerForm = this.fb.group({
      id: [''],
      user_id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      adresse: [''],
      telephone1: [''],
      telephone2: [''],
      monthly_fee_paid: [false],
      image_owner: [''],
    });
  }

  ngOnInit() {
    this.loadBusinessOwner();
  }

  loadBusinessOwner() { 
    this.businessOwnerService.getBusinessOwner().subscribe({
      next: data => {
        console.log('data', data);
        if (data) {
          this.businessOwner = data;
          this.businessOwnerForm.patchValue(this.businessOwner);
          this.loadBusinessOwnerImage(this.businessOwner.id);
        } else {
          this.businessOwner = null;
          this.businessOwnerForm.reset();
          console.log('No business owners found');
        }
      },
      error: error => {
        console.error('Error loading business owners', error);
      }
    });
  } 

  loadBusinessOwnerImage(id: number) {
    this.businessOwnerService.getBusinessOwnerImage().subscribe({
      next: (blob: Blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.businessOwnerImage = reader.result as string;
        };
        reader.readAsDataURL(blob);
      },
      error: error => {
        console.error('Error loading business owner image', error);
      }
    });
  }
  
  async saveBusinessOwner() {
    const modifiedFields = this.getModifiedFields();
    const imageModified = this.businessOwnerForm.value.image_owner !== this.businessOwner.image_owner;
  
    try {
      if (Object.keys(modifiedFields).length > 0 && imageModified) {
        await firstValueFrom(this.businessOwnerService.updateBusinessOwnerNonImageFields(modifiedFields));
        await firstValueFrom(this.businessOwnerService.updateBusinessOwnerImage(this.businessOwnerForm.value.image_owner));
      } else if (Object.keys(modifiedFields).length > 0) {
        await firstValueFrom(this.businessOwnerService.updateBusinessOwnerNonImageFields(modifiedFields));
      } else if (imageModified) {
        await firstValueFrom(this.businessOwnerService.updateBusinessOwnerImage(this.businessOwnerForm.value.image_owner));
      } else {
        await this.showAlert('No Changes', 'No modifications were made.');
        return;
      }
  
      await this.showAlert('Success', 'Business owner details updated successfully.');
      this.modalController.dismiss({ dismissed: 'confirm' });
  
    } catch (error) {
      console.error('Error updating business owner:', error);
      await this.showAlert('Error', 'Failed to update business owner details.');
    }
  }
  
  private getModifiedFields() {
    const modifiedFields: any = {};
    const currentFormValue = this.businessOwnerForm.value;
  
    for (const key in currentFormValue) {
      if (currentFormValue[key] !== this.businessOwner[key] && key !== 'image_owner') {
        modifiedFields[key] = currentFormValue[key];
      }
    }
  
    return modifiedFields;
  }
   

  closeModal() {
    this.modalController.dismiss();
  }

  async onCancel() {
    this.modalController.dismiss({ dismissed: 'cancel' });
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
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
        this.businessOwnerForm.patchValue({ image_owner: blob });
        this.businessOwnerImage = URL.createObjectURL(blob);
      }
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (event: any) => {
        const file = event.target.files[0];
        const blob = new Blob([file], { type: file.type });
        const url = URL.createObjectURL(blob);
        this.businessOwnerForm.patchValue({ image_owner: blob });
        this.businessOwnerImage = url;
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

  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  dataURLToBlob(dataURL: string): Blob {
    const binary = atob(dataURL.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  }

  async deleteMyBusinessOwner() {
    const confirmAlert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this business owner?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            try {
              await firstValueFrom(this.businessOwnerService.deleteBusinessOwner());
              const successAlert = await this.alertController.create({
                header: 'Success',
                message: 'Business owner deleted successfully!',
                buttons: ['OK']
              });
              await successAlert.present();
              
              // Dismiss the modal and return the deleted status
              await this.modalController.dismiss({ dismissed: 'delete' });
            } catch (error: any) {
              console.error('Error deleting business owner:', error);
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Failed to delete business owner: ' + error.message,
                buttons: ['OK']
              });
              await errorAlert.present();
            }
          }
        }
      ]
    });

    await confirmAlert.present();
  }
}
