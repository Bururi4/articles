import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) {
  }

  newRequest(name: string, phone: string, type: string, service: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', {
      name,
      phone,
      type,
      service
    })
  }
}
