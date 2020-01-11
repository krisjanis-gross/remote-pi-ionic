import { Component } from '@angular/core';
//import { NavController} from '@ionic/angular';
import { Router } from '@angular/router';

import { BackendDataService } from '../backend-data.service';
import { LocalAppDataService } from '../local-app-data.service';

import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
 status_message:string;
 targetDeviceName: string;
 AppConfig = {deviceID:0, deviceTitle: "", deviceURL: "", deviceKEY: ""};
 RelayList: Array<{id: string; state: string, locked: string, description:string}>;
 SensorList: Array<{sensor_name:string, value:string}>;
 TriggerList: Array<{triggerID:string, state:string, description:string, parameters:Array<{name:string,par_value:string}>}>;

connectedToDevice = false;

sensors_loading = false;
relays_loading = false;
triggers_loading = false;
other_loading = false;
any_LOADING  = false;

status_log_stack = [];

subscription:any;
refreshIntervalID:any;

DeviceConfig:any;


 constructor(
              //   public navCtrl: NavController,
                 private router: Router,
                 public localData: LocalAppDataService,
                 private backendData: BackendDataService,
                 public alertController: AlertController,
                 public platform: Platform,
            )
            {
              this.status_message = "...";
            }


async dataRefresh () {
  //   console.log ('APP data refresh initiated : ' );
     if (this.connectedToDevice) {
       this.getRelayData();
       this.getSensorData () ;
       this.getTriggerData ()
     }
     else {
       this.connectToDevice() ;
     }
 }


  ionViewWillEnter(){
        this.getAppConfig ();
  }

  ionViewDidLeave() {
      //console.log ('**********************ionViewDidLeave called. ' );
    if (this.refreshIntervalID) {
      clearInterval(this.refreshIntervalID);
    }
  }


 ionViewDidEnter(){ this.subscription = this.platform.backButton.subscribe(()=>{ navigator['app'].exitApp(); }); }
 ionViewWillLeave(){ this.subscription.unsubscribe(); }





  getAppConfig () {
    this.localData.getLocalAppconfig().then((val) => {
        if (val != null) {
            this.AppConfig = val;
            this.status_log_stack.push('app config=' + JSON.stringify(this.AppConfig));
            console.log ('app config : ' + JSON.stringify(this.AppConfig));
            this.backendData.ServerURL = this.AppConfig.deviceURL;
            this.backendData.ServerKEY = this.AppConfig.deviceKEY;
            this.connectToDevice() ;

            // enable automatic reload
               this.refreshIntervalID = setInterval(function(){ this.dataRefresh();}.bind(this), 5000);
         }
         else {
           this.router.navigate(['/list']);
         }
     });


  }

  async connectToDevice () {
    this.other_loading = true;
    this.update_loading ();
    this.status_log_stack.push('connectToDevice. URL=' + this.backendData.ServerURL);
    await this.backendData.checkDeviceVersion()
      .subscribe(res => {
      //  console.log(res);
        // get trigger data.
        this.status_message = "Connected OK";
        this.getRelayData();
        this.getSensorData () ;
        this.getTriggerData ();
        this.getDeviceConfig();
        this.connectedToDevice = true;

        this.other_loading = false;
        this.update_loading ();
      }, err => {
        console.log(err);
        this.status_log_stack.push('****connection error :' + err);
        this.status_message = "connection error";
        this.other_loading = false;
        this.update_loading ();
      });



}

async getDeviceConfig () {

  await this.backendData.gedDeviceConfig()
    .subscribe(res => {
      console.log(res);
    //  console.log(res.response_data);
      // get trigger data.
      this.DeviceConfig =  JSON.stringify (res.response_data);
  //    this.status_message = res.response_data.timestamp;


    }, err => {
      console.log(err);

    });



}


async getSensorData () {
      this.sensors_loading = true;
      this.update_loading ();
      await this.backendData.getSensorData()
        .subscribe(res => {
        //  console.log(res);
        //  console.log(res.response_data);
          // get trigger data.
          this.SensorList = res.response_data.data;
          this.status_message = res.response_data.timestamp;
          this.sensors_loading = false;
          this.update_loading ();
    //      this.classrooms = res;

        }, err => {
          console.log(err);
           this.sensors_loading = false;
           this.update_loading ();
        });


      }


async getRelayData () {
      this.relays_loading = true;
      this.update_loading ();
      await this.backendData.getRelayData()
        .subscribe(res => {
          this.RelayList = res.response_data;
          this.relays_loading = false;
          this.update_loading ();
        }, err => {
          console.log(err);
          this.relays_loading = false;
          this.update_loading ();
        });
      }


async setRelayValue ( item) {
  //  console.log("000000000000000000000000000 setRelayValue started" );
    let new_state = 0;

    if (item.state)
       { new_state = 1;}

       this.other_loading = true;
       this.update_loading ();

    await this.backendData.setRelayState(item.id,new_state)
      .subscribe(res => {
        console.log(res);
        this.other_loading = false;
        this.update_loading ();
      }, err => {
        console.log(err);
        this.other_loading = false;
        this.update_loading ();
      });

}

async toggleTriggerState (event, item) {
//console.log("/////////////////toggleTriggerState");
let new_state = 0;
if (item.state)   { new_state = 1;}

this.other_loading = true;
this.update_loading ();

await this.backendData.toggleTriggerState(item.triggerID,new_state)
  .subscribe(res => {
    console.log(res);
    this.other_loading = false;
    this.update_loading ();
  }, err => {
    console.log(err);
    this.other_loading = false;
    this.update_loading ();
  });
}


async getTriggerData () {
      this.triggers_loading = true;
      await this.backendData.getTriggerData()
        .subscribe(res => {
          this.TriggerList = res.response_data;
          this.triggers_loading = false;
          this.update_loading ();
        }, err => {
          console.log(err);
          this.triggers_loading = false;
          this.update_loading ();
        });
      }



      async changeParameterAlert(ParameterId,ParameterName,ParameterValue) {
        const alert = await this.alertController.create({
           header:  ParameterName,
           message: 'ID = ' + ParameterId + ' value = ' + ParameterValue,
           inputs: [
                    {
                      name: 'NewValue',
                      type: 'text',
                      placeholder: 'Placeholder 1',
                      value: ParameterValue,
                    },
                  ],
           buttons: [
             {
               text: 'Cancel',
               role: 'cancel',
               cssClass: 'secondary',
               handler: (blah) => {
                // console.log('Confirm Cancel: blah');
               }
             }, {
               text: 'Okay',
               handler: (NewValue) => {
                 console.log('Confirm Okay');
                 console.log(NewValue.NewValue);
                 console.log(ParameterId);
                 this.backendData.setParameterValue(ParameterId,NewValue.NewValue)
                         .subscribe(res => {
                            this.getTriggerData ();
                         });
               }
             }
           ]
         });

         await alert.present();
        }


        async status_log_alert() {
          let log_message =  this.status_log_stack.join("*********");
          console.log("log_message = " + log_message);
          const status_alert = await this.alertController.create({
             header:  "Status LOG",
             message:  log_message,
             buttons: [
               {
                 text: 'OK',
                 role: 'cancel',
                 cssClass: 'secondary',
                 handler: (blah) => {
                  // console.log('Confirm Cancel: blah');
                 }
               },
             ]
           });

           await status_alert.present();





        }
  update_loading () {
    if ( this.sensors_loading ||
         this.relays_loading ||
         this.triggers_loading ||
         this.other_loading  )
         {
           this.any_LOADING = true;
         }
    else {this.any_LOADING = false; }
    //console.log('------------------- LOADING  :' + this.any_LOADING);

  }

  }
