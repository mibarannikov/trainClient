import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Station} from "../models/station";
import {Train} from "../models/train";

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
    console.log('out', train);
    return this.http.post(ADMIN_API + 'train/add', train)

  }
}
