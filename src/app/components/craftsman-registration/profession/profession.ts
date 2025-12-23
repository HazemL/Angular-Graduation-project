import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CraftsmanRegistrationService } from '../../../services/craftsman-registration.service';
import { CraftsmanServicesService } from '../../../services/craftsman-services.service';
import { RegistrationStep } from '../../../../model/craftsman-registration.model';
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
    private servicesService = inject(CraftsmanServicesService);
    private router = inject(Router);

    protected readonly isSubmitting = signal(false);
    protected readonly availableSkills = signal<string[]>([]);
    protected readonly isLoadingSkills = signal(false);

    protected readonly professions = this.servicesService.getAllServices();

    protected readonly steps: RegistrationStep[] = [
        { stepNumber: 1, label: 'المعلومات الأساسية', isActive: false, isCompleted: true },
        { stepNumber: 2, label: 'المهنة والمهارات', isActive: true, isCompleted: false },
        { stepNumber: 3, label: 'مناطق الخدمة', isActive: false, isCompleted: false },
        { stepNumber: 4, label: 'المستندات', isActive: false, isCompleted: false }
    ];

    protected readonly professionForm = new FormGroup({
        profession: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
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

    onProfessionChange(): void {
        const profession = this.professionForm.controls.profession.value;
        if (!profession) return;

        this.isLoadingSkills.set(true);
        this.availableSkills.set([]);
        this.professionForm.controls.skills.setValue([]); // Reset selected skills

        this.registrationService.getSkillsForProfession(profession).subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.availableSkills.set(response.data);
                }
                this.isLoadingSkills.set(false);
            },
            error: () => {
                // Fallback or error handling
                console.error('Failed to load skills');
                this.isLoadingSkills.set(false);
            }
        });
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

        this.isSubmitting.set(true);
        const formValue = this.professionForm.getRawValue();

        this.registrationService.submitProfessionSkills({
            profession: formValue.profession,
            skills: formValue.skills,
            yearsOfExperience: formValue.yearsOfExperience ?? undefined,
            description: formValue.description ?? undefined,
            previousWork: [] // Todo implementation
        }).subscribe({
            next: (response) => {
                this.isSubmitting.set(false);
                if (response.success) {
                    // Navigate to next step
                    // this.router.navigate(['/register/craftsman/service-areas']);
                    // For now, just log success or stay/notify
                    console.log('Profession and skills saved');
                }
            },
            error: () => {
                this.isSubmitting.set(false);
            }
        });
    }
}
