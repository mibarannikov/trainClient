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

  constructor(private adminService: AdminService) {
  }

  ngOnInit(): void {
    this.adminService.getAllTrains().subscribe(data => {
      this.trains=data;
    });
  }

}
