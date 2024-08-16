import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { HttpClient } from '@angular/common/http';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Luv2shopformService {

  private countriesUrl = environment.luv2shopApiUrl + '/countries';
  private statesUrl = environment.luv2shopApiUrl + '/states';

  constructor(
    private httpClient:HttpClient
  ) { }

  getCreditCardMonth(startMonth:number):Observable<number[]>{
    let data:number[]=[];
    //build an array for up to 12 month 
    //that is starting from current month
    for(let month:number=startMonth;month<=12;month++){
      data.push(month);
    }

    return of(data);
  }


  getCreditCardYears():Observable<number[]>{
    let data:number[]=[];
    //build an array for up to next 10 years 
    //that is starting from current year
    //getting current from rjx library methods
    let startYear:number=new Date().getFullYear();//it gives current year
    let endYear:number= startYear+10;
    for(let year:number=startYear;year<=endYear;year++){
      data.push(year);
    }

    return of(data);
  }

  getCountries():Observable<Country[]>{

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(
        response => response._embedded.countries
      )
    );

  }

  getStates(theCountryCode:string):Observable<State[]>{

    const searchStateUrl:string=`${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return    this.httpClient.get<GetResponseState>(searchStateUrl).pipe(
      map(
        response => response._embedded.states
      )
    );
  }
}


interface GetResponseCountries{
  _embedded:{
    countries:Country[]

    
  }
}

interface GetResponseState{
  _embedded:{
    states:State[]

    
  }

}