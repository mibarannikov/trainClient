import {PointOfSchedule} from "./pointOfSchedule";

export interface Ticket{
  id?:number;
  seatNumber: number;
  firstnamePassenger: string;
  lastnamePassenger: string;
  dateOfBirth: Date;
  numberTrainOwner: number;
  nameStations: PointOfSchedule[];
}
