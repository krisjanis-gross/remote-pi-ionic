import { Component } from '@angular/core';
import { NavController} from '@ionic/angular';

import { LoadingController } from '@ionic/angular';

import { BackendDataService } from '../backend-data.service';
import { LocalAppDataService } from '../local-app-data.service';

import { AlertController } from '@ionic/angular';


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


 constructor(
                 public navCtrl: NavController,
                 public localData: LocalAppDataService,
                 public loadingController: LoadingController,
                 private backendData: BackendDataService,
                 public alertController: AlertController,
            )
            {
              this.status_message = "...";

            // get local AppConfig
    //         this.getAppConfig ();


           // start auto-refresh
              //setInterval(data=>{
            //                      this.refreshData()
            //                    },this.refreshInterval);


            }


async dataRefresh () {
     console.log ('APP data refresh initiated : ' );
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
      //  console.log ('entered home view ' );
        this.getAppConfig ();
  }




  getAppConfig () {
    this.localData.getLocalAppconfig().then((val) => {
        if (val != null) {
            this.AppConfig = val;
            console.log ('app config : ' + JSON.stringify(this.AppConfig) );
            this.backendData.ServerURL = this.AppConfig.deviceURL;
            this.connectToDevice() ;

            // enable automatic reload
               setInterval(function(){ this.dataRefresh();}.bind(this), 5000);
         }
         else {
           this.navCtrl.goForward('/list');
         }
     });


  }






  async connectToDevice () {
    const loading = await this.loadingController.create({
      content: 'Loading...'
    });
    await loading.present();
    await this.backendData.checkDeviceVersion()
      .subscribe(res => {
      //  console.log(res);
        // get trigger data.
        this.status_message = "Connected OK";
        this.getRelayData();
        this.getSensorData () ;
        this.getTriggerData ()
        this.connectedToDevice = true;

  //      this.classrooms = res;
        loading.dismiss();
      }, err => {
        console.log(err);
        this.status_message = "connection error";
        loading.dismiss();
      });



}

async getSensorData () {
      const loading = await this.loadingController.create({
        content: 'Loading getSensorData'
      });
      await loading.present();
      await this.backendData.getSensorData()
        .subscribe(res => {
        //  console.log(res);
        //  console.log(res.response_data);
          // get trigger data.
          this.SensorList = res.response_data.data;
          this.status_message = res.response_data.timestamp;

    //      this.classrooms = res;
          loading.dismiss();
        }, err => {
          console.log(err);
          loading.dismiss();
        });


      }


async getRelayData () {
      const loading = await this.loadingController.create({
        content: 'Loading'
      });
      await loading.present();
      await this.backendData.getRelayData()
        .subscribe(res => {
        //  console.log(res);
        //  console.log(res.response_data);
          // get trigger data.
          this.RelayList = res.response_data;

    //      this.classrooms = res;
          loading.dismiss();
        }, err => {
          console.log(err);
          loading.dismiss();
        });


      }




async setRelayValue (event, item) {
//console.log(item);
let new_state = 0;

if (item.state)
   { new_state = 1;}


const loading = await this.loadingController.create({
  content: 'Loading'
});
await loading.present();
await this.backendData.setRelayState(item.id,new_state)
  .subscribe(res => {
    console.log(res);
  //  console.log(res.response_data);
    // get trigger data.


//      this.classrooms = res;
    loading.dismiss();
  }, err => {
    console.log(err);
    loading.dismiss();
  });


}

async toggleTriggerState (event, item) {
//console.log(item);
let new_state = 0;

if (item.state)
   { new_state = 1;}


const loading = await this.loadingController.create({
  content: 'Loading'
});
await loading.present();
await this.backendData.toggleTriggerState(item.triggerID,new_state)
  .subscribe(res => {
    console.log(res);
  //  console.log(res.response_data);
    // get trigger data.


//      this.classrooms = res;
    loading.dismiss();
  }, err => {
    console.log(err);
    loading.dismiss();
  });


}



async getTriggerData () {
      const loading = await this.loadingController.create({
        content: 'Loading'
      });
      await loading.present();
      await this.backendData.getTriggerData()
        .subscribe(res => {
        //  console.log(res);
//          console.log(res.response_data);
          // get trigger data.
          this.TriggerList = res.response_data;
//          console.log(this.TriggerList);
    //      this.classrooms = res;
          loading.dismiss();
        }, err => {
          console.log(err);
          loading.dismiss();
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





                 // call backend to change the value!

               }
             }
           ]
         });

         await alert.present();
        }




  }
