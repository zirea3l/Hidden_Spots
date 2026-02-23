export const calculateCompositeScore = ({
    vibe,
    uniqueness,
    safety, 
    crowd,
}) => {
    return (
        0.3 * vibe +
        0.3 * uniqueness +
        0.25 * safety + 
        0.15 * (6 - crowd)
    );
};
