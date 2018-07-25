import { OrdersComponent } from './allorders/orders/orders.component';
import { PeerPharmModule } from './peerpharmmodule';
import { Routes } from '@angular/router';

 

export const PeerPharmRputs: Routes =[
  {
    path: 'allorders/orders',
    data: {
      title: 'open orders' 
    },
    component: OrdersComponent
  }
];