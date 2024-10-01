import React, { useState, useEffect, useCallback, useRef } from "react";
import Modal from "./Modal";
import "./ProductList.css";

const API_KEY = "72njgfa948d9aS7gs5";
const PRODUCTS_PER_PAGE = 10;

const ProductList = () => {
  const [products, setProducts] = useState([{
    id: 1,
    name: '',
    discount: '',
    type: 'percentage', 
    variants: [],
    showVariants: false,
  }]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState({});
  const [apiProducts, setApiProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (isModalOpen) {
      setApiProducts([]);
      setPage(0);
      setHasMore(true);
      setError(null);
      loadingRef.current = false;
      fetchProducts(0);
    }
  }, [isModalOpen, searchTerm]);

  const fetchProducts = async (newPage) => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setIsLoading(true);

    try {
      const url = `/task/products/search?search=${encodeURIComponent(searchTerm)}&page=${newPage}&limit=${PRODUCTS_PER_PAGE}`;
      console.log(`Fetching products: ${url}`);

      const response = await fetch(url, {
        headers: { "x-api-key": API_KEY },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data);

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setApiProducts((prevProducts) => [...prevProducts, ...data]);
        setPage(newPage + 1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(`Failed to fetch products: ${error.message}`);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  };

  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, clientHeight, scrollHeight } = e.target;
      if (
        scrollHeight - scrollTop <= clientHeight + 100 &&
        !loadingRef.current &&
        hasMore
      ) {
        fetchProducts(page);
      }
    },
    [page, hasMore]
  );

  const addProduct = () => {
    const newProduct = {
      id: products.length + 1,
      name: "",
      discount: "",
      type: "percentage",
      variants: [],
      showVariants: false,
    };
    setProducts([...products, newProduct]);
  };

  const toggleVariants = (index) => {
    const updatedProducts = [...products];
    updatedProducts[index].showVariants = !updatedProducts[index].showVariants;
    setProducts(updatedProducts);
  };

  const deleteProduct = (id) => {
    if(products.length > 1){
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDrop = (e, dropIndex) => {
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const updatedProducts = [...products];
    const [removed] = updatedProducts.splice(dragIndex, 1);
    updatedProducts.splice(dropIndex, 0, removed);
    setProducts(updatedProducts);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleVariantDragStart = (e, productIndex, variantIndex) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ productIndex, variantIndex }));
  };

  const handleVariantDrop = (e, productIndex, dropVariantIndex) => {
    e.preventDefault();
    const { productIndex: dragProductIndex, variantIndex: dragVariantIndex } = JSON.parse(e.dataTransfer.getData("text/plain"));

    if (productIndex !== dragProductIndex) return; // Ensure variants are only moved within the same product

    const updatedProducts = [...products];
    const [removedVariant] = updatedProducts[productIndex].variants.splice(dragVariantIndex, 1);
    updatedProducts[productIndex].variants.splice(dropVariantIndex, 0, removedVariant);

    setProducts(updatedProducts);
  };

  const handleVariantDragOver = (e) => {
    e.preventDefault();
  };

  const openProductPicker = (index) => {
    setCurrentProductIndex(index);
    setIsModalOpen(true);
    setSelectedProducts({});
    setApiProducts([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    loadingRef.current = false;
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setApiProducts([]);
    setPage(0);
    setHasMore(true);
    loadingRef.current = false;
  };

  const handleProductSelection = (product) => {
    const isProductSelected = selectedProducts[product.id]?.allSelected || false;
    setSelectedProducts((prev) => ({
      ...prev,
      [product.id]: {
        allSelected: !isProductSelected,
        variants: isProductSelected
          ? {}
          : product.variants.reduce((acc, variant) => {
              acc[variant.id] = true;
              return acc;
            }, {}),
        productData: product,
      },
    }));
  };

  const handleVariantSelection = (productId, variantId) => {
    const isVariantSelected = selectedProducts[productId]?.variants[variantId] || false;
    const updatedVariants = {
      ...selectedProducts[productId]?.variants,
      [variantId]: !isVariantSelected,
    };
    const anyVariantSelected = Object.values(updatedVariants).some(
      (selected) => selected
    );
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        allSelected: anyVariantSelected,
        variants: updatedVariants,
      },
    }));
  };

  const isProductSelected = (productId) => {
    return selectedProducts[productId]?.allSelected || false;
  };

  const isVariantSelected = (productId, variantId) => {
    return selectedProducts[productId]?.variants[variantId] || false;
  };

  const handleAddSelectedProducts = () => {
    const selectedProductsArray = apiProducts
      .filter((prod) => selectedProducts[prod.id] !== undefined)
      .map((product) => {
        const productVariants = product.variants || [];
        const productVariantsIdsSelected = Object.keys(
          selectedProducts[product.id].variants
        );
        const productVariantsSelected = productVariants.filter((p) => {
          console.log(p.id);
          return productVariantsIdsSelected.includes(`${p.id}`);
        });

        return {
          id: product.id,
          name: product?.title,
          discount: "",
          type: "percentage",
          variants: productVariantsSelected,
          showVariants: productVariantsSelected.length > 0,
        };
      });

    const updatedProducts = [
      ...products.slice(0, currentProductIndex),
      ...selectedProductsArray,
      ...products.slice(currentProductIndex + 1),
    ];

    setProducts(updatedProducts);
    setIsModalOpen(false);
    setSelectedProducts({});
  };

  return (
    <div className="product-list">
      <h1 className="title">Add Products</h1>
      <div className="columns">
        <div className="column">
          <h3>Product</h3>
        </div>
        <div className="column">
          <h3>Discount</h3>
        </div>
      </div>

      {products.map((product, productIndex) => (
        <div key={product.id}>
          <div
            className="columns"
            draggable
            onDragStart={(e) => handleDragStart(e, productIndex)}
            onDrop={(e) => handleDrop(e, productIndex)}
            onDragOver={handleDragOver}
          >
            <div className="column">
              <div className="product-row">
                <span className="serial-number">{productIndex + 1}.</span>
                <div className="product-info">
                  <span className="product-name">
                    {product.name || "Select Product"}
                  </span>
                  <button
                    className="edit-button"
                    onClick={() => openProductPicker(productIndex)}
                  >
                    ✏️
                  </button>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="discount-row">
                <input
                  type="text"
                  className="discount-input"
                  placeholder="Discount"
                  value={product.discount}
                  onChange={(e) => {
                    const updatedProducts = [...products];
                    updatedProducts[productIndex].discount = e.target.value;
                    setProducts(updatedProducts);
                  }}
                />
                <select
                  className="discount-type"
                  value={product.type}
                  onChange={(e) => {
                    const updatedProducts = [...products];
                    updatedProducts[productIndex].type = e.target.value;
                    setProducts(updatedProducts);
                  }}
                >
                  <option value="percentage">% Off</option>
                  <option value="flat">Flat</option>
                </select>
                <button
                  className="delete-button"
                  onClick={() => deleteProduct(product.id)}
                >
                  X
                </button>
              </div>
              {product.variants.length > 1 && (
                <div className="show-variants-container">
                  <button
                    className="show-variants"
                    onClick={() => toggleVariants(productIndex)}
                  >
                    {product.showVariants ? "Hide Variants" : "Show Variants"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {(product.variants.length === 1 || product.showVariants) &&
            product.variants.map((variant, variantIndex) => (
              <div
                className="variant-row columns"
                key={`${product.id}-${variantIndex}`}
                draggable
                onDragStart={(e) => handleVariantDragStart(e, productIndex, variantIndex)}
                onDrop={(e) => handleVariantDrop(e, productIndex, variantIndex)}
                onDragOver={handleVariantDragOver}
              >
                <div className="column column-flex">
                  <div className="product-row">
                    <div className="product-info">
                      <span className="product-name">{variant.title}</span>
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="discount-row">
                    <input
                      type="text"
                      className="discount-input"
                      placeholder="Discount"
                    />
                    <select className="discount-type">
                      <option value="percentage">% Off</option>
                      <option value="flat">Flat</option>
                    </select>
                    <button className="delete-button">X</button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ))}

      <button className="add-product-button" onClick={addProduct}>
        Add Product
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} onSearch={handleSearch}>
        <div className="product-picker-content" onScroll={handleScroll}>
          {error && <div className="error-message">{error}</div>}
          {apiProducts.map((product) => (
            <div key={product.id} className="product-container">
              <div className="product-row">
                <input
                  type="checkbox"
                  checked={isProductSelected(product.id)}
                  onChange={() => handleProductSelection(product)}
                />
                {product.image && product.image.src ? (
                  <img src={product.image.src} alt={product.title} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <span className="product-title">{product.title}</span>
              </div>

              <div className="variants-container">
                {product.variants.map((variant) => (
                  <div
                    key={`${product.id}-${variant.id}`}
                    className="variant-row"
                  >
                    <input
                      type="checkbox"
                      checked={isVariantSelected(product.id, variant.id)}
                      onChange={() =>
                        handleVariantSelection(product.id, variant.id)
                      }
                    />
                    <span className="variant-title">
                      {variant.title} - ${variant.price}
                      {variant.inventory_quantity !== undefined &&
                        ` (${variant.inventory_quantity} in stock)`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {isLoading && <div className="loading">Loading products...</div>}
          {!isLoading && !hasMore && (
            <div className="no-more-products">No more products to load</div>
          )}
        </div>

        <div className="modal-footer">
          <div className="footer-left">
            {
              Object.values(selectedProducts).filter(
                (product) => product.allSelected
              ).length
            }{" "}
            Products selected
          </div>
          <div className="footer-right">
            <button className="cancel-button" onClick={closeModal}>
              Cancel
            </button>
            <button className="add-button" onClick={handleAddSelectedProducts}>
              Add
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductList;