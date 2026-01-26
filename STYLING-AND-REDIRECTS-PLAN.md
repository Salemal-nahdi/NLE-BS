# Styling & Button Redirects Standardization Plan

## Overview
This plan ensures all pages have consistent styling and all buttons redirect properly across the NLE Business Services website.

---

## Phase 1: Audit & Documentation

### Pages to Review
**Main Pages:**
- ✅ `index.html` (homepage - has Tailwind CSS)
- ⚠️ `careers.html`
- ⚠️ `locations.html`
- ⚠️ `accountants-adelaide.html` (pillar page)
- ⚠️ `tax-accountant-adelaide.html`
- ⚠️ `bookkeeping-adelaide.html`
- ⚠️ `xero-accountant-adelaide.html`
- ⚠️ `business-accountants-adelaide.html`
- ⚠️ `tax-preparation.html`
- ⚠️ `bookkeeping-payroll.html`

### Current Issues Identified

1. **Missing Tailwind CSS:**
   - Only `index.html` has `<link rel="stylesheet" href="tailwind.css">`
   - All service pages only have `styles.css`
   - **Impact:** Images won't have mask-squircle size-25 styling

2. **Inconsistent Button Redirects:**
   - Some use `#contact` (homepage)
   - Some use `index.html#contact` (service pages)
   - Need to standardize based on page location

3. **Inconsistent Page Structure:**
   - Some service pages have pricing sections
   - Some have FAQ sections
   - Some have contact sections
   - Need to standardize all service pages

4. **Image Styling:**
   - Homepage images use `mask mask-squircle size-25`
   - Service page images don't have this class
   - Need to apply consistently

---

## Phase 2: Standardization Tasks

### Task 1: Add Tailwind CSS to All Service Pages
**Files to Update:**
- `accountants-adelaide.html`
- `tax-accountant-adelaide.html`
- `bookkeeping-adelaide.html`
- `xero-accountant-adelaide.html`
- `business-accountants-adelaide.html`
- `tax-preparation.html`
- `bookkeeping-payroll.html`
- `careers.html`
- `locations.html`

**Action:** Add `<link rel="stylesheet" href="tailwind.css">` before `styles.css` in `<head>`

---

### Task 2: Standardize Button Redirects

#### Button Redirect Rules:
- **Homepage (`index.html`):**
  - Contact buttons → `#contact`
  - Service links → `#services` or specific sections
  
- **Service Pages (all other pages):**
  - Contact buttons → `index.html#contact` (links back to homepage contact)
  - "Get a Quote" → `index.html#contact`
  - "Get in touch" → `index.html#contact`
  - "Call now" → `tel:+61870838322` (consistent across all)

#### Buttons to Check:
1. **Header CTAs:**
   - `cta-call` → `tel:+61870838322` ✅ (already consistent)
   - `cta-quote` → `index.html#contact` (for service pages)
   - `get-in-touch-button` → `index.html#contact` (for service pages)

2. **Hero Section CTAs:**
   - `primary-cta` → `tel:+61870838322` ✅ (already consistent)
   - `secondary-cta` → `index.html#contact` (for service pages) or `#contact` (homepage)

3. **Section CTAs:**
   - All "Get in touch", "Contact us", "Book consultation" → `index.html#contact` (service pages)

---

### Task 3: Standardize Service Page Structure

**Required Sections for All Service Pages:**
1. **Hero Section** (`hero-section`)
   - Eyebrow text (service name)
   - H1 title
   - Subtitle
   - Two CTAs (Call now, Book consultation)
   - Trust bullets
   - Hero image with `mask mask-squircle size-25`

2. **Services Section** (`services-section`)
   - Services label
   - Section title
   - Services grid (6 service cards)

3. **Pricing Section** (`pricing-section`) - Optional but recommended
   - Section title
   - Subtitle
   - Pricing cards or "Request a quote" messaging

4. **FAQ Section** (`faq-section`) - Optional but recommended
   - Section title
   - FAQ items (3-6 questions)

5. **Contact Section** (`contact-section`) - Link to homepage contact
   - Or redirect to `index.html#contact`

---

### Task 4: Apply Consistent Image Styling

**All Hero Images Should Have:**
```html
<img class="hero-image mask mask-squircle size-25" src="..." alt="...">
```

**Pages Needing Update:**
- All service pages (currently missing `mask mask-squircle size-25`)

---

### Task 5: Ensure Consistent Section Styling

**Check All Pages Have:**
- Rounded corners on sections (top-left and bottom-right: `24px 0 24px 0`)
- Consistent spacing (`padding`, `margin`)
- Consistent typography (font sizes, weights, line heights)
- Consistent color scheme (CSS variables)

---

## Phase 3: Implementation Checklist

### Step 1: Add Tailwind CSS
- [ ] `accountants-adelaide.html`
- [ ] `tax-accountant-adelaide.html`
- [ ] `bookkeeping-adelaide.html`
- [ ] `xero-accountant-adelaide.html`
- [ ] `business-accountants-adelaide.html`
- [ ] `tax-preparation.html`
- [ ] `bookkeeping-payroll.html`
- [ ] `careers.html`
- [ ] `locations.html`

### Step 2: Fix Button Redirects
- [ ] Audit all `href="#contact"` on service pages → change to `index.html#contact`
- [ ] Audit all `href="#services"` on service pages → change to `index.html#services`
- [ ] Verify all `tel:+61870838322` links work
- [ ] Check all "Get a Quote" buttons
- [ ] Check all "Get in touch" buttons
- [ ] Check all "Book consultation" buttons

### Step 3: Standardize Page Structure
- [ ] Ensure all service pages have hero section
- [ ] Ensure all service pages have services section
- [ ] Add pricing section where missing
- [ ] Add FAQ section where missing
- [ ] Ensure contact section or link exists

### Step 4: Apply Image Styling
- [ ] Add `mask mask-squircle size-25` to all hero images on service pages
- [ ] Verify images display correctly

### Step 5: Verify Section Styling
- [ ] Check rounded corners on all sections
- [ ] Verify spacing consistency
- [ ] Check typography consistency
- [ ] Verify color scheme consistency

### Step 6: Testing
- [ ] Test all button redirects manually
- [ ] Verify mobile responsiveness
- [ ] Check cross-browser compatibility
- [ ] Validate HTML/CSS

---

## Phase 4: Button Redirect Reference

### Standard Button Patterns

#### Header Buttons (All Pages)
```html
<!-- Call Now -->
<a class="cta-call" href="tel:+61870838322">Call Now</a>

<!-- Get a Quote (Service Pages) -->
<a class="cta-quote" href="index.html#contact">Get a Quote</a>

<!-- Get a Quote (Homepage) -->
<a class="cta-quote" href="#contact">Get a Quote</a>

<!-- Get in touch (Service Pages) -->
<a href="index.html#contact" class="get-in-touch-button">Get in touch</a>

<!-- Get in touch (Homepage) -->
<a href="#contact" class="get-in-touch-button">Get in touch</a>
```

#### Hero Section Buttons
```html
<!-- Primary CTA (All Pages) -->
<a class="primary-cta" href="tel:+61870838322">Call now</a>

<!-- Secondary CTA (Service Pages) -->
<a class="secondary-cta" href="index.html#contact">Book a free consult</a>

<!-- Secondary CTA (Homepage) -->
<a class="secondary-cta" href="#contact">Get started</a>
```

#### Section CTAs
```html
<!-- Service Pages -->
<a href="index.html#contact" class="about-cta">Get in touch</a>

<!-- Homepage -->
<a href="#contact" class="about-cta">Get in touch</a>
```

---

## Phase 5: CSS Class Consistency

### Standard Classes to Use

**Hero Section:**
- `hero-section`
- `hero-layout`
- `hero-content`
- `hero-title`
- `hero-subtitle`
- `hero-ctas`
- `primary-cta`
- `secondary-cta`
- `hero-bullets`
- `hero-image-container`
- `hero-curved-shape`
- `hero-image-wrapper`
- `hero-image mask mask-squircle size-25`

**Services Section:**
- `services-section`
- `services-section-wrapper`
- `services-header`
- `services-label`
- `section-title`
- `section-subtitle`
- `services-grid`
- `service-card`
- `service-title`
- `service-description`

**Buttons:**
- `primary-cta` - Main action button (blue)
- `secondary-cta` - Secondary action button (outline)
- `cta-call` - Header call button
- `cta-quote` - Header quote button
- `get-in-touch-button` - Secondary header button
- `about-cta` - Section CTA button

---

## Success Criteria

✅ All pages have Tailwind CSS loaded
✅ All buttons redirect to correct destinations
✅ All service pages have consistent structure
✅ All hero images use mask-squircle size-25
✅ All sections have consistent styling
✅ All links tested and working
✅ Mobile responsive on all pages
✅ Consistent branding and design language

---

## Notes

- Suburb pages (1893 pages) are excluded from this plan as they have their own structure
- Focus is on main pages and service pages only
- All changes should maintain SEO optimization
- All changes should maintain accessibility standards
