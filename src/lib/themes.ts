export type Theme = {
  id: string;
  name: string;
  emoji: string;
  bg: string;
  accent: string;
  heroOverlay: string;
  marqueeText: string;
  bannerNote: string;
};

export const FESTIVAL_THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Everyday',
    emoji: '✦',
    bg: '#F7F0E6',
    accent: '#C5A055',
    heroOverlay: 'rgba(61,53,48,0.18)',
    marqueeText: '#C5A055',
    bannerNote: '',
  },
  {
    id: 'diwali',
    name: 'Diwali',
    emoji: '🪔',
    bg: '#FFF8EE',
    accent: '#E8860C',
    heroOverlay: 'rgba(80,40,0,0.22)',
    marqueeText: '#E8860C',
    bannerNote: 'Diwali Collection is Live ✦ Free shipping above ₹2000',
  },
  {
    id: 'eid',
    name: 'Eid',
    emoji: '☽',
    bg: '#F2F7F4',
    accent: '#1D7A5A',
    heroOverlay: 'rgba(10,50,30,0.2)',
    marqueeText: '#1D7A5A',
    bannerNote: 'Eid Mubarak ✦ New festive arrivals are here',
  },
  {
    id: 'holi',
    name: 'Holi',
    emoji: '🎨',
    bg: '#FFF4F9',
    accent: '#D4537E',
    heroOverlay: 'rgba(80,20,40,0.18)',
    marqueeText: '#D4537E',
    bannerNote: 'Happy Holi ✦ Bright & beautiful festive pieces',
  },
  {
    id: 'navratri',
    name: 'Navratri',
    emoji: '✦',
    bg: '#FFF7ED',
    accent: '#C0392B',
    heroOverlay: 'rgba(80,10,10,0.2)',
    marqueeText: '#C0392B',
    bannerNote: 'Navratri Specials ✦ Dance in tradition',
  },
  {
    id: 'christmas',
    name: 'Christmas',
    emoji: '✦',
    bg: '#F5F9F5',
    accent: '#2D6A2D',
    heroOverlay: 'rgba(20,50,20,0.2)',
    marqueeText: '#2D6A2D',
    bannerNote: 'Season\'s Greetings ✦ Festive ethnic wear for your little star',
  },
  {
    id: 'independence',
    name: 'Independence Day',
    emoji: '✦',
    bg: '#F7F9F7',
    accent: '#FF6600',
    heroOverlay: 'rgba(0,40,10,0.18)',
    marqueeText: '#FF6600',
    bannerNote: 'Jai Hind ✦ Celebrate with pride',
  },
  {
    id: 'puja',
    name: 'Durga Puja',
    emoji: '✦',
    bg: '#FFF9EE',
    accent: '#CC8800',
    heroOverlay: 'rgba(70,35,0,0.2)',
    marqueeText: '#CC8800',
    bannerNote: 'Subho Bijoya ✦ Puja collection is here',
  },
];

export const getTheme = (id: string): Theme =>
  FESTIVAL_THEMES.find((t) => t.id === id) ?? FESTIVAL_THEMES[0];
