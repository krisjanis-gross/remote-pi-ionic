import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalAppDataService } from '../local-app-data.service';

import { DeviceDataPage } from '../device-data/device-data.page';

import { Platform } from '@ionic/angular';

import { BackendDataService } from '../backend-data.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {


  selecteditem: any;
  subscription:any;

  deviceStatus = Array ();

  constructor(public router: Router,
              public dataService: LocalAppDataService,
              private backendData: BackendDataService,
                public platform: Platform,
              )
               {
                 this.dataService.getDeviceList();
                  setInterval(function(){ this.deviceStatusRefresh();}.bind(this), 5000);
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


  async deviceStatusRefresh () {
           //console.log ('List data status refresh initiated : ' );
           if (this.dataService.deviceList) {
              console.log ('List data status refresh initiated : ' );
              Object.keys(this.dataService.deviceList).forEach(function(key,index){
                    let deviceID = this.dataService.deviceList[index].deviceID;
                    let deviceURL = this.dataService.deviceList[index].deviceURL;
                    let deviceKEY = this.dataService.deviceList[index].deviceKEY;

                    console.log ('ping device: ' + deviceID + deviceURL + deviceKEY);
                    this.deviceStatus[deviceID] = "checking...";

                    this.ping_device(deviceID,deviceURL,deviceKEY);

              }.bind(this));


           }
       }

 async ping_device (deviceID,deviceURL,deviceKEY) {
   this.backendData.ServerKEY = deviceKEY;
   this.backendData.ServerURL = deviceURL;

   await this.backendData.checkDeviceVersion()
     .subscribe(res => {
     //  console.log(res);
       // get trigger data.
       this.deviceStatus[deviceID] = "OK";
     }, err => {
       console.log(err);
       this.deviceStatus[deviceID] = "connection error";
     });

 }



}
