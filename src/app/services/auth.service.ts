import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, map, of, BehaviorSubject } from 'rxjs';
import { UserDTO } from '../models/userdata';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://127.0.0.1:8080/api/auth';

  // Track login state across the app
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userData = new BehaviorSubject<UserDTO | null>(null);
  public userData$ = this.userData.asObservable();

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token && this.checkTokenExpiry(token) === false) {
      this.isLoggedInSubject.next(true);
      this.userData.next(localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')!) : null);

    }
    else {
      this.isLoggedInSubject.next(false);
      this.userData.next(null);
    }
  }

  // JWT
  private getToken() {
    const token = localStorage.getItem('authToken');
    return token ? token : null;
  }

  private checkTokenExpiry(token: string): boolean {
    const parsedToken = token ? JSON.parse(atob(token.split('.')[1])) : null; // split() splits the string at the '.' and returns an array. we get the payload which is at index 1
    console.log('Parsed token expiry time:' + parsedToken?.exp + ' Current time: ' + Math.floor(Date.now() / 1000));

    if (parsedToken && parsedToken.exp > Math.floor(Date.now() / 1000)) {
      return false;
    } else {
      return true;
    }
  }

  register(
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string
  ) {
    return this.http.post(this.baseUrl + '/signup', {
      firstname: firstname,
      lastname: lastname,
      username: username,
      email: email,
      password: password
    }).pipe(
      map((response: any) => {
        console.log('Registration successful:', response);
        this.userData.next(response);
        return true;
      }),
      catchError((error) => {
        console.error('Registration error:', error);
        return of(false); // 'of' emits value and completes. In operators like catchError(), an Observable must be returned.
      })
    );
  }

  login(username: string, password: string) {
    return this.http.post(this.baseUrl + '/signin', {
      username: username,
      password: password
    }).pipe(
      map((response: any) => {
        console.log('Login successful:', response);
        this.isLoggedInSubject.next(true); // Update login state
        this.userData.next(response); // Save user data
        localStorage.setItem('authToken', response.accessToken);
        localStorage.setItem('userData', JSON.stringify(response));
        return true;
      }),
      catchError((error) => {
        console.error('Login error:', error);
        this.isLoggedInSubject.next(false); // Update login state
        this.userData.next(null); // Clear user data on error
        return of(false);
      })
    );
  }

  logout() {
    this.isLoggedInSubject.next(false);
    this.userData.next(null); // Clear user data on logout
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }

  getCurrentLoginState(): boolean {
    return this.isLoggedInSubject.value;
  }


}
