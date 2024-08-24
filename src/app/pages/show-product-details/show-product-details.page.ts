import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsService } from '../../services/details.service';
import { Observable } from 'rxjs';
 

@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.page.html',
  styleUrls: ['./show-product-details.page.scss'],
})
export class ShowProductDetailsPage implements OnInit {

  productId!: string;
  details: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private detailsService: DetailsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('productId') || '';
    console.log('Product ID:', this.productId);
    this.loadDetailsByProducId(this.productId);
  }

  loadDetailsByProducId (productId: string) {
    this.detailsService.getDetailsByProductId(productId).subscribe({
      next: (detailsData) => {
        this.details = detailsData;
        this.loadImagesForProducts(this.details);
      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
    });
  }

  loadImagesForProducts (detailList: any[]) {
    detailList.forEach((detail) => {
      this.loadDetailImage(detail.image_detail).subscribe({
        next: (imageSrc) => {
          detail.imageSrc = imageSrc;
        },
        error: (error) => {
          console.error('Error loading detail image:', error);
          detail.imageSrc = 'path/to/default/detail/image.jpg'; // Set a default image if error occurs
        },
      });
    });
  }

  loadDetailImage (imageBuffer: any): Observable<string> {
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

}
