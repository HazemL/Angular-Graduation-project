import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, KeyValuePipe, AsyncPipe } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    imports: [ReactiveFormsModule, KeyValuePipe, AsyncPipe]
})
export class ServiceAreas {
    private registrationService = inject(CraftsmanRegistrationService);
    private governorateCitiesService = inject(GovernorateCitiesService);
    private router = inject(Router);

    protected readonly isSubmitting = signal(false);
    protected readonly governorates = this.governorateCitiesService.getGovernorateNames();
    protected readonly availableCities = signal<string[]>([]);

    // Track selected cities per governorate: { 'Cairo': ['Maadi', 'Nasr City'], ... }
    protected readonly selectedAreas = signal<Map<string, string[]>>(new Map());

    protected readonly steps: RegistrationStep[] = [
        { stepNumber: 1, label: 'المعلومات الأساسية', isActive: false, isCompleted: true },
        { stepNumber: 2, label: 'المهنة والمهارات', isActive: false, isCompleted: true },
        { stepNumber: 3, label: 'مناطق الخدمة', isActive: true, isCompleted: false },
        { stepNumber: 4, label: 'المستندات', isActive: false, isCompleted: false }
    ];

    protected readonly areasForm = new FormGroup({
        // Minimal validation on the form group level can be custom, 
        // but we'll track validity via the selectedAreas signal length primarily
    });

    // Temporary controls for the "Add Area" section
    protected readonly currentGovernorate = new FormControl('', { nonNullable: true });
    protected readonly currentCity = new FormControl('', { nonNullable: true });

    onGovernorateChange(): void {
        const selectedGov = this.currentGovernorate.value;
        if (selectedGov) {
            this.governorateCitiesService.getCityNamesByGovernorate(selectedGov).subscribe(names => {
                this.availableCities.set(names);
            });
            this.currentCity.setValue(''); // Reset city selection
        } else {
            this.availableCities.set([]);
        }
    }

    addArea(): void {
        const gov = this.currentGovernorate.value;
        const city = this.currentCity.value;

        if (!gov || !city) return;

        this.selectedAreas.update(areas => {
            const newAreas = new Map(areas);
            const currentCities = newAreas.get(gov) || [];
            if (!currentCities.includes(city)) {
                newAreas.set(gov, [...currentCities, city]);
            }
            return newAreas;
        });

        // Optional: clear selection after adding
        // this.currentCity.setValue('');
    }

    removeArea(gov: string, city: string): void {
        this.selectedAreas.update(areas => {
            const newAreas = new Map(areas);
            const currentCities = newAreas.get(gov) || [];
            const updatedCities = currentCities.filter(c => c !== city);

            if (updatedCities.length === 0) {
                newAreas.delete(gov);
            } else {
                newAreas.set(gov, updatedCities);
            }
            return newAreas;
        });
    }

    get totalSelectedAreas(): number {
        let count = 0;
        this.selectedAreas().forEach(cities => count += cities.length);
        return count;
    }

    onSubmit(): void {
        if (this.totalSelectedAreas === 0) {
            // Show error (could be a toast or a simple ALERT if no UI element exists)
            alert('يرجى اختيار منطقة واحدة على الأقل');
            return;
        }

        this.isSubmitting.set(true);

        const governoratesList: string[] = [];
        const citiesList: string[] = [];

        this.selectedAreas().forEach((cities, gov) => {
            governoratesList.push(gov);
            citiesList.push(...cities);
        });

        this.registrationService.submitServiceAreas({
            governorates: governoratesList,
            cities: citiesList
        }).subscribe({
            next: (response) => {
                this.isSubmitting.set(false);
                if (response.success) {
                    // Navigate to next step
                    // this.router.navigate(['/register/craftsman/documents']);
                    console.log('Service areas saved');
                }
            },
            error: () => {
                this.isSubmitting.set(false);
            }
        });
    }
}
