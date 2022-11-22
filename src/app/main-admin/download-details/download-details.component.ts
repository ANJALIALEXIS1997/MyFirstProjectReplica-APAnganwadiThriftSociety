import { Component, OnInit } from '@angular/core';
import { AdminLoginService } from 'src/app/admin-login.service';
import * as XLSX from 'xlsx'; // for excel we need this


@Component({
  selector: 'app-download-details',
  templateUrl: './download-details.component.html',
  styleUrls: ['./download-details.component.css']
})
export class DownloadDetailsComponent implements OnInit {
  retrieve_array:any[]=[];
  //these 2 are for current date validation and for date format.
  current_date: Date = new Date(); 
  current_date_str: string = "";
  fileName= 'ExcelSheet.xlsx'; // for excel
  // these 2 are [(ngModel)] names of from date and to date
  
  from_date:Date=new Date(0);
  to_date:Date=new Date(0);
  //
  
  
  //
  // from_date:any[]=[];
  // to_date:any[]=[];
  constructor(private service :AdminLoginService) { }

  ngOnInit(): void {

    this.current_date_str = this.formatDate(this.current_date);
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

  
  retrieve(){
   alert(this.from_date+"==="+this.to_date);
   let date_search  = {from_dt:this.from_date,to_dt:this.to_date};
   this.service.member_details(date_search).subscribe(data => {
    console.log(data);
    this.retrieve_array = data;
  //  this.dist_conf_retrieve_array=(data);
  //  console.log(this.dist_conf_retrieve_array);
     })
  }

  downloadtoExcel(){
    //npm install xlxs --save in command prompt..to access this excel sheet 
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
  }

}
