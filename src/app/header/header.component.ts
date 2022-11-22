import { Component, OnInit } from '@angular/core';
import {Router,Route} from '@angular/router';
import { LoginVerifyService } from '../login-verify.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
 constructor(private router:Router,public ls:LoginVerifyService) { }

  ngOnInit(): void {
    
  }
logout_main(){
  localStorage.setItem("LoginCookie","false"); //for session
  localStorage.setItem("LoginRole",""); //for session
  this.router.navigate(['/anganwadi']);
}
}
