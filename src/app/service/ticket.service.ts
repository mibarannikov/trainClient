import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import * as http from "http";

const TICKET_API = 'http://localhost:8080/api/ticket/'
@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http:HttpClient) { }

  getTickets(idUser:number): Observable<any>{
    return this.http.get(TICKET_API)
  }

  addTicket(): Observable<any>{
    return this.http.get(TICKET_API);
  }
}

