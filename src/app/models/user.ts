export interface User {
    firstName: string
    lastName: string
    email: string
    pass: string
    tel: string
    birthDate: string
    profileImage?: null
    favoriteGenres?: string[]
    totalReviews?: number
    averageRating?: number
    creationDate?: string
    twoFactorEnabled: boolean
    preferences?: {
        actionMovies: boolean,
        comedyMovies: boolean,
        dramaMovies: boolean,
        horrorMovies: boolean,
        sciFiMovies: boolean,
        actionSeries: boolean,
        comedySeries: boolean,
        dramaSeries: boolean,
        horrorSeries: boolean,
        sciFiSeries: boolean,
        newReleases: boolean,
        recommendations: boolean,
        language: 'portuguese'
    };
}

