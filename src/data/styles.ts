// Styles, fonts, symbols, frames and words data for 亗𝐑𝐗々𝐅𝐅 𝐒𝐓𝐘𝐋𝐄亗

export const BRAND_NAME = '亗𝐑𝐗々𝐅𝐅 𝐒𝐓𝐘𝐋𝐄亗';
export const BRAND_SUBTITLE = 'Free Fire styles web';
export const BRAND_LOGO = 'https://i.postimg.cc/6q0XrBKv/file-00000000228082118a51e116fc12be7f.png';

export const A = (s: string) => Array.from(s);
export const rnd = (n: number) => Math.floor(Math.random() * n);
export const pick = <T>(a: T[]): T => a[rnd(a.length)];

export const smallcaps = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ';
export const TINY_SAFE = A('ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖǫʳˢᵗᵘᵛʷˣʸᶻ');
export const CAN = A('ᗩᗷᑕᗪᗴᖴᘜᕼIᒍKᒪᗰᑎOᑭQᖇᔕTᑌᐯᗯ᙭YZ');
export const CIRC_U = A('ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ');
export const CIRC_L = A('ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ');
export const KAW: Record<string, string> = {
  a: 'α', b: 'в', c: '¢', d: '∂', e: 'є', f: 'ƒ', g: 'g', h: 'н', i: 'ι', j: 'נ',
  k: 'к', l: 'ℓ', m: 'м', n: 'η', o: 'σ', p: 'ρ', q: 'q', r: 'я', s: 'ѕ', t: 'т',
  u: 'υ', v: 'ν', w: 'ω', x: 'χ', y: 'у', z: 'z'
};
export const SUPL = A('ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻ');
export const CHN = A('卂乃匚刀乇下厶卄工丁长乚从ん口尸Ǫ尺丂ㄒ凵リ山乂丫乙');

export const UP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const LO = 'abcdefghijklmnopqrstuvwxyz';
export const DG = '0123456789';

export const SC = A(smallcaps);
export const toSC = (c: string) => {
  const i = LO.indexOf(c.toLowerCase());
  return i > -1 ? SC[i] : c;
};
export const tiny = (c: string) => {
  const i = LO.indexOf(c.toLowerCase());
  return i > -1 ? TINY_SAFE[i] : c;
};

export function mm(u: number, l: number, d: number, ex?: Record<string, string>) {
  return (c: string) => {
    if (ex && ex[c]) return ex[c];
    let i = UP.indexOf(c);
    if (i > -1) return String.fromCodePoint(u + i);
    i = LO.indexOf(c);
    if (i > -1) return String.fromCodePoint(l + i);
    i = DG.indexOf(c);
    if (i > -1 && d) return String.fromCodePoint(d + i);
    return c;
  };
}

export function mapStr(f: string, t: string) {
  const a = A(f), b = A(t), m: Record<string, string> = {};
  a.forEach((c, i) => m[c] = b[i]);
  return (c: string) => m[c] || c;
}

export const cyr = mapStr('ABCEHKMOPTXYacehkmopxyisj', 'АВСЕНКМОРТХУасенкморхуіѕј');
export const grk = mapStr('ABEHIKMNOPTXYZabeiknoptuvwxy', 'ΑΒΕΗΙΚΜΝΟΡΤΧΥΖαβεικηορτυνωχγ');
export const acc = mapStr('AaBCcDdEeIiNnOoSsUuYyZzLl', 'ÄäßÇçÐđËëÏïÑñÖöŠšÜüŸÿŽžŁł');
export const stk = mapStr('ABCDEGHIJLOPRTUYZabcdeghijloprtuyz', 'ȺɃȻĐɆǤĦƗɈŁØⱣɌŦɄɎƵⱥƀȼđɇǥħɨɉłøᵽɍŧʉɏƶ');

export interface StyleDef {
  n: string;
  f: (c: string, i: number, arr: string[]) => string;
  sep?: number;
  test?: number;
}

export const BASE_STYLES: StyleDef[] = [
  { n: 'Normal', f: c => c },
  { n: 'UPPER', f: c => c.toUpperCase() },
  { n: 'lower', f: c => c.toLowerCase() },
  { n: 'aLt CaPs', f: (c, i) => i % 2 ? c.toLowerCase() : c.toUpperCase() },
  { n: 'Small Caps', f: toSC },
  { n: 'Mixed Small Caps', f: (c, i) => i % 2 ? toSC(c) : c.toUpperCase() },
  { n: 'Cap+Small', f: (c, i) => c === ' ' ? c : (i === 0 ? c.toUpperCase() : toSC(c)) },
  { n: 'Leet', f: c => ({ a: '4', e: '3', i: '1', o: '0', s: '5', t: '7' }[c.toLowerCase()] || c) },
  { n: 'Bold', f: mm(0x1D400, 0x1D41A, 0x1D7CE) },
  { n: 'Italic', f: mm(0x1D434, 0x1D44E, 0, { h: 'ℎ' }) },
  { n: 'Bold Italic', f: mm(0x1D468, 0x1D482, 0x1D7CE) },
  { n: 'Script', f: mm(0x1D49C, 0x1D4B6, 0, { B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ', e: 'ℯ', g: 'ℊ', o: 'ℴ' }) },
  { n: 'Bold Script', f: mm(0x1D4D0, 0x1D4EA, 0x1D7CE) },
  { n: 'Double', f: mm(0x1D538, 0x1D552, 0x1D7D8, { C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ' }) },
  { n: 'Sans Bold', f: mm(0x1D5D4, 0x1D5EE, 0x1D7EC) },
  { n: 'Sans Italic', f: mm(0x1D608, 0x1D622, 0x1D7E2) },
  { n: 'Mono', f: mm(0x1D670, 0x1D68A, 0x1D7F6) },
  { n: 'Fullwidth', f: c => { const x = c.codePointAt(0) || 0; return x >= 33 && x <= 126 ? String.fromCodePoint(x + 0xFEE0) : c; } },
  { n: 'Superscript', f: c => { const i = LO.indexOf(c.toLowerCase()); return i > -1 ? SUPL[i] : c; } },
  { n: 'Circled', f: c => { let i = UP.indexOf(c); if (i > -1) return CIRC_U[i]; i = LO.indexOf(c); if (i > -1) return CIRC_L[i]; return c; } },
  { n: 'Canadian', f: c => { const i = UP.indexOf(c.toUpperCase()); return i > -1 ? CAN[i] : c; } },
  { n: 'Kawaii', f: c => KAW[c.toLowerCase()] || c },
  { n: 'Tiny', f: tiny },
  { n: 'Cap+Tiny', f: (c, i) => i === 0 ? c.toUpperCase() : tiny(c) },
  { n: 'Upper+Tiny', f: (c, i) => i % 2 ? tiny(c) : c.toUpperCase() },
  { n: 'Small+Upper', f: (c, i) => i % 2 ? c.toUpperCase() : toSC(c) },
  { n: 'Tiny+Small', f: (c, i) => i % 2 ? toSC(c) : tiny(c) },
];

const SEPS: [string, string][] = [
  ['.', 'Dots'], ['-', 'Dashes'], ['_', 'Lines'], ['*', 'Stars'],
  ['•', 'Bullets'], ['★', 'Star Cut'], ['☆', 'Open Star'], ['ツ', 'Tsu']
];

export const STYLES: StyleDef[] = [...BASE_STYLES];
BASE_STYLES.forEach(bs => {
  SEPS.forEach(([sp, sn]) => {
    STYLES.push({
      n: bs.n + ' ' + sn,
      sep: 1,
      f: (c, i, arr) => bs.f(c, i, arr) + (i < arr.length - 1 && c !== ' ' ? sp : '')
    });
  });
});

export const EXTRA_STYLES: StyleDef[] = [
  { n: 'Chinese Style', test: 1, f: c => { const i = UP.indexOf(c.toUpperCase()); return i > -1 ? CHN[i] : c; } },
  { n: 'Cyrillic Mix', test: 1, f: cyr },
  { n: 'Greek Mix', test: 1, f: grk },
  { n: 'Accent', test: 1, f: acc },
  { n: 'Stroke', test: 1, f: stk },
  { n: 'Bangla Digits', test: 1, f: c => { const i = DG.indexOf(c); return i > -1 ? String.fromCodePoint(0x9E6 + i) : c; } }
];

export const applyStyle = (s: string, x: StyleDef) => {
  let i = 0;
  const arr = A(s);
  return arr.map(c => x.f(c, i++, arr)).join('');
};

export const FRAMES: [string, string][] = [
  ['', ''], ['꧁', '꧂'], ['꧁༒', '༒꧂'], ['꧁༒☬', '☬༒꧂'], ['꧁༺', '༻꧂'], ['꧁•', '࿐'],
  ['꧁亗', '亗꧂'], ['꧁彡', '彡꧂'], ['꧁', 'ツ꧂'], ['༆', '࿐'], ['༆', '亗'], ['༄', '࿐'],
  ['✿᭄', ''], ['᭄', ''], ['', '᭄'], ['', '࿐'], ['★彡', '彡★'], ['☆彡', '彡☆'],
  ['ミ★', '★ミ'], ['亗', '亗'], ['亗『', '』亗'], ['『亗', '亗』'], ['『', '』'],
  ['【', '】'], ['「', '」'], ['〆', '々'], ['〆', '〆'], ['々', '々'], ['燃', '燃'],
  ['乂', '乂'], ['么', ''], ['', '么'], ['', '乡'], ['乡', '乡'], ['メ', ''], ['', 'メ'],
  ['', 'ツ'], ['ツ', ''], ['シ', ''], ['', 'ッ'], ['♛', '♛'], ['♛', ''], ['', '♛'],
  ['♚', '♚'], ['☬', '☬'], ['༒', '༒'], ['༒☬', '☬༒'], ['✦', '✦'], ['❖', '❖'],
  ['✪', '✪'], ['⊰', '⊱'], ['◥', '◤'], ['◤', '◥'], ['▒', '▒'], ['░', '░'], ['▓', '▓'],
  ['★', '★'], ['☆', '☆'], ['•', '•'], ['_', '_'], ['-', '-'], ['♛', 'ツ'], ['★', 'ツ'],
  ['༒', 'ツ'], ['亗', 'ツ'], ['〆', 'ツ'], ['乂', 'ツ'], ['☬', 'ッ'], ['', '♚ツ'],
  ['✿', '✿'], ['༺', '༻'], ['', '™'], ['', '®'], ['', '©'], ['☯', ''], ['', '☯'],
  ['☂', ''], ['', '☂'], ['⚔', '⚔'], ['☠', '☠'], ['☠', ''], ['', '☠'], ['♥', '♥'],
  ['❤', '❤'], ['❥', ''], ['', '❥'], ['♡', '♡'], ['❀', '❀'], ['✰', '✰'], ['✯', '✯'],
  ['⚜', '⚜'], ['♜', '♜'], ['♞', ''], ['☾', '☽'], ['⌖', '⌖'], ['⍟', '⍟'], ['ʚ', 'ɞ'],
  ['ꨄ', ''], ['', 'ꨄ'], ['ꕥ', ''], ['', 'ꕥ'], ['↯', ''], ['', '↯'], ['〠', ''],
  ['۝', '۝'], ['▄︻┻┳═一', ''], ['', '⚡'], ['⚡', '⚡']
];

export const EMO_FRAMES: [string, string][] = [
  ['🔥', '🔥'], ['🔥', ''], ['', '🔥'], ['👑', ''], ['', '👑'], ['👑', '👑'],
  ['💀', '💀'], ['💀', ''], ['⚡', '⚡'], ['', '😈'], ['😈', ''], ['🎯', ''],
  ['', '🎯'], ['💎', ''], ['', '💎'], ['🔫', ''], ['', '🔫'], ['🏆', ''],
  ['⭐', '⭐'], ['', '⭐'], ['🎮', ''], ['', '🎮'], ['😎', ''], ['', '😎'],
  ['👻', ''], ['💣', '']
];

export const TAGS_L = ['ᴾᴿᴼ', 'ᴼᴾ᭄', 'ᴹᴿ.', 'ᴳᵒᵈ', 'Sᴋ᭄', 'ᴵᴺᴰ᭄', 'ᴷᴵᴺᴳ', 'ᴮᴰ', 'ꜰꜰ', 'xX', 'ᴅᴀʀᴋ', 'ᴘʀᴏ', 'ɴɢ'];
export const TAGS_R = ['ᴮᴼˢˢ', 'ᴷᴵᴺᴳ', 'ᵀᴹ', 'ᴼᴾ', 'ᴮᴰ', 'ʏᴛ', 'ɢᴀᴍɪɴɢ', 'ᴘʀᴏ', 'ꜰꜰ', 'ᴏꜰᴄ', 'ʜᴅ', 'ᵍᵃᵐᵉʳ', '⁰⁷', '⁴⁷', '⁹⁹', '⁶⁹', 'ˣᵈ'];

export const WORDS_DICT: Record<string, string[]> = {
  dark: ['Dark', 'Killer', 'Shadow', 'Ghost', 'Venom', 'Reaper', 'Demon', 'Savage', 'Toxic', 'Phantom', 'Death', 'Night', 'Blood', 'Skull', 'Hunter', 'Ninja', 'Devil', 'Joker', 'Grim', 'Raven', 'Viper', 'Doom', 'Evil', 'Black', 'Storm', 'Fury', 'Hades'],
  king: ['King', 'Boss', 'Alpha', 'Lord', 'Titan', 'Legend', 'Master', 'Chief', 'Prince', 'Sultan', 'Don', 'Ruler', 'Champ', 'Royal', 'Sigma', 'Mafia', 'Captain'],
  cool: ['Cool', 'Swag', 'Ice', 'Fire', 'Flame', 'Frost', 'Blaze', 'Neon', 'Turbo', 'Nitro', 'Zero', 'Rapid', 'Flash', 'Ultra', 'Mega', 'Hyper', 'Cyber', 'Pixel', 'Jet', 'Rocket', 'Thunder', 'Comet', 'Galaxy', 'Rogue', 'Sky'],
  bd: ['Bangla', 'Tiger', 'BD', 'Dhaka', 'Padma', 'Rajib', 'Shakib', 'Rakib', 'Sakib', 'Tamim', 'Rifat', 'Sohan', 'Rohan', 'Fahim', 'Nayem', 'Arif', 'Imran', 'Hridoy', 'Tanvir', 'Mehedi', 'Rubel', 'Sabbir', 'Emon', 'Shuvo', 'Pagla', 'Chotu', 'Bhai', 'Dada', 'Raja', 'Nawab', 'Khan'],
  pro: ['Pro', 'Aim', 'Headshot', 'Sniper', 'Sharp', 'Elite', 'Ace', 'Clutch', 'Rush', 'Sweat', 'Heroic', 'Squad', 'Deadeye', 'Bullet', 'Target', 'Gamer', 'Op', 'Noob', 'Striker', 'Raider'],
  love: ['Love', 'Heart', 'Romeo', 'Juliet', 'Cupid', 'Kiss', 'Darling', 'Soulmate', 'Sweet', 'Crush', 'Angel', 'Rose', 'Forever', 'Jaan', 'Bae', 'Babe', 'Lover', 'Valentine', 'Adore', 'Amour', 'Beloved', 'Dil', 'Priyo', 'Mayabi', 'Sona', 'Honey'],
  cute: ['Cutie', 'Baby', 'Bunny', 'Panda', 'Kitty', 'Choco', 'Candy', 'Sweety', 'Honey', 'Cookie', 'Mango', 'Peach', 'Muffin', 'Teddy', 'Nugget', 'Pookie', 'Simba', 'Mimi', 'Jelly', 'Pixie', 'Fluffy']
};

export const SUFFIXES = ['YT', 'FF', 'OP', 'X', 'Z', 'BD', 'Pro', 'God', 'HD', '47', '07', '99', '69', '786', '420', '1', '2', '7', '11', '24', '100', 'XD', 'TV', 'Max'];
export const ALL_WORDS = [...new Set(Object.values(WORDS_DICT).flat())];

export const SAFE_CHARS = new Set(
  A('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.-* ')
    .concat(A(smallcaps), A('『』【】「」ツッシ★☆•㉿'),
      A('꧁꧂༒☬༺༻亗彡メミ乂么乡♛♚᭄࿐༆〆々燃◥◤❖✪✦✿༄░▒▓⊰⊱'),
      A('ᴾᴿᴼᴹᴳᵒᵈᴮᴰᴷᴵᴺᵀˢᴴᴱᴬᴸᵃᵇᶜᵉᶠᵍʰⁱʲᵏˡᵐⁿᵖʳᵗᵘᵛʷˣʸᶻᶦᶰ⁰¹²³⁴⁵⁶⁷⁸⁹'))
);

export const isEmoji = (c: number) =>
  (c >= 0x1F300 && c <= 0x1FAFF) || c === 0x26A1 || c === 0x2B50 || c === 0x2728 || c === 0x2705 || c === 0x274C;

export function blockedAlways(c: number) {
  return c < 32 || c === 0xFE0F || c === 0x200D || c === 0x200B || (c >= 0x0300 && c <= 0x036F);
}

export function charStatus(ch: string): 'safe' | 'emoji' | 'bad' | 'extra' {
  const c = ch.codePointAt(0) || 0;
  if (blockedAlways(c)) return 'bad';
  if (isEmoji(c)) return 'emoji';
  if (SAFE_CHARS.has(ch)) return 'safe';
  return 'extra';
}

export function calcNameLen(s: string): number {
  return A(s).reduce((n, ch) => n + ((ch.codePointAt(0) || 0) > 127 ? 1 : 1), 0);
}

export function isNameAllowed(s: string, max = 12): boolean {
  if (calcNameLen(s) > max) return false;
  for (const ch of A(s)) {
    const x = charStatus(ch);
    if (x === 'bad') return false;
  }
  return true;
}

export const shuf = <T>(a: T[]): T[] =>
  a.map(x => [Math.random(), x] as [number, T]).sort((p, q) => p[0] - q[0]).map(p => p[1]);

export const SYMBOLS_GROUPS: { title: string; symbols: string[]; folded?: boolean }[] = [
  {
    title: 'Classic Free Fire',
    symbols: ['꧁', '꧂', '༒', '☬', '༺', '༻', '亗', '彡', 'メ', '乂', '么', '乡', '᭄', '࿐', '༆', '〆', '々', '燃', '◥', '◤', '⊰', '⊱', '░', '▒', '▓']
  },
  {
    title: 'Brackets & Frames',
    symbols: ['『', '』', '【', '】', '「', '」', '《', '》', '«', '»', '⟦', '⟧', '〔', '〕', '⟨', '⟩']
  },
  {
    title: 'Icons & Badges',
    symbols: ['ⓥ', 'Ⓥ', '®', '©', '™', '☯', '☂', 'ᯤ', '⚜', '♜', '♞', '☾', '☽', '⌖', '⍟', '⚔', '☠', '♥', '❤', '♡', '❀', '✰', '✯', 'ʚ', 'ɞ']
  },
  {
    title: 'Crowns & Stars',
    symbols: ['♛', '♚', '♕', '♔', '★', '☆', '✦', '✧', '✿', '❖', '✪', '❥', '↯', 'ꕥ', 'ꨄ', '۝', '〠', '•', '·', '◈', '◆']
  },
  {
    title: 'Weapon & Gun Art',
    symbols: ['▄︻┻┳═一', '▄︻┳︼一一一', '︻デ═一', '╾━╤デ╦︻', '( ͡° ͜ʖ ͡°)', '(¬_¬)', '×͜×', 'ʕ•ᴥ•ʔ', '╰☆╮', '︻╦̵̵͇̿̿̿̿══╤─', '︻╦╤─', '╾━╤デ╦']
  },
  {
    title: 'CJK & Kanji',
    symbols: ['ツ', 'シ', 'ッ', 'ミ', '卍', '忍', '魂', '神', '王', '龍', '火', '米', '么', '気', '雷', '鬼', '影', '桜']
  },
  {
    title: 'Small Caps Alphabets',
    symbols: A(smallcaps)
  },
  {
    title: 'Superscript Tags',
    symbols: ['ᵀᴹ', 'ᴼᴾ', 'ᴮᴰ', 'ᶠᶠ', 'ᴾᴿᴼ', 'ᴷᴵᴺᴳ', '⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹']
  },
  {
    title: 'Stars, Flowers & Hearts',
    symbols: ['✦', '✧', '★', '☆', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '✲', '✳', '✴', '✵', '✶', '✷', '✸', '✹', '✺', '✻', '✼', '✽', '✾', '✿', '❀', '❁', '❂', '❃', '❄', '❅', '❆', '❇', '❈', '❉', '❊', '❋', '❤', '❥', '❣', '❦', '❧']
  },
  {
    title: 'Arrows & Pointers',
    symbols: ['➔', '➘', '➙', '➚', '➛', '➜', '➝', '➞', '➟', '➠', '➡', '➢', '➣', '➤', '➥', '➦', '➧', '➨', '➩', '➪', '➫', '➬', '➭', '➮', '➯', '➱', '➲', '➳', '➴', '➵', '➶', '➷', '➸', '➹', '➺', '➻', '➼', '➽']
  },
  {
    title: 'Geometric Shapes & Blocks',
    symbols: ['■', '□', '▢', '▣', '▤', '▥', '▦', '▧', '▨', '▩', '▪', '▫', '▬', '▭', '▮', '▯', '▰', '▱', '▲', '△', '▴', '▵', '▶', '▷', '▸', '▹', '►', '▻', '▼', '▽', '▾', '▿', '◀', '◁', '◂', '◃', '◄', '◅', '◆', '◇', '◈', '◉', '◊', '○', '◌', '◍', '◎', '●', '◐', '◑', '◒', '◓', '◔', '◕', '◖', '◗']
  },
  {
    title: 'Emoji & Flames (Popular FF)',
    symbols: ['⚡', '⭐', '✨', '🔥', '💀', '👑', '😈', '🎯', '💎', '🔫', '🏆', '🎮', '💣', '😎', '👻', '🦅', '🐯', '🌙', '🗡️', '🛡️', '⚔️']
  }
];
