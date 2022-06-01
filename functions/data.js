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
        (product) => product.subfamilia === subcategory.name.toLowerCase()
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
    if (lastDownload && productsLocal.length > 0) {
      const lastDownloadDate = new Date(lastDownload);
      productsFromDb = await that.$dal.getLastUpdateProducts(lastDownloadDate);
      productsFromDb.forEach((productDB) => {
        const productLocal = productsLocal.find(
          (productLocal) => productDB.id === productLocal.id
        );
        if (productLocal) {
          const {
            id,
            producto,
            familia,
            subfamilia,
            lista,
            precio1,
            precio2,
            hayStock,
          } = productDB;
          productLocal.id = id;
          productLocal.producto = producto;
          productLocal.familia = familia;
          productLocal.subfamilia = subfamilia;
          productLocal.lista = lista;
          productLocal.precio1 = precio1;
          productLocal.precio2 = precio2;
          productLocal.hayStock = hayStock;
        }
      });
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
