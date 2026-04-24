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
      image: "/sob-perfume-bottle.png",
      badge: "Bestseller",
      scentNotes: []
  },
  {
      id: "sob-02",
      name: "Azure Depths",
      tagline: "Power Redefined",
      price: 175,
      image: "/sob-perfume-bottle.png",
      scentNotes: []
  },
  {
      id: "sob-03",
      name: "Blanc Éthéréal",
      tagline: "Elegance in Every Drop",
      price: 220,
      image: "/sob-perfume-bottle.png",
      scentNotes: []
  },
  {
      id: "sob-04",
      name: "Obsidian Edge",
      tagline: "Unapologetically Bold",
      price: 295,
      image: "/sob-perfume-bottle.png",
      badge: "Limited Edition",
      scentNotes: []
  }
];