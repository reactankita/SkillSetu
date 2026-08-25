export interface CategoryConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  popularSkills: string[];
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "tech",
    name: "Technology",
    slug: "technology",
    description: "Web, mobile, databases, scripting & AI implementations",
    icon: "Code",
    popularSkills: ["React", "Next.js", "Python", "Full-Stack", "Flutter", "Node.js", "APIs"],
  },
  {
    id: "design",
    name: "Design",
    slug: "design",
    description: "UI/UX, wireframes, design systems & graphic design",
    icon: "Layout",
    popularSkills: ["Figma", "UI/UX", "Mobile UI", "Design Systems", "Prototyping"],
  },
  {
    id: "art",
    name: "Art",
    slug: "art",
    description: "Digital art, portraits, sketches & creative illustrations",
    icon: "Palette",
    popularSkills: ["Digital Painting", "Portrait Art", "Illustration", "Caricatures"],
  },
  {
    id: "photo",
    name: "Photography",
    slug: "photography",
    description: "College fest, product, portrait & event coverage",
    icon: "Camera",
    popularSkills: ["Event Coverage", "Portrait", "Lightroom", "College Fests"],
  },
  {
    id: "video",
    name: "Video",
    slug: "video",
    description: "Reels editing, documentary, trailers & color grading",
    icon: "Video",
    popularSkills: ["Reels", "Premiere Pro", "After Effects", "Color Grading"],
  },
  {
    id: "marketing",
    name: "Marketing",
    slug: "marketing",
    description: "Social media campaigns, campus outreach & growth",
    icon: "TrendingUp",
    popularSkills: ["Instagram Growth", "Campus Marketing", "Campaigns", "Copywriting"],
  },
  {
    id: "events",
    name: "Events",
    slug: "events",
    description: "Fest planning, volunteer coordination & stage execution",
    icon: "Calendar",
    popularSkills: ["Fest Planning", "Logistics", "Stage Management", "Anchoring"],
  },
  {
    id: "decoration",
    name: "Decoration",
    slug: "decoration",
    description: "Theme stage design, backdrop setup & origami craft",
    icon: "Sparkles",
    popularSkills: ["Stage Backdrops", "Origami", "Fest Decoration", "Floral Setups"],
  },
  {
    id: "tutoring",
    name: "Tutoring",
    slug: "tutoring",
    description: "Mathematics, Physics, Coding & competitive exam prep",
    icon: "BookOpen",
    popularSkills: ["JEE Physics", "Calculus", "DSA Tutoring", "Linear Algebra"],
  },
  {
    id: "content",
    name: "Content",
    slug: "content",
    description: "Technical blogs, SEO copywriting, documentation & pitches",
    icon: "FileText",
    popularSkills: ["SEO Blogs", "Technical Writing", "Pitch Decks", "Case Studies"],
  },
  {
    id: "music",
    name: "Music",
    slug: "music",
    description: "Jingle creation, background scores, vocals & mixing",
    icon: "Music",
    popularSkills: ["Jingles", "Audio Mixing", "Guitar Vocals", "Background Scores"],
  },
  {
    id: "crafts",
    name: "Crafts",
    slug: "crafts",
    description: "Custom exhibition models, 3D prototypes & DIY physical work",
    icon: "Layers",
    popularSkills: ["3D Models", "Exhibition Stalls", "Clay Craft", "Architectural Models"],
  },
];

export const SITE_CONFIG = {
  name: "SkillSetu",
  tagline: "Skills that connect. Opportunities that grow.",
  description: "A verified Indian student marketplace connecting skilled college talent with startups, organizations, and clients with protected payments.",
  url: "https://skillsetu.in",
  platformFeeRate: 0.05, // 5% client fee
  supportEmail: "support@skillsetu.in",
  subscriptionTiers: {
    monthly: {
      id: "monthly_199",
      name: "Student Pro (Monthly)",
      price: 199,
      period: "per month",
      benefits: [
        "Unlimited service listings",
        "Direct client booking requests",
        "SkillSetu Verified Student Badge",
        "Featured placement in search",
        "Zero deduction on payout",
      ],
    },
    yearly: {
      id: "yearly_1499",
      name: "Student Pro (Annual)",
      price: 1499,
      period: "per year",
      discount: "Save 37%",
      benefits: [
        "Everything in Monthly Plan",
        "Priority Client Community leads",
        "Top Performer badge eligibility",
        "Custom portfolio URL",
        "24/7 Priority Dispute Support",
      ],
    },
  },
};
