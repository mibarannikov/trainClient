import { Injectable } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {TokenStorageService} from "../service/token-storage.service";
import {NotificationService} from "../service/notification.service";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor{

  constructor(private tokenService: TokenStorageService,
              private notificationService: NotificationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(err=> {
      if(err.status===401){
        this.tokenService.logOut();
        //window.location.reload();
      }
      console.log('error message',err.error.message)
      const error = err.error.message || err.statusText;
      this.notificationService.showSnakBar(error);
      return throwError(error)
    }));

  }
}

export const authErrorInterceptorProvider = [
  {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true}
];
