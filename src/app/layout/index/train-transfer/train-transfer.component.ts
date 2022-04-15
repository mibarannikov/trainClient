import {Component, Input, OnInit} from '@angular/core';
import {Transfer} from "../../../models/transfer";
import {TrainInfoService} from "../../../service/train-info.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-train-transfer',
  templateUrl: './train-transfer.component.html',
  styleUrls: ['./train-transfer.component.css']
})
export class TrainTransferComponent implements OnInit {

  @Input() transfer: Transfer;
  @Input() start:string;
  @Input() end:string;
  constructor(private trainInfoService:TrainInfoService,
              private router: Router) { }

  ngOnInit(): void {
  }

  buyTicket(transfer:Transfer) {
    console.log(transfer)
    this.trainInfoService.startForTicket = this.start;
    this.trainInfoService.endForTicket = this.end;
    this.trainInfoService.transferForBuyTicket = transfer;
    this.router.navigate(['wagontransfer']);
  }
}
