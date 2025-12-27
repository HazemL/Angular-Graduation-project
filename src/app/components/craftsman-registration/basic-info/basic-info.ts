import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CraftsmanRegistrationService } from '../../../services/craftsman-registration.service';
import { RegistrationStep } from '../../../../model/craftsman-registration.model';

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
    protected readonly errorMessage = signal<string | null>(null);
    protected readonly successMessage = signal<string | null>(null);

    protected steps = signal<RegistrationStep[]>([
        { stepNumber: 1, label: 'المعلومات الأساسية', isActive: true, isCompleted: false },
        { stepNumber: 2, label: 'المهنة والمهارات', isActive: false, isCompleted: false },
        { stepNumber: 3, label: 'مناطق الخدمة', isActive: false, isCompleted: false }
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
        rememberMe: new FormControl(false, { nonNullable: true }),
        isCraftsman: new FormControl(true, { nonNullable: true })
    }, { validators: passwordMatchValidator });

    constructor() {
        this.basicInfoForm.controls.isCraftsman.valueChanges.subscribe(isCraftsman => {
            this.updateSteps(isCraftsman ?? true);
        });
    }

    private updateSteps(isCraftsman: boolean): void {
        if (isCraftsman) {
            this.steps.set([
                { stepNumber: 1, label: 'المعلومات الأساسية', isActive: true, isCompleted: false },
                { stepNumber: 2, label: 'المهنة والمهارات', isActive: false, isCompleted: false },
                { stepNumber: 3, label: 'مناطق الخدمة', isActive: false, isCompleted: false }
            ]);
        } else {
            this.steps.set([
                { stepNumber: 1, label: 'المعلومات الأساسية', isActive: true, isCompleted: false }
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
        }
    }

    private showSuccessNotification(message: string): void {
        this.successMessage.set(message);
        this.errorMessage.set(null);
        setTimeout(() => this.successMessage.set(null), 5000);
    }

    private showErrorNotification(message: string): void {
        this.errorMessage.set(message);
        this.successMessage.set(null);
        setTimeout(() => this.errorMessage.set(null), 5000);
    }

    onSubmit(): void {
        if (this.basicInfoForm.invalid) {
            this.basicInfoForm.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);
        const formValue = this.basicInfoForm.getRawValue();
        const isCraftsman = formValue.isCraftsman ?? true;
        
        if (isCraftsman) {
            this.registrationService.setBasicInfoData({
                fullName: formValue.fullName,
                email: formValue.email,
                phone: formValue.phone,
                password: formValue.password,
                profilePhoto: this.profilePhotoUrl() ?? undefined,
                rememberMe: formValue.rememberMe,
                isCraftsman: true
            });
            
            this.isSubmitting.set(false);
            this.router.navigate(['/register/craftsman/profession']);
        } else {
            this.registrationService.submitCustomerRegistration({
                fullName: formValue.fullName,
                email: formValue.email,
                phone: formValue.phone,
                password: formValue.password,
                role: 'Customer',
                rememberMe: formValue.rememberMe
            }).subscribe({
                next: (response: any) => {
                    this.isSubmitting.set(false);
                    if (response.success) {
                        this.showSuccessNotification('تم التسجيل بنجاح! جاري تحويلك...');
                        
                        if (formValue.rememberMe && response.data?.token) {
                            document.cookie = `auth_token=${response.data.token}; path=/; max-age=${60*60*24*30}`;
                        }
                        
                        setTimeout(() => {
                            this.router.navigate(['/dashboard']);
                        }, 1500);
                    } else {
                        this.showErrorNotification(response.message || 'فشل التسجيل، يرجى المحاولة مرة أخرى');
                    }
                },
                error: (error: any) => {
                    this.isSubmitting.set(false);
                    const errorMsg = error.error?.message || error.message || 'حدث خطأ أثناء التسجيل';
                    this.showErrorNotification(errorMsg);
                }
            });
        }
    }

    navigateToLogin(): void {
        this.router.navigate(['/login']);
    }
}