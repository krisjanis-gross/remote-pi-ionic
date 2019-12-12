import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { BackendDataService } from '../backend-data.service';

import { LocalAppDataService } from '../local-app-data.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import * as HighCharts from 'highcharts';

@Component({
  selector: 'app-historic-data',
  templateUrl: './historic-data.page.html',
  styleUrls: ['./historic-data.page.scss'],
})
export class HistoricDataPage implements OnInit {
 chart_data:any;
 SensorList:any;
 chart_time_interval = "3hrs";
 selected_sensors = "";
 saveSlotSelected = "";

 AppConfig = {deviceID:0, deviceTitle: "", deviceURL: "", deviceKEY: ""};


 // filter  data
 savedFilterList: Array<{deviceID:number, savedFilters:any } > = [];
 savedFiltersThisDevice: Array<{filterID:number, filterName:string, filterPeriod:string, filtersensorList:any}> = [];
 savedFiltersThisDeviceSAVEList: Array<{filterID:number, filterName:string, filterPeriod:string, filtersensorList:any}> = [];
 safeFilterSelectedID:any;
 selectedFilter: { filterID:number, filterName:string, filterPeriod:string, filtersensorList:any };
 blankFilterList:{};
 loadFilterSelectedID:any;

any_LOADING = false;

HistoricDataChart:any;
ChartIsLoaded = false;
DataUpdateEnabled = true;

last_timestamp = "";
subscription:any;

  constructor(
    public loadingController: LoadingController,
    private backendData: BackendDataService,
    public localData: LocalAppDataService,
    public platform: Platform,
    private router: Router,

  ) {    }

  ionViewWillEnter(){
      //  console.log ('entered home view ' );




        this.localData.getLocalAppconfig().then((val) =>
              {
                if (val != null) {
                    this.AppConfig = val;
                    console.log ('app config : ' + JSON.stringify(this.AppConfig) );
                    this.backendData.ServerURL = this.AppConfig.deviceURL;
                    this.backendData.ServerKEY = this.AppConfig.deviceKEY;
                    this.getChartData () ;
                    this.loadSavedFilters();
                    setInterval(function()
                                          { this.getChartIncrementalData();
                                          }.bind(this),
                                 1000);
                 }
               });
  }


  ionViewDidEnter(){ this.subscription = this.platform.backButton.subscribe(()=>{  this.router.navigate(['/']) /*navigator['app'].exitApp();*/     }); }
  ionViewWillLeave(){ this.subscription.unsubscribe(); }


  async getChartData () {
        this.any_LOADING = true;

        await this.backendData.getChartData(this.chart_time_interval, this.selected_sensors)
          .subscribe(res => {
            console.log(res);
              // console.log(res.response_data);
              // get trigger data.
              // this.SensorList = res.response_data.data;
        this.chart_data = res.response_data;
        this.show_chart ();
        this.getSensorList () ;

        this.any_LOADING = false;

          }, err => {
            console.log(err);

            this.any_LOADING = false;

          });
        }


    show_chart() {
    this.HistoricDataChart = HighCharts.chart('container', {
    chart: {
      type: 'spline',
      events: {
            load: function () {  //set up the updating of the chart each second
                                  this.ChartIsLoaded = true;
                                }.bind(this),
       }
    },
    title: {
      text: 'Historic Data'
    },
    xAxis: {
    		    				type: 'datetime',
    		    					dateTimeLabelFormats: {
    		    					day: '%e %b \ %y <br/> %H:%M:%S'
    		    					},
    },
    yAxis: {
      title: {
        text: 'measurement'
      }
    },
    series: this.chart_data
  });
  }


  async getChartIncrementalData () {
  if (this.ChartIsLoaded && this.DataUpdateEnabled)  {
          // check for update on backend.

      //    var x = (new Date()).getTime(), // current time
      //    y = Math.random() * 100;
      //    console.log("adding point to chart " + x + y  );
/*
          var series = this.HistoricDataChart.get("rnd_data");
          if (series) {
                    series.addPoint([x, y], true, false);
                    }
*/

          await this.backendData.getSensorData()
              .subscribe(res => {
                                    //console.log(JSON.stringify(res))
                                    // check if this is new relays_loading
                                  //  console.log("timestamp =  " + res.response_data.timestamp)
                                    if (this.last_timestamp != res.response_data.timestamp)
                                        { // new sensor data
                                        //  console.log("new sensor data =  " +  JSON.stringify(res.response_data.data));
                                          this.last_timestamp = res.response_data.timestamp


                                          Object.keys(res.response_data.data).forEach(function(key,index) {
                                                            // key: the name of the object key
                                                            // index: the ordinal position of the key within the object
                                                            //console.log("key " +  key);
                                                            //console.log("index " +  index);
                                                            let sensorID = res.response_data.data[index].id;
                                                            let sensorValue = res.response_data.data[index].value;

                                                            let readingTimestamp = Date.parse(res.response_data.timestamp + ' UTC');
                                                            console.log("res.response_data.timestamp  " +  res.response_data.timestamp);
                                                            console.log("readingTimestamp " +  readingTimestamp);
                                                            //console.log("sensorID " +  sensorID);
                                                            //console.log("sensorValue " +  sensorValue);
                                                            var series = this.HistoricDataChart.get(sensorID);
                                                            var value = parseFloat(sensorValue);
                                                            if (series) {
                                                                      series.addPoint([readingTimestamp, value], true, false);
                                                                      }


                                                        }.bind(this));
                                        }

                                }, err => {
                                          console.log(err);
                                          });

                            }
}

change_period () {
    this.getChartData () ;
}




async getSensorList () {
      await this.backendData.getSensorList(this.chart_time_interval)
        .subscribe(res => {
          console.log(res);
          this.SensorList = res.response_data;
        }, err => {
          console.log(err);
        });


      }


async select_sensors (event) {
  //  console.log(this.selected_sensors);
    this.getChartData () ;
}







 saveFilterSelection () {
  // get selected filter values and save
//  console.log("Saving filter: period = " + this.chart_time_interval + " sensor list =  " +  this.selected_sensors  + "saveSlotSelected = " + this.safeFilterSelectedID );
//  console.log(JSON.stringify(item));

 if (this.safeFilterSelectedID == 0) {
   // new filter.
   // 1. add new filter to list
   // 1.1 find next ID
   let newFilterID = Math.max.apply(Math, (this.savedFiltersThisDevice.map(q => q.filterID)))
   if (newFilterID > 0) { newFilterID = newFilterID +1 }
   else   {newFilterID = 1;}

   this.selectedFilter = {
    filterID:newFilterID,
    filterName: 'filter ' + newFilterID + ': ' + this.chart_time_interval + ' ' + this.selected_sensors  ,
    filterPeriod: this.chart_time_interval,
    filtersensorList: this.selected_sensors,
    }
  // console.log(JSON.stringify(this.selectedFilter));

   // 2. save list
   this.savedFiltersThisDevice.push(this.selectedFilter);

   this.saveFiltersinStorage (this.AppConfig.deviceID, this.savedFiltersThisDevice) ;


   // 3. update load list.
 }

 if (this.safeFilterSelectedID > 0) {
   // update existing filter
   // 1. find record by ID
   let filterindex =  this.savedFiltersThisDevice.findIndex((obj => obj.filterID == this.safeFilterSelectedID));
   let saveFilterID = this.savedFiltersThisDevice[filterindex].filterID;
//   console.log("************ OVERWRITE FILTER. filterindex: ", filterindex)


   // 2. update record in list
   this.selectedFilter = {
    filterID:saveFilterID,
    filterName: 'filter ' + saveFilterID + ': ' + this.chart_time_interval + ' ' + this.selected_sensors  ,
    filterPeriod: this.chart_time_interval,
    filtersensorList: this.selected_sensors,
    }
  // console.log(JSON.stringify(this.selectedFilter));

   // 3. save list
  this.savedFiltersThisDevice[filterindex]= this.selectedFilter
  this.saveFiltersinStorage (this.AppConfig.deviceID, this.savedFiltersThisDevice) ;


   // 4. update list


 }
}

saveFiltersinStorage (deviceID, filterListToSave) {

    //   console.log("//////////// saving filter list in loacl storage")
      //Find index of specific object using findIndex method.
      let objIndex =  this.savedFilterList.findIndex((obj => obj.deviceID == this.AppConfig.deviceID));
    //  console.log("objIndex objIndex: ", objIndex)


      //Log object to Console.
  //    console.log("Before update: ", this.savedFilterList[objIndex])

      if (objIndex < 0) {
          this.savedFilterList.push({deviceID:deviceID ,savedFilters : filterListToSave});
      }
      else {
        // update
          this.savedFilterList[objIndex].savedFilters = filterListToSave;
      }


      //Log object to console again.
  //    console.log("After update: ", this.savedFilterList[objIndex])
  //    console.log("savedFilterList : ",  JSON.stringify(this.savedFilterList))
      this.localData.saveSavedFilterList(this.savedFilterList).then((val) => {
          this.loadSavedFilters(); // refresh the list of filters
      });

}

loadSelectedFilter() {
 //
 console.log("Loading loadFilterSelectedID:  = " + this.loadFilterSelectedID );
// 1. find filter by ID
let objIndex =  this.savedFiltersThisDevice.findIndex((obj =>  obj.filterID == this.loadFilterSelectedID ));

// 2. apply filter values

this.chart_time_interval =  this.savedFiltersThisDevice[objIndex].filterPeriod;
this.selected_sensors = this.savedFiltersThisDevice[objIndex].filtersensorList;

// 3. load cahrt data - automatic.

}




 loadSavedFilters () {
//  console.log("........... loading saved filter list deviceID = " + this.AppConfig.deviceID);

  this.localData.getSavedFilterList ().then((val) => {
     if (val != null) {
         this.savedFilterList = val;
         //console.log ('app savedFilterList : ' + JSON.stringify(this.savedFilterList) );
         // find filter related to this deviceID
         //Find index of specific object using findIndex method.

         let objIndex =  this.savedFilterList.findIndex((obj => obj.deviceID == this.AppConfig.deviceID));
         //console.log("objIndex objIndex: ", objIndex)

         if (objIndex < 0) {
           //empty - create new filter
           //console.log("----------------no filters saved");
           // display empty filter list
           let blankFilterRow = {filterID:0,filterName:"<empty slot>",filterPeriod:"",filtersensorList:""}
           this.savedFiltersThisDeviceSAVEList.push(blankFilterRow);
           this.savedFiltersThisDevice = [];
         }
         else {
           // update
           //console.log("----------------LOADING SAVED FILTER");

             this.savedFiltersThisDevice = this.savedFilterList[objIndex].savedFilters;   // saved filters
            //console.log ('savedFiltersThisDevice : ' + JSON.stringify( this.savedFiltersThisDevice ));

             this.savedFiltersThisDeviceSAVEList = this.savedFiltersThisDevice.slice ();  // saved filters for SAVE list - + 1 row
             let blankFilterRow = {filterID:0,filterName:"<empty slot>",filterPeriod:"",filtersensorList:""}
             this.savedFiltersThisDeviceSAVEList.push(blankFilterRow);


         }

      }
      else {
        //empty - create new filter
        //console.log("----------------no filters saved");
        // display empty filter list
        let blankFilterRow = {filterID:0,filterName:"<empty slot>",filterPeriod:"",filtersensorList:""}
        this.savedFiltersThisDeviceSAVEList.push(blankFilterRow);
        this.savedFiltersThisDevice = [];
        // prepare LOAD FILTER list.
      }
    });
}




  ngOnInit() {
  }

}
