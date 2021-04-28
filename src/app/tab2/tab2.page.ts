import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertController, LoadingController } from '@ionic/angular';

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
    ) {}

    
  response : HttpResponse<Object>;
  responseErr : HttpErrorResponse;
  product : FormGroup;
  isValid : boolean = false;
  asin : string = '';

  ngOnInit(){
    this.product = this.fb.group({
      id_prod: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      nome_prod: ['', [Validators.required]],
      email: 'bollitore.fugcae@gmail.com',
      id_user: 8
    });
    //this.validateASIN(null, this.asin);
  }

  validateASIN(product?: {id_prod, nome_prod, email, id_user}, ASIN? : string) {
    let asin;
    if(product != null) asin = product.id_prod; else asin = ASIN;
    let url = 'https://amazon.it/dp/'+asin;

    this.http.get(url, { observe: 'response' }).subscribe(data => {
      this.response.clone(data);
    },
      err => {
        this.responseErr = err;
      });
  }

  async addProduct() {
      this.validateASIN(this.product.value);
      if(await (this.response != undefined)) {
        if((this.response.status != 404) ) {
          this.isValid =  true;
          console.log(" 1 Error : not 404");
          this.mainService.addProduct(this.product.value);
        } else { 
          console.log("1 Error : 404");
          this.isValid =  false;
          console.log("fails");
        }
      } else if (await (this.responseErr != undefined)) {
        if(this.responseErr.status != 404) {
          console.log("Error : not 404");
          this.isValid =  true;
          this.mainService.addProduct(this.product.value);
          console.log("success");
        } else { 
          console.log("Error : 404");
          this.isValid =  false;
          console.log("fails");
        }
      }
      await console.log(this.isValid);
  }
      
    
    

  /*
  async addProduct() {
    if(await this.validateASIN(this.product.value)) { 
      this.mainService.addProduct(this.product.value);
      console.log("success");
    } else {
      console.log("unsuccess");
    }
  }*/

  get id_prod() {
    return this.product.get('id_prod');
  }

  get nome_prod() {
    return this.product.get('nome_prod');
  }

  get valid() {
    return this.isValid;
  }
}
