import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit, HostListener} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

import { TOKEN_KEY, ID_KEY, EMAIL_KEY } from '../../services/authentication.service';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
 

 
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  mobile: boolean;
  credentials: FormGroup;
 
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) {}
 
  ngOnInit() {
    this.credentials = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }


  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    
    this.authService.login(this.credentials.value).subscribe(
      async (res) => {
        await Storage.set({key: TOKEN_KEY, value: res.token});
        await Storage.set({key: ID_KEY, value: res.id});
        await Storage.set({key: EMAIL_KEY, value: res.email});
        await loading.dismiss();        
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: res.error.error,
          buttons: ['OK'],
        });
 
        await alert.present();
      }
    );

  }
  
  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let screenWidth = window.innerWidth;
    if(screenWidth < 780) this.mobile = true; else this.mobile = false;
  }

  // Easy access for form fields
  get username() {
    return this.credentials.get('username');
  }
  
  get password() {
    return this.credentials.get('password');
  }
}