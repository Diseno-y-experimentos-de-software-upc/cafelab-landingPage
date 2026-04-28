import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { TermsModalService } from '../../../core/services/terms-modal.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface FAQ {
  question: string;
  answer: string;
}

interface ContactForm {
  nombre: string;
  apellidos: string;
  email: string;
  mensaje: string;
  aceptoTerminos: boolean;
}

@Component({
  selector: 'app-faq-contact',
  templateUrl: './faq-contact.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    TranslateModule,
    HttpClientModule,
  ],
  styleUrls: ['./faq-contact.component.css'],
})
export class FaqContactComponent implements OnInit {
  contactForm: FormGroup;
  faqs: FAQ[] = [];

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private languageService: LanguageService,
    private http: HttpClient,
    private termsModal: TermsModalService
  ) {
    this.contactForm = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          this.noNumbersValidator,
          this.noSpecialCharsValidator,
        ],
      ],
      apellidos: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          this.noNumbersValidator,
          this.noSpecialCharsValidator,
        ],
      ],
      email: ['', [Validators.required, Validators.email, this.emailDomainValidator]],
      mensaje: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
          this.noOnlySpacesValidator,
        ],
      ],
      aceptoTerminos: [false, Validators.requiredTrue],
    });
  }

  ngOnInit() {
    this.languageService.waitForTranslations().subscribe((loaded) => {
      if (loaded) {
        this.loadFAQs();
      }
    });

    this.translate.onLangChange.subscribe(() => {
      this.loadFAQs();
    });
  }

  private noNumbersValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    if (!control.value) return null;
    const hasNumbers = /\d/.test(control.value);
    return hasNumbers ? { hasNumbers: true } : null;
  }

  private noSpecialCharsValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    if (!control.value) return null;
    const hasSpecialChars = /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/.test(control.value);
    return hasSpecialChars ? { hasSpecialChars: true } : null;
  }

  private emailDomainValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    if (!control.value) return null;
    const validDomains = [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'empresa.com',
    ];
    const email = control.value.toLowerCase();
    const domain = email.split('@')[1];

    if (
      domain &&
      !validDomains.some((validDomain) =>
        domain.includes(validDomain.split('.')[0])
      )
    ) {
      const domainPattern =
        /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
      return domainPattern.test(domain) ? null : { invalidDomain: true };
    }
    return null;
  }

  private noOnlySpacesValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    if (!control.value) return null;
    const isOnlySpaces = control.value.trim().length === 0;
    return isOnlySpaces ? { onlySpaces: true } : null;
  }

  private loadFAQs() {
    this.faqs = [
      {
        question: this.translate.instant('FAQ.FAQ_1.QUESTION'),
        answer: this.translate.instant('FAQ.FAQ_1.ANSWER'),
      },
      {
        question: this.translate.instant('FAQ.FAQ_2.QUESTION'),
        answer: this.translate.instant('FAQ.FAQ_2.ANSWER'),
      },
      {
        question: this.translate.instant('FAQ.FAQ_3.QUESTION'),
        answer: this.translate.instant('FAQ.FAQ_3.ANSWER'),
      },
    ];
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const errors = field.errors;

    switch (fieldName) {
      case 'nombre':
      case 'apellidos':
        if (errors['required'])
          return this.translate.instant('VALIDATION.REQUIRED');
        if (errors['minlength'])
          return this.translate.instant('VALIDATION.MIN_LENGTH', { min: 2 });
        if (errors['maxlength'])
          return this.translate.instant('VALIDATION.MAX_LENGTH', { max: 50 });
        if (errors['hasNumbers'])
          return this.translate.instant('VALIDATION.NO_NUMBERS');
        if (errors['hasSpecialChars'])
          return this.translate.instant('VALIDATION.NO_SPECIAL_CHARS');
        break;

      case 'email':
        if (errors['required'])
          return this.translate.instant('VALIDATION.REQUIRED');
        if (errors['email'])
          return this.translate.instant('VALIDATION.INVALID_EMAIL');
        if (errors['invalidDomain'])
          return this.translate.instant('VALIDATION.INVALID_DOMAIN');
        break;

      case 'mensaje':
        if (errors['required'])
          return this.translate.instant('VALIDATION.REQUIRED');
        if (errors['minlength'])
          return this.translate.instant('VALIDATION.MIN_LENGTH', { min: 10 });
        if (errors['maxlength'])
          return this.translate.instant('VALIDATION.MAX_LENGTH', { max: 500 });
        if (errors['onlySpaces'])
          return this.translate.instant('VALIDATION.NO_ONLY_SPACES');
        break;

      case 'aceptoTerminos':
        if (errors['required'])
          return this.translate.instant('VALIDATION.TERMS_REQUIRED');
        break;
    }

    return '';
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? field.valid && field.touched : false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  openTermsModal(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.termsModal.open();
  }

  onSubmit() {
    this.markAllFieldsAsTouched();

    if (this.contactForm.valid) {
      const formData: ContactForm = this.contactForm.value;

      const cleanedData = {
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos.trim(),
        email: formData.email.trim().toLowerCase(),
        mensaje: formData.mensaje.trim(),
      };

      const url = `${environment.serverBaseUrl}${environment.contactUsEndpointPath}`;

      this.http.post(url, cleanedData).subscribe({
        next: () => {
          alert('contacto guardado');
          this.resetForm();
        },
        error: (err) => {
          alert('Error al enviar el mensaje');
          console.error('Error submitting form:', err);
        },
      });
    } else {
      alert('contacto invalido');
      this.showValidationErrors();
    }
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.contactForm.controls).forEach((key) => {
      this.contactForm.get(key)?.markAsTouched();
    });
  }

  private showValidationErrors() {
    console.log('Por favor, corrige los errores en el formulario');
  }

  resetForm() {
    this.contactForm.reset();
    this.markAllFieldsAsUntouched();
  }

  private markAllFieldsAsUntouched() {
    Object.keys(this.contactForm.controls).forEach((key) => {
      this.contactForm.get(key)?.markAsUntouched();
    });
  }
}
