import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Data {

  constructor(public storage: Storage) {

  }

  getDeviceList() {
    return this.storage.get('deviceList');
  }

  saveDeviceList(data){
    this.storage.set('deviceList', data);
  }

  getLocalAppconfig () {
    return this.storage.get('LocalAppconfig');

  }

  saveLocalAppconfig(data) {
    this.storage.set('LocalAppconfig', data);
  }
}
