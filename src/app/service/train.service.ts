import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

const TRAIN_API = 'http://localhost:8080/api/train/'

@Injectable({
  providedIn: 'root'
})
export class TrainService {

  constructor(private http: HttpClient) {
  }


  searchTrains(start: string, end: string, tpstart: string, tpend: string): Observable<any> {
    return this.http.get(TRAIN_API + 'search?start=' + start + '&end=' + end + '&tpstart=' + tpstart + '&tpend=' + tpend);
  }

}

