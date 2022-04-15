import {Injectable} from '@angular/core';
import {Train} from "../models/train";
import {Transfer} from "../models/transfer";

@Injectable({
  providedIn: 'root'
})
export class TrainInfoService {

  public trainIdForByTicket: number;
  public trainForTicket: Train;
  public startForTicket: string;
  public endForTicket: string;
  public dateNow: Date = new Date();
  public wagonNumberForByTicket: number;
  public trainForEdite:Train;
  public latForEdit:number;
  public lonForEdit:number;
  public trainForShowPassenger:Train;
  public transferForBuyTicket: Transfer;


  constructor() {
  }

}
