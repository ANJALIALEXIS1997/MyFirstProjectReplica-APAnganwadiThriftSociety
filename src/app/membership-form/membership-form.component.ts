import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ClientToServerService } from '../client-to-server.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-membership-form',
  templateUrl: './membership-form.component.html',
  styleUrls: ['./membership-form.component.css'],
  providers: [
    { provide: 'Window', useValue: window }
  ]
})
export class MembershipFormComponent implements OnInit {

  // we are fetching data from server to client and passing the data into this array to display in html.So we assigned and initialized
  district_array: any[] = [];  // *ngFor so iterator so array
  project_array: any[] = [];   // *ngFor so iterator so array
  sector_array: any[] = [];    // *ngFor so iterator so array
  //
  //these 2 are initialized here 
  selected_project: any = '';
  selected_district: any = "";
  //
  //2 way binding [(ngModel)]for age, value name is assigned here and initialized
  applicant_age: string = "";
  //all these are 2 way binding [(ngModel)] values that were assigned and initialized
  p_door_no: any = "";
  p_landmark: any = "";
  p_village_city: any = "";
  p_district: any = "";
  p_pincode: any = "";
  t_door_no: any = "";
  t_landmark: any = "";
  t_village_city: any = "";
  t_district: any = "";
  t_pincode: any = "";
  enable_download: boolean = false;//for enabling download and disabling save for alraedy saved ones
  //
  //readonly property to disable the temporary address fields
  disable_fields: boolean = false;
  //this is for checbox that was assigned for same as permanent [checked] property value is initialized.
  ischecked: boolean = false;
  // these 2 are for 2 radio button. initially first radio button is default selected .so true  
  show_one: boolean = true;
  show_two: boolean = false;
  // for validation
  submitted: boolean = false;
  // this is to pass all the data from [formGroup] name assigned as membershipForm in html 
  membershipForm: FormGroup = new FormGroup([]);
  //
  //this is initialized here
  current_date: Date = new Date();
  //[max]="current_date_str" assigned for date of birth and date of payment 
  current_date_str: string = "";
  //
  //type=file
  file?: File | null;     // for upload photo
  //this is initialized here
  closeResult: string = '';
  //*ngIf assigned for whole form in form tag as isLoggedIn==true in html
  isLoggedIn: boolean = false;
  //[src]='edit_img_path'
  edit_img_path: string = "";
  //
  //this is initialized here. this is used for edit and insert. 
  entry_mode: string = "";

  // all the services should be assigned in this constructor.
  constructor(private service: ClientToServerService, private formBuilder: FormBuilder, private modalService: NgbModal, @Inject('Window') private window: Window) {

  }
  // 
  change_photo(event: any) {
    this.file = event.target.files[0];
    // files are actually stored on the element itself in the DOM,so to access it we mustaccess the target of the event
    //event. target gives you the element that triggered the event. 
  }
  formatDate(date: Date) { //date that is entered is passed here in this date key
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),  //getMonth counts from zero. So +1 is assigned
      day = '' + d.getDate(),  // getDate() it satrts from 1
      year = d.getFullYear();  //returns the full year (4 digits) of a date.

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    return [year, month, day].join('-');
  }

  ngOnInit(): void {
    // formatDate is a function written above and that was taken in this 
    this.current_date_str = this.formatDate(this.current_date);
    //all these are for values to pass and which were inserted and for validations
    this.membershipForm = this.formBuilder.group({
      applicant_name: ['', [Validators.required, Validators.minLength(3)]],
      applicant_dob: ['', Validators.required],
      applicant_age: ['', Validators.required],
      applicant_f_h_name: ['', [Validators.required, Validators.minLength(3)]],
      applicant_caste: ['', Validators.required],
      applicant_desig: ['', Validators.required],
      applicant_dist: ['', Validators.required],
      applicant_proj: ['', Validators.required],
      applicant_sector: ['', Validators.required],
      applicant_gender: ['', Validators.required],
      applicant_marital_status: ['', Validators.required],
      applicant_aadhno: ['', [Validators.required, Validators.pattern(/^\d{4}\d{4}\d{4}$/)]],
      applicant_pan_no: ['', [Validators.required, Validators.pattern(/[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}/)]],
      applicant_mobno: ['', [Validators.required, Validators.pattern(/^[6789]{1}[0-9]{9}$/)]],
      applicant_centre_code: ['', [Validators.required, Validators.pattern(/[0-9]/)]],
      applicant_centre_area: ['', Validators.required],
      applicant_bnk_acc_no: ['', Validators.required],
      applicant_ifsc_code: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      applicant_bank_name: ['', [Validators.required, Validators.minLength(3)]],
      applicant_branch_name: ['', [Validators.required, Validators.minLength(3)]],
      applicant_no_of_shares: ['', [Validators.required, Validators.pattern(/[0-9]/)]],
      applicant_install_amt: ['', [Validators.required, Validators.pattern(/[0-9]/)]],
      applicant_pmnt_details: ['', Validators.required],
      applicant_dt_of_pmnt: ['', Validators.required],
      applicant_utr_no: ['', Validators.required],
      applicant_door_no: ['', [Validators.required, Validators.minLength(3)]],
      applicant_landmark: ['', [Validators.required, Validators.minLength(3)]],
      applicant_village_city: ['', [Validators.required, Validators.minLength(3)]],
      applicant_district: ['', [Validators.required, Validators.minLength(3)]],
      applicant_pincode: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/[0-9]/)]],
      applicant_temp_door_no: ['', Validators.required],
      applicant_temp_landmark: ['', [Validators.required, Validators.minLength(3)]],
      applicant_temp_village_city: ['', [Validators.required, Validators.minLength(3)]],
      applicant_temp_district: ['', [Validators.required, Validators.minLength(3)]],
      applicant_temp_pincode: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/[0-9]/)]],
      nominee_name1: ['', [Validators.required, Validators.minLength(3)]],
      rel_with_memb1: ['', [Validators.required, Validators.minLength(3)]],
      nominee_aadhno1: ['', [Validators.required, Validators.pattern(/^\d{4}\d{4}\d{4}$/)]],
      nominee_name2: ['', [Validators.required, Validators.minLength(3)]],
      rel_with_memb2: ['', [Validators.required, Validators.minLength(3)]],
      nominee_aadhno2: ['', [Validators.required, Validators.pattern(/^\d{4}\d{4}\d{4}$/)]]
    });

    // end
    // service is the key name assigned in a constructor as service: ClientToServerService
    // as we are retrieving the data we need not assign anything in the ().
    // fetch_districts() function is created in service and it is called here.data is where we have fetched data from node 
    this.service.fetch_districts().subscribe(data => {
      console.log(data);
      this.district_array = data;
      // fetch_district end
      //saved aadhar and mobile values in localstorage were passed in aadhar and mobile
      let aadhar = localStorage.getItem("aadhar");//"aadhar"- this name is from setValue(aadhar) 
      let mobile = localStorage.getItem("mobile");
      //alert(aadhar + "===" + mobile);
      //when we login with aadhar and mobile no we save that in local storage and set value with names aadhar and mobile .These where accessed where we want using getItem
      this.membershipForm.controls['applicant_aadhno'].setValue(aadhar);
      this.membershipForm.controls['applicant_mobno'].setValue(mobile);
      //
      let dob: any = "";
      // when we login with aadhar and mobile number and if we have that same aadhar and mobile number we retrieve the data and if we want we can update that.If we won't have that aadhar and mobile no. we insert the data and save.
      this.service.fetch_user_details(aadhar, mobile).subscribe(details => {
        //console.log(details);
        console.log("this is" + details); // we get -- this is [object Object]
        //The Object.keys() method returns an array of a given object's
        if (Object.keys(details).length > 0) {
          this.entry_mode = "E";  //edit when data is present in database
          this.enable_download = true;
        }
        else {
          this.entry_mode = "I"; //insert when no data is present
          this.enable_download = false;
        }
        //The Object.entries() method returns an array of a given object's own enumerable string-keyed property [key, value] pairs.
        Object.entries(details).forEach(([key, value]) => {
          console.log(key + "===" + value);
          if (key == "applicant_dob") // if key name is same/matching with applicant_dob then thats value pass to dob
          {
            dob = value; // dob is intialized above as  let dob: any = "";
          }
          if (key == "applicant_dist") {
            this.selected_district = value || ""; //value or null is passed to  this.selected_district
          }
          //selected_project: any = ''; initialized above
          // selected_district: any = ""; initialized above
          if (key == "applicant_proj") {
            //Example if i have district_code 11 and its dist_sesc is srikakulam. Then district_code=11 are many, project_code=01,02..are few and its project_desc=gara....unique names 
            // here as we need to select the project based on the district, we pass on district value and fetch that related project values
            this.service.fetch_projects(this.selected_district).subscribe(data => {
              console.log(data);
              //0:{project_code: '01', project_desc: 'Railway koduru'}..all the 14 of district_code=21
              this.project_array = data;
              this.membershipForm.controls[key].setValue(value);
            })
            this.selected_project = value || "";
          }
          if (key == "applicant_sector") {
            this.service.fetch_sectors(this.selected_district, this.selected_project).subscribe(data => {
              console.log(data);
              this.sector_array = data;
              this.membershipForm.controls[key].setValue(value);

            })
          }
          if (key == "applicant_door_no") {
            this.p_door_no = value;
          }
          if (key == "applicant_landmark") {
            this.p_landmark = value;
          }
          if (key == "applicant_village_city") {
            this.p_village_city = value;
          }
          if (key == "applicant_district") {
            this.p_district = value;
          }
          if (key == "applicant_pincode") {
            this.p_pincode = value;
          }

          if (key == "applicant_temp_door_no") {
            this.t_door_no = value;
          }
          if (key == "applicant_temp_landmark") {
            this.t_landmark = value;
          }
          if (key == "applicant_temp_village_city") {
            this.t_village_city = value;
          }
          if (key == "applicant_temp_district") {
            this.t_district = value;
          }
          if (key == "applicant_temp_pincode") {
            this.t_pincode = value;
          }
          if (key == "nominee_name2") {
            if ((value == null) || (value == ""))
              this.check_it("1");
            else
              this.check_it("2");
          }

          this.membershipForm.controls[key].setValue(value);

        });
        if (this.entry_mode == "E") {
          this.calculate_age(new Date(dob));
          let img_path = "http://localhost:8080/uploads/" + aadhar + ".png";
          this.edit_img_path = img_path;
          this.set_checked(); //this is function call of set_checked()
        }

      })
    });

    this.isLoggedIn = this.service.getLoggedStatus();// getLoggedStatus() function written in service

  }//ng oninit close
  // this getter f() is used for validation and to access the form-controls assigned in *ngIf=membershipForm.controls;[formcontrolname] from html
  get f() { return this.membershipForm.controls; }
  // insert funda and update funda in single button event start 
  add_item() {
    this.submitted = true;
    //all the formcontrol names values that are entered are passed to data_for_insertion
    let data_for_insertion = this.membershipForm.value;
    // as photo is not assigned as formcontrolname we need to pass it seperately
    data_for_insertion.photo = this.file;
    console.log(data_for_insertion);
    
    if (this.entry_mode == "I") {
      this.service.save_reg(data_for_insertion).subscribe(data => { //note: this name can be anytrhing of our wish dataor details..anything. what ever data is fetched will come here.
        console.log(data);
        // we get null as output for data as we are not retrieving anything from server to client.
        //alert(data);
        alert("Successfully inserted data");
        
      })
      alert(this.submitted);
      if (this.membershipForm.invalid) {
        return;
      } else {

      }
    }
    else {
      ////subscribe to a function for edit
      let data_updation = '';
      //update_reg()function written in service file and data is passed to edit them
      this.service.update_reg(data_for_insertion).subscribe(data => {
        console.log(data);
        //alert(data);
        alert("Successfully updated data");
       
      })
      alert(this.submitted);
      if (this.membershipForm.invalid) {
        return;
      } else {

      }
    }
  }
  //add item() close

  fetch_project(event: any) { //event keyword
    //alert(event.target.value);
    this.project_array = []; //we are emptying this 
    //event. target gives you the element that triggered the event. So, event. target. value retrieves the value of that element (an input field, in your example).
    this.selected_district = event.target.value;
    this.service.fetch_projects(this.selected_district).subscribe(data => {
      console.log(data);
      this.project_array = data;

    })
  }

  fetch_sectors(event: any) { //event keyword
    //alert(event.target.value);
    this.sector_array = [];
    this.selected_project = event.target.value;
    this.service.fetch_sectors(this.selected_district, this.selected_project).subscribe(data => {
      console.log(data);
      this.sector_array = data;

    })
  }

  date_of_birth_logic(event: any) {

    let user_entry_dob = new Date(event.target.value);
    this.calculate_age(user_entry_dob);
  }
  calculate_age(user_entry_dob: Date) {
    let current_date = new Date();
    //getTime() returns the number of milliseconds
    let age = current_date.getTime() - user_entry_dob.getTime(); //we get millsecond time
    age = (age / (1000 * 86400 * 365));  // 1 day = 86,400 seconds ; 1 second=1000milliseconds; 1 year=365 days
    // to get age in years we are converting milliseconds to year .
    let years = Math.floor(age);
    let months = Math.floor((age - Math.floor(age)) * 12);
    let days = Math.floor((age - Math.floor(age) - (months) / 12) * 365);
    let current_year = current_date.getFullYear(); //returns 4 digit year eg:2022
    let dob_year = user_entry_dob.getFullYear();
    while (dob_year % 4 != 0) {
      dob_year++;
    }
    let no_of_leap_yrs = (current_year - dob_year) / 4;
    if (days > no_of_leap_yrs) { days -= no_of_leap_yrs; }
    else {
      days = days + 30 - no_of_leap_yrs;
      months -= 1;
      if (months < 0) {
        years = years - 1;
        months += 12;
      }

    }
    //days=Math.floor(days);
    days = Math.floor(days);
    this.applicant_age = years + " yrs " + months + " Months " + days + "days";

  }

  set_check_status() {    // for temporay and permanent
    // console.log(event);
    this.ischecked = !this.ischecked;
    if (this.ischecked) {

      this.disable_fields = true;
    } else {
      this.disable_fields = false;

    }
    this.copy_address();

  }
  copy_address() {
    console.log(this.ischecked);
   
    if (this.ischecked) {
      this.t_door_no = this.p_door_no;
      this.t_landmark = this.p_landmark;
      this.t_village_city = this.p_village_city;
      this.t_district = this.p_district;
      this.t_pincode = this.p_pincode;
    } else {
      this.t_door_no = "";
      this.t_landmark = "";
      this.t_village_city = "";
      this.t_district = "";
      this.t_pincode = "";

    }
  }

  set_checked() {
    if ((this.t_door_no == this.p_door_no) && (this.t_landmark == this.p_landmark) && (this.t_village_city == this.p_village_city) && (this.t_district == this.p_district) && (this.t_pincode == this.p_pincode)) {
      this.ischecked = true;
    }
  }
  check_it(param: any) { // for no. of nominees
    //alert(param);
    if (param == "1") {
      this.show_one = true;
      this.show_two = false;
    }
    else {
      this.show_one = true;
      this.show_two = true;
    }
  }
  dowlodaPDF() {
    const data = document.getElementById('content')!;
    data.setAttribute("style", "height:1800px");
    document.getElementById('button_panel')!.setAttribute("style", "display:none");
    document.getElementById('input')!.setAttribute("style", "display:none");
    document.getElementById('bordered_upload')!.setAttribute("style", "border:0px");

    console.log(data);
    html2canvas(data, { logging: true, useCORS: true, scrollY: -this.window.scrollY }).then((canvas: any) => {
      console.log(canvas.height + "===" + canvas.width);
      const imgWidth = 208;
      const pageHeight = 290;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      console.log(heightLeft + "===" + pageHeight);
      heightLeft -= pageHeight;
      const doc = new jsPDF('p', 'mm');
      doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        console.log("adding a new page");
        doc.addPage();
        doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= pageHeight;
      }
      doc.save('Downld.pdf');
      document.getElementById('button_panel')!.setAttribute("style", "display:''");
      document.getElementById('input')!.setAttribute("style", "display:''");
      document.getElementById('button_panel')!.setAttribute("style", " margin-left:43%");
      document.getElementById('bordered_upload')!.setAttribute("style", "border:1px solid black");
    });
  }
}