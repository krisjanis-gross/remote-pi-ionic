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

  getData() {
    return this.storage.get('deviceList');
  }

  save(data){
    this.storage.set('deviceList', data);
  }

  getRuntimeData () {
    return this.storage.get('runtimeData');

  }

  saveRuntimeData(data) {
    this.storage.set('runtimeData', data);
  }
}
