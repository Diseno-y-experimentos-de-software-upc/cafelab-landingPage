import { Component, OnInit } from '@angular/core';
import { NgForOf, CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { environment } from '../../../../environments/environment';

interface Benefit {
  title: string;
  description: string;
  cta: {
    highlight: string;
    rest: string;
  };
  buttonText: string;
  link: string;
}

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.component.html',
  imports: [NgForOf, TranslateModule, CommonModule],
  styleUrls: ['./benefits.component.css']
})
export class BenefitsComponent implements OnInit {
  benefits: Benefit[] = [];

  constructor(private languageService: LanguageService, private translate: TranslateService) {};

  ngOnInit() {
    this.languageService.waitForTranslations().subscribe(loaded => {
      if (loaded) {
        this.loadBenefits();
      }
    });

    this.translate.onLangChange.subscribe(() => {
      this.loadBenefits();
    });
  }

  private loadBenefits() {
    this.benefits = [
      {
        title: this.translate.instant('BENEFITS.BARISTA.TITLE'),
        description: this.translate.instant('BENEFITS.BARISTA.DESCRIPTION'),
        cta: {
          highlight: this.translate.instant('BENEFITS.BARISTA.CTA_HIGHLIGHT'),
          rest: this.translate.instant('BENEFITS.BARISTA.CTA_REST')
        },
        buttonText: this.translate.instant('BENEFITS.BARISTA.BUTTON'),
        link: environment.appLoginUrl
      },
      {
        title: this.translate.instant('BENEFITS.COFFEE_SHOP.TITLE'),
        description: this.translate.instant('BENEFITS.COFFEE_SHOP.DESCRIPTION'),
        cta: {
          highlight: this.translate.instant('BENEFITS.COFFEE_SHOP.CTA_HIGHLIGHT'),
          rest: this.translate.instant('BENEFITS.COFFEE_SHOP.CTA_REST')
        },
        buttonText: this.translate.instant('BENEFITS.COFFEE_SHOP.BUTTON'),
        link: environment.appLoginUrl
      }
    ];
  }
}
