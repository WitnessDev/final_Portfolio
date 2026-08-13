import { PortfolioItem, ServiceItem, Showreel } from '../types';

export const SHOWREEL_DATA: Showreel = {
  title: "Honesty Visuals 2026 Cinematic Reel",
  subtitle: "High-End Direction, Drone Aerials & Visual Storytelling",
  posterSrc: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200",
  videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  duration: "1:45 MIN",
  highlights: [
    "4K Cinematic Aerial Tracking (DJI Drone)",
    "Commercial Brand Color Grading",
    "Studio & Event Lighting Choreography",
    "Rhythmic Beat-Synced Editing"
  ]
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "direction",
    number: "01",
    title: "Video Director",
    titleSw: "Muongoza Video",
    iconName: "Clapperboard",
    bgImageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200",
    shortDesc: "Script concepts, scene geometry, and talent direction.",
    shortDescSw: "Maandiko, mpangilio wa mandhari, na uongozi wa waigizaji.",
    fullDesc: "Comprehensive visual direction from pre-production concepting to final cut approval.",
    fullDescSw: "Uongozi kamili wa picha kuanzia maandalizi hadi uhakiki wa mwisho wa video.",
    deliverables: ["Script & Storyboarding", "Shot-List & Lighting Setup", "Talent & Scene Blocking", "Creative Cut Approval"],
    deliverablesSw: ["Maandiko na Michoro", "Orodha ya Picha na Mwangaza", "Upangaji wa Wasanii", "Uhakiki wa Mwisho wa Video"]
  },
  {
    id: "videography",
    number: "02",
    title: "Videographer",
    titleSw: "Mrekodi Video",
    iconName: "Video",
    bgImageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1200",
    shortDesc: "4K multi-angle capture, camera motion, and pro audio.",
    shortDescSw: "Urekodi wa 4K wa pembe nyingi na sauti ya kitaalamu.",
    fullDesc: "Specialized camera operation utilizing cine rigs, 4K multi-angle capture, and color grading.",
    fullDescSw: "Urekodi maalum wa video kwa kutumia kamera za kisasa na rangi bora.",
    deliverables: ["4K Multi-Cam Capture", "Gimbal & Motion Shots", "Pro Audio Recording", "Cinematic Color Grading"],
    deliverablesSw: ["Urekodi wa Kamera Nyingi za 4K", "Picha za Mwendo na Gimbal", "Urekodi wa Sauti za Kitaalamu", "Upangaji wa Rangi (Color Grading)"]
  },
  {
    id: "drone",
    number: "03",
    title: "Drone Pilot",
    titleSw: "Rubani wa Droni",
    iconName: "Plane",
    bgImageUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=1200",
    shortDesc: "4K aerial tracking, landscapes, and architectural perspectives.",
    shortDescSw: "Picha na video za angani za 4K kwa usahihi wa juu.",
    fullDesc: "Licensed aerial videography and photography across East Africa.",
    fullDescSw: "Uchukuzi wa picha na video za angani ulioidhinishwa.",
    deliverables: ["4K 60fps Aerial Reels", "Architectural Orthomosaics", "Dynamic Pursuit Tracking", "High-Resolution Overhead Stills"],
    deliverablesSw: ["Video za Angani za 4K 60fps", "Picha za Majengo na Ardhi", "Ufuatiliaji wa Angani", "Picha za Angani za Ubora wa Juu"]
  },
  {
    id: "photography",
    number: "04",
    title: "Photographer",
    titleSw: "Mpigapicha",
    iconName: "Camera",
    bgImageUrl: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=1200",
    shortDesc: "Studio portraits, commercial products, and editorial stills.",
    shortDescSw: "Picha za studio, bidhaa za biashara, na matukio.",
    fullDesc: "High-end commercial and portrait photography with controlled studio lighting.",
    fullDescSw: "Picha za kibiashara na za kibinafsi za viwango vya juu.",
    deliverables: ["High-Res Studio Portraits", "Commercial Product Shots", "Event & Cultural Coverage", "Advanced Skin & Tone Retouching"],
    deliverablesSw: ["Picha za Studio za Ubora wa Juu", "Picha za Bidhaa za Biashara", "Ushuhuda wa Matukio", "Uhariri na Utengenezaji wa Picha"]
  },
  {
    id: "graphics",
    number: "05",
    title: "Graphics Design",
    titleSw: "Ubuni wa Michoro",
    iconName: "Vector",
    bgImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
    shortDesc: "Brand identity, event flyers, and vector typography.",
    shortDescSw: "Nembo za biashara, vipeperushi, na mabango ya kidijitali.",
    fullDesc: "Visual identity engineering, typography, and poster art.",
    fullDescSw: "Uhandisi wa muonekano wa kibiashara na mabango ya kidijitali.",
    deliverables: ["Brand Identity & Logo Systems", "Event & Concert Key Art", "Social Media Content Suites", "Vector Typography & Layouts"],
    deliverablesSw: ["Nembo na Muonekano wa Biashara", "Mabango ya Matukio", "Maudhui ya Mitandao ya Kijamii", "Mpangilio wa Maandishi na Michoro"]
  }
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  // PHOTOGRAPHY
  {
    id: "photo-1",
    title: "Studio Portrait Series",
    category: "photography",
    categoryLabel: "Photography",
    imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000",
    description: "High-key studio portraiture with dramatic Rembrandt lighting key, focusing on raw emotion and skin texture clarity.",
    client: "Editorial Model",
    year: "2026",
    featured: true
  },
  {
    id: "photo-2",
    title: "Urban Street Fashion",
    category: "photography",
    categoryLabel: "Photography",
    imageUrl: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&q=80&w=1000",
    description: "Contemporary streetwear editorial shot on location in Dar es Salaam, pairing high contrast sunlight with urban geometry.",
    client: "Swahili Threads",
    year: "2025"
  },
  {
    id: "photo-3",
    title: "Coastal Horizon Mood",
    category: "photography",
    categoryLabel: "Photography",
    imageUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000",
    description: "Minimalist landscape photography capturing golden hour reflection over the Indian Ocean shoreline.",
    client: "East Africa Tourism",
    year: "2025"
  },
  {
    id: "photo-4",
    title: "Commercial Luxury Product",
    category: "photography",
    categoryLabel: "Photography",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000",
    description: "Precision macro product shot highlighting metallic textures and reflections for high-end boutique accessories.",
    client: "Aura Fragrances",
    year: "2026"
  },
  {
    id: "photo-5",
    title: "Cultural Event Moments",
    category: "photography",
    categoryLabel: "Photography",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000",
    description: "Candid photojournalism capturing live acoustic performances, worship gatherings, and crowd energy.",
    client: "Worship Night EAC",
    year: "2025"
  },
  {
    id: "photo-6",
    title: "Creative Concept & Silhouette",
    category: "photography",
    categoryLabel: "Photography",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=1000",
    description: "Experimental shadow play and monochromatic lighting creating an abstract artistic silhouette.",
    client: "Honesty Art Lab",
    year: "2026"
  },

  // VIDEOGRAPHY
  {
    id: "video-1",
    title: "Brand Commercial Reel",
    category: "videography",
    categoryLabel: "Videography",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "Fast-paced, 4K commercial cut showcasing dynamic camera tracking, sound design, and vibrant color grading.",
    client: "Afritrade Corporate",
    year: "2026",
    featured: true
  },
  {
    id: "video-2",
    title: "Acoustic Live Session",
    category: "videography",
    categoryLabel: "Videography",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "Multi-camera worship and musical performance recording with synchronized high-fidelity studio audio.",
    client: "Kingdom Worship Collective",
    year: "2025"
  },

  // DRONE
  {
    id: "drone-1",
    title: "Aerial Coastline Horizon",
    category: "drone",
    categoryLabel: "Drone Visuals",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1000",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    description: "Sweeping 4K aerial drone shot flying over turquoise ocean coastal reefs in Dar es Salaam at sunrise.",
    client: "EAC Marine Project",
    year: "2026",
    featured: true
  },
  {
    id: "drone-2",
    title: "Architectural Urban Flyover",
    category: "drone",
    categoryLabel: "Drone Visuals",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000",
    description: "Smooth vertical orthomosaic tracking pass above high-rise architecture and metropolitan highways.",
    client: "Metropolitan Skyline",
    year: "2025"
  },

  // GRAPHICS
  {
    id: "graphic-1",
    title: "Brand Identity & Key Art I",
    category: "graphics",
    categoryLabel: "Graphics",
    imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1000",
    description: "Minimalist vector identity system featuring bold typography, gold foil accents, and structured grids.",
    client: "Honesty Visuals Studio",
    year: "2026",
    featured: true
  },
  {
    id: "graphic-2",
    title: "Abstract Poster Series",
    category: "graphics",
    categoryLabel: "Graphics",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000",
    description: "Architectural poster design balancing Swiss typography rules with high-contrast monochrome shapes.",
    client: "Visual Arts Gallery",
    year: "2025"
  },
  {
    id: "graphic-3",
    title: "Worship Night Event Flyer",
    category: "graphics",
    categoryLabel: "Graphics",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000",
    description: "High-impact event promotional flyer engineered for digital screens and printed billboard placement.",
    client: "Worship Ministry",
    year: "2026"
  },
  {
    id: "graphic-4",
    title: "Digital UI/UX System",
    category: "graphics",
    categoryLabel: "Graphics",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000",
    description: "Dark-mode interface design with high readability, spatial rhythm, and ergonomic control points.",
    client: "Fintech Platform",
    year: "2025"
  },
  {
    id: "graphic-5",
    title: "Typography Album Cover",
    category: "graphics",
    categoryLabel: "Graphics",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
    description: "Album key art with custom hand-crafted letterforms, tactile grain textures, and gold metallic accents.",
    client: "Instrumental Soundscapes",
    year: "2026"
  }
];

export const CLIENT_CREDENTIALS = {
  name: "Honesty George",
  brand: "Honesty Visuals",
  tagline: "High-Impact Cinematic & Brand Media Production",
  location: "Dar es Salaam, Tanzania 🇹🇿 (EAC)",
  phone: "+255 794292948",
  whatsappUrl: "https://wa.me/255794292948",
  email: "honestygeorge35@gmail.com",
  instagram: "https://www.instagram.com/_official.honesty?igsh=MWpobDI3bmdlZnU3bg==",
  tiktok: "https://tiktok.com",
  youtube: "https://youtube.com",
  established: "08/07",
  bio: [
    "Balancing corporate intelligence with profound artistic execution, I design high-end digital experiences powered by pure execution and relentless passion.",
    "While currently pursuing my academic degree on the analytical side, my driven pursuit of multimedia serves as a powerful standalone venture. I don't just treat media creation as a casual hobby; I approach graphic design, drone piloting, and cinematic video direction with strict industrial precision. This unique dual-mindset allows me to inject structural logic and calculated brand strategy into every creative asset I deliver.",
    "Beyond the lenses and business data files, my identity is deeply anchored in musical and spiritual dedication. Operating as a worship minister and keyboard instrumentalist, I possess an intuitive grasp of tone, pacing, and emotional rhythm—creative elements that seamlessly translate into dynamic pacing inside the editing bay."
  ],
  stats: [
    { label: "Core Media Disciplines", value: "5 Major Cores" },
    { label: "Regional Coverage", value: "Tanzania & EAC 🇹🇿" },
    { label: "Production Precision", value: "100%" },
    { label: "Dual Expertise", value: "Artist & Analyst" }
  ]
};
