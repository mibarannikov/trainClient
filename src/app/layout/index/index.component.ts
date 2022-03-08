import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Train} from "../../models/train";
import {Passenger} from "../../models/passenger";
import {TrainService} from "../../service/train.service";
import {PassengerService} from "../../service/passenger.service";
import {NotificationService} from "../../service/notification.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {TrainInfoService} from "../../service/train-info.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {


  isTrainLoaded = false;
  trains!: Train[];
  isPassengerDataLoaded = false;
  passenger!: Passenger;
  requestTrain!: FormGroup;

  constructor(private trainService: TrainService,
              private notificationService: NotificationService,
              private fb: FormBuilder,
              private router: Router,
              private trId: TrainInfoService
  ) {

  }

  ngOnInit(): void {
this.createRequestTrainForm();
  }

  createRequestTrainForm(): FormGroup {
    return this.requestTrain = this.fb.group({
      startStation: ['Верхоломока', Validators.compose([Validators.required])],
      stopStation: ['Гвардейская', Validators.compose([Validators.required])],
      startDate: ['23.05.2022', Validators.compose([Validators.required])],
      stopDate: ['25.05.2022', Validators.compose([Validators.required])]
    });

  }

  buyTicket(trainId: any, trainIndex: number): void {
    this.trId.trainIdForByTicket = trainId;
    this.router.navigate(['ticket']);


  }

  getAllTrain(): void {
    this.trainService.getTrains('boston', 'wasington').subscribe(data => {
      console.log('index', data);
      this.trains = data;
      console.log('trains', this.trains)
    });
  }

  giveTrains() {
    this.isTrainLoaded = false;
    this.isPassengerDataLoaded = false;
    this.trainService.getTrains(this.requestTrain.value.startStation, this.requestTrain.value.stopStation)
      .subscribe(data => {
      console.log('data', data);
      this.trains = data;
      console.log('trains', this.trains)
      this.isTrainLoaded = true;
      this.isPassengerDataLoaded = true;

    });

  }

}
