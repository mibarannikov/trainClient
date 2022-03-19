import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Station} from "../models/station";
import {Train} from "../models/train";
import {Ticket} from "../models/tiсket";

const ADMIN_API = 'http://localhost:8080/api/admin/'

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  stations: Station[];

  constructor(private http: HttpClient) {
  }

  getStations(): Observable<any> {
    return this.http.get(ADMIN_API + 'stations')
  }

  addStation(station: Station): Observable<any> {
    return this.http.post(ADMIN_API + 'station/add', station);
  }

  addTrain(train: Train): Observable<any> {
    return this.http.post(ADMIN_API + 'train/add', train)
  }


  getAllTrains():Observable<any>{
    return this.http.get(ADMIN_API+'train/all');
  }

  getRegTickets(trainNumber: number){
    return this.http.get<Ticket[]>(ADMIN_API+'regtickets?train='+trainNumber);
  }

  getAllTickets(trainNumber:number){
    return this.http.get<Ticket[]>(ADMIN_API+'alltickets?train='+trainNumber);
  }

  getAllActTrains(): Observable<any> {
    return this.http.get(ADMIN_API+'train/allact');
  }
}
