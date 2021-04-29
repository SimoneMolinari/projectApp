import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  credentials: FormGroup;
  mobile : boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    if(window.innerWidth < 780) this.mobile = true; else this.mobile = false;
    this.credentials = this.fb.group({
      //Validators.email da ricordarmi
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_repeat: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }
 
  async register() {
    const loading = await this.loadingController.create();
    await loading.present();
    
    this.authService.register(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();        
        this.router.navigateByUrl('/login', { replaceUrl: true });
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Registration failed',
          message: res.error.error,
          buttons: ['OK'],
        });
 
        await alert.present();
      }
    );
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let screenWidth = window.innerWidth;
    if(screenWidth < 550) this.mobile = true; else this.mobile = false;
  }
 
  get username() {
    return this.credentials.get('username');
  }
  
  get password() {
    return this.credentials.get('password');
  }

  get password_repeat() {
    return this.credentials.get('password_repeat');
  }

  get email() {
    return this.credentials.get('email');
  }

}
