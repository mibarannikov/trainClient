import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

const STATION_API = 'http://localhost:8080/api/station/';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private http: HttpClient) {
  }


  getStations(): Observable<any> {
    return this.http.get(STATION_API + 'all');
  }

  getStation(nameStation: String):Observable<any> {
    return this.http.get(STATION_API+'get?name='+nameStation);
  }


  getTrainsForSchedule(stationName: string):Observable<any> {
   return  this.http.get(STATION_API+'stationschedule?station='+stationName)
  }

  getSearchStations(searchValue:string): Observable<any> {
    return this.http.get(STATION_API + 'search?value='+searchValue);
  }
}
