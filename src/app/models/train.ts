import {PointOfSchedule} from "./pointOfSchedule";

export interface Train {
  id?: number;
  trainNumber: any;
  departureTime: string;
  arrivalTimeEnd: string;
  trainSpeed: number;
  sumSeats: number;
  amountOfEmptySeats?: number;
  pointsOfSchedule: PointOfSchedule[];

}

