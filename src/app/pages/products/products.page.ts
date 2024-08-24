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
import { CreateProductsPage } from '../create-products/create-products.page';
import { EditDeleteProductsPage } from '../edit-delete-products/edit-delete-products.page'; // Import the modal page


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

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  commerces: Commerce[] = [];
  categories: Category[] = [];
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
  selectedProductImage?: string;
  categoriesList: Category[] = [];
   
  products: Product[] = [];
  selectedProduct: Product | null = null;
  productForm: FormGroup;

  constructor(
    private businessOwnerService: BusinessOwnerService,
    private modalController: ModalController,
    private alertController: AlertController,
    private commercesService: CommercesService,
    private villesService: VillesService,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private categoriesService: CategoriesService,
    private productsService: ProductsService
  ) {
    this.productForm = this.fb.group({
      product_name: ['', Validators.required],
      price: ['', Validators.required],
      reference: [''],
      description: [''],
      category_id: [''],
      image_product: ['']
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
        this.commerces = data.sort((a, b) => a.commerce_name.localeCompare(b.commerce_name));
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
        this.categories = data.sort((a, b) => a.category_name.localeCompare(b.category_name));
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
    if (this.selectedCommerce&&this.selectedCategory && this.commerces.length > 0) {
      const firstCommerceId = this.commerces[0].id;
      this.loadProducts(this.selectedCommerce.id, this.selectedCategory.id);
    }
  }

  loadProducts(commerceId: string, categoryId: string) {
    this.productsService.getAllProducts(commerceId, categoryId).subscribe({
      next: (data: Product[]) => {
        this.products = data.sort((a, b) => a.product_name.localeCompare(b.product_name));
        if (this.products.length > 0) {
          this.selectProduct(0); // Select the first product by default
        } else {
          this.selectedProduct = null;
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
    if (this.selectedProduct) {
      this.loadProductImage(this.selectedProduct.image_product);
      this.productForm.patchValue(this.selectedProduct);
    }
  }

  loadProductImage(imageBuffer: any) {
    if (imageBuffer) {
      const byteArray = new Uint8Array(imageBuffer.data);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const reader = new FileReader();
      reader.onloadend = () => {
        this.selectedProductImage = reader.result as string;
      };
      reader.readAsDataURL(blob);
    } else { 
      this.selectedProductImage = undefined;
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

  async openCreateProductsPage() {
    const selectedCommerce = this.commerces[this.selectedCommerceIndex];

    if (!this.selectedCategory) {
      await this.showNoCategoriesAlert();
      return;
    }

    const modal = await this.modalController.create({
      component: CreateProductsPage,
      componentProps: {
        commerceId: selectedCommerce ? selectedCommerce.id : null,
        categoryId: this.selectedCategory ? this.selectedCategory.id : null
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.newProductId) {
        const categoryId = this.selectedCategory ? this.selectedCategory.id : null;
        if (selectedCommerce && categoryId) {
          this.addNewProduct(selectedCommerce.id, categoryId, result.data.newProductId);
        }
      }
    });   

    await modal.present();
  }

  addNewProduct(commerceId: string, categoryId: string, productId: string) {
    this.productsService.getProductById(commerceId, categoryId, productId).subscribe({
      next: (newProduct: Product) => {
        this.products.push(newProduct);
        this.products.sort((a, b) => a.product_name.localeCompare(b.product_name)); // Re-sort the products list
        this.selectProduct(this.products.findIndex(product => product.id === newProduct.id)); // Select the new product
      },
      error: (error: HttpErrorResponse) => {
        this.showErrorAlert('Error fetching new product details');
      }
    }); 
  }
  
  async openEditDeleteProductsPage() {
    const selectedCommerce = this.commerces[this.selectedCommerceIndex];
    const selectedCategory = this.categories[this.selectedCategoryIndex];
    const selectedProduct = this.products[this.selectedProductIndex];

    if (!selectedCommerce || !selectedCategory || !selectedProduct) {
      this.showErrorAlert('Please select a product to edit or delete');
      return;
    }

    const modal = await this.modalController.create({
      component: EditDeleteProductsPage,
      componentProps: {
        commerceId: selectedCommerce.id,
        categoryId: selectedCategory.id,
        productId: selectedProduct.id,
        product: selectedProduct
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.deletedProductId) {
        this.handleProductDeletion(data.data.deletedProductId);
      } else if (data.data && data.data.updatedProduct) {
        this.updateProductInList(data.data.updatedProduct);
      }
    });

    return await modal.present();  
  }

  updateProductInList(updatedProduct: Product) {
    const productIndex = this.products.findIndex(p => p.id === updatedProduct.id);
    if (productIndex !== -1) {
      this.products[productIndex] = updatedProduct;
      this.products.sort((a, b) => a.product_name.localeCompare(b.product_name)); // Re-sort the products list
      this.selectProduct(productIndex); // Re-select the updated product to refresh the view
    }
  }

  handleProductDeletion(productId: string) {
    // 1. Remove the deleted product from the list of products
    this.products = this.products.filter(product => product.id !== productId);

    // 2. Remove the details of the deleted product
    if (this.selectedProduct && this.selectedProduct.id === productId) {
      this.selectedProduct = null;
    }

    // 3. Select the first product of the current category if available
    if (this.products.length > 0) {
      this.selectProduct(0); // Select the first product in the list
    }
  }
  
}
