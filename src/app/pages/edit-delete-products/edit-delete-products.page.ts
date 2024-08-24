import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-edit-delete-products',
  templateUrl: './edit-delete-products.page.html',
  styleUrls: ['./edit-delete-products.page.scss'],
})
export class EditDeleteProductsPage implements OnInit {

  @Input() commerceId!: string;
  @Input() categoryId!: string;
  @Input() productId!: string;
  @Input() product: any;

  productForm: FormGroup;
  productImage?: string;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private productsService: ProductsService
  ) {
    this.productForm = this.formBuilder.group({
      product_name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      reference: [''],
      description: [''],
      image_product: ['']
    });
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    if (this.product) {
      this.productForm.patchValue({
        product_name: this.product.product_name,
        price: this.product.price,
        reference: this.product.reference,
        description: this.product.description,
        image_product: this.product.image_product
      });
      this.loadProductImage(this.productForm.value.image_product);
    }
  }

  loadProductImage(imageBuffer: any) {
    console.log('zaratrustra ainsi disait ...')
    if (imageBuffer) {
      const byteArray = new Uint8Array(imageBuffer.data);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const reader = new FileReader();
      reader.onloadend = () => {
        this.productImage = reader.result as string;
      };
      reader.readAsDataURL(blob);
    } else {
      this.productImage = undefined;
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async updateProduct() {
    if (this.productForm.invalid) {
      console.log('Form is invalid');
      return;
    }
  
    const updatedProduct = {
      ...this.product,
      product_name: this.productForm.get('product_name')!.value,
      price: this.productForm.get('price')!.value,
      reference: this.productForm.get('reference')!.value,
      description: this.productForm.get('description')!.value,
      image_product: this.productForm.get('image_product')!.value
    };
  
    // Check if there are any changes
    const changesDetected = Object.keys(this.productForm.controls).some(key => {
      return this.product[key] !== this.productForm.get(key)!.value;
    });
  
    if (!changesDetected) {
      const noChangesAlert = await this.alertController.create({
        header: 'No Changes Detected',
        message: 'No changes were made to the product.',
        buttons: ['OK']
      });
  
      await noChangesAlert.present();
      return;
    }
  
    try {
      const response = await firstValueFrom(this.productsService.updateProduct(this.commerceId, this.categoryId, this.productId, updatedProduct));
      const successAlert = await this.alertController.create({
        header: 'Success',
        message: 'Product updated successfully!',
        buttons: ['OK']
      });
  
      await successAlert.present();
      this.modalController.dismiss({ updatedProduct: response });
    } catch (error: any) {
      console.error('Error updating product:', error);
      await this.showErrorAlert('Error updating product: ' + error.message);
    }
  }
  

  async deleteProduct() {
    const alert = await this.alertController.create({
      header: 'Warning',
      message: 'Are you sure you want to delete this product?',
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
              await firstValueFrom(this.productsService.deleteProduct(this.commerceId, this.categoryId, this.productId));
              const successAlert = await this.alertController.create({
                header: 'Success',
                message: 'Product deleted successfully!',
                buttons: ['OK']
              });
              await successAlert.present();
              this.modalController.dismiss({ deletedProductId: this.productId });
            } catch (error: any) {
              console.error('Error deleting product:', error);
              await this.showErrorAlert('Error deleting product: ' + error.message);
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
        this.productForm.patchValue({ image_product: blob });
        this.productImage = URL.createObjectURL(blob);
      }
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (event: any) => {
        const file = event.target.files[0];
        const blob = new Blob([file], { type: file.type });
        const url = URL.createObjectURL(blob);
        this.productForm.patchValue({ image_product: blob });
        this.productImage = url;
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
