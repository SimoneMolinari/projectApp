import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../models/product';
import { MainService } from '../services/main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';

import { ID_KEY } from '../services/authentication.service';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  constructor(
    private mainService: MainService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.loadUserCredentials();
  }

  isValid: boolean = null;
  productFG: FormGroup;
  product: Product;
  id_user: any;
  id_maillist: any;
  asin: string = '';

  ngOnInit() {
    this.productFG = this.fb.group({
      id_prod: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      nome_prod: ['', [Validators.required]],
      price: ['', [Validators.required]],
      id_maillist: '',
      id_user: ''
    });
  }

  async getProduct() {
    this.mainService.getProduct({ id_user: this.id_user, id_maillist: this.route.snapshot.params.id }).subscribe(data => {
      this.product = data;
      //console.log(this.product);
    }, err => {
      console.log(err);
    });
  }

  updateProduct() {
    if (this.isValid && this.asin == this.productFG.controls.id_prod.value) {
      console.log("modificato");
      this.productFG.patchValue({ id_user: this.id_user });
      this.productFG.patchValue({ id_maillist: this.route.snapshot.params.id });
      //console.log(this.id_user);
      //console.log(this.route.snapshot.params.id);
      this.mainService.updateProduct(this.productFG.value).subscribe(data => {
        //console.log(data);
      }, err => {
        console.log(err);
      });
    } else {
      console.log("non modificato");
    }
    this.isValid = null;
    this.router.navigateByUrl('/tabs/product-list');
  }


  async loadUserCredentials() {
    const id = await Storage.get({ key: ID_KEY });

    if (id && id.value) {
      this.id_user = id.value;
    }
    //prendo il prodotto dopo aver caricato id_user
    await this.getProduct();
  }

  fromCodeToValid(code) {
    if(code == 404) {
      return false;
    } else {
      return true;
    }
  }

  async validateASIN(product) {
    const loading = await this.loadingController.create();
    await loading.present();
    this.mainService.validateAsin(product).subscribe(async res => {
      this.isValid = this.fromCodeToValid(res.valid);
      if (this.fromCodeToValid(res.valid)) {
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
      return this.fromCodeToValid(res.valid);
    });

  }

  async validateBtn() {
    this.isValid = null;
    this.validateASIN(this.productFG.value);
  }

  deleteProduct() {
    this.productFG.patchValue({ id_user: this.id_user });
    this.productFG.patchValue({ id_maillist: this.route.snapshot.params.id });
    //console.log(this.id_user);
    //console.log(this.route.snapshot.params.id);
    this.mainService.deleteProduct(this.productFG.value).subscribe(data => {
      //console.log(data);
    }, err => {
      console.log(err);
    });;
    this.router.navigateByUrl('/tabs/product-list');
  }

  get id_prod() {
    return this.productFG.get('id_prod');
  }

  get nome_prod() {
    return this.productFG.get('nome_prod');
  }

  get valid() {
    return this.isValid;
  }

  get gproduct() {
    return this.product;
  }

  get price() {
    return this.productFG.get('price');
  }

}
