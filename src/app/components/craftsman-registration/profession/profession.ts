import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CraftsmanRegistrationService } from '../../../services/craftsman-registration.service';
import { HttpClient } from '@angular/common/http';
import { RegistrationStep } from '../../../../model/craftsman-registration.model';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-profession',
    templateUrl: './profession.html',
    styleUrl: './profession.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ReactiveFormsModule]
})
export class Profession {
    private registrationService = inject(CraftsmanRegistrationService);
    private http = inject(HttpClient);
    private router = inject(Router);

    protected readonly isSubmitting = signal(false);
    protected readonly availableSkills = signal<string[]>([]);
    protected readonly isLoadingSkills = signal(false);
    protected readonly professions = signal<any[]>([]);

    protected readonly steps: RegistrationStep[] = [
        { stepNumber: 1, label: 'المعلومات الأساسية', isActive: false, isCompleted: true },
        { stepNumber: 2, label: 'المهنة والمهارات', isActive: true, isCompleted: false },
        { stepNumber: 3, label: 'مناطق الخدمة', isActive: false, isCompleted: false }
    ];

    protected readonly professionForm = new FormGroup({
        professionId: new FormControl<number | null>(null, {
            validators: [Validators.required]
        }),
        professionName: new FormControl('', {
            nonNullable: true
        }),
        skills: new FormControl<string[]>([], {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(1)]
        }),
        yearsOfExperience: new FormControl<number | null>(null, {
            validators: [Validators.min(0), Validators.max(50)]
        }),
        description: new FormControl('', {
            validators: [Validators.maxLength(500)]
        })
    });

    constructor() {
        this.loadProfessions();
    }

    loadProfessions(): void {
        this.http.get<any[]>(`${environment.apiUrl}/api/professions`).subscribe({
            next: (professions) => {
                console.log('Loaded professions:', professions);
                this.professions.set(professions);
            },
            error: (err) => {
                console.error('Failed to load professions', err);
                // Fallback data in case API fails
                this.professions.set([
                    { id: 1, name: "Plumber", arabicName: "سباك", description: "Plumbing & pipe repair" },
                    { id: 2, name: "Carpenter", arabicName: "نجار", description: "Wood works & furniture" },
                    { id: 3, name: "Electrician", arabicName: "فني كهرباء", description: "Electrical installation & repair" }
                ]);
            }
        });
    }

    onProfessionChange(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        const selectedId = parseInt(selectElement.value);
        
        if (!selectedId) return;

        const selectedProfession = this.professions().find(p => p.id === selectedId);
        if (selectedProfession) {
            this.professionForm.controls.professionId.setValue(selectedId);
            this.professionForm.controls.professionName.setValue(selectedProfession.name);
        }

        this.isLoadingSkills.set(true);
        this.professionForm.controls.skills.setValue([]);
        
        // Mock skills - replace with actual API if available
        // You can create an endpoint like: /api/professions/${selectedId}/skills
        const mockSkills = ['إصلاح الأنابيب', 'تركيب المواسير', 'صيانة السباكة', 'كشف التسريبات'];
        setTimeout(() => {
            this.availableSkills.set(mockSkills);
            this.isLoadingSkills.set(false);
        }, 500);
    }

    onSkillToggle(skill: string, event: Event): void {
        const isChecked = (event.target as HTMLInputElement).checked;
        const currentSkills = this.professionForm.controls.skills.value;

        if (isChecked) {
            this.professionForm.controls.skills.setValue([...currentSkills, skill]);
        } else {
            this.professionForm.controls.skills.setValue(currentSkills.filter(s => s !== skill));
        }
    }

    isSkillSelected(skill: string): boolean {
        return this.professionForm.controls.skills.value.includes(skill);
    }

    onSubmit(): void {
        if (this.professionForm.invalid) {
            this.professionForm.markAllAsTouched();
            return;
        }

        const formValue = this.professionForm.getRawValue();
        
        this.registrationService.setProfessionData({
            professionId: formValue.professionId,
            professionName: formValue.professionName,
            skills: formValue.skills,
            yearsOfExperience: formValue.yearsOfExperience,
            description: formValue.description
        });

        this.router.navigate(['/register/craftsman/service-areas']);
    }
}