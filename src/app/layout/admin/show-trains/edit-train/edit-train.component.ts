import {Component, OnInit} from '@angular/core';
import {Train} from "../../../../models/train";
import {TrainInfoService} from "../../../../service/train-info.service";
import {TrainService} from "../../../../service/train.service";
import {AdminService} from "../../../../service/admin.service";

@Component({
  selector: 'app-edit-train',
  templateUrl: './edit-train.component.html',
  styleUrls: ['./edit-train.component.css']
})
export class EditTrainComponent implements OnInit {

   editeTrain: Train
     //= {
  //   arrivalTimeEnd: "",
  //   departureTime: "",
  //   pointsOfSchedule: [],
  //   sumSeats: 0,
  //   trainNumber: undefined,
  //   trainSpeed: 0,
  //   wagons: []
  // };
  editToggle: boolean[]=[];

  constructor(public trainInfoService: TrainInfoService,
              private adminService: AdminService) {
  }

  ngOnInit(): void {
    this.adminService.findTrain(this.trainInfoService.trainForEdite.trainNumber).subscribe(data=>{
      this.editeTrain = data;
    });
    for (let i=0; i< this.trainInfoService.trainForEdite.pointsOfSchedule.length; i++) {
      this.editToggle.push(true);
    }
  }

  savePoint(i:number) {
    this.adminService.updateTrain(this.editeTrain).subscribe(data=>{
      this.editeTrain = data;
    });
    console.log(this.editeTrain.pointsOfSchedule);
    this.editToggle[i]=!this.editToggle[i];
  }

  dateArrival(event: Event, i: number) {
    this.editeTrain.pointsOfSchedule[i].arrivalTime = (<HTMLInputElement>event.target).value;
  }

  dateDeparture(event: Event, i:number) {
    this.editeTrain.pointsOfSchedule[i].departureTime = (<HTMLInputElement>event.target).value;

  }

  setSchedule(i:number) {
    this.editeTrain.pointsOfSchedule[i].delayed='schedule';
  }

  setDelay(i: number) {
    this.editeTrain.pointsOfSchedule[i].delayed='running_with_errors';
  }

  setCancel(i: number) {
    this.editeTrain.pointsOfSchedule[i].delayed = 'cancel';
  }

  save() {

  }

  cancel() {
    this.adminService.rollBackTrain(this.trainInfoService.trainForEdite).subscribe(data=>{
      this.editeTrain=data;
    });


  }

  cancelEdit(i: number) {
    this.adminService.findTrain(this.trainInfoService.trainForEdite.trainNumber).subscribe(data=>{
      this.editeTrain.pointsOfSchedule[i] = data.pointsOfSchedule[i];
    })

    this.editToggle[i]=!this.editToggle[i];
  }

  editPoint(i: number) {
    this.editToggle[i]=!this.editToggle[i];
  }
}
