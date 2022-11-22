import { Component, OnInit } from '@angular/core';
import { AdminLoginService } from 'src/app/admin-login.service';

@Component({
  selector: 'app-payment-confirm',
  templateUrl: './payment-confirm.component.html',
  styleUrls: ['./payment-confirm.component.css']
})
export class PaymentConfirmComponent implements OnInit {
// as we are bring the data more than one we need to retrieve the data in an array as we assigned below
  pmnt_conf_retrieve_array:any[]=[]; 
  constructor(private service :AdminLoginService) { }

  ngOnInit(): void {
    //here we are retrieving the data from database to client 
    this.service.admin_pmnt_confirm().subscribe(data => {
      console.log(data);
     this.pmnt_conf_retrieve_array=(data);
     console.log(this.pmnt_conf_retrieve_array);
       })
  }
  // which admin confirmed this action is done here..this is to confirm the person as payment confirmation by retrieving the data using aadhar and mobile no.
payment_confirm(aadhar:string,mobile:string){
this.service.admin_pmnt_confirm_action(aadhar,mobile).subscribe(data => {
  console.log(data);
  alert(data.msg);
  // this is same assigned above in ngOnInit ..we are assigning this again here to work
  this.service.admin_pmnt_confirm().subscribe(data => {
    console.log(data);
   this.pmnt_conf_retrieve_array=(data);
   console.log(this.pmnt_conf_retrieve_array);
     })
   })
}
}
