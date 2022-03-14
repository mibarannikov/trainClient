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
  public st: Station[];
  public stations: String[];
  public addArrivalStation: String;
  public addArrivalTime: any;
  public date: Date;
  public train: Train;
  public emptyPoint: boolean;
  public setTrainNumberFlag: boolean;

  constructor(
    private fb: FormBuilder,
    public adminService: AdminService,
    public stationService: StationService,
    private router: Router
  ) {

  }

  ngOnInit()
    :
    void {
    this.addTrainForm = this.createAddTrainForm();

    this.setTrainNumberFlag = false;
    this.emptyPoint = true;
  }

  createAddTrainForm()
    :
    FormGroup {
    return this.fb.group({
      trainNumber: [123, Validators.compose([Validators.required])],
      trainSpeed: [40, Validators.compose([Validators.required])],
      sumSeats: [10, Validators.compose([Validators.required])]

    });

  }

  getStations()
    :
    void {
    this.stationService.getStations().subscribe(data => {
      this.st = data;
      this.stations = [];
      for (let i = 0; i < this.st.length; i++) {
        this.stations.push(this.st[i].nameStation);
      }
    });
  }

  getCanGetStation(name: String):
    void {
    this.stationService.getStation(name).subscribe(data => {
      console.log('data', data);
      this.stations = data.canGetStation;
      console.log('массив', this.stations);
    });

  }

  setArrivalStation(event: MatOptionSelectionChange<String>) {

    //console.log('event', event);
    //this.addArrivalStation = '';
    //console.log('value', event.source.value)
    this.addArrivalStation = event.source.value;
    if (this.train.pointsOfSchedule.length > 0) {
      let pointOld = this.train.pointsOfSchedule[this.train.pointsOfSchedule.length - 1].nameStation;
      let pointNew = this.addArrivalStation;
      this.stationService.getStation(pointOld).subscribe(data => {

        pointOld = data;
       // console.log('o',pointOld);
      });
      this.stationService.getStation(pointNew).subscribe(data => {

        pointNew = data;
      //  console.log('n',pointNew)
      });
     // console.log('Old',pointOld);
    //  console.log('New',pointNew);
    }
    //console.log(this.addArrivalStation);
  }

  addSchedulePointButton() {
    if (this.addArrivalStation != '') {
      this.train.pointsOfSchedule.push(
        {nameStation: this.addArrivalStation, arrivalTime: this.addArrivalTime+':00.001'});
      console.log('points',this.train.pointsOfSchedule);
      this.emptyPoint = false;
      console.log('name', this.addArrivalStation)
      this.getCanGetStation(this.addArrivalStation);
    }

  }

  dateArrival(event: Event) {
    this.addArrivalTime = (<HTMLInputElement>event.target).value;
    this.date = new Date(this.addArrivalTime);
    console.log(this.date.getTime())
  }

  setNumber() {
    this.getStations();
    this.train = {
      trainNumber: this.addTrainForm.value.trainNumber,
      trainSpeed: this.addTrainForm.value.trainSpeed,
      sumSeats: this.addTrainForm.value.sumSeats,
      departureTime: '2022-02-03T08:00:00.000',
      pointsOfSchedule: []
    }
    console.log(this.train);
    this.setTrainNumberFlag = true;

  }

  createTrain() {
    console.log('creating train',this.train.pointsOfSchedule)
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
}
