import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { CommercesService } from '../../services/commerces.service';
import { VillesService } from '../../services/villes.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-delete-commerces',
  templateUrl: './edit-delete-commerces.page.html',
  styleUrls: ['./edit-delete-commerces.page.scss'],
})
export class EditDeleteCommercesPage implements OnInit {

  @Input() commerceId!: string;
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
    this.loadCommerceData();
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

  private loadCommerceData() {
    if (!this.commerceId) return;

    this.commercesService.getCommerceById(this.commerceId).subscribe({
      next: (commerce) => {
        this.commerceForm.patchValue({
          commerce_name: commerce.commerce_name,
          ville_name: commerce.Ville.ville_name,
          services: commerce.services,
        });

        if (commerce.image_commerce) {
          this.commerceImage = commerce.image_commerce;
          this.loadCommerceImage(this.commerceImage);
        }
      },
      error: (error) => {
        console.error('Error fetching commerce data:', error);
        this.showErrorAlert('Error loading commerce data');
      }
    });
  }


  loadCommerceImage(imageBuffer: any) {
    if (imageBuffer) {
      const byteArray = new Uint8Array(imageBuffer.data);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const reader = new FileReader();
      reader.onloadend = () => {
        this.commerceImage = reader.result as string;
      };
      reader.readAsDataURL(blob);    
    } else {
      this.commerceImage = undefined;
    }
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
  
    // Get initial form values
    const initialFormValues = this.commerceForm.getRawValue();
  
    // Create a FormData object to hold the form data
    const formData = new FormData();
    formData.append('commerce_name', initialFormValues.commerce_name);
    formData.append('ville_name', initialFormValues.ville_name);
    formData.append('services', initialFormValues.services);
  
    const image = initialFormValues.image_commerce;
    if (image) {
      formData.append('image_commerce', image, 'image.jpg');
    }
  
    // Fetch the existing commerce data to compare with current form values
    try {
      const commerce = await firstValueFrom(this.commercesService.getCommerceById(this.commerceId));
      const commerceData = {
        commerce_name: commerce.commerce_name,
        ville_name: commerce.Ville.ville_name,
        services: commerce.services,
        image_commerce: commerce.image_commerce
      };
  
      // Compare existing commerce data with the form data
      if (JSON.stringify(commerceData) === JSON.stringify(initialFormValues)) {
        const noChangeAlert = await this.alertController.create({
          header: 'No Changes Detected',
          message: 'There are no changes to update.',
          buttons: ['OK']
        });
  
        await noChangeAlert.present();
        return;
      }
  
      // Update commerce if changes are detected
      const updatedCommerce = await firstValueFrom(this.commercesService.updateCommerce(this.commerceId, formData));
  
      // Show success alert
      const successAlert = await this.alertController.create({
        header: 'Success',
        message: 'Commerce updated successfully!',
        buttons: ['OK']
      });
  
      await successAlert.present();
  
      // Dismiss the modal and return the updated commerce data
      await this.modalController.dismiss({ updatedCommerceId: updatedCommerce.id });
    } catch (error: any) {
      console.error('Error updating commerce:', error);
      await this.showErrorAlert('Error updating commerce: ' + error.message);
    }
  }
  
  async deleteCommerce() {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this commerce?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // User canceled the deletion
          }
        },
        {
          text: 'OK',
          role: 'destructive',
          handler: async () => {
            try {
              await firstValueFrom(this.commercesService.deleteCommerce(this.commerceId));
  
              // Show success alert
              const successAlert = await this.alertController.create({
                header: 'Success',
                message: 'Commerce deleted successfully!',
                buttons: ['OK']
              });
  
              await successAlert.present();
  
              // Dismiss the modal and notify the parent component
              await this.modalController.dismiss({ deleted: true });
            } catch (error: any) {
              console.error('Error deleting commerce:', error);
              await this.showErrorAlert('Error deleting commerce: ' + error.message);
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
      buttons: ['OK'],
    });

    await alert.present();
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
