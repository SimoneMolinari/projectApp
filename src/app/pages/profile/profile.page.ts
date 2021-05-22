import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';

import { ID_KEY, EMAIL_KEY } from '../../services/authentication.service';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private fb: FormBuilder,
    private mainService : MainService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) 
  {this.loadUserCredentials(); }
  
  id_user : any;
  user : FormGroup;


  ngOnInit() {
    this.user = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      new_password : ['', [Validators.required, , Validators.minLength(8)]],
      id_user : ''
    });
  }

  async loadUserCredentials() {
    const id = await Storage.get({ key: ID_KEY });    

    if (id && id.value) {
      //console.log('set id: ', id.value);
      this.id_user = id.value;
      //console.log(this.id_user);
    } 
  }


 async updateUser() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.user.patchValue({id_user : this.id_user});
    this.mainService.updateUser(this.user.value)
      .subscribe(async data => {
        //console.log(data);
        await loading.dismiss();
        Storage.remove({key: EMAIL_KEY});
        await Storage.set({key: EMAIL_KEY, value: this.user.get('email').value});   
    }, async err => {
      console.log(err);

      await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Credentials not valid',
          buttons: ['OK'],
        });
 
        await alert.present();
    });
  }

  get email() {
    return this.user.get('email');
  }

  get password() {
    return this.user.get('password');
  }

  get new_password() {
    return this.user.get('new_password');
  }


}
