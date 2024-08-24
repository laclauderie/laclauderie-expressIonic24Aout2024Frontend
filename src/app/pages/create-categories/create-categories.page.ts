import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { ModalController, AlertController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { CategoriesService, Category } from 'src/app/services/categories.service';

@Component({
  selector: 'app-create-categories',
  templateUrl: './create-categories.page.html',
  styleUrls: ['./create-categories.page.scss'],
})
export class CreateCategoriesPage implements OnInit {

  @Input() commerceId!: string; // Input property to receive commerceId
 
  categoryForm: FormGroup;
  categoryImage?: string; // Holds the base64 image data for preview

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private alertController: AlertController,
    private categoriesService: CategoriesService
  ) {
    this.categoryForm = this.fb.group({
      category_name: ['', Validators.required],
      image_category: [''], // Optional field for base64 image
      icon: [''] // Optional field for icon selection
    });
  }

  ngOnInit() {
    console.log('category on init');
  }

  async onSubmit() {
    if (this.categoryForm.invalid) {
      console.log('Form is invalid');
      return;
    }
      
    const category: Category = {
      id: '',
      category_name: this.categoryForm.get('category_name')!.value,
      commerce_id: this.commerceId,
      image_category: this.categoryForm.get('image_category')!.value // Optional field
    };
     
    try {
      const newCategory = await firstValueFrom(this.categoriesService.createCategory(category));
      
      // Show success alert
      const successAlert = await this.alertController.create({
        header: 'Success',
        message: 'Category created successfully!',
        buttons: ['OK']
      });
  
      await successAlert.present();
  
      // Dismiss the modal and return the newCategoryId
      await this.modalController.dismiss({ newCategoryId: newCategory.id });
    } catch (error: any) {
      console.error('Error creating category:', error); // Log the error
      await this.showErrorAlert('Error creating category: ' + error.message);
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
  onCancel() {
    // Close or navigate back to the previous page
    console.log('Cancelled');
    this.modalController.dismiss();
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
        this.categoryForm.patchValue({ image_category: blob });
        this.categoryImage = URL.createObjectURL(blob);
      }
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (event: any) => {
        const file = event.target.files[0];
        const blob = new Blob([file], { type: file.type });
        const url = URL.createObjectURL(blob);
        this.categoryForm.patchValue({ image_category: blob });
        this.categoryImage = url;
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
