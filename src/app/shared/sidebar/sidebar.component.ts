import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ROUTES } from './menu-items';
import { RouteInfo } from './sidebar.metadata';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { UserInfo } from '../../peerpharm/taskboard/models/UserInfo';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']

})
export class SidebarComponent implements OnInit {
  showMenu = '';
  showSubMenu = '';
  user: UserInfo;
  public sidebarnavItems: any[];
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

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'he']);
    translate.setDefaultLang('he'); 
    translate.use('he');
   }

  // End open close
  ngOnInit() {
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
}
