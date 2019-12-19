import { Component, OnInit } from '@angular/core';
import { ItemsService } from 'src/app/services/items.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-shelf',
  templateUrl: './change-shelf.component.html',
  styleUrls: ['./change-shelf.component.css']
})
export class ChangeShelfComponent implements OnInit {
  
  allowChange:boolean = false;
  user:any;

  itemShell = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
  itemShellTwo = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
  itemShellThree = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
  itemShellFour = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
  itemShellFive = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
  itemShellSix = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
  itemShellSeven = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
  itemShellEight = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
  itemShellNine = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
  itemShellTen = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }

  constructor(private itemService:ItemsService,private toastSrv: ToastrService,private AuthService:AuthService) { }

  ngOnInit() {
    this.getUserInfo();
  }



  getShellDetailByNumber(ev) {
    debugger;
  this.itemShell = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
  this.itemShellTwo = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
  this.itemShellThree = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
  this.itemShellFour = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
  this.itemShellFive = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
  this.itemShellSix = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
  this.itemShellSeven = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
  this.itemShellEight = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
  this.itemShellNine = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
  this.itemShellTen = {
    item:'',
    amount:'',
    whareHouse:'',
    position:'',
    _id:'',
  }
    var itemNumber = ev.target.value
    this.itemService.getShellDetailsByNumber(itemNumber).subscribe(data=>{
      debugger
      if(data[0]){this.itemShell = data[0]}
      if(data[1]){this.itemShellTwo = data[1]}
      if(data[2]){this.itemShellThree = data[2]}
      if(data[3]){this.itemShellFour = data[3]}
      if(data[4]){this.itemShellFive = data[4]}
      if(data[5]){this.itemShellSix = data[5]}
      if(data[6]){this.itemShellSeven = data[6]}
      if(data[7]){this.itemShellEight = data[7]}
      if(data[8]){this.itemShellNine = data[8]}
      if(data[9]){this.itemShellTen = data[9]}

    })
  }
  
  findByIdAndUpdate(){
 
    this.itemService.findByIdAndUpdate(this.itemShell).subscribe(data=>{
      debugger
    if(data){
      this.toastSrv.success("כמות עודכנה בהצלחה !")
    } else {
      this.toastSrv.error('ישנה שגיאה , תפנה לבר')
    }
    })
  }
  findByIdAndUpdateTwo(){
    this.itemService.findByIdAndUpdate(this.itemShellTwo).subscribe(data=>{
      if(data){
        this.toastSrv.success("כמות עודכנה בהצלחה !")
      } else {
        this.toastSrv.error('ישנה שגיאה , תפנה לבר')
      }
    })
  }
  findByIdAndUpdateThree(){
    this.itemService.findByIdAndUpdate(this.itemShellThree).subscribe(data=>{
      if(data){
        this.toastSrv.success("כמות עודכנה בהצלחה !")
      } else {
        this.toastSrv.error('ישנה שגיאה , תפנה לבר')
      }
    })
  }
  findByIdAndUpdateFour(){
    this.itemService.findByIdAndUpdate(this.itemShellFour.subscribe(data=>{
      if(data){
        this.toastSrv.success("כמות עודכנה בהצלחה !")
      } else {
        this.toastSrv.error('ישנה שגיאה , תפנה לבר')
      }
    })
  }
  findByIdAndUpdateFive(){
    this.itemService.findByIdAndUpdate(this.itemShellFive).subscribe(data=>{
      if(data){
        this.toastSrv.success("כמות עודכנה בהצלחה !")
      } else {
        this.toastSrv.error('ישנה שגיאה , תפנה לבר')
      }
    })
  }
  findByIdAndUpdateSix(){
    this.itemService.findByIdAndUpdate(this.itemShellSix).subscribe(data=>{
      if(data){
        this.toastSrv.success("כמות עודכנה בהצלחה !")
      } else {
        this.toastSrv.error('ישנה שגיאה , תפנה לבר')
      }
    })
  }
  findByIdAndUpdateSeven(){
    this.itemService.findByIdAndUpdate(this.itemShellSeven).subscribe(data=>{
      if(data){
        this.toastSrv.success("כמות עודכנה בהצלחה !")
      } else {
        this.toastSrv.error('ישנה שגיאה , תפנה לבר')
      }
    })
  }
  findByIdAndUpdateEight(){
    this.itemService.findByIdAndUpdate(this.itemShellEight).subscribe(data=>{
      if(data){
        this.toastSrv.success("כמות עודכנה בהצלחה !")
      } else {
        this.toastSrv.error('ישנה שגיאה , תפנה לבר')
      }
    })
  }
  findByIdAndUpdateNine(){
    this.itemService.findByIdAndUpdate(this.itemShellNine).subscribe(data=>{
      if(data){
        this.toastSrv.success("כמות עודכנה בהצלחה !")
      } else {
        this.toastSrv.error('ישנה שגיאה , תפנה לבר')
      }
    })
  }
  findByIdAndUpdateTen(){
    this.itemService.findByIdAndUpdate(this.itemShellTen).subscribe(data=>{
      if(data){
        this.toastSrv.success("כמות עודכנה בהצלחה !")
      } else {
        this.toastSrv.error('ישנה שגיאה , תפנה לבר')
      }
    })
  }

  async getUserInfo() {
    debugger
    await this.AuthService.userEventEmitter.subscribe(user => {
      this.user = user;

      if(user.userName == 'SHARK' || user.userName == 'sima') {
        this.allowChange = true;
      }
 

    });





  }
}
