export const getAllCategories = (products) => {
    if(!products || products.length === 0)
        return {};

    const result = {};
    products.forEach((item) => {
        const { category_header, category} = item;

        if (!result[category_header])
            result[category_header] = [];

        const categoryExists = result[category_header].some(
            (cat) => cat.category === category
        );
        if (!categoryExists)
            result[category_header].push({category: category,
                image: `${category.replaceAll(' ','-')}.png`});
    });
    return result;
};
export const getHappyHourProducts = (products) => {
    if (!products || products.length === 0)
        return [];
    const result = [];
    products.forEach((product) => {
        if (product.hasOwnProperty("happy_hours") && product.happy_hours === 1)
            result.push(product)
    });
    return result;
}