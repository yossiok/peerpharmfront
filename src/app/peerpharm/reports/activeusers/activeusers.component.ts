import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-activeusers',
  templateUrl: './activeusers.component.html',
  styleUrls: ['./activeusers.component.css']
})
export class ActiveusersComponent implements OnInit {
  Allusers:any[]=[];
  constructor(private userService:UsersService) { }

  ngOnInit() {
this.userService.getAllActiveUsers().subscribe(data=>
  {
     this.Allusers=data;
  });
  }

}
