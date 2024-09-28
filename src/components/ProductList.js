// ProductList.js
import React, { useState } from 'react';
import data from '../data/mock_products.json';
import Modal from './Modal'; // Import the new Modal component
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Cotton Classic Sneaker',
      discount: 20,
      type: 'percentage',
      variants: ['Size 9', 'Size 10'],
      showVariants: false,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal state
  const [currentProductIndex, setCurrentProductIndex] = useState(null); // To track the product being edited
  const [addedVariants, setAddedVariants] = useState([]);

  const addProduct = () => {
    const newProduct = {
      id: products.length + 1,
      name: 'New Product',
      discount: '',
      type: 'percentage',
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
    if (products.length > 1) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData('text/plain');
    const updatedProducts = [...products];

    const [removed] = updatedProducts.splice(dragIndex, 1);
    updatedProducts.splice(dropIndex, 0, removed);
    setProducts(updatedProducts);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleProductAdded = (product) => {
    product.variants.forEach((variant) => {
      setAddedVariants((prev) => [...prev, variant]);
    });
  };

  const handleVariantAdded = (variant) => {
    setAddedVariants((prev) => [...prev, variant]);
  };

  // Function to open the modal
  const openProductPicker = (index) => {
    setCurrentProductIndex(index); // Set the current product being edited
    setIsModalOpen(true); // Open modal
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className='product-list'>
      <h1 className='title'>Add Products</h1>
      <div className='columns'>
        <div className='column'>
          <h3>Product</h3>
        </div>
        <div className='column'>
          <h3>Discount</h3>
        </div>
      </div>

      {products.map((product, index) => (
        <div key={product.id}>
          <div
            className='columns'
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
          >
            <div className='column'>
              <div className='product-row'>
                <span className='serial-number'>{index + 1}.</span>
                <div className='product-info'>
                  <span className='product-name'>{product.name}</span>
                  {/* When clicking the edit button, open the modal */}
                  <button
                    className='edit-button'
                    onClick={() => openProductPicker(index)}
                  >
                    ✏️
                  </button>
                </div>
              </div>
            </div>
            <div className='column'>
              <div className='discount-row'>
                <input
                  type='text'
                  className='discount-input'
                  placeholder='Discount'
                  value={product.discount}
                  onChange={(e) => {
                    const updatedProducts = [...products];
                    updatedProducts[index].discount = e.target.value;
                    setProducts(updatedProducts);
                  }}
                />
                <select
                  className='discount-type'
                  value={product.type}
                  onChange={(e) => {
                    const updatedProducts = [...products];
                    updatedProducts[index].type = e.target.value;
                    setProducts(updatedProducts);
                  }}
                >
                  <option value='percentage'>% Off</option>
                  <option value='flat'>Flat</option>
                </select>
                <button
                  className='delete-button'
                  onClick={() => deleteProduct(product.id)}
                >
                  X
                </button>
              </div>
            </div>
          </div>

          {/* Show variants toggle */}
          {product.variants.length > 0 && (
            <div className='show-variants-container'>
              <button
                className='show-variants'
                onClick={() => toggleVariants(index)}
              >
                {product.showVariants ? 'Hide Variants' : 'Show Variants'}
              </button>
            </div>
          )}

          {/* Variants section */}
          {product.showVariants &&
            product.variants.map((variant, variantIndex) => (
              <div
                className='variant-row columns'
                key={`${product.id}-${variantIndex}`}
              >
                <div className='column'>
                  <div className='product-row'>
                    {/* No serial number for variants */}
                    <div className='product-info'>
                      <span className='product-name'>{variant}</span>
                    </div>
                  </div>
                </div>
                <div className='column'>
                  <div className='discount-row'>
                    <input
                      type='text'
                      className='discount-input'
                      placeholder='Discount'
                    />
                    <select className='discount-type'>
                      <option value='percentage'>% Off</option>
                      <option value='flat'>Flat</option>
                    </select>
                    <button className='delete-button'>X</button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ))}

      <button className='add-product-button' onClick={addProduct}>
        Add Product
      </button>

      {/* Modal box for product picker */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {/* Product picker content will go here */}
        <div>
          {data.map((product) => {
            return (
              <div key={product.id} className='modal-product'>
                <img src={product.image.src} width={100} height={100} />

                <input
                  value={product}
                  type='checkbox'
                  onChange={() => handleProductAdded(product)}
                />
                {product.title}

                {product.variants.map((variant) => {
                  return (
                    <div
                      key={`${product.id}-${variant.id}`}
                      className='product-variant'
                    >
                      <input
                        value={variant}
                        type='checkbox'
                        onChange={() => handleVariantAdded(variant)}
                      />
                      {variant.title}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div>
          <button className='add-button' onClick={() => {}}>
            Add
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductList;
