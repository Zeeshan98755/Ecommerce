import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  show(duration: number = 5000) {
    this.loadingSubject.next(true);
    setTimeout(() => {
      this.hide();
    }, duration);
  }

  hide() {
    this.loadingSubject.next(false);
  }
}
