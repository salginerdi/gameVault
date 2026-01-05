export interface Game {
    id: number;
    title: string;
    category: string;
    rating: number;
    coverImage: string;
    releaseDate: string;
    price: number;
    originalPrice?: number;
    isUpcoming?: boolean;
    trailerUrl?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
}