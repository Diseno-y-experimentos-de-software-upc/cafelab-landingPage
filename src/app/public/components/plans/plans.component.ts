import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { environment } from '../../../../environments/environment';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Plan {
  title: string;
  price: string;
  features: string[];
  buttonText: string;
}

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  standalone: true,
  imports: [NgForOf, TranslateModule],
  styleUrls: ['./plans.component.css'],
})
export class PlansComponent implements OnInit, OnDestroy {
  plans: Plan[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.languageService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadPlans();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPlans() {
    const planKeys = ['BARISTA_PLAN', 'OWNER_ADMIN_PLAN', 'COMPLETE_PLAN'];
    const translationKeys = planKeys.map(key => `PLANS.${key}`);

    this.translate.get(translationKeys).subscribe(translations => {
      this.plans = planKeys.map(key => {
        const planData = translations[`PLANS.${key}`];
        return {
          title: planData.TITLE,
          price: planData.PRICE,
          features: planData.FEATURES,
          buttonText: planData.BUTTON
        };
      });
    });
  }

  onPlanSelect(plan: Plan) {
    console.log('Plan selected:', plan.title);
    window.open(environment.appLoginUrl, '_blank');
  }
}
