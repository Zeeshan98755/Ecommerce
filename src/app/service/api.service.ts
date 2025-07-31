import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    patch(path: string, body: Object = {}, headers?: HttpHeaders): Observable<any> {
        return this.http.patch(path, JSON.stringify(body), this.getHttpOptions(headers)).pipe(
            catchError(this.formatErrors)
        );
    }

    constructor(private http: HttpClient) { }

    private formatErrors(error: any) {
        return throwError(() => error.error);
    }

    private getHttpOptions(headers?: HttpHeaders) {
        return {
            headers: headers ? headers : new HttpHeaders({ "Content-Type": "application/json" })
        };
    }

    get(path: string, params: HttpParams = new HttpParams(), headers?: HttpHeaders): Observable<any> {
        return this.http.get(path, { params, ...this.getHttpOptions(headers) }).pipe(
            catchError(this.formatErrors)
        );
    }

    put(path: string, body: Object = {}, headers?: HttpHeaders): Observable<any> {
        return this.http.put(path, JSON.stringify(body), this.getHttpOptions(headers)).pipe(
            catchError(this.formatErrors)
        );
    }

    post(path: string, body: Object = {}, headers?: HttpHeaders): Observable<any> {
        return this.http.post(path, JSON.stringify(body), this.getHttpOptions(headers)).pipe(
            catchError(this.formatErrors)
        );
    }

    delete(path: string, headers?: HttpHeaders): Observable<any> {
        return this.http.delete(path, this.getHttpOptions(headers)).pipe(
            catchError(this.formatErrors)
        );
    }
}
