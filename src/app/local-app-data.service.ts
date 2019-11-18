import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})

export class LocalAppDataService {

  // device list page data
  deviceList: Array<{deviceID:number, deviceTitle: string, deviceURL:string, deviceKEY:string}> = [];
  selectedItemforEdit = {deviceID:0, deviceTitle: "new-device", deviceURL: "http://", deviceKEY: "new-key"};
  selectedItemIndex = 0;


  constructor(public localStorage: Storage)
    {    }

  getDeviceList() {
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
       // find next available device ID
       let nextDeviceID = 0;

       if(this.deviceList.length < 1 || this.deviceList == undefined){
          //empty
          nextDeviceID = 1;
          }
        else {
          nextDeviceID = Math.max.apply(Math, (this.deviceList.map(q => q.deviceID))) +  1;
          console.log("highest ID = " + nextDeviceID);
        }

      this.selectedItemforEdit.deviceID = nextDeviceID ;
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


  getSavedFilterList () {
      return this.localStorage.get('SavedFilterList')

  }

  saveSavedFilterList(data) {
    return this.localStorage.set('SavedFilterList', data);
  }




}
