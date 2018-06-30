import { Component } from '@angular/core';
import { NavController, NavParams ,ModalController } from 'ionic-angular';
import { DeviceDataPage } from '../device-data/device-data';
import { HomePage } from '../home/home';

import { Data } from '../../providers/data';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  deviceList: Array<{deviceID:string, deviceTitle: string, deviceURL:string, deviceKEY:string}> = [];
  selecteditem: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: Data,public modalCtrl: ModalController) {

    this.dataService.getDeviceList().then((local_data) => {

          if(local_data){
            this.deviceList = local_data;
          }

        });

  }

  editDevice(event, item) {
    this.selecteditem = item;
    let addModal = this.modalCtrl.create(DeviceDataPage,item);

    addModal.onDidDismiss((item2) => {
                      if(item2){
                        this.savemodifyItem(item2);
                      }
              });

    addModal.present();

  }

  savemodifyItem(item2) {
    var editIndex = this.deviceList.indexOf(this.selecteditem);
    this.deviceList[editIndex] = item2;
    this.dataService.saveDeviceList(this.deviceList);
  }


  newDevice(event, item) {
    let new_item = {deviceID: 0, deviceTitle: "newtitle", deviceURL: "newurl", deviceKEY: "newkey"};
    let addModal = this.modalCtrl.create(DeviceDataPage,new_item);

    addModal.onDidDismiss((item) => {
        if(item){
                  this.saveNewItem(item);
                }
    });

    addModal.present();
  }

saveNewItem(item) {
    this.deviceList.push(item);
    this.dataService.saveDeviceList(this.deviceList);
}

selectDevice(event, item) {
    this.navCtrl.setRoot(HomePage, {
        selectedItem: item
      });

    }
}
