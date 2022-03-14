import {Component, OnInit} from '@angular/core';
import {AdminService} from "../../../service/admin.service";
import {Station} from "../../../models/station";
import {MatOptionSelectionChange} from "@angular/material/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StationService} from "../../../service/station.service";

@Component({
  selector: 'app-addstation',
  templateUrl: './addstation.component.html',
  styleUrls: ['./addstation.component.css']
})
export class AddstationComponent implements OnInit {

  requestAddStation!: FormGroup;
  addCanGetStation = '';
  canGetStations: String[] = [];
  public stations1: Station[];
  station: Station;

  constructor(public adminService: AdminService,
              public stationService: StationService,
              private fb:FormBuilder) {
  }

  ngOnInit(): void {
    this.getStations();
    this.requestAddStation = this.createAddStationForm();
  }

  createAddStationForm(): FormGroup {
    return  this.fb.group({
      nameStation: ['', Validators.compose([Validators.required])],
      latitude: [, Validators.compose([Validators.required])],
      longitude: [, Validators.compose([Validators.required])]
    });
  }


  getStations(): void {
    console.log("entry")
    this.stationService.getStations().subscribe(data => {
      this.stations1 = data;
      console.log('stations',data);
    });

  }

  onClick() {
    console.log('onclik', this.addCanGetStation);
    if(this.addCanGetStation!=''){
    console.log('lkbyf',this.canGetStations.push(this.addCanGetStation));
    console.log(this.addCanGetStation);
    console.log(this.canGetStations);
    this.stations1 = this.stations1.filter((s)=>{return s.nameStation!=this.addCanGetStation})
    this.addCanGetStation='';}
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
      canGetStation:this.canGetStations
    }).subscribe(data=>{
      console.log(data);
      });//this.stations1.push(data)
    this.getStations();
    this.requestAddStation.reset();
    this.canGetStations = [];
  }
}
