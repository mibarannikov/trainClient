import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Train} from "../models/train";
import {Seat} from "../models/seat";

const TRAIN_API = 'http://localhost:8080/api/train/'

@Injectable({
  providedIn: 'root'
})
export class TrainService {

  constructor(private http: HttpClient) {
  }

  getTrains(start: string, end: string): Observable<any> {
    return this.http.get(TRAIN_API + start + '/' + end + '/');
  }

  getTrainById(id: number): Observable<any> {
    return this.http.get(TRAIN_API + id)
  }


  searchTrains(start: string, end: string, tpstart: string, tpend: string):Observable<any> {
    return this.http.get(TRAIN_API+'search?start='+start+'&end='+end+'&tpstart='+tpstart+'&tpend='+tpend);
  }


}

