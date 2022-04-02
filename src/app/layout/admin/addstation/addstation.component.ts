import {Component, OnInit} from '@angular/core';
import {AdminService} from "../../../service/admin.service";
import {Station} from "../../../models/station";
import {MatOptionSelectionChange} from "@angular/material/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {StationService} from "../../../service/station.service";
import {NotificationService} from "../../../service/notification.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MapComponent} from "./map/map.component";
import {TrainInfoService} from "../../../service/train-info.service";

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
  lonCreate: number = 0;
  latCreate: number = 0;


  public stations: Station[];
  station: Station;


  constructor(public adminService: AdminService,
              public stationService: StationService,
              private fb: FormBuilder,
              private notificationService: NotificationService,
              private dialog: MatDialog,
              public trainInfoService: TrainInfoService) {
  }

  ngOnInit(): void {
    this.getStations();
    this.requestAddStation = this.createAddStationForm();
    this.visibilityStation = false;
  }

  openMap() {
    const dialogRef = new MatDialogConfig();
    dialogRef.data = {lat: this.latEdit.value, lng: this.lonEdit.value};
    this.dialog.open(MapComponent, dialogRef).afterClosed().subscribe(
      data => {
        this.latEdit.setValue(data.lat);
        this.lonEdit.setValue(data.lng);

      }
    );
  }

  openMapCreate() {
    const dialogRef = new MatDialogConfig();
    dialogRef.data = {lat: 55.650534, lng: 37.633470};
    this.dialog.open(MapComponent, dialogRef).afterClosed().subscribe(
      data => {
        let name = this.requestAddStation.value.nameStation;
        this.requestAddStation = this.fb.group({
          nameStation: [name, Validators.compose([Validators.required])],
          latitude: [data.lat  , Validators.compose([Validators.required])],
          longitude: [data.lng , Validators.compose([Validators.required])]
        });
      }
    );
    // this.requestAddStation.value.latitude=this.latCreate;
    // this.requestAddStation.value.longitude=this.latCreate;
  }

  createAddStationForm(): FormGroup {
    return this.fb.group({
      nameStation: ['', Validators.compose([Validators.required])],
      latitude: [, Validators.compose([Validators.required])],
      longitude: [, Validators.compose([Validators.required])]
    });
  }

  getStations(): void {
    this.stationService.getStations().subscribe(data => {
      this.stations = data;
      this.stationsForEdite = data;
      this.stationsForAddCanGet = data;
    });

  }

  addCanGet() {
    if (this.addCanGetStation != '') {
      this.canGetStations.push(this.addCanGetStation);
      this.stations = this.stations.filter((s) => {
        return s.nameStation != this.addCanGetStation
      })
      this.addCanGetStation = '';
    }
  }

  onInput(event: MatOptionSelectionChange) {
    this.addCanGetStation = event.source.value;
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


  onInputStation(event: any) {
    this.stationService.getSearchStations(event.target.value).subscribe(data => {
      this.stationsForEdite = data;
    })
  }

  edit() {
    this.stationService.getStation(this.myControl.value).subscribe(data => {
      this.stationForEdit = data;
      this.nameStationEdit.setValue(this.stationForEdit.nameStation);
      // this.trainInfoService.latForEdit=this.stationForEdit.latitude;
      // this.trainInfoService.lonForEdit=this.stationForEdit.longitude;

      this.latEdit.setValue(this.stationForEdit.latitude);
      this.lonEdit.setValue(this.stationForEdit.longitude);
      this.visibilityStation = true;
    }, error => {
      this.notificationService.showSnakBar("Not found station with name " + this.myControl.value);
    })

  }

  deleteStationFromCanGetStation(i: number) {
    this.stationForEdit.canGetStation.splice(i, 1);
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
    this.stationForEdit.nameStation = this.nameStationEdit.value;
    console.log(this.latEdit.value)
    this.stationForEdit.latitude = this.trainInfoService.latForEdit;
    console.log(this.lonEdit.value)
    this.stationForEdit.longitude = this.trainInfoService.lonForEdit;
    this.adminService.stationEdit(this.stationForEdit).subscribe(
      data => {
      }, error => {
        this.notificationService.showSnakBar(error);
        this.notificationService.showSnakBar('что-то пошло не так');
      }
    )


  }
}
