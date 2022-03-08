import {Passenger} from "./passenger";
import {Train} from "./train";
import {Station} from "./station";

export interface Ticket{
  id?:number;
  train:Train;
  startStation:Station;
  endStation:Station;
  passenger:Passenger;
}
