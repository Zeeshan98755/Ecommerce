import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-tracker',
  templateUrl: './order-tracker.component.html',
  styleUrl: './order-tracker.component.scss'
})
export class OrderTrackerComponent {
  @Input() activeStep!: string;
  @Input() steps!: { id: number, title: string, isCompleted: boolean }[];

  ngOnChanges() {
    this.steps = this.steps.map(step => ({
      ...step,
      isCompleted: step.id <= this.steps.find(s => s.title === this.activeStep)?.id!
    }));
  }
}
