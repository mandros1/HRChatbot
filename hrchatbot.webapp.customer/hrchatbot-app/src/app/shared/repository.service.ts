import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_interface/user.model';
@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  // private readonly API = 'http://localhost:3000/users';
  private readonly API = 'http://localhost:3000/api/v1';
  private readonly API2 = 'http://localhost:3000/api/v1/users';
  constructor(private http: HttpClient) { }

  public getData(): Observable<any> {
     return this.http.get(this.API2);
  }

  public getUserById(id: number) {
    return this.http.get<User>(this.API2 + '/' + id);
  }

  public create(body): Observable<User> {
    return this.http.post<User>(this.API + '/register', body, this.generateHeaders());
  }

  public update(id: number, body): Observable<User> {
    return this.http.put<User>(this.API2 + '/' + id, body, this.generateHeaders());
  }

  public deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(this.API2 + '/' + id);
  }

  // public isAdmin() {
  //   return this.http.get(this.API + '/isAdmin');
  // }

  public resetPassword(body) {
    return this.http.put(this.API + '/resetpassword', body);
  }

  private generateHeaders() {
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
  }

}
