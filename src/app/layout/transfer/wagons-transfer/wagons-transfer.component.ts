import {Component, OnInit} from '@angular/core';
import {TrainInfoService} from "../../../service/train-info.service";
import {TicketService} from "../../../service/ticket.service";
import {Wagon} from "../../../models/wagon";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PointOfSchedule} from "../../../models/pointOfSchedule";
import {Seat} from "../../../models/seat";
import {NotificationService} from "../../../service/notification.service";
import {Ticket} from "../../../models/tiсket";

@Component({
  selector: 'app-wagons-transfer',
  templateUrl: './wagons-transfer.component.html',
  styleUrls: ['./wagons-transfer.component.css']
})
export class WagonsTransferComponent implements OnInit {
  allWagonLoadedFirst: number = 0;
  allWagonLoadedSecond: number = 0;

  changeSeatFirst: any;
  changeSeatSecond: any;

  priceFirst:any;
  priceSecond:any;

  seatsFirst:Seat[];
  seatsSecond:Seat[];

  firstToggle: boolean = true;
  secondToggle: boolean = true;

  buyTicketFirst!: FormGroup;
  ticketPointsFirst: PointOfSchedule[] = [];
  buyTicketSecond!: FormGroup;
  ticketPointsSecond: PointOfSchedule[] = [];

  isLoadedFirst:boolean;
  isLoadedSecond:boolean;

  constructor(
    public trainInfo: TrainInfoService,
    private ticketService: TicketService,
    private fb: FormBuilder,
    private notificationService:NotificationService
  ) {
  }


  ngOnInit(): void {
    if (this.trainInfo.transferForBuyTicket) {
      for (let w of this.trainInfo.transferForBuyTicket.firstTrain.wagons) {
        this.ticketService.getEmptySeatsTrain(this.trainInfo.transferForBuyTicket.firstTrain.trainNumber,
          w.wagonNumber,
          this.trainInfo.startForTicket,
          this.trainInfo.transferForBuyTicket.stationTransfer.nameStation).subscribe(data => {
          w.emptySeats = data.length;
          this.allWagonLoadedFirst++;
        });
      }
      for (let w of this.trainInfo.transferForBuyTicket.secondTrain.wagons) {
        this.ticketService.getEmptySeatsTrain(this.trainInfo.transferForBuyTicket.secondTrain.trainNumber,
          w.wagonNumber,
          this.trainInfo.transferForBuyTicket.stationTransfer.nameStation,
          this.trainInfo.endForTicket).subscribe(data => {
          w.emptySeats = data.length;
          this.allWagonLoadedSecond++;
        });
      }
    }


  }

  wagonSelectionFirst(wagon: Wagon, i: number) {
    this.isLoadedFirst=false;
    this.trainInfo.transferForBuyTicket.wagonFirst = wagon.wagonNumber;
    console.log(this.trainInfo.transferForBuyTicket);
    this.firstToggle = false;
    // let start = this.trainInfo.transferForBuyTicket.firstTrain.pointsOfSchedule.find(p => p.nameStation == this.trainInfo.startForTicket);
    // let end = this.trainInfo.transferForBuyTicket.firstTrain.pointsOfSchedule.find(p => p.nameStation == this.trainInfo.endForTicket);
    // // @ts-ignore
    // this.ticketPointsFirst = this.trainInfo.transferForBuyTicket.firstTrain.pointsOfSchedule.filter(p=>(p.arrivalTime>=start.arrivalTime)&&(p.arrivalTime<=end.arrivalTime));
    this. buyTicketFirst = this.fb.group({
      firstnameF: ['', Validators.compose([Validators.required])],
      lastnameF: ['', Validators.compose([Validators.required])],
      dateOfBirthF: ['', Validators.compose([Validators.required])]
      //change:[, Validators.compose([Validators.required])]
    });
    this.ticketService.getEmptySeatsTrain(this.trainInfo.transferForBuyTicket.firstTrain.trainNumber,
      this.trainInfo.transferForBuyTicket.wagonFirst,
      this.trainInfo.startForTicket,
      this.trainInfo.transferForBuyTicket.stationTransfer.nameStation).subscribe(data => {
      console.log(data)
        this.seatsFirst = data;
      this.ticketService.priceCalculation(this.trainInfo.transferForBuyTicket.firstTrain.trainNumber,
        this.trainInfo.transferForBuyTicket.wagonFirst,
        this.trainInfo.startForTicket,
        this.trainInfo.transferForBuyTicket.stationTransfer.nameStation).subscribe(data=>{
          console.log('--------------------',data)
          this.priceFirst =data;
          console.log(this.priceFirst);
        }
      );
      this.isLoadedFirst =true
    });

  }

  wagonSelectionSecond(wagon: Wagon, i: number) {
    console.log('sffffffffffffff', wagon)
    this.isLoadedSecond=false;
    this.trainInfo.transferForBuyTicket.wagonSecond = wagon.wagonNumber;
    console.log(this.trainInfo.transferForBuyTicket);
    this.secondToggle = false;
    // let start = this.trainInfo.transferForBuyTicket.firstTrain.pointsOfSchedule.find(p => p.nameStation == this.trainInfo.startForTicket);
    // let end = this.trainInfo.transferForBuyTicket.firstTrain.pointsOfSchedule.find(p => p.nameStation == this.trainInfo.endForTicket);
    // // @ts-ignore
    // this.ticketPointsFirst = this.trainInfo.transferForBuyTicket.firstTrain.pointsOfSchedule.filter(p=>(p.arrivalTime>=start.arrivalTime)&&(p.arrivalTime<=end.arrivalTime));
    this. buyTicketSecond = this.fb.group({
      firstnameS: ['', Validators.compose([Validators.required])],
      lastnameS: ['', Validators.compose([Validators.required])],
      dateOfBirthS: ['', Validators.compose([Validators.required])]
      //change:[, Validators.compose([Validators.required])]
    });
    this.ticketService.getEmptySeatsTrain(this.trainInfo.transferForBuyTicket.secondTrain.trainNumber,
      this.trainInfo.transferForBuyTicket.wagonSecond,
      this.trainInfo.transferForBuyTicket.stationTransfer.nameStation,
      this.trainInfo.endForTicket).subscribe(data => {
      console.log(data)
      this.seatsSecond = data;
      this.ticketService.priceCalculation(this.trainInfo.transferForBuyTicket.secondTrain.trainNumber,
        this.trainInfo.transferForBuyTicket.wagonSecond,
        this.trainInfo.transferForBuyTicket.stationTransfer.nameStation,
        this.trainInfo.endForTicket).subscribe(data=>{
          console.log('--------------------',data)
          this.priceSecond=data;
          console.log(this.priceSecond);
        }
      );
      this.isLoadedSecond =true
    });

  }

  cancel() {
    this.firstToggle = true;
  }

  cancelSecond() {
    this.secondToggle = true;
  }

  buyingTicket() {
    let d = new Date(this.buyTicketFirst.value.dateOfBirthF)
    d.setHours(d.getHours() + 3)
    this.ticketService.buyTicket({
        wagonNumber: this.trainInfo.transferForBuyTicket.wagonFirst,
        seatNumber: this.changeSeatFirst,
        firstnamePassenger: this.buyTicketFirst.value.firstnameF.trim(),
        lastnamePassenger: this.buyTicketFirst.value.lastnameF.trim(),
        dateOfBirth: d,
        numberTrainOwner: this.trainInfo.transferForBuyTicket.firstTrain.trainNumber,
        nameStations: this.ticketPointsFirst
      }
    ).subscribe(data => {
      console.log(data)
      let tik:Ticket = data;
      if (tik.id == 0) {
        this.notificationService.showSnakBar('Пассажир уже зарегистрирован');
      }
      if (tik.nameStations[0].nameStation == 'station whose name is oblivion') {
        this.notificationService.showSnakBar('посадка на поезд окончена');
      }
      this.ticketService.getEmptySeatsTrain(this.trainInfo.transferForBuyTicket.firstTrain.trainNumber,
        this.trainInfo.transferForBuyTicket.wagonFirst,
        this.trainInfo.startForTicket,
        this.trainInfo.transferForBuyTicket.stationTransfer.nameStation).subscribe(data => {
        this.seatsFirst = data;
      });
    });
    this.changeSeatFirst = '';
    this.buyTicketFirst.reset();

    let dS = new Date(this.buyTicketSecond.value.dateOfBirthS)
    dS.setHours(d.getHours() + 3)
    this.ticketService.buyTicket({
        wagonNumber: this.trainInfo.transferForBuyTicket.wagonSecond,
        seatNumber: this.changeSeatSecond,
        firstnamePassenger: this.buyTicketFirst.value.firstnameS.trim(),
        lastnamePassenger: this.buyTicketFirst.value.lastnameS.trim(),
        dateOfBirth: dS,
        numberTrainOwner: this.trainInfo.transferForBuyTicket.secondTrain.trainNumber,
        nameStations: this.ticketPointsSecond
      }
    ).subscribe(data => {
      console.log(data)
      let tik:Ticket = data;
      if (tik.id == 0) {
        this.notificationService.showSnakBar('Пассажир уже зарегистрирован');
      }
      if (tik.nameStations[0].nameStation == 'station whose name is oblivion') {
        this.notificationService.showSnakBar('посадка на поезд окончена');
      }
      this.ticketService.getEmptySeatsTrain(this.trainInfo.transferForBuyTicket.secondTrain.trainNumber,
        this.trainInfo.transferForBuyTicket.wagonSecond,
        this.trainInfo.transferForBuyTicket.stationTransfer.nameStation,
        this.trainInfo.endForTicket).subscribe(data => {
        this.seatsSecond = data;
      });
    });
    this.changeSeatSecond = '';
    this.buyTicketSecond.reset();




  }


}
