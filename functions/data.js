export default {
  getProductsLocal() {
    const productsLocalJson = localStorage.getItem('products');
    let productsLocal = [];
    if (productsLocalJson) {
      productsLocal = JSON.parse(productsLocalJson);
    }
    return productsLocal;
  },
  updateSubCategory(productsFromDb, subcategoriesFromDb) {
    for (const subcategory of subcategoriesFromDb) {
      const prds = productsFromDb.filter(
        (product) =>
          product.subfamilia ===
          subcategory.name.toLowerCase().replaceAll('/', '-')
      );
      subcategory.products = prds;
      localStorage.setItem(subcategory.id, JSON.stringify(subcategory));
    }
  },
  async updateLocalCatalog(that) {
    const productsLocal = this.getProductsLocal();
    const lastDownload = localStorage.getItem('lastDownload');
    let productsFromDb = [];
    let subcategoriesFromDb = [];
    const updcat = this.updateSubCategory;
    // console.log("productsLocal " + productsLocal.length);
    if (lastDownload && productsLocal.length > 0) {
      const lastDownloadDate = new Date(lastDownload);
      productsFromDb = await that.$dal.getLastUpdateProducts(lastDownloadDate);
      productsFromDb.forEach((productDB) => {
        const productLocal = productsLocal.find(
          (productLocal) => productDB.id === productLocal.id
        );
        if (productLocal) {
          const { id, producto, familia, subfamilia, lista } = productDB;
          productLocal.id = id;
          productLocal.producto = producto;
          productLocal.familia = familia;
          productLocal.subfamilia = subfamilia;
          productLocal.lista = lista;
        }
      });
      // console.log("products save " + productsLocal.length);
      localStorage.setItem('products', JSON.stringify(productsLocal));
      subcategoriesFromDb = await that.$dal.getAll('subcategories');
      updcat(productsLocal, subcategoriesFromDb);

      localStorage.setItem('lastDownload', new Date().toString());
    } else {
      subcategoriesFromDb = await that.$dal.getAll('subcategories');
      productsFromDb = await that.$dal.getAll('products');
      localStorage.setItem('products', JSON.stringify(productsFromDb));
      updcat(productsFromDb, subcategoriesFromDb);
      localStorage.setItem('lastDownload', new Date().toString());
    }
  },
};
