import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";


const Auth_API = environment.apiUrl+'/api/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  public login(user: any): Observable<any> {
    return this.http.post(Auth_API + 'signin', {
      username: user.username,
      password: user.password
    })
  }

  public register(user:any): Observable<any> {
    return this.http.post(Auth_API + 'signup', {
      email: user.email,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      password: user.password,
      confirmPassword: user.confirmPassword
    });
  }
}
