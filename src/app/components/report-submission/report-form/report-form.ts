import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportsService } from '../../../services/reports.service';
import { ContactMethod, ReportedCraftsman, ReportTip, ReportType } from '../../../models/report.model';

@Component({
    selector: 'app-report-form',
    templateUrl: './report-form.html',
    styleUrl: './report-form.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule]
})
export class ReportFormComponent {
    private readonly reportsService = inject(ReportsService);
    private readonly router = inject(Router);

    protected readonly isSubmitting = signal(false);
    protected readonly descriptionLength = signal(0);
    protected readonly uploadedFiles = signal<File[]>([]);

    protected readonly userPhone = '01234567890';
    protected readonly userImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa3AIYLYBQuKb_j1vaSSd-2dqkT0LYxMb35stDgH2p0jDxWM00zqJUBTvsvFG6i2-_ZI_qplJ3WfrLeuuJfqjjV0On-sdLMH2TW1_dCg_TyNbXsLYESGP1G6ETcfYdqyN5oXOdCIwOZLISOECpzIc0QxwUZaaYmS2hnbIncEc446eKV8KYWXz3p0nD46ExN6H00rGuV_MQ1nxpjhfmOihwfrEZfOoVSE-dJCSdmom9_obPwuJ7l1obpPltZxZmERJgzuPsrU0Fxr6d';

    protected readonly reportedCraftsman: ReportedCraftsman = {
        id: '123',
        name: 'اسم الصنايعي',
        profession: 'كهربائي',
        profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2JyD9_nY3UmKFMFLYsk5RcEUEdpl4R9XCoaqOAYzpVd9YdJwt991UJK8QvsfU1k2fj3qDK6EtUSvBEM81DDCVCVIUR-EaW88DuBQPiqt_Q2JzJf-xvZmtlPzGhpAqFkIoHZtztwesq7-gldyH9qhbK023zr-6ib1m8rAp5jl8P5yzrKB3gH5rVxkFFonXCilFY5mI1-BXk6Y5nZYbIooV6QPZScJiuMPDbi7jENpH6hx0ncmiVx3K1n9QV-VuRv5W0T0kqn0gtGkJ'
    };

    protected readonly reportTypes: ReportType[] = [
        { value: '', label: 'اختر نوع البلاغ' },
        { value: 'fraud', label: 'نصب واحتيال' },
        { value: 'bad_service', label: 'خدمة سيئة' },
        { value: 'misconduct', label: 'سوء سلوك' },
        { value: 'misleading', label: 'معلومات مضللة' },
        { value: 'delay', label: 'تأخير غير مبرر' },
        { value: 'extra_charges', label: 'طلب مبالغ إضافية' },
        { value: 'other', label: 'أخرى' }
    ];

    protected readonly tips: ReportTip[] = [
        { icon: 'check_circle', text: 'كن واضحًا ومحددًا في وصفك للمشكلة.' },
        { icon: 'check_circle', text: 'اذكر التواريخ والأوقات الدقيقة قدر الإمكان.' },
        { icon: 'check_circle', text: 'أرفق أي دليل لديك مثل الصور أو المحادثات.' }
    ];

    protected readonly reportForm = new FormGroup({
        reportType: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        description: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(1000)]
        }),
        incidentDate: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        alternativeContact: new FormControl('', { nonNullable: true }),
        phoneContact: new FormControl(false, { nonNullable: true }),
        emailContact: new FormControl(false, { nonNullable: true }),
        whatsappContact: new FormControl(false, { nonNullable: true }),
        privacyAccepted: new FormControl(false, {
            nonNullable: true,
            validators: [Validators.requiredTrue]
        })
    });

    protected readonly isFormValid = computed(() => {
        return this.reportForm.valid;
    });

    onDescriptionChange(event: Event): void {
        const value = (event.target as HTMLTextAreaElement).value;
        this.descriptionLength.set(value.length);
    }

    onFileSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            const files = Array.from(input.files);
            const current = this.uploadedFiles();
            if (current.length + files.length <= 5) {
                this.uploadedFiles.set([...current, ...files]);
            }
        }
    }

    onFileDrop(event: DragEvent): void {
        event.preventDefault();
        if (event.dataTransfer?.files) {
            const files = Array.from(event.dataTransfer.files);
            const current = this.uploadedFiles();
            if (current.length + files.length <= 5) {
                this.uploadedFiles.set([...current, ...files]);
            }
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    removeFile(index: number): void {
        this.uploadedFiles.update(files => files.filter((_, i) => i !== index));
    }

    onSubmit(): void {
        if (!this.reportForm.valid) {
            this.reportForm.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);
        const formValue = this.reportForm.getRawValue();

        const preferredMethods: ContactMethod[] = [];
        if (formValue.phoneContact) preferredMethods.push('phone');
        if (formValue.emailContact) preferredMethods.push('email');
        if (formValue.whatsappContact) preferredMethods.push('whatsapp');

        this.reportsService.submitReport({
            craftsmanId: this.reportedCraftsman.id,
            reportType: formValue.reportType,
            description: formValue.description,
            incidentDate: formValue.incidentDate,
            alternativeContact: formValue.alternativeContact || undefined,
            preferredContactMethods: preferredMethods,
            privacyAccepted: formValue.privacyAccepted
        }).subscribe({
            next: () => {
                this.isSubmitting.set(false);
                this.router.navigate(['/report/success']);
            },
            error: () => this.isSubmitting.set(false)
        });
    }

    cancel(): void {
        this.router.navigate(['/']);
    }
}
