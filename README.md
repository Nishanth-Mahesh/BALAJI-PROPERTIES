# Balaji Properties Pvt Ltd – Website Redesign

Plain HTML, CSS and JavaScript. No npm, no build step, no paid services.

## Run it
1. Unzip the folder.
2. Open `index.html` in a browser, or in VS Code right-click `index.html` → **Open with Live Server**.
3. Keep an internet connection on: images come from Unsplash and Google Fonts.

## Edit in VS Code
- `index.html` – all text, sections, contact details, SEO and LocalBusiness data (search for `LocalBusiness` / `RealEstateAgent`).
- `style.css` – colours and fonts are at the top (`:root`).
- `script.js` – WhatsApp number (`CONFIG.whatsapp`), the property types in the finder (`TYPES`), form messages.

## Replace images
- **Logo:** save your file as `assets/logo.png` (square works best, light colours show best on the dark header). The layout does not change.
- **Hero / category / buy / visit photos:** these are Unsplash stock images (illustrative only, not company inventory). Swap the `src` URL in `index.html` for `assets/hero.jpg`, `assets/property-1.jpg`, `assets/property-2.jpg` or any file you add.
- **Deal gallery:** the five photos are from your existing site. To host them yourself, save them in `assets/gallery/` using the names in `assets/gallery/README.txt`.
- If any image fails to load, the page falls back automatically (local file → online source → dark placeholder).

## Accuracy notes
- No prices, listings, availability, statistics or testimonials are invented. The property finder is enquiry-based: it opens WhatsApp with your chosen location and type.
- Dimensions and square-foot sizes, services, address, phone, email, hours and Maps link were taken from the existing website and your brief.
- Legal verification is described as subject to document inspection, not a legal guarantee.

## Go live
Upload the folder to any static host (Vercel, Netlify, GitHub Pages). Update the `canonical` and Open Graph URLs in `index.html` if your domain differs.
