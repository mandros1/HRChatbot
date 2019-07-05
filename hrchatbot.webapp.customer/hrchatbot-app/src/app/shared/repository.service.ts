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

  public isLoggedIn(body) {
    return new Promise(resolve => {
      this.http.post(this.API + "/isLoggedIn", body, this.generateHeaders())
        .subscribe(res => {
            resolve(res);
        });
    });
  }

public getDailyCounts() {
  return new Promise(resolve => {
    this.http.get(this.API + '/dailyCount')
      .subscribe(res => {
        resolve(res);
      });
  });
}

public getAllIntents() {
  return new Promise(resolve => {
    this.http.get<User>(this.API + '/intents')
      .subscribe(res => {
        resolve(res);
      });
  });
}

public getIntentCounts() {
  return new Promise(resolve => {
    this.http.get<User>(this.API + '/intentCount')
      .subscribe(res => {
        resolve(res);
      });
  });
}

public getIntentList() {
  return new Promise(resolve => {
    this.http.get<User>(this.API + '/intentList')
      .subscribe(res => {
        resolve(res);
      });
  });
}

  public getIntentByName(intent) {
    return new Promise(resolve => {
      this.http.get<User>(this.API + '/intents/' + intent)
        .subscribe(res => {
          resolve(res);
        });
    });
  }

  public getAllEntities() {
    return new Promise(resolve => {
      this.http.get<User>(this.API + '/entities')
        .subscribe(res => {
          resolve(res);
        });
    });
  }

  public getEntityCounts() {
    return new Promise(resolve => {
      this.http.get<User>(this.API + '/entityCount')
        .subscribe(res => {
          resolve(res);
        });
    });
  }

  public getEntityList() {
    return new Promise(resolve => {
      this.http.get<User>(this.API + '/entityList')
        .subscribe(res => {
          resolve(res);
        });
    });
  }

  public getEntityByName(entity) {
    return new Promise(resolve => {
      this.http.get<User>(this.API + '/entities/' + entity)
        .subscribe(res => {
          resolve(res);
        });
    });
  }

  public login(body): Observable<any>{
    return this.http.put(this.API + '/login', body, this.generateHeaders());
  }

  public create(body): Observable<User> {
    return this.http.post<User>(this.API + '/register', body, this.generateHeaders());
  }

  public sendQuestion(body): Observable<any> {
    return this.http.post(this.API + '/question', body, this.generateHeaders());
  }

  public getSessionId(): Observable<any> {
    return this.http.get(this.API + '/session');
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
