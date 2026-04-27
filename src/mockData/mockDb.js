// Mock data specifically for Eastern University - Trincomalee Campus
export const users = [
  {
    id: "student1", name: "Amila Perera", firstName: "Amila", lastName: "Perera",
    email: "amila.p@esn.ac.lk", role: "student",
    profilePicture: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150",
    studentProfile: { university: "uni1", preferences: { maxBudget: 25000, preferredFacilities: ["wifi", "attached_bathroom"] } }
  },
  {
    id: "owner1", name: "Kamal Silva", firstName: "Kamal", lastName: "Silva",
    email: "kamal.silva@example.com", role: "owner", isVerified: true,
    verificationStatus: "verified",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "admin1", name: "System Admin", firstName: "System", lastName: "Admin",
    email: "admin@boardfinder.lk", role: "admin"
  }
];

export const universities = [
  { id: "uni1", name: "Eastern University, Sri Lanka - Trincomalee Campus", shortName: "EUSL-Trinco", domain: "esn.ac.lk", location: { type: "Point", coordinates: [81.2152, 8.5874] } },
  { id: "uni2", name: "Eastern University, Sri Lanka - Vantharumoolai", shortName: "EUSL", domain: "esn.ac.lk", location: { type: "Point", coordinates: [81.5714, 7.8018] } },
  { id: "uni3", name: "University of Jaffna - Trincomalee Campus", shortName: "UoJ-Trinco", domain: "jfn.ac.lk", location: { type: "Point", coordinates: [81.2300, 8.5700] } },
];

export const listings = [
  {
    id: "list1", ownerId: "owner1",
    title: "Spacious Single Room near EUSL Trincomalee",
    description: "A comfortable and quiet room perfect for university students. Located just 10 minutes walk from Eastern University Trincomalee Campus. Comes with attached bathroom, WiFi, and furnished interior. Peaceful neighbourhood ideal for studying.",
    price: 12000, deposit: 5000, distance: 0.8, status: "available",
    roomType: "single",
    facilities: ["wifi", "bathroom", "furnished", "water", "electricity"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80"
    ],
    location: { type: "Point", coordinates: [81.2180, 8.5900], address: "15 Temple Road, Trincomalee" },
    tenantPreferences: { gender: "any", type: "undergraduates" },
    averageRating: 4.5, reviewCount: 8, viewCount: 156, favoriteCount: 23,
    isApproved: true
  },
  {
    id: "list2", ownerId: "owner1",
    title: "Shared Room - Budget Friendly",
    description: "Affordable shared room for two students. Close to Trincomalee town center with easy bus access to campus. Kitchen available for cooking.",
    price: 7500, deposit: 3000, distance: 2.5, status: "available",
    roomType: "shared",
    facilities: ["kitchen", "furnished", "water"],
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"
    ],
    location: { type: "Point", coordinates: [81.2330, 8.5780], address: "42 Main Street, Trincomalee" },
    tenantPreferences: { gender: "male", type: "undergraduates" },
    averageRating: 3.8, reviewCount: 5, viewCount: 98, favoriteCount: 12,
    isApproved: true
  },
  {
    id: "list3", ownerId: "owner1",
    title: "Modern Annex with AC - Near Campus Gate",
    description: "Private entrance annex with modern facilities including AC, WiFi, and attached bathroom. Just 5 minutes walk from EUSL main gate. 24/7 water and electricity supply.",
    price: 20000, deposit: 10000, distance: 0.5, status: "available",
    roomType: "studio",
    facilities: ["wifi", "ac", "bathroom", "kitchen", "furnished", "water", "electricity", "parking"],
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80"
    ],
    location: { type: "Point", coordinates: [81.2160, 8.5880], address: "3A University Road, Trincomalee" },
    tenantPreferences: { gender: "any", type: "any" },
    averageRating: 4.9, reviewCount: 12, viewCount: 342, favoriteCount: 45,
    isApproved: true
  },
  {
    id: "list4", ownerId: "owner1",
    title: "Girls Only - Safe & Secure Room",
    description: "Safe and secure boarding room exclusively for female students. Located in a family-friendly neighbourhood with security. Close to Trincomalee bus stand.",
    price: 10000, deposit: 5000, distance: 1.8, status: "available",
    roomType: "single",
    facilities: ["wifi", "furnished", "security", "water", "electricity"],
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"
    ],
    location: { type: "Point", coordinates: [81.2250, 8.5820], address: "67 Fort Frederick Rd, Trincomalee" },
    tenantPreferences: { gender: "female", type: "undergraduates" },
    averageRating: 4.2, reviewCount: 6, viewCount: 89, favoriteCount: 18,
    isApproved: true
  },
  {
    id: "list5", ownerId: "owner1",
    title: "Twin Sharing near Trinco Beach",
    description: "Beautiful twin sharing room with sea breeze. Walking distance to both campus and Trincomalee beach. Perfect for students who love nature.",
    price: 9000, deposit: 4000, distance: 1.5, status: "occupied",
    roomType: "shared",
    facilities: ["wifi", "kitchen", "furnished", "water"],
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80"
    ],
    location: { type: "Point", coordinates: [81.2100, 8.5950], address: "12 Beach Road, Trincomalee" },
    tenantPreferences: { gender: "male", type: "undergraduates" },
    averageRating: 4.0, reviewCount: 3, viewCount: 67, favoriteCount: 8,
    isApproved: true
  },
  {
    id: "list6", ownerId: "owner1",
    title: "Pending - New Room near Campus",
    description: "Brand new room available for students. Just submitted for admin approval.",
    price: 11000, deposit: 5000, distance: 1.0, status: "available",
    roomType: "single",
    facilities: ["wifi", "furnished", "water", "electricity"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"
    ],
    location: { type: "Point", coordinates: [81.2200, 8.5860], address: "28 Campus Lane, Trincomalee" },
    tenantPreferences: { gender: "any", type: "any" },
    averageRating: 0, reviewCount: 0, viewCount: 0, favoriteCount: 0,
    isApproved: false
  }
];

export const reviews = [
  { id: "rev1", listingId: "list1", userId: "student1", rating: 5, comment: "Excellent place, very clean and close to university. The owner is very friendly and helpful.", createdAt: "2026-03-10T10:00:00Z" },
  { id: "rev2", listingId: "list1", userId: "student2", rating: 4, comment: "Good place but gets a bit noisy during weekends.", createdAt: "2026-03-15T12:30:00Z" },
  { id: "rev3", listingId: "list3", userId: "student1", rating: 5, comment: "Best boarding place near campus! AC works perfectly and the room is very modern.", createdAt: "2026-02-20T09:15:00Z" },
  { id: "rev4", listingId: "list4", userId: "student3", rating: 4, comment: "Very safe area, good for girls. The landlord's family is very supportive.", createdAt: "2026-01-05T14:45:00Z" },
  { id: "rev5", listingId: "list2", userId: "student4", rating: 4, comment: "Budget friendly and decent facilities for the price.", createdAt: "2026-03-01T16:20:00Z" }
];
