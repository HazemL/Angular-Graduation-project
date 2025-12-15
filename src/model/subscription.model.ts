export interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    icon: string;
    iconBgClass: string;
    iconColorClass: string;
    monthlyPrice: number;
    yearlyPrice: number;
    originalPrice?: number;
    features: PlanFeature[];
    buttonText: string;
    buttonClass: string;
    isDisabled?: boolean;
    isFeatured?: boolean;
    isCurrentPlan?: boolean;
}

export interface PlanFeature {
    text: string;
    included: boolean;
}

export interface ComparisonRow {
    feature: string;
    free: string | boolean;
    pro: string | boolean;
    premium: string | boolean;
    isHeader?: boolean;
}

export interface FAQ {
    question: string;
    answer: string;
    isOpen?: boolean;
}

export interface TrustBadge {
    icon: string;
    title: string;
    description: string;
}

export type BillingPeriod = 'monthly' | 'yearly';
