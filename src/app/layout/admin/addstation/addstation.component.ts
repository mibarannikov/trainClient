import {Component, OnInit} from '@angular/core';
import {AdminService} from "../../../service/admin.service";
import {Station} from "../../../models/station";
import {MatOptionSelectionChange} from "@angular/material/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {StationService} from "../../../service/station.service";
import {NotificationService} from "../../../service/notification.service";

@Component({
  selector: 'app-addstation',
  templateUrl: './addstation.component.html',
  styleUrls: ['./addstation.component.css']
})
export class AddstationComponent implements OnInit {

  myControl = new FormControl('', Validators.required);
  myControl2 = new FormControl('', Validators.required);
  nameStationEdit = new FormControl('', Validators.required);
  latEdit = new FormControl('', Validators.required);
  lonEdit = new FormControl('', Validators.required);
  stationsForEdite: Station[] = [];
  stationsForAddCanGet: Station[] = [];
  stationForEdit: Station;
  requestAddStation!: FormGroup;
  editStation: FormGroup;
  addCanGetStation = '';
  canGetStations: String[] = [];
  visibilityStation: boolean = false;
  addStCan: boolean = false;


  public stations: Station[];
  station: Station;


  constructor(public adminService: AdminService,
              public stationService: StationService,
              private fb: FormBuilder,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.getStations();
    this.requestAddStation = this.createAddStationForm();
    this.visibilityStation = false;
  }

  createAddStationForm(): FormGroup {
    return this.fb.group({
      nameStation: ['', Validators.compose([Validators.required])],
      latitude: [, Validators.compose([Validators.required])],
      longitude: [, Validators.compose([Validators.required])]
    });
  }

  getStations(): void {
    console.log("entry")
    this.stationService.getStations().subscribe(data => {
      this.stations=data;
      this.stationsForEdite = data;
      this.stationsForAddCanGet = data;
      console.log('stations', data);
    });

  }

  addCanGet() {
    console.log('onclik', this.addCanGetStation);
    if (this.addCanGetStation != '') {
      this.canGetStations.push(this.addCanGetStation);
      console.log(this.addCanGetStation);
      console.log(this.canGetStations);
      this.stations = this.stations.filter((s) => {
        return s.nameStation != this.addCanGetStation
      })
      this.addCanGetStation = '';
    }
  }

  onInput(event: MatOptionSelectionChange) {
    console.log('event', event);
    this.addCanGetStation = event.source.value;
    console.log('ghj,f', this.addCanGetStation);
  }

  addStation() {
    this.adminService.addStation({
      nameStation: this.requestAddStation.value.nameStation.trim(),
      latitude: this.requestAddStation.value.latitude,
      longitude: this.requestAddStation.value.longitude,
      canGetStation: this.canGetStations
    }).subscribe(data => {
      console.log(data);
      this.getStations();
    }, error => {
      console.log("Станция с таким именем уже существует")
      this.notificationService.showSnakBar("Станция с таким названием уже существует");
    });
    this.requestAddStation.reset();
    this.canGetStations = [];
  }

  gg() {

  }

  onInputStation(event: any) {
    this.stationService.getSearchStations(event.target.value).subscribe(data => {
      this.stationsForEdite = data;
    })
  }

  edit() {

    console.log('1')
    this.stationService.getStation(this.myControl.value).subscribe(data => {
      this.stationForEdit = data;
      console.log(this.stationForEdit)
      this.nameStationEdit.setValue(this.stationForEdit.nameStation);
      this.latEdit.setValue(this.stationForEdit.latitude);
      this.lonEdit.setValue(this.stationForEdit.longitude);
      this.visibilityStation = true;

    }, error => {
      this.notificationService.showSnakBar("Not found station with name " + this.myControl.value);
    })

  }

  getFromMap() {

  }

  deleteStationFromCanGetStation(i: number) {
    console.log(i)
    console.log(this.stationForEdit.canGetStation);
    this.stationForEdit.canGetStation.splice(i, 1);
    console.log(this.stationForEdit.canGetStation);
  }

  addCanGetEdit() {
    this.myControl2.setValue('');
    this.stationService.getSearchStations('').subscribe(data => {
      this.stationsForAddCanGet = data;
    })
    this.addStCan = !this.addStCan;

  }

  onInputAddStation(event: any) {
    this.stationService.getSearchStations(event.target.value).subscribe(data => {
      this.stationsForAddCanGet = data;
    })

  }

  addCanGetToStationEdit() {
    this.stationForEdit.canGetStation = this.stationForEdit.canGetStation.filter(s => s != this.myControl2.value);
    this.stationForEdit.canGetStation.push(this.myControl2.value);
    this.addStCan = !this.addStCan;
  }

  saveChange() {
   this.stationForEdit.nameStation=this.nameStationEdit.value;
   this.stationForEdit.latitude=this.latEdit.value;
   this.stationForEdit.longitude=this.lonEdit.value;
   console.log('станция на отправку',this.stationForEdit);
   this.adminService.stationEdit(this.stationForEdit).subscribe(
     data=>{
       console.log('измененная станция', data);
     }, error => {
       this.notificationService.showSnakBar(error);
       this.notificationService.showSnakBar('что-то пошло не так');
     }
   )



  }
}
