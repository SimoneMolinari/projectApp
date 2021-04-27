import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  constructor(private fb: FormBuilder,private mainService: MainService) {}

  product : FormGroup;

  ngOnInit(){
    this.product = this.fb.group({
      id_prod: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      nome_prod: ['', [Validators.required]],
      email: [],
      id_user: []
    });
  }

  addProduct(){
    this.mainService.addProduct(this.product);
  }

  get id_prod() {
    return this.product.get('id_prod');
  }

  get nome_prod() {
    return this.product.get('nome_prod');
  }

}
