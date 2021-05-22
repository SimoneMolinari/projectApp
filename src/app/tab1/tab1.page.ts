import { AuthenticationService } from './../services/authentication.service';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '../models/product';
import { MainService } from '../services/main.service';

import { ID_KEY } from '../services/authentication.service';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
 
  constructor(
    private authService: AuthenticationService, 
    private router: Router, 
    private mainService : MainService,
    ){
    this.loadUserCredentials();
  }
  

  search: string;
  allProducts?: Product[];
  filterProducts?: Product[];
  currentProduct?: Product;
  currentIndex = -1;
  title = '';
  id_user : any;

  async loadUserCredentials() {
    const id = await Storage.get({ key: ID_KEY });    

    if (id && id.value) {
      //console.log('set id: ', id.value);
      this.id_user = id.value;
      //console.log(this.id_user);
      this.loadProducts();
    } 
  }

  
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
  
  ngOnInit(): void {
  }
  
  async loadProducts() {
    await this.mainService.getProducts({id_user : this.id_user}).subscribe(
      data => {
        this.allProducts = data;
        this.filterProducts = this.allProducts;
      });
    }
    
    async refreshList() {
      await this.loadProducts();
      this.currentIndex = undefined;
      this.currentIndex = -1;
    }
    
    setActiveProduct(product: Product, index: number): void {
      this.currentProduct = product;
      this.currentIndex = index;
    }
    
    async filterList(evt) {
      this.filterProducts = this.allProducts;
      const searchTerm = evt.srcElement.value;
      
      if (!searchTerm) {
        return;
      }
      
      this.filterProducts = this.filterProducts.filter(currProduct => {
        if (currProduct.nome_prod && searchTerm) {
          return (currProduct.nome_prod.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
          || currProduct.id_prod.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
        }
      });
    }
    
    scrollToTop() {
      document.querySelector('ion-content').scrollToTop(500);
    }
    
    spinner(event) {
      this.refreshList();
      setTimeout(() => {
        event.target.complete();
      }, 500);
    }
    
    async deleteAll() {
      await this.mainService.deleteAll({id_user: this.id_user}).subscribe(res =>{
        console.log(res.msg);
      });
      setTimeout(() => {
        this.refreshList();
      }, 500)
    }

    async goToUpdate() {
      this.router.navigateByUrl('tabs/product-list/' + this.currentProduct.id_maillist);
    }

}