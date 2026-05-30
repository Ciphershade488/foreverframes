import fs from 'fs';
import path from 'path';
import { Lead, WeddingStory, Blog, Testimonial, TeamMember } from './types';

// Ensure data folder exists
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  leads: Lead[];
  stories: WeddingStory[];
  blogs: Blog[];
  testimonials: Testimonial[];
  team: TeamMember[];
  homepageContent: {
    heroTitle: string;
    heroSubtitle: string;
    heroVideoUrl: string;
    heroImageUrl: string;
    aboutText: string;
    awards: string[];
    instagramHandles: string[];
  };
  seoMetadata: Record<string, { title: string; description: string }>;
}

const defaultSeoMetadata: Record<string, { title: string; description: string }> = {
  home: {
    title: 'Forever Frames India | Premium Wedding Photography & Cinematography Services',
    description: 'Forever Frames India is a premium photography studio specializing in destination weddings, pre-wedding shoots, and high-end cinematic films pan India.'
  },
  blog: {
    title: 'Wedding Stories & Planning Blog - Forever Frames India',
    description: 'Expert wedding planning guides, clothing palette matching advices, and modern cinematography trends curated by Forever Frames India.'
  },
  portfolio: {
    title: 'Luxury Cinematic Wedding & Destination Portfolio | Forever Frames India',
    description: 'Savor our emotional and spectacular portfolio. Fine art candid portraits, beach pre-weddings, and glorious Indian wedding reels.'
  },
  contact: {
    title: 'Book Your Wedding Shoot - Forever Frames India',
    description: 'Reserve dates for your upcoming wedding, pre-wedding or engagement ceremony. Fast estimates and flexible premium package customization.'
  }
};

const defaultTestimonials: Testimonial[] = [
  {
    id: 't-1',
    clientName: 'Aditi & Mayank',
    quote: 'Forever Frames India made our Lucknow heritage wedding feel like an absolute fairytale! The candid expressions they captured are simply priceless. Their team was incredibly gentle and unobtrusive throughout our multi-day rituals.',
    location: 'Lucknow',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=150',
    eventType: 'Royal Awadhi Wedding',
    date: '2025-11-20'
  },
  {
    id: 't-2',
    clientName: 'Rohan & Sonal',
    quote: 'The beach pre-wedding shoot in South Goa surpassed every fantasy we had. The aerial drone films they engineered felt straight out of a premium movie. Highly, highly recommend Forever Frames India for couples looking for cinematic luxury!',
    location: 'Goa',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=150',
    eventType: 'Sunset Coastal Union',
    date: '2026-02-14'
  },
  {
    id: 't-3',
    clientName: 'Priyal & Abhishek',
    quote: 'Simply outstanding. They covered our Jaipur palace wedding with standard-setting dedication. Every detail - from the gold weave of my lehenga to the fireworks over the fort - was beautifully registered. Master class grading!',
    location: 'Jaipur',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=150',
    eventType: 'Palatial Destination Wedding',
    date: '2026-01-08'
  }
];

const defaultStories: WeddingStory[] = [
  {
    id: 's-1',
    title: 'A Royal Nawabi Confluence of Love',
    clientName: 'Aditi & Mayank',
    city: 'Lucknow',
    bannerUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000',
    description: 'Set inside a grand historical estate in Lucknow, this heritage wedding merged traditional Awadhi royal protocols with vibrant, modern energy. The highlights included early morning mist pre-weddings, a glowing marigold sangeet stage, and a majestic candlelit reception dinner showcasing custom culinary delights and traditional Gazal musical sessions.',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'wedding',
    videoUrl: 'Y7_2w9DbeM0', // Sample youtube ID
    date: '2025-11-20',
    featured: true
  },
  {
    id: 's-2',
    title: 'Azure Waves and Golden Sunsets in Cabo de Rama',
    clientName: 'Rohan & Sonal',
    city: 'Goa',
    bannerUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000',
    description: 'Rohan & Sonals coastal dream wedding was hosted on the soft ocean beaches of South Goa. An early morning pool party featuring tropical pastel clothes, followed by a romantic seaside pheras setup at twilight. The cinematic film highlighted ocean breezes and candlelit beach dancing under sparkling lanterns.',
    images: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'pre-wedding',
    videoUrl: '2H7-FMy5Nfs', // Sample youtube ID
    date: '2026-02-14',
    featured: true
  },
  {
    id: 's-3',
    title: 'Fairytale Rajputana Festivity inside Historic Havelis',
    clientName: 'Priyal & Abhishek',
    city: 'Jaipur',
    bannerUrl: 'https://images.unsplash.com/photo-1598124146163-36819847286d?auto=format&fit=crop&q=80&w=1000',
    description: 'A grand luxury palace celebration that paid tribute to ancient Rajasthani traditions. Pre-wedding snaps set against red sandstone forts, high-energy sangeet sequences, and royal mandaps dressed with fresh red and white roses. An elite experience through and through.',
    images: [
      'https://images.unsplash.com/photo-1598124146163-36819847286d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'destination',
    videoUrl: 'T7Jm_D1_bGA', // Sample youtube ID
    date: '2026-01-08',
    featured: true
  },
  {
    id: 's-4',
    title: 'The Shubh Bandhan Solitaire Engagement',
    clientName: 'Meera & Siddharth',
    city: 'Delhi',
    bannerUrl: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=1000',
    description: 'An ultra-premium engagement night hosted at a luxury farmhouse estate in Delhi. The aesthetic revolved around vintage mirror reflections, white orchids, and spectacular candle-lit arrays. Capturing the dynamic moment of rings exchange and emotional family toasts.',
    images: [
      'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'engagement',
    date: '2025-10-12',
    featured: true
  },
  {
    id: 's-5',
    title: 'Vibrant Marigold & Swirling Henna Melodies',
    clientName: 'Kriti & Raghav',
    city: 'Ayodhya',
    bannerUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000',
    description: 'A colorful, high-energy Haldi & Mehendi afternoon ceremony in the holy city of Ayodhya. Set on the banks of a beautiful heritage courtyard, featuring bright marigold rain, heavy dhol beats, and deep orange intricate henna patterns. We captured the playful splashes of yellow and candid family laughter.',
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'haldi-mehendi',
    date: '2025-12-05',
    featured: true
  },
  {
    id: 's-6',
    title: 'The Grand Regal Reception Soiree',
    clientName: 'Ananya & Vikram',
    city: 'Mumbai',
    bannerUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000',
    description: 'A glittering reception banquet at a seaside luxury hotel in Mumbai. Adorned with tall crystal candelabras and deep red roses, the evening celebrated the newlywed couple in high editorial style. From the dramatic entrance smoke to the champagne fountain, every second was documented with sheer visual perfection.',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'reception',
    date: '2026-03-01',
    featured: true
  }
];

const defaultBlogs: Blog[] = [
  {
    id: 'b-1',
    title: 'Top 7 Royal Heritage Pre-Wedding Venues in Lucknow',
    slug: 'heritage-pre-wedding-venues-lucknow',
    summary: 'Plan the ultimate pre-wedding photoshoot. We explore majestic palaces, vintage gardens, and royal spots inside Lucknow that look gorgeous on screen.',
    content: 'Lucknow, rich in cultural legacy and Nawabi architecture, offers unparalleled romantic vistas for modern couples. In this guide, our leading candid photographer lists the top 7 photography venues including: 1. The grand Residency gardens for sunset rays, 2. The Dilkusha Ruins for historic editorial romance, 3. The Gomti Riverfront for modern golden sky reflections, and secret old haveli courtyards. Learn how to style your designer sarees and bandhgalas to contrast beautifully with ancient red brick and white marble structures.',
    bannerUrl: 'https://images.unsplash.com/photo-1598124146163-36819847286d?auto=format&fit=crop&q=80&w=1000',
    tags: ['Pre-wedding', 'Lucknow', 'Planning'],
    author: 'Gaurav Shukla',
    date: '2026-03-22',
    readTime: '6 min read'
  },
  {
    id: 'b-2',
    title: 'Selecting the Absolute Color Palette for your Day Wedding',
    slug: 'color-palette-wedding-photography',
    summary: 'The colors you wear determine how your pictures turn out. Let’s decode current visual trends: mint greens, soft blush rose, and elegant pastel hues.',
    content: 'When it comes to high-end photography, clothing colors play a crucial role. While deep royal red lehengas remain a grand absolute, current Indian wedding trends show a shift towards subtle, atmospheric pastel tones. Under bright sunlight, standard saturation red can clip highlights. On the contrary, soft ivory, champagne gold, lavender, and mint yellow render highly aesthetic pastel gradients. Consult our comprehensive moodboards to coordinate with your matching grooms sherwanis for timeless visual uniformity!',
    bannerUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000',
    tags: ['Aesthetics', 'Outfits', 'Guides'],
    author: 'Neha Verma',
    date: '2026-04-10',
    readTime: '4 min read'
  },
  {
    id: 'b-3',
    title: 'Cinematic Wedding Films vs. Traditional Videos: The Key Differences',
    slug: 'cinematic-wedding-films-vs-traditional-videos',
    summary: 'Confused between choosing cinematic wedding films and long-form traditional footage? We break down camera gear, storytelling style, and editing pacing.',
    content: 'Traditional wedding videos usually run for hours, tracking every guest chronologically with static lighting and broad room angles. In contrast, premium Cinematic Wedding Films are curated pieces of emotional art. Our team uses top-tier mirrorless gear, multi-aperture anamorphic lenses, specialized audio microphones to record vows, and aerial drone cameras. The footage is structurally graded to evoke feelings, weaving family voices, tears, sangeet bass, and bright smiles into a magnificent 5-minute teaser and a 20-minute feature film.',
    bannerUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000',
    tags: ['Cinematography', 'Trends', 'Advice'],
    author: 'Arjun Sen',
    date: '2026-05-15',
    readTime: '8 min read'
  }
];

const defaultTeam: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Abhijeet',
    role: 'Founder & Creative Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    bio: 'Abhijeet is a master of candid timing and compositions, ensuring every flagship royal wedding feels majestic, timeless, and emotionally vibrant.'
  },
  {
    id: 'tm-2',
    name: 'Adarsh',
    role: 'Co-Founder & Chief Cinematographer',
    image: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=300',
    bio: 'With an expert eye for symmetry, camera motion, and aerial choreography, Adarsh designs our magnificent 4K cinematic film trailers.'
  },
  {
    id: 'tm-3',
    name: 'Neha Verma',
    role: 'Lead Candid Photographer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    bio: 'An expert in capturing fleeting seconds of laughter, teardrops, and subtle glances. Neha brings immense emotional warmth.'
  }
];

const defaultLeads: Lead[] = [
  {
    id: 'l-1',
    name: 'Rajendra Prasad',
    email: 'rajendra.p@gmail.com',
    phone: '+91 91292 63949',
    eventDate: '2026-11-28',
    budgetRange: '₹3,00,000 - ₹5,0,000',
    location: 'Lucknow',
    serviceType: 'both',
    message: 'Looking for a comprehensive 3-day coverage (Haldi, Sangeet, and Royal Wedding) in Gomti Nagar. Needs cinematic film and hardbound premium albums.',
    status: 'new',
    createdAt: new Date().toISOString(),
    notes: 'Awaiting wedding outfit coordinates.'
  },
  {
    id: 'l-2',
    name: 'Kritika Sharma',
    email: 'kriti.sharma@hotmail.com',
    phone: '+91 91122 33445',
    eventDate: '2026-12-15',
    budgetRange: '₹5,00,000+',
    location: 'Jaipur',
    serviceType: 'both',
    message: 'Destination wedding at Alsisar Haveli. Need 4 members of the core team for creative photography and cinematic film editing.',
    status: 'contacted',
    createdAt: new Date().toISOString(),
    notes: 'Initial estimate shared. Bride interested in drone coverage.'
  }
];

class DatabaseManager {
  private schema: DatabaseSchema = {
    leads: [],
    stories: [],
    blogs: [],
    testimonials: [],
    team: [],
    homepageContent: {
      heroTitle: 'Capturing Moments, Creating Forever Memories',
      heroSubtitle: 'Premium Wedding Photography & Cinematography Services Across India',
      heroVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-bride-spinning-and-smiling-39906-large.mp4', // Premium placeholder video
      heroImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600',
      aboutText: 'Forever Frames India is a premium visual arts studio. We do not just record weddings; we tell beautiful love stories. From heritage royal settings in Lucknow and traditional steps in Ayodhya, to the beach sands of South Goa and palaces of Rajasthan, we curate pristine, emotionally expressive frames that celebrate the deep, vibrant beauty of Indian weddings.',
      awards: [
        'Top 10 Wedding Filmmakers India - WeddingSutra Awards',
        'Best Candid Portrait Portfolio Winner - IPCO',
        'Leading Premium Studio award - Zee Business Luxe'
      ],
      instagramHandles: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=250',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=250',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=250',
        'https://images.unsplash.com/photo-1598124146163-36819847286d?auto=format&fit=crop&q=80&w=250',
        'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=250',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=250'
      ]
    },
    seoMetadata: defaultSeoMetadata
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.schema = { ...this.schema, ...parsed };
      } else {
        // Load default seed data
        this.schema.leads = defaultLeads;
        this.schema.stories = defaultStories;
        this.schema.blogs = defaultBlogs;
        this.schema.testimonials = defaultTestimonials;
        this.schema.team = defaultTeam;
        this.save();
      }
    } catch (error) {
      console.error('Failed to init file database, running in-memory:', error);
    }
  }

  private save() {
    const lockFile = DB_FILE + '.lock';
    
    // Simple file lock logic with retry
    let attempts = 0;
    while (fs.existsSync(lockFile) && attempts < 10) {
      const end = Date.now() + 20;
      while (Date.now() < end) {}
      attempts++;
    }

    try {
      // Acquire Lock
      fs.writeFileSync(lockFile, 'lock', 'utf-8');

      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      const backupDir = path.join(DATA_DIR, 'backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const today = new Date().toISOString().split('T')[0];
      const backupFile = path.join(backupDir, `db-${today}.json`);
      const dbContent = JSON.stringify(this.schema, null, 2);

      // Prevent corruption: Write to .tmp first, then rename atomically
      const tempFile = DB_FILE + '.tmp';
      fs.writeFileSync(tempFile, dbContent, 'utf-8');
      fs.renameSync(tempFile, DB_FILE);

      // Create or overwrite daily backup
      fs.writeFileSync(backupFile, dbContent, 'utf-8');

    } catch (error) {
      console.error('Failed to save database file safely:', error);
    } finally {
      // Release Lock
      try {
        if (fs.existsSync(lockFile)) {
          fs.unlinkSync(lockFile);
        }
      } catch (e) {
        console.error('Failed to remove database lock file:', e);
      }
    }
  }

  // LEADS
  getLeads(): Lead[] {
    return this.schema.leads;
  }

  addLead(lead: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead {
    const newLead: Lead = {
      ...lead,
      id: 'l-' + Date.now(),
      status: 'new',
      createdAt: new Date().toISOString()
    };
    this.schema.leads.unshift(newLead);
    this.save();
    return newLead;
  }

  updateLeadStatus(id: string, status: Lead['status'], notes?: string): Lead | null {
    const lead = this.schema.leads.find((l) => l.id === id);
    if (lead) {
      lead.status = status;
      if (notes !== undefined) {
        lead.notes = notes;
      }
      this.save();
      return lead;
    }
    return null;
  }

  deleteLead(id: string): boolean {
    const initialLength = this.schema.leads.length;
    this.schema.leads = this.schema.leads.filter((l) => l.id !== id);
    if (this.schema.leads.length !== initialLength) {
      this.save();
      return true;
    }
    return false;
  }

  // STORIES
  getStories(): WeddingStory[] {
    return this.schema.stories;
  }

  addStory(story: Omit<WeddingStory, 'id'>): WeddingStory {
    const newStory: WeddingStory = {
      ...story,
      id: 's-' + Date.now()
    };
    this.schema.stories.unshift(newStory);
    this.save();
    return newStory;
  }

  deleteStory(id: string): boolean {
    const initialLength = this.schema.stories.length;
    this.schema.stories = this.schema.stories.filter((s) => s.id !== id);
    if (this.schema.stories.length !== initialLength) {
      this.save();
      return true;
    }
    return false;
  }

  // BLOGS
  getBlogs(): Blog[] {
    return this.schema.blogs;
  }

  addBlog(blog: Omit<Blog, 'id' | 'slug' | 'date'>): Blog {
    const slug = blog.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const newBlog: Blog = {
      ...blog,
      id: 'b-' + Date.now(),
      slug,
      date: new Date().toISOString().split('T')[0]
    };
    this.schema.blogs.unshift(newBlog);
    this.save();
    return newBlog;
  }

  deleteBlog(id: string): boolean {
    const initialLength = this.schema.blogs.length;
    this.schema.blogs = this.schema.blogs.filter((b) => b.id !== id);
    if (this.schema.blogs.length !== initialLength) {
      this.save();
      return true;
    }
    return false;
  }

  // TESTIMONIALS
  getTestimonials(): Testimonial[] {
    return this.schema.testimonials;
  }

  addTestimonial(testimonial: Omit<Testimonial, 'id' | 'date'>): Testimonial {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: 't-' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    this.schema.testimonials.unshift(newTestimonial);
    this.save();
    return newTestimonial;
  }

  deleteTestimonial(id: string): boolean {
    const initialLength = this.schema.testimonials.length;
    this.schema.testimonials = this.schema.testimonials.filter((t) => t.id !== id);
    if (this.schema.testimonials.length !== initialLength) {
      this.save();
      return true;
    }
    return false;
  }

  // TEAM
  getTeam(): TeamMember[] {
    return this.schema.team;
  }

  addTeamMember(member: Omit<TeamMember, 'id'>): TeamMember {
    const newMember: TeamMember = {
      ...member,
      id: 'tm-' + Date.now()
    };
    this.schema.team.push(newMember);
    this.save();
    return newMember;
  }

  deleteTeamMember(id: string): boolean {
    const initialLength = this.schema.team.length;
    this.schema.team = this.schema.team.filter((tm) => tm.id !== id);
    if (this.schema.team.length !== initialLength) {
      this.save();
      return true;
    }
    return false;
  }

  // HOMEPAGE EDIT
  getHomepageContent() {
    return this.schema.homepageContent;
  }

  updateHomepageContent(content: Partial<DatabaseSchema['homepageContent']>) {
    this.schema.homepageContent = {
      ...this.schema.homepageContent,
      ...content
    };
    this.save();
    return this.schema.homepageContent;
  }

  // SEO METADATA
  getSeoMetadata(): Record<string, { title: string; description: string }> {
    return this.schema.seoMetadata;
  }

  updateSeoMetadata(page: string, seo: { title: string; description: string }) {
    this.schema.seoMetadata[page] = seo;
    this.save();
    return this.schema.seoMetadata;
  }
}

export const dbService = new DatabaseManager();
