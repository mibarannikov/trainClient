import {Component, OnInit} from '@angular/core';
import {TrainInfoService} from "../../../service/train-info.service";
import {Train} from "../../../models/train";
import {TrainService} from "../../../service/train.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TicketService} from "../../../service/ticket.service";
import {Seat} from "../../../models/seat";
import {PointOfSchedule} from "../../../models/pointOfSchedule";
import {NotificationService} from "../../../service/notification.service";
import {Ticket} from "../../../models/tiсket";


@Component({
  selector: 'app-buy-ticket',
  templateUrl: './buy-ticket.component.html',
  styleUrls: ['./buy-ticket.component.css']
})
export class BuyTicketComponent implements OnInit {

  changeSeat: any;
  tik: Ticket;
  seats: Seat[] = [];
  train!: Train;
  buyTicket!: FormGroup;
  ticketPoints: PointOfSchedule[] = [];
  price:any;

  constructor(private trainService: TrainService,
              private fb: FormBuilder,
              public trainInfo: TrainInfoService,
              private ticketService: TicketService,
              private notificationService: NotificationService) {
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
        this.trainInfo.wagonNumberForByTicket,
        this.trainInfo.startForTicket,
        this.trainInfo.endForTicket).subscribe(data => {
        this.seats = data;

      });
      this.ticketService.priceCalculation(this.trainInfo.trainForTicket.trainNumber,
        this.trainInfo.wagonNumberForByTicket,
        this.trainInfo.startForTicket,
        this.trainInfo.endForTicket).subscribe(data=>{
          console.log('--------------------',data)
          this.price =data;
          console.log(this.price);
        }
      );


    }
  }

  buyingTicket() {
    let d = new Date(this.buyTicket.value.dateOfBirth)
    d.setHours(d.getHours() + 3)
    this.ticketService.buyTicket({
        wagonNumber: this.trainInfo.wagonNumberForByTicket,
        seatNumber: this.changeSeat,
        firstnamePassenger: this.buyTicket.value.firstname.trim(),
        lastnamePassenger: this.buyTicket.value.lastname.trim(),
        dateOfBirth: d,
        numberTrainOwner: this.trainInfo.trainForTicket.trainNumber,
        nameStations: this.ticketPoints
      }
    ).subscribe(data => {
      console.log(data)
      this.tik = data;
      if (this.tik.id == 0) {
        this.notificationService.showSnakBar('Пассажир уже зарегистрирован');
      }
      if (this.tik.nameStations[0].nameStation == 'station whose name is oblivion') {
        this.notificationService.showSnakBar('посадка на поезд окончена');
      }
      this.ticketService.getEmptySeatsTrain(this.trainInfo.trainForTicket.trainNumber,
        this.trainInfo.wagonNumberForByTicket,
        this.trainInfo.startForTicket,
        this.trainInfo.endForTicket).subscribe(data => {
        this.seats = data;
      });
    });
    this.changeSeat = '';
    this.buyTicket.reset();
  }
}
