
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CraftsmanRegistrationService } from '../../../services/craftsman-registration.service';
import { RegistrationStep } from '../../../../model/craftsman-registration.model';

/**
 * Custom validator to check if password and confirmPassword match
 */
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
        return null;
    }

    const mismatch = password.value !== confirmPassword.value;
    
    if (mismatch) {
        confirmPassword.setErrors({ ...confirmPassword.errors, passwordMismatch: true });
    } else if (confirmPassword.hasError('passwordMismatch')) {
        // Remove the error if it was previously set and now they match
        const { passwordMismatch, ...remainingErrors } = confirmPassword.errors || {};
        confirmPassword.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
    }

    return mismatch ? { passwordMismatch: true } : null;
};

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

    // Reactive steps based on selection
    protected steps = signal<RegistrationStep[]>([
        { stepNumber: 1, label: 'المعلومات الأساسية', isActive: true, isCompleted: false },
        { stepNumber: 2, label: 'المهنة والمهارات', isActive: false, isCompleted: false },
        { stepNumber: 3, label: 'مناطق الخدمة', isActive: false, isCompleted: false },
        { stepNumber: 4, label: 'المستندات', isActive: false, isCompleted: false }
    ]);

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
        }),
        isCraftsman: new FormControl(true, { nonNullable: true })
    }, { validators: passwordMatchValidator });

    protected readonly passwordsMatch = computed(() => {
        const confirmPassword = this.basicInfoForm.get('confirmPassword');
        return confirmPassword?.touched && !confirmPassword.hasError('passwordMismatch') && confirmPassword.valid;
    });

    protected readonly isFormValid = computed(() => {
        return this.basicInfoForm.valid;
    });

    constructor() {
        // Monitor checkbox changes to update steps and service state
        this.basicInfoForm.controls.isCraftsman.valueChanges.subscribe(isCraftsman => {
            this.updateSteps(isCraftsman ?? true);
        });
    }

    private updateSteps(isCraftsman: boolean) {
        if (isCraftsman) {
            this.steps.set([
                { stepNumber: 1, label: 'المعلومات الأساسية', isActive: true, isCompleted: false },
                { stepNumber: 2, label: 'المهنة والمهارات', isActive: false, isCompleted: false },
                { stepNumber: 3, label: 'مناطق الخدمة', isActive: false, isCompleted: false },
                { stepNumber: 4, label: 'المستندات', isActive: false, isCompleted: false }
            ]);
        } else {
            this.steps.set([
                { stepNumber: 1, label: 'المعلومات الأساسية', isActive: true, isCompleted: false },
                { stepNumber: 2, label: 'المستندات', isActive: false, isCompleted: false }
            ]);
        }
    }

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
        console.log('Submit button clicked');
        if (this.basicInfoForm.invalid) {
            console.log('Form invalid', this.basicInfoForm.errors);
            this.basicInfoForm.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);
        const formValue = this.basicInfoForm.getRawValue();
        console.log('Submitting form data', formValue);

        this.registrationService.submitBasicInfo({
            fullName: formValue.fullName,
            email: formValue.email,
            phone: formValue.phone,
            nationalId: formValue.nationalId,
            password: formValue.password,
            profilePhoto: this.profilePhotoUrl() ?? undefined,
            termsAccepted: formValue.termsAccepted,
            isCraftsman: formValue.isCraftsman
        }).subscribe({
            next: (response) => {
                console.log('API Response', response);
                this.isSubmitting.set(false);
                if (response.success) {
                    console.log('Navigating to profession');
                    // Navigate to next step
                    this.registrationService.isCraftsman.set(formValue.isCraftsman ?? true);

                    if (formValue.isCraftsman) {
                        this.router.navigate(['/register/craftsman/profession']);
                    } else {
                        this.router.navigate(['/register/craftsman/documents']);
                    }
                } else {
                    console.error('Registration failed', response.message);
                    alert('Registration failed: ' + (response.message || 'Unknown error'));
                }
            },
            error: (error) => {
                console.error('API Error', error);
                this.isSubmitting.set(false);
                alert('An error occurred during registration. Please check console.');
            }
        });
    }

    navigateToLogin(): void {
        this.router.navigate(['/login']);
    }
}