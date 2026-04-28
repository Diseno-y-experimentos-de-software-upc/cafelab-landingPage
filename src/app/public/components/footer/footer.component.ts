import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { TermsModalService } from '../../../core/services/terms-modal.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TermsLegalComponent } from '../terms-legal/terms-legal.component';
interface FooterSection {
  title: string;
  links: FooterLink[];

}

interface FooterLink {
  text: string;
  url: string;
  isEmail?: boolean;
  /** Abre el modal de términos en lugar de navegar */
  opensTermsModal?: boolean;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [NgForOf, NgIf, AsyncPipe, TranslateModule, TermsLegalComponent],
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit, OnDestroy {
  footerSections: FooterSection[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    readonly termsModal: TermsModalService
  ) {}

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.termsModal.isOpen) {
      this.termsModal.close();
    }
  }

  ngOnInit() {
    this.languageService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadFooterSections();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadFooterSections() {
    this.translate.get('FOOTER').subscribe(footerTranslations => {
      const t = (key: string, ...subkeys: string[]) => {
        let current = footerTranslations;
        for(const subkey of subkeys) {
          current = current[subkey];
        }
        return current[key];
      }

      this.footerSections = [
        {
          title: t('TITLE', 'QUICK_LINKS'),
          links: [
            { text: t('HOME', 'QUICK_LINKS'), url: '#' },
            {
              text: t('BENEFITS', 'QUICK_LINKS'),
              url: '#beneficios',
            },
            { text: t('PLANS', 'QUICK_LINKS'), url: '#planes' },
            {
              text: t('CONTACT', 'QUICK_LINKS'),
              url: '#faq-contacto',
            },
            {
              text: t('TERMS', 'QUICK_LINKS'),
              url: '',
              opensTermsModal: true,
            },
          ],
        },
        {
          title: t('TITLE', 'RESOURCES'),
          links: [
            { text: t('LINKEDIN', 'RESOURCES'), url: 'https://linkedin.com/in/cafe-metrix-cafelab-04862a368' },
            { text: t('EMAIL', 'RESOURCES'), url: 'contacto@cafelab.com', isEmail: true },
          ],
        },
        {
          title: t('TITLE', 'CONTACT_INFO'),
          links: [
            {
              text: t('EMAIL', 'CONTACT_INFO'),
              url: 'contacto@cafelab.com',
              isEmail: true,
            },
            { text: t('WHATSAPP', 'CONTACT_INFO'), url: 'https://wa.me/51991829980' },
          ],
        },
      ];
    });
  }

  linkTarget(link: FooterLink): string {
    if (link.isEmail || link.url.startsWith('#')) {
      return '_self';
    }
    return '_blank';
  }

  linkRel(link: FooterLink): string {
    if (link.isEmail || link.url.startsWith('#')) {
      return '';
    }
    return 'noopener noreferrer';
  }
}
