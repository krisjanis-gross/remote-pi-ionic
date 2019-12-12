import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalAppDataService } from '../local-app-data.service';

import { DeviceDataPage } from '../device-data/device-data.page';

import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {


  selecteditem: any;
  subscription:any;

  constructor(public router: Router,
              public dataService: LocalAppDataService,
                public platform: Platform,
              )
               {
                 this.dataService.getDeviceList();
                }

  ngOnInit() {
  }


  ionViewDidEnter(){ this.subscription = this.platform.backButton.subscribe(()=>{  this.router.navigate(['/']) /*navigator['app'].exitApp();*/     }); }
  ionViewWillLeave(){ this.subscription.unsubscribe(); }



  editDevice(event, item) {
  //  console.log("edit device called: item= " +  JSON.stringify(item));
    this.dataService.selectedItemforEdit = item;
    this.dataService.selectedItemIndex = this.dataService.deviceList.indexOf(item);
  //  console.log("edit device called: ataService.selectedItemIndex " +  this.dataService.selectedItemIndex );
    this.router.navigate(['/device-data']);
  }


  newDevice() {
    this.dataService.selectedItemforEdit = {deviceID:0, deviceTitle: "new-device", deviceURL: "http://", deviceKEY: "new-key"};
    this.dataService.selectedItemIndex = null;
    this.router.navigate(['/device-data']);
  }


  selectDevice(event, item) {
      this.dataService.saveLocalAppconfig(item);
      this.router.navigate(['/home']);
      }

}
