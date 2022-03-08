import {Component, Input, OnInit} from '@angular/core';
import {TrainInfoService} from "../../../service/train-info.service";
import {Train} from "../../../models/train";
import {TrainService} from "../../../service/train.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-buy-ticket',
  templateUrl: './buy-ticket.component.html',
  styleUrls: ['./buy-ticket.component.css']
})
export class BuyTicketComponent implements OnInit {
  train!:Train;

  buyTicket!: FormGroup;
  constructor(private trId:TrainInfoService,
              private trService: TrainService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.trService.getTrainById(this.trId.trainIdForByTicket).subscribe(data=>{
      console.log(data);
      this.train=data;
      this.buyTicket= this.fb.group({

        firstname:['',Validators.compose([Validators.required])],
        lastname: ['', Validators.compose([Validators.required])],
        dateOfBirth: ['',Validators.compose([Validators.required])]
      })
    })

  }


  addTiket() {


  }
}
