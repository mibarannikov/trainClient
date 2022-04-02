import {Component, Input, OnInit} from '@angular/core';
import {Transfer} from "../../../models/transfer";

@Component({
  selector: 'app-train-transfer',
  templateUrl: './train-transfer.component.html',
  styleUrls: ['./train-transfer.component.css']
})
export class TrainTransferComponent implements OnInit {

  @Input() transfer: Transfer;
  constructor() { }

  ngOnInit(): void {
  }

  buyTicket(id:number) {
    
  }
}
