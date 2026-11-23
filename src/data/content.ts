import WIDTHS from './widths.json';
// Everything on this page comes from The Roots' public Instagram (@therootsshillong) and the
// posts other accounts co-published with them. Captions quoted below are their own words.

const base = import.meta.env.BASE_URL;
export const img = (id: string) => `${base}img/${id}.webp`;
export const thumb = (id: string) => `${base}img/t/${id}.webp`;
/** thumb for phones, full file for wide screens, with each file's real width */
export const srcset = (id: string) => {
  const [t, f] = (WIDTHS as Record<string, number[]>)[id] ?? [760, 1440];
  return `${thumb(id)} ${t}w, ${img(id)} ${f}w`;
};
export const LOGO_INK = `${base}img/logo-ink.png`;
export const LOGO_LIGHT = `${base}img/logo-light.png`;

export const IG = 'https://www.instagram.com/therootsshillong/';
export const IG_DM = 'https://ig.me/m/therootsshillong';
export const YT = 'https://youtu.be/UGDZq2M1oo4';
export const post = (sc: string) => `https://www.instagram.com/p/${sc}/`;

export const SERVICES = ['Events', 'Photo / Video', 'Live Streaming', 'Social Media', 'Design', 'Print'];

export type Shot = { id: string; alt: string };

export const HERO_TILES: Shot[] = [
  { id: 'DSOAJH6k9fC_01', alt: 'Akcent on stage under red and blue concert lights in Shillong' },
  { id: 'DXcFhjcj2wa_03', alt: 'A Shillong Lajong player celebrates under the floodlights' },
  { id: 'DYzf7cOCWPY_02', alt: 'A bride seated in a wood-panelled room, holding her bouquet' },
  { id: 'DXJqCPyielC_02', alt: 'A softbox-lit makeup corner on the set The Roots built for SIFF 2026' },
  { id: 'DXcFhjcj2wa_09', alt: 'A Lajong player lifts a teammate in celebration' },
];

export type Branch = { n: string; name: string; line: string; work: string; id: string; alt: string; sc: string };

export const BRANCHES: Branch[] = [
  {
    n: '01',
    name: 'Events',
    line: 'Sets, stages and spaces built to be enjoyed.',
    work: 'Set for the Shillong International Film Festival 2026',
    id: 'DXJqCPyielC_05',
    alt: 'Festival guests posing at the SIFF 2026 press wall on a red stage',
    sc: 'DXJqCPyielC',
  },
  {
    n: '02',
    name: 'Photo / Video',
    line: 'Weddings, matchdays and the in-between moments.',
    work: 'Wedding film and stills, 2026',
    id: 'DYzf7cOCWPY_01',
    alt: 'A bride in a lace gown standing by a bed in a wooden cottage',
    sc: 'DYzf7cOCWPY',
  },
  {
    n: '03',
    name: 'Live Streaming',
    line: 'LED walls and live feeds, from Kohima to Shillong.',
    work: 'LED stage and live feed for Deepside Deejays',
    id: 'DSO2Fz7ieHm_01',
    alt: 'DJs on a stage wrapped in blue LED panels',
    sc: 'DSO2Fz7ieHm',
  },
  {
    n: '04',
    name: 'Social Media',
    line: 'Reels that move as fast as the event did.',
    work: 'MSCM Offroad Trophy 2.0 reel',
    id: 'DT2uxMciV2h_01',
    alt: 'An off-road jeep kicking up dust on a hill track',
    sc: 'DT2uxMciV2h',
  },
  {
    n: '05',
    name: 'Design',
    line: 'Identity, kits and campaigns with meaning in every line.',
    work: 'Shillong Lajong FC 2026 home and away kits',
    id: 'DW8gEneCbJb_02',
    alt: 'Three Shillong Lajong players in the cream 2026 away kit against a red sun',
    sc: 'DW8gEneCbJb',
  },
  {
    n: '06',
    name: 'Print',
    line: 'Invitations, booklets and badges, printed and bound.',
    work: 'Wedding invitation suites, made to order',
    id: 'DQrJbURidEP_01',
    alt: 'Dark green wedding invitation cards with gold foil monograms',
    sc: 'DQrJbURidEP',
  },
];

export const KIT: (Shot & { tag: string })[] = [
  { id: 'DYOs-T3iYoc_01', tag: '2026 home kit', alt: 'Design board for the red Shillong Lajong 2026 home kit with Khasi pattern details' },
  { id: 'DW8gEneCbJb_01', tag: '2026 away kit', alt: 'Design board for the cream Shillong Lajong 2026 away kit' },
  { id: 'DYOs-T3iYoc_02', tag: 'Campaign', alt: '“This is HOME” campaign poster with a player and a man in traditional Khasi dress' },
];

export const MATCHDAY_A: Shot[] = [
  { id: 'DXcFhjcj2wa_01', alt: 'A Lajong player roars and points to the sky after scoring' },
  { id: 'DXcFhjcj2wa_05', alt: 'Number 19 Ephraim at the corner flag' },
  { id: 'DXy5G6uDfkD_01', alt: 'Two players rise for a header' },
  { id: 'DXcFhjcj2wa_06', alt: 'Two Lajong players celebrate on the pitch at night' },
  { id: 'DXy5G6uDfkD_03', alt: 'A sliding tackle in front of goal' },
  { id: 'DXy5G6uDfkD_05', alt: 'Number 16 drives forward with the ball' },
  { id: 'DXcFhjcj2wa_02', alt: 'Close portrait of a player shouting in celebration' },
  { id: 'DXy5G6uDfkD_07', alt: 'A defender watches the play in the rain' },
];
export const MATCHDAY_B: Shot[] = [
  { id: 'DXy5G6uDfkD_04', alt: 'An opponent strikes the ball mid-stride' },
  { id: 'DXcFhjcj2wa_07', alt: 'A Lajong player turns with arms wide under the lights' },
  { id: 'DXy5G6uDfkD_02', alt: 'Portrait of an opposing player in the half light' },
  { id: 'DXcFhjcj2wa_08', alt: 'Teammates embrace after a goal' },
  { id: 'DXy5G6uDfkD_06', alt: 'Number 34 shapes to shoot as a Lajong player closes in' },
  { id: 'DXcFhjcj2wa_10', alt: 'Number 10 stands with hands on hips after a chance' },
  { id: 'DXy5G6uDfkD_08', alt: 'A Lajong defender slides in to block' },
  { id: 'DXcFhjcj2wa_04', alt: 'A tattooed hand holding a water bottle at the touchline' },
];

export const SIFF: Shot[] = [
  { id: 'DXJqCPyielC_01', alt: 'Guests on the red carpet in front of framed festival posters' },
  { id: 'DXJqCPyielC_02', alt: 'A makeup and wardrobe corner set up under a softbox light' },
  { id: 'DXJqCPyielC_03', alt: 'Students in blazers looking at framed posters on a dark wall' },
  { id: 'DXJqCPyielC_04', alt: 'A guest being interviewed on camera beside the festival banner' },
  { id: 'DXJqCPyielC_06', alt: 'Visitors walking the red-curtained corridor of the set' },
  { id: 'DWUVVfcE9Ea_01', alt: 'A festival session in a conference hall with the SIFF banner' },
];

export const LIVE: (Shot & { place: string; sc: string })[] = [
  { id: 'DcikC8-h56D_01', place: 'Live production · Lajong', sc: 'DcikC8-h56D', alt: 'A live-production monitor showing a Lajong player on screen' },
  { id: 'DRcdHSXj4Yc_01', place: 'Seng Kut Snem 2025', sc: 'DRcdHSXj4Yc', alt: 'A large crowd facing an LED screen under a traditional thatched stage' },
  { id: 'DRwKCadCdzc_01', place: 'Kohima, Nagaland', sc: 'DRwKCadCdzc', alt: 'A long-lens camera above an open-air gathering in Kohima' },
];

export const WEDDINGS: (Shot & { title: string; note: string })[] = [
  { id: 'DXJ1ydoCU4S_04', title: 'Sweet memories', note: 'A garden wedding, frame by frame', alt: 'Collage of a bride and groom in the gardens on their wedding day' },
  { id: 'DYzf7cOCWPY_02', title: 'Beautiful beginning', note: 'Getting ready, in natural light', alt: 'A bride sitting with her bouquet in a wooden room' },
  { id: 'DXJ1ydoCU4S_02', title: 'Garden ceremony', note: 'Arches, flowers and the people who came', alt: 'Collage of an outdoor ceremony with white chairs, floral arches and joined hands' },
  { id: 'DXJ1ydoCU4S_01', title: 'The quiet parts', note: 'Family, hands and first looks', alt: 'Collage of a bride with her family on the wedding morning' },
];

export const PAPER: (Shot & { title: string; who: string })[] = [
  { id: 'DQrJbURidEP_01', title: 'Wedding invitation cards', who: 'Design & print', alt: 'Green and gold wedding invitation suite with monogram seals' },
  { id: 'DdO-jsHymsp_01', title: 'MMUN 2026 · printing partners', who: 'IDs, booklets, binding', alt: 'Meghalaya Model United Nations poster naming The Roots as printing partners' },
  { id: 'DUfLLJik84Z_01', title: 'Welcome boards', who: 'Signage & florals', alt: 'A welcome board framed by white flowers at a venue entrance' },
  { id: 'DYrqoZohmW__01', title: 'Lavi’s sixteenth', who: 'Event signage', alt: 'An acrylic welcome sign for a sixteenth birthday surrounded by roses' },
];

export const SCREEN: (Shot & { title: string; who: string })[] = [
  { id: 'DTNtXGMjxPW_01', title: 'Ka Miet', who: 'Music video · Gracefull Lyngdoh Mawnai', alt: 'Title card for the music video Ka Miet, a woman silhouetted against sunlight' },
  { id: 'DXoaqLID9nP_01', title: 'Door to Love', who: 'Music video · Drama Club, St. Anthony’s College', alt: 'Floral poster for the music video Door to Love' },
  { id: 'DVgBDfMk-mK_01', title: 'Bridal look', who: 'Reel with @makemeblush_by_cc', alt: 'A bride in white and gold Khasi bridal wear' },
  { id: 'DYT5IDIBBAV_01', title: 'Profile-shot booth', who: 'Event photo booth', alt: 'A photographer adjusting a softbox at a portrait booth' },
];

// every photo, for the closing reels
export const ALL_A = [
  'DXcFhjcj2wa_01', 'DXJqCPyielC_01', 'DYwylrtJKgH_01', 'DYT5IDIBBAV_01', 'DW8gEneCbJb_02', 'DRcdHSXj4Yc_01',
  'DXy5G6uDfkD_06', 'DXJ1ydoCU4S_03', 'DQrJbURidEP_01', 'DT2uxMciV2h_01', 'DXJqCPyielC_04', 'DYOs-T3iYoc_01',
  'DTNtXGMjxPW_01',
];
export const ALL_B = [
  'DSO2Fz7ieHm_01', 'DXJ1ydoCU4S_04', 'DXcFhjcj2wa_05', 'DRwKCadCdzc_01', 'DUncgWpiTWe_01', 'DXJqCPyielC_06',
  'DXJqCPyielC_05', 'DXy5G6uDfkD_01', 'DVgBDfMk-mK_01', 'DXJqCPyielC_03', 'DUfLLJik84Z_01', 'DcikC8-h56D_01',
  'DXoaqLID9nP_01',
];

export const CREDITS = [
  '@therootsshillong',
  '@owenkhongsit',
  '@__mikerichard__',
  '@mikejordan_nongrum',
  '@fusionboothshillong',
  '@makemeblush_by_cc',
  '@sac.dramaclub',
  '@khmihcreativesociety',
  '@meghalaya_mun',
];

// alt text for archive tiles, gathered from every captioned list above
const EXTRA_ALT: Record<string, string> = {
  DYwylrtJKgH_01: 'The red Lajong jersey lit by a single strip of light',
  DXJ1ydoCU4S_03: 'A couple walking down a flower-lined outdoor aisle',
  DUncgWpiTWe_01: 'Rings, a wedding dress on a hanger and gold details',
  DXJqCPyielC_06: 'Visitors in the red-curtained corridor of the SIFF set',
};
export const ALT: Record<string, string> = Object.fromEntries(
  [...HERO_TILES, ...BRANCHES, ...KIT, ...MATCHDAY_A, ...MATCHDAY_B, ...SIFF, ...LIVE, ...WEDDINGS, ...PAPER, ...SCREEN].map((x) => [x.id, x.alt]),
);
Object.assign(ALT, EXTRA_ALT, { DSOAJH6k9fC_01: 'Akcent performing under flame jets and stage lights', DRcdHSXj4Yc_01: 'Crowd facing an LED screen at Seng Kut Snem 2025' });
