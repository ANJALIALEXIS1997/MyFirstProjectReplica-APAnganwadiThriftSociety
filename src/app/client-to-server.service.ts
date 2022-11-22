import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders, HttpErrorResponse } from
  '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ClientToServerService {
isLoggedIn:boolean=false;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private httpClient: HttpClient) { }
  private httpErrorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("A client side error occurs. The error message is " + error.message);
    } else {
      console.error(
        "An error happened in server. The HTTP status code is " + error.status + " and the error returned is " + error.message);
    }

    return throwError("Error occurred. Pleas try again");
  }
  fetch_districts(): Observable<any> {
    return this.httpClient.post<any>("http://localhost:8080/districts", "")
      .pipe(
        retry(7),
        catchError(this.httpErrorHandler)
      );
  }
  fetch_projects(district_val: any): Observable<any> {
    var data_to_pass = { district: district_val };
    return this.httpClient.post<any>("http://localhost:8080/projects", data_to_pass)
      .pipe(
        retry(7),
        catchError(this.httpErrorHandler)
      );
  }

  fetch_sectors(district_val: any, project_val: any): Observable<any> {
    var data_to_pass = { district: district_val, project: project_val };
    return this.httpClient.post<any>("http://localhost:8080/sectors", data_to_pass)
      .pipe(
        retry(7),
        catchError(this.httpErrorHandler)
      );
  }
  // this is an insert function . the entered data is passed to data_to_insert
  save_reg(data_to_insert: any):Observable<any> {
    //The FormData interface provides a way to easily construct a set of key/value pairs representing form fields and their values
    //The following creates a new FormData object from an HTML form element:
    const formData = new FormData();
    let keys = Object.keys(data_to_insert);//Object.keys returns a string[]
    console.log(keys);
// @59 line
// Array:
// 0: "applicant_name"
// 1:"applicant_dob"
// 2:"applicant_age"
// 3:"applicant_f_h_name"
// and so on
// 41
// : 
// "photo"
    keys.forEach(k => {
      //data_to_insert[k] means value
      //append() will append the new value onto the end of the existing set of values.
      formData.append(k, data_to_insert[k]); //(key,value) in json stringify format 
    });
    //console.log(formData);
    formData.forEach((a, b) => {
      console.log(a + "===" + b);
      
    })

       return this.httpClient.post<any>("http://localhost:8080/save",formData)
     .pipe(
      retry(7),
      catchError(this.httpErrorHandler)
     );
  }
  update_reg(data_to_update: any):Observable<any> {
    const formData = new FormData();
    let keys = Object.keys(data_to_update);
    console.log(keys);
    keys.forEach(k => {
      //append() will append the new value onto the end of the existing set of values.
      formData.append(k, data_to_update[k]); //(key,value) in json stringify format 
    });
    //console.log(formData);
    formData.forEach((a, b) => {
      console.log(a + "===" + b);
    })

       return this.httpClient.post<any>("http://localhost:8080/update",formData)
     .pipe(
      retry(7),
      catchError(this.httpErrorHandler)
     );
  }
  fetch_user_details(aadhar: any,mobile: any): Observable<any> {
    var data_to_pass = { aadhar: aadhar,mobile:mobile };
    return this.httpClient.post<any>("http://localhost:8080/userdetails", data_to_pass)
      .pipe(
        retry(7),
        catchError(this.httpErrorHandler)
      );
  }
  getLoggedStatus(){
    let logged_status = localStorage.getItem("LoginCookie");
    if(logged_status=="true")
    this.isLoggedIn=true;
    else
    this.isLoggedIn=false;
    return(this.isLoggedIn);
  }
}
