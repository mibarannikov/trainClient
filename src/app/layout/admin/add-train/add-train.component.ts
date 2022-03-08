import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-train',
  templateUrl: './add-train.component.html',
  styleUrls: ['./add-train.component.css']
})
export class AddTrainComponent implements OnInit {
  dateControl: any;
  minDate: any;
  maxDate: any;
  disabled: any;
  showSpinners: any;
  showSeconds: any;
  stepHour: any;
  stepMinute: any;
  stepSecond: any;
  touchUi: any;
  color: any;
  enableMeridian: any;
  disableMinute: any;
  hideTime: any;
  date: any;
  defaultTime: any;

  constructor() { }

  ngOnInit(): void {
  }

  onCl() {
    console.log(this.date);
    this.date="Wed Mar 09 2022 00:00:00 GMT+0300 (Москва, стандартное время)";
    this.date="";
  }
}
