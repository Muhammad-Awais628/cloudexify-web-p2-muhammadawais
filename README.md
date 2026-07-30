# Monarch Sole - Premium Sneaker E-Commerce Platform
## Project Report — CloudExify Summer Internship 2026

**Submitted By:** Muhammad Awais
**Registrtion Number:** CX-INT-2026-GEN-0154
**Technology Stack:** HTML5, CSS3, JavaScript (Vanilla JS), Bootstrap
**Project Type:** E-Commerce Platform
**Development Environment:** Visual Studio Code, Google Chrome, Git & GitHub
**Submitted To:** CloudExify Summer Internship 2026


## 📋 Overview

**Monarch Sole** is a modern, responsive e-commerce platform specializing in premium sneaker sales. Built with vanilla HTML, CSS, and JavaScript, it features a sleek interface with dark mode support, advanced filtering, and a complete shopping experience—from product browsing to checkout.

Designed for performance with optimized asset loading, the platform serves customers in Pakistan and internationally.

---

## ✨ Features

### 🛍️ Shopping Experience
- **Product Browsing** - Dedicated pages for Men's and Women's collections
- **Sale Section** - Featured discounted items with up to 60% off
- **Advanced Search** - Real-time product search by name, brand, or category
- **Filtering & Sorting** - Filter by category, price range; sort by price (low to high or vice versa)
- **Product Details** - Detailed product pages with images, pricing, and size selection
- **Image Viewer** - Enlarged product image viewing with modal overlay

### 🛒 Cart & Checkout
- **Shopping Cart** - Add/remove items, quantity adjustment
- **Wishlist** - Save items for later (badge counter in header)
- **Checkout Form** - Customer information collection with form validation
- **LocalStorage Persistence** - Cart and wishlist data saved between sessions

### 🎨 User Interface
- **Dark Mode Toggle** - Theme switcher with persistent preference
- **Responsive Design** - Mobile-first layout works seamlessly on all devices
- **Bootstrap 5 Framework** - Professional, accessible component library
- **Custom Animations** - Fade-in effects and scroll animations
- **Toast Notifications** - Real-time feedback for user actions

### ⏰ Additional Features
- **Countdown Timer** - "Drop In" timer for upcoming releases
- **Newsletter Signup** - Email subscription with validation
- **Contact Form** - Customer inquiry and complaint submission
- **Comprehensive Policies** - Privacy, Terms, Cookies, Shipping, Returns pages

---

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **HTML5** | — | Semantic markup & structure |
| **CSS3** | — | Styling & animations |
| **JavaScript (ES6+)** | — | Dynamic functionality & interactivity |
| **Bootstrap** | 5.3.7 | Responsive grid & components |
| **Bootstrap Icons** | 1.11.3 | Icon library |
| **Google Fonts** | Poppins | Typography |
| **LocalStorage API** | — | Client-side data persistence |

---

## 📁 Project Structure

```
monarch-sole/
│
├── index.html                 # Homepage with hero banner & categories
├── men.html                   # Men's sneaker collection
├── women.html                 # Women's sneaker collection
├── sale.html                  # Sale/discounted products
├── product.html               # Individual product detail page
├── search.html                # Search results page
├── cart.html                  # Shopping cart review
├── checkout.html              # Order checkout form
├── wishlist.html              # Saved items page
├── contact.html               # Contact form & support info
├── privacy.html               # Privacy policy
├── terms.html                 # Terms & conditions
├── cookies.html               # Cookie policy
├── shipping.html              # Shipping information
├── returns.html               # Return & refund policy
│
├── js/
│   ├── data.js                # Product database & constants
│   └── script.js              # Main application logic
│
├── components/
│   ├── header.html            # Navigation bar (dynamically loaded)
│   └── footer.html            # Footer with links & contact info (dynamically loaded)
│
├── assets/
│   ├── logo.jpg               # Brand logo (favicon)
│   ├── hero-banner-split.jpeg # Homepage hero image
│   ├── mencover.jpg           # Men's category cover image
│   ├── womencover.jpg         # Women's category cover image
│   └── [product-images]/      # Product images
│
│── style.css              # All styling (responsive, dark mode, animations)
│
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Code editor (VS Code recommended)
- Local web server (optional but recommended for best results)

### Installation

1. **Clone or Download the Project**
   ```bash
   git clone <https://github.com/Muhammad-Awais628/cloudexify-web-p2-muhammadawais>
   cd monarch-sole
   ```

2. **Install a Local Server** (Optional but recommended)
   - Using Python 3:
     ```bash
     python -m http.server 8000
     ```
   - Using Python 2:
     ```bash
     python -m SimpleHTTPServer 8000
     ```
   - Or use VS Code extension: **Live Server**

3. **Open in Browser**
   - Without server: Open `index.html` directly in your browser
   - With server: Navigate to `http://localhost:8000`

---

## 📖 Usage

### For Customers

1. **Browse Products**
   - Start at homepage → Click "Shop Now" or navigate via menu
   - Use Men/Women collection pages or Sale section

2. **Search & Filter**
   - Use the search bar in the header
   - Apply category and price filters
   - Sort by price preference

3. **View Product Details**
   - Click on any product card
   - Click product image for enlarged view
   - Select size and quantity

4. **Manage Cart & Wishlist**
   - Add items to cart (yellow button) or wishlist (heart icon)
   - View cart badge for item count
   - Proceed to checkout when ready

5. **Complete Purchase**
   - Fill in checkout form with customer details
   - Form validation ensures all required fields are complete
   - Submit order

### For Developers

#### Adding New Products
Edit `js/data.js`:
```javascript
const products = [
  {
    id: 1,
    name: "Product Name",
    brand: "Brand Name",
    price: 129.99,
    category: "men", // or "women"
    type: "new", // "new", "sale", or empty
    image: "assets/product-image.jpg",
    description: "Product description",
    sizes: [6, 7, 8, 9, 10, 11, 12],
    colors: ["Black", "White"]
  }
  // ... more products
];
```

#### Customizing Styling
Edit `css/style.css`:
- Color schemes defined at top (CSS variables)
- Dark mode styles in `@media (prefers-color-scheme: dark)`
- Responsive breakpoints use Bootstrap conventions

#### Modifying Features
Main logic in `js/script.js`:
- `loadHeader()` / `loadFooter()` - Load components dynamically
- `renderProducts()` - Display product listings
- `addToCart()` / `addToWishlist()` - Shopping functionality
- `applyFilters()` / `sortProducts()` - Filter/sort logic
- `toggleTheme()` - Dark mode functionality

---

## 🎯 Key Features Explained

### Dynamic Component Loading
Header and footer are loaded dynamically to avoid repetition:
```javascript
fetch('components/header.html')
  .then(response => response.text())
  .then(data => document.getElementById('header').innerHTML = data);
```

### LocalStorage for Persistence
Cart and wishlist survive page refreshes:
```javascript
localStorage.setItem('cart', JSON.stringify(cartItems));
const cart = JSON.parse(localStorage.getItem('cart')) || [];
```

### Responsive Grid System
Bootstrap 5's 12-column grid ensures mobile-friendly layout:
```html
<div class="col-lg-6 col-md-6 col-12">
  <!-- Content adapts: full width on mobile, 6 cols on larger screens -->
</div>
```

### Dark Mode Toggle
Checkbox persists theme preference:
```javascript
const isDark = localStorage.getItem('theme') === 'dark';
document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
```

---

## ⚡ Performance Optimizations

### Preconnect to External Resources
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
```

### Lazy Loading Images
```html
<img src="..." loading="lazy" alt="...">
```

### Deferred Script Loading
```html
<script src="..." defer></script>
```

### Non-Blocking Icon Font
```html
<link rel="preload" as="style" href="..." onload="this.rel='stylesheet'">
```

### Fetchpriority on Hero Image
```html
<img src="..." fetchpriority="high" alt="...">
```

---

## 🌐 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Latest 2 versions |
| Firefox | ✅ Full | Latest 2 versions |
| Safari | ✅ Full | Latest 2 versions |
| Edge | ✅ Full | Latest 2 versions |

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (single column)
- **Tablet**: 768px - 991px (2 columns)
- **Desktop**: ≥ 992px (3-4 columns)

---

## 🔒 Security & Data Privacy

- **No Backend**: Client-side only (data not sent anywhere)
- **LocalStorage Only**: Cart/wishlist stored locally on device
- **Form Validation**: Client-side validation before submission
- **Privacy Policy**: Included in footer

---

## 🎨 Customization Guide

### Change Brand Colors
In `css/style.css`, update CSS variables:
```css
:root {
  --primary-color: #FFD700;  /* Warning/Gold */
  --dark-bg: #1a1a1a;        /* Dark background */
  --text-light: #e0e0e0;     /* Light text */
}
```

### Modify Font
Replace Poppins link in HTML files:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;600;700&display=swap" rel="stylesheet">
```

### Update Contact Information
Edit `footer.html` and `contact.html`:
- Email: `support@monarchsole.com`
- Phone: `+92 300 1234567`
- Location: `Lahore, Pakistan`
- Hours: Monday-Friday 9AM-6PM, Saturday 10AM-4PM

---

## 📋 Pages Overview

| Page | Purpose | Features |
|------|---------|----------|
| `index.html` | Homepage | Hero banner, categories, newsletter signup |
| `men.html` | Men's Collection | Product grid, filters, sorting |
| `women.html` | Women's Collection | Product grid, filters, sorting |
| `sale.html` | Sale Items | Discounted products, category filters |
| `product.html` | Product Detail | Full product info, size selection, reviews ready |
| `search.html` | Search Results | Dynamic results based on query |
| `cart.html` | Shopping Cart | Item review, quantity adjustment |
| `checkout.html` | Checkout | Customer form, order summary |
| `wishlist.html` | Saved Items | View/manage wishlist items |
| `contact.html` | Support | Contact form, business hours |
| `privacy.html` | Legal | Privacy policy text |
| `terms.html` | Legal | Terms & conditions |
| `cookies.html` | Legal | Cookie policy |
| `shipping.html` | Info | Shipping rates & timelines |
| `returns.html` | Info | Return policy details |

---

## 🔧 Maintenance & Updates

### Regular Tasks
- Update product data in `js/data.js`
- Monitor form submissions (currently local only)
- Test across browsers monthly
- Check CDN links for availability
- Update contact information as needed

### Potential Enhancements
- [ ] Backend integration (Node.js/Express)
- [ ] Payment gateway (Stripe, PayPal)
- [ ] User authentication & accounts
- [ ] Order tracking system
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Product reviews & ratings
- [ ] Inventory management

---

## 📞 Support & Contact

**Business Information**
- **Location**: Lahore, Pakistan
- **Email**: support@monarchsole.com
- **Phone**: +92 300 1234567
- **Hours**: Mon-Fri 9AM-6PM, Sat 10AM-4PM

**Social Media**
- Facebook: @monarchsole
- Instagram: @monarchsole
- Twitter/X: @monarchsole
- YouTube: @monarchsole

---

## 📄 License

© 2026 Monarch Sole. All Rights Reserved.

This project is proprietary and not open source. Unauthorized copying or distribution is prohibited.

---

## 👨‍💻 Developer Notes

### Best Practices Implemented
✅ Semantic HTML  
✅ Mobile-first responsive design  
✅ Accessibility (ARIA labels, alt text)  
✅ Performance optimizations  
✅ CSS custom properties for maintainability  
✅ Consistent naming conventions  
✅ Modular code structure  
✅ Form validation  

### Testing Checklist
✅ All pages load without errors
✅ Responsive on mobile, tablet, desktop
✅ Cart persists after page reload
✅ Dark mode toggles correctly
✅ All forms validate properly
✅ Images load and display correctly
✅ Links navigate to correct pages
✅ Search functionality works
✅ Countdown timer displays

---

## 📈 Analytics & Tracking

Currently, no analytics are implemented. For production, consider adding:
- Google Analytics
- Hotjar heatmaps
- Conversion tracking
- User behavior analysis

---

## 🚨 Known Limitations

1. **No Backend**: All data is client-side only
2. **No Payment Processing**: Checkout is form-only
3. **No Email Notifications**: Forms don't send emails
4. **No Inventory Management**: No real stock tracking
5. **No User Accounts**: No authentication system
6. **No Order History**: Orders not persisted

---

## 🎓 Learning Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [JavaScript Guide](https://javascript.info/)
- [CSS Tricks](https://css-tricks.com/)
- [Web Performance](https://web.dev/performance/)

---

## 📝 Changelog

### Version 1.0.0 (Current)
- Initial release
- Complete product browsing experience
- Shopping cart & wishlist
- Checkout form
- Dark mode toggle
- Responsive design
- Performance optimizations

---

**Last Updated**: July 2026  
**Version**: 1.0.0  
**Status**: Active

## Project Information
**Project Title:** E-Commerce Platform
**Developed By:** Muhammad Awais
**Registrtion Number:** CX-INT-2026-GEN-0154
**Technology Stack:** HTML5, CSS3, JavaScript, Bootstrap
**Internship:** CloudExify Summer Internship 2026
