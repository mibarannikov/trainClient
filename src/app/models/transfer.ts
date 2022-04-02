import {Train} from "./train";
import {Station} from "./station";

export interface Transfer {
  firstTrain: Train;
  secondTrain: Train;
  stationTransfer: Station;
}
