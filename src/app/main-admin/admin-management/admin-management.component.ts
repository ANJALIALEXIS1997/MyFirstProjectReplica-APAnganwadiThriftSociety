import { Component, OnInit } from '@angular/core';
import { AdminLoginService } from 'src/app/admin-login.service';
@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
})
export class AdminManagementComponent implements OnInit {
  main_admin_data: any[] = [];
  actual_admin: any[] = [];
  mobile_edit: string = "";
  role_edit: string = "";
  action_edit: string = "";
  //for add button ng models
  name: string = "";
  mobile: string = "";
  id: string = "";
  show_add: boolean = false;
  constructor(private service: AdminLoginService) { }

  ngOnInit(): void {
    this.load_admin();

  }
  load_admin() {
    this.actual_admin = [];
    this.service.general_admin().subscribe(data => {
      console.log(data);
      
      this.main_admin_data = (data);
      console.log(this.main_admin_data);

      let prev_mobile: string = "";
      let object: any = null;
      let role_array: any[] = [];
      this.main_admin_data.map((value, index) => {
        if (prev_mobile != value.mobile_no) { // it means, if one mobile number has 2 roles assigned to it and when the next mobile number displayed it means the previous mobile number roles were completed
          if (object != null) {                                //role_list: Array(3)
            object.role_list = role_array; // for object we assigned a property called as role_list.It need not be assigned as object is assigned
            this.actual_admin.push(object);
            role_array = [];
          }
          object = { name: value.name, mobile_no: value.mobile_no, email_id: value.email_id, registered: value.registered }
          role_array.push(value.role_desc); // master_roles table consists of role_id and role_desc
        }
        else {
          //console.log("====");
          role_array.push(value.role_desc); 
          console.log(role_array);
         
        }
        prev_mobile = value.mobile_no;
      })
      object.role_list = role_array;
      this.actual_admin.push(object);
      console.log(this.actual_admin);
      
    })
  }

  set_role(mobile: string, role: string, role_id: string) {
    this.actual_admin.map(a => {
      this.mobile_edit = mobile;
      this.role_edit = role_id;
      if (a.mobile_no == mobile) {
        if ((a.role_list).indexOf(role) != -1) { //!=-1 means true... here the role_list means that is selected and present in the database table and if the role that is selected and entered ..if both of them gets matched that means we are trying to remove that tick and removing teh access.
          alert("already have it, must be trying to remove");
          this.action_edit = "R";
        } else {
          alert("donot have it, must be trying to add");
          this.action_edit = "A";

        }
      }

    })
  }
  save_change() {
    let mobile_no = this.mobile_edit;
    let role_change = this.role_edit;
    let action_select_remove = this.action_edit;
    alert(this.mobile_edit + "---" + this.role_edit + "----" + this.action_edit);
    let data_to_pass = { mobile_no, role_change, action_select_remove };
    this.service.admin_role_change(data_to_pass).subscribe(data => {
      console.log(data);
      this.load_admin();
    })
  }
  // delete admin . convert the registered to N from Y but don't delete.
  delete_admin(mob_no: string) {
    let data_pass = { mobile_no: mob_no };
    //alert(data_pass);
    this.service.del_admin(data_pass).subscribe(data => {
      console.log(data);
      alert(data.msg);
      this.load_admin();
    })
  }
  //
  set_add() {
    this.show_add = !this.show_add;
  }
  //restore_admin(a.mobile_no)
  restore_admin(mobno: string) {
    let data_pass = { mobile_no: mobno };
    this.service.restore_deleted_admin(data_pass).subscribe(data => {
      console.log(data);
      alert(data.msg);
      this.load_admin();
    })
  }
  // new admin addition 
  save_new_admin() {
    let new_admin_name = this.name;
    let new_admin_mobno = this.mobile;
    let new_admin_email_id = this.id;
    let data_pass = { name: new_admin_name, mobile: new_admin_mobno, email: new_admin_email_id };
    this.service.new_admin_entry(data_pass).subscribe(data => {
      console.log(data);
      alert(data.msg);
      this.name = "";
      this.mobile = "";
      this.id = "";
      this.show_add = !this.show_add;
      this.load_admin();
    })
  }

}
