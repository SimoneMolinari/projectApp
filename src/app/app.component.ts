import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import {SettingsPopoverComponent} from './pages/settings-popover/settings-popover.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  constructor(
    private popoverController : PopoverController,
    private route : ActivatedRoute,
    private router : Router
  ) {}

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: SettingsPopoverComponent,
      event: ev,
      mode: "ios",
      translucent: true
    });

    await popover.present();
  }

  get url() {
    if(this.router.url == '/login' || this.router.url == '/register' || this.router.url == '/intro') {
      return true;
    } else {
      return false;
    }
  }


}
