export interface MenuItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
  priceRange?: string;
  order: number;
  fileName?: string;
  fileSize?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'customer' | 'admin';
export type DisplayLayout = 'grid' | 'book';
