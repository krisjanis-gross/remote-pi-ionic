import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  status_message:string;
  warmth: number;
  delta_t: number;
  constructor(public navCtrl: NavController) {
      this.status_message = "Connected OK/Connecting/Can not reach/";
      this.warmth = 24;
      this.delta_t = 5;
  }

}
