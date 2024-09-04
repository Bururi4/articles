import { Component, OnDestroy, OnInit } from '@angular/core'
import { AuthService } from '../../../core/auth/auth.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import { UserInfoType } from '../../../../types/user-info.type'
import { DefaultResponseType } from '../../../../types/default-response.type'
import { HttpErrorResponse } from '@angular/common/http'
import { concatMap, EMPTY, Subscription } from 'rxjs'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLogged: boolean = false;
  userInfo: UserInfoType | null = null;
  userName: string = '';
  private subscription: Subscription | null = null;

  constructor(private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router) {
    // this.isLogged = this.authService.getIsLoggedIn();
    // const userInfo: UserInfoType | null = this.authService.getLocalUserInfo();

    // if (this.isLogged && userInfo) {
    //   this.userInfo = userInfo;
    //   this.userName = userInfo.name;
    // }
  }

  ngOnInit(): void {
    this.subscription = this.authService.isLogged$.pipe(concatMap(isLoggedIn => {
      this.isLogged = isLoggedIn;
      if (this.isLogged) {
        return this.authService.getUserInfo();
      }
      return EMPTY;
    }))
      .subscribe({
        next: (data: UserInfoType | DefaultResponseType) => {
          let error = null;

          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }
          const userInfoResponse: UserInfoType = data as UserInfoType;

          if (!userInfoResponse.id && !userInfoResponse.name && !userInfoResponse.email) {
            error = 'Ошибка при получении данных о пользователе';
          }

          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          this.userInfo = userInfoResponse;
          this.userName = userInfoResponse.name;
          // this.authService.setLocalUserInfo(userInfoResponse)
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка при получении данных о пользователе');
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
          next: () => {
            this.doLogout();
          },
          error: () => {
            this.doLogout();
          }
        }
      )
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.authService.removeLocalUserInfo();
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }
}
