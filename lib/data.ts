import { type DesignStyle } from "@/app/page";

export type RoomCategory = "Living Room" | "Bedroom" | "Kitchen" | "Bathroom" | "Office" | "Dining Room";

export type InspirationItem = {
  id: number;
  style: DesignStyle;
  room: RoomCategory;
  title: string;
  tags: string[];
  likes: number;
  bg: string;
  accent: string;
  height: number;
  image: string;
};

export const INSPIRATION_ITEMS: InspirationItem[] = [
  { id: 1,  style: "Modern",        room: "Living Room", title: "Minimalist Living Space",    tags: ["Modern", "Clean"],      likes: 2341, bg: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)", accent: "#333",    height: 320, image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=260&fit=crop" },
  { id: 2,  style: "Luxury",        room: "Bedroom",     title: "Gold Accent Master Suite",   tags: ["Luxury", "Gold"],       likes: 5892, bg: "linear-gradient(135deg, #1a1208 0%, #c9a84c 100%)", accent: "#f5e6c8", height: 260, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=260&fit=crop" },
  { id: 3,  style: "Scandinavian",  room: "Living Room", title: "Nordic Cozy Corner",         tags: ["Scandi", "Warm"],       likes: 3120, bg: "linear-gradient(135deg, #f9f6f0 0%, #c9b99a 100%)", accent: "#5a7a6a", height: 290, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=260&fit=crop" },
  { id: 4,  style: "Industrial",    room: "Office",      title: "Urban Loft Studio",          tags: ["Industrial", "Raw"],    likes: 1987, bg: "linear-gradient(135deg, #3a3530 0%, #6b5c4e 100%)", accent: "#b8a898", height: 360, image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=260&fit=crop" },
  { id: 5,  style: "Bohemian",      room: "Bedroom",     title: "Eclectic Boho Bedroom",      tags: ["Boho", "Colorful"],     likes: 4210, bg: "linear-gradient(135deg, #c0392b 0%, #8e44ad 100%)", accent: "#f5e6c8", height: 280, image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=260&fit=crop" },
  { id: 6,  style: "Japandi",       room: "Living Room", title: "Zen Reading Nook",           tags: ["Japandi", "Calm"],      likes: 6730, bg: "linear-gradient(135deg, #f2ede8 0%, #8c7b6b 100%)", accent: "#3d3530", height: 310, image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400&h=260&fit=crop" },
  { id: 7,  style: "Traditional",   room: "Dining Room", title: "Classic Drawing Room",       tags: ["Classic", "Elegant"],  likes: 2150, bg: "linear-gradient(135deg, #8b4513 0%, #d4a96a 100%)", accent: "#f0e6d3", height: 240, image: "https://images.unsplash.com/photo-1567767292278-a702968fb87f?w=400&h=260&fit=crop" },
  { id: 8,  style: "Minimalist",    room: "Kitchen",     title: "Pure White Kitchen",         tags: ["Minimal", "Pure"],      likes: 3890, bg: "linear-gradient(135deg, #ffffff 0%, #e8e8e8 100%)", accent: "#1a1a1a", height: 340, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=260&fit=crop" },
  { id: 9,  style: "Modern",        room: "Living Room", title: "Dark Mode Living Room",      tags: ["Dark", "Modern"],       likes: 7120, bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", accent: "#e94560", height: 270, image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=260&fit=crop" },
  { id: 10, style: "Scandinavian",  room: "Living Room", title: "Forest Cabin Vibes",         tags: ["Nature", "Wood"],       likes: 4560, bg: "linear-gradient(135deg, #2d5a27 0%, #8b6914 100%)", accent: "#f9f6f0", height: 300, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=260&fit=crop" },
  { id: 11, style: "Luxury",        room: "Dining Room", title: "Marble & Velvet Dining",     tags: ["Marble", "Luxury"],     likes: 8901, bg: "linear-gradient(135deg, #2c2c54 0%, #c0392b 100%)", accent: "#f5e6c8", height: 350, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=260&fit=crop" },
  { id: 12, style: "Industrial",    room: "Office",      title: "Exposed Brick Office",       tags: ["Industrial", "Work"],   likes: 2340, bg: "linear-gradient(135deg, #4a4a4a 0%, #8b6914 100%)", accent: "#e8e8e8", height: 260, image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=260&fit=crop" },
  { id: 13, style: "Bohemian",      room: "Living Room", title: "Moroccan Inspired Lounge",   tags: ["Moroccan", "Patterns"], likes: 5670, bg: "linear-gradient(135deg, #e67e22 0%, #c0392b 100%)", accent: "#f5e6c8", height: 320, image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=260&fit=crop" },
  { id: 14, style: "Japandi",       room: "Bathroom",    title: "Bamboo & Stone Bath",        tags: ["Zen", "Bath"],          likes: 3210, bg: "linear-gradient(135deg, #f2ede8 0%, #3d3530 100%)", accent: "#a8b89a", height: 280, image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400&h=260&fit=crop" },
  { id: 15, style: "Modern",        room: "Kitchen",     title: "Open Plan Kitchen",          tags: ["Open", "Modern"],       likes: 6540, bg: "linear-gradient(135deg, #f5f5f5 0%, #3d5a80 100%)", accent: "#e0e0e0", height: 300, image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=260&fit=crop" },
];

// Unique styles for the Templates panel
export const STYLE_TEMPLATES = Array.from(
  INSPIRATION_ITEMS.reduce((map, item) => {
    if (!map.has(item.style)) map.set(item.style, item);
    return map;
  }, new Map<DesignStyle, InspirationItem>()).values()
).map((item) => ({
  name: item.style,
  title: item.title,
  image: item.image,
  tags: item.tags,
}));

export const STYLE_CATEGORIES = ["All", "Modern", "Luxury", "Scandinavian", "Industrial", "Bohemian", "Japandi", "Traditional", "Minimalist"];
export const ROOM_CATEGORIES: RoomCategory[] = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office", "Dining Room"];
