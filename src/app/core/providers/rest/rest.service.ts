import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { googleapi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private httpClient: HttpClient) { }

  getLocation(lat: any, long: any):Promise<any> {
    return this.httpClient.get(googleapi.baseurl +
      "geocode/json?latlng=" +
      lat +
      "," +
      long +
      "&key=" +
      googleapi.token)
         .toPromise()
         .then((response) => Promise.resolve(response))
         .catch((error) => Promise.resolve(error.json()));
 }
}
