import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {TokenStorageService} from "../../service/token-storage.service";
import {NotificationService} from "../../service/notification.service";
import {Router} from "@angular/router";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup ;



  constructor(private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private notificationService: NotificationService,
              private router: Router,
              private fb: FormBuilder,
              private userService: UserService
  ) {
    this.loginForm = this.createLoginForm()

    if (this.tokenStorage.getUser()) {
      this.router.navigate(['main'])
    }
  }

  ngOnInit(): void {


  }

  createLoginForm(): FormGroup {
    return this.fb.group({
      username: ['', Validators.compose([Validators.required,Validators.email])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  submit(): void {

    this.authService.login({
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }).subscribe(data=>{
      this.tokenStorage.saveToken(data.token);
      //this.tokenStorage.saveUser(data);
      this.notificationService.showSnakBar('Successfully logged in');
      this.userService.getCurrentUser().subscribe(data=>{
        this.tokenStorage.saveUser(data);
      });
      this.router.navigate(['/']);
      window.location.reload();
      }, error => {
      console.log(error);
      this.notificationService.showSnakBar(error.message);

    });


  }
}
