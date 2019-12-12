import { Component, OnInit } from '@angular/core';
import { NavController} from '@ionic/angular';

import { LocalAppDataService } from '../local-app-data.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-data',
  templateUrl: './device-data.page.html',
  styleUrls: ['./device-data.page.scss'],
})
export class DeviceDataPage implements OnInit {
  subscription:any;
  constructor(   public navCtrl: NavController,
                 public dataService: LocalAppDataService,
                 public platform: Platform,
                 public router: Router,
              )
            {
            //  console.log("dataservice:  " + JSON.stringify(this.dataService));
            }

  ngOnInit() {
  }


  ionViewDidEnter(){ this.subscription = this.platform.backButton.subscribe(()=>{  this.router.navigate(['/list']) /*navigator['app'].exitApp();*/     }); }
  ionViewWillLeave(){ this.subscription.unsubscribe(); }



  saveDeviceData () {
  //  console.log("save device data: this.dataService.selectedItemIndex " + this.dataService.selectedItemIndex);
    if (this.dataService.selectedItemIndex == null) {
        // new device
    //    console.log("saving new device");
        this.dataService.saveNewDeviceItem();
     }
     else {
    //   console.log("saving existing device");
       // save existing device data
       this.dataService.saveExistingDeviceItem();
     }
     this.navCtrl.back();
  }
}
