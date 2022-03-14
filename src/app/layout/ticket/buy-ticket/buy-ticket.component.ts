import {Component, OnInit} from '@angular/core';
import {TrainInfoService} from "../../../service/train-info.service";
import {Train} from "../../../models/train";
import {TrainService} from "../../../service/train.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TicketService} from "../../../service/ticket.service";
import {Seat} from "../../../models/seat";
import {PointOfSchedule} from "../../../models/pointOfSchedule";


@Component({
  selector: 'app-buy-ticket',
  templateUrl: './buy-ticket.component.html',
  styleUrls: ['./buy-ticket.component.css']
})
export class BuyTicketComponent implements OnInit {

  changeSeat: number;
  seats: Seat[] = [];
  train!: Train;
  buyTicket!: FormGroup;
  ticketPoints: PointOfSchedule[] = [];

  constructor(private trainService: TrainService,
              private fb: FormBuilder,
              public trainInfo: TrainInfoService,
              private ticketService: TicketService) {
    console.log('constructor')
    console.log(trainInfo)
  }

  ngOnInit(): void {
    console.log('train', this.trainInfo.trainForTicket)
    if (this.trainInfo.trainForTicket) {
      let start = this.trainInfo.trainForTicket.pointsOfSchedule.find(p => p.nameStation == this.trainInfo.startForTicket);
      let end = this.trainInfo.trainForTicket.pointsOfSchedule.find(p => p.nameStation == this.trainInfo.endForTicket);
      for (let trPoint of this.trainInfo.trainForTicket.pointsOfSchedule) {
        // @ts-ignore
        if ((trPoint.arrivalTime >= start.arrivalTime) && (trPoint.arrivalTime <= end.arrivalTime)) {
          this.ticketPoints.push(trPoint);
        }
      }
      this.buyTicket = this.fb.group({
        firstname: ['', Validators.compose([Validators.required])],
        lastname: ['', Validators.compose([Validators.required])],
        dateOfBirth: ['', Validators.compose([Validators.required])]
        //change:[, Validators.compose([Validators.required])]
      });
      this.ticketService.getEmptySeatsTrain(this.trainInfo.trainForTicket.trainNumber,
        this.trainInfo.startForTicket,
        this.trainInfo.endForTicket).subscribe(data => {
        this.seats = data;
      });
    }
  }


  b() {
    console.log({
      seatNumber: this.changeSeat,
      firstnamePassenger: this.buyTicket.value.firstname,
      lastnamePassenger: this.buyTicket.value.lastname,
      dateOfBirth: (<Date>this.buyTicket.value.dateOfBirth).toString(),
      numberTrainOwner: this.trainInfo.trainForTicket.trainNumber,
      nameStations: this.ticketPoints
    });
    this.ticketService.getEmptySeatsTrain(this.trainInfo.trainForTicket.trainNumber,
      this.trainInfo.startForTicket,
      this.trainInfo.endForTicket).subscribe(data => {
      this.seats = data;
    });
    this.buyTicket.reset();

  }

  buyingTicket() {
    this.ticketService.buyTicket({
        seatNumber: this.changeSeat,
        firstnamePassenger: this.buyTicket.value.firstname,
        lastnamePassenger: this.buyTicket.value.lastname,
        dateOfBirth: this.buyTicket.value.dateOfBirth,
        numberTrainOwner: this.trainInfo.trainForTicket.trainNumber,
        nameStations: this.ticketPoints
      }
    ).subscribe(data => {
      console.log(data)
      this.ticketService.getEmptySeatsTrain(this.trainInfo.trainForTicket.trainNumber,
        this.trainInfo.startForTicket,
        this.trainInfo.endForTicket).subscribe(data => {
        console.log('befor', this.seats)
        this.seats = data;
        console.log('data', data)
        console.log('after', this.seats)
      });


    });

    this.buyTicket.reset();
  }
}
