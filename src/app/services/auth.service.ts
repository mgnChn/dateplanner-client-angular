import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, map, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://127.0.0.1:8080/api/auth';

  // Track login state across the app
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

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
        return true;
      }),
      catchError((error) => {
        console.error('Login error:', error);
        this.isLoggedInSubject.next(false); // Update login state
        return of(false);
      })
    );
  }

  logout() {
    this.isLoggedInSubject.next(false);
  }

  getCurrentLoginState(): boolean {
    return this.isLoggedInSubject.value;
  }

}
