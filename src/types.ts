export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  budgetRange: string;
  location: string;
  serviceType: 'photography' | 'cinematography' | 'both' | 'pre-wedding' | 'other';
  message: string;
  status: 'new' | 'contacted' | 'booked' | 'archived';
  createdAt: string;
  notes?: string;
}

export interface WeddingStory {
  id: string;
  title: string;
  clientName: string;
  city: string;
  bannerUrl: string;
  description: string;
  images: string[];
  category: 'wedding' | 'pre-wedding' | 'destination' | 'engagement' | 'haldi-mehendi' | 'reception';
  videoUrl?: string; // e.g. Just youtube video code (e.g. dQw4w9WgXcQ)
  date: string;
  featured: boolean;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  bannerUrl: string;
  tags: string[];
  author: string;
  date: string;
  readTime: string;
  summary: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  quote: string;
  location: string;
  rating: number;
  avatarUrl: string;
  eventType: string;
  date: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export type CityPageData = {
  cityKey: string;
  cityName: string;
  seoTitle: string;
  seoDescription: string;
  introTitle: string;
  introText: string;
  highlights: string[];
  faqs: { question: string; answer: string }[];
};
