import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

const baseUrl = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient) { }

  user = {
    id: 8
  };

  getProducts(user) : Observable<any>{
    return this.http.post(baseUrl+'getProdotti', user);
  }

  updateProduct(product) {
    this.http.post(baseUrl+'updateProdotti', product);
  }

  addProduct(product: {id_prod, nome_prod, email, id_user}) {
    this.http.post(baseUrl+'addProdotti', product).subscribe(err =>{
      console.log(err);
    });
  }

}