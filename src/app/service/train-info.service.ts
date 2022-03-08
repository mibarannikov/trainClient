import { Injectable } from '@angular/core';
import {Station} from "../models/station";

@Injectable({
  providedIn: 'root'
})
export class TrainInfoService {

  trainIdForByTicket:number;
  adminRole:boolean;


  constructor() { }

}
