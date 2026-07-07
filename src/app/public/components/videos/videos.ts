import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './videos.html',
  styleUrl: './videos.css',
})
export class VideosComponent {
  videoUrl1: SafeResourceUrl;
  videoUrl2: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    // Usamos la URL de "embed" de YouTube
    const aboutTheTeamUrl = 'https://www.youtube.com/embed/vh3wes0YLWY';
    const ExpoUrl = 'https://www.youtube.com/embed/F1wwe5DgvQE';
    // Marcamos la URL como segura para que Angular permita su uso
    this.videoUrl1 = this.sanitizer.bypassSecurityTrustResourceUrl(aboutTheTeamUrl);
    this.videoUrl2 = this.sanitizer.bypassSecurityTrustResourceUrl(ExpoUrl);
  }
}
