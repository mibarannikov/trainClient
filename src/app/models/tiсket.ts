import {PointOfSchedule} from "./pointOfSchedule";

export interface Ticket{
  id?:number;
  wagonNumber:number
  seatNumber: number;
  firstnamePassenger: string;
  lastnamePassenger: string;
  dateOfBirth: Date;
  numberTrainOwner: number;
  nameStations: PointOfSchedule[];
}
