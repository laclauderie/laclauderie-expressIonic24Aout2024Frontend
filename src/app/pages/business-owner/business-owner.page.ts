import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { BusinessOwnerService } from '../../services/business-owner.service';
import { EditDeleteBusinessOwnerPage } from '../edit-delete-business-owner/edit-delete-business-owner.page';

@Component({
  selector: 'app-business-owner',
  templateUrl: './business-owner.page.html',
  styleUrls: ['./business-owner.page.scss'],
})

export class BusinessOwnerPage implements OnInit {

  businessOwnerForm: FormGroup;
  businessOwner: any;
  businessOwnerImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private businessOwnerService: BusinessOwnerService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {
    this.businessOwnerForm = this.fb.group({
      id: [''],
      user_id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      adresse: [''],
      telephone1: [''],
      telephone2: [''],
      monthly_fee_paid: [false],
      image_owner: ['']
      // Add more fields as necessary
    });
  }

  ngOnInit() {
    this.loadBusinessOwner();
  }

  loadBusinessOwner() { 
    this.businessOwnerService.getBusinessOwner().subscribe({
      next: data => {
        
        if (data) {
          this.businessOwner = data;
          this.businessOwnerForm.patchValue(this.businessOwner);
          this.loadBusinessOwnerImage();
        } else {
          this.businessOwner = null;
          this.businessOwnerForm.reset();
          console.log('No business owners found');
        }
      },
      error: error => {
        console.error('Error loading business owners', error);
      }
    });
  } 

  loadBusinessOwnerImage() {
    this.businessOwnerService.getBusinessOwnerImage().subscribe({
      next: (blob: Blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.businessOwnerImage = reader.result as string;
        };
        reader.readAsDataURL(blob);
      },
      error: error => {
        console.error('Error loading business owner image', error);
      }
    });
  } 
  
  async openEditBusinessOwner() {
    try {
      const modal = await this.modalController.create({
        component: EditDeleteBusinessOwnerPage,
        componentProps: {
          businessOwner: this.businessOwner,
        },
      });

      modal.onDidDismiss().then(async (result) => {
        if (result.data && result.data.dismissed === 'confirm') {
          await this.loadBusinessOwner();
        } else if (result.data && result.data.dismissed === 'cancel') {
          console.log('Modal dismissed with cancel role');
        } else if (result.data && result.data.dismissed === 'delete') {
          this.businessOwner = null;
          this.businessOwnerForm.reset();
          this.businessOwnerImage = null;
          console.log('Business owner deleted');
        } else {
          console.log('Modal dismissed with unexpected role:', result.data ? result.data.dismissed : 'unknown');
        }
      });

      await modal.present();
    } catch (error) {
      console.error('Error opening edit business owner modal:', error);
    }
  }

}
