import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CraftsmanRegistrationService } from '../../../services/craftsman-registration.service';
import { GovernorateCitiesService } from '../../../services/governorate-cities.service';
import { RegistrationStep } from '../../../../model/craftsman-registration.model';

@Component({
    selector: 'app-service-areas',
    templateUrl: './service-areas.html',
    styleUrl: './service-areas.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ReactiveFormsModule, KeyValuePipe, CommonModule]
})
export class ServiceAreas {
    private registrationService = inject(CraftsmanRegistrationService);
    private governorateCitiesService = inject(GovernorateCitiesService);
    private router = inject(Router);

    protected readonly isSubmitting = signal(false);
    protected readonly governorates = signal<any[]>([]);
    protected readonly availableCities = signal<any[]>([]);
    protected readonly errorMessage = signal<string | null>(null);
    protected readonly successMessage = signal<string | null>(null);

    protected readonly selectedGovernorateId = signal<number | null>(null);
    protected readonly selectedCityId = signal<number | null>(null);

    protected readonly steps: RegistrationStep[] = [
        { stepNumber: 1, label: 'المعلومات الأساسية', isActive: false, isCompleted: true },
        { stepNumber: 2, label: 'المهنة والمهارات', isActive: false, isCompleted: true },
        { stepNumber: 3, label: 'مناطق الخدمة', isActive: true, isCompleted: false }
    ];

    protected readonly currentGovernorate = new FormControl<number | null>(null);
    protected readonly currentCity = new FormControl<number | null>(null);

    constructor() {
        this.loadGovernorates();
    }

    loadGovernorates(): void {
        this.governorateCitiesService.getGovernorates().subscribe({
            next: (govs) => {
                console.log('Loaded governorates:', govs);
                this.governorates.set(govs);
            },
            error: (err) => console.error('Failed to load governorates', err)
        });
    }

 onGovernorateChange(): void {
    const rawValue = this.currentGovernorate.value;
    const selectedGovId = rawValue == null ? null : Number(rawValue);

    if (selectedGovId == null) {
        this.availableCities.set([]);
        this.selectedCityId.set(null);
        this.selectedGovernorateId.set(null);
        return;
    }

    const gov = this.governorates().find(g => g.id === selectedGovId);
    if (!gov) return;

    this.selectedGovernorateId.set(gov.id);

    this.governorateCitiesService.getCitiesByGovernorate(gov.name).subscribe({
        next: (filtered) => {
            this.availableCities.set(filtered);
            this.currentCity.setValue(null);
            this.selectedCityId.set(null);
        },
        error: (err) => console.error('Failed to load cities', err)
    });
}


    onCityChange(): void {
        const raw = this.currentCity.value;
        const selectedCityId = raw == null ? null : Number(raw);
        if (selectedCityId == null) return;

        const city = this.availableCities().find(c => c.id === selectedCityId);
        if (city) {
            console.log('Selected city:', city);
            this.selectedCityId.set(city.id);
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
        if (!this.selectedGovernorateId() || !this.selectedCityId()) {
            this.showErrorNotification('يرجى اختيار المحافظة والمدينة');
            return;
        }

        this.isSubmitting.set(true);

        this.registrationService.submitCraftsmanRegistration(
            this.selectedGovernorateId()!,
            this.selectedCityId()!
        ).subscribe({
            next: (response: any) => {
                this.isSubmitting.set(false);
                if (response.success) {
                    this.showSuccessNotification('تم التسجيل بنجاح! جاري تحويلك...');
                    
                    this.registrationService.clearRegistrationData();
                    
                    setTimeout(() => {
                        this.router.navigate(['/dashboard']);
                    }, 1500);
                } else {
                    this.showErrorNotification(response.message || 'فشل التسجيل');
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