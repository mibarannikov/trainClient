import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {AdminService} from "../../../service/admin.service";
import {Train} from "../../../models/train";
import {MatOptionSelectionChange} from "@angular/material/core";
import {Ticket} from "../../../models/tiсket";

@Component({
  selector: 'app-show-passengers',
  templateUrl: './show-passengers.component.html',
  styleUrls: ['./show-passengers.component.css']
})
export class ShowPassengersComponent implements OnInit {

  myControl = new FormControl('', Validators.required);
  options: Train[] = [];
  train: any | Train;
  filteredOptions: Observable<string[]>;
  tickets: Ticket[];

  constructor(private adminService: AdminService) {
  }

  ngOnInit(): void {
    this.adminService.getAllTrains().subscribe(data => {
      this.options = data;
    });
  }

  getTrain(event: MatOptionSelectionChange<any>) {
    //let Number: number = event.source.value;
//    console.log('пришло',event.source.value)
//    let tr = this.options.find(train =>
//      train.trainNumber == event.source.value
//    );
//    console.log('fiind',tr)
//    if (tr) {
//      this.train = tr;
//      console.log(this.train)
//
//    }
//    console.log('trainNumber',this.train.trainNumber)
//    this.adminService.getRegTickets(this.train.trainNumber).subscribe(data => {
//      this.tickets = data
//    })
  }

  giveTickets() {
    let tr = this.options.find(train =>
      train.trainNumber == this.myControl.value
    );
    console.log('fiind',tr)
    if (tr) {
      this.train = tr;
      console.log(this.train)

    }

    this.adminService.getRegTickets(this.myControl.value).subscribe(data => {
      this.tickets = data
    })
  }
}
