import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionsService } from '../../../services/subscriptions.service';
import { BillingPeriod, ComparisonRow, FAQ, SubscriptionPlan, TrustBadge } from '../../../../model/subscription.model';

@Component({
    selector: 'app-pricing-page',
    templateUrl: './pricing-page.html',
    styleUrl: './pricing-page.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: []
})
export class PricingPageComponent {
    private readonly subscriptionsService = inject(SubscriptionsService);
    private readonly router = inject(Router);

    protected readonly billingPeriod = signal<BillingPeriod>('monthly');
    protected readonly isLoading = signal(false);

    protected readonly userImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhFUo5GL6YtptIdb-H5itWiH2onhNbbPj_EYvvn62aoQk99Kq5v49Q01SPeJR6HA5p_9fR2qUDpWshZVGPpGZlCoIxx1kMwUhY30Hn6utYgSoNHmQFapMz55cqFiJFGEMLDck1Q3-kCVQJXhqhXRN3U0E3nwksFqOtUi_-MB0ZZkUdfXzT9C21C8RydohwnOb6jaYMPrNfkOmnnyDB6zTgnElOVkDr66CabATWrRqyDiyPxYw-pMGWGey4QWIvlkwTE6kivC5mn_3g';

    protected readonly plans: SubscriptionPlan[] = [
        {
            id: 'free',
            name: 'مجاني',
            description: 'للبداية واكتشاف المنصة.',
            icon: 'badge',
            iconBgClass: 'bg-light',
            iconColorClass: 'text-secondary',
            monthlyPrice: 0,
            yearlyPrice: 0,
            features: [
                { text: 'ملف شخصي أساسي', included: true },
                { text: 'إضافة حتى 5 صور', included: true },
                { text: 'تقييمات غير محدودة', included: true },
                { text: 'أولوية في نتائج البحث', included: false },
                { text: 'شارة "مميز"', included: false },
                { text: 'إحصائيات متقدمة', included: false }
            ],
            buttonText: 'الباقة الحالية',
            buttonClass: 'btn-secondary',
            isDisabled: true,
            isCurrentPlan: true
        },
        {
            id: 'pro',
            name: 'احترافي',
            description: 'للحرفيين الطموحين للنمو.',
            icon: 'workspace_premium',
            iconBgClass: 'bg-primary-light',
            iconColorClass: 'text-primary-custom',
            monthlyPrice: 299,
            yearlyPrice: 239,
            originalPrice: 349,
            features: [
                { text: 'كل مميزات الباقة المجانية', included: true },
                { text: 'أولوية عالية في نتائج البحث', included: true },
                { text: 'إضافة حتى 20 صورة/فيديو', included: true },
                { text: 'شارة "Pro Member"', included: true },
                { text: 'إحصائيات أساسية', included: true },
                { text: 'ظهور في الصفحة الرئيسية', included: true },
                { text: 'دعم مخصص', included: false }
            ],
            buttonText: 'اشترك الآن',
            buttonClass: 'btn-primary-custom',
            isFeatured: true
        },
        {
            id: 'premium',
            name: 'بريميوم',
            description: 'الأفضل للمحترفين والشركات.',
            icon: 'verified',
            iconBgClass: 'bg-warning-light',
            iconColorClass: 'text-warning',
            monthlyPrice: 599,
            yearlyPrice: 479,
            features: [
                { text: 'كل مميزات الباقة الاحترافية', included: true },
                { text: 'أولوية قصوى في البحث', included: true },
                { text: 'صور/فيديوهات غير محدودة', included: true },
                { text: 'شارة "Premium" ذهبية', included: true },
                { text: 'إحصائيات متقدمة كاملة', included: true },
                { text: 'ظهور مميز في كل الصفحات', included: true },
                { text: 'دعم مخصص 24/7', included: true }
            ],
            buttonText: 'اشترك الآن',
            buttonClass: 'btn-dark-custom'
        }
    ];

    protected readonly comparisonRows: ComparisonRow[] = [
        { feature: 'الأساسيات', free: '', pro: '', premium: '', isHeader: true },
        { feature: 'ملف شخصي', free: 'أساسي', pro: 'متقدم', premium: 'كامل' },
        { feature: 'معرض الأعمال', free: 'حتى 5', pro: 'حتى 20', premium: 'غير محدود' },
        { feature: 'شارة الملف', free: '—', pro: 'Pro', premium: 'Premium' },
        { feature: 'الظهور والوصول', free: '', pro: '', premium: '', isHeader: true },
        { feature: 'أولوية البحث', free: 'عادي', pro: 'عالية', premium: 'قصوى' },
        { feature: 'ظهور الصفحة الرئيسية', free: false, pro: true, premium: true },
        { feature: 'الأدوات والدعم', free: '', pro: '', premium: '', isHeader: true },
        { feature: 'تحليلات وإحصائيات', free: false, pro: 'أساسية', premium: 'متقدمة' },
        { feature: 'دعم فني', free: 'عبر البريد', pro: 'أولوية', premium: 'مخصص 24/7' }
    ];

    protected readonly faqs: FAQ[] = [
        {
            question: 'هل يمكنني تغيير باقتي لاحقًا؟',
            answer: 'نعم بالطبع. يمكنك ترقية أو تخفيض باقتك في أي وقت من خلال لوحة التحكم الخاصة بك. سيتم احتساب الفارق بشكل تناسبي.'
        },
        {
            question: 'ما هي طرق الدفع المتاحة؟',
            answer: 'نقبل جميع بطاقات الائتمان والخصم الرئيسية (فيزا، ماستركارد)، بالإضافة إلى المحافظ الإلكترونية المحلية مثل فودافون كاش.'
        },
        {
            question: 'هل الاشتراك السنوي يتجدد تلقائيًا؟',
            answer: 'نعم، لضمان عدم انقطاع الخدمة، يتم تجديد جميع الاشتراكات تلقائيًا. يمكنك إلغاء التجديد التلقائي في أي وقت قبل تاريخ التجديد من إعدادات حسابك.'
        }
    ];

    protected readonly trustBadges: TrustBadge[] = [
        { icon: 'verified_user', title: 'دفع آمن 100%', description: 'نستخدم أحدث تقنيات التشفير لحماية بياناتك.' },
        { icon: 'support_agent', title: 'ضمان استرداد الأموال', description: 'استرد أموالك خلال 14 يومًا إذا لم تكن راضيًا.' },
        { icon: 'cancel', title: 'إلغاء في أي وقت', description: 'لا توجد عقود طويلة الأمد، يمكنك الإلغاء بسهولة.' }
    ];

    protected readonly currentPrice = computed(() => {
        return (plan: SubscriptionPlan) =>
            this.billingPeriod() === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    });

    setBillingPeriod(period: BillingPeriod): void {
        this.billingPeriod.set(period);
    }

    subscribe(plan: SubscriptionPlan): void {
        if (plan.isDisabled) return;

        this.isLoading.set(true);
        this.subscriptionsService.subscribe(plan.id, this.billingPeriod()).subscribe({
            next: (response) => {
                this.isLoading.set(false);
                if (response.success && response.data) {
                    window.location.href = response.data.checkoutUrl;
                }
            },
            error: () => this.isLoading.set(false)
        });
    }

    toggleFaq(index: number): void {
        this.faqs[index].isOpen = !this.faqs[index].isOpen;
    }

    isBoolean(value: unknown): value is boolean {
        return typeof value === 'boolean';
    }
}
