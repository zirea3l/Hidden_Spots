export const calculateTrendingScore = (place) => {

    let score = 0;

    score += place.compositeScore * 3;
    score += place.likesCount * 2;
    score += place.commentsCount * 2;

    const daysOld =
    (Date.now() - new Date(place.createdAt)) /
    (1000 * 60 * 60 * 24);

    if (daysOld < 7) {
        score += 5;
    }

    return score;
};