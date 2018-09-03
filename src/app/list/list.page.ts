import { Component, OnInit } from '@angular/core';
import { NavController} from '@ionic/angular';
import { LocalAppDataService } from '../local-app-data.service';

import { DeviceDataPage } from '../device-data/device-data.page';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {


  selecteditem: any;


  constructor(public navCtrl: NavController,
              public dataService: LocalAppDataService)
               {
                 this.dataService.getDeviceList();
                }

  ngOnInit() {
  }


  editDevice(event, item) {
    this.dataService.selectedItemforEdit = item;
    this.dataService.selectedItemIndex = this.dataService.deviceList.indexOf(item);
    this.navCtrl.goForward('/device-data');
  }


  newDevice() {
    this.dataService.selectedItemforEdit = {deviceID:0, deviceTitle: "new-device", deviceURL: "http://", deviceKEY: "new-key"};
    this.dataService.selectedItemIndex = 0;
    this.navCtrl.goForward('/device-data');
  }


  selectDevice(event, item) {
      this.dataService.saveLocalAppconfig(item);
      this.navCtrl.goBack('/home');
      }

}
