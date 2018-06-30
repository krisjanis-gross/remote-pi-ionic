import { Component } from '@angular/core';
import { NavController, NavParams  } from 'ionic-angular';

import {BackendData} from '../../providers/backend-data';
import { Data } from '../../providers/data';

import { ListPage } from '../list/list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  status_message:string;
  targetDeviceName: string;
  warmth: number;
  delta_t: number;
  AppConfig: any;
  constructor(public navCtrl: NavController, private backendData: BackendData,public dataService: Data, public navParams: NavParams) {
  //console.log ('navparams : ' + JSON.stringify(this.navParams) );

    let navigation_data = this.navParams.get('selectedItem');
    if (navigation_data != null) {
          //console.log ('saving config : ' + JSON.stringify(navigation_data) );
          this.AppConfig = navigation_data;
          this.dataService.saveLocalAppconfig(this.AppConfig);
          this.connectToDevice (this.AppConfig);
    }


    this.status_message = "Connected OK/Connecting/Can not reach/";
    this.warmth = 24;
    this.delta_t = 5;

      //if (this.AppConfig == null) {
         // get local AppConfig
    this.dataService.getLocalAppconfig().then((val) => {
        if (val != null) {
            this.AppConfig = val;
            this.connectToDevice() ;
            this.get_main_form_data ();
         }
         else {
           this.navCtrl.push(ListPage);
         }
     });
  }



  get_main_form_data () {

 }

connectToDevice() {
 console.log ('connecting to device. config : ' + JSON.stringify(this.AppConfig) );
 this.targetDeviceName = this.AppConfig.deviceTitle;
 this.backendData.ServerURL = this.AppConfig.deviceURL;
 this.backendData.ServerKEY = this.AppConfig.deviceKEY;
 // try to get other data. Log results

 this.checkDeviceVersion();
}

checkDeviceVersion() {
   this.backendData.checkDeviceVersion().then(data => {
                                                        this.status_message = JSON.stringify(data);
                                                      },
                                              err => {
                                                        console.log(err);
                                                        this.status_message = JSON.stringify(err);
                                                    },
                                            );

}

}
