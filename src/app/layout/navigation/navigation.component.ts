import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "../../service/token-storage.service";
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {User} from "../../models/user";
import {TrainService} from "../../service/train.service";
import {TrainInfoService} from "../../service/train-info.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  isLoggedIn = false;
  isDataLoaded = false;

  user!: User;
  date!: string;

  constructor(private tokenService: TokenStorageService,
              private userService: UserService,
              private router: Router,
              private trainService: TrainService,
              private trainInfo: TrainInfoService) {
  }

  ngOnInit(): void {
    setInterval(() => {
      this.date = Date();
    }, 1000);

    this.isLoggedIn = !!this.tokenService.getToken();
    console.log('залогирован', this.isLoggedIn)
    if (this.isLoggedIn) {
      this.userService.getCurrentUser().subscribe(data => {
        this.user = data;
        console.log('Current user', data)
        console.log('Current user', this.user)
        this.isDataLoaded = true;
        console.log('isDataLoaded ', this.isDataLoaded)
      })
    }

    this.setAdminRole();
  }

  logout(): void {
    this.tokenService.logOut();
    //this.router.navigate(['/login'])
  }

  setAdminRole(): void {

    this.userService.getCurrentUser().subscribe(data => {
      console.log('Role', data.role)
      if (data.role.includes('ROLE_ADMIN')) {
        console.log("IF")
        this.trainInfo.adminRole = true;
        console.log('roleAdmin', this.trainInfo.adminRole)
      } else {
        this.trainInfo.adminRole = false
        console.log('roleAdmin', this.trainInfo.adminRole)
      }
    });

  }
}
