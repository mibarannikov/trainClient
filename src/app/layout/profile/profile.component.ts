import {Component, OnInit} from '@angular/core';
import {Ticket} from "../../models/tiсket";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  ind: number;
  tickets: Ticket[];
  label: number = 0;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.getTickets();
  }

  getActTickets(): void {
    this.userService.getActualTickets().subscribe(
      data => {
        this.tickets = data;
        console.log(this.tickets);
      });

  }

  getTickets(): void {
    this.userService.getAllTickets().subscribe(data => {
      this.tickets = data;
      console.log(this.tickets);
    })
  }

  gg() {
    console.log('in', this.label);
    if (this.label == 0) {
      this.label = 1
      this.getActTickets();
    } else {
      this.label = 0
      this.getTickets();
    }
    console.log('out', this.label)
  }


}
