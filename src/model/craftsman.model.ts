export interface Craftsman {
    id: string;
    name: string;
    profession: string;
    profileImage: string;
    rating: number;
    reviewCount: number;
    yearsOfExperience: number;
    priceRangeMin: number;
    priceRangeMax: number;
    serviceAreas: string[];
    isVerified: boolean;
    isPremium: boolean;
}

export interface SearchFilters {
    profession?: string;
    governorate?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    verifiedOnly?: boolean;
    minRating?: number;
}

export interface SearchResult {
    craftsmen: Craftsman[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
}

export interface FilterOption {
    value: string;
    label: string;
}

export interface BreadcrumbItem {
    label: string;
    url?: string;
    isActive?: boolean;
}
