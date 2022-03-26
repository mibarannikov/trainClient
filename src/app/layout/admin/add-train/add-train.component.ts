import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdminService} from "../../../service/admin.service";
import {Station} from "../../../models/station";
import {StationService} from "../../../service/station.service";
import {MatOptionSelectionChange} from "@angular/material/core";
import {Train} from "../../../models/train";
import {Router} from "@angular/router";
import {NotificationService} from "../../../service/notification.service";


@Component({
  selector: 'app-add-train',
  templateUrl: './add-train.component.html',
  styleUrls: ['./add-train.component.css']
})
export class AddTrainComponent implements OnInit {
  wagons: string[] = ['Плацкарт',
    'Купе',
    'Ресторан'];
  public addTrainForm: FormGroup;
  public stations: Station[];
  public stationsName: String[];
  public addArrivalStationName: String;
  public addArrivalTime: any;
  public date: Date;
  public train: Train;
  public emptyPoint: boolean;
  public setTrainNumberFlag: boolean;
  addDepartureTime: any;
  addWagonFlag: boolean = false;
  addWag: string;

  constructor(
    private fb: FormBuilder,
    public adminService: AdminService,
    public stationService: StationService,
    private router: Router,
    private notificationService: NotificationService
  ) {

  }

  ngOnInit(): void {
    this.addTrainForm = this.createAddTrainForm();
    this.setTrainNumberFlag = false;
    this.emptyPoint = true;
  }

  setNumber() {
    this.getStations();
    this.train = {
      trainNumber: this.addTrainForm.value.trainNumber,
      trainSpeed: this.addTrainForm.value.trainSpeed,
      wagons: [],
      sumSeats: 0,
      departureTime: '',
      arrivalTimeEnd: '',
      pointsOfSchedule: []
    }
    console.log('train установлен', this.train);
    this.setTrainNumberFlag = true;
  }

  createAddTrainForm(): FormGroup {
    return this.fb.group({
      trainNumber: [123, Validators.compose([Validators.required])],
      trainSpeed: [40, Validators.compose([Validators.required])]
      // sumSeats: [10, Validators.compose([Validators.required])]
    });
  }

  getStations(): void {
    this.stationService.getStations().subscribe(data => {
      this.stations = data;
      this.stationsName = [];
      for (let i = 0; i < this.stations.length; i++) {
        this.stationsName.push(this.stations[i].nameStation);
      }
    });
  }

  getCanGetStations(name: String): void {
    this.stationService.getStation(name).subscribe(data => {
      this.stationsName = data.canGetStation;
      for (let p of this.train.pointsOfSchedule) {
        if (this.stationsName.indexOf(p.nameStation) !== -1) {
          this.stationsName.splice(this.stationsName.indexOf(p.nameStation), 1);
        }
      }
    });

  }

  setArrivalStation(event: MatOptionSelectionChange<String>) {
    this.addArrivalStationName = event.source.value;
    if (this.train.pointsOfSchedule.length > 0) {
      let nameOld = this.train.pointsOfSchedule[this.train.pointsOfSchedule.length - 1].nameStation;
      let stationOld: Station;
      let stationNew: Station;
      this.stationService.getStation(nameOld).subscribe(data => {
        stationOld = data;
        this.stationService.getStation(event.source.value).subscribe(data => {
          stationNew = data;
          let dateOld = new Date(this.train.pointsOfSchedule[this.train.pointsOfSchedule.length - 1].arrivalTime);
          let distance = Math.sqrt((stationNew.latitude - stationOld.latitude) ** 2 + (stationNew.longitude - stationOld.longitude) ** 2) * 1000;
          let stNewLatRad = stationNew.latitude * 3.14 / 180;
          let stOldLatRad = stationOld.latitude * 3.14 / 180;
          let deltaLonRad = (stationNew.longitude - stationOld.longitude) * 3.14 / 180;
          let distReal = 2 * Math.asin(Math.sqrt(Math.sin((stNewLatRad - stOldLatRad) / 2) ** 2 + Math.cos(stOldLatRad) * Math.cos(stNewLatRad) * Math.sin(deltaLonRad / 2) ** 2));
          distReal = distReal * 6372795;
          console.log('real ', distReal);
          let v = this.train.trainSpeed * 0.2777;
          let time = distReal / v;
          console.log('date for next point', dateOld.setUTCSeconds(dateOld.getUTCSeconds() + time));
          console.log('date for next point', dateOld.setHours(dateOld.getHours() + 3));
          this.addArrivalTime = dateOld.toISOString().replace('Z', '');
          dateOld.setMinutes(dateOld.getMinutes() + 5);
          this.addDepartureTime = dateOld.toISOString().replace('Z', '');
          console.log(this.addArrivalTime);
          console.log(this.addDepartureTime);
        });
      });
    }
  }

  dateArrival(event: Event) {
    this.addArrivalTime = (<HTMLInputElement>event.target).value;
    console.log(this.addArrivalTime)
    this.date = new Date(this.addArrivalTime);
    console.log('getTime', this.date)


  }

  addSchedulePointButton() {
    if (this.train.pointsOfSchedule.length == 0) {
      this.train.departureTime = this.addArrivalTime;
    }

    if (this.addArrivalStationName != '') {
      this.train.pointsOfSchedule.push(
        {
          nameStation: this.addArrivalStationName,
          arrivalTime: this.addArrivalTime,
          departureTime: this.addDepartureTime
        });
      console.log('points', this.train.pointsOfSchedule);
      this.emptyPoint = false;
      console.log('name', this.addArrivalStationName)
      this.getCanGetStations(this.addArrivalStationName);
      this.addArrivalTime = '';
      this.addDepartureTime = '';
    }
  }

  createTrain() {
    console.log('creating train', this.train.pointsOfSchedule)
    if (this.train.pointsOfSchedule.length > 0) {
      this.train.arrivalTimeEnd = this.train.pointsOfSchedule[this.train.pointsOfSchedule.length - 1].arrivalTime;
      this.train.departureTime = this.train.pointsOfSchedule[0].arrivalTime;
    }
    this.adminService.addTrain(this.train).subscribe(data => {
      console.log('created train', data)
    }, error => {

      this.notificationService.showSnakBar("Поезд с номером " + this.train.trainNumber + " уже существует");
    });
    this.addTrainForm.reset();
    this.setTrainNumberFlag = false;
  }

  cancel() {
    this.setTrainNumberFlag = false;
    this.addTrainForm.reset();
    this.train.pointsOfSchedule = [];
    this.train.wagons=[];
    this.train.sumSeats=0;
  }


  dateDeparture(event: Event) {
    this.addDepartureTime = (<HTMLInputElement>event.target).value;
    console.log(this.addDepartureTime)
    this.date = new Date(this.addDepartureTime);
    console.log('getTime', this.date)

  }

  deleteWagon(i: number) {

    this.train.sumSeats-=this.train.wagons[i].sumSeats;
    this.train.wagons.splice(i, 1);

  }

  addWagon() {
    this.addWagonFlag = !this.addWagonFlag;

  }

  onInputAddWagon(event: MatOptionSelectionChange) {
    this.addWag = event.source.value;
  }

  addWagonToTrain() {
    console.log(this.addWag);
    if (!!this.addWag) {
      if (this.addWag != '') {
        let sumSeat: number = 0;
        let type: string = '';
        switch (this.addWag) {
          case 'Купе': {
            sumSeat = 36;
            type = 'coupe';
            break;
          }
          case 'Плацкарт': {
            sumSeat = 54;
            type = 'platzkarte';
            break;
          }
          case 'Ресторан': {
            sumSeat = 0;
            type = 'restaurant';
            break;
          }
        }

        this.train.wagons.push({wagonNumber:this.train.wagons.length+1,
          type: type,
          name: this.addWag,
          sumSeats: sumSeat,
          trainNumber:this.train.trainNumber});
        this.train.sumSeats+=sumSeat;
      }
    }
    console.log(this.train)
    this.addWagonFlag = !this.addWagonFlag;
    this.addWag = '';
  }
}
