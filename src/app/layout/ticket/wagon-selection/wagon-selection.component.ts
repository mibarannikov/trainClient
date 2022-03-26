import {Component, OnInit} from '@angular/core';
import {TrainService} from "../../../service/train.service";
import {TrainInfoService} from "../../../service/train-info.service";
import {Wagon} from "../../../models/wagon";
import {Router} from "@angular/router";
import {TicketService} from "../../../service/ticket.service";

@Component({
  selector: 'app-wagon-selection',
  templateUrl: './wagon-selection.component.html',
  styleUrls: ['./wagon-selection.component.css']
})
export class WagonSelectionComponent implements OnInit {

  allWagonLoaded:number=0;

  constructor(private trainService: TrainService,
              private ticketservice:TicketService,
              public trainInfo: TrainInfoService,
              private router: Router) {
  }

  ngOnInit(): void {
    for (let w of this.trainInfo.trainForTicket.wagons){
      this.ticketservice.getEmptySeatsTrain(this.trainInfo.trainForTicket.trainNumber,
       w.wagonNumber,
        this.trainInfo.startForTicket,
        this.trainInfo.endForTicket).subscribe(data=>{
          w.emptySeats=data.length;
          this.allWagonLoaded++;
      })
    }
  }

  buyTicket(wagon: Wagon, i: number) {

    this.trainInfo.wagonNumberForByTicket = wagon.wagonNumber;
    this.router.navigate(['ticket']);

  }
}
