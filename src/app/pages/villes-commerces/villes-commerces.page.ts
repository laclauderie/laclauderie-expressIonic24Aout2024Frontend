import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommercesService } from '../../services/commerces.service';
import { VillesService } from '../../services/villes.service';
import { Observable } from 'rxjs'; 
import { ActivitiesVillesPage } from '../activities-villes/activities-villes.page';
import { NavController } from '@ionic/angular';



@Component({
  selector: 'app-villes-commerces',
  templateUrl: './villes-commerces.page.html',
  styleUrls: ['./villes-commerces.page.scss'],
})
export class VillesCommercesPage implements OnInit {

  commerces: any[] = [];
  filteredCommerces: any[] = [];
  isLoading: boolean = false;
  searchQuery: string = '';
  loadingProgress: number = 0;

  constructor(
    private commercesService: CommercesService,
    private villesService: VillesService,
    private modalController: ModalController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.loadCommerces();
  }

  ionViewWillEnter() {
    this.loadCommerces();
  }

  loadCommerces() {
    this.isLoading = true;
    
    this.commercesService.getCommercesByPaidBusinessOwners().subscribe({
      next: (data) => {
        this.commerces = data;
        this.filteredCommerces = [...this.commerces];
        // Sort commerces alphabetically by commerce_name
        this.filteredCommerces.sort((a, b) => a.commerce_name.localeCompare(b.commerce_name));
  
        // After fetching commerces, load the ville names and images
        this.loadVilleNamesAndImages(this.filteredCommerces);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching commerces:', error);
        this.isLoading = false;
      }
    });
  }

  loadVilleNamesAndImages(commercesList: any[]) {
    commercesList.forEach(commerce => {
      // Load ville name
      this.villesService.getVilleName(commerce.ville_id).subscribe({
        next: (villeData) => {
          commerce.ville_name = villeData.ville_name;
        },
        error: (error) => {
          console.error('Error fetching ville name:', error);
          commerce.ville_name = 'Unknown';
        }
      });

      // Load commerce image
      this.loadCommerceImage(commerce.image_commerce).subscribe({
        next: (imageSrc) => {
          commerce.imageSrc = imageSrc;
        },
        error: (error) => {
          console.error('Error fetching commerce image:', error);
          commerce.imageSrc = 'path/to/default/image.jpg'; // Set a default image if error occurs
        }
      });
    });
  }

  loadCommerceImage(imageBuffer: any): Observable<string> {
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
        observer.next(undefined);
        observer.complete();
      }
    });
  }

  refreshCommerces(event: any) {
    this.loadCommerces();
    event.target.complete();
  }

  onSearch() {
    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      this.commercesService.searchCommerces(query).subscribe({
        next: (data) => {
          this.filteredCommerces = data;
          // If needed, sort filtered commerces
          this.filteredCommerces.sort((a, b) => a.commerce_name.localeCompare(b.commerce_name));

          // Load ville names and images for filtered results
          this.loadVilleNamesAndImages(this.filteredCommerces);
        },
        error: (error) => {
          console.error('Error searching commerces:', error);
          this.filteredCommerces = [];
        }
      });
    } else {
      // Reset filtered commerces to the full list and sort it alphabetically
      this.filteredCommerces = [...this.commerces];
      this.filteredCommerces.sort((a, b) => a.commerce_name.localeCompare(b.commerce_name));
      
      // Reapply the ville names and images for the full list
      this.loadVilleNamesAndImages(this.filteredCommerces);
    }
  }

  async displayVilles() {
    const modal = await this.modalController.create({
      component: ActivitiesVillesPage,
      componentProps: {
        villeLocations: this.getVillesFromCommerces()
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.loadCommercesForVille(result.data.selectedVille);
      }
    });

    return await modal.present();
  }

  loadCommercesForVille(villeName: string) {
    this.isLoading = true;  // Set loading state
  
    this.commercesService.getCommercesByVille(villeName).subscribe({
      next: (data) => {
        this.commerces = data; 
        this.filteredCommerces = [...this.commerces];  // Store all commerces as filtered commerces
  
        // Sort commerces alphabetically by commerce_name
        this.filteredCommerces.sort((a, b) => a.commerce_name.localeCompare(b.commerce_name));
  
        // Load images for commerces
        this.loadImages(this.filteredCommerces, villeName);
  
        this.isLoading = false;  // Set loading state to false after completion
      },
      error: (error) => {
        console.error('Error fetching commerces for ville:', error);
        this.filteredCommerces = [];
        this.isLoading = false;  // Set loading state to false in case of error
      }
    });
  }
  
  loadImages(commercesList: any[], villeName: string) {
    commercesList.forEach(commerce => {
      // Assign the ville name directly
      commerce.ville_name = villeName;
  
      // Load commerce image
      this.loadCommerceImage(commerce.image_commerce).subscribe({
        next: (imageSrc) => {
          commerce.imageSrc = imageSrc;
        },
        error: (error) => {
          console.error('Error fetching commerce image:', error);
          commerce.imageSrc = 'path/to/default/image.jpg'; // Set a default image if error occurs
        }
      });
    });

    
  }
  
  getVillesFromCommerces() {
    const villeSet = new Set(this.commerces.map(commerce => commerce.ville_name));
    return Array.from(villeSet).sort();
  }

  clearFilter() {
    this.loadCommerces()
  }

  showCommerceCategories(commerce: any) {
    // Navigate to ShowCommerceCategoriesPage with the commerceId as a route parameter
    this.navCtrl.navigateForward(`/show-commerce-categories/${commerce.id}`);
  }
  
}
