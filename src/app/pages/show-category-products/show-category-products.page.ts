import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-show-category-products',
  templateUrl: './show-category-products.page.html',
  styleUrls: ['./show-category-products.page.scss'],
})
export class ShowCategoryProductsPage implements OnInit {
  categoryId!: string;
  products: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('categoryId') || '';
    console.log('Category ID:', this.categoryId);
    this.loadProductsByCategoryId(this.categoryId);
  }

  loadProductsByCategoryId(categoryId: string) {
    this.productsService.getProductsByCategoryId(categoryId).subscribe({
      next: (productsData) => {
        this.products = productsData;
        this.loadImagesForProducts(this.products);
      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
    });
  }

  loadImagesForProducts(productList: any[]) {
    productList.forEach((product) => {
      this.loadProductImage(product.image_product).subscribe({
        next: (imageSrc) => {
          product.imageSrc = imageSrc;
        },
        error: (error) => {
          console.error('Error loading product image:', error);
          product.imageSrc = 'path/to/default/product/image.jpg'; // Set a default image if error occurs
        },
      });
    });
  }

  loadProductImage(imageBuffer: any): Observable<string> {
    return new Observable<string>((observer) => {
      if (imageBuffer) {
        try {
          // If imageBuffer is base64 encoded
          const byteCharacters = atob(imageBuffer);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Adjust MIME type if necessary
          const imageUrl = URL.createObjectURL(blob);
          observer.next(imageUrl);
          observer.complete();
        } catch (error) {
          console.error('Error processing image buffer:', error);
          observer.error(error);
        }
      } else {
        observer.next('path/to/default/product/image.jpg');
        observer.complete();
      }
    });
  }

  showProductDetails(product: any) {
    const productId = product.id; // Assuming category has an 'id' field
    this.router.navigate(['show-product-details', productId]);
  }
  
}
