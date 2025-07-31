import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  sections = [
    { title: 'Solutions', items: ['Marketing', 'Analytics', 'Commerce', 'Insights'] },
    { title: 'Support', items: ['Pricing', 'Documentation', 'Guides', 'API Status'] },
    { title: 'Company', items: ['About', 'Jobs', 'Blog', 'Press'] },
    { title: 'Legal', items: ['Claim', 'Privacy', 'Policy', 'Terms'] },
  ];

}
