import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent  implements OnInit {
  constructor(private modalController: ModalController) {}

  async ngOnInit() {
    await this.pickImage();
  }

  async pickImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt, // This will show options to either take a photo or select from gallery
    });

    if (image.webPath) {
      await this.modalController.dismiss({ image: image.webPath });
    } else {
      this.closeModal();
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
