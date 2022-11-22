import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders, HttpErrorResponse } from
  '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AdminLoginService {
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
  // when we click on continue button and the mobile number is passed to retrieve the password of that number
  fetch_admin_details(mobno:string): Observable<any> {
    let data_pass={mobno_key:mobno}
    return this.httpClient.post<any>("http://localhost:8080/get_admin_details",data_pass)
      .pipe(
        retry(7),
        catchError(this.httpErrorHandler)
      );
  }
  // when we click on reset password button then the new entered password gets updated 
  reset_password(data_pass:any):Observable<any>{
    return this.httpClient.post<any>("http://localhost:8080/password_reset",data_pass)
      .pipe(
        retry(7),
        catchError(this.httpErrorHandler)
      );
  }
  //payment confirmation in admin data fetching starting line 
  admin_pmnt_confirm():Observable<any>{
    return this.httpClient.post<any>("http://localhost:8080/pmnt_confirm_admin",'')
      .pipe(
        retry(7),
        catchError(this.httpErrorHandler)
      );
  }
  //end line of data fetch
  // we need to convert the conf_flag to Y so we are doing here by using aadhar and mobile no and which admin has confirmed is also assigned here by admin_mob_no
  admin_pmnt_confirm_action(aadhar:string,mobile:string):Observable<any>{
    //localStorage.setItem("admin_mob_no",this.admin_mob_no); from admin-page.component.ts
    let admin_mobile:string=localStorage.getItem("admin_mob_no")||"";
    let data_to_pass={aadhar:aadhar,mobile:mobile,admin_mobile:admin_mobile};
    return this.httpClient.post<any>("http://localhost:8080/pmnt_confirm_admin_action",data_to_pass)
      .pipe(
        retry(7),
        catchError(this.httpErrorHandler)
      );
  }
  //
  //district-wise-confirm
  dist_wise_confirm():Observable<any>{
    return this.httpClient.post<any>("http://localhost:8080/dist_wise_confirm_admin",'')
    .pipe(
      retry(7),
      catchError(this.httpErrorHandler)
    );
  }
  //
  //district-wise-confirmation-done by-which mobileno and aadhar no.
  dist_wise_confirm_action(aadhar:string,mobile:string):Observable<any>{
    let admin_mobile:string=localStorage.getItem("admin_mob_no")||"";
    let data_to_pass={aadhar:aadhar,mobile:mobile,admin_mobile:admin_mobile};
    return this.httpClient.post<any>("http://localhost:8080/dist_wise_confirm_admin_action",data_to_pass)
      .pipe(
        retry(7),
        catchError(this.httpErrorHandler)
      );
  }
  //
  // glno to be generated after we fetch the data from server to client.
  gl_generate():Observable<any>{
    return this.httpClient.post<any>("http://localhost:8080/glno_generate_admin",'')
    .pipe(
      retry(7),
      catchError(this.httpErrorHandler)
    );
  }
  gl_generate_action(aadhar:string,mobile:string,admin_mobile:string):Observable<any>{
    let data_to_pass={aadhar:aadhar,mobile:mobile,admin_mobile:admin_mobile}
    return this.httpClient.post<any>("http://localhost:8080/glno_generate_admin_action",data_to_pass)
    .pipe(
      retry(7),
      catchError(this.httpErrorHandler)
    );
  }
  //
  //download details
  member_details(dates_catch:any):Observable<any>{
    return this.httpClient.post<any>("http://localhost:8080/memb_details",dates_catch)
    .pipe(
      retry(7),
      catchError(this.httpErrorHandler)
    );
  }
  //general_admin
  general_admin(){
    return this.httpClient.post<any>("http://localhost:8080/admin_handling",'')
    .pipe(
      retry(7),
      catchError(this.httpErrorHandler)
    );

  }
  //role_selection_remove_admin_management
  admin_role_change(data_catch:any):Observable<any>{
    return this.httpClient.post<any>("http://localhost:8080/admin_role_selection",data_catch)
    .pipe(
      retry(7),
      catchError(this.httpErrorHandler)
    );
  }
  //delete admin 
   //role_selection_remove_admin_management
   del_admin(mobno:any):Observable<any>{
   
    return this.httpClient.post<any>("http://localhost:8080/del_admin_memb",mobno)
    .pipe(
      retry(7),
      catchError(this.httpErrorHandler)
    );
  }
  // we can bringing back the admin who was deleted 
  restore_deleted_admin(mob_no:any):Observable<any>{
   
    return this.httpClient.post<any>("http://localhost:8080/restore_admin",mob_no)
    .pipe(
      retry(7),
      catchError(this.httpErrorHandler)
    );
  }
  // new admin entry
  new_admin_entry(data_catch:any):Observable<any>{
   
    return this.httpClient.post<any>("http://localhost:8080/new_admin_access",data_catch)
    .pipe(
      retry(7),
      catchError(this.httpErrorHandler)
    );
  }
  // admin role selection
  admin_role(mobile:string):Observable<any>{
    let data_to_pass={mobile_no:mobile}
    return this.httpClient.post<any>("http://localhost:8080/admin_role_election",data_to_pass)
    .pipe(
      retry(7),
      catchError(this.httpErrorHandler)
    );
  }
}
