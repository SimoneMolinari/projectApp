import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';


import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
 
export const TOKEN_KEY = 'my-token';

//http://localhost:8080/api/
//http://salsadisoia.duckdns.org:12804/api/
const baseUrl = 'https://salsadisoia.duckdns.org:12804/api/';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(
    private http: HttpClient
    ) 
  {this.loadToken(); }
  
  headers : HttpHeaders;

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });    
    if (token && token.value) {
      //console.log('set token: ', token.value);
      // mi creo la heaedr con il token (senza non la rest API non funziona)
      this.headers = new HttpHeaders().set('Authorization', 'Bearer ' + token.value);
      //this.token = token.value;
    }
  }

  //passo id_user
  getProducts(user) : Observable<any> {
    return this.http.post(baseUrl+'getProdotti', user, {headers : this.headers});
  }

  //passo prodotto e id_user
  addProduct(product: {id_prod, nome_prod, email, id_user, price}) {
    this.http.post(baseUrl+'addProdotti', product, {headers : this.headers}).subscribe(err =>{
      console.log(err);
    });
  }

  //passo il prodotto con id_prod
  validateAsin(product) : Observable<any>{
    return this.http.post(baseUrl + 'validateAsin', product, {headers : this.headers});
  }

  //passo id_user
  deleteAll(user : {id_user}) : Observable<any> {
    return this.http.post(baseUrl + 'deleteAll', user, {headers : this.headers});
  }

  // passo id_maillist e id_user
  getProduct(product) : Observable<any> {
    return this.http.post(baseUrl + 'getProdotto', product, {headers : this.headers});
  }

  //passo id_maillist id_user id_prod e nome_prod e prezzo
  updateProduct(product) : Observable<any> {
    return this.http.post(baseUrl + 'updateProdotto', product, {headers : this.headers});
  }

  // passo id_maillist id_user
  deleteProduct(product) : Observable<any> {
    return this.http.post(baseUrl + 'deleteOne', product, {headers : this.headers});
  }

  //passo id_user email password e new_password
  updateUser(cred : {id_user, email, password, new_password}) : Observable<any> {
    return this.http.post(baseUrl + 'updateUser', cred, {headers : this.headers});
  }
}