# Organiya Global Website

Premium Indian Superfoods Exporter website - showcasing Moringa, Turmeric, Ashwagandha, and plant-based superfoods.

## About

Organiya Global LLP is a premium exporter of Indian superfoods, bringing high-quality Moringa, Turmeric, Ashwagandha, and other plant-based ingredients to global markets. This website serves as the company's online presence for export inquiries, product information, and distributorship opportunities.

## Project Structure

```
Organiya_Web/
├── index.html              # Homepage
├── about.html              # About us page
├── products.html           # Products overview
├── superfoods.html         # Detailed superfoods information
├── export.html             # Export services
├── distributorship.html    # Distributorship opportunities
├── testimonials.html       # Customer testimonials
├── contact.html            # Contact form
├── certifications.html     # Redirects to about.html#certifications
├── markets.html            # Redirects to about.html#markets
├── moringa.html            # Redirects to superfoods.html
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   └── script.js       # JavaScript functionality
│   └── images/
│       ├── banners/        # Hero banner images
│       ├── icons/          # Icon SVG files
│       ├── logo/           # Logo and favicon files
│       └── products/        # Product images
├── tools/                  # Google Apps Script form generators
└── Unused_Images/          # Archived unused images (excluded from git)
```

## Setup

This is a static HTML/CSS/JavaScript website with no build process required.

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Organiya_Web
   ```

2. Open in browser:
   - Simply open `index.html` in your web browser, or
   - Use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     
     # Node.js (with http-server)
     npx http-server
     ```

3. Visit `http://localhost:8000` in your browser

## GitHub Pages Deployment

### Using GitHub Desktop

1. **Prepare the repository:**
   - Ensure all changes are committed
   - The `Unused_Images/` folder is automatically excluded via `.gitignore`

2. **Push to GitHub:**
   - Open GitHub Desktop
   - Review changes (only necessary files should be staged)
   - Commit with descriptive message
   - Push to GitHub repository

3. **Enable GitHub Pages:**
   - Go to repository on GitHub.com
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select:
     - Branch: `main` (or `master`)
     - Folder: `/ (root)`
   - Click **Save**

4. **Access your site:**
   - Your site will be available at: `https://[username].github.io/[repository-name]/`
   - GitHub Pages typically takes 1-2 minutes to deploy

### Manual Deployment

If using command line:

```bash
git add .
git commit -m "Initial commit - Organiya Global website"
git push origin main
```

Then follow steps 3-4 above to enable GitHub Pages.

## Features

- **Responsive Design:** Mobile-friendly layout that works on all devices
- **SEO Optimized:** Meta tags and semantic HTML for search engine optimization
- **Contact Forms:** Google Forms integration for inquiries and distributorship applications
- **Product Showcase:** Detailed information about superfoods and export services
- **Modern UI:** Clean, professional design with smooth animations

## Technologies Used

- HTML5
- CSS3 (with CSS Variables)
- Vanilla JavaScript
- Google Forms (for contact forms)

## Contact

For inquiries about products, export services, or distributorship opportunities:

- **Email:** info@organiyaglobal.com
- **Website:** [Your GitHub Pages URL]

## License

© 2025 Organiya Global LLP. All rights reserved.

## Notes

- The `Unused_Images/` folder contains archived images that are not used in the website but kept for future reference. This folder is excluded from GitHub via `.gitignore`.
- Banner images in `assets/images/banners/` may be missing - the site uses CSS gradient fallbacks.
- All product images and logos are properly organized in the `assets/images/` directory structure.

