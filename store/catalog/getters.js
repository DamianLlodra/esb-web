export default {
  totalComprado: ({ cart }) => {
    if (cart)
      return cart.reduce(
        (total, item) => Math.round((total + item.price) * item.amount, 2),
        0
      );
    else return 0;
  },
  getCategories: ({ categories }) => {
    if (categories) return categories;
    else return [];
  },
  getSubcategories: ({ subcategories }) => {
    if (subcategories) return subcategories;
    else return [];
  },
  getSubcategoriesByCategory: ({ subcategories, category }) => {
    if (subcategories) {
      return subcategories.filter(
        (subcategory) => subcategory.category === category
      );
    } else return [];
  },
  getProducts: ({ products }) => {
    if (products) return products;
    else return [];
  },
  getProductById: ({ products }, id) => {
    if (products) return products.find((product) => product.id === id);
    else return null;
  },
  getProductByName: ({ products }, name) => {
    if (products) return products.find((product) => product.name === name);
    else return null;
  },
  getProductByCategory: ({ products }, category) => {
    if (products)
      return products.filter((product) => product.category === category);
    else return [];
  },
  getProductBySubcategory: ({ products }, subcategory) => {
    if (products)
      return products.filter((product) => product.subcategory === subcategory);
    else return [];
  }
};
