import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/Rx';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BackendDataService {

    public ServerURL:string;
    public ServerKEY: string;
    private _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    public ServerURLDefault = "http://localhost";

  constructor( public http: HttpClient, private storage: Storage ) { }


checkDeviceVersion() {
  let post_parameters = {
    request_action: "version_check",
    request_data: ""
  };

//  console.log ('trying to call version_check from ' + this.ServerURL);



return new Promise((resolve, reject) => {
this.http.post(this.ServerURL, JSON.stringify(post_parameters))
  .toPromise().then((response: any) => {
    resolve(response)
  });
});




  //return   this.http.post(this.ServerURL + '/print_app_API.php', JSON.stringify(post_parameters), headers)
//  return   this.http.post(this.ServerURL + '/v2/json_API_v2.php', JSON.stringify(post_parameters))
//  .pipe(
//       map(res => res.data) // or any other operator
//     )
//     .toPromise();
//                        .map(data => data.json())
  //                      .toPromise();





  }

  getRealtimeData() {
    let post_parameters = {
      request_action: "get_realtime_data",
      request_data: ""
    };

  //  console.log ('trying to call get_realtime_data from ' + this.ServerURL);

    //return   this.http.post(this.ServerURL + '/print_app_API.php', JSON.stringify(post_parameters), headers)

    /*
    return   this.http.post(this.ServerURL + '/v2/json_API_v2.php', JSON.stringify(post_parameters))
                          .map(data => data.json())
                          .toPromise();

                          */
}


getRelayData() {
  let post_parameters = {
    request_action: "get_GPIO_list",
    request_data: ""
  };

//  console.log ('trying to call get_GPIO_list from ' + this.ServerURL);

  //return   this.http.post(this.ServerURL + '/print_app_API.php', JSON.stringify(post_parameters), headers)

  /*
  return   this.http.post(this.ServerURL + '/v2/json_API_v2.php', JSON.stringify(post_parameters))
                        .map(data => data.json())
                        .toPromise();

                        */
}






setRelayState (relayID,newState) {
  let post_parameters = {
    request_action: "set_GPIO_pin",
    request_data: {
      pin_id : relayID,
      command: newState
    }
  };

//  console.log ('trying to call set_GPIO_pin from ' + this.ServerURL);

  //return   this.http.post(this.ServerURL + '/print_app_API.php', JSON.stringify(post_parameters), headers)

  /*
  return   this.http.post(this.ServerURL + '/v2/json_API_v2.php', JSON.stringify(post_parameters))
                        .map(data => data.json())
                        .toPromise();

                        */
}


getTriggerList() {
  let post_parameters = {
    request_action: "get_Trigger_list",
    request_data: ""
  };

//  console.log ('trying to call get_GPIO_list from ' + this.ServerURL);

  //return   this.http.post(this.ServerURL + '/print_app_API.php', JSON.stringify(post_parameters), headers)

  /*
  return   this.http.post(this.ServerURL + '/v2/json_API_v2.php', JSON.stringify(post_parameters))
                        .map(data => data.json())
                        .toPromise();

                        */
}



}
