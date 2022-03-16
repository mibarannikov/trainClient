import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdminService} from "../../../service/admin.service";
import {Station} from "../../../models/station";
import {StationService} from "../../../service/station.service";
import {MatOptionSelectionChange} from "@angular/material/core";
import {Train} from "../../../models/train";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-train',
  templateUrl: './add-train.component.html',
  styleUrls: ['./add-train.component.css']
})
export class AddTrainComponent implements OnInit {

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

  constructor(
    private fb: FormBuilder,
    public adminService: AdminService,
    public stationService: StationService,
    private router: Router
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
      sumSeats: this.addTrainForm.value.sumSeats,
      departureTime: '2022-02-03T08:00:00.001',
      pointsOfSchedule: []
    }
    console.log('train установлен',this.train);
    this.setTrainNumberFlag = true;
  }

  createAddTrainForm(): FormGroup {
    return this.fb.group({
      trainNumber: [123, Validators.compose([Validators.required])],
      trainSpeed: [40, Validators.compose([Validators.required])],
      sumSeats: [10, Validators.compose([Validators.required])]
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
      for(let p of this.train.pointsOfSchedule)
      {
        if ( this.stationsName.indexOf(p.nameStation)!== -1) {
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
          let v = this.train.trainSpeed * 0.2777;
          let time = distance / v;
          console.log('date for next point', dateOld.setUTCSeconds(dateOld.getUTCSeconds() + time));
          console.log('date for next point', dateOld.setHours(dateOld.getHours() + 3));
          this.addArrivalTime = dateOld.toISOString().replace('Z', '');
          dateOld.setMinutes(dateOld.getMinutes()+5);
          this.addDepartureTime= dateOld.toISOString().replace('Z','');
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
    if (this.train.pointsOfSchedule.length == 0){
      this.train.departureTime=this.addArrivalTime;
    }

    if (this.addArrivalStationName != '') {
      this.train.pointsOfSchedule.push(
        {nameStation: this.addArrivalStationName, arrivalTime: this.addArrivalTime, departureTime:this.addDepartureTime});
      console.log('points', this.train.pointsOfSchedule);
      this.emptyPoint = false;
      console.log('name', this.addArrivalStationName)
      this.getCanGetStations(this.addArrivalStationName);
      this.addArrivalTime='';
      this.addDepartureTime='';
    }
  }

  createTrain() {
    console.log('creating train', this.train.pointsOfSchedule)
    this.adminService.addTrain(this.train).subscribe(data => {
      console.log('created train', data)
    });
    this.addTrainForm.reset();
    this.setTrainNumberFlag = false;
  }

  cancel() {
    this.setTrainNumberFlag = false;
    this.addTrainForm.reset();
    this.train.pointsOfSchedule = [];
  }


  dateDeparture(event: Event) {
    this.addDepartureTime = (<HTMLInputElement>event.target).value;
    console.log(this.addDepartureTime)
    this.date = new Date(this.addDepartureTime);
    console.log('getTime', this.date)

  }
}
