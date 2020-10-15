import { Component, OnInit } from '@angular/core';
import {ProductionService} from '../../../services/production.service'
@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss']
})
export class LinesComponent implements OnInit {

  pLines=[];
  lineObj= {
    number:'',
    discription:'',
    type:'',
    location:'',
    startDate:'',
    image:''
  }
  constructor(private productionSer:ProductionService) { } 

  ngOnInit() {
    this.getAllLines();
  }

  getAllLines(){
    this.productionSer.getAllLines().subscribe(res=>this.pLines=res);
  }

  addLine(){
    debugger;
    this.productionSer.addNewProductionLine(this.lineObj).subscribe(res=>console.log(res));
  }

  loginUser = "Gabi Barak";
  
  public users = [
    { name: 'Gabi Barak', avtar: "https://images.spot.im/v1/production/kvx9xrcrfiiwekaolx6s", lastTaskVisit: "23-05-2018" },  
    { name: 'Rabbi Nuchi', avtar: "assets/images/user.jpg", lastTaskVisit: "14-02-2018" },
    { name: 'Josh Luri', avtar: "assets/images/user1.jpg", lastTaskVisit: "03-12-2018" }
  ]

  public messages = [
    { body: "hi all, how are you, ready to begin?", user: "Gabi Barak", date: "23-05-2018 ,  13:05", avtar: "assets/images/user2.jpg" },
    { body: "let start, i'll take care to documents", user: "Josh Luri", date: "23-05-2018 ,  13:05", avtar: "assets/images/user1.jpg" },
    { body: "ok...", user: "Rabbi Nuchi", date: "23-05-2018 ,  13:05", avtar: "assets/images/user.jpg" },
    { body: "all set", user: "Gabi Barak", date: "23-05-2018 ,  13:05", avtar: "assets/images/user.jpg" }
  ]

  
  selectedUser: any = {
    name: '',
    avatar: '',
    lastTaskVisit: ''
  }
  onSelect(user: Object[]): void {
    this.selectedUser = user;
  }
}
