# E-commerce Product Management Page

This is a React-based project designed for an e-commerce store owner to manage products and their variants, add discounts, and reorder items using drag-and-drop functionality. The project fetches products via an API and allows store owners to interact with a product picker to replace or add products.

## Features

- **Product List**: Display a list of selected products.
  - Support for multiple variants.
  - Show or hide variants option based on the number of variants.
  - Add discounts (either flat or percentage) to products or variants.
  - Change the order of products or variants using drag-and-drop.
  - Remove products from the list.
  
- **Product Picker**: A dialog box that fetches and displays a list of store products.
  - Opened by clicking the edit icon on a product.
  - Includes a search bar to find products by name.
  - Select multiple products and variants from the dialog.
  - Replace the existing product with newly selected products.

- **Scroll-based Pagination**: Load products incrementally as the user scrolls in the product picker. A maximum of 10 products is displayed initially, and more are loaded as the user reaches the bottom of the list.

## Getting Started

### Prerequisites
To run this project locally, you’ll need the following:
- **Node.js** (v14+)
- **npm** or **yarn**

