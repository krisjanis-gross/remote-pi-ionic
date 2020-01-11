import { Injectable } from '@angular/core';


//import 'rxjs/add/operator/map';
//import 'rxjs/Rx';

import { HttpClient, HttpHeaders, HttpErrorResponse, HttpRequest } from '@angular/common/http';


import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendDataService {

    public ServerURL:string;
    public ServerKEY: string;


    public ServerURLDefault = "http://localhost";
    public ServerPath = "/json_API_v2.php";

    public httpOptions = {
              headers: new HttpHeaders({
                'Accept': 'application/json',
                  'Content-Type':  'application/x-www-form-urlencoded'
              })
            };


  constructor( public http: HttpClient ) { }




  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }



  private extractData(res: Response) {
    let body = res;
    return body || { };
  }





  checkDeviceVersion(): Observable<any> {

  let post_parameters = {
    API_key : this.ServerKEY,
    request_action: "version_check",
    request_data: ""
  };

 let API_CALL_URL  = this.ServerURL + this.ServerPath;
 console.log('URL:', API_CALL_URL);

  return this.http.post(API_CALL_URL,  post_parameters , this.httpOptions).pipe(
    map(this.extractData),
    catchError(this.handleError));
}




gedDeviceConfig(): Observable<any> {

let post_parameters = {
  API_key : this.ServerKEY,
  request_action: "getDeviceConfig",
  request_data: ""
};

let API_CALL_URL  = this.ServerURL + this.ServerPath;
console.log('URL:', API_CALL_URL);

return this.http.post(API_CALL_URL,  post_parameters , this.httpOptions).pipe(
  map(this.extractData),
  catchError(this.handleError));
}




  getRealtimeData() {
    let post_parameters = {
      API_key : this.ServerKEY,
      request_action: "get_realtime_data",
      request_data: ""
    };

}


getRelayData(): Observable<any> {
  let post_parameters = {
    API_key : this.ServerKEY,
    request_action: "get_GPIO_list",
    request_data: ""
  };

  let API_CALL_URL  = this.ServerURL + this.ServerPath;
//  console.log(' get_GPIO_list  URL:', API_CALL_URL);

   return this.http.post(API_CALL_URL,  post_parameters , this.httpOptions).pipe(
     map(this.extractData),
     catchError(this.handleError));
}





getSensorData(): Observable<any> {
  let post_parameters = {
    API_key : this.ServerKEY,
    request_action: "get_sensor_data",
    request_data: ""
  };

  let API_CALL_URL  = this.ServerURL + this.ServerPath;
//  console.log(' getSensorData  URL:', API_CALL_URL);

   return this.http.post(API_CALL_URL,  post_parameters , this.httpOptions).pipe(
     map(this.extractData),
     catchError(this.handleError));
}




getChartData(data_period,selected_sensors): Observable<any> {
  let post_parameters = {
    API_key : this.ServerKEY,
    request_action: "get_historic_data",
    request_data: {
        period: data_period,
        selected_sensors: selected_sensors
      }
  };

  let API_CALL_URL  = this.ServerURL + this.ServerPath;
//  console.error(' get_historic_data  URL:', API_CALL_URL , post_parameters);

   return this.http.post(API_CALL_URL,  post_parameters , this.httpOptions).pipe(
     map(this.extractData),
     catchError(this.handleError));
}




getSensorList(data_period): Observable<any> {
  let period = {
      period: data_period
    }
  let post_parameters = {
    API_key : this.ServerKEY,
    request_action: "get_sensor_list",
    request_data: period
  };

  let API_CALL_URL  = this.ServerURL + this.ServerPath;
  console.log(' get_historic_data  URL:', API_CALL_URL , post_parameters);

   return this.http.post(API_CALL_URL,  post_parameters , this.httpOptions).pipe(
     map(this.extractData),
     catchError(this.handleError));
}



setRelayState (relayID,newState): Observable<any>  {

  let post_parameters = {
    API_key : this.ServerKEY,
    request_action: "set_GPIO_pin",
    request_data: {
      pin_id : relayID,
      command: newState
    }
  };

  let API_CALL_URL  = this.ServerURL + this.ServerPath;
//  console.log(' get_GPIO_list  URL:', API_CALL_URL);

   return this.http.post(API_CALL_URL,  post_parameters , this.httpOptions).pipe(
     map(this.extractData),
     catchError(this.handleError));

//  console.log ('trying to call set_GPIO_pin from ' + this.ServerURL);

  //return   this.http.post(this.ServerURL + '/print_app_API.php', JSON.stringify(post_parameters), headers)

  /*
  return   this.http.post(this.ServerURL + '/v2/json_API_v2.php', JSON.stringify(post_parameters))
                        .map(data => data.json())
                        .toPromise();

                        */
}

setParameterValue  (parameterID,newValue): Observable<any>  {

  let post_parameters = {
    API_key : this.ServerKEY,
    request_action: "setParameterValue",
    request_data: {
    parameterID : parameterID,
    newValue: newValue
    }
  };

  let API_CALL_URL  = this.ServerURL + this.ServerPath;
  //console.log(' setParameterValue  URL:', API_CALL_URL);

   return this.http.post(API_CALL_URL,  post_parameters , this.httpOptions).pipe(
     map(this.extractData),
     catchError(this.handleError));

}



toggleTriggerState (triggerID,newState): Observable<any>  {



  let post_parameters = {
    API_key : this.ServerKEY,
    request_action: "set_trigger_state",
    request_data: {
    triggerID : triggerID,
    command: newState
    }
  };

  let API_CALL_URL  = this.ServerURL + this.ServerPath;
  //console.log(' set_trigger_state  URL:', API_CALL_URL);

   return this.http.post(API_CALL_URL,  post_parameters , this.httpOptions).pipe(
     map(this.extractData),
     catchError(this.handleError));

}




getTriggerData(): Observable<any> {
  let post_parameters = {
    API_key : this.ServerKEY,
    request_action: "get_Trigger_list",
    request_data: ""
  };


  let API_CALL_URL  = this.ServerURL + this.ServerPath;
//  console.log (' get_Trigger_list  URL:', API_CALL_URL , post_parameters);

   return this.http.post(API_CALL_URL,  post_parameters , this.httpOptions).pipe(
     map(this.extractData),
     catchError(this.handleError));

}



}
