import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


 const User_API = 'http://localhost:8080/api/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  getUserById(id:number): Observable<any>{
    return this.http.get(User_API+id);
  }

  getCurrentUser(): Observable<any>{
    return this.http.get(User_API+'/');

  }

  updateUser(user:any):Observable<any>{
    return  this.http.post(User_API+'update' ,user)
  }
}
