import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions } from '@angular/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Language{
  id: string;
  translations: object;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService implements TranslateLoader {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  private baseUrl = '/';

  constructor(private httpClient: HttpClient) { }
  
  getTranslation(lang: string): Observable<any> {
    return this.httpClient.get<Language>(`/languages/${lang}`)
    .map((response) => {
     return response.translations; 
    });

  }
}
