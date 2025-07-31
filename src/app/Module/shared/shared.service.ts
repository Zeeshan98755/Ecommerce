import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private selectedSectionSubject = new BehaviorSubject<string>('');  // Store the selected section
  selectedSection$ = this.selectedSectionSubject.asObservable();  // Observable to emit changes

  // Method to set the selected section
  setSelectedSection(section: string): void {
    this.selectedSectionSubject.next(section);
  }
}
