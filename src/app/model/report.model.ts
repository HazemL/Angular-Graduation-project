export interface ReportFormData {
    craftsmanId: string;
    reportType: string;
    description: string;
    incidentDate: string;
    attachments?: string[];
    alternativeContact?: string;
    preferredContactMethods: ContactMethod[];
    privacyAccepted: boolean;
}

export type ContactMethod = 'phone' | 'email' | 'whatsapp';

export interface ReportType {
    value: string;
    label: string;
}

export interface ReportedCraftsman {
    id: string;
    name: string;
    profession: string;
    profileImage: string;
}

export interface ReportTip {
    icon: string;
    text: string;
}
