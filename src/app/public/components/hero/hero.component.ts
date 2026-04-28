import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  imports: [TranslateModule],
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  onRegister() {
    window.open(environment.appLoginUrl, '_blank');
  }
}
