import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ModalController,
  AlertController,
  NavController,
} from '@ionic/angular';
import { CommercesService } from '../../services/commerces.service';
import { CategoriesService } from '../../services/categories.service';
import { BusinessOwnerService } from '../../services/business-owner.service';
import { VillesService } from 'src/app/services/villes.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductsService } from '../../services/products.service';
import { DetailsService } from '../../services/details.service';
import { CreateDetailsPage } from '../create-details/create-details.page';
import { EditDeleteDetailsPage } from '../edit-delete-details/edit-delete-details.page'; // Adjust the import as needed

interface Commerce {
  id: string;
  commerce_name: string;
  services: string;
  image_commerce: Blob;
  ville_id: string;
  business_owner_id: string;
}

interface BusinessOwner {
  id: string;
  monthly_fee_paid: boolean;
}

export interface Category {
  id: string;
  category_name: string;
  commerce_id: string;
  image_category?: string; // optional field
}

export interface Product {
  id: string;
  product_name: string;
  price: number;
  reference?: string; // optional field
  description?: string; // optional field
  category_id: string;
  image_product?: string; // optional field
}

export interface Detail {
  id: string;
  detail_name: string;
  description?: string;
  product_id: string;
  image_detail?: string;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  commerces: Commerce[] = [];
  categories: Category[] = [];
  details: Detail[] = [];
  selectedCategory: Category | null = null;
  isMonthlyFeePaid = false;
  selectedCommerceIndex = 0;
  selectedCommerce?: Commerce;
  selectedCommerceImage?: string;
  businessOwnerId!: string;
  selectedCommerceServices: string[] = [];
  villeName: string | undefined;
  services: string[] = [];
  selectedCategoryIndex = 0;
  selectedProductIndex = 0;
  selectedDetailIndex: number | null = null;
  selectedDetailImage?: string;
  categoriesList: Category[] = [];

  products: Product[] = [];
  selectedProduct: Product | null = null;
  selectedDetail: Detail | null = null;
  detailForm: FormGroup;

  constructor(
    private businessOwnerService: BusinessOwnerService,
    private modalController: ModalController,
    private alertController: AlertController,
    private commercesService: CommercesService,
    private villesService: VillesService,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private detailsService: DetailsService
  ) {
    this.detailForm = this.fb.group({
      detail_name: ['', Validators.required],
      description: [''],
      product_id: ['', Validators.required],
      image_detail: [''],
    });
  }

  ngOnInit() {
    this.checkPaymentStatus();
  }

  checkPaymentStatus() {
    this.businessOwnerService.getBusinessOwner().subscribe({
      next: (data: BusinessOwner) => {
        if (data) {
          this.businessOwnerId = data.id;
          this.isMonthlyFeePaid = data.monthly_fee_paid;
          if (this.isMonthlyFeePaid) {
            this.loadCommerces();
          } else {
            this.showPaymentAlert();
          }
        } else {
          this.showErrorAlert('No business owner data found');
        }
      },
      error: () => {
        this.showErrorAlert('Error fetching business owner details');
      },
    });
  }

  async showPaymentAlert() {
    const alert = await this.alertController.create({
      header: 'Payment Required',
      message: 'Please make or renew your payment to access your commerces.',
      buttons: ['OK'],
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

  loadCommerces() {
    this.commercesService.getCommerces().subscribe({
      next: (data: Commerce[]) => {
        this.commerces = data.sort((a, b) =>
          a.commerce_name.localeCompare(b.commerce_name)
        );
        if (this.commerces.length === 0) {
          this.showNoCommercesAlert();
        } else {
          this.selectCommerce(0); // Select the first commerce by default
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.showNoCommercesAlert();
        } else {
          this.showErrorAlert('Error fetching commerces');
        }
      },
    });
  }

  selectCommerce(index: number) {
    this.selectedCommerceIndex = index;
    this.selectedCommerce = this.commerces[index];
    this.loadCategories(this.selectedCommerce.id);
  }

  loadCategories(commerceId: string) {
    this.categoriesService.getCategories(commerceId).subscribe({
      next: (data: Category[]) => {
        this.categories = data.sort((a, b) =>
          a.category_name.localeCompare(b.category_name)
        );
        if (this.categories.length > 0) {
          this.selectCategory(0); // Automatically select the first category
        } else {
          this.selectedCategory = null;
          this.products = [];
          this.details = [];
          this.selectedProduct = null;
          this.selectedDetail = null;
        }
      },
      error: () => {
        this.showErrorAlert('Error fetching categories');
      },
    });
  }

  selectCategory(index: number) {
    this.selectedCategoryIndex = index;
    this.selectedCategory = this.categories[index];
    if (this.selectedCommerce && this.selectedCategory) {
      this.loadProducts(this.selectedCommerce.id, this.selectedCategory.id);
    }
  }

  loadProducts(commerceId: string, categoryId: string) {
    this.productsService.getAllProducts(commerceId, categoryId).subscribe({
      next: (data: Product[]) => {
        this.products = data.sort((a, b) =>
          a.product_name.localeCompare(b.product_name)
        );
        if (this.products.length > 0) {
          this.selectProduct(0); // Automatically select the first product
        } else {
          this.selectedProduct = null;
          this.details = [];
          this.selectedDetail = null;
        }
      },
      error: () => {
        this.showErrorAlert('Error fetching products');
      },
    });
  }

  selectProduct(index: number) {
    this.selectedProductIndex = index;
    this.selectedProduct = this.products[index];
    if (
      this.selectedProduct &&
      this.selectedCommerce &&
      this.selectedCategory
    ) {
      this.loadDetails(
        this.selectedCommerce.id,
        this.selectedCategory.id,
        this.selectedProduct.id
      );
      this.loadDetailImage(this.selectedProduct.image_product);
      this.detailForm.patchValue({
        detail_name: '',
        description: '',
        product_id: this.selectedProduct.id,
        image_detail: '',
      });
    }
  }

  loadDetailImage(imageBuffer: any) {
    if (imageBuffer) {
      const byteArray = new Uint8Array(imageBuffer.data);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const reader = new FileReader();
      reader.onloadend = () => {
        this.selectedDetailImage = reader.result as string;
      };
      reader.readAsDataURL(blob);
    } else {
      this.selectedDetailImage = undefined;
    }
  }

  loadDetails(commerceId: string, categoryId: string, productId: string) {
    this.detailsService
      .getDetailsByProduct(commerceId, categoryId, productId)
      .subscribe({
        next: (data: Detail[]) => {
          this.details = data.sort((a, b) =>
            a.detail_name.localeCompare(b.detail_name)
          );
          if (this.details.length > 0) {
            this.selectDetail(0); // Automatically select the first detail
          } else {
            this.selectedDetail = null;
          }
        },
        error: () => {
          this.showErrorAlert('Error fetching details');
        },
      });
  }

  selectDetail(index: number) {
    this.selectedDetailIndex = index;  // Update the selectedDetailIndex
    this.selectedDetail = this.details[index];
    if (this.selectedDetail) {
        this.loadDetailImage(this.selectedDetail.image_detail);
        this.detailForm.patchValue(this.selectedDetail);
    }
}

  onCancel() {
    this.navCtrl.back();
  }

  async showNoCommercesAlert() {
    const alert = await this.alertController.create({
      header: 'No Commerces Found',
      message: 'You do not have any commerces registered.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async showNoCategoriesAlert() {
    const alert = await this.alertController.create({
      header: 'No Categories Found',
      message: 'Please create a category before adding products.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async openCreateDetailsPage() {
    if (this.commerces.length === 0) {
      await this.showAlert(
        'No commerces available',
        'Please add a commerce first.'
      );
      return;
    }

    if (this.categories.length === 0) {
      await this.showAlert(
        'No categories available',
        'Please add a category first.'
      );
      return;
    }

    if (this.products.length === 0) {
      await this.showAlert(
        'No products available',
        'Please add a product first.'
      );
      return;
    }

    const modal = await this.modalController.create({
      component: CreateDetailsPage,
      componentProps: {
        commerceId: this.commerces[this.selectedCommerceIndex].id,
        categoryId: this.categories[this.selectedCategoryIndex].id,
        productId: this.products[this.selectedProductIndex].id,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.newDetailId) {
        if (
          this.selectedCommerce &&
          this.selectedCategory &&
          this.selectedProduct
        ) {
          this.addNewDetail(
            this.selectedCommerce.id,
            this.selectedCategory.id,
            this.selectedProduct.id,
            result.data.newDetailId
          );
        }
      }
    });

    return await modal.present();
  }

  addNewDetail(
    commerceId: string,
    categoryId: string,
    productId: string,
    detailId: string
  ) {
    this.detailsService
      .getDetailById(commerceId, categoryId, productId, detailId)
      .subscribe({
        next: (newDetail: any) => {
          // Replace `any` with the appropriate type if available
          this.details.push(newDetail);
          this.details.sort((a, b) =>
            a.detail_name.localeCompare(b.detail_name)
          ); // Re-sort the details list
          this.selectDetail(
            this.details.findIndex((detail) => detail.id === newDetail.id)
          ); // Select the new detail
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorAlert('Error fetching new detail details');
        },
      });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async openEditDeleteDetailsPage() {
    // Ensure all required properties are present
    if (this.commerces.length === 0) {
      await this.showAlert(
        'No commerces available',
        'Please add a commerce first.'
      );
      return;
    }

    if (this.categories.length === 0) {
      await this.showAlert(
        'No categories available',
        'Please add a category first.'
      );
      return;
    }

    if (this.products.length === 0) {
      await this.showAlert(
        'No products available',
        'Please add a product first.'
      );
      return;
    }

    if (!this.selectedDetail) {
      await this.showAlert(
        'No detail selected',
        'Please select a detail to edit or delete.'
      );
      return;
    }

    const modal = await this.modalController.create({
      component: EditDeleteDetailsPage,
      componentProps: {
        commerceId: this.commerces[this.selectedCommerceIndex!].id,
        categoryId: this.categories[this.selectedCategoryIndex!].id,
        productId: this.products[this.selectedProductIndex!].id,
        detailId: this.selectedDetail.id, // Pass the ID of the selected detail
        detail: this.selectedDetail, // Optionally, pass the whole detail object
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        if (result.data.updatedDetail) {
          // Update the detail in the list
          this.updateDetailInList(result.data.updatedDetail);

          // Set the updated detail as the selected detail
          this.selectedDetail = result.data.updatedDetail;

          // Refresh the form with the updated detail
          if (this.selectedDetail) {
            // If selectedDetail is not null, update the form with the detail's values
            this.detailForm.patchValue(this.selectedDetail);
          } else {
            // If selectedDetail is null, you might want to reset the form or take another action
            this.detailForm.reset(); // Optional: This will clear the form if there's no selected detail
          }
        }

        if (result.data.deletedDetailId) {
          // Remove the deleted detail from the list
          this.removeDetailFromList(result.data.deletedDetailId);

          // If there are still details left, select the first one
          if (this.details.length > 0) {
            this.selectedDetail = this.details[0];
            this.detailForm.patchValue(this.selectedDetail);
          } else {
            // If no details are left, clear the form
            this.selectedDetail = null;
            this.detailForm.reset();
          }
        }
      }
    });

    return await modal.present();
  }

  /* private updateDetailInList(updatedDetail: any) {
    const index = this.details.findIndex((detail) => detail.id === updatedDetail.id);
    if (index !== -1) {
      this.details[index] = updatedDetail;
    }
  } */

  private removeDetailFromList(detailId: number) {
    this.details = this.details.filter(
      (detail) => detail.id !== detailId.toString()
    );
  }

  private updateDetailInList(updatedDetail: any) {
    // Update the detail in your list with the updatedDetail object
    const index = this.details.findIndex(
      (detail) => detail.id === updatedDetail.id
    );
    if (index !== -1) {
      this.details[index] = updatedDetail;
    }
  }

  private async showNoDetailSelectedAlert() {
    const alert = await this.alertController.create({
      header: 'No Detail Selected',
      message: 'Please select a detail to edit or delete.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
