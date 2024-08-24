import { Component, OnInit } from '@angular/core';
import { BusinessOwnerService } from '../../services/business-owner.service';
import { EditDeleteCommercesPage } from '../edit-delete-commerces/edit-delete-commerces.page'; // Adjust path as needed
import { CreateCommercesPage } from '../create-commerces/create-commerces.page'; // Adjust path as needed
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { CommercesService } from '../../services/commerces.service';
import { HttpErrorResponse } from '@angular/common/http';
import { VillesService } from 'src/app/services/villes.service';
import { FormBuilder, FormGroup } from '@angular/forms';

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

@Component({
  selector: 'app-commerces',
  templateUrl: './commerces.page.html',
  styleUrls: ['./commerces.page.scss'],
})
export class CommercesPage implements OnInit {

  isMonthlyFeePaid = false;
  commerces: Commerce[] = [];
  selectedCommerceIndex = 0;
  selectedCommerce?: Commerce;
  selectedCommerceImage?: string;
  businessOwnerId!: string;
  selectedCommerceServices: string[] = [];
  villeName: string | undefined;
  services: string[] = [];
  commerceForm: FormGroup;
  
  constructor(
    private businessOwnerService: BusinessOwnerService,
    private modalController: ModalController,
    private alertController: AlertController,
    private commercesService: CommercesService,
    private villesService: VillesService,
    private fb: FormBuilder,
    private navCtrl: NavController
  ) {
    this.commerceForm = this.fb.group({
      commerce_name: [''],
      ville_name: [''],
      services: [''],
      image_commerce: ['']
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
        this.commerces = data;
        // Sort commerces alphabetically by commerce_name
        this.commerces.sort((a, b) => a.commerce_name.localeCompare(b.commerce_name));

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

  loadCommercesAfterCommerceCreation(newCommerceId: string) {
    this.commercesService.getCommerces().subscribe({
      next: (data: Commerce[]) => {
        // Filter commerces by business owner ID
        this.commerces = data.filter(commerce => commerce.business_owner_id === this.businessOwnerId);
        // Sort commerces alphabetically by commerce_name
        this.commerces.sort((a, b) => a.commerce_name.localeCompare(b.commerce_name));

        if (this.commerces.length === 0) {
          this.showNoCommercesAlert();
        } else {
          if (newCommerceId) {
            const newCommerceIndex = this.commerces.findIndex(commerce => commerce.id === newCommerceId);
            this.selectCommerce(newCommerceIndex);
          } else {
            this.selectCommerce(0); // Select the first commerce by default
          }
        }
      },
      error: (error) => {
        console.error('Error loading commerces:', error);
        if (error.status === 404) {
          this.showNoCommercesAlert();
        } else {
          this.showErrorAlert('Error fetching commerces');
        }
      }
    });
  }

  async showNoCommercesAlert() {
    const alert = await this.alertController.create({
      header: 'No Commerces Found',
      message: 'No commerces found. Please create a new commerce.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async openCreateCommerceModal() {
    const modal = await this.modalController.create({
      component: CreateCommercesPage,
      componentProps: { businessOwnerId: this.businessOwnerId },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.newCommerceId) {
        this.loadCommercesAfterCommerceCreation(result.data.newCommerceId); // Refresh the list of commerces after creating a new one
      }
    });

    return await modal.present();
  }

  selectCommerce(index: number) {
    this.selectedCommerceIndex = index;
    this.selectedCommerce = this.commerces[index];
    if (this.selectedCommerce) {
      this.loadCommerceImage(this.selectedCommerce.image_commerce);
      this.loadVilleName(this.selectedCommerce.ville_id); // Fetch ville name
      this.processServices(this.selectedCommerce.services);
      this.populateCommerceForm(this.selectedCommerce);
    }
  }

  loadCommerceImage(imageBuffer: any) {
    if (imageBuffer) {
      const byteArray = new Uint8Array(imageBuffer.data);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const reader = new FileReader();
      reader.onloadend = () => {
        this.selectedCommerceImage = reader.result as string;
      };
      reader.readAsDataURL(blob);    
    } else {
      this.selectedCommerceImage = undefined;
    }
  }

  loadVilleName(villeId: string) {
    this.villesService.getVilleName(villeId).subscribe({
      next: (response) => {
        this.villeName = response.ville_name; // Adjust according to your API response structure
        this.commerceForm.patchValue({ ville_name: this.villeName });
      },
      error: (error) => {
        console.error('Error fetching ville name', error);
      }
    });
  }

  processServices(servicesString: string) {
    // Convert newline-separated services into an array
    this.services = servicesString.split('\\n').map(service => service.trim()).filter(service => service !== '');
    this.commerceForm.patchValue({ services: this.services.join('\n') });
  }

  populateCommerceForm(commerce: Commerce) {
    this.commerceForm.patchValue({
      commerce_name: commerce.commerce_name,
      ville_name: this.villeName,
      services: this.services.join('\n'),
      image_commerce: this.selectedCommerceImage,
    });
  }

  async openEditCommerceModal() {
    if (!this.selectedCommerce || !this.businessOwnerId) {
      this.showErrorAlert('Commerce or Business owner ID is not set');
      return;
    }

    const modal = await this.modalController.create({
      component: EditDeleteCommercesPage,
      componentProps: {
        commerceId: this.selectedCommerce.id,
      },
    }); 
    
    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.updatedCommerceId) {
        this.loadCommercesAfterCommerceCreation(result.data.updatedCommerceId); // Refresh the list of commerces after creating a new one
      }else if (result.data && result.data.deleted) {
        this.commerceForm.reset
        this.loadCommerces();
        this.commerceForm.reset
      }
    });

    await modal.present();
  }

  onCancel() {
    // Navigate back to the previous page or perform other actions
    this.navCtrl.back();
  }

  
}
