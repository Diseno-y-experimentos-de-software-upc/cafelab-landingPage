import { Component, HostBinding, Input, booleanAttribute } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-terms-legal',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './terms-legal.component.html',
  styleUrls: ['./terms-legal.component.css'],
})
export class TermsLegalComponent {
  @Input({ transform: booleanAttribute }) lightMode = false;

  @HostBinding('class.terms-legal--light')
  get lightModeClass(): boolean {
    return this.lightMode;
  }
}
