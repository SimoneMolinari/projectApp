import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
 
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
 
export const TOKEN_KEY = 'my-token';
export const ID_KEY = 'my-id';
export const EMAIL_KEY = 'my-email';
 
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  id = '';
  email = '';
 
  constructor(private http: HttpClient) {
    this.loadToken();
  }
 
  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });    
    if (token && token.value) {
      //console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }  
  
  /*
  login0(credentials: {username, password}): Observable<any> {
    return this.http.post(`http://localhost:8080/api/login`, credentials).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        return from(Storage.set({key: TOKEN_KEY, value: token}));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  } 

  */

  login(credentials: {username, password}): Observable<any> {
    return this.http.post(`http://localhost:8080/api/login`, credentials).pipe(tap(_ => {
      this.isAuthenticated.next(true);
    }));
  } 


  
  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    Storage.remove({key: EMAIL_KEY});
    Storage.remove({key: ID_KEY});
    return Storage.remove({key: TOKEN_KEY});
  }

  register(credentials: {username, password, repeat_password, email}): Observable<any> {
    return this.http.post(`http://localhost:8080/api/register`, credentials);
  }


}