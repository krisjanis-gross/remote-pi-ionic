import { Component } from '@angular/core';
import { NavController} from '@ionic/angular';

//import { BackendDataService } from '../backend-data.service';
import { LocalAppDataService } from '../local-app-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
 status_message:string;
 targetDeviceName: string;
 AppConfig = {deviceID:0, deviceTitle: "", deviceURL: "", deviceKEY: ""};

warmth = 24;
delta_t = 5;

 constructor(
                 public navCtrl: NavController,
                 public localData: LocalAppDataService,
        //       private backendData: BackendDataService,
            )
            {
              this.status_message = "Connected OK/Connecting/Can not reach/";

            // get local AppConfig
             this.getAppConfig ();


           // start auto-refresh
              //setInterval(data=>{
            //                      this.refreshData()
            //                    },this.refreshInterval);


            }

  ionViewWillEnter(){
      //  console.log ('entered home view ' );
        this.getAppConfig ();
  }


  getAppConfig () {
    this.localData.getLocalAppconfig().then((val) => {
        if (val != null) {
            this.AppConfig = val;
            console.log ('app config : ' + JSON.stringify(this.AppConfig) );
          //  this.connectToDevice() ;
          //  this.get_main_form_data ();
         }
         else {
           this.navCtrl.goForward('/list');
         }
     });


  }
}
