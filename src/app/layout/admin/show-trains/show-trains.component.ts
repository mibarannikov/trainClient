import {Component, OnInit} from '@angular/core';
import {AdminService} from "../../../service/admin.service";
import {Train} from "../../../models/train";

@Component({
  selector: 'app-show-trains',
  templateUrl: './show-trains.component.html',
  styleUrls: ['./show-trains.component.css']
})
export class ShowTrainsComponent implements OnInit {
  public trains: Train[];
  public trainsAct: Train[];
  label:number;
  constructor(private adminService: AdminService) {
  }

  ngOnInit(): void {
    this.adminService.getAllTrains().subscribe(data => {
      this.trains=data;
    });
  }

  gg() {
    if (this.label == 1) {
      this.label = 0;
      this.adminService.getAllTrains().subscribe(data => {
        this.trains = data;
        console.log('all',data)});
    } else {
      console.log('act');
      this.adminService.getAllActTrains().subscribe(data=>{
        this.trains = data;
        console.log(data)
      })

      this.label = 1;
    }
  }
}
