import { Component } from '@angular/core';
import { NavController, NavParams  } from 'ionic-angular';

import {BackendData} from '../../providers/backend-data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  status_message:string;
  target_device_URL: string;
  warmth: number;
  delta_t: number;
  constructor(public navCtrl: NavController, private backendData: BackendData, public navParams: NavParams) {
  //console.log ('navparams : ' + JSON.stringify(this.navParams) );

    let navigation_data = this.navParams.get('selectedItem');
        if (navigation_data != null) {
          this.target_device_URL = navigation_data.deviceURL;
          this.backendData.ServerURL = navigation_data.deviceURL;
          //console.log ('got some params : ' + JSON.stringify(this.navParams) );
        }


      this.status_message = "Connected OK/Connecting/Can not reach/";
      this.warmth = 24;
      this.delta_t = 5;

      this.get_main_form_data ();
  }



  get_main_form_data () {

  // get server URL
  if (this.backendData.ServerURL) {
  //  console.log ('ServerURL is set: ' + this.backendData.ServerURL );
    //this.getData2 ();
  }
  else {
    console.log ('ServerURL is not set: ' );
    this.backendData.getServerURL().then((val) => {
  //            console.log ('server URL from storage:' + val);
              this.backendData.setServerURL(val);
      //        this.getData2 ();
            });

  }
 }


}
