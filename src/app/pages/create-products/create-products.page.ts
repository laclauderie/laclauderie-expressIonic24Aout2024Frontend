import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';
import { ProductsService, Product } from 'src/app/services/products.service';



@Component({
  selector: 'app-create-products',
  templateUrl: './create-products.page.html',
  styleUrls: ['./create-products.page.scss'],
})
export class CreateProductsPage implements OnInit {

  @Input() commerceId!: string;
  @Input() categoryId!: string;

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
    // Optionally, use the inputs here
    console.log('Commerce ID:', this.commerceId);
    console.log('Category ID:', this.categoryId);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async createProduct() {
    if (this.productForm.invalid) {
      console.log('Form is invalid');
      return;
    }
 
    const product = {
      product_name: this.productForm.get('product_name')!.value,
      price: this.productForm.get('price')!.value,
      reference: this.productForm.get('reference')!.value,
      description: this.productForm.get('description')!.value,
      image_product: this.productForm.get('image_product')!.value
    };

    console.log('product', product);
    try {
      const newProduct = await firstValueFrom(this.productsService.createProduct(this.commerceId, this.categoryId, product));

      // Show success alert
      const successAlert = await this.alertController.create({
        header: 'Success',
        message: 'Product created successfully!',
        buttons: ['OK']
      });

      await successAlert.present();

      // Dismiss the modal and return the newProductId
      await this.modalController.dismiss({ newProductId: newProduct.id });
    } catch (error: any) {
      console.error('Error creating product:', error);
      await this.showErrorAlert('Error creating product: ' + error.message);
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
