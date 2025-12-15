export interface Review {
    id: string;
    customerName: string;
    customerImage: string;
    rating: number;
    comment: string;
    images?: string[];
    createdAt: string;
    reply?: ReviewReply;
    isReplying?: boolean;
}

export interface ReviewReply {
    content: string;
    createdAt: string;
}

export interface RatingSummary {
    averageRating: number;
    totalReviews: number;
    distribution: RatingDistribution[];
}

export interface RatingDistribution {
    stars: number;
    percentage: number;
    color: string;
}

export interface ResponsePerformance {
    responseRate: number;
    averageResponseTime: string;
}

export interface SidebarLink {
    icon: string;
    label: string;
    route: string;
    isActive?: boolean;
}

export interface CraftsmanProfile {
    name: string;
    profession: string;
    profileImage: string;
}
