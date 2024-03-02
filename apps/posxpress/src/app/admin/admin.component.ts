import { Component } from '@angular/core';
import { AdminSettings } from './settings';

@Component({
  selector: 'px-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent extends AdminSettings {
  title = 'Admin Einstellungen';
}
