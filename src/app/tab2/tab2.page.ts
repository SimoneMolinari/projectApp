import { Component, HostListener, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertController, LoadingController } from '@ionic/angular';


import { TOKEN_KEY, ID_KEY, EMAIL_KEY } from '../services/authentication.service';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  constructor(
    private fb: FormBuilder,
    private mainService: MainService,
    private http: HttpClient,
    private alertController: AlertController,
    private loadingController: LoadingController
    ) {this.loadUserCredentials();}

    
  response : HttpResponse<Object>;
  responseErr : HttpErrorResponse;
  product : FormGroup;
  isValid : boolean = null;
  asin : string = '';
  id_user : any;
  email : string;

  ngOnInit(){
    this.product = this.fb.group({
      id_prod: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      nome_prod: ['', [Validators.required]],
      price: ['', [Validators.required]],
      email: this.email,
      id_user: this.id_user
    });
    
  }

  async loadUserCredentials() {
    const id = await Storage.get({ key: ID_KEY });    
    const email = await Storage.get({ key: EMAIL_KEY });    

    if (id && id.value) {
      //console.log('set id: ', id.value);
      this.id_user = id.value;
      //console.log(this.id_user);
    } 

    if (email && email.value) {
      //console.log('set email: ', email.value);
      this.email = email.value;
      //console.log(this.email);
    } 
  }

  fromCodeToValid(code) {
    if(code == 404) {
      return false;
    } else {
      return true;
    }
  }

  async validateASIN(product : {id_prod, nome_prod, email, id_user}) {
    const loading = await this.loadingController.create();
    await loading.present();
    this.mainService.validateAsin(product).subscribe(async res =>{
      this.isValid = this.fromCodeToValid(res.valid);
      if(this.fromCodeToValid(res.valid)) {
        this.asin = product.id_prod;
        await loading.dismiss();  
      } else {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Failed',
          message: 'The code is not valid',
          buttons: ['OK'],
        });
 
        await alert.present();
      }
      //console.log(res.valid);
      return this.fromCodeToValid(res.valid);
    });
    
  }

  async validateBtn() {
    this.isValid = null;
    this.validateASIN(this.product.value);
  }

  addProduct() {
    if(this.isValid && this.asin == this.product.controls.id_prod.value) {
      //console.log("aggiunto");
      this.product.patchValue({email : this.email, id_user : this.id_user});
      //console.log(this.product.value);
      this.mainService.addProduct(this.product.value);
      this.product.patchValue({id_prod : '', nome_prod : ''});
    } else {
      //console.log("non aggiunto");      
    }
    this.isValid = null;
  }
      

  get id_prod() {
    return this.product.get('id_prod');
  }

  get nome_prod() {
    return this.product.get('nome_prod');
  }

  get valid() {
    return this.isValid;
  }

  get price() {
    return this.product.get('price');
  }

}
