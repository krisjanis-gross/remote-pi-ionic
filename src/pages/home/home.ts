import { Component } from '@angular/core';
import { NavController, NavParams  } from 'ionic-angular';

import {BackendData} from '../../providers/backend-data';
import { Data } from '../../providers/data';

import { ListPage } from '../list/list';
import { SensorDataPage } from '../sensor-data/sensor-data';

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
  targetIsReachable:any = false;
  refreshInterval: any = 2000;
  dataTimestamp:any;
  SensorList: Array<{sensorID:string, sensor_name: string, value:string}> = [];
  RelayList: Array<{relayID:string, relayState: string, relayIsLocked: string, relayDescription:string}> = [];
  TriggerList: Array<{triggerID:any, triggerState:any, triggerDescription:string,triggerParameters:any}> =[];

  constructor(public navCtrl: NavController, private backendData: BackendData,public dataService: Data, public navParams: NavParams) {
  //console.log ('navparams : ' + JSON.stringify(this.navParams) );

    let navigation_data = this.navParams.get('selectedItem');
    if (navigation_data != null) {
          //console.log ('saving config : ' + JSON.stringify(navigation_data) );
          this.AppConfig = navigation_data;
          this.dataService.saveLocalAppconfig(this.AppConfig);
          this.connectToDevice ();
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


    setInterval(data=>{
                        this.refreshData()
                      },this.refreshInterval);


  }



  get_main_form_data () {

 }

connectToDevice() {
 //console.log ('connecting to device. config : ' + JSON.stringify(this.AppConfig) );
 this.targetDeviceName = this.AppConfig.deviceTitle;
 this.backendData.ServerURL = this.AppConfig.deviceURL;
 this.backendData.ServerKEY = this.AppConfig.deviceKEY;
 // try to get other data. Log results

 this.checkDeviceVersion();
}

checkDeviceVersion() {
   this.backendData.checkDeviceVersion().then(data => {
                                                        this.status_message = JSON.stringify(data);
                                                        if (  data.response_code == "OK")
                                                           this.targetIsReachable = true;
                                                        else
                                                           this.targetIsReachable = false;
                                                      },
                                              err => {
                                                        console.log(err);
                                                        this.status_message = JSON.stringify(err);
                                                        this.targetIsReachable = false;
                                                    },
                                            );

}

getRealtimeData (){
  this.backendData.getRealtimeData().then(data => {
                                                       this.status_message = JSON.stringify(data.response_code);
                                                      // console.log(JSON.stringify(data.response_data.data));
                                                       this.SensorList = data.response_data.data
                                                       this.dataTimestamp = data.response_data.timestamp;

                                                     },
                                             err => {
                                                       console.log(err);
                                                       this.status_message = JSON.stringify(err);
                                                   },
                                           );

}

getRelayData (){
  this.backendData.getRelayData().then(data => {
                                                       this.status_message = JSON.stringify(data.response_code);
                                                    //   console.log(JSON.stringify(data.response_data.data));
                                                       this.RelayList = data.response_data.data
                                                     },
                                             err => {
                                                       console.log(err);
                                                       this.status_message = JSON.stringify(err);
                                                   },
                                           );

}



openSensorData (event, item)  {
      this.navCtrl.push(SensorDataPage, {
          selectedSensor: item
        });

}

refreshData () {
 if ( this.targetIsReachable == true)
      this.getRealtimeData ();
      this.getRelayData ();
      this.getTriggerData ();
}


setRelayValue (event: Event,relayObject) {
//console.log(JSON.stringify(relayObject));
  let newState = 0;

  if(relayObject.relayState == true){
      //        console.log("toggle set to true" + relayObject.relayID);
              newState = 1;

        }
        else{
      //        console.log("toggle set to false" + relayObject.relayID);
              newState = 0;
        }

  this.backendData.setRelayState(relayObject.relayID, newState).then(data => {
                                                 this.status_message = JSON.stringify(data.response_code);
                                                //   console.log(JSON.stringify(data.response_data.data));
                                                },
                                        err => {
                                                 console.log(err);
                                                 this.status_message = JSON.stringify(err);
                                                },
                                        );


}


getTriggerData () {
  this.backendData.getTriggerList().then(data => {
                                                       this.status_message = JSON.stringify(data.response_code);
                                                    //   console.log(JSON.stringify(data.response_data.data));
                                                       this.TriggerList = data.response_data.data
                                                     },
                                             err => {
                                                       console.log(err);
                                                       this.status_message = JSON.stringify(err);
                                                   },
                                           );



}

}
