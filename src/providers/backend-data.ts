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

  public ServerURL:string;
  public ServerKEY: string;
  private _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  public ServerURLDefault = "http://localhost";

  constructor(public http: Http, private storage: Storage) {


    // Or to get a key/value pair

  }

checkDeviceVersion() {
  let post_parameters = {
    request_action: "version_check",
    request_data: ""
  };

  console.log ('trying to call version_check from ' + this.ServerURL);

  //return   this.http.post(this.ServerURL + '/print_app_API.php', JSON.stringify(post_parameters), headers)
  return   this.http.post(this.ServerURL + '/v2/json_API_v2.php', JSON.stringify(post_parameters))
                        .map(data => data.json())
                        .toPromise();
  }

  getRealtimeData() {
    let post_parameters = {
      request_action: "get_realtime_data",
      request_data: ""
    };

  //  console.log ('trying to call get_realtime_data from ' + this.ServerURL);

    //return   this.http.post(this.ServerURL + '/print_app_API.php', JSON.stringify(post_parameters), headers)
    return   this.http.post(this.ServerURL + '/v2/json_API_v2.php', JSON.stringify(post_parameters))
                          .map(data => data.json())
                          .toPromise();
}


getTriggerData() {
  let post_parameters = {
    request_action: "get_GPIO_list",
    request_data: ""
  };

//  console.log ('trying to call get_GPIO_list from ' + this.ServerURL);

  //return   this.http.post(this.ServerURL + '/print_app_API.php', JSON.stringify(post_parameters), headers)
  return   this.http.post(this.ServerURL + '/v2/json_API_v2.php', JSON.stringify(post_parameters))
                        .map(data => data.json())
                        .toPromise();
}












}
