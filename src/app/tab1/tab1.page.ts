import { AuthenticationService } from './../services/authentication.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '../models/product';
import { MainService } from '../services/main.service';

import { SideMenuPageModule } from '../pages/side-menu/side-menu.module';
 
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
 
  constructor(private authService: AuthenticationService, private router: Router, private mainService : MainService) {}
  

  search: string;
  allProducts?: Product[];
  filterProducts?: Product[];
  currentProduct?: Product;
  currentIndex = -1;
  title = '';


  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  private user = {
    id:8
  };

  ngOnInit(): void {
    this.loadProducts(this.user);
  }

  loadProducts(user) {
    this.mainService.getProducts(user).subscribe(
      data => {
        this.allProducts = data;
        this.filterProducts = this.allProducts;
      });
  }

  refreshList(user): void {
    this.loadProducts(user);
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
      if (currProduct.nome && searchTerm) {
        return (currProduct.nome.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                || currProduct.id.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

  scrollToTop() {
    document.querySelector('ion-content').scrollToTop(500);
  }
  
}