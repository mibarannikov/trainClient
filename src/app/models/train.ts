import {PointOfSchedule} from "./pointOfSchedule";

export interface Train {
  id?: number;
  trainNumber: any;
  departureTime: string;
  trainSpeed: number;
  sumSeats: number;
  amountOfEmptySeats?: number;
  pointsOfSchedule: PointOfSchedule[];

}

