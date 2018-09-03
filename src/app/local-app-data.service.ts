import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})

export class LocalAppDataService {
  deviceList: Array<{deviceID:number, deviceTitle: string, deviceURL:string, deviceKEY:string}> = [];
  selectedItemforEdit = {deviceID:0, deviceTitle: "new-device", deviceURL: "http://", deviceKEY: "new-key"};
  selectedItemIndex = 0;

  constructor(public localStorage: Storage)
    {    }

  getDeviceList() {
    // return this.localStorage.get('deviceList');

    this.localStorage.get('deviceList').then((local_data) => {

                                                             if(local_data){
                                                               this.deviceList = local_data;
                                                             }
                                                           }
                                           );

   }

  saveDeviceList(data){
     this.localStorage.set('deviceList', data);
   }

   saveNewDeviceItem() {
    //   console.log("saving new device");
    //   console.log(JSON.stringify(this.selectedItemforEdit));

       // find next available device ID
       let nextDeviceID = Math.max.apply(Math, (this.deviceList.map(q => q.deviceID)));
    //    console.log("highest ID = " + nextDeviceID);

      this.selectedItemforEdit.deviceID = nextDeviceID + 1 ;
      this.deviceList.push(this.selectedItemforEdit);

    //   console.log(JSON.stringify( this.deviceList));
       this.saveDeviceList(this.deviceList);
   }

   saveExistingDeviceItem() {
       this.deviceList[this.selectedItemIndex] = this.selectedItemforEdit;
       this.saveDeviceList(this.deviceList);
   }


   getLocalAppconfig () {
      return this.localStorage.get('LocalAppconfig');
   }

   saveLocalAppconfig(data) {
     this.localStorage.set('LocalAppconfig', data);
   }

}
