import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

const TRAIN_API = environment.apiUrl+'/api/train/'

@Injectable({
  providedIn: 'root'
})
export class TrainService {

  constructor(private http: HttpClient) {
  }


  searchTrains(start: string, end: string, tpstart: string, tpend: string): Observable<any> {
    return this.http.get(TRAIN_API + 'search?start=' + start + '&end=' + end + '&tpstart=' + tpstart + '&tpend=' + tpend);
  }

  searchTrainsTransfer(start: string, end: string, tpstart: string, tpend: string): Observable<any>{
    return this.http.get(TRAIN_API + 'searchtransfer?start=' + start + '&end=' + end + '&tpstart=' + tpstart + '&tpend=' + tpend);
  }

}

