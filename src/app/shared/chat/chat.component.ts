import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../chat.service';
import { AuthService } from '../../services/auth.service';
import * as moment from 'moment';
import { Jsonp } from '@angular/http';
import { UserInfo } from '../../peerpharm/taskboard/models/UserInfo';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() public taskid: string;
  title = 'app';
  today: any;

  selectedUser: any = {
    name: 'User',
    avtar: 'https://i1.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1'
  }
  message: any = {
    body: '',
    user: '',
    avtar: '',
    time: '',
    taskId: '',
  }
  user: UserInfo
  messages = [{ avtar: '4', name: '1', body: '2', date: '3' }
  ]
  constructor(private chat: ChatService, private authService: AuthService) { }

  ngOnInit() {
    this.getUserInfo();
    this.getAllSavedMessages();
    this.getOnlineMessage();
    this.chat.joinroom(this.taskid);
  }

  sendMessage() {
    this.today = moment(new Date()).format("YYYY-MM-DD");
    this.message.user = this.user.userName;
    this.message.avtar = this.user.picture;
    this.message.time = this.today;
    this.message.taskId = this.taskid;
    this.chat.sendMsg(this.message);
  }

  getOnlineMessage() {
    this.chat.messages.subscribe(msg => {
      
      console.log(msg);
      this.messages.push(msg);
    })
  }
  getAllSavedMessages() {
    this.chat.getAllChatMessages(this.taskid).subscribe(res => {
      this.messages = res;
    })
  }

  getUserInfo() {
    debugger
      this.authService.userEventEmitter.subscribe(user => {
      this.user=user.loggedInUser;
    })
    debugger
    if (!this.authService.loggedInUser) {
      this.authService.userEventEmitter.subscribe(user => {
        if (user.userName) {
          this.user = user;
        }
      });
    }
    else {
      this.user = this.authService.loggedInUser;
    }
  }

}


