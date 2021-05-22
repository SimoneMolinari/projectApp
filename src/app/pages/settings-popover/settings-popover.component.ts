import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service';


@Component({
  selector: 'app-settings-popover',
  templateUrl: './settings-popover.component.html',
  styleUrls: ['./settings-popover.component.scss'],
})
export class SettingsPopoverComponent implements OnInit {

  constructor(
    private authService : AuthenticationService,
    private router : Router,
    private popoverController: PopoverController
  ) { }

  ngOnInit() { }

  async logout() {
    this.DismissClick();
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  async DismissClick() {
    await this.popoverController.dismiss();
  }

  async openProfile() {
    this.DismissClick();
    this.router.navigateByUrl('/tabs/profile');
  }
}
