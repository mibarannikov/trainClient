import {Component, OnInit} from '@angular/core';
import {AdminService} from "../../../service/admin.service";
import {Train} from "../../../models/train";
import {TrainInfoService} from "../../../service/train-info.service";
import {Router} from "@angular/router";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-show-trains',
  templateUrl: './show-trains.component.html',
  styleUrls: ['./show-trains.component.css']
})
export class ShowTrainsComponent implements OnInit {
  public trains: Train[];
  public trainsAct: Train[];
  label: number;
  lengthItemsPast: number;
  lengthPagePast: number;
  lengthItemsAct:number;
  lengthPageAct:number;
  pagePast:number=0;
  amountPast:number=10;
  pageAct:number=0;
  amountAct:number=10;

  constructor(private adminService: AdminService,
              private trainInfoService: TrainInfoService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.adminService.getAllTrains('past',this.pagePast,this.amountPast).subscribe(data => {
      this.trains = data.content;
      this.lengthItemsPast=data.totalElements;
      /// и передать общее количество
    });
  }

  gg() {
    if (this.label == 0) {
      this.label = 1;
      this.adminService.getAllTrains('past',this.pagePast,this.amountPast).subscribe(data => {
        this.trains = data.content;
        this.lengthItemsPast=data.totalElements;
        console.log('all', data)
      });
    } else {
      console.log('act');
      this.adminService.getAllTrains('act',this.pageAct,this.amountAct).subscribe(data => {
        this.trains = data.content;
        this.lengthItemsAct=data.totalElements;
        console.log(data)
      })

      this.label = 0;
    }
  }

  editTrain(tr: Train) {
    this.trainInfoService.trainForEdite = tr;
    this.router.navigate(['edittrain']);


  }

  showPassenger(tr: Train) {
    this.trainInfoService.trainForShowPassenger = tr;
    this.router.navigate(['passengers']);
  }

  getDataPast(event: PageEvent) {
    console.log(event)
    this.adminService.getAllTrains('past',event.pageIndex,event.pageSize).subscribe(data => {
      this.trains = data.content;
      this.lengthItemsPast=data.totalElements;
      console.log('all', data)
    });

  }

  getDataAct(event: PageEvent) {
    console.log(event)
    this.adminService.getAllTrains('act',event.pageIndex,event.pageSize).subscribe(data => {
      this.trains = data.content;
      this.lengthItemsAct=data.totalElements;
      console.log('all', data)
    });

  }
}
