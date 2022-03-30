import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Ticket} from "../models/tiсket";

const TICKET_API = 'http://localhost:8080/api/ticket/'
@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http:HttpClient) { }



  addTicket(): Observable<any>{
    return this.http.get(TICKET_API);
  }

  getEmptySeatsTrain(trainNumber: any, wagonNumber:number, startStation: string, endStation: string):Observable<any> {
    return this.http.get(TICKET_API+"searchseats?train="+trainNumber+'&wagon='+wagonNumber+'&start='+startStation+'&end='+endStation);

  }

  priceCalculation(trainNumber: any, wagonNumber:number, startStation: string, endStation: string):Observable<any>{
    return this.http.get(TICKET_API+"ticketprice?train="+trainNumber+'&wagon='+wagonNumber+'&start='+startStation+'&end='+endStation);
  }

  buyTicket(ticket:Ticket): Observable<any> {
    return this.http.post(TICKET_API + 'buyticket', ticket);
  }

}

