import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CraftsmanRegistrationService } from '../../../services/craftsman-registration.service';
import { RegistrationStep } from '../../../../model/craftsman-registration.model';

@Component({
    selector: 'app-documents',
    templateUrl: './documents.html',
    styleUrl: './documents.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ReactiveFormsModule]
})
export class Documents {
    private registrationService = inject(CraftsmanRegistrationService);
    private router = inject(Router);

    protected readonly isSubmitting = signal(false);
    protected steps: RegistrationStep[] = [];

    constructor() {
        const isCraftsman = this.registrationService.isCraftsman();
        if (isCraftsman) {
            this.steps = [
                { stepNumber: 1, label: 'المعلومات الأساسية', isActive: false, isCompleted: true },
                { stepNumber: 2, label: 'المهنة والمهارات', isActive: false, isCompleted: true },
                { stepNumber: 3, label: 'مناطق الخدمة', isActive: false, isCompleted: true },
                { stepNumber: 4, label: 'المستندات', isActive: true, isCompleted: false }
            ];
        } else {
            this.steps = [
                { stepNumber: 1, label: 'المعلومات الأساسية', isActive: false, isCompleted: true },
                { stepNumber: 2, label: 'المستندات', isActive: true, isCompleted: false }
            ];
        }
    }

    protected readonly documentsForm = new FormGroup({
        nationalIdFront: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
        nationalIdBack: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
        criminalRecord: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
    });

    // Loading states for individual uploads
    protected readonly isUploadingFront = signal(false);
    protected readonly isUploadingBack = signal(false);
    protected readonly isUploadingRecord = signal(false);

    onFileSelected(event: Event, type: 'nationalIdFront' | 'nationalIdBack' | 'criminalRecord') {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return;

        const file = input.files[0];

        // Start upload
        if (type === 'nationalIdFront') this.isUploadingFront.set(true);
        if (type === 'nationalIdBack') this.isUploadingBack.set(true);
        if (type === 'criminalRecord') this.isUploadingRecord.set(true);

        this.registrationService.uploadDocument(file, type).subscribe({
            next: (response) => {
                this.documentsForm.patchValue({ [type]: response.data!.url });
                this.resetLoading(type);
            },
            error: () => {
                // error handling
                this.resetLoading(type);
            }
        });
    }

    private resetLoading(type: 'nationalIdFront' | 'nationalIdBack' | 'criminalRecord') {
        if (type === 'nationalIdFront') this.isUploadingFront.set(false);
        if (type === 'nationalIdBack') this.isUploadingBack.set(false);
        if (type === 'criminalRecord') this.isUploadingRecord.set(false);
    }

    onSubmit() {
        if (this.documentsForm.invalid) return;

        this.isSubmitting.set(true);
        this.registrationService.submitDocuments(this.documentsForm.getRawValue()).subscribe({
            next: (response) => {
                this.isSubmitting.set(false);
                if (response.success) {
                    console.log('Registration complete');
                    // Navigate to success or home
                    this.router.navigate(['/login']);
                }
            },
            error: () => {
                this.isSubmitting.set(false);
            }
        });
    }
}
