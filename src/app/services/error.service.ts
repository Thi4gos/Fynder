import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private Http: HttpClient) { }

  handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Erro na API:', error); 
    return throwError(() => new Error('Ocorreu um erro na requisição. Por favor, tente novamente.'));
  }

}
