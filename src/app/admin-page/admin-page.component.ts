import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, ModalDismissReasons, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AdminLoginService } from '../admin-login.service';
import { Router, Route } from '@angular/router';


@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
  providers: [
    { provide: 'Window', useValue: window }  //for pdf
  ]
})
export class AdminPageComponent implements OnInit {
  continue: boolean = false;
  retrieved_pwd: string = "";
  retrieved_name: string = "";
  admin_mobile: string = "";
  closeResult: string = '';
  otp: string = "";
  entered_otp: string = "";
  new_pwd: string = "";
  conf_pwd: string = "";
  correct_otp: boolean = false;
  admin_mob_no: string = '';
  reset_done: boolean = false;
  payment_conf_admin:string="N";
  dist_wise_conf_admin:string="N";
  gl_gen_admin:string="N";
  download_detail_admin:string="N";
  admin_management_admin:string="N";
 
  // @ViewChild('closebutton') closebutton:any=null;


  constructor(private service: AdminLoginService, private router: Router, private modalService: NgbModal, @Inject('Window') private window: Window) {

  }

  ngOnInit(): void {
  }
  // when we click on continue button this function triggers and the mobile no that is entered is passed in form of fprm name admin 
  continue_func(admin: NgForm) {
    this.admin_mob_no = admin.value.mobileno //ngModel name="mobileno"
    this.service.fetch_admin_details(admin.value.mobileno).subscribe(data => {
      console.log(data); //here i am fetching the password based on the mobile number that is entered
    
      let l = data.length;
      if (l > 0) {
        this.continue = true;
        this.retrieved_pwd = data[0].pwd;
        this.retrieved_name = data[0].name;
        console.log(this.retrieved_pwd);
        //123456
        localStorage.setItem("admin_name", this.retrieved_name);
        localStorage.setItem("admin_mob_no", this.admin_mob_no); // we are saving the mobile number that was entered in localstorage 
      } else {
        alert("Not a Registered Mobile No for any Admin");
      }
      //alert(admin.value.mobileno);
    })
  }
  // password match. when we enter valid mobile no and password we navigate to payment_confirm.
  admin_login(admin: NgForm) {
    if (admin.value.password == this.retrieved_pwd) {
      localStorage.setItem("LoginCookie", "true");
      localStorage.setItem("LoginRole", "Admin");
      // this below funda is for sorting out the timer if we leave our project without logging it out.We are allowing iut to close after 1 hour.
      const d = new Date();
      let ms = d.getTime();//we are taking the time in milliseconds
      console.log(ms);
      localStorage.setItem("logintime", ms + "");
      //
      this.service.admin_role(this.admin_mob_no).subscribe(data => {
        console.log(data);
      
      for(let i=0;i<data.length;i++){
        if(data[i].role_id=="01")
        this.payment_conf_admin="Y";
        if(data[i].role_id=="02")
        this.dist_wise_conf_admin="Y";
        if(data[i].role_id=="03")
        {this.gl_gen_admin="Y";
        this.download_detail_admin="Y";
        this.admin_management_admin="Y";
        }
      }
      localStorage.setItem("payment_conf_admin",this.payment_conf_admin);
      localStorage.setItem("dist_wise_conf_admin",this.dist_wise_conf_admin);
    
      localStorage.setItem("gl_gen_admin",this.gl_gen_admin);
    
      localStorage.setItem("download_detail_admin",this.download_detail_admin);
    
      localStorage.setItem("admin_management_admin",this.admin_management_admin);
    
      })
      alert("correct login");
      this.router.navigate(['/admin/payment_confirm']);
    }
    else {
      alert("Failed Login");
    }
  }
  //Forgot Password / Reset Password link when we click then a pop up box is appeared
  open(content: any) {
    this.otp = Math.floor((Math.random() * 1000000) + 1).toString(); //Math.random is 0 - 0.9999999999999999. So, it generates random number between 0 1nd 1
    console.log(this.otp);
    // this part is taken from net.
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  //this is for pop up taken from net
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  // the entered otp when matches with verify otp assigned for otp text box
  verify_otp() {
    if (this.entered_otp == this.otp) {
      this.correct_otp = true;
    }
    else {
      this.correct_otp = false;
    }
  }
  // if we want to reset and want another otp no we can click and change for otp button
  reset_otp() {
    this.otp = Math.floor((Math.random() * 1000000) + 1).toString(); //Math.random is 0 - 0.9999999999999999. So, it generates random number between 0 1nd 1
    this.entered_otp = "";
    this.correct_otp = false;
  }
  // password reset function [(ngModel)]="new_pwd" [(ngModel)]="conf_pwd"
  reset_pwd() {
    if (this.new_pwd == this.conf_pwd) {
      let data_for_insertion = { mobile_no: this.admin_mob_no, password: this.new_pwd }
      this.service.reset_password(data_for_insertion).subscribe(data => {
        console.log(data);
        alert(data.msg);
        // these 2 lines are for closing automatically the pop up box after we click on reset password
        const closer = document.getElementById("closer");
        closer?.click(); //? means null or some error is present, it won't get effected..safe navigation operator 
      })
    }
  }
 

}