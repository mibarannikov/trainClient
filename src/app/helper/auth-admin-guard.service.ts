import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {TokenStorageService} from "../service/token-storage.service";
import {Observable} from "rxjs";
import {UserService} from "../service/user.service";
import {TrainInfoService} from "../service/train-info.service";
import {User} from "../models/user";


@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuardService implements CanActivate {
  public adminRole: boolean;
  user: User;
  i: number = 0;

  constructor(private router: Router,
              private tokenService: TokenStorageService,
              private userService: UserService,
              private trainInfo: TrainInfoService) {
  }



  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> |
    Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.tokenService.getUser();
    if(currentUser!=null) {
      if (currentUser.role == 'ROLE_ADMIN') {
        return true;
      }
    }
    this.router.navigate(['/main'], {queryParams: {returnUrl: state.url}});
    return false;

    // this.userService.getCurrentUser().subscribe(data => {
    //  console.log('Role', data.role)
    //  if (data.role.includes('ROLE_ADMIN')) {
    //    console.log("IF")
    //    this.trainInfo.adminRole = true;
    //    console.log('roleAdmin', this.trainInfo.adminRole)
    //  } else {
    //    this.trainInfo.adminRole = false
    //    console.log('roleAdmin', this.trainInfo.adminRole)
    //  }
    //});

  }


}
