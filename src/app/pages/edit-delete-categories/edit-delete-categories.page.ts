import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { ModalController, AlertController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import {
  CategoriesService,
  Category,
} from 'src/app/services/categories.service';

@Component({
  selector: 'app-edit-delete-categories',
  templateUrl: './edit-delete-categories.page.html',
  styleUrls: ['./edit-delete-categories.page.scss'],
})
export class EditDeleteCategoriesPage implements OnInit {
  @Input() commerceId!: string; // Input property to receive commerceId
  @Input() categoryId!: string;

  categoryForm: FormGroup;
  originalCategory?: Category;
  categoryImage?: string;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private alertController: AlertController,
    private categoriesService: CategoriesService
  ) {
    this.categoryForm = this.fb.group({
      category_name: ['', Validators.required],
      image_category: [''], // Optional field for base64 image
      icon: [''], // Optional field for icon selection
    });
  }

  ngOnInit() {
    this.loadCategory();
  }

  async loadCategory() {
    try {
      const category = await firstValueFrom(
        this.categoriesService.getCategoryById(this.categoryId, this.commerceId)
      );

      if (category) { 
        this.originalCategory = category; // Assign the category object to this.originalCategory
        this.categoryForm.patchValue({
          category_name: category.category_name,
          image_category: category.image_category,
        });
        this.loadCategoryImage(category.image_category);
      } else {
        console.error('Category not found');
        await this.showErrorAlert('Category not found');
      }
    } catch (error: any) {
      console.error('Error loading category:', error);
      await this.showErrorAlert('Error loading category: ' + error.message);
    }
  }

  loadCategoryImage(imageBuffer: any) {
    if (imageBuffer) {
      const byteArray = new Uint8Array(imageBuffer.data);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const reader = new FileReader();
      reader.onloadend = () => {
        this.categoryImage = reader.result as string;
      };
      reader.readAsDataURL(blob);
    } else {
      this.categoryImage = undefined;
    }
  }

  async onSubmit() {
    if (this.categoryForm.invalid) {
      console.log('Form is invalid');
      return;
    }
  
    if (!this.hasChanges()) {
      const noChangesAlert = await this.alertController.create({
        header: 'No Changes',
        message: 'No changes detected. Please modify at least one field.',
        buttons: ['OK'],
      });
  
      await noChangesAlert.present();
      return;
    }
  
    const updatedCategory: Category = {
      id: this.categoryId,
      category_name: this.categoryForm.get('category_name')!.value,
      commerce_id: this.commerceId,
      image_category: this.categoryForm.get('image_category')!.value,
    };
  
    try {
      const commerceId = this.commerceId;
      const categoryId = this.categoryId;
  
      await firstValueFrom(
        this.categoriesService.updateCategory(
          commerceId,
          categoryId,
          updatedCategory
        )
      );
  
      const successAlert = await this.alertController.create({
        header: 'Success',
        message: 'Category updated successfully!',
        buttons: ['OK'],
      });
  
      await successAlert.present();
  
      // Dismiss the modal with the updated category
      await this.modalController.dismiss({ updatedCategory: updatedCategory });
    } catch (error: any) {
      console.error('Error updating category:', error);
      await this.showErrorAlert('Error updating category: ' + error.message);
    }
  }
  

  hasChanges(): boolean {
    if (!this.originalCategory) return true;

    const formValue = this.categoryForm.value;
    return (
      formValue.category_name !== this.originalCategory.category_name ||
      formValue.image_category !== this.originalCategory.image_category
    );
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK'],
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

    if (
      Capacitor.getPlatform() === 'android' ||
      Capacitor.getPlatform() === 'ios'
    ) {
      image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      if (image && image.webPath) {
        const base64String = await this.readAsBase64(image);
        const blob = await this.base64ToBlob(base64String);
        this.categoryForm.patchValue({ image_commerce: blob });
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

  async onDeleteCategory(categoryId: string, commerceId: string) {
    const alert = await this.alertController.create({
      header: 'Warning',
      message: 'Are you sure you want to delete this category?',
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
              await firstValueFrom(this.categoriesService.deleteCategory(commerceId, categoryId));
              const successAlert = await this.alertController.create({
                header: 'Success',
                message: 'Category deleted successfully!',
                buttons: ['OK'],
              });
              await successAlert.present();
              // Pass the deleted category ID when dismissing the modal
              this.dismissModal({ deletedCategoryId: categoryId });
            } catch (error: any) {
              console.error('Error deleting category:', error);
              await this.showErrorAlert('Error deleting category: ' + error.message);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  
  dismissModal(data: { updatedCategory?: any; deletedCategoryId?: string }) {
    // Pass the data to the parent component
    this.modalController.dismiss(data);
  }
}
