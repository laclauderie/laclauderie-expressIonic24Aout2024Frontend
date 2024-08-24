import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService, Category } from '../../services/categories.service';
import { CommercesService } from '../../services/commerces.service';
import { BusinessOwnerService } from '../../services/business-owner.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-show-commerce-categories',
  templateUrl: './show-commerce-categories.page.html',
  styleUrls: ['./show-commerce-categories.page.scss'],
})
export class ShowCommerceCategoriesPage implements OnInit {

  commerceId!: string;
  commerceForm: FormGroup;
  categories: any[] = []

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private commercesService: CommercesService,
    private businessOwnersService: BusinessOwnerService,
    private router: Router,
  ) {
    // Initialize the form for commerce and business owner info
    this.commerceForm = this.formBuilder.group({
      commerce_name: ['', Validators.required],
      business_owner: this.formBuilder.group({
        name: ['', Validators.required],
        adresse: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telephone1: ['', Validators.required],
        telephone2: [''],
      }),
    });
  }

  ngOnInit() {
    // Get commerce ID from route params
    this.commerceId = this.route.snapshot.paramMap.get('commerceId') || '';
    // Load commerce, business owner, and categories data
    this.loadCommerceAndBusinessOwnerData(this.commerceId);
    this.loadCategoriesByCommerceId(this.commerceId);
  }

  // Load commerce and business owner data
  loadCommerceAndBusinessOwnerData(commerceId: string) {
    this.commercesService.getCommerceByIdForNonLoggedUser(commerceId).subscribe({
      next: (commerceData) => {
        // Set commerce name in the form
        this.commerceForm.patchValue({
          commerce_name: commerceData.commerce_name,
        });

        // Load business owner data
        this.businessOwnersService.getBusinessOwnerById(commerceData.BusinessOwner.id).subscribe({
          next: (businessOwnerData) => {
            // Set business owner details in the form
            this.commerceForm.patchValue({
              business_owner: {
                name: businessOwnerData.name,
                adresse: businessOwnerData.adresse,
                email: businessOwnerData.email,
                telephone1: businessOwnerData.telephone1,
                telephone2: businessOwnerData.telephone2,
              },
            });
          },
          error: (err) => {
            console.error('Error loading business owner data:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error loading commerce data:', err);
      }
    });
  }

  // Load categories by commerce ID
  loadCategoriesByCommerceId(commerceId: string) {
    this.categoriesService.getCategoriesByCommerceId(commerceId).subscribe({
      next: (categoriesData) => {
        // Set the retrieved categories data to the local array
        this.categories = categoriesData;
        // Load category images
        this.loadImagesForCategories(this.categories);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  // Load category images for all categories
  loadImagesForCategories(categoryList: any[]) {
    categoryList.forEach(category => {
      this.loadCategoryImage(category.image_category).subscribe({
        next: (imageSrc) => {
          category.imageSrc = imageSrc;
        },
        error: (error) => {
          console.error('Error loading category image:', error);
          category.imageSrc = 'path/to/default/category/image.jpg'; // Set a default image if error occurs
        }
      });
    });
  }

  // Load category image from image buffer
  loadCategoryImage(imageBuffer: any): Observable<string> {
    return new Observable<string>((observer) => {
      if (imageBuffer) {
        const byteArray = new Uint8Array(imageBuffer.data);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        const reader = new FileReader();
        reader.onloadend = () => {
          observer.next(reader.result as string);
          observer.complete();
        };
        reader.onerror = (error) => observer.error(error);
        reader.readAsDataURL(blob);
      } else {
        observer.next(undefined); // or default base64 image
        observer.complete();
      }
    });
  }

  showCategoryProducts(category: any) {
    const categoryId = category.id; // Assuming category has an 'id' field
    this.router.navigate(['/show-category-products', categoryId]);
  }

}
