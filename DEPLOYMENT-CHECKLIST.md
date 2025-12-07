# Suburb Pages Deployment Checklist

## ✅ Pre-Deployment Verification

Run these commands to verify everything is ready:

```bash
# Verify suburb pages count
ls suburbs/*.html | wc -l
# Should show: 1893

# Verify sitemaps exist
ls -lh sitemap*.xml
# Should show: sitemap.xml, sitemap-suburbs.xml, sitemap-index.xml

# Check robots.txt exists
cat robots.txt

# Test a sample page
open suburbs/adelaide.html
# Or: open suburbs/holden-hill.html
```

## 📤 Deployment Steps

### 1. Upload Files to Server
Upload these new/updated files to your web server:

**New Directory:**
- [ ] `suburbs/` folder (all 1,893 HTML files)

**New Files:**
- [ ] `sitemap.xml` (main pages sitemap)
- [ ] `sitemap-suburbs.xml` (suburb pages sitemap)
- [ ] `sitemap-index.xml` (master sitemap index)
- [ ] `robots.txt` (search engine instructions)

**Documentation:**
- [ ] `SUBURB-PAGES-README.md` (keep for reference)
- [ ] `generate-suburb-pages.py` (keep for future updates)

### 2. Verify URLs Work
After upload, test these URLs in your browser:

- [ ] `https://nlesa.com.au/sitemap-index.xml`
- [ ] `https://nlesa.com.au/sitemap.xml`
- [ ] `https://nlesa.com.au/sitemap-suburbs.xml`
- [ ] `https://nlesa.com.au/suburbs/adelaide.html`
- [ ] `https://nlesa.com.au/suburbs/holden-hill.html`
- [ ] `https://nlesa.com.au/suburbs/norwood.html`

### 3. Submit to Google Search Console

1. **Add Property** (if not already done)
   - [ ] Go to https://search.google.com/search-console
   - [ ] Add nlesa.com.au as a property

2. **Submit Sitemaps**
   - [ ] Navigate to Sitemaps section
   - [ ] Add sitemap: `sitemap-index.xml`
   - [ ] (Optional) Also add: `sitemap.xml` and `sitemap-suburbs.xml`

3. **Request Indexing for Key Pages**
   - [ ] Request indexing for: `/suburbs/adelaide.html`
   - [ ] Request indexing for: `/suburbs/holden-hill.html`
   - [ ] Request indexing for: `/suburbs/norwood.html`

### 4. Verify Google Analytics

1. **Check Tracking**
   - [ ] Open a suburb page in browser
   - [ ] Open browser console (F12)
   - [ ] Verify no errors in console
   - [ ] Check Google Analytics Real-Time reports
   - [ ] Confirm suburb page views appear

2. **Set Up Goals** (Optional)
   - [ ] Create goal for contact form submissions
   - [ ] Create goal for phone clicks
   - [ ] Add UTM parameters if needed

### 5. Test Mobile Responsiveness

- [ ] Open suburb pages on mobile device
- [ ] Verify navigation works
- [ ] Check that CTAs are clickable
- [ ] Ensure phone numbers are tap-to-call

### 6. Social Media & Marketing

**Week 1:**
- [ ] Share Adelaide page on Facebook/LinkedIn
- [ ] Post about "Now serving all SA suburbs"
- [ ] Update Google Business Profile description

**Week 2-4:**
- [ ] Share 2-3 suburb pages per week
- [ ] Focus on high-population areas
- [ ] Tag local business groups

### 7. Monitor & Optimize

**Daily (First Week):**
- [ ] Check Google Search Console for indexing status
- [ ] Monitor Google Analytics for traffic
- [ ] Review any crawl errors

**Weekly (First Month):**
- [ ] Check which suburb pages are getting traffic
- [ ] Review search queries in Search Console
- [ ] Identify top-performing suburb pages

**Monthly (Ongoing):**
- [ ] Review indexing coverage (aim for 100% of 1,893 pages)
- [ ] Check rankings for key suburb terms
- [ ] Update content if needed

## 🎯 Success Criteria

### Week 1
- [ ] All files uploaded successfully
- [ ] Sitemaps submitted to Google
- [ ] No technical errors in Search Console
- [ ] Google Analytics tracking confirmed

### Month 1
- [ ] At least 100 suburb pages indexed
- [ ] First organic traffic from suburb searches
- [ ] No crawl errors in Search Console

### Month 3
- [ ] 500+ suburb pages indexed
- [ ] Ranking for some "[suburb] accountant" terms
- [ ] Regular organic traffic from suburb pages

### Month 6
- [ ] 1,500+ suburb pages indexed (80%+)
- [ ] Top 10 rankings for key suburbs
- [ ] Measurable conversions from suburb pages

## 🔧 Troubleshooting

### If Pages Don't Index
1. Check robots.txt allows crawling
2. Verify sitemap is accessible
3. Submit individual URLs in Search Console
4. Check for duplicate content issues

### If Analytics Don't Track
1. Verify Google tag ID is correct (G-BZ5K92F88X)
2. Check browser console for errors
3. Test with Google Tag Assistant extension
4. Verify no ad blockers interfering

### If Links Don't Work
1. Verify relative paths (`../styles.css`, `../index.html`)
2. Check case sensitivity in URLs
3. Ensure all referenced files exist
4. Test navigation on production server

## 📊 Key Metrics Dashboard

Track these in Google Analytics:

1. **Suburb Pages Performance**
   - Total page views
   - Average time on page
   - Bounce rate
   - Conversion rate

2. **Top Suburb Pages**
   - Which suburbs get most traffic
   - Geographic distribution
   - User behavior flow

3. **Search Performance**
   - Top search queries
   - Click-through rates
   - Average position
   - Impressions vs clicks

## 📞 Quick Reference

**Total Suburb Pages:** 1,893  
**Google Analytics:** G-BZ5K92F88X  
**Domain:** nlesa.com.au  
**Suburb Pages Location:** /suburbs/  
**Main Sitemap:** sitemap-index.xml  

---

**Last Updated:** December 7, 2025  
**Status:** Ready for Deployment ✅
