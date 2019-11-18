import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { BackendDataService } from '../backend-data.service';

import { LocalAppDataService } from '../local-app-data.service';


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




  constructor(
    public loadingController: LoadingController,
    private backendData: BackendDataService,
    public localData: LocalAppDataService,

  ) {    }

  ionViewWillEnter(){
      //  console.log ('entered home view ' );

        this.getChartData () ;

        this.localData.getLocalAppconfig().then((val) =>
              {
                if (val != null) {
                    this.AppConfig = val;
                    //console.log ('app config : ' + JSON.stringify(this.AppConfig) );
                    this.loadSavedFilters();
                 }
               });
  }





  async getChartData () {
        const loading = await this.loadingController.create({
          content: 'Loading chartData'
        });
        await loading.present();
        await this.backendData.getChartData(this.chart_time_interval, this.selected_sensors)
          .subscribe(res => {
            console.log(res);
          //  console.log(res.response_data);
            // get trigger data.
//            this.SensorList = res.response_data.data;
        this.chart_data = res.response_data;
        this.show_chart ();
        this.getSensorList () ;


      //      this.classrooms = res;
            loading.dismiss();
          }, err => {
            console.log(err);
            loading.dismiss();
          });


        }


    show_chart() {


      var myChart = HighCharts.chart('container', {
    chart: {
      type: 'spline'
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


change_period () {

//this.chart_time_interval = "1hr";
//  alert(" change period! " + this.chart_time_interval);
this.getChartData () ;
}




async getSensorList () {
      const loading = await this.loadingController.create({
        content: 'Loading SensorList'
      });
      await loading.present();
      await this.backendData.getSensorList(this.chart_time_interval)
        .subscribe(res => {
          console.log(res);
        //  console.log(res.response_data);
          // get trigger data.
//            this.SensorList = res.response_data.data;
      this.SensorList = res.response_data;
  //    this.show_chart ();



    //      this.classrooms = res;
          loading.dismiss();
        }, err => {
          console.log(err);
          loading.dismiss();
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
