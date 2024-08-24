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
import { CreateCategoriesPage } from '../create-categories/create-categories.page';
import { EditDeleteCategoriesPage } from '../edit-delete-categories/edit-delete-categories.page'; // Import the page

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

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  commerces: Commerce[] = [];
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  categoryForm: FormGroup;
  isMonthlyFeePaid = false;
  selectedCommerceIndex = 0;
  selectedCommerce?: Commerce;
  selectedCommerceImage?: string;
  businessOwnerId!: string;
  selectedCommerceServices: string[] = [];
  villeName: string | undefined;
  services: string[] = [];
  selectedCategoryIndex = 0;
  selectedCategoryImage?: string;
  categoriesList: Category[] = [];

  constructor(
    private businessOwnerService: BusinessOwnerService,
    private modalController: ModalController,
    private alertController: AlertController,
    private commercesService: CommercesService,
    private villesService: VillesService,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private categoriesService: CategoriesService
  ) {
    this.categoryForm = this.fb.group({
      category_name: ['', Validators.required], // Add validators as needed
      commerce_id: [''], // Assuming you may populate this from a dropdown or other source
      image_category: [''], // Optional field
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
      error: (error) => {
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
    //this.selectedCommerceImage = URL.createObjectURL(this.selectedCommerce.image_commerce);
  }

  loadCategories(commerceId: string) {
    this.categoriesService.getCategories(commerceId).subscribe({
      next: (data: Category[]) => {
        // Sort categories alphabetically by category_name
        this.categories = data.sort((a, b) =>
          a.category_name.localeCompare(b.category_name)
        );
        if (this.categories.length > 0) {
          this.selectCategory(0); // Select the first category by default
        } else {
          this.selectedCategory = null;
        }
      },  
      error: (error: HttpErrorResponse) => {
        this.showErrorAlert('Error fetching categories');
      },
    });
  }

  selectCategory(index: number) {
    this.selectedCategoryIndex = index;
    this.selectedCategory = this.categories[index];
    if (this.selectedCategory) {
      this.loadCategoryImage(this.selectedCategory.image_category);
    }
  }

  loadCategoryImage(imageBuffer: any) {
    if (imageBuffer) {
      const byteArray = new Uint8Array(imageBuffer.data);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const reader = new FileReader();
      reader.onloadend = () => {
        this.selectedCategoryImage = reader.result as string;
      };
      reader.readAsDataURL(blob);
    } else {
      this.selectedCategoryImage = undefined;
    }
  }

  async openCreateCategoryModal() {
    const modal = await this.modalController.create({
      component: CreateCategoriesPage,
      componentProps: {
        commerceId: this.selectedCommerce?.id, // Pass the current commerce id
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.newCategoryId) {
        this.updateCategoriesList(result.data.newCategoryId);
      }
    });

    await modal.present();
  }

  updateCategoriesList(newCategoryId?: string) {
    if (this.selectedCommerce?.id) {
      this.categoriesService.getCategories(this.selectedCommerce.id).subscribe({
        next: (categories: Category[]) => {
          // Sort categories alphabetically by category_name
          this.categories = categories.sort((a, b) =>
            a.category_name.localeCompare(b.category_name)
          );
          if (newCategoryId) {
            this.selectCategoryById(newCategoryId);
          } else if (this.categories.length > 0) {
            this.selectCategory(0); // Select the first category if available
          } else {
            this.selectedCategory = null;
          }
        },
        error: (error) => {
          console.error('Failed to load categories', error);
        },
      });
    } else {
      console.error('Selected commerce is undefined');
    }
  }

  selectCategoryById(categoryId: string) {
    const selectedCategoryIndex = this.categories.findIndex(
      (category) => category.id === categoryId
    );
    if (selectedCategoryIndex !== -1) {
      this.selectCategory(selectedCategoryIndex);
    }
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const category: Category = this.categoryForm.value;
      // Perform your submission logic here
      console.log('Submitted Category:', category);
    } else {
      this.showErrorAlert('Please fill in all required fields.');
    }
  }

  onCancel() {
    this.navCtrl.back();
  }

  async showNoCommercesAlert() {
    const alert = await this.alertController.create({
      header: 'No Commerces Found',
      message: 'No commerces found. Please create a new commerce.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async openEditDeleteCategoriesPage() {
    const modal = await this.modalController.create({
      component: EditDeleteCategoriesPage,
      componentProps: {
        categoryId: this.selectedCategory?.id, // Pass the current category id
        commerceId: this.selectedCommerce?.id, // Pass the current commerce id
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.updatedCategory) {
        this.updateCategoriesList(result.data.updatedCategory.id);
      } else if (result.data && result.data.deletedCategoryId) {
        this.removeDeletedCategory(result.data.deletedCategoryId);
      }
    });
    await modal.present();
  }

  removeDeletedCategory(deletedCategoryId: string) {
    // Rebuild the list and remove the deleted category
    this.updateCategoriesList();
  }
}
