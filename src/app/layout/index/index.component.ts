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

  myControl2 = new FormControl('', Validators.required);
  myControl = new FormControl('', Validators.required);
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  myControl1 = new FormControl('', Validators.required);
  options1: string[] = [];
  filteredOptions1: Observable<string[]>;
  dateStartControl = new FormControl('', Validators.required)
  dateEndControl = new FormControl('', Validators.required)

  st:string;
  public arrdep: [{ arr: string | undefined, dep: string | undefined, status: string }]  ;
  nam: string = '';
  label: number = 0;
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
      console.log('data', data);
      for (var s of data) {
        this.options1.push(s.nameStation);
        this.options.push(s.nameStation);
      }
    });
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
    this.router.navigate(['ticket']);
  }


  giveTrains() {
    this.start = this.myControl.value
    this.end = this.myControl1.value
    this.trainService.searchTrains(this.myControl.value, this.myControl1.value, this.dateStartControl.value, this.dateEndControl.value)
      .subscribe(data => {
        this.trains = data
        for (let t of this.trains) {
          console.log('befor', t.pointsOfSchedule);
          t.pointsOfSchedule.sort((a, b) => a.arrivalTime > b.arrivalTime ? 1 : -1);
          console.log('after', t.pointsOfSchedule);
        }

      })
  }

  gg() {
    this.st=this.myControl2.value;
    console.log('in', this.label);
    if (this.label == 1) {
      this.label = 0;
      //  this.getActTickets();
    } else {
      console.log('in');
      this.label = 1;
      if (this.myControl2.value) {
        this.getTrainsForSchedule();
      }
    }
    //console.log('out', this.label)
  }

  private getTrainsForSchedule() {
   // @ts-ignore
    this.arrdep=[];
    console.log('get');
    this.stationService.getTrainsForSchedule(this.myControl2.value).subscribe(data => {
      this.trainsForSchedule = data;
      console.log('data',data)
      if(this.trainsForSchedule) {
        for (let tr of this.trainsForSchedule) {
          let arrPoint: PointOfSchedule | undefined = tr.pointsOfSchedule.find(p => p.nameStation === this.myControl2.value);
          console.log(arrPoint)
          // @ts-ignore
          let datef: Date = new Date(arrPoint.arrivalTime)
          console.log('datef', datef)
          datef.setMinutes(datef.getMinutes() + 5);
          console.log('detef+5', datef.setHours(datef.getHours() + 3))
          console.log('ISO', datef.toISOString())
          // @ts-ignore
          console.log(this.arrdep)
          // @ts-ignore
          let statuss
          // @ts-ignore
          if ((new Date(arrPoint.arrivalTime) < new Date()) && (datef > new Date())) {
            statuss = 'Прибыл';
          } else {
            statuss = 'Ожидается прибытие'
          }


          // @ts-ignore
          this.arrdep.push({arr: arrPoint.arrivalTime, dep: arrPoint.departureTime, status: statuss})
        }
      }
      console.log('массив прибытия отправления',this.arrdep)
    })

  }

  getSchedule() {
    this.st=this.myControl2.value;
    this.getTrainsForSchedule();
  }
}
