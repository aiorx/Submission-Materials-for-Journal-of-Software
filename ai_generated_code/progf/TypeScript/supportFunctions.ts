import { ProductWithCategory } from "@/types/types"
import { Review } from "@prisma/client"
// import { Product, Review } from "@/types/types"

export const stringShortner = (str: string, maxValue = 25) => {

    return (
        str.length > maxValue ?
            str.substring(0, maxValue) + "..." :
            str
    )
}

export const numberToCurrency = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        currency: "INR",
        style: "currency",
    }).format(price)
}

export const getAverage = (arr: number[]) => {
    if (arr.length === 0) {
        return 0
    }
    return arr.reduce((p, c) => p + c / arr.length)
}

//Written with routine coding tools
export const calculateAverageRating = (reviews: Review[] | undefined): number => {
    if (reviews === undefined) {
        return 0
    }
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
};

export const sortProductsByAverageRating = (products: ProductWithCategory[]): ProductWithCategory[] => {
    return products.slice().sort((a, b) => {

        const avgRatingA = a.reviews ? calculateAverageRating(a.reviews) : 0;
        const avgRatingB = b.reviews ? calculateAverageRating(b.reviews) : 0;

        if (avgRatingB.toPrecision(1) !== avgRatingA.toPrecision(1)) {
            return avgRatingB - avgRatingA; // Sort by average rating in descending order
        }

        return (b.reviews ? b.reviews.length : 0) - (a.reviews ? a.reviews.length : 0); // Sort by number of reviews in descending order
    });
};
