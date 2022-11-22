import { Component, OnInit } from '@angular/core';
import { AdminLoginService } from 'src/app/admin-login.service';
@Component({
  selector: 'app-gl-generation',
  templateUrl: './gl-generation.component.html',
  styleUrls: ['./gl-generation.component.css']
})
export class GlGenerationComponent implements OnInit {
  glno_generate_retrieve_array:any[]=[];
  constructor(private service :AdminLoginService) { }

  ngOnInit(): void {
    this.service.gl_generate().subscribe(data => {
      console.log(data);
     this.glno_generate_retrieve_array=(data);
     console.log(this.glno_generate_retrieve_array);
       })
  }
  glno_confirm(aadhar:string,mobile:string){
    let admin_mobile:string=localStorage.getItem("admin_mob_no")||"";
    this.service.gl_generate_action(aadhar,mobile,admin_mobile).subscribe(details=>{
      this.service.gl_generate().subscribe(data => {
        console.log(data);
       this.glno_generate_retrieve_array=(data);
       console.log(this.glno_generate_retrieve_array);
         })
    })
  }

}
