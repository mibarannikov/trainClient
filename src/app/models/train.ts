import {PointOfSchedule} from "./pointOfSchedule";
import {Wagon} from "./wagon";

export interface Train {
  id?: number;
  trainNumber: any;
  departureTime: string;
  arrivalTimeEnd: string;
  trainSpeed: number;
  wagons: Wagon[];
  sumSeats: number;
  amountOfEmptySeats?: number;
  pointsOfSchedule: PointOfSchedule[];

}

