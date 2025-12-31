# Image Assets for Jewelz DaBarber Website

This directory should contain the following images for the website to display properly:

## Required Images

### Main Profile Photo
- **File name:** `jewelz-photo.jpg`
- **Description:** Professional photo of Jewelz Scales (the barber)
- **Recommended size:** 600x700 pixels
- **Usage:** Hero section on the homepage

### Gallery Photos (3 images)

1. **braids-photo.jpg**
   - Showcasing intricate braiding work
   - Recommended size: 400x500 pixels
   - Section: Gallery - "Artistry & Detail"

2. **waves-photo.jpg**
   - Showcasing wave patterns and classic grooming
   - Recommended size: 400x500 pixels
   - Section: Gallery - "Classic Grooming"

3. **confidence-photo.jpg**
   - Photo showing a client's confident expression after a cut
   - Recommended size: 400x500 pixels
   - Section: Gallery - "Inner Confidence"

## Image Guidelines

- **Format:** JPG or PNG
- **Quality:** High resolution, but optimized for web (under 500KB each)
- **Orientation:** Portrait for main photo, can be portrait or landscape for gallery
- **Backup:** The website has fallback placeholder images if these files are not present

## How to Add Images

1. Place your image files in this directory (`website/assets/images/`)
2. Ensure they match the exact file names listed above
3. The website will automatically load them when you open `index.html`

## Alternative: Using Different File Names

If you want to use different file names, update the `src` attributes in `index.html`:
- Line ~105: Main photo (`jewelz-photo.jpg`)
- Lines ~120-135: Gallery photos (`braids-photo.jpg`, `waves-photo.jpg`, `confidence-photo.jpg`)
