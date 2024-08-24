import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-activities-villes',
  templateUrl: './activities-villes.page.html',
  styleUrls: ['./activities-villes.page.scss'],
})
export class ActivitiesVillesPage implements OnInit {

  @Input() villeLocations: string[] = []; // Define the @Input property

  constructor(private modalController: ModalController) { }


  ngOnInit() {
    // Log the props to the console when the component is initialized
    console.log('Ville Locations:', this.villeLocations);
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  onVilleSelect(ville: string) {
    // Handle ville selection and pass the selected ville back to the parent page
    this.modalController.dismiss({ selectedVille: ville });
  }

}
