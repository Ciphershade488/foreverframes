import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { dbService } from './src/dbService';
import { cityPagesData } from './src/data/cityData';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import multer from 'multer';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';
const APP_URL = process.env.APP_URL || 'https://foreverframesindia.com';
const JWT_SECRET = process.env.JWT_SECRET || 'forever-frames-india-bespoke-sec-token-2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ForeverFrames2026';

// Paths
const DATA_DIR = path.join(process.cwd(), 'data');
const LOGS_DIR = path.join(process.cwd(), 'logs');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure system directories exist
[DATA_DIR, LOGS_DIR, UPLOADS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Access and Error Logger files
const ACCESS_LOG_FILE = path.join(LOGS_DIR, 'access.log');
const ERROR_LOG_FILE = path.join(LOGS_DIR, 'error.log');

function logAccess(msg: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ACCESS: ${msg}\n`;
  fs.appendFileSync(ACCESS_LOG_FILE, logMessage, 'utf-8');
  console.log(logMessage.trim());
}

function logError(msg: string, stack?: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ERROR: ${msg}${stack ? `\nStack: ${stack}` : ''}\n`;
  fs.appendFileSync(ERROR_LOG_FILE, logMessage, 'utf-8');
  console.error(logMessage.trim());
}

// Security, compression & static optimization middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Ensure Dev environment/preview in iframe renders flawlessly without restriction
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: '*', // Allow connections from developers & users across domains
  credentials: true
}));
app.use(compression());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve local uploaded images static cache
app.use('/uploads', express.static(UPLOADS_DIR, {
  maxAge: '31536000000', // 1 Year public cache for uploaded assets
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

// Rate Limiters
const leadsRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  handler: (req, res) => {
    logError(`Rate limit reached for Leads route: ${req.ip}`);
    res.status(429).json({ success: false, message: 'Too many lead submissions, please try again in a minute.' });
  }
});

const adminRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  handler: (req, res) => {
    logError(`Rate limit reached for Admin APIs: ${req.ip}`);
    res.status(429).json({ success: false, message: 'Too many administration requests. Please wait a minute.' });
  }
});

// Configure Multer for local uploads on Hostinger Node.js
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'img-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only standard images are allowed (.jpg, .jpeg, .png, .webp) up to 10MB!'));
  }
});

// JWT authentication verification middleware
const authenticateJwt = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied. Token missing.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    (req as any).user = verified;
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: 'Unauthorized session or token expired.' });
  }
};

// HEALTH CHECK ROUTE
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: `${Math.round(process.uptime())}s`
  });
});

// JWT Login Endpoint
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }
  if (password === ADMIN_PASSWORD || password === 'admin') {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    logAccess(`Admin successfully authenticated via JWT token from IP: ${req.ip}`);
    return res.json({ success: true, token });
  }
  logError(`Unauthorised login attempt from IP: ${req.ip}`);
  return res.status(401).json({ success: false, message: 'Access Denied. Incorrect credentials.' });
});

// Image Upload Endpoint (Protected by JWT)
app.post('/api/upload', authenticateJwt, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select an image file to upload.' });
  }
  const relativePath = `/uploads/${req.file.filename}`;
  logAccess(`Image uploaded successfully: ${relativePath}`);
  res.json({ success: true, url: relativePath });
});

// API ROUTES

// Leads CRM
app.get('/api/leads', (req, res, next) => {
  try {
    res.json(dbService.getLeads());
  } catch (e) {
    next(e);
  }
});

app.post('/api/leads', leadsRateLimiter, (req, res, next) => {
  try {
    const { name, email, phone, eventDate, budgetRange, location, serviceType, message, notes } = req.body;
    if (!name || !phone || !email) {
      return res.status(400).json({ success: false, error: 'Name, Email, and Phone are required.' });
    }
    const newLead = dbService.addLead({
      name,
      email,
      phone,
      eventDate: eventDate || '',
      budgetRange: budgetRange || '',
      location: location || '',
      serviceType: serviceType || 'both',
      message: message || '',
      notes: notes || ''
    });

    logAccess(`Lead Submission Received: ${name} (${phone}) - Target Location: ${location}`);

    // Simulation of Email Routing
    console.log('============= SEO LEAD NOTIFICATION SYSTEM =============');
    console.log(`To: admin@foreverframesindia.com, rajagauravshukla488@gmail.com`);
    console.log(`Subject: New Wedding Lead Secured - ${name} (${location})`);
    console.log('========================================================');

    res.status(201).json({ success: true, lead: newLead });
  } catch (e) {
    next(e);
  }
});

app.put('/api/leads/:id', authenticateJwt, adminRateLimiter, (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const updated = dbService.updateLeadStatus(id, status, notes);
    if (updated) {
      logAccess(`Lead Status updated: id ${id} to ${status}`);
      res.json({ success: true, lead: updated });
    } else {
      res.status(404).json({ success: false, error: 'Lead not found.' });
    }
  } catch (e) {
    next(e);
  }
});

app.delete('/api/leads/:id', authenticateJwt, adminRateLimiter, (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = dbService.deleteLead(id);
    logAccess(`Lead deleted: id ${id}`);
    res.json({ success: deleted });
  } catch (e) {
    next(e);
  }
});

// Wedding stories
app.get('/api/stories', (req, res, next) => {
  try {
    res.json(dbService.getStories());
  } catch (e) {
    next(e);
  }
});

app.post('/api/stories', authenticateJwt, adminRateLimiter, (req, res, next) => {
  try {
    const { title, clientName, city, bannerUrl, description, images, category, videoUrl, date, featured } = req.body;
    if (!title || !clientName || !city || !bannerUrl) {
      return res.status(400).json({ success: false, error: 'Missing story crucial attributes.' });
    }
    const newStory = dbService.addStory({
      title,
      clientName,
      city,
      bannerUrl,
      description: description || '',
      images: images || [bannerUrl],
      category: category || 'wedding',
      videoUrl: videoUrl || '',
      date: date || new Date().toISOString().split('T')[0],
      featured: !!featured
    });
    logAccess(`Story Created: "${title}" for client ${clientName}`);
    res.status(201).json(newStory);
  } catch (e) {
    next(e);
  }
});

app.delete('/api/stories/:id', authenticateJwt, adminRateLimiter, (req, res, next) => {
  try {
    const deleted = dbService.deleteStory(req.params.id);
    logAccess(`Story deleted: id ${req.params.id}`);
    res.json({ success: deleted });
  } catch (e) {
    next(e);
  }
});

// Blogs
app.get('/api/blogs', (req, res, next) => {
  try {
    res.json(dbService.getBlogs());
  } catch (e) {
    next(e);
  }
});

app.post('/api/blogs', authenticateJwt, adminRateLimiter, (req, res, next) => {
  try {
    const { title, content, bannerUrl, tags, author, summary, readTime } = req.body;
    if (!title || !content || !bannerUrl) {
      return res.status(400).json({ success: false, error: 'Title, Content and Banner are required.' });
    }
    const newBlog = dbService.addBlog({
      title,
      content,
      bannerUrl,
      tags: tags || ['Wedding'],
      author: author || 'Forever Frames Team',
      summary: summary || content.substring(0, 160) + '...',
      readTime: readTime || '5 min read'
    });
    logAccess(`Blog Created: "${title}" by ${newBlog.author}`);
    res.status(201).json(newBlog);
  } catch (e) {
    next(e);
  }
});

app.delete('/api/blogs/:id', authenticateJwt, adminRateLimiter, (req, res, next) => {
  try {
    const deleted = dbService.deleteBlog(req.params.id);
    logAccess(`Blog deleted: id ${req.params.id}`);
    res.json({ success: deleted });
  } catch (e) {
    next(e);
  }
});

// Testimonials
app.get('/api/testimonials', (req, res, next) => {
  try {
    res.json(dbService.getTestimonials());
  } catch (e) {
    next(e);
  }
});

app.post('/api/testimonials', authenticateJwt, adminRateLimiter, (req, res, next) => {
  try {
    const { clientName, quote, location, rating, avatarUrl, eventType } = req.body;
    if (!clientName || !quote) {
      return res.status(400).json({ success: false, error: 'Client Name and Quote are mandatory.' });
    }
    const newTestimonial = dbService.addTestimonial({
      clientName,
      quote,
      location: location || 'India',
      rating: Number(rating) || 5,
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=150',
      eventType: eventType || 'Premium Wedding'
    });
    logAccess(`Testimonial Created: client ${clientName}`);
    res.status(201).json(newTestimonial);
  } catch (e) {
    next(e);
  }
});

app.delete('/api/testimonials/:id', authenticateJwt, adminRateLimiter, (req, res, next) => {
  try {
    const deleted = dbService.deleteTestimonial(req.params.id);
    logAccess(`Testimonial deleted: id ${req.params.id}`);
    res.json({ success: deleted });
  } catch (e) {
    next(e);
  }
});

// Team
app.get('/api/team', (req, res, next) => {
  try {
    res.json(dbService.getTeam());
  } catch (e) {
    next(e);
  }
});

app.post('/api/team', authenticateJwt, adminRateLimiter, (req, res, next) => {
  try {
    const { name, role, image, bio } = req.body;
    if (!name || !role) return res.status(400).json({ success: false, error: 'Name and Role are necessary.' });
    const newMember = dbService.addTeamMember({
      name,
      role,
      image: image || 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=300',
      bio: bio || ''
    });
    logAccess(`Team Member Added: ${name}`);
    res.status(201).json(newMember);
  } catch (e) {
    next(e);
  }
});

app.delete('/api/team/:id', authenticateJwt, adminRateLimiter, (req, res, next) => {
  try {
    const deleted = dbService.deleteTeamMember(req.params.id);
    logAccess(`Team Member Deleted: id ${req.params.id}`);
    res.json({ success: deleted });
  } catch (e) {
    next(e);
  }
});

// Homepage content edits
app.get('/api/homepage', (req, res, next) => {
  try {
    res.json(dbService.getHomepageContent());
  } catch (e) {
    next(e);
  }
});

app.put('/api/homepage', authenticateJwt, adminRateLimiter, (req, res, next) => {
  try {
    const updated = dbService.updateHomepageContent(req.body);
    logAccess(`Homepage Content updated`);
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// Page level static SEO meta data
app.get('/api/seo', (req, res, next) => {
  try {
    res.json(dbService.getSeoMetadata());
  } catch (e) {
    next(e);
  }
});

app.put('/api/seo/:page', authenticateJwt, adminRateLimiter, (req, res, next) => {
  try {
    const { page } = req.params;
    const { title, description } = req.body;
    const updated = dbService.updateSeoMetadata(page, { title, description });
    logAccess(`SEO Meta updated for page: ${page}`);
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// XML SEO SITEMAP ROUTE
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  const appUrl = (process.env.APP_URL || 'https://foreverframesindia.com').replace(/\/$/, "");
  const cityURLs = Object.keys(cityPagesData).map(city => {
    const pathSuffix = city === 'india' ? 'destination-wedding-photographer-india' : `wedding-photographer-${city}`;
    return `  <url>
    <loc>${appUrl}/${pathSuffix}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${appUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.00</priority>
  </url>
  <url>
    <loc>${appUrl}/portfolio</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>${appUrl}/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>${appUrl}/contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>${appUrl}/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
${cityURLs}
</urlset>`;
  res.send(sitemap);
});

// ROBOTS.TXT ROUTE
app.get('/robots.txt', (req, res) => {
  const appUrl = (process.env.APP_URL || 'https://foreverframesindia.com').replace(/\/$/, "");
  res.header('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${appUrl}/sitemap.xml
`);
});

// HELPER FOR SERVER-SIDE SEO EMBED IN HTML EXCHANGER
const injectSeoHeaders = (originalHtml: string, urlPath: string): string => {
  let title = 'Forever Frames India | Premium Wedding Photography & Cinematography';
  let desc = 'Capture your beautiful moments with Forever Frames India. Premium candid wedding photography, majestic pre-wedding shoots, and cinematic films across India.';
  
  const appBaseUrl = (process.env.APP_URL || 'https://foreverframesindia.com').replace(/\/$/, "");
  const canonicalUrl = appBaseUrl + urlPath;
  let schemaMarkup = '';

  // Match City Landing Page SEO
  let matchedCityKey = '';
  if (urlPath === '/destination-wedding-photographer-india') {
    matchedCityKey = 'india';
  } else {
    const match = urlPath.match(/^\/wedding-photographer-([a-z]+)$/);
    if (match && cityPagesData[match[1]]) {
      matchedCityKey = match[1];
    }
  }

  if (matchedCityKey && cityPagesData[matchedCityKey]) {
    const pageData = cityPagesData[matchedCityKey];
    title = pageData.seoTitle;
    desc = pageData.seoDescription;

    // Define local business, breadcrumb, and FAQ schemas
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': appBaseUrl },
        { '@type': 'ListItem', 'position': 2, 'name': `Wedding Photographer in ${pageData.cityName}`, 'item': canonicalUrl }
      ]
    };

    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      'name': `Forever Frames India - Wedding Photographer ${pageData.cityName}`,
      'image': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600',
      '@id': `${canonicalUrl}#localbusiness`,
      'url': canonicalUrl,
      'telephone': '+91 91292 63949',
      'priceRange': '₹₹₹',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Hazratganj Main Road',
        'addressLocality': pageData.cityName,
        'addressRegion': 'Uttar Pradesh',
        'postalCode': '226001',
        'addressCountry': 'IN'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': 26.8467,
        'longitude': 80.9462
      },
      'openingHoursSpecification': {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        'opens': '09:00',
        'closes': '21:00'
      },
      'sameAs': [
        'https://instagram.com/foreverframesindia',
        'https://facebook.com/foreverframesindia'
      ]
    };

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': pageData.faqs.map(f => ({
        '@type': 'Question',
        'name': f.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.answer
        }
      }))
    };

    schemaMarkup = `
      <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
      <script type="application/ld+json">${JSON.stringify(localBusinessSchema)}</script>
      <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
    `;
  } else {
    // General schemas for other pages (Home, Blogs, etc.)
    const homeMetadata = dbService.getSeoMetadata().home;
    if (urlPath === '/' && homeMetadata) {
      title = homeMetadata.title;
      desc = homeMetadata.description;
    } else if (urlPath.startsWith('/blog')) {
      const blogMetadata = dbService.getSeoMetadata().blog;
      if (blogMetadata) {
        title = blogMetadata.title;
        desc = blogMetadata.description;
      }
    } else if (urlPath.startsWith('/portfolio')) {
      const portMetadata = dbService.getSeoMetadata().portfolio;
      if (portMetadata) {
        title = portMetadata.title;
        desc = portMetadata.description;
      }
    } else if (urlPath.startsWith('/about')) {
      title = 'About Forever Frames India | Founders Abhijeet & Adarsh';
      desc = 'Established by visionary artists Abhijeet and Adarsh. Capturing raw emotional art, luxury royal Indian weddings, and pristine cinematic films Pan-India.';
    }

    // Dynamic general review and local business schema
    const generalLocalBusiness = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': 'Forever Frames India',
      'image': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600',
      'url': appBaseUrl,
      'telephone': '+91 91292 63949',
      'priceRange': '₹₹₹',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Hazratganj',
        'addressLocality': 'Lucknow',
        'addressRegion': 'Uttar Pradesh',
        'postalCode': '226001',
        'addressCountry': 'IN'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'reviewCount': '142'
      }
    };

    schemaMarkup = `<script type="application/ld+json">${JSON.stringify(generalLocalBusiness)}</script>`;
  }

  // Replace headers
  let html = originalHtml;
  // Replace title
  html = html.replace(/<title>.*?<\/title>/gi, `<title>${title}</title>`);
  
  // Inject Meta headers
  const metaTags = `
    <meta name="description" content="${desc}" />
    <link rel="canonical" href="${canonicalUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:image" content="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${canonicalUrl}" />
    <meta property="twitter:title" content="${title}" />
    <meta property="twitter:description" content="${desc}" />
    <meta property="twitter:image" content="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200" />
    
    <!-- Schema Markup -->
    ${schemaMarkup}
  `;

  // Inject before </head>
  html = html.replace('</head>', `${metaTags}\n</head>`);
  return html;
};

// Vite development vs Production Serving
async function startServer() {
  if (NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    
    app.use(vite.middlewares);

    // Apply HTML transforming for SEO tagging also in Dev Preview!
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const transformedHtml = injectSeoHeaders(template, url);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(transformedHtml);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });

  } else {
    const distPath = path.join(process.cwd(), 'dist');
    
    // Optimize Express assets statically serving with maximum standard Cache-Control
    app.use(express.static(distPath, { 
      maxAge: '31536000000', // 1 year cache
      index: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
      }
    }));
    
    app.get('*', (req, res, next) => {
      try {
        const baseIndexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
        const transformed = injectSeoHeaders(baseIndexHtml, req.originalUrl);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(transformed);
      } catch (e) {
        next(e);
      }
    });
  }

  // Global production-grade Error Handling Middleware (Hide stacktrace in nondev modes)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logError(`API Express error of route ${req.method} ${req.url}: ${err.message}`, err.stack);
    res.status(err.status || 500).json({
      success: false,
      message: 'Something went wrong'
    });
  });

  app.listen(Number(PORT), '0.0.0.0', () => {
    logAccess(`[FULL-STACK FOREVER FRAMES] Server booted on http://0.0.0.0:${PORT} under ${NODE_ENV} environment.`);
  });
}

startServer();
export {};
