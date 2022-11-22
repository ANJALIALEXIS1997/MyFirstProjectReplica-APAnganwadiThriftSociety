import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginVerifyService {

  constructor() { }
  get_login_status(): string {
    // this funda is to close the file in 1 hour after logging in automatically if we leave it without logging out.If we won't do so the navigation is being displayed in the header.
    var millisec = localStorage.getItem("logintime") || "";
    let millisec_int = parseInt(millisec);
    const d = new Date();
    let ms = d.getTime();
    if (ms - millisec_int > 3600000) {
      localStorage.setItem("LoginCookie", "false");
      localStorage.setItem("LoginRole", "");
      localStorage.setItem("admin_name", "");
    }
    return localStorage.getItem("LoginCookie") || "";
  }
  //
  get_user_role(): string {
    return localStorage.getItem("LoginRole") || "";

  }
  get_admin_name(): string {
    return localStorage.getItem("admin_name") || "";
  }
  get_payment_conf_admin(): boolean {
    let payment_conf_admin_status = localStorage.getItem("payment_conf_admin") || "";
    if (payment_conf_admin_status == "Y") {
      return true;
    } else {
      return false;
    }
  }
  get_dist_wise_conf_admin(): boolean {
    let dist_wise_conf_admin_status = localStorage.getItem("dist_wise_conf_admin") || "";
    if (dist_wise_conf_admin_status == "Y") {
      return true;
    } else {
      return false;
    }
  }
  get_gl_gen_admin(): boolean {
    let gl_gen_admin_status = localStorage.getItem("gl_gen_admin") || "";
    if (gl_gen_admin_status == "Y") {
      return true;
    } else {
      return false;
    }
  }
  get_download_detail_admin(): boolean {
    let download_detail_admin_status = localStorage.getItem("download_detail_admin") || "";
    if (download_detail_admin_status == "Y") {
      return true;
    } else {
      return false;
    }
  }
  get_admin_management_admin(): boolean {
    let admin_management_admin_status = localStorage.getItem("admin_management_admin") || "";
    if (admin_management_admin_status == "Y") {
      return true;
    } else {
      return false;
    }
  }
}
