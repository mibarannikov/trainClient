import { Component, OnInit } from '@angular/core';
import {Ticket} from "../../models/tiсket";
import {TicketService} from "../../service/ticket.service";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  tickets: Ticket[];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getTickets();
  }

  getTickets():void{
    this.userService.getTickets().subscribe(data=>{
      this.tickets = data;
      console.log(this.tickets)
    })
  }
}
