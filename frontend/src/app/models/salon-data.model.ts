export interface ServiceItem {
    id: string;
    name: string;
    price?: number;
    priceRange?: string; // e.g. "1700/1500"
    description?: string; // Poetic intro or details
    malePrice?: number;
    femalePrice?: number;
    isAddOn?: boolean; // e.g. "PF" (Per Finger) or "OP" (Onwards from Price)
    unit?: string; // "PF", "PS" (Per Streak)
}

export interface ServiceCategory {
    id: string;
    title: string;
    description?: string; // e.g. "Nurture your nails..."
    items: ServiceItem[];
    subcategories?: ServiceCategory[];
}

export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    hoverImage?: string; // Before/After
    category: string;
    description: string;
}

export interface Offer {
    id: string;
    title: string;
    description: string;
    code?: string;
    discountPercentage?: number;
    price?: number;
}
