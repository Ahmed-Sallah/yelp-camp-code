import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({providedIn: 'root'})
export class AuthService {

  private isAuthenticated = false
  private token: string
  private tokenTimer: NodeJS.Timer
  private authStatusListener = new Subject<boolean>()
  private userId: string

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable()
  }

  getIsAuth() {
    return this.isAuthenticated
  }

  getUserId() {
    return this.userId
  }

  createUser(email: string, password: string, username: string) {
    const authData: AuthData = {email, password, username}
    this.http.post('http://localhost:3000/signup', authData)
      .subscribe(response => {
        console.log(response)
        this.login(email, password)
        this.router.navigate(['/campgrounds'])
      }, error => {
        this.authStatusListener.next(false)
      })
  }

  login(email: string, password: string) {
    const authData = {email, password}
    this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/login', authData)
      .subscribe(response => {
        this.token = response.token
        if(this.token) {
          const expiresInDuration = response.expiresIn
          this.setAuthTimer(expiresInDuration)
          this.isAuthenticated = true
          this.userId = response.userId
          this.authStatusListener.next(true)
          const now = new Date()
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
          this.saveAuthData(this.token, expirationDate, this.userId)
          this.router.navigate(['/campgrounds'])
        }
      }, error => {
        this.authStatusListener.next(false)
      })
  }

  authoAuthUser() {
    const authInformation = this.getAuthData()
    if(!authInformation) {
      return
    }
    const now = new Date()
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime()
    if(expiresIn > 0) {
      this.token = authInformation.token
      this.isAuthenticated = true
      this.userId = authInformation.userId
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true)
    }
  }

  logout() {
    this.token = null
    this.isAuthenticated = false
    this.authStatusListener.next(false)
    clearTimeout(this.tokenTimer)
    this.clearAuthData()
    this.userId = null
    this.router.navigate(['/campgrounds'])

  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, duration * 1000)
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())
    localStorage.setItem('userId', userId)
  }

  private clearAuthData() {
    localStorage.removeItem("token")
    localStorage.removeItem("expiration")
    localStorage.removeItem("userId")
  }

  private getAuthData() {
    const token = localStorage.getItem("token")
    const expirationDate = localStorage.getItem("expiration")
    const userId = localStorage.getItem("userId")
    if(!token || !expirationDate) {
      return
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
