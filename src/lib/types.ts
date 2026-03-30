export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category_id: string | null;
  author_id: string | null;
  post_type: 'blog' | 'insight' | 'report';
  status: 'draft' | 'published' | 'archived';
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  tags: string[];
  reading_time: number | null;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  blog_categories?: BlogCategory;
  admin_users?: AdminUser;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface PdfReport {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  pdf_url: string;
  pdf_filename: string;
  category_id: string | null;
  status: 'draft' | 'published' | 'archived';
  download_count: number;
  created_at: string;
  updated_at: string;
  blog_categories?: BlogCategory;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  pdf_report_id: string | null;
  source: string;
  created_at: string;
  pdf_reports?: PdfReport;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
