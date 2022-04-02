import {Component, OnInit} from '@angular/core';
import {AdminService} from "../../../service/admin.service";
import {Train} from "../../../models/train";
import {TrainInfoService} from "../../../service/train-info.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-show-trains',
  templateUrl: './show-trains.component.html',
  styleUrls: ['./show-trains.component.css']
})
export class ShowTrainsComponent implements OnInit {
  public trains: Train[];
  public trainsAct: Train[];
  label: number;

  constructor(private adminService: AdminService,
              private trainInfoService: TrainInfoService,
              private router:Router) {
  }

  ngOnInit(): void {
    this.adminService.getAllTrains('past').subscribe(data => {
      this.trains = data;
    });
  }

  gg() {
    if (this.label == 0) {
      this.label = 1;
      this.adminService.getAllTrains('past').subscribe(data => {
        this.trains = data;
        console.log('all', data)
      });
    } else {
      console.log('act');
      this.adminService.getAllTrains('act').subscribe(data => {
        this.trains = data;
        console.log(data)
      })

      this.label = 0;
    }
  }

  editTrain(tr: Train) {
    this.trainInfoService.trainForEdite=tr;
    this.router.navigate(['edittrain']);


  }

  showPassenger(tr: Train) {
    this.trainInfoService.trainForShowPassenger=tr;
    this.router.navigate(['passengers']);
  }
}
