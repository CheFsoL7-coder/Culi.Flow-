# Jewelz DaBarber - Week 1 MVP Website

A modern, single-page MVP (Minimum Viable Product) website for Jewelz DaBarber, showcasing both the barbering business and the mentorship program for at-risk youth in Minneapolis, MN.

## 🎨 Design Philosophy

This website uses a state-of-the-art 2025 design stack:

- **Tailwind CSS**: Clean, modern, grid-based responsive layout
- **Typography**:
  - Oswald for bold headers (impact and authority)
  - Inter for body text (readability and cleanliness)
- **The "Split Soul" Concept**:
  - **Gold (#C5A059)**: Business/Barbering/Premium Service/Legacy
  - **Royal Blue (#0f172a)**: Program/Mentorship/Youth/Future

## 📁 Project Structure

```
website/
├── index.html              # Version 2.0 - Master Barber Edition (MAIN)
├── index-v1.html          # Version 1.0 - Pilot Build (Alternate)
├── assets/
│   └── images/
│       ├── README.md      # Image requirements and guidelines
│       ├── jewelz-photo.jpg         (Add your photo here)
│       ├── braids-photo.jpg         (Add gallery photo)
│       ├── waves-photo.jpg          (Add gallery photo)
│       └── confidence-photo.jpg     (Add gallery photo)
└── README.md              # This file
```

## 🚀 Quick Start

### Viewing Locally

1. **Download/Clone this repository**

2. **Add Your Photos** (Optional but recommended)
   - Navigate to `website/assets/images/`
   - Add your photos with the exact file names listed in `assets/images/README.md`
   - If photos are not provided, placeholder images will display

3. **Open in Browser**
   - Open `website/index.html` in Chrome, Safari, Firefox, or Edge
   - The site works entirely offline with CDN resources

### Version Differences

- **index.html** (Version 2.0): Features the refined "Master Barber" brand with Royal Blue accents, diamond logo styling, and enhanced visual hierarchy
- **index-v1.html** (Version 1.0): Original pilot with Electric Cyan accents and simpler layout

Choose the version that best fits your brand vision!

## 🎯 Features

### Core Sections

1. **Hero Section** - Powerful opening statement with dual CTAs
   - "Book A Cut" (Business revenue)
   - "Meet The Mentor" (Mission-driven)

2. **About/Mission** - Jewel Scales' story and vision
   - Personal narrative
   - Community impact
   - Visual storytelling

3. **Gallery** - Showcase of work
   - Artistry & Detail (braiding)
   - Classic Grooming (waves/fades)
   - Inner Confidence (transformation)

4. **The Program** - Mentorship initiative details
   - Vocational training
   - Financial literacy
   - Community building
   - Donation CTA

5. **Contact/Footer** - Business information
   - Phone: 612-447-3366
   - Website: www.jewelzdabarber.com
   - Social media links

### Design Features

- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Smooth scroll navigation
- ✅ Hover effects and transitions
- ✅ Accessibility-friendly markup
- ✅ SEO-ready structure
- ✅ Fast loading (CDN resources)

## 🌐 Deployment Options

### Option 1: GitHub Pages (Free & Easy)

1. Push this repository to GitHub
2. Go to repository Settings → Pages
3. Select source branch (usually `main` or `master`)
4. Set folder to `/website` or move files to root
5. Your site will be live at: `https://yourusername.github.io/repo-name/`

### Option 2: Netlify (Recommended for Custom Domain)

1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop the `website` folder
3. Your site is live instantly
4. Connect custom domain (jewelzdabarber.com)
5. Free SSL certificate included

### Option 3: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to `website` folder
3. Run: `vercel`
4. Follow prompts to deploy

### Option 4: Traditional Web Host

1. Upload `website` folder contents via FTP
2. Point domain to hosting provider
3. Access via your custom domain

## 🔧 Customization Guide

### Updating Content

All content is in `index.html`. Key areas to customize:

1. **Business Information** (Lines 185-195)
   - Phone number
   - Address
   - Website URL
   - Social media links

2. **Service Pricing** (Version 1.0, lines 200-230)
   - Update prices
   - Add/remove services
   - Connect booking system

3. **Stats/Metrics** (Lines 90-110)
   - Update years of experience
   - Lives impacted count
   - Google rating

### Adding Real Booking System

Replace the placeholder booking section with:

**Square Appointments:**
```html
<div id="square-appointments"></div>
<script src="https://square.site/appointments/buyer/widget/YOUR_ID_HERE.js"></script>
```

**Booksy Integration:**
```html
<iframe src="https://booksy.com/widget/YOUR_BOOKSY_URL"
        width="100%" height="800px"></iframe>
```

### Adding Payment/Donation Processing

For the "Make a Donation" button:

**Stripe Payment Link:**
```html
<a href="https://buy.stripe.com/YOUR_PAYMENT_LINK"
   class="bg-transparent border-2 border-brandAccent...">
   Make a Donation
</a>
```

**PayPal:**
```html
<form action="https://www.paypal.com/donate" method="post">
  <input type="hidden" name="hosted_button_id" value="YOUR_BUTTON_ID">
  <button type="submit">Make a Donation</button>
</form>
```

## 📱 Social Media Integration

Update social links in footer (around line 250-260):

```html
<a href="https://instagram.com/jewelzdabarber">Instagram</a>
<a href="https://facebook.com/jewelzdabarber">Facebook</a>
<a href="https://tiktok.com/@jewelzdabarber">TikTok</a>
```

## 🎨 Color Scheme

### Version 2.0 (Current)
- **brandBlack**: `#0a0a0a` - Main background
- **brandBlue**: `#0f172a` - Accent background
- **brandGold**: `#C5A059` - Primary brand color
- **brandWhite**: `#F3F4F6` - Light text

### Version 1.0
- **brandDark**: `#111111` - Main background
- **brandGray**: `#1F1F1F` - Section background
- **brandGold**: `#D4AF37` - Luxurious gold
- **brandAccent**: `#00D4FF` - Electric cyan

To change colors, edit the `tailwind.config` section in the `<head>`.

## 📊 Analytics Integration

Add Google Analytics by inserting before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🐛 Troubleshooting

### Images Not Showing
- Verify image files are in `website/assets/images/`
- Check file names match exactly (case-sensitive)
- Ensure images are JPG or PNG format
- Placeholder images will show if files are missing

### Fonts Not Loading
- Check internet connection (fonts load from Google Fonts CDN)
- Fallback fonts will display if CDN is unavailable

### Layout Issues
- Clear browser cache
- Try a different browser
- Check browser console for errors (F12)

## 📈 Next Steps

After launching this MVP:

1. **Collect Real Photos** - Replace placeholders with actual client work
2. **Connect Booking System** - Integrate Square/Booksy for appointments
3. **Set Up Donation Processing** - Add Stripe/PayPal for program funding
4. **Add Google Analytics** - Track visitor behavior
5. **SEO Optimization** - Add meta descriptions, keywords
6. **Create Blog Section** - Share success stories from the program
7. **Add Testimonials** - Client reviews and testimonials
8. **Video Content** - Add YouTube videos of transformations

## 📞 Support

For questions about this website:
- Review this README
- Check `assets/images/README.md` for image requirements
- Consult Tailwind CSS docs: [tailwindcss.com](https://tailwindcss.com)

## 📄 License

This website template is provided for Jewelz DaBarber business use.

---

**Built with ❤️ for the Minneapolis community**

*Changing Lives One Cut At A Time*
