import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {AdminService} from "../../../service/admin.service";
import {Train} from "../../../models/train";
import {MatOptionSelectionChange} from "@angular/material/core";
import {Ticket} from "../../../models/tiсket";
import {TrainInfoService} from "../../../service/train-info.service";

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
  ticketsAll: Ticket[];
  ticketsReg: Ticket[];

  label: number = 0;

  constructor(private adminService: AdminService,
              private trainInfoService:TrainInfoService) {
  }

  ngOnInit(): void {
    this.adminService.getAllActTrains().subscribe(data => {
      this.options = data;
    });
    if (this.trainInfoService.trainForShowPassenger){
      this.myControl.setValue(this.trainInfoService.trainForShowPassenger.trainNumber);
      this.giveTickets();
    }
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
    this.adminService.getAllActTrains().subscribe(data => {
      this.options = data;
      let tr = this.options.find(train =>
        train.trainNumber == this.myControl.value
      );
      if (tr) {
        this.train = tr;
      }
    });
    this.adminService.getRegTickets(this.myControl.value).subscribe(data => {
      this.ticketsReg = data
    });
    this.adminService.getAllTickets(this.myControl.value).subscribe(data=>{
      this.ticketsAll = data;
      console.log(data)
    });
  }

  gg() {
    if (this.label == 1) {
      this.label = 0;
      this.adminService.getRegTickets(this.myControl.value).subscribe(data => {
        this.ticketsReg = data});
    } else {
      this.adminService.getAllTickets(this.myControl.value).subscribe(data=>{
        this.ticketsAll = data;
        console.log(data)
      })
      this.label = 1;
    }
  }
}
