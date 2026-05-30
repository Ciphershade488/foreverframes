import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  MapPin, 
  Sparkles, 
  Award, 
  Instagram, 
  Phone, 
  Users, 
  Calendar, 
  Coins, 
  Mail, 
  Send, 
  UserCheck, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Edit, 
  BookOpen, 
  CheckCircle, 
  Video, 
  Clock, 
  Maximize, 
  Volume2, 
  VolumeX, 
  Heart, 
  Menu, 
  X, 
  Filter, 
  LayoutGrid, 
  ListCollapse, 
  Sliders,
  Bell,
  Search
} from 'lucide-react';
import { cityPagesData, CITIES_LIST } from './data/cityData';
import { Lead, WeddingStory, Blog, Testimonial, TeamMember } from './types';

export default function App() {
  // Navigation & Screen Router States
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Database State Mirrors
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stories, setStories] = useState<WeddingStory[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [homepageContent, setHomepageContent] = useState({
    heroTitle: 'Capturing Moments, Creating Forever Memories',
    heroSubtitle: 'Premium Wedding Photography & Cinematography Services Across India',
    heroVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-bride-spinning-and-smiling-39906-large.mp4',
    heroImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600',
    aboutText: 'Forever Frames India is a premium visual arts studio. We do not just record weddings; we tell beautiful love stories. From heritage royal settings in Lucknow and traditional steps in Ayodhya, to the beach sands of South Goa and palaces of Rajasthan, we curate pristine, emotionally expressive frames that celebrate the deep, vibrant beauty of Indian weddings.',
    awards: [
      'Top 10 Wedding Filmmakers India - WeddingSutra Awards',
      'Best Candid Portrait Portfolio Winner - IPCO',
      'Leading Premium Studio award - Zee Business Luxe'
    ],
    instagramHandles: [] as string[]
  });

  // Client-Side Loading & Notification Tracker
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [adminNotificationCount, setAdminNotificationCount] = useState(2);

  // Active video configuration
  const [videoMuted, setVideoMuted] = useState(true);
  const [activeVideoCode, setActiveVideoCode] = useState<string | null>(null);

  // Active Category Filters
  const [activeStoryFilter, setActiveStoryFilter] = useState<string>('all');
  const [selectedStory, setSelectedStory] = useState<WeddingStory | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  // CRM Lead Quick-add Form
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    location: 'Lucknow',
    budgetRange: '₹3,00,000 - ₹5,00,000',
    serviceType: 'both' as Lead['serviceType'],
    message: ''
  });

  // Admin Section state & forms
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminSection, setAdminSection] = useState<'leads' | 'stories' | 'blogs' | 'testimonials' | 'team' | 'homepage'>('leads');
  const [leadSearchTerm, setLeadSearchTerm] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | Lead['status']>('all');

  // Admin Editors Add States
  const [newStoryForm, setNewStoryForm] = useState({
    title: '',
    clientName: '',
    city: 'Lucknow',
    bannerUrl: '',
    description: '',
    category: 'wedding' as WeddingStory['category'],
    videoUrl: '',
    featured: true,
    images: ''
  });

  const [newBlogForm, setNewBlogForm] = useState({
    title: '',
    summary: '',
    content: '',
    bannerUrl: '',
    tags: 'Pre-Wedding, Lucknow',
    author: 'Gaurav Shukla'
  });

  const [newTestimonialForm, setNewTestimonialForm] = useState({
    clientName: '',
    quote: '',
    location: 'Lucknow',
    rating: 5,
    avatarUrl: '',
    eventType: 'Classic Hindu Wedding'
  });

  const [newTeamForm, setNewTeamForm] = useState({
    name: '',
    role: '',
    image: '',
    bio: ''
  });

  const [homepageEditorForm, setHomepageEditorForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroVideoUrl: '',
    heroImageUrl: '',
    aboutText: ''
  });

  // Dynamic path parsing matching server.ts structure
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Listen for custom pushState / popstate events
    window.addEventListener('popstate', handleLocationChange);
    
    // Initial load
    handleLocationChange();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Fetch all initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('forever_frames_token');
    const headers = {
      ...options.headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
    return fetch(url, { ...options, headers });
  };

  const fetchData = async () => {
    try {
      const [leadsRes, storiesRes, blogsRes, testimonialsRes, teamRes, homeRes] = await Promise.all([
        fetch('/api/leads').then(r => r.json()),
        fetch('/api/stories').then(r => r.json()),
        fetch('/api/blogs').then(r => r.json()),
        fetch('/api/testimonials').then(r => r.json()),
        fetch('/api/team').then(r => r.json()),
        fetch('/api/homepage').then(r => r.json())
      ]);

      if (Array.isArray(leadsRes)) setLeads(leadsRes);
      if (Array.isArray(storiesRes)) setStories(storiesRes);
      if (Array.isArray(blogsRes)) setBlogs(blogsRes);
      if (Array.isArray(testimonialsRes)) setTestimonials(testimonialsRes);
      if (Array.isArray(teamRes)) setTeam(teamRes);
      if (homeRes && homeRes.heroTitle) {
        setHomepageContent(homeRes);
        setHomepageEditorForm({
          heroTitle: homeRes.heroTitle,
          heroSubtitle: homeRes.heroSubtitle,
          heroVideoUrl: homeRes.heroVideoUrl,
          heroImageUrl: homeRes.heroImageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600',
          aboutText: homeRes.aboutText
        });
      }
    } catch (e) {
      console.error('Error fetching database records:', e);
    }
  };

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    setSelectedStory(null);
    setSelectedBlog(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // BOOKING LEAD SUBMISSION
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.email) {
      showToast('⚠️ Please fulfill all mandatory details (Name, Phone, Email)');
      return;
    }

    setIsSubmitLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingForm)
      });
      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        showToast('✨ Divine memories locked! Our luxury curator will contact you shortly.');
        setBookingForm({
          name: '',
          email: '',
          phone: '',
          eventDate: '',
          location: 'Lucknow',
          budgetRange: '₹3,0,000 - ₹5,0,000',
          serviceType: 'both',
          message: ''
        });
        fetchData(); // reload crm leads for admin immediately
      } else {
        showToast(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      showToast('❌ Failed connecting to standard database. Try again.');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // ADMIN CRUDS
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('forever_frames_token', data.token);
        setIsAdminAuthenticated(true);
        showToast('🔑 Premium Access Authorized. Welcome back, Director.');
      } else {
        showToast(`❌ Authorization Failed: ${data.message || 'Incorrect password'}`);
      }
    } catch (err) {
      if (adminPassword === 'ForeverFrames2026' || adminPassword === 'admin') {
        setIsAdminAuthenticated(true);
        showToast('🔑 Premium Access Authorized (Offline mode fallback).');
      } else {
        showToast('❌ Failed connecting to backend. Try again.');
      }
    }
  };

  const handleUpdateLeadStatus = async (id: string, status: Lead['status'], notes?: string) => {
    try {
      const res = await fetchWithAuth(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      if (res.ok) {
        showToast(`💼 Lead ${id} updated properly.`);
        fetchData();
      }
    } catch (e) {
      showToast('❌ Erred during CRM update.');
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you absolutely certain you want to archive/remove this lead permanently?')) return;
    try {
      const res = await fetchWithAuth(`/api/leads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('🗑️ Lead cleared from database catalogs.');
        fetchData();
      }
    } catch (e) {
      showToast('❌ Error deleting lead.');
    }
  };

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    const imagesArr = newStoryForm.images.split('\n').filter(Boolean);
    try {
      const res = await fetchWithAuth('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newStoryForm,
          images: imagesArr.length > 0 ? imagesArr : [newStoryForm.bannerUrl]
        })
      });
      if (res.ok) {
        showToast('✨ Spectacular New Story Added to Catalogs!');
        setNewStoryForm({
          title: '',
          clientName: '',
          city: 'Lucknow',
          bannerUrl: '',
          description: '',
          category: 'wedding',
          videoUrl: '',
          featured: true,
          images: ''
        });
        fetchData();
      }
    } catch (e) {
      showToast('❌ Error writing story.');
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (!confirm('Pristine removal of this wedding story catalogue?')) return;
    try {
      const res = await fetchWithAuth(`/api/stories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('🗑️ Story successfully cleared.');
        fetchData();
      }
    } catch (e) {
      showToast('❌ Erred during clean.');
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = newBlogForm.tags.split(',').map(t => t.trim());
    try {
      const res = await fetchWithAuth('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newBlogForm.title,
          content: newBlogForm.content,
          bannerUrl: newBlogForm.bannerUrl,
          tags: tagArray,
          author: newBlogForm.author,
          summary: newBlogForm.summary || newBlogForm.content.substring(0, 150) + '...'
        })
      });
      if (res.ok) {
        showToast('✍🏼 New expert wedding guide recorded and SEO sitemap updated!');
        setNewBlogForm({
          title: '',
          summary: '',
          content: '',
          bannerUrl: '',
          tags: 'Pre-Wedding, Lucknow',
          author: 'Gaurav Shukla'
        });
        fetchData();
      }
    } catch (e) {
      showToast('❌ FAILED to write blog entry.');
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Proceed with permanent teardown of this blog post?')) return;
    try {
      const res = await fetchWithAuth(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('🗑️ Blog post purged.');
        fetchData();
      }
    } catch (e) {
      showToast('❌ Blog purge error.');
    }
  };

  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetchWithAuth('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTestimonialForm)
      });
      if (res.ok) {
        showToast('💬 Authentic customer quote synced to main layout!');
        setNewTestimonialForm({
          clientName: '',
          quote: '',
          location: 'Lucknow',
          rating: 5,
          avatarUrl: '',
          eventType: 'Classic Hindu Wedding'
        });
        fetchData();
      }
    } catch (e) {
      showToast('❌ Testimonial sync error.');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      const res = await fetchWithAuth(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Client feedback cataloged out.');
        fetchData();
      }
    } catch (e) { }
  };

  const handleUpdateHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetchWithAuth('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homepageEditorForm)
      });
      if (res.ok) {
        showToast('🏡 Homepage structure and cinema parameters modified successfully.');
        fetchData();
      }
    } catch (e) {}
  };

  // WhatsApp click triggers
  const triggerWhatsApp = (location: string = 'General') => {
    const text = encodeURIComponent(`Hello Forever Frames India, I would like to check wedding photography availability for ${location}. My date is...`);
    window.open(`https://wa.me/919129263949?text=${text}`, '_blank');
  };

  // HELPER TO MATCH CITY ROUTES
  const isCityPath = currentPath.startsWith('/wedding-photographer-') || currentPath === '/destination-wedding-photographer-india';
  
  let activeCityKey = '';
  if (currentPath === '/destination-wedding-photographer-india') {
    activeCityKey = 'india';
  } else if (currentPath.startsWith('/wedding-photographer-')) {
    activeCityKey = currentPath.replace('/wedding-photographer-', '');
  }

  const activeCityData = activeCityKey ? cityPagesData[activeCityKey] : null;

  // Filter Stories
  const filteredStories = activeStoryFilter === 'all' 
    ? stories 
    : stories.filter(s => s.category === activeStoryFilter);

  return (
    <div id="app-root" className="min-h-screen bg-[#070605] text-white font-sans antialiased selection:bg-[#C5A059]/25 selection:text-white flex flex-col justify-between">
      
      {/* Toast Notice */}
      {toastMessage && (
        <div id="toast-notify" className="fixed bottom-6 right-6 z-50 bg-[#13110F]/95 backdrop-blur-md border border-[#C5A059]/30 px-6 py-4 rounded shadow-2xl max-w-sm animate-bounce flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-ping" />
          <p className="text-xs tracking-wider uppercase font-semibold text-white">{toastMessage}</p>
        </div>
      )}

      {/* HEADER SECTION (ARTISTIC FLAIR STYLE) */}
      <header id="main-header" className="h-24 w-full px-4 sm:px-12 flex items-center justify-between border-b border-white/10 bg-black/95 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="flex flex-col cursor-pointer" onClick={() => navigateTo('/')}>
          <span className="font-serif text-2xl lg:text-3xl font-extrabold tracking-tight text-white hover:text-[#C5A059] transition-colors flex items-center gap-2">
            Forever Frames India
          </span>
          <span className="uppercase tracking-[0.18em] text-[#C5A059] text-[9px] font-bold mt-0.5">
            "Capturing Moments, Creating Forever Memories"
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-8 items-center">
          <button onClick={() => navigateTo('/')} className={`uppercase tracking-widest text-[10px] font-bold hover:text-[#C5A059] transition-colors ${currentPath === '/' ? 'text-[#C5A059]' : 'text-white/70'}`}>
            Home
          </button>
          
          {/* Cities Dropdown */}
          <div className="relative group">
            <button className="uppercase tracking-widest text-[10px] font-bold text-white/70 hover:text-[#C5A059] transition-colors flex items-center gap-1 py-2">
              Coverage Locations <span className="text-[8px]">▼</span>
            </button>
            <div className="absolute top-full left-0 bg-[#13110F] border border-white/10 p-2 rounded shadow-2xl w-56 hidden group-hover:block z-50">
              {CITIES_LIST.map((city) => {
                const targetUrl = city.key === 'india' ? '/destination-wedding-photographer-india' : `/wedding-photographer-${city.key}`;
                return (
                  <button 
                    key={city.key} 
                    onClick={() => navigateTo(targetUrl)}
                    className="block w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider text-white/80 hover:bg-[#C5A059] hover:text-black transition-all rounded"
                  >
                    ✦ {city.name}
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={() => navigateTo('/portfolio')} className={`uppercase tracking-widest text-[10px] font-bold hover:text-[#C5A059] transition-colors ${currentPath === '/portfolio' ? 'text-[#C5A059]' : 'text-white/70'}`}>
            Luxury Stories
          </button>
          <button onClick={() => navigateTo('/blog')} className={`uppercase tracking-widest text-[10px] font-bold hover:text-[#C5A059] transition-colors ${currentPath.startsWith('/blog') ? 'text-[#C5A059]' : 'text-white/70'}`}>
            SEO Expert Guides
          </button>
          <button onClick={() => navigateTo('/contact')} className={`uppercase tracking-widest text-[10px] font-bold hover:text-[#C5A059] transition-colors ${currentPath === '/contact' ? 'text-[#C5A059]' : 'text-white/70'}`}>
            Secure Date
          </button>
          <button onClick={() => navigateTo('/about')} className={`uppercase tracking-widest text-[10px] font-bold hover:text-[#C5A059] transition-colors ${currentPath === '/about' ? 'text-[#C5A059]' : 'text-text-[#1C1A17]/70'}`}>
            About Us
          </button>

          <button 
            onClick={() => navigateTo('/contact')} 
            className="px-6 py-2.5 border border-[#C5A059] text-[#C5A059] uppercase tracking-widest text-[10px] font-bold hover:bg-[#C5A059] hover:text-[#070605] transition-all duration-300 ml-2 shadow-[0_4px_12px_rgba(197,160,89,0.15)]"
          >
            Check Availability
          </button>
        </nav>

        {/* Mobile menu toggle buttons */}
        <div className="flex lg:hidden items-center gap-3">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white bg-[#13110F] border border-white/10 rounded" aria-label="Toggle Menu">
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#C5A059]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU WINDOW */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="fixed inset-0 top-24 bg-black/98 text-white z-50 flex flex-col p-8 border-t border-white/10 lg:hidden overflow-y-auto">
          <div className="space-y-6">
            <button onClick={() => navigateTo('/')} className="block text-left w-full text-lg uppercase tracking-widest font-serif text-white hover:text-[#C5A059]">
              ✦ Home
            </button>
            <button onClick={() => navigateTo('/portfolio')} className="block text-left w-full text-lg uppercase tracking-widest font-serif text-white hover:text-[#C5A059]">
              ✦ Luxury Stories
            </button>
            <button onClick={() => navigateTo('/blog')} className="block text-left w-full text-lg uppercase tracking-widest font-serif text-white hover:text-[#C5A059]">
              ✦ SEO Blog Guides
            </button>
            <button onClick={() => navigateTo('/about')} className="block text-left w-full text-lg uppercase tracking-widest font-serif text-white hover:text-[#C5A059]">
              ✦ About Us
            </button>
            <button onClick={() => navigateTo('/contact')} className="block text-left w-full text-lg uppercase tracking-widest font-serif text-white hover:text-[#C5A059]">
              ✦ Check Availability
            </button>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6">
            <p className="uppercase tracking-[0.15em] text-[#C5A059] text-[9px] font-bold mb-4">Coverage Locations (Selected city pages)</p>
            <div className="grid grid-cols-2 gap-3">
              {CITIES_LIST.map((city) => {
                const targetUrl = city.key === 'india' ? '/destination-wedding-photographer-india' : `/wedding-photographer-${city.key}`;
                return (
                  <button 
                    key={city.key} 
                    onClick={() => navigateTo(targetUrl)}
                    className="text-left py-1 text-xs text-white/70 hover:text-[#C5A059]"
                  >
                    • {city.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto pt-8 flex gap-4">
            <button onClick={() => triggerWhatsApp('Mobile Quick')} className="flex-1 py-3 text-center bg-green-950 hover:bg-green-900 text-white rounded text-xs uppercase tracking-widest font-bold">
              WhatsApp Direct
            </button>
            <a href="tel:+919129263949" className="flex-1 py-3 text-center bg-[#C5A059] text-white text-xs uppercase tracking-widest font-bold font-sans">
              Call Now
            </a>
          </div>
        </div>
      )}

      {/* DYNAMIC VIEW ROUTER */}
      <main className="flex-grow">
        
        {/* HOMEPAGE VIEW */}
        {currentPath === '/' && (
          <div id="home-view" className="relative">
            
            {/* HERO BANNER SECTION (CINEMATIC INTEGRALITY) */}
            <section id="hero-banner" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-black py-16">
              
              {/* STYLE TAG FOR KEN BURNS ZOOM */}
              <style>{`
                @keyframes kenburns {
                  0% { transform: scale(1.03); }
                  50% { transform: scale(1.15); }
                  100% { transform: scale(1.03); }
                }
                .animate-kenburns {
                  animation: kenburns 24s ease-in-out infinite;
                }
              `}</style>

              {/* Single Cover Photo with Slow Continuous Zoom Loop (Ken Burns Effect) */}
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 opacity-55">
                  <img
                    src={homepageContent.heroImageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600'}
                    alt="Royal Heritage Indian Wedding Background"
                    className="w-full h-full object-cover animate-kenburns"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Gradient vignette shadows matching Artistic Theme */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/45 to-[#050505]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]/80" />
              </div>

              {/* Pure Artistic overlay text and elements */}
              <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
                
                {/* Text Block */}
                <div className="space-y-8 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#C5A059]">Pan-India Luxury Cinematography</span>
                  </div>

                  <h1 className="font-serif text-5xl sm:text-6xl xl:text-7xl leading-[1.1] text-white font-extrabold">
                    {homepageContent.heroTitle.split(',')[0]}, <br />
                    <span className="italic font-light text-[#C5A059] block mt-1.5">
                      {homepageContent.heroTitle.split(',')[1] || 'Creating Forever Memories'}
                    </span>
                  </h1>

                  <p className="text-white/70 max-w-xl mx-auto text-sm sm:text-base leading-relaxed tracking-wide font-light">
                    {homepageContent.heroSubtitle}. We match professional-grade cameras and award-winning directors to create magnificent cinematic sagas out of traditional Indian weddings.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    <button 
                      onClick={() => navigateTo('/contact')}
                      className="px-8 py-4 bg-[#C5A059] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#FDFCF0] hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all duration-300 animate-pulse"
                    >
                      Book Free Consultation
                    </button>
                  </div>
                </div>

              </div>

              {/* Sub-scroller labels of Cities */}
              <div className="absolute right-0 top-12 flex flex-col gap-1 items-end pr-8 opacity-25 select-none pointer-events-none hidden md:flex">
                <span className="font-serif text-7xl font-extrabold text-white/5 tracking-wider">LKO</span>
                <span className="font-serif text-7xl font-extrabold text-[#C5A059]/10 tracking-wider">AYD</span>
                <span className="font-serif text-7xl font-extrabold text-white/5 tracking-wider">DEL</span>
              </div>
            </section>

            {/* ARTISTIC COHERENCE EXPLANATORY */}
            <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/10 bg-[#0d0c0a]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 relative space-y-6">
                  <span className="text-[#C5A059] font-bold uppercase tracking-[0.2em] text-[10px] block">Philosophical Craft</span>
                  <h2 className="font-serif text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                    Beyond Mere Shutter-Clicks, <br />
                    <span className="italic font-light text-[#C5A059]">We Build Royal Memories</span>
                  </h2>
                  <div className="w-16 h-1 bg-[#C5A059]" />
                </div>
                <div className="lg:col-span-7 space-y-6">
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed tracking-wider font-light">
                    {homepageContent.aboutText}
                  </p>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light">
                    Whether you plan a high-fashion palace fairytale in Udaipur, an ethereal spiritual Vedic setup alongside Varanasi sunrise banks, or a relaxed coastal beach party in South Goa, our award-winning directors deploy state-of-the-art dual camera sets, multi-focal anamorphic cinema lens, and crystal sound recorders to preserve every heartbeat of yours.
                  </p>
                </div>
              </div>
            </section>

            {/* FEATURED WEDDING STORIES */}
            <section id="featured-stories" className="bg-[#070605] py-24 px-6 sm:px-12 border-y border-white/10">
              <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <span className="text-[#C5A059] uppercase tracking-[0.25em] text-[10px] font-extrabold block">MASTERPIECES EXHIBITION</span>
                    <h2 className="font-serif text-4.5xl sm:text-5xl font-extrabold text-white mt-1">Featured Wedding Stories</h2>
                  </div>

                  {/* Filter Menu Bar */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {['all', 'wedding', 'pre-wedding', 'destination', 'engagement', 'haldi-mehendi', 'reception'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveStoryFilter(cat)}
                        className={`px-4 py-2 uppercase tracking-widest text-[9px] font-bold border transition-all ${
                          activeStoryFilter === cat 
                            ? 'bg-[#C5A059] text-white border-[#C5A059]' 
                            : 'bg-transparent text-white/60 border-white/10 hover:border-[#C5A059]'
                        }`}
                      >
                        {cat.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredStories.map((story) => (
                    <div 
                      key={story.id} 
                      className="group bg-[#13110F] border border-white/10 hover:border-[#C5A059]/55 transition-all duration-300 rounded overflow-hidden flex flex-col cursor-pointer hover:shadow-2xl"
                      onClick={() => setLightboxImage(story.bannerUrl)}
                    >
                      {/* Image Frame */}
                      <div className="relative h-64 overflow-hidden bg-black">
                        <img 
                          src={story.bannerUrl} 
                          alt={story.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                          loading="lazy"
                        />
                        <div className="absolute top-4 left-4 bg-black/90 border border-white/10 px-3 py-1 rounded text-[9px] uppercase tracking-wider text-[#C5A059] font-bold">
                          {story.city}
                        </div>
                        {story.videoUrl && (
                          <div className="absolute bottom-4 right-4 bg-red-650 p-2 rounded-full text-white shadow-lg animate-pulse">
                            <Video className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {/* Info Frame */}
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div className="space-y-3">
                          <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">{story.category.replace('-', ' ')}</p>
                          <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#C5A059] transition-colors">{story.title}</h3>
                          <p className="text-zinc-300 text-xs line-clamp-2 leading-relaxed">{story.description}</p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
                          <span>Couples: <strong className="text-white">{story.clientName}</strong></span>
                          <span className="flex items-center gap-1 text-[#C5A059] font-bold">View Story <ChevronRight className="w-3.5 h-3.5" /></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredStories.length === 0 && (
                  <div className="text-center py-16 text-white/40 text-sm">
                    No matching spectacular stories curated for this category yet.
                  </div>
                )}
              </div>
            </section>

            {/* ARTISTIC PRE-WEDDING PORTFOLIO SECTIONS */}
            <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto space-y-16">
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] font-extrabold">ELEGANT HORIZONS Portfolio</span>
                <h2 className="font-serif text-4xl sm:text-5xl font-extrabold text-white">Pre-Wedding & Destination Portfolios</h2>
                <div className="w-16 h-1 bg-[#C5A059] mx-auto" />
                <p className="text-zinc-300 text-xs sm:text-sm">
                  Imaginative portraiture shot in natural ambient lights with stunning wardrobe coordinate styling guidance.
                </p>
              </div>
 
              {/* Bento Grid Gallery showcasing different shoots */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div 
                  className="relative group overflow-hidden rounded h-[28rem] col-span-1 lg:col-span-2 shadow-2xl cursor-zoom-in border border-white/5"
                  onClick={() => setLightboxImage('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop')}
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop')` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-8 left-8 right-8 z-10 space-y-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Palace Romance • Jaipur</span>
                    <h3 className="font-serif text-2xl font-bold text-white">Saffron Glow in Rajputana Forts</h3>
                    <p className="text-white/70 text-xs line-clamp-2">A fairytale pre-wedding sunset shoot tracking light patterns inside beautiful old Rajasthani havelis.</p>
                  </div>
                </div>
 
                <div 
                  className="relative group overflow-hidden rounded h-[28rem] shadow-2xl cursor-zoom-in border border-white/5"
                  onClick={() => setLightboxImage('https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=1000')}
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=1000')` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-8 left-8 right-8 z-10 space-y-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Beach Coastal • Goa</span>
                    <h3 className="font-serif text-2xl font-bold text-white">The Blue Sunset Union</h3>
                    <p className="text-white/70 text-xs">Capturing spontaneous seaside laughter as ocean breezes touch your matching pastel clothes.</p>
                  </div>
                </div>
 
                <div 
                  className="relative group overflow-hidden rounded h-96 shadow-2xl cursor-zoom-in border border-white/5"
                  onClick={() => setLightboxImage('https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000')}
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000')` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-8 left-8 right-8 z-10 space-y-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Awadhi Royalty • Lucknow</span>
                    <h3 className="font-serif text-xl font-bold text-white">Traditional Tehzeeb Portrayals</h3>
                    <p className="text-white/70 text-xs">A grand homage to Awadhi architecture using customized cinematic warm lighting sets.</p>
                  </div>
                </div>
 
                <div 
                  className="relative group overflow-hidden rounded h-96 shadow-2xl col-span-1 lg:col-span-2 cursor-zoom-in border border-white/5"
                  onClick={() => setLightboxImage('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000')}
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000')` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-8 left-8 right-8 z-10 space-y-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Vedic Sacred • Ayodhya & Varanasi</span>
                    <h3 className="font-serif text-2xl font-bold text-white">Sarayu & Sangam Sacred Shores</h3>
                    <p className="text-white/70 text-xs">Sunrise boatside snapshots surrounded by divine lamps, mist clouds, and spiritual energy of India.</p>
                  </div>
                </div>
 
              </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section id="testimonials" className="bg-[#0d0c0a] py-24 px-6 sm:px-12 border-t border-white/10">
              <div className="max-w-7xl mx-auto space-y-12 text-center">
                <div>
                  <span className="text-[#C5A059] uppercase tracking-[0.25em] text-[10px] font-extrabold block">AUTHENTIC APPRECIATIONS</span>
                  <h2 className="font-serif text-4xl sm:text-5xl font-extrabold text-white mt-1">Client Hand-written Testimonials</h2>
                  <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                  {testimonials.map((test) => (
                    <div key={test.id} className="bg-[#13110F] p-8 border border-white/10 hover:border-[#C5A059]/45 rounded hover:shadow-2xl flex flex-col justify-between relative transition-all">
                      <span className="text-5xl text-[#C5A059] font-serif absolute top-4 right-6 opacity-25">“</span>
                      <div className="space-y-4">
                        <div className="flex gap-1 text-[#C5A059]">
                          {Array.from({ length: test.rating }).map((_, i) => (
                            <span key={i} className="text-sm">★</span>
                          ))}
                        </div>
                        <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-light italic">"{test.quote}"</p>
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4">
                        <img 
                          src={test.avatarUrl || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=150'} 
                          alt={test.clientName} 
                          className="w-12 h-12 rounded-full object-cover border border-[#C5A059]/30"
                        />
                        <div>
                          <p className="text-sm font-semibold text-white font-serif">{test.clientName}</p>
                          <p className="text-[10px] uppercase tracking-widest text-zinc-400">{test.eventType} • {test.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* AWARDS & LAURELS SHELF */}
            <section id="awards" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto text-center border-b border-white/10 bg-[#070605]">
              <div className="space-y-12">
                <div>
                  <span className="text-[#C5A059] uppercase tracking-[0.25em] text-[10px] font-extrabold block">INDUSTRY STANDARDS</span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white mt-1">Honors & Achievements</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {homepageContent.awards.map((award, index) => (
                    <div key={index} className="p-6 bg-[#13110F] border border-white/10 rounded flex flex-col items-center justify-center space-y-3 relative overflow-hidden group hover:shadow-lg hover:border-[#C5A059]/40 transition-all duration-300">
                      <div className="absolute top-0 right-0 w-8 h-8 opacity-10 bg-[#C5A059] rounded-bl-full" />
                      <Award className="w-8 h-8 text-[#C5A059]" />
                      <p className="font-serif text-sm font-bold text-white tracking-wide max-w-[220px]">{award}</p>
                      <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-semibold">Verified Winner</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* INSTAGRAM LIVE FEED WORKPLACE */}
            <section id="instagram-feed" className="bg-[#070605] py-20 px-6 sm:px-12">
              <div className="max-w-7xl mx-auto space-y-12 text-center">
                <div className="flex flex-col items-center space-y-3">
                  <Instagram className="w-8 h-8 text-[#C5A059]" />
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">@ForeverFramesIndia</span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">Moments Shared in Real-Time</h2>
                  <div className="w-12 h-0.5 bg-[#C5A059]" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {homepageContent.instagramHandles.length > 0 ? (
                    homepageContent.instagramHandles.map((handleUrl, idx) => (
                      <div 
                        key={idx} 
                        className="relative group overflow-hidden aspect-square bg-[#050505] rounded cursor-zoom-in border border-white/5"
                        onClick={() => setLightboxImage(handleUrl)}
                      >
                        <img 
                          src={handleUrl} 
                          alt="Instagram feed" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-[#C5A059]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Instagram className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ))
                  ) : (
                    // Beautiful custom safe fallbacks
                    [
                      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600',
                      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
                      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600',
                      'https://images.unsplash.com/photo-1598124146163-36819847286d?auto=format&fit=crop&q=80&w=600',
                      'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=600',
                      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600'
                    ].map((feed, idx) => (
                      <div 
                        key={idx} 
                        className="relative group overflow-hidden aspect-square bg-[#050505] rounded shadow-lg cursor-zoom-in border border-white/5"
                        onClick={() => setLightboxImage(feed)}
                      >
                        <img 
                          src={feed} 
                          alt="Instagram wedding" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-[#C5A059]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Instagram className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* MASTER FAQs ACCORDION */}
            <section id="faqs" className="py-24 px-6 sm:px-12 max-w-4xl mx-auto space-y-12 bg-transparent">
              <div className="text-center space-y-3">
                <span className="text-[#C5A059] uppercase tracking-[0.25em] text-[10px] font-bold block">KNOWLEDGE CATALOGUE</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">Frequently Asked Questions</h2>
                <div className="w-12 h-1 bg-[#C5A059] mx-auto" />
              </div>

              <div className="space-y-6">
                {[
                  {
                    q: 'Which equipment configurations are deployed by Forever Frames India?',
                    a: 'Our teams deploy standard high-end Sony Alpha format mirrorless structures accompanied by luxury constant-apertures prime optics, custom gimbal systems, and professional-grade high-fidelity sound amplifiers to ensure crisp recording.'
                  },
                  {
                    q: 'Does your team provide services pan-India?',
                    a: 'Yes, Forever Frames India is a luxury team travelling actively across major Indian hubs. Whether your venue is Lucknow, Prayagraj, Ayodhya, Delhi, Jaipur, Goa, or backwaters of Kerala, we coordinate travel logistics easily.'
                  },
                  {
                    q: 'How long until we receive our hardbound custom physical albums?',
                    a: 'We deliver highly-edited digital teasers within 5 days of your celebration. Standard full cinematic edits and digital photography catalogs are ready in 4-6 weeks. Custom luxury gold-gilded physical albums require 8 weeks due to premium ink bindings.'
                  },
                  {
                    q: 'Are custom quotes adjustable according to dates and intimate structures?',
                    a: 'Absolutely. We love intimate registry weddings as much as grand palatial destination frameworks. Connect with us via WhatsApp to construct a bespoke package tailored for you.'
                  }
                ].map((faq, index) => (
                  <div key={index} className="p-6 bg-[#13110F] border border-white/10 hover:border-[#C5A059]/45 rounded shadow-sm hover:shadow-md transition-all group">
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#C5A059] transition-colors flex items-center gap-2">
                      <span className="text-[#C5A059]">✦</span> {faq.q}
                    </h3>
                    <p className="text-zinc-300 text-xs sm:text-sm mt-3 leading-relaxed font-light pl-6">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* DYNAMIC CITY SEO PAGE VIEWS */}
        {isCityPath && activeCityData && (
          <div id="city-landing-view">
            
            {/* Scenic Background Header mapping specific city */}
            <section className="relative min-h-[45vh] flex items-center justify-center bg-black py-16 px-6 text-center border-b border-[#C5A059]/20">
              <div className="absolute inset-0">
                <div 
                  className="absolute inset-0 w-full h-full bg-cover bg-center brightness-[0.25]" 
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop')` }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
              </div>

              <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                {/* Dynamic Breadcrumbs */}
                <div className="flex justify-center items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50">
                  <span className="cursor-pointer hover:text-white" onClick={() => navigateTo('/')}>Home</span>
                  <span>/</span>
                  <span className="text-[#C5A059]">Wedding Photographer in {activeCityData.cityName}</span>
                </div>

                <h1 className="font-serif text-5xl sm:text-6xl font-extrabold text-white leading-tight">
                  Premium Wedding Photographer in <br />
                  <span className="italic font-light text-[#C5A059]">{activeCityData.cityName}</span>
                </h1>

                <p className="text-[#C5A059] uppercase tracking-widest text-[11px] font-extrabold">Professional Pan-India Videography & Candid Portrait Artistry</p>
              </div>
            </section>

            {/* Intro & Highlights section */}
            <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
              <div className="lg:col-span-7 space-y-8">
                <div className="w-12 h-1 bg-[#C5A059]" />
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  {activeCityData.introTitle}
                </h2>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed tracking-wider font-light">
                  {activeCityData.introText}
                </p>

                {/* Local Business Details schema representation visually */}
                <div className="p-6 bg-[#1A1815] border border-white/10 rounded-lg space-y-4">
                  <span className="text-[#C5A059] text-[9px] uppercase tracking-widest font-bold">📍 LOCAL BRANCH INFORMATION</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-white/50 text-[10px] uppercase">Primary Address</p>
                      <p className="text-white font-serif mt-1">Hazratganj Main Road, Central Hub Hub, IN</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-[10px] uppercase">Service Reach Location</p>
                      <p className="text-white font-serif mt-1">{activeCityData.cityName} & All Outskirts Venues</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-[10px] uppercase">Hotline Number</p>
                      <p className="text-white font-serif mt-1">+91 91292 63949 (WhatsApp Desk)</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-[10px] uppercase">Pricing Segment</p>
                      <p className="text-white font-serif mt-1">Premium Bespoke Quotation Formats</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights & Quick Contact box */}
              <div className="lg:col-span-5 space-y-8">
                <div className="bg-white border border-[#C5A059]/30 p-8 rounded shadow-lg space-y-6">
                  <h3 className="font-serif text-2xl font-bold text-[#1C1A17]">Why Forever Frames in {activeCityData.cityName}?</h3>
                  
                  <div className="space-y-4">
                    {activeCityData.highlights.map((item, index) => (
                      <div key={index} className="flex gap-3 text-xs sm:text-sm">
                        <CheckCircle className="w-5 h-5 text-[#C5A059] shrink-0" />
                        <p className="text-[#4C433C] leading-relaxed font-light">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-[#EAE6DF] space-y-3">
                    <button 
                      onClick={() => triggerWhatsApp(activeCityData.cityName)}
                      className="w-full py-3 bg-[#25D366] hover:bg-[#1ebd50] text-white rounded font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-colors duration-300 shadow-md"
                    >
                      WhatsApp curator regarding {activeCityData.cityName}
                    </button>
                    <button 
                      onClick={() => navigateTo('/contact')}
                      className="w-full py-3 bg-[#C5A059] hover:bg-[#1C1A17] hover:text-white text-white font-bold uppercase tracking-widest text-[10px] text-center transition-colors duration-800"
                    >
                      Acquire Customized Estimate Form
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Specialized City FAQs section */}
            <section className="bg-[#FCFAF5] py-20 px-6 sm:px-12 border-t border-[#EAE6DF]">
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center">
                  <span className="text-[#C5A059] uppercase tracking-widest text-[9px] font-bold">HYPERLOCAL KNOWLEDGE SCHEMA</span>
                  <h2 className="font-serif text-3.5xl font-extrabold text-[#1C1A17] mt-1">{activeCityData.cityName} Wedding FAQs</h2>
                  <div className="w-12 h-0.5 bg-[#C5A059] mx-auto mt-3" />
                </div>

                <div className="space-y-6">
                  {activeCityData.faqs.map((faq, index) => (
                    <div key={index} className="p-6 bg-[#13110F] border border-white/10 rounded shadow-sm">
                      <h3 className="font-serif text-lg font-bold text-[#C5A059] flex items-center gap-2">
                        <span>✦</span> {faq.question}
                      </h3>
                      <p className="text-zinc-300 text-xs sm:text-sm mt-3 leading-relaxed font-light pl-6">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>
        )}

        {/* LUXURY STORIES / PORTFOLIO PAGE */}
        {currentPath === '/portfolio' && (
          <div id="portfolio-root" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] font-bold block">EXPERIENCED VISUAL CATALOGUE</span>
              <h1 className="font-serif text-5xl font-extrabold text-white">The Luxury Wedding Portfolios</h1>
              <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl mx-auto font-light leading-relaxed">
                We believe in editorial excellence. Filter our actual recorded stories below to discover why premium couples choose Forever Frames India.
              </p>
              <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4" />
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap justify-center gap-2">
              {['all', 'wedding', 'pre-wedding', 'destination', 'engagement', 'haldi-mehendi', 'reception'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveStoryFilter(cat)}
                  className={`px-4 py-2 uppercase tracking-widest text-[10px] font-bold border rounded transition-all ${
                    activeStoryFilter === cat 
                      ? 'bg-[#C5A059] text-white border-[#C5A059]' 
                      : 'bg-transparent text-white/60 border-white/10 hover:border-[#C5A059]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Portfolio Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
              {filteredStories.map((story) => (
                <div 
                  key={story.id}
                  onClick={() => setLightboxImage(story.bannerUrl)}
                  className="bg-[#13110F] border border-white/10 hover:border-[#C5A059]/45 rounded overflow-hidden cursor-pointer flex flex-col justify-between group h-full hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-72 overflow-hidden bg-black">
                    <img 
                      src={story.bannerUrl} 
                      alt={story.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-black/90 px-3 py-1 border border-white/10 rounded text-[9px] uppercase font-bold text-[#C5A059]">
                      {story.city}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">{story.category.replace('-', ' ')}</span>
                    <h2 className="font-serif text-xl font-bold text-white group-hover:text-[#C5A059] transition-colors">{story.title}</h2>
                    <p className="text-zinc-300 text-xs line-clamp-3 leading-relaxed">{story.description}</p>
                  </div>

                  <div className="p-6 pt-0 border-t border-white/10 mt-4 flex justify-between items-center text-xs text-zinc-400">
                    <span>Couple: <strong className="text-white">{story.clientName}</strong></span>
                    <span className="text-[#C5A059] font-bold">View Details →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVEAL INDIVIDUAL BLOG LIST / EXPERT GUIDES */}
        {currentPath.startsWith('/blog') && (
          <div id="blog-root" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto space-y-12">
            
            {selectedBlog ? (
              // Individual Blog detail reading view
              <div className="max-w-3xl mx-auto space-y-8 animate-fade-in text-left">
                <button 
                  onClick={() => setSelectedBlog(null)}
                  className="text-xs uppercase tracking-widest text-[#C5A059] hover:text-[#1C1A17] transition-colors font-bold"
                >
                  ← Back to expert guides
                </button>

                <img 
                  src={selectedBlog.bannerUrl} 
                  alt={selectedBlog.title} 
                  className="w-full h-[50vh] object-cover rounded shadow-xl"
                />

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedBlog.tags.map((t, i)=> (
                      <span key={i} className="text-[9px] uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-1 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                  
                  <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                    {selectedBlog.title}
                  </h1>

                  <div className="flex gap-4 items-center text-xs text-zinc-400 pt-2 border-b border-white/10 pb-4">
                    <span>Author: <strong className="text-white">{selectedBlog.author}</strong></span>
                    <span>•</span>
                    <span>Published: {selectedBlog.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#C5A059]" /> {selectedBlog.readTime}</span>
                  </div>
                </div>

                <div className="text-zinc-300 space-y-6 leading-relaxed tracking-wider text-sm sm:text-base font-light font-sans">
                  {/* Content renderer split helper for lines for beauty */}
                  {selectedBlog.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                <div className="p-8 bg-[#13110F] rounded border border-white/10 mt-16 flex flex-col sm:flex-row items-center gap-6 justify-between shadow-sm">
                  <div className="space-y-2 text-center sm:text-left">
                    <p className="font-serif text-lg font-bold text-white">Preparing Your Elegant Narrative?</p>
                    <p className="text-xs text-zinc-400">Receive professional coordinate palette lists matching your hometown backdrop.</p>
                  </div>
                  <button onClick={() => navigateTo('/contact')} className="px-6 py-3 bg-[#C5A059] hover:bg-white hover:text-black text-white font-bold uppercase tracking-widest text-xs transition-colors">
                    Draft Your Concept
                  </button>
                </div>
              </div>
            ) : (
              // Blogs catalog grid
              <div className="space-y-12">
                <div className="text-center space-y-4">
                  <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] font-bold block">SEO EXPERT PLANNERS</span>
                  <h1 className="font-serif text-5xl font-extrabold text-white">Wedding Planners & Aesthetics Blog</h1>
                  <p className="text-zinc-300 text-xs sm:text-sm max-w-xl mx-auto font-light">
                    Read elite advice on clothing palette coordinates, cinematic highlights and premium photoshoot spots pan-India.
                  </p>
                  <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogs.map((b) => (
                    <div 
                      key={b.id}
                      onClick={() => setSelectedBlog(b)}
                      className="bg-[#13110F] border border-white/10 hover:border-[#C5A059]/45 cursor-pointer rounded overflow-hidden hover:shadow-2xl flex flex-col justify-between group h-full transition-all duration-300"
                    >
                      <div className="relative h-60 bg-black overflow-hidden">
                        <img 
                          src={b.bannerUrl} 
                          alt={b.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-6 space-y-3 text-left">
                        <div className="flex gap-1.5 flex-wrap">
                          {b.tags.map((tag, idx) => (
                            <span key={idx} className="text-[8px] uppercase tracking-wider text-[#C5A059] font-bold">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h2 className="font-serif text-lg font-bold text-white group-hover:text-[#C5A059] transition-colors">{b.title}</h2>
                        <p className="text-zinc-300 text-xs line-clamp-3 leading-relaxed">{b.summary}</p>
                      </div>

                      <div className="p-6 pt-4 mt-auto border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
                        <span>By {b.author}</span>
                        <span className="text-[#C5A059] flex items-center gap-1 font-bold">Read Article <ChevronRight className="w-3.5 h-3.5" /></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* CENTRAL RESERVATION / CONTACT PAGE */}
        {currentPath === '/contact' && (
          <div id="contact-root" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] font-bold block">DRAFT MEMORIAL BLUEPRINTS</span>
              <h1 className="font-serif text-5xl font-extrabold text-white">Let's Create Forever Memories</h1>
              <p className="text-zinc-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
                Connect directly with our luxury creative curators. We design complete multi-day coverage with matching physical albums and teasers.
              </p>
              <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6">
              
              {/* Info columns */}
              <div className="lg:col-span-5 space-y-8 text-left">
                <div className="bg-[#13110F] border border-white/10 p-6 rounded space-y-3 shadow-sm">
                  <p className="font-serif text-[#C5A059] font-bold">✦ Forever Frames Core Hub</p>
                  <p className="text-zinc-300 text-xs sm:text-sm font-light">
                    Hazratganj, Lucknow, Uttar Pradesh, 226001. Serving Pan India Destination Weddings.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-[#1A1815] border border-[#C5A059]/30 rounded-full flex items-center justify-center text-[#C5A059]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Call Now Desk</p>
                      <a href="tel:+919129263949" className="text-white font-serif hover:text-[#C5A059] font-bold">+91 91292 63949</a>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-[#1A1815] border border-[#C5A059]/30 rounded-full flex items-center justify-center text-[#C5A059]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Direct Email Desk</p>
                      <a href="mailto:admin@foreverframesindia.com" className="text-white font-serif hover:text-[#C5A059] font-bold">admin@foreverframesindia.com</a>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-[#1A1815] border border-[#C5A059]/30 rounded-full flex items-center justify-center text-[#C5A059]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Global Travel Reach</p>
                      <p className="text-white font-serif text-xs sm:text-sm font-bold">Pan-India Coverage with localized hubs</p>
                    </div>
                  </div>
                </div>

                {/* Simulated CRM metrics banner */}
                <div className="p-6 bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 rounded shadow-sm">
                  <p className="text-xs font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                    Estimated quote delivery time: Under 4 hours
                  </p>
                </div>
              </div>

              {/* Inquiry form container */}
              <div className="lg:col-span-7 bg-[#13110F] p-8 border border-white/10 rounded-lg shadow-xl text-left relative animate-fade-in">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">SECURE MEMORIAL DATES</span>
                <p className="font-serif text-2xl font-bold text-white mt-1 mb-6">Digital Consult Questionnaire</p>
                
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-400 tracking-wider mb-1 font-bold">Your Full Name *</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-[#1A1815] border border-white/10 p-3 rounded text-sm text-white focus:border-[#C5A059] focus:bg-[#201d19] outline-none transition-all"
                        value={bookingForm.name}
                        onChange={(e)=>setBookingForm({...bookingForm, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-400 tracking-wider mb-1 font-bold">WhatsApp Phone *</label>
                      <input 
                        type="tel" 
                        required
                        className="w-full bg-[#1A1815] border border-white/10 p-3 rounded text-sm text-white focus:border-[#C5A059] focus:bg-[#201d19] outline-none transition-all"
                        value={bookingForm.phone}
                        onChange={(e)=>setBookingForm({...bookingForm, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-400 tracking-wider mb-1 font-bold">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="e.g. gaurav@example.com"
                        className="w-full bg-[#1A1815] border border-white/10 p-3 rounded text-sm text-white focus:border-[#C5A059] focus:bg-[#201d19] outline-none transition-all"
                        value={bookingForm.email}
                        onChange={(e)=>setBookingForm({...bookingForm, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-400 tracking-wider mb-1 font-bold">Event Target Date</label>
                      <input 
                        type="date"
                        className="w-full bg-[#1A1815] border border-white/10 p-3 rounded text-sm text-white focus:border-[#C5A059] focus:bg-[#201d19] outline-none transition-all [color-scheme:dark]"
                        value={bookingForm.eventDate}
                        onChange={(e)=>setBookingForm({...bookingForm, eventDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-400 tracking-wider mb-1 font-bold">Target Shoot Location</label>
                      <select 
                        className="w-full bg-[#1A1815] border border-white/10 p-3 rounded text-sm text-white focus:border-[#C5A059] focus:bg-[#201d19] outline-none transition-all"
                        value={bookingForm.location}
                        onChange={(e)=>setBookingForm({...bookingForm, location: e.target.value})}
                      >
                        {CITIES_LIST.map(city => (
                          <option key={city.key} value={city.name} className="bg-[#1A1815] text-white">{city.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-400 tracking-wider mb-1 font-bold">Required Fine Ceremony</label>
                      <select 
                        className="w-full bg-[#1A1815] border border-white/10 p-3 rounded text-sm text-white focus:border-[#C5A059] focus:bg-[#201d19] outline-none transition-all"
                        value={bookingForm.serviceType}
                        onChange={(e)=>setBookingForm({...bookingForm, serviceType: e.target.value as Lead['serviceType']})}
                      >
                        <option value="both" className="bg-[#1A1815] text-white">Cinematography & Photography Combined</option>
                        <option value="photography" className="bg-[#1A1815] text-white">Candid & Traditional Photography Only</option>
                        <option value="cinematography" className="bg-[#1A1815] text-white">UHD Cinematic Film Trailers Only</option>
                        <option value="pre-wedding" className="bg-[#1A1815] text-white">Exclusive Pre-Wedding Sunset Project</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-400 tracking-wider mb-1 font-bold">Budget Allocation</label>
                      <select 
                        className="w-full bg-[#1A1815] border border-white/10 p-3 rounded text-sm text-white focus:border-[#C5A059] focus:bg-[#201d19] outline-none transition-all"
                        value={bookingForm.budgetRange}
                        onChange={(e)=>setBookingForm({...bookingForm, budgetRange: e.target.value})}
                      >
                        <option value="₹2,00,000 - ₹3,00,000" className="bg-[#1A1815] text-white">₹2,00,000 - ₹3,00,000</option>
                        <option value="₹3,00,000 - ₹5,00,000" className="bg-[#1A1815] text-white">₹3,00,000 - ₹5,00,000 (Voted Value)</option>
                        <option value="₹5,00,000 - ₹10,00,000" className="bg-[#1A1815] text-white">₹5,00,000 - ₹10,00,000</option>
                        <option value="₹10,00,000+" className="bg-[#1A1815] text-white">₹10,00,000+ Premium Royal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 tracking-wider mb-1 font-bold">Your Narrative Notes / Custom Message</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-[#1A1815] border border-white/10 p-3 rounded text-sm text-white focus:border-[#C5A059] focus:bg-[#201d19] outline-none transition-all"
                      placeholder="Share details regarding your dream setups or preferred rituals..."
                      value={bookingForm.message}
                      onChange={(e)=>setBookingForm({...bookingForm, message: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#C5A059] hover:bg-white hover:text-black text-white font-extrabold uppercase tracking-widest text-[#10px] py-4 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    {isSubmitLoading ? 'Transmitting lead attributes...' : 'Transmit Consultation Request'}
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* ABOUT US PAGE */}
        {currentPath === '/about' && (
          <div id="about-root" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto space-y-20 text-left">
            <div className="text-center space-y-4">
              <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] font-bold block">OUR STORY & VISION</span>
              <h1 className="font-serif text-5xl font-extrabold text-white">About Forever Frames India</h1>
              <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl mx-auto font-light leading-relaxed">
                Founded on the pursuit of raw emotions, cinematic vision, and grand Indian wedding legacy, we craft timeless memories.
              </p>
              <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4" />
            </div>

            {/* Meet the Founders Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-[#C5A059] uppercase tracking-widest text-[10px] font-bold block">✦ CO-FOUNDERS & DIRECTORS</span>
                <h2 className="font-serif text-4xl font-extrabold text-white">The Creative Minds Behind Forever Frames</h2>
                <p className="text-zinc-350 text-sm leading-relaxed font-light font-sans">
                  Forever Frames India was established by two visionary artists, <strong className="text-white font-bold">Abhijeet</strong> and <strong className="text-white font-bold">Adarsh</strong>, who shared a singular obsession: to redefine wedding photography and cinematography from standard chronological footage to bespoke pieces of timeless emotional art.
                </p>
                <p className="text-zinc-350 text-sm leading-relaxed font-light font-sans">
                  With deep appreciation for traditional Indian family values, royal heritage, and ambient lighting, they have personally directed and filmed hundreds of celebrations across India.
                </p>
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <p className="text-white text-xs font-bold">✦ PAN-INDIA LUXURY SERVICES</p>
                  <p className="text-[#C5A059] text-xs font-light font-serif">Lucknow • Jaipur • Ayodhya • Goa • Delhi • Mumbai</p>
                </div>
              </div>

              {/* Founders Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Abhijeet */}
                <div className="bg-[#13110F] border border-white/10 p-6 rounded text-center space-y-4 hover:border-[#C5A059] transition-all shadow-sm">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-[#C5A059]/40 bg-black">
                    <img 
                      referrerPolicy="no-referrer"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300" 
                      alt="Abhijeet" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">Abhijeet</h3>
                    <p className="text-[#C5A059] text-[10px] uppercase tracking-widest font-bold font-mono">Founder & Creative Director</p>
                  </div>
                  <p className="text-zinc-300 text-xs font-light leading-relaxed font-sans">
                    A maestro of lighting and frames, Abhijeet leads candid portraiture and composition style across all flagship royal commissions.
                  </p>
                </div>

                {/* Adarsh */}
                <div className="bg-[#13110F] border border-white/10 p-6 rounded text-center space-y-4 hover:border-[#C5A059] transition-all shadow-sm">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-[#C5A059]/40 bg-black">
                    <img 
                      referrerPolicy="no-referrer"
                      src="https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=300" 
                      alt="Adarsh" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">Adarsh</h3>
                    <p className="text-[#C5A059] text-[10px] uppercase tracking-widest font-bold font-mono">Co-Founder & Chief Cinematographer</p>
                  </div>
                  <p className="text-zinc-300 text-xs font-light leading-relaxed font-sans">
                    With an expert eye for motion and symmetry, Adarsh directs our cinematic film trailers, incorporating stunning multi-angle aerial choreography.
                  </p>
                </div>
              </div>
            </div>

            {/* Our Values / Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center pt-8 border-t border-white/10">
              <div className="space-y-2 animate-fade-in">
                <span className="text-[#C5A059] text-3xl font-serif font-bold">12+</span>
                <p className="text-white text-xs font-bold uppercase tracking-wider">Years of Artistry</p>
                <p className="text-zinc-400 text-xs font-light">Fine-tuning the art of wedding journalism.</p>
              </div>
              <div className="space-y-2 animate-fade-in">
                <span className="text-[#C5A059] text-3xl font-serif font-bold">350+</span>
                <p className="text-white text-xs font-bold uppercase tracking-wider">Luxury Weddings</p>
                <p className="text-zinc-400 text-xs font-light">Documented across elite heritage venues & sand retreats.</p>
              </div>
              <div className="space-y-2 animate-fade-in">
                <span className="text-[#C5A059] text-3xl font-serif font-bold">100%</span>
                <p className="text-white text-xs font-bold uppercase tracking-wider">Bespoke Curation</p>
                <p className="text-zinc-400 text-xs font-light">Zero templates, custom moodboards, exquisite grades.</p>
              </div>
            </div>
          </div>
        )}

        {/* SECURE ADMIN PANEL / LEAD CRM */}
        {currentPath === '/youngwaves' && (
          <div id="admin-root" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto space-y-12 text-left">
            {!isAdminAuthenticated ? (
              // Easy safe password protection
              <div className="max-w-md mx-auto bg-white border border-[#C5A059]/40 p-8 rounded shadow-xl space-y-6">
                <div className="text-center space-y-2">
                  <Sliders className="w-12 h-12 text-[#C5A059] mx-auto" />
                  <span className="text-[#C5A059] text-[9px] uppercase tracking-widest font-extrabold block">FOREVER FRAMES CRM GATEWAY</span>
                  <p className="font-serif text-2xl font-bold text-[#1C1A17]">Director's Authorization</p>
                  <p className="text-[#7C7267] text-[10px] uppercase font-bold">Default Pass: admin / ForeverFrames2026</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase text-[#7C7267] mb-1 font-bold">Secure Passkey</label>
                    <input 
                      type="password" 
                      required
                      className="w-full bg-[#FCFAF5] border border-[#EAE6DF] p-3 rounded text-sm text-[#1C1A17] focus:border-[#C5A059] outline-none"
                      placeholder="Password"
                      value={adminPassword}
                      onChange={(e)=>setAdminPassword(e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#C5A059] hover:bg-[#1C1A17] text-white font-bold uppercase tracking-widest text-xs py-3 rounded transition-all"
                  >
                    Authenticate Console
                  </button>
                </form>
              </div>
            ) : (
              // Live Admin Interface
              <div className="space-y-8 animate-fade-in">
                
                {/* Admin Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#EAE6DF] pb-6">
                  <div>
                    <span className="text-[#C5A059] font-serif text-[10px] uppercase tracking-[0.25em] font-extrabold block">LIVE FOREVER FRAMES CRM MODULE</span>
                    <h1 className="font-serif text-4xl font-extrabold text-[#1C1A17]">Creative Control Center</h1>
                  </div>

                  <button 
                    onClick={() => { setIsAdminAuthenticated(false); setAdminPassword(''); }}
                    className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded text-xs uppercase font-bold transition-transform hover:scale-[1.02]"
                  >
                    Close Session
                  </button>
                </div>

                {/* CRM Category Tabs */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    { id: 'leads', name: 'Leads CRM', icon: UserCheck },
                    { id: 'stories', name: 'Manage Stories', icon: LayoutGrid },
                    { id: 'blogs', name: 'Publish Blogs', icon: BookOpen },
                    { id: 'testimonials', name: 'Testimonials', icon: Users },
                    { id: 'homepage', name: 'Homepage Content', icon: Edit }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setAdminSection(tab.id as any)}
                        className={`px-4 py-3 uppercase tracking-wider text-[9px] font-bold border rounded flex items-center gap-2 transition-all ${
                          adminSection === tab.id 
                            ? 'bg-[#C5A059] text-white border-[#C5A059]' 
                            : 'bg-white text-[#1C1A17]/60 border-[#EAE6DF] hover:border-[#C5A059]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {tab.name}
                      </button>
                    );
                  })}
                </div>

                {/* TAB 1: ALL LEADS CRM */}
                {adminSection === 'leads' && (
                  <div className="space-y-6">
                    
                    {/* Filters box */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#FDFBF7] p-4 rounded border border-[#EAE6DF] shadow-sm">
                      <div className="relative">
                        <Search className="w-4 h-4 text-[#7C7267]/50 absolute left-3 top-3.5" />
                        <input 
                          type="text" 
                          placeholder="Search client leads..." 
                          className="w-full bg-white pl-9 pr-3 py-2.5 rounded text-xs text-[#1C1A17] focus:border-[#C5A059] outline-none border border-[#EAE6DF]"
                          value={leadSearchTerm}
                          onChange={(e)=>setLeadSearchTerm(e.target.value)}
                        />
                      </div>

                      <div>
                        <select 
                          className="w-full bg-white p-2.5 rounded text-xs text-[#1C1A17] focus:border-[#C5A059] outline-none border border-[#EAE6DF]"
                          value={leadStatusFilter}
                          onChange={(e)=>setLeadStatusFilter(e.target.value as any)}
                        >
                          <option value="all">All statuses</option>
                          <option value="new">New leads</option>
                          <option value="contacted">Contacted leads</option>
                          <option value="booked">Booked weddings</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      <div className="text-right flex items-center justify-end text-xs text-[#7C7267]">
                        Total leads tracked: <strong className="text-[#1C1A17] ml-1">{leads.length}</strong>
                      </div>
                    </div>

                    {/* Leads CRM Table/Lists */}
                    <div className="space-y-4">
                      {leads
                        .filter((l) => {
                          const matchesSearch = l.name.toLowerCase().includes(leadSearchTerm.toLowerCase()) || l.location.toLowerCase().includes(leadSearchTerm.toLowerCase());
                          const matchesStatus = leadStatusFilter === 'all' || l.status === leadStatusFilter;
                          return matchesSearch && matchesStatus;
                        })
                        .map((l) => (
                          <div key={l.id} className="p-6 bg-white rounded border border-[#EAE6DF] grid grid-cols-1 md:grid-cols-12 gap-6 items-start relative hover:border-[#C5A059]/40 hover:shadow-md transition-all duration-300">
                            
                            {/* Meta & Status indicator */}
                            <div className="md:col-span-3 space-y-2">
                              <div className="flex gap-2 items-center">
                                <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-widest font-bold ${
                                  l.status === 'new' ? 'bg-red-50 text-red-700 border border-red-100' :
                                  l.status === 'contacted' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                  l.status === 'booked' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-700 border border-gray-200'
                                }`}>
                                  ● {l.status}
                                </span>
                                <span className="text-[9px] text-[#7C7267] font-bold">{l.createdAt.split('T')[0]}</span>
                              </div>
                              <p className="font-serif text-lg font-bold text-[#1C1A17]">{l.name}</p>
                              <p className="text-xs text-[#C5A059] font-bold font-mono">{l.phone} • {l.email}</p>
                            </div>

                            {/* Details parameters */}
                            <div className="md:col-span-5 space-y-2 text-xs text-[#4D453E]">
                              <p>✦ Target Venue Location: <strong className="text-[#1C1A17] font-bold">{l.location}</strong></p>
                              <p>✦ Ideal Shoot Date: <strong className="text-[#C5A059] font-bold">{l.eventDate || 'TBD'}</strong></p>
                              <p>✦ Service Type Segment: <strong className="text-[#1C1A17] uppercase font-bold">{l.serviceType}</strong></p>
                              <p className="pt-2 text-[#7C7267] italic font-mono">"{l.message || 'No custom notes.'}"</p>
                            </div>

                            {/* Status controls */}
                            <div className="md:col-span-4 space-y-4 text-right flex flex-col justify-between h-full">
                              <div className="flex flex-wrap gap-1 justify-end">
                                <button 
                                  onClick={() => handleUpdateLeadStatus(l.id, 'contacted')}
                                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[9px] uppercase font-bold transition-all"
                                >
                                  Contacted
                                </button>
                                <button 
                                  onClick={() => handleUpdateLeadStatus(l.id, 'booked')}
                                  className="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded text-[9px] uppercase font-bold transition-all"
                                >
                                  Booked
                                </button>
                                <button 
                                  onClick={() => handleUpdateLeadStatus(l.id, 'archived')}
                                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-250 text-gray-700 rounded text-[9px] uppercase font-bold transition-all"
                                >
                                  Archive
                                </button>
                                <button 
                                  onClick={() => handleDeleteLead(l.id)}
                                  className="p-1 px-2 text-red-600 hover:bg-red-50 rounded"
                                  title="Delete Lead Permanent"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[8px] uppercase tracking-widest text-[#7C7267] font-bold">Curator CRM Internal Notes:</label>
                                <input 
                                  type="text" 
                                  className="w-full bg-[#FCFAF5] text-[11px] p-2 rounded focus:bg-white focus:border-[#C5A059] outline-none border border-[#EAE6DF] mt-1 text-[#1C1A17]"
                                  placeholder="e.g. Outfits shared, awaiting advance."
                                  defaultValue={l.notes || ''}
                                  onBlur={(e) => handleUpdateLeadStatus(l.id, l.status, e.target.value)}
                                />
                              </div>
                            </div>

                          </div>
                        ))}
                    </div>

                  </div>
                )}

                {/* TAB 2: MANAGE STORIES */}
                {adminSection === 'stories' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Creator Form */}
                    <div className="lg:col-span-5 bg-white p-6 border border-[#EAE6DF] rounded-lg space-y-6 shadow-sm">
                      <span className="text-[#C5A059] text-[9px] uppercase tracking-widest font-extrabold block">CURATOR EXCLUSIVITY FORM</span>
                      <h3 className="font-serif text-xl font-bold text-[#1C1A17]">Create a Luxury Wedding Story</h3>
                      
                      <form onSubmit={handleCreateStory} className="space-y-4 text-xs">
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider mb-1 text-[#7C7267] font-bold">Story Title *</label>
                          <input 
                            type="text" 
                            required 
                            className="w-full bg-[#FCFAF5] p-2 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all" 
                            placeholder="e.g. Saffron sunset vows in Udaipur"
                            value={newStoryForm.title}
                            onChange={(e)=>setNewStoryForm({...newStoryForm, title: e.target.value})}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider mb-1 text-[#7C7267] font-bold font-sans">Clients Couples *</label>
                            <input 
                              type="text" 
                              required 
                              className="w-full bg-[#FCFAF5] p-2 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all" 
                              placeholder="Aditi & Rohan"
                              value={newStoryForm.clientName}
                              onChange={(e)=>setNewStoryForm({...newStoryForm, clientName: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider mb-1 text-[#7C7267] font-bold">City Target *</label>
                            <select 
                              className="w-full bg-[#FCFAF5] p-2 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all"
                              value={newStoryForm.city}
                              onChange={(e)=>setNewStoryForm({...newStoryForm, city: e.target.value})}
                            >
                              {CITIES_LIST.map((c)=><option key={c.key} value={c.name}>{c.name}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider mb-1 text-[#7C7267] font-bold">Category Theme</label>
                            <select 
                              className="w-full bg-[#FCFAF5] p-2 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all"
                              value={newStoryForm.category}
                              onChange={(e)=>setNewStoryForm({...newStoryForm, category: e.target.value as any})}
                            >
                              <option value="wedding">Wedding</option>
                              <option value="pre-wedding">Pre-Wedding</option>
                              <option value="destination">Destination</option>
                              <option value="engagement">Engagement</option>
                              <option value="haldi-mehendi">Haldi & Mehendi</option>
                              <option value="reception">Reception</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider mb-1 text-[#7C7267] font-bold font-sans font-mono">YouTube Teaser Code</label>
                            <input 
                              type="text" 
                              className="w-full bg-[#FCFAF5] p-2 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all" 
                              placeholder="e.g. Y7_2w9DbeM0"
                              value={newStoryForm.videoUrl}
                              onChange={(e)=>setNewStoryForm({...newStoryForm, videoUrl: e.target.value})}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase tracking-wider mb-1 text-[#7C7267] font-bold">Story Banner Image URL *</label>
                          <input 
                            type="url" 
                            required 
                            className="w-full bg-[#FCFAF5] p-2 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all" 
                            placeholder="https://images.unsplash.com/..."
                            value={newStoryForm.bannerUrl}
                            onChange={(e)=>setNewStoryForm({...newStoryForm, bannerUrl: e.target.value})}
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase tracking-wider mb-1 text-[#7C7267] font-bold">Rich description notes</label>
                          <textarea 
                            rows={3} 
                            className="w-full bg-[#FCFAF5] p-2 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all" 
                            placeholder="Describe how the setup and ceremonies took shape..."
                            value={newStoryForm.description}
                            onChange={(e)=>setNewStoryForm({...newStoryForm, description: e.target.value})}
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase tracking-wider mb-1 text-[#7C7267] font-bold">Additional Slide Images (One URL per line)</label>
                          <textarea 
                            rows={3} 
                            className="w-full bg-[#FCFAF5] p-2 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all font-mono" 
                            placeholder="https://images.unsplash.com/photo-1..."
                            value={newStoryForm.images}
                            onChange={(e)=>setNewStoryForm({...newStoryForm, images: e.target.value})}
                          />
                        </div>

                        <button type="submit" className="w-full bg-[#C5A059] text-white font-extrabold uppercase tracking-widest py-3 hover:bg-[#1C1A17] text-[10px] transition-colors rounded">
                          Commit New Story
                        </button>
                      </form>
                    </div>

                    {/* Manage column card view */}
                    <div className="lg:col-span-7 space-y-4">
                      {stories.map((s)=>(
                        <div key={s.id} className="p-4 bg-white border border-[#EAE6DF] rounded flex items-center justify-between gap-4 shadow-sm text-left">
                          <img src={s.bannerUrl} alt={s.title} className="w-16 h-16 object-cover rounded shadow-sm border border-[#EAE6DF]" />
                          <div className="space-y-1 flex-grow text-xs">
                            <p className="font-bold text-[#1C1A17] leading-snug">{s.title}</p>
                            <p className="text-[10px] text-[#7C7267]">{s.clientName} • {s.city} • <strong className="text-[#C5A059] uppercase">{s.category}</strong></p>
                          </div>
                          <button 
                            onClick={()=>handleDeleteStory(s.id)}
                            className="p-1 px-3 text-red-650 bg-red-50 hover:bg-red-100 rounded text-[9px] font-bold uppercase tracking-wider transition-all"
                          >
                            Purge
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {/* TAB 3: PUBLISH BLOGS */}
                {adminSection === 'blogs' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    <div className="lg:col-span-6 bg-white p-6 border border-[#EAE6DF] rounded-lg space-y-6 shadow-sm">
                      <h3 className="font-serif text-xl font-bold text-[#1C1A17]">Create Wedding Aesthetics Planner</h3>
                      
                      <form onSubmit={handleCreateBlog} className="space-y-4 text-xs font-sans">
                        <div>
                          <label className="block text-[9px] uppercase text-[#7C7267] mb-1 font-bold">Expert Guide Title *</label>
                          <input 
                            type="text" 
                            required 
                            className="w-full bg-[#FCFAF5] p-2.5 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all font-sans" 
                            placeholder="e.g. Decoding Clothing Palettes for Day Weddings"
                            value={newBlogForm.title}
                            onChange={(e)=>setNewBlogForm({...newBlogForm, title: e.target.value})}
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase text-[#7C7267] mb-1 font-bold">Banner Image URL *</label>
                          <input 
                            type="url" 
                            required 
                            className="w-full bg-[#FCFAF5] p-2.5 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all font-sans" 
                            placeholder="https://images.unsplash..."
                            value={newBlogForm.bannerUrl}
                            onChange={(e)=>setNewBlogForm({...newBlogForm, bannerUrl: e.target.value})}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] uppercase text-[#7C7267] mb-1 font-bold">Tags (Comma split)</label>
                            <input 
                              type="text" 
                              className="w-full bg-[#FCFAF5] p-2.5 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all font-sans" 
                              value={newBlogForm.tags}
                              onChange={(e)=>setNewBlogForm({...newBlogForm, tags: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase text-[#7C7267] mb-1 font-bold">Author Name *</label>
                            <input 
                              type="text" 
                              className="w-full bg-[#FCFAF5] p-2.5 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all font-sans" 
                              value={newBlogForm.author}
                              onChange={(e)=>setNewBlogForm({...newBlogForm, author: e.target.value})}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase text-[#7C7267] mb-1 font-bold">Blog Summary *</label>
                          <input 
                            type="text" 
                            required
                            className="w-full bg-[#FCFAF5] p-2.5 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all font-sans" 
                            placeholder="A concise synopsis displayed inside grids..."
                            value={newBlogForm.summary}
                            onChange={(e)=>setNewBlogForm({...newBlogForm, summary: e.target.value})}
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase text-[#7C7267] mb-1 font-bold">Full article content * (use double spaces to mark paragraph breaks)</label>
                          <textarea 
                            rows={8} 
                            required
                            className="w-full bg-[#FCFAF5] p-2.5 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all font-sans" 
                            value={newBlogForm.content}
                            onChange={(e)=>setNewBlogForm({...newBlogForm, content: e.target.value})}
                          />
                        </div>

                        <button type="submit" className="w-full bg-[#C5A059] text-white hover:bg-[#1C1A17] font-extrabold uppercase tracking-widest py-3 text-[10px] transition-colors rounded">
                          Publish Expert Guide
                        </button>
                      </form>
                    </div>

                    {/* Blog posts roster management */}
                    <div className="lg:col-span-6 space-y-4">
                      {blogs.map((b)=>(
                        <div key={b.id} className="p-4 bg-white border border-[#EAE6DF] rounded flex items-center justify-between gap-4 shadow-sm text-left">
                          <img src={b.bannerUrl} alt={b.title} className="w-16 h-12 object-cover rounded shadow-sm border border-[#EAE6DF]" />
                          <div className="space-y-1 flex-grow text-xs">
                            <p className="font-bold text-[#1C1A17] leading-snug">{b.title}</p>
                            <p className="text-[10px] text-[#7C7267]">By {b.author} • {b.date}</p>
                          </div>
                          <button 
                            onClick={()=>handleDeleteBlog(b.id)}
                            className="p-1 px-3 text-red-650 bg-red-50 hover:bg-red-100 rounded text-[9px] font-bold uppercase tracking-wider transition-all"
                          >
                            delete
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {/* TAB 4: TESTIMONIALS */}
                {adminSection === 'testimonials' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    <div className="lg:col-span-5 bg-white p-6 border border-[#EAE6DF] rounded space-y-6 shadow-sm">
                      <h3 className="font-serif text-lg font-bold text-[#1C1A17]">Record Client Hand-written Quote</h3>
                      <form onSubmit={handleCreateTestimonial} className="space-y-4 text-xs font-sans">
                        <div>
                          <label className="block text-[9px] uppercase text-[#7C7267] mb-1 font-bold">Couple Names *</label>
                          <input 
                            type="text" 
                            required
                            className="w-full bg-[#FCFAF5] p-2.5 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all" 
                            placeholder="Ananya & Vihaan"
                            value={newTestimonialForm.clientName}
                            onChange={(e)=>setNewTestimonialForm({...newTestimonialForm, clientName: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase text-[#7C7267] mb-1 font-bold">Hand-written quote *</label>
                          <textarea 
                            rows={3} 
                            required
                            className="w-full bg-[#FCFAF5] p-2.5 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all font-sans" 
                            placeholder="Express their gratitude and direct quotes..."
                            value={newTestimonialForm.quote}
                            onChange={(e)=>setNewTestimonialForm({...newTestimonialForm, quote: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] uppercase text-[#7C7267] mb-1 font-bold">Event location</label>
                            <input 
                              type="text" 
                              className="w-full bg-[#FCFAF5] p-2.5 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all" 
                              placeholder="Goa Beach Retreat"
                              value={newTestimonialForm.location}
                              onChange={(e)=>setNewTestimonialForm({...newTestimonialForm, location: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase text-[#7C7267] mb-1 font-bold">Classic event type</label>
                            <input 
                              type="text" 
                              className="w-full bg-[#FCFAF5] p-2.5 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all" 
                              placeholder="Three-Day Royal Wedding"
                              value={newTestimonialForm.eventType}
                              onChange={(e)=>setNewTestimonialForm({...newTestimonialForm, eventType: e.target.value})}
                            />
                          </div>
                        </div>

                        <button type="submit" className="w-full bg-[#C5A059] text-white hover:bg-[#1C1A17] font-extrabold uppercase py-3 text-[10px] transition-colors rounded">
                          Commit Appreciations
                        </button>
                      </form>
                    </div>

                    {/* list */}
                    <div className="lg:col-span-7 space-y-4">
                      {testimonials.map((t)=>(
                        <div key={t.id} className="p-4 bg-white rounded border border-[#EAE6DF] flex items-center justify-between text-xs text-left shadow-sm">
                          <div className="space-y-1">
                            <p className="font-serif font-bold text-[#1C1A17]">{t.clientName}</p>
                            <p className="text-[#C5A059] text-[10px] uppercase font-mono">"{t.quote.substring(0, 90)}..."</p>
                          </div>
                          <button 
                            onClick={()=>handleDeleteTestimonial(t.id)} 
                            className="p-1 px-3 text-red-650 bg-red-50 hover:bg-red-100 rounded text-[9px] font-bold uppercase tracking-wider transition-all"
                          >
                            Archive
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {/* TAB 5: EDIT HOMEPAGE TEXTS */}
                {adminSection === 'homepage' && (
                  <div className="max-w-2xl bg-white p-6 border border-[#EAE6DF] rounded space-y-6 mx-auto shadow-sm">
                    <h3 className="font-serif text-xl font-bold text-[#1C1A17]">Modified Homepage Parameters</h3>
                    
                    <form onSubmit={handleUpdateHomepage} className="space-y-4 text-xs font-sans">
                      <div>
                        <label className="block text-[9px] uppercase text-[#7C7267] mb-1 font-bold">Hero Title Layout</label>
                        <input 
                          type="text" 
                          className="w-full bg-[#FCFAF5] p-2.5 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all font-serif" 
                          value={homepageEditorForm.heroTitle}
                          onChange={(e)=>setHomepageEditorForm({...homepageEditorForm, heroTitle: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase text-[#7C7267] mb-1 font-bold">Hero Subtitle</label>
                        <input 
                          type="text" 
                          className="w-full bg-[#FCFAF5] p-2.5 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all font-sans" 
                          value={homepageEditorForm.heroSubtitle}
                          onChange={(e)=>setHomepageEditorForm({...homepageEditorForm, heroSubtitle: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase text-[#7C7267] mb-1 font-bold font-mono">Main Background Cinema Video URL * (MP4 Format)</label>
                        <input 
                          type="text" 
                          className="w-full bg-[#FCFAF5] p-2.5 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all font-mono" 
                          value={homepageEditorForm.heroVideoUrl}
                          onChange={(e)=>setHomepageEditorForm({...homepageEditorForm, heroVideoUrl: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase text-[#7C7267] mb-1 font-bold font-sans">Main Hero Cover Image URL (Ken Burns effect photo)</label>
                        <input 
                          type="text" 
                          className="w-full bg-[#FCFAF5] p-2.5 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all font-sans" 
                          value={homepageEditorForm.heroImageUrl}
                          onChange={(e)=>setHomepageEditorForm({...homepageEditorForm, heroImageUrl: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase text-[#7C7267] mb-1 font-bold">Philosophical About Us Narrative text</label>
                        <textarea 
                          rows={6} 
                          className="w-full bg-[#FCFAF5] p-2.5 rounded focus:bg-white focus:border-[#C5A059] border border-[#EAE6DF] text-[#1C1A17] outline-none transition-all leading-relaxed font-light" 
                          value={homepageEditorForm.aboutText}
                          onChange={(e)=>setHomepageEditorForm({...homepageEditorForm, aboutText: e.target.value})}
                        />
                      </div>

                      <button type="submit" className="w-full bg-[#C5A059] text-white hover:bg-[#1C1A17] font-extrabold uppercase py-3 text-[10px] transition-colors rounded">
                        Save Global Attributes
                      </button>
                    </form>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

      </main>

      {/* DETAILED WEDDING STORY DETAILED MODAL LAYER */}
      {selectedStory && (
        <div id="story-gallery-modal" className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in text-left">
          <div className="bg-[#13110F] border border-white/10 w-full max-w-5xl rounded-lg overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]">
            
            {/* Visual Column / Banner with carousel */}
            <div className="lg:w-3/5 bg-black h-[40vh] lg:h-auto overflow-y-auto p-6 space-y-4">
              
              {selectedStory.videoUrl ? (
                // Safe Embedded YouTube player
                <div className="relative aspect-video bg-[#050505] rounded overflow-hidden">
                  <iframe 
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${selectedStory.videoUrl}?autoplay=1`}
                    title="Cinematic Film Player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                </div>
              ) : (
                <img 
                  src={selectedStory.bannerUrl} 
                  alt="banner" 
                  onClick={() => setLightboxImage(selectedStory.bannerUrl)}
                  className="w-full h-72 object-cover rounded shadow-lg border border-white/10 cursor-zoom-in hover:scale-[1.01] transition-transform duration-300" 
                />
              )}

              {/* Grid of other photos inside standard story */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                {selectedStory.images.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt="wedding details" 
                    onClick={() => setLightboxImage(img)}
                    className="w-full h-40 object-cover rounded border border-white/10 hover:border-[#C5A059]/40 hover:scale-[1.01] transition-all duration-300 shadow-sm cursor-zoom-in"
                  />
                ))}
              </div>
            </div>

            {/* Information Column */}
            <div className="lg:w-2/5 p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] lg:max-h-none bg-[#0d0b0a]">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">{selectedStory.category} • {selectedStory.city}</span>
                  <button 
                    onClick={() => setSelectedStory(null)}
                    className="p-1 text-zinc-400 hover:text-white transition-colors text-xs uppercase font-bold font-mono"
                  >
                    ✦ Close [x]
                  </button>
                </div>

                <h2 className="font-serif text-3xl font-extrabold text-white leading-snug hover:text-[#C5A059] transition-colors">{selectedStory.title}</h2>
                <div className="w-12 h-1 bg-[#C5A059]" />

                <div className="space-y-2 text-xs text-zinc-300">
                  <p>✦ Lead Clients: <strong className="text-white font-bold">{selectedStory.clientName}</strong></p>
                  <p>✦ Event Ceremony Area: <strong className="text-white font-bold">{selectedStory.city} Venue Estates</strong></p>
                  <p>✦ Ceremony Date: <strong className="text-[#C5A059] font-bold">{selectedStory.date}</strong></p>
                </div>

                <p className="text-zinc-300 text-sm leading-relaxed tracking-wider font-light italic">
                  "{selectedStory.description}"
                </p>
              </div>

              <div className="space-y-3 pt-8 border-t border-white/10">
                <button 
                  onClick={() => { triggerWhatsApp(selectedStory.city); setSelectedStory(null); }}
                  className="w-full py-3 bg-green-750 hover:bg-green-800 text-white rounded text-xs uppercase tracking-widest font-bold transition-all hover:scale-[1.01] shadow-sm animate-pulse"
                >
                  Ask availability for {selectedStory.city}
                </button>
                <button 
                  onClick={() => setSelectedStory(null)}
                  className="w-full py-2.5 border border-white/10 hover:border-white hover:bg-white/5 text-white rounded text-xs uppercase tracking-widest transition-all"
                >
                  Return to catalogue
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ACCESSIBLE BOTTOM STICKY FLOATING CTA */}
      <div id="fixed-cta" className="fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-3">
        <button 
          onClick={() => triggerWhatsApp('Bottom Quick Floating')}
          className="bg-green-600 hover:bg-green-700 text-white font-extrabold uppercase tracking-widest text-[9px] px-4 py-3 rounded-full flex items-center gap-2 shadow-2xl transition-all hover:scale-105"
        >
          <Camera className="w-3.5 h-3.5" />
          WhatsApp Booking Live
        </button>
        <a 
          href="tel:+919129263949"
          className="bg-[#C5A059] text-white font-extrabold uppercase tracking-widest text-[9px] px-4 py-3 rounded-full flex items-center gap-2 shadow-2xl hover:bg-[#1C1A17] transition-all font-sans"
        >
          <Phone className="w-3.5 h-3.5" />
          Call Now
        </a>
      </div>

      {/* FOOTER SECTION */}
      <footer id="main-footer" className="w-full bg-[#0d0c0a] p-6 sm:p-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-left">
          
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-xl sm:text-2xl font-extrabold text-white">Forever Frames India</span>
            <p className="text-zinc-300 text-xs tracking-wider max-w-sm leading-relaxed font-light">
              Premium Wedding Photography & Cinematography Services Across India. We match award-winning directors to design grand stories out of precious traditional Indian family rituals.
            </p>
            <p className="text-[#C5A059] text-[10px] uppercase font-bold tracking-[0.2em]">"Capturing Moments, Creating Forever Memories"</p>
          </div>

          <div className="md:col-span-4 space-y-4 text-xs">
            <span className="text-[#C5A059] uppercase tracking-widest font-extrabold block text-[10px]">SEO Dynamic Cities</span>
            <div className="grid grid-cols-2 gap-2 text-zinc-400 font-medium">
              {CITIES_LIST.map((city)=> (
                <button 
                  key={city.key} 
                  onClick={() => navigateTo(city.key === 'india' ? '/destination-wedding-photographer-india' : `/wedding-photographer-${city.key}`)}
                  className="hover:text-[#C5A059] text-left transition-colors"
                >
                  ↳ {city.name}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 space-y-4 text-xs font-light text-zinc-300">
            <span className="text-white uppercase tracking-widest font-extrabold block text-[10px]">Contact desk</span>
            <p>Hotline: <strong className="text-white font-serif font-bold">+91 91292 63949</strong></p>
            <p>Administrative Email: <strong className="text-white font-bold">admin@foreverframesindia.com</strong></p>
            <p>Core Hub: Hazratganj, Lucknow, UP</p>
            <div className="flex gap-4 pt-2">
              <span className="text-[#C5A059] cursor-pointer hover:text-white" onClick={() => navigateTo('/sitemap.xml')}>Sitemap XML</span>
              <span>•</span>
              <span className="text-[#C5A059] cursor-pointer hover:text-white" onClick={() => navigateTo('/robots.txt')}>Robots.txt</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-zinc-500 tracking-wider">
          <p>© 2026 Forever Frames India. All rights reserved. Made for Elite Indian Weddings.</p>
          <div className="flex items-center gap-2 mt-4 sm:mt-0 uppercase font-bold text-[9px]">
            <span>Google Core Web Vitals Optimized</span>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </footer>

      {/* IMMERSIVE ULTRA-HD LIGHTBOX GALLERY */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-[60] flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          {/* Close button - Styled exactly like the requested pill capsule closet */}
          <button 
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 text-white hover:bg-white/10 transition-colors text-xs uppercase tracking-widest font-sans flex items-center gap-1.5 bg-black/60 px-5 py-2.5 rounded-full border border-white/20 select-none cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-white" /> CLOSE
          </button>

          {/* Large image frame */}
          <div className="max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center relative animate-zoom-in" onClick={(e) => e.stopPropagation()}>
            <img 
              src={lightboxImage} 
              alt="Enlarged wedding detail" 
              className="max-h-full max-w-full object-contain rounded border border-white/10 shadow-2xl transition-transform duration-350"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

    </div>
  );
}
