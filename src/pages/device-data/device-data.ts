import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { Data } from '../../providers/data';
@Component({
  selector: 'page-device-data',
  templateUrl: 'device-data.html',
})
export class DeviceDataPage {
  deviceID;
  deviceTitle;
  deviceURL;
  deviceKEY;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: Data, public view: ViewController) {
    this.deviceID = this.navParams.get('deviceID');
    this.deviceTitle = this.navParams.get('deviceTitle');
    this.deviceURL = this.navParams.get('deviceURL');
    this.deviceKEY = this.navParams.get('deviceKEY');
    //this.deviceKEY = this.navParams.get('params').KEY;
  }

  ionViewDidLoad() {
  //  console.log('ionViewDidLoad DeviceDataPage');
  }


saveDeviceData (){
  let item = {
        deviceID: this.deviceID,
        deviceTitle: this.deviceTitle,
        deviceURL: this.deviceURL,
        deviceKEY: this.deviceKEY,
      };
  this.view.dismiss(item);
}

close() {
  this.view.dismiss();
}

}
