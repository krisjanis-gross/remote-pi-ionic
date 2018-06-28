import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';


import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from "@angular/common/http";


/*
  Generated class for the BackendData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()

export class BackendData {

  public ServerURL = "adf";
  private _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  public ServerURLDefault = "http://localhost";

  constructor(public http: Http, private storage: Storage) {

    this.ServerURL = "adf";
    // Or to get a key/value pair

  }



  getServerURL () {
    return this.storage.get('storedServerURL');
  }

  setServerURL(val) {
    if (val != '' && val != null ) {
        this.ServerURL = val;
    }
    else {
      this.ServerURL = this.ServerURLDefault;
    }


  }


}
