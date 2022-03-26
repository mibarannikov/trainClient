import {Component, OnInit} from '@angular/core';
import {Train} from "../../models/train";
import {Passenger} from "../../models/passenger";
import {TrainService} from "../../service/train.service";
import {NotificationService} from "../../service/notification.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {TrainInfoService} from "../../service/train-info.service";
import {Observable} from "rxjs";
import {StationService} from "../../service/station.service";
import {PointOfSchedule} from "../../models/pointOfSchedule";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  searchString: string = '';
  myControl2 = new FormControl('', Validators.required);
  myControl = new FormControl('', Validators.required);
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  myControl1 = new FormControl('', Validators.required);
  options1: string[] = [];
  filteredOptions1: Observable<string[]>;
  dateStartControl = new FormControl('', Validators.required)
  dateEndControl = new FormControl('', Validators.required)
  options2: string[] = [];

  st: string;
  public arrdep: [{ arr: string | undefined, dep: string | undefined, status: string }];
  nam: string = '';
  label: number = 0;
  isLoaded: boolean = false;
  start: string;
  end: string;
  isTrainLoaded = false;
  trains!: Train[];
  trainsForSchedule: Train[];
  isPassengerDataLoaded = false;
  passenger!: Passenger;
  requestTrain!: FormGroup;

  constructor(private trainService: TrainService,
              private notificationService: NotificationService,
              private fb: FormBuilder,
              private router: Router,
              public trainInfoService: TrainInfoService,
              private stationService: StationService
  ) {

  }

  ngOnInit(): void {
    this.createRequestTrainForm();
    this.stationService.getStations().subscribe(data => {
      for (var s of data) {
        this.options1.push(s.nameStation);
        this.options.push(s.nameStation);
        this.options2.push(s.nameStation);
      }
    });
    let dt = new Date()
    dt.setHours(dt.getHours() + 3);
    this.dateStartControl.setValue(dt.toISOString().replace('Z', '').split('.')[0]);
    dt.setMonth(dt.getMonth() + 1);
    this.dateEndControl.setValue(dt.toISOString().replace('Z', '').split('.')[0])
    // this.myControl.value.setValue(this.trainInfoService.startForTicket);
    //this.myControl1.value.setValue(this.trainInfoService.endForTicket);

    //this.filteredOptions = this.myControl.valueChanges.pipe(
    //  startWith(''), map(value => this._filter(value)),);
    // this.filteredOptions1 = this.myControl1.valueChanges.pipe(
    //  startWith(''), map(value => this._filter1(value)),);
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.options.filter(option => option.toLowerCase().includes(filterValue));
  // }

  // private _filter1(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //  console.log(this.options1)
  //   console.log(this.options1.filter(option => option.toLowerCase().includes(filterValue)))

  //   return this.options1.filter(option => option.toLowerCase().includes(filterValue));
  // }

  createRequestTrainForm(): FormGroup {
    return this.requestTrain = this.fb.group({
      startStation: [, Validators.compose([Validators.required])],
      stopStation: [, Validators.compose([Validators.required])],
      startDate: [, Validators.compose([Validators.required])],
      stopDate: [, Validators.compose([Validators.required])]
    });
  }

  buyTicket(trainId: any, trainIndex: number): void {
    this.trainInfoService.trainForTicket = this.trains[trainIndex]
    this.trainInfoService.startForTicket = this.start;
    this.trainInfoService.endForTicket = this.end;
    console.log('start', this.trainInfoService.startForTicket);
    console.log('end', this.trainInfoService.endForTicket);
    console.log('train', this.trainInfoService.trainForTicket);
    this.trainInfoService.trainIdForByTicket = trainId;
    this.router.navigate(['wagons']);
  }


  giveTrains() {
    this.start = this.myControl.value
    this.end = this.myControl1.value
    this.trainService.searchTrains(this.myControl.value, this.myControl1.value, this.dateStartControl.value, this.dateEndControl.value)
      .subscribe(data => {
        this.trains = data;
        console.log(data);
        // for (let t of this.trains) {
        //   console.log('befor', t.pointsOfSchedule);
        //   t.pointsOfSchedule.sort((a, b) => a.arrivalTime > b.arrivalTime ? 1 : -1);
        //   console.log('after', t.pointsOfSchedule);
        // }
      })
  }

  gg() {
    this.st = this.myControl2.value;
    console.log('in', this.label);
    if (this.label == 1) {
      this.label = 0;
    } else {
      console.log('in');
      this.label = 1;
      if (this.myControl2.value) {
        this.getTrainsForSchedule();
      }
    }
  }

  private getTrainsForSchedule() {

    this.isLoaded = false;
    // @ts-ignore
    this.arrdep = [];
    this.stationService.getTrainsForSchedule(this.myControl2.value).subscribe(data => {
      this.trainsForSchedule = data;
      if (this.trainsForSchedule) {
        for (let tr of this.trainsForSchedule) {
          let arrPoint: PointOfSchedule | undefined = tr.pointsOfSchedule.find(p => p.nameStation === this.myControl2.value);
          // @ts-ignore
          let status

          switch (arrPoint?.delayed) {
            case 0: {
              if ((new Date(arrPoint.arrivalTime) < new Date()) && (new Date(arrPoint.departureTime) > new Date())) {
                status = 'Прибыл';
              } else {
                status = 'Ожидается прибытие';
              }
              break;
            }
            case 1: {
              if ((new Date(arrPoint.arrivalTime) < new Date()) && (new Date(arrPoint.departureTime) > new Date())) {
                status = 'Прибыл';
              } else {
                status = 'Задерживается';
              }
              break;
            }
            case 3: {
              status = 'Отменен';
              break;
            }
            default: {
              status = "нет информации";
              break;
            }
          }

          // @ts-ignore
          this.arrdep.push({arr: arrPoint.arrivalTime, dep: arrPoint.departureTime, status: status})
        }
      }
      this.isLoaded = true;
    })

  }

  getSchedule() {
    this.st = this.myControl2.value;
    this.getTrainsForSchedule();
  }

  onInputStart(event: any) {
    this.stationService.getSearchStations(event.target.value).subscribe(data => {
      this.options = [];
      for (let s of data) {
        this.options.push(s.nameStation);
      }
    })
  }

  onInputEnd(event: any) {
    this.stationService.getSearchStations(event.target.value).subscribe(data => {
      this.options1 = [];
      for (let s of data) {
        this.options1.push(s.nameStation);
      }
    })
  }

  onInputSchedule(event: any) {
    console.log(event)
    this.stationService.getSearchStations(event.target.value).subscribe(data => {
      this.options2 = [];
      for (let s of data) {
        this.options2.push(s.nameStation);
      }
    });
  }

  swap() {
    let a = this.myControl.value;
    this.myControl.setValue(this.myControl1.value);
    this.myControl1.setValue(a);
    this.giveTrains();

  }
}
