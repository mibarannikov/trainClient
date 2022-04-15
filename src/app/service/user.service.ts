import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";


 const USER_API = environment.apiUrl+'/api/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  getUserById(id:number): Observable<any>{
    return this.http.get(USER_API+id);
  }

  getCurrentUser(): Observable<any>{
    return this.http.get(USER_API+'/');

  }

  getAllTickets(): Observable<any>{
    return this.http.get(USER_API+'/tickets?param=all')
  }

  getActualTickets():Observable<any> {
    return this.http.get(USER_API+'/tickets?param=act')
  }


}
