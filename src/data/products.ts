// src/data/products.ts
export interface Product {
  scentNotes: string[];
  id: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  badge?: string;
}

export const products: Product[] = [
  {
      id: "sob-01",
      name: "Noir Absolu",
      tagline: "The Essence of Mystery",
      price: 145,
      image: "/perfume-1.jpg",
      badge: "Bestseller",
      scentNotes: []
  },
  {
      id: "sob-02",
      name: "Azure Depths",
      tagline: "Power Redefined",
      price: 175,
      image: "/perfume-2.jpg",
      scentNotes: []
  },
  {
      id: "sob-03",
      name: "Blanc Éthéréal",
      tagline: "Elegance in Every Drop",
      price: 220,
      image: "/perfume-3.jpg",
      scentNotes: []
  },
  {
      id: "sob-04",
      name: "Obsidian Edge",
      tagline: "Unapologetically Bold",
      price: 295,
      image: "/perfume-4.jpg",
      badge: "Limited Edition",
      scentNotes: []
  }
];