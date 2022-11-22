import { Component, OnInit } from '@angular/core';
import {Router,Route} from '@angular/router';

@Component({
  selector: 'app-login-memb-form',
  templateUrl: './login-memb-form.component.html',
  styleUrls: ['./login-memb-form.component.css']
}) 
export class LoginMembFormComponent implements OnInit {
applicant_aadhno:string="";  //ngModel value
applicant_mobno:string="";   //ngModel value
otp:string="";
entered_otp:string="";      //ngModel
isLoggedIn:boolean=false; //or true is also ok
//for validation
validate_aadhar:boolean=false;
validate_mobno:boolean=false;
validate_otp:boolean=false;
//
  constructor(private router:Router) { }

  ngOnInit(): void {
    //from verify otp we get this item login cookie as true.
    let logged_status = localStorage.getItem("LoginCookie"); // kind of session 
    //LoginCookie was set as boolean value true or false as localStorage.setItem("LoginCookie","true");
    if(logged_status=="true")
    this.isLoggedIn=true;
    else
    this.isLoggedIn=false;
  }
generate_otp(){
if(this.applicant_aadhno==""){
  alert("Key in Aadhar No");
  return;
}
if(this.applicant_mobno==""){
  alert("Key in Mobile No");
  return;
}
 this.otp = Math.floor((Math.random() * 1000000) + 1).toString(); //Math.random is 0 - 0.9999999999999999. So, it generates random number between 0 1nd 1
console.log(this.otp);
}
// this is for validation of aadhar no
validate_aadhar_funda(){
  let regexp_emp = new RegExp('^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$'); // 12 digit number
  if (regexp_emp.test(this.applicant_aadhno))  // the test() method tests for the match in a string
  {
    this.validate_aadhar = false;
  }
  else {
    this.validate_aadhar = true;
  }
}
//
// this is for validation of mobile no
validate_mobno_funda(){
  let regexp_emp = new RegExp('^[0-9]{10}$'); // 10 digit number
  if (regexp_emp.test(this.applicant_mobno))  // the test() method tests for the match in a string
  {
    this.validate_mobno = false;
  }
  else {
    this.validate_mobno = true;
  }
}
//
validate_otp_funda(){
  let regexp_emp = new RegExp('^[0-9]{6}$'); // 6 digit number
  if (regexp_emp.test(this.entered_otp))  // the test() method tests for the match in a string
  {
    this.validate_otp = false;
  }
  else {
    this.validate_otp = true;
  }
}
//
verify_otp(){
  if(this.entered_otp==""){
    //this.validate_otp=true;
    alert("Key in OTP");
    return;
  }
  if(this.entered_otp==this.otp){
    alert("Your OTP is correct. Let me take you in");
   this.isLoggedIn=true;
   localStorage.setItem("LoginCookie","true"); //localStorage.setItem is to save this data in a local browser
   localStorage.setItem("aadhar",this.applicant_aadhno);
   localStorage.setItem("mobile",this.applicant_mobno);
   localStorage.setItem("LoginRole","User"); 
   this.router.navigate(['/register']);

  }
  else{
    alert("Your OTP is incorrect. Please retry");
    return;
  }
}
logout(){
 // alert("here");
  localStorage.setItem("LoginCookie","false"); //for session
  this.isLoggedIn=false;
  this.applicant_aadhno="";
  this.applicant_mobno="";
  this.otp="";
  this.entered_otp="";
  this.router.navigate(['/']);
}

}
