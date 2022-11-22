import { Component, OnInit } from '@angular/core';
import { AdminLoginService } from 'src/app/admin-login.service';
@Component({
  selector: 'app-dist-wise-confirm',
  templateUrl: './dist-wise-confirm.component.html',
  styleUrls: ['./dist-wise-confirm.component.css']
})
export class DistWiseConfirmComponent implements OnInit {
  dist_conf_retrieve_array:any[]=[];
  constructor(private service :AdminLoginService) { }

  ngOnInit(): void {
    this.service.dist_wise_confirm().subscribe(data => {
      console.log(data);
     this.dist_conf_retrieve_array=(data);
     console.log(this.dist_conf_retrieve_array);
       })
  }
  district_confirm(aadhar:string,mobile:string){
    this.service.dist_wise_confirm_action(aadhar,mobile).subscribe(data => {
      console.log(data);
      alert(data.msg);
      this.service.dist_wise_confirm().subscribe(data => {
        console.log(data);
       this.dist_conf_retrieve_array=(data);
       console.log(this.dist_conf_retrieve_array);
         })
       })
  }

}
