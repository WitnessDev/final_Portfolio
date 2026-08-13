export type PortfolioCategory = 'all' | 'photography' | 'videography' | 'graphics' | 'drone';

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'photography' | 'videography' | 'graphics' | 'drone' | string;
  categoryLabel: string;
  imageUrl: string;
  mediaUrl?: string;
  videoUrl?: string;
  type?: 'image' | 'video';
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  description: string;
  client?: string;
  year?: string;
  tools?: string[];
  featured?: boolean;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  titleSw?: string;
  iconName: string;
  bgImageUrl: string;
  shortDesc: string;
  shortDescSw?: string;
  fullDesc: string;
  fullDescSw?: string;
  deliverables: string[];
  deliverablesSw?: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  budget?: string;
  message: string;
}

export interface Showreel {
  title: string;
  subtitle: string;
  videoSrc?: string;
  posterSrc: string;
  duration: string;
  highlights: string[];
}
