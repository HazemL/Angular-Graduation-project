import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CraftsmanRegistrationService } from '../../../services/craftsman-registration.service';
import { RegistrationStep } from '../../../models/craftsman-registration.model';

@Component({
    selector: 'app-basic-info',
    templateUrl: './basic-info.html',
    styleUrl: './basic-info.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule]
})
export class BasicInfoComponent {
    private readonly registrationService = inject(CraftsmanRegistrationService);
    private readonly router = inject(Router);

    protected readonly isSubmitting = signal(false);
    protected readonly showPassword = signal(false);
    protected readonly showConfirmPassword = signal(false);
    protected readonly profilePhotoUrl = signal<string | null>(null);

    protected readonly steps: RegistrationStep[] = [
        { stepNumber: 1, label: 'المعلومات الأساسية', isActive: true, isCompleted: false },
        { stepNumber: 2, label: 'المهنة والمهارات', isActive: false, isCompleted: false },
        { stepNumber: 3, label: 'مناطق الخدمة', isActive: false, isCompleted: false },
        { stepNumber: 4, label: 'المستندات', isActive: false, isCompleted: false }
    ];

    protected readonly basicInfoForm = new FormGroup({
        fullName: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(3)]
        }),
        email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email]
        }),
        phone: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.pattern(/^01[0125]\d{8}$/)]
        }),
        nationalId: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(14),
                Validators.maxLength(14),
                Validators.pattern(/^\d{14}$/)
            ]
        }),
        password: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(8)]
        }),
        confirmPassword: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        termsAccepted: new FormControl(false, {
            nonNullable: true,
            validators: [Validators.requiredTrue]
        })
    });

    protected readonly passwordsMatch = computed(() => {
        const password = this.basicInfoForm.get('password')?.value;
        const confirmPassword = this.basicInfoForm.get('confirmPassword')?.value;
        return password === confirmPassword;
    });

    protected readonly isFormValid = computed(() => {
        return this.basicInfoForm.valid && this.passwordsMatch();
    });

    togglePasswordVisibility(): void {
        this.showPassword.update(v => !v);
    }

    toggleConfirmPasswordVisibility(): void {
        this.showConfirmPassword.update(v => !v);
    }

    onPhotoUpload(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                this.profilePhotoUrl.set(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload to server
            this.registrationService.uploadProfilePhoto(file).subscribe({
                next: (response) => {
                    if (response.success && response.data) {
                        this.profilePhotoUrl.set(response.data.photoUrl);
                    }
                }
            });
        }
    }

    onSubmit(): void {
        if (!this.isFormValid()) {
            this.basicInfoForm.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);
        const formValue = this.basicInfoForm.getRawValue();

        this.registrationService.submitBasicInfo({
            fullName: formValue.fullName,
            email: formValue.email,
            phone: formValue.phone,
            nationalId: formValue.nationalId,
            password: formValue.password,
            profilePhoto: this.profilePhotoUrl() ?? undefined,
            termsAccepted: formValue.termsAccepted
        }).subscribe({
            next: (response) => {
                this.isSubmitting.set(false);
                if (response.success) {
                    // Navigate to next step
                    this.router.navigate(['/register/craftsman/profession']);
                }
            },
            error: () => {
                this.isSubmitting.set(false);
            }
        });
    }
}
