import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './../../services/auth.service';
import { Component, AfterViewInit, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { ROUTES } from '../sidebar/menu-items';
import { Router, ActivatedRoute } from '@angular/router';
import { UserInfo } from '../../peerpharm/taskboard/models/UserInfo';
import {
  NgbModal,
  ModalDismissReasons,
  NgbPanelChangeEvent,
  NgbCarouselConfig
} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements AfterViewInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  username: string;
  email: string;
  picture:string;
  accountSettingsModal:boolean = false;
  searchTerm:string='';

  public config: PerfectScrollbarConfigInterface = {};

  public showSearch = false;
  showMenu = '';
  showSubMenu = '';
  user: UserInfo;
  public sidebarnavItems: any[];
 
  constructor(private modalService: NgbModal, private authService: AuthService ,   public translate: TranslateService, private cdref: ChangeDetectorRef
    ) {

    
     }


     doSearch()
     {
      location.href="/#/peerpharm/search?search="+this.searchTerm;
     }
  ngOnInit() {
    ;
    this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);
    this.authService.userEventEmitter.subscribe(data => {
      
      this.user = this.authService.loggedInUser
    });

 
    if (!this.authService.loggedInUser) {
      this.authService.getLoggedInUser().subscribe(data => {
        if(data)
        {
        this.user = this.authService.loggedInUser;
        let newArr = [];
    
        this.authService.loggedInUser.modules.forEach(elm => {
        ;
          let tempArr = this.sidebarnavItems.filter(e => e.title == elm);
          if (tempArr.length > 0)
            newArr.push(tempArr[0]);
        });
        this.sidebarnavItems = newArr;
      }
        

      });
    }
    else {
      this.sidebarnavItems = [];
    }
 
  }

   // this is for the open close
   addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }
  // This is for Notifications
  notifications: Object[] = [
    {
      btn: 'btn-danger',
      icon: 'ti-link',
      title: 'Luanch Admin',
      subject: 'Just see the my new admin!',
      time: '9:30 AM'
    },
    {
      btn: 'btn-success',
      icon: 'ti-calendar',
      title: 'Event today',
      subject: 'Just a reminder that you have event',
      time: '9:10 AM'
    },
    {
      btn: 'btn-info',
      icon: 'ti-settings',
      title: 'Settings',
      subject: 'You can customize this template as you want',
      time: '9:08 AM'
    },
    {
      btn: 'btn-primary',
      icon: 'ti-user',
      title: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM'
    },
    {
      useravatar: 'assets/images/users/4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  ngAfterViewInit() {
    this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);
  }

  ngAfterContentChecked() {
  //  this.ngOnInit();
    if(!this.authService.loggedInUser)
    {
    this.authService.userEventEmitter.subscribe(user=>  
      {
        if(user.userName)
        {
        this.username = user.userName;
        this.email = user.userEmail;
        this.picture = user.picture;
        this.authService.loggedInUser=user;
        this.authService.isLoggedIn=true;
        }
      }); 
    }
    else{
      this.username = this.authService.loggedInUser.userName;
      this.email = this.authService.loggedInUser.userEmail;
      this.picture = this.authService.loggedInUser.picture;
    }
    this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);
    this.cdref.detectChanges();
  }
}
