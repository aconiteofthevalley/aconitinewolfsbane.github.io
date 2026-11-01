// =====================================================
// script.js: builds and runs the whole Aconite website
// Sections: 1 Settings  2 Your info  3 State  4 Local accounts
//           5 Screens   6 Actions    7 Start
// =====================================================


// ---------- 1. SETTINGS (edit these) ----------

// The developer account: whoever logs in with this USERNAME sees the site's own
// homepage ("Hi, I'm Aconite"). CHANGE THIS, then sign up with it first.
const DEVELOPER_USERNAME = "aconite";
// Only used for old accounts that were made with an email: that account is asked to
// switch to DEVELOPER_USERNAME the next time it logs in.
const DEVELOPER_EMAIL = "aconiteofthevalley@gmail.com";

// Your pictures
const LOGO_SRC = "cake.png";
const PROFILE_SRC = "5a45455dee8a1c68c98b18d9f7f3ee56.png";


// ---------- 2. YOUR INFO (change the words here) ----------

const SITE_NAME = "Aconite";
const INITIALS = "AC";
const TABS = ["HOME", "FRIENDS", "MEDIA", "PROJECTS", "EMOTIONS", "MOOD", "FISH", "TOMODACHI"];
const TAB_LABELS = { EMOTIONS: "Emotion bubbles", MOOD: "Mood tracker", FISH: "Draw a Fish", TOMODACHI: "Tomodachi" };   // menu names that aren't just the tab name
function tabLabel(tab) {
  return TAB_LABELS[tab] || tab.charAt(0) + tab.slice(1).toLowerCase();
}

const TYPING_PHRASES = ["Student", "Creative Thinker", "Future Developer", "Lifelong Learner"];

const WELCOME_TEXT =
  "Welcome to my personal website! This is where I share who I am, what I'm learning, and the things I've built.";

// What visitors (everyone except the developer) see on their homepage by default.
// These are fixed: visitors can edit their name, picture and bio, but not these.
const VISITOR_GREETING = "Welcome,";
const VISITOR_WELCOME = "Glad you're here! Make yourself at home, and have fun exploring.";

// The only icons anyone can pick for an interest: cat kaomojis
const CAT_ICONS = [
  "=^･ω･^=", "(=^･^=)", "ฅ^•ﻌ•^ฅ", "(=ↀωↀ=)", "(=｀ω´=)", "(=^‥^=)",
  "ฅ(•ㅅ•❀)ฅ", "(=ＴェＴ=)", "(=✪ᆺ✪=)", "≽^•⩊•^≼", "(^･ω･^ )", "(=^-ω-^=)"
];
function iconOrDefault(icon) {
  return CAT_ICONS.includes(icon) ? icon : CAT_ICONS[0];
}

// The icons for projects: fruit emojis
const FRUIT_ICONS = [
  "🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍒", "🍑", "🍍", "🥝", "🥭", "🍐"
];
// A project's icon; projects saved before icons existed get one by their position
function fruitFor(project, index) {
  return FRUIT_ICONS.includes(project.icon) ? project.icon : FRUIT_ICONS[(index || 0) % FRUIT_ICONS.length];
}

// The built-in interests. `key` names each one's checklist, `verb` is the word
// used when you tick something off ("3 of 7 watched").
const MEDIA_INTRO = "A quick guide to the stories I love and where each one comes from.";
const MEDIA = [
  { key: "anime",  verb: "watched",  icon: CAT_ICONS[0], title: "Anime",  text: "Animation from Japan, made for TV, streaming, and film. Many anime are adapted from manga or light novels." },
  { key: "manga",  verb: "read",     icon: CAT_ICONS[3], title: "Manga",  text: "Japanese comics, usually black and white and read right to left, published in magazines and collected volumes." },
  { key: "manhwa", verb: "read",     icon: CAT_ICONS[2], title: "Manhwa", text: "Korean comics, often full color and made for vertical scrolling on phones (webtoons). Read top to bottom." },
  { key: "manhua", verb: "read",     icon: CAT_ICONS[5], title: "Manhua", text: "Chinese comics, often full color and vertical scroll. Chinese animation is called donghua." },
  { key: "danmei", verb: "finished", icon: CAT_ICONS[4], title: "Danmei", text: "A Chinese genre of romance between men, usually told in web novels. Popular ones get adapted into manhua, donghua, and live-action dramas." }
];


// PICTURE ICONS for the built-in interest cards.
// Put your PNG files in a folder next to index.html (for example an "icons" folder) and type
// each file's path between the quotes, like:  anime: "icons/anime.png"
// Leave one as "" to keep its cat face for now.
const MEDIA_ICON_PNGS = {
  anime:  "7faf2afeb569ad067d8e94546e2d7e29-removebg-preview.png",
  manga:  "074a782459cb3c5831b260f90db92b04-removebg-preview.png",
  manhwa: "191e96856bae6535a11bcea65b5e1df0-removebg-preview.png",
  manhua: "014f9e075d5239a3a5c428b872324b30-removebg-preview.png",
  danmei: "89e7be02513f8bb4148378a0cf15e4b9-removebg-preview.png"
};

// The titles every account starts with in each checklist (change them freely).
// Everyone can add their own titles or remove these; ticks are saved per account.
const STARTER_LISTS = {
  anime:  ["Fullmetal Alchemist: Brotherhood", "Attack on Titan", "Demon Slayer", "Death Note", "Cowboy Bebop", "Your Name", "Spirited Away"],
  manga:  ["One Piece", "Berserk", "Vagabond", "Fruits Basket", "Vinland Saga", "Chainsaw Man", "Fullmetal Alchemist"],
  manhwa: ["Solo Leveling", "Tower of God", "Noblesse", "Lookism", "The God of High School", "Omniscient Reader's Viewpoint", "True Beauty"],
  manhua: ["Battle Through the Heavens", "Soul Land", "Tales of Demons and Gods", "The King's Avatar", "Martial Peak"],
  danmei: ["Heaven Official's Blessing", "Grandmaster of Demonic Cultivation", "Scum Villain's Self-Saving System", "Guardian", "Word of Honor", "The Husky and His White Cat Shizun"]
};


// ---------- 3. STATE ----------

let state = {
  view: "loading",              // "loading", "login", "signup", "pickname", "delete" or "app"
  activeTab: loadTab(),         // "HOME", "MEDIA" or "PROJECTS"
  user: null,                   // the logged-in user: { name, username, bio, avatar, projects, interests, lists, isDeveloper }
  menuOpen: false,              // is the logo dropdown open?
  editingHome: false,           // is a visitor editing their profile?
  editingProject: null,         // null, "new", or the id of the project being edited
  editingInterest: null,        // null, "new", or the id of the interest being edited
  chatMenu: false,              // is the (¡) menu in the open chat showing?
  friendOptions: null,          // username of the friend whose remove (✕) button is showing
  viewProfile: null,             // username of the person whose profile page is open (null = normal Friends page)
  listPage: null,               // full-list page that is open: "suggested", "friends", "pick" (null = normal Friends page)
  menuJustOpened: false,        // true only for the render that opens the menu (so it slides out once)
  bellOpen: false,              // developer only: is the notification bell panel open?
  bellSeenBefore: 0,            // developer only: what counted as "already seen" when the panel was opened
  chatWith: null,               // username of the friend whose chat is open
  openList: null,               // key of the interest whose checklist is open (null = card grid)
  fishSchool: false,            // showing the School of fishes instead of the drawing board?
  zooOpen: false,               // showing the Zoo instead of the animal builder?
  moodMonth: null,              // mood tracker: the month on screen, { y, m } (null = this month)
  moodView: "monthly",          // mood tracker: "monthly" or "yearly"
  moodDay: null,                // mood tracker: the day (YYYY-MM-DD) whose box is open
  moodDraft: null,              // mood tracker: { emotion, note } being edited in that box
  catDraft: null,               // the cat being built on the Tomodachi page (null = the saved one)
  theme: loadTheme(),           // "light" or "dark"
  errorMsg: "",
  successMsg: ""
};

function loadTheme() {
  try { return localStorage.getItem("theme") || "light"; } catch (e) { return "light"; }
}
function loadTab() {
  try {
    const t = sessionStorage.getItem("aconite_tab");
    return TABS.includes(t) ? t : "HOME";
  } catch (e) { return "HOME"; }
}

// Escape typed text before putting it into HTML
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// A short random id for projects, interests and checklist titles
function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}


// ---------- 4. LOCAL ACCOUNTS (no server) ----------
// Accounts are saved in this browser's localStorage, so they only exist on
// this device/browser. Passwords are never saved as plain text: each one is
// salted and hashed first.

const USERS_KEY = "aconite_users";      // all accounts: { username: { name, salt, hash, created } }
const RETIRED_KEY = "aconite_retired";  // usernames of deleted accounts: nobody can ever use them again
const SESSION_KEY = "aconite_session";  // username of the logged-in user

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch (e) { return {}; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function bytesToHex(bytes) {
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}
function makeSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

// Salted hash of a password (PBKDF2 when available, simple fallback otherwise)
async function hashPassword(password, salt) {
  const enc = new TextEncoder();
  if (window.crypto && crypto.subtle) {
    const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" }, key, 256);
    return bytesToHex(new Uint8Array(bits));
  }
  let h = 5381;
  const text = salt + password;
  for (let i = 0; i < text.length; i++) h = ((h * 33) ^ text.charCodeAt(i)) >>> 0;
  return "fb" + h.toString(16);
}

// The developer is whoever has the developer username (or the old developer email)
function isDevKey(key) {
  key = String(key || "").toLowerCase();
  return key === DEVELOPER_USERNAME.toLowerCase() || key === DEVELOPER_EMAIL.toLowerCase();
}
// Accounts made before usernames existed are saved under an email address
function isLegacyKey(key) { return String(key).includes("@"); }

// Turn a saved account into the user object the site uses
function userFromAccount(username, account) {
  return {
    name: account.name || "",
    username: username,
    bio: account.bio || "",
    avatar: account.avatar || "",
    projects: Array.isArray(account.projects) ? account.projects : [],
    interests: Array.isArray(account.interests) ? account.interests : [],
    lists: account.lists && typeof account.lists === "object" ? account.lists : {},
    cat: account.cat && typeof account.cat === "object" ? account.cat : null,
    moods: account.moods && typeof account.moods === "object" ? account.moods : {},
    legacy: isLegacyKey(username),
    isDeveloper: isDevKey(username)
  };
}

const USERNAME_RULE = /^[a-z0-9_]{3,20}$/;
// "  @Jane_Doe " -> "jane_doe"
function cleanUsername(raw) {
  return String(raw || "").trim().replace(/^@+/, "").toLowerCase();
}
function checkUsernameFormat(username) {
  if (!USERNAME_RULE.test(username)) {
    throw new Error("Usernames are 3 to 20 letters, numbers or underscores (no spaces).");
  }
}

function loadRetired() {
  try { const l = JSON.parse(localStorage.getItem(RETIRED_KEY)); return Array.isArray(l) ? l.filter(x => typeof x === "string") : []; }
  catch (e) { return []; }
}
// The developer username is the one exception, so the developer can always come back
function isRetired(username) { return !isDevKey(username) && loadRetired().includes(username); }
function retireUsername(username) {
  if (isLegacyKey(username) || isDevKey(username)) return;
  try {
    const list = loadRetired();
    if (!list.includes(username)) list.push(username);
    localStorage.setItem(RETIRED_KEY, JSON.stringify(list));
  } catch (e) {}
}
const RETIRED_MSG = "That username belonged to someone before and can't be used again. Try another one.";

// Create an account and return it. Throws Error with a friendly message.
async function createAccount(name, username, password) {
  username = cleanUsername(username);
  checkUsernameFormat(username);
  if (!name) throw new Error("Please enter a display name.");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");
  const users = loadUsers();
  if (users[username]) throw new Error("That username is taken. Try another one.");
  if (isRetired(username)) throw new Error(RETIRED_MSG);
  const salt = makeSalt();
  users[username] = { name: name, salt: salt, hash: await hashPassword(password, salt), created: Date.now() };
  try { saveUsers(users); }
  catch (e) { throw new Error("Couldn't save your account. Is browser storage turned off?"); }
  return userFromAccount(username, users[username]);
}

// Check username + password and return the user. Throws Error with a friendly message.
// (An old account can still type its email here once, to move over to a username.)
async function checkLogin(username, password) {
  let key = cleanUsername(username);
  const users = loadUsers();
  const devEmail = DEVELOPER_EMAIL.toLowerCase();
  // The developer logs in as "aconite" with her existing password; her old email account is converted on login
  if (!users[key] && key === DEVELOPER_USERNAME.toLowerCase() && users[devEmail]) key = devEmail;
  const account = users[key];
  if (!account) throw new Error("Wrong username or password.");
  if ((await hashPassword(password, account.salt)) !== account.hash) {
    throw new Error("Wrong username or password.");
  }
  return userFromAccount(key, account);
}

// Move an old email-based account to a username. Everything that pointed at the old
// name (friends, chats, fish, zoo animal, login) is updated to the new one.
function renameAccount(oldKey, newName) {
  newName = isDevKey(oldKey) ? DEVELOPER_USERNAME.toLowerCase() : cleanUsername(newName);
  checkUsernameFormat(newName);
  const users = loadUsers();
  if (!users[oldKey]) throw new Error("Couldn't find your account.");
  if (users[newName]) throw new Error("That username is taken. Try another one.");
  if (isRetired(newName)) throw new Error(RETIRED_MSG);
  const swap = k => k === oldKey ? newName : k;

  users[newName] = users[oldKey];
  delete users[oldKey];
  Object.keys(users).forEach(k => {          // nicknames and blocks that point at the old name
    const a = users[k];
    if (Array.isArray(a.blocked)) a.blocked = a.blocked.map(swap);
    if (a.nicks && typeof a.nicks === "object" && oldKey in a.nicks) { a.nicks[newName] = a.nicks[oldKey]; delete a.nicks[oldKey]; }
    if (a.seen && typeof a.seen === "object" && oldKey in a.seen) { a.seen[newName] = a.seen[oldKey]; delete a.seen[oldKey]; }
  });

  const social = loadSocial(), nextSocial = {};
  Object.keys(social).forEach(k => {
    const r = socialOf(social, k);
    nextSocial[swap(k)] = { friends: r.friends.map(swap), incoming: r.incoming.map(swap), outgoing: r.outgoing.map(swap) };
  });

  const chats = loadChats(), nextChats = {};
  Object.keys(chats).forEach(k => {
    const parts = k.split("\n").map(swap);
    const list = Array.isArray(chats[k]) ? chats[k].map(m => m && m.from === oldKey ? Object.assign({}, m, { from: newName }) : m) : chats[k];
    nextChats[parts.length === 2 ? chatKey(parts[0], parts[1]) : k] = list;
  });

  try {
    saveUsers(users);
    saveSocial(nextSocial);
    saveChats(nextChats);
    saveReports(loadReports().map(r => Object.assign({}, r, { from: swap(r.from), about: swap(r.about) })));
    saveFish(loadFish().map(f => f.owner === oldKey ? Object.assign({}, f, { owner: newName }) : f));
    saveZoo(loadZoo().map(z => z.owner === oldKey ? Object.assign({}, z, { owner: newName, id: "pet-" + newName }) : z));
    localStorage.setItem(SESSION_KEY, newName);
  } catch (e) { throw new Error("Couldn't save. Is browser storage turned off or full?"); }
  return userFromAccount(newName, users[newName]);
}

function startSession(user) {
  let notice = "";
  if (user.legacy && user.isDeveloper) {      // the developer's old email account becomes @aconite by itself
    try { user = renameAccount(user.username, DEVELOPER_USERNAME); }
    catch (e) { notice = e.message; }         // (if that fails, the username screen explains why)
  }
  try { localStorage.setItem(SESSION_KEY, user.username); } catch (e) {}
  state.user = user;
  state.catDraft = null;
  state.chatWith = null;
  resetDrawing();
  state.view = user.legacy ? "pickname" : "app";   // old email accounts choose a username first
  state.errorMsg = notice;
  state.successMsg = "";
  state.menuOpen = false;
}

function endSession() {
  state.bellOpen = false;
  state.viewProfile = null;
  state.listPage = null;
  state.fishSchool = false;
  state.zooOpen = false;
  state.editingHome = false;
  state.editingProject = null;
  state.editingInterest = null;
  state.openList = null;
  try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  state.user = null;
  state.catDraft = null;
  state.chatWith = null;
  resetDrawing();
  state.view = "login";
  state.menuOpen = false;
}

// Who was logged in last time? (null if nobody)
function restoreSession() {
  try {
    const key = localStorage.getItem(SESSION_KEY);
    const account = key && loadUsers()[key];
    return account ? userFromAccount(key, account) : null;
  } catch (e) { return null; }
}


// ----- Pixel sun and moon (the light / dark switch) -----
// Each picture is a 9 x 9 grid: "#" is the main color, "r" the accent color, "." is empty.
const PIXEL_SUN = [
  "....r....",
  ".r..r..r.",
  "...###...",
  "..#####..",
  "rr#####rr",
  "..#####..",
  "...###...",
  ".r..r..r.",
  "....r...."
];
const PIXEL_MOON = [
  "...####..",
  "..###..r.",
  ".###.....",
  ".###.....",
  ".###.....",
  ".###.....",
  "..###..r.",
  "...######",
  "....####."
];
function pixelArt(grid, main, accent, px) {
  let rects = "";
  grid.forEach((row, y) => Array.from(row).forEach((c, x) => {
    if (c === "#" || c === "r") rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${c === "#" ? main : accent}"/>`;
  }));
  return `<svg viewBox="0 0 9 9" width="${px}" height="${px}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}
const SUN_SVG  = px => pixelArt(PIXEL_SUN,  "#ffc83d", "#f08a24", px);
const MOON_SVG = px => pixelArt(PIXEL_MOON, "#f9e7c7", "#d6e9ed", px);

// ---------- 5. SCREENS ----------

// keepScroll = true keeps the page where it was (used when ticking checklist items)
function render(keepScroll) {
  const oldMain = document.querySelector("#app main");
  const scrollTop = keepScroll && oldMain ? oldMain.scrollTop : 0;

  document.body.classList.toggle("dark", state.theme === "dark");
  stopTyping();
  stashFishDraft();      // keep an unfinished drawing safe while the page is redrawn

  let content = "";
  if (state.view === "loading") content = `<div class="center-note">Loading...</div>`;
  else if (state.view === "login") content = renderLoginView();
  else if (state.view === "signup") content = renderSignupView();
  else if (state.view === "delete") content = renderDeleteView();
  else if (state.view === "pickname") content = renderPickNameView();
  else content = renderAppView();   // only reachable when logged in

  document.getElementById("app").innerHTML = `
    ${renderNav()}
    <main class="${isScrollablePage() ? "scrollable" : ""}">${content}</main>
    <footer>© ${new Date().getFullYear()} ${SITE_NAME}. Built with HTML, CSS &amp; JavaScript.</footer>
  `;

  positionDropdown();
  state.menuJustOpened = false;

  if (keepScroll) {
    const newMain = document.querySelector("#app main");
    if (newMain) newMain.scrollTop = scrollTop;
  }

  if (state.view === "app" && state.activeTab === "HOME") startTyping();
  if (state.view === "app" && state.activeTab === "EMOTIONS") startBubbles();
  if (state.view === "app" && state.activeTab === "FISH") {
    setupFishCanvas();     // does nothing while the tank is full-size (no drawing board)
    startSchool();
  }
  if (state.view === "app" && state.activeTab === "TOMODACHI" && state.zooOpen) startZoo();
  if (state.view === "app" && state.activeTab === "FRIENDS") scrollChatToEnd();
  sizeMediaCards();
  updateUnreadBadges();
}

// Every Media card gets exactly the height of the Manga card, whatever its text length.
// Longer text scrolls inside its own card instead of making the card bigger.
let mediaSizer = null;
function sizeMediaCards() {
  if (mediaSizer) { mediaSizer.disconnect(); mediaSizer = null; }
  if (!(state.view === "app" && state.activeTab === "MEDIA" && !state.openList)) return;
  const ref = document.querySelector('.media-grid .card[data-key="manga"]');
  if (!ref) return;
  const apply = () => {
    const h = ref.offsetHeight;
    if (!h) return;
    document.querySelectorAll(".media-grid .card").forEach(c => {
      if (c !== ref) c.style.height = h + "px";
    });
  };
  apply();
  if (window.ResizeObserver) { mediaSizer = new ResizeObserver(apply); mediaSizer.observe(ref); }
  else window.addEventListener("resize", apply);
}

// The menu hangs from the bottom of the header, flush with the left edge of the screen,
// in the header's own color, so it looks like part of the header sliding out (not floating).
function positionDropdown() {
  const dd = document.querySelector("nav .dropdown");
  const nav = document.querySelector("nav");
  if (!dd || !nav) return;
  const bottom = nav.getBoundingClientRect().bottom;
  dd.style.top = Math.max(0, Math.round(bottom)) + "px";
  dd.style.height = "calc(100vh - " + Math.round(bottom) + "px)";
  dd.style.height = "calc(100dvh - " + Math.round(bottom) + "px)";   // phones: ignores the browser bar (ignored where unsupported)
  const bg = getComputedStyle(nav).backgroundColor;
  if (bg && bg !== "transparent" && !/rgba\(.*,\s*0\)$/.test(bg)) dd.style.background = bg;
}
window.addEventListener("resize", () => { if (state.menuOpen) positionDropdown(); });

// One row holds 5 cards. A page only scrolls once there is a 6th card (a second row),
// or when something taller than the screen is open (a form, or a checklist).
const CARDS_PER_ROW = 5;
function isScrollablePage() {
  if (state.view !== "app") return false;
  const narrow = window.innerWidth < 900;   // on small screens the cards wrap, so allow scrolling
  if (state.activeTab === "MEDIA") {
    if (state.openList || state.editingInterest) return true;
    return narrow || allInterests().length > CARDS_PER_ROW;
  }
  if (state.activeTab === "PROJECTS") {
    if (state.editingProject) return true;
    const count = (state.user && state.user.projects || []).length;
    return narrow || count > CARDS_PER_ROW;
  }
  if (state.activeTab === "MOOD") return true;   // the calendar can be taller than a small screen
  return false;   // home (including edit profile) never scrolls
}

// ----- Developer notifications (the bell) -----
// Every visitor action that matters is written to this log; only the developer sees it (the bell in the top bar).
const ACTIVITY_KEY = "aconite_activity";
const ACTIVITY_SEEN_KEY = "aconite_activity_seen";   // when the developer last opened the bell
const ACTIVITY_MAX = 50;                              // the log keeps the newest 50 events
// Pixel-art icons for the notifications (9x9 grids, each letter is a color)
const PIXEL_PALETTE = { k: "#8a6a5f", w: "#ffffff", p: "#f28ab2", y: "#f7c948", o: "#f59a3d", r: "#e5604d",
                        g: "#8cc152", b: "#6aa9e9", l: "#c7b3ea", c: "#fdebd3" };
const PIXEL_ICONS = {
  "join": [
    "....y....",
    "...yyy...",
    "yyyyyyyyy",
    ".ykyyyky.",
    "..pyyyp..",
    "..yyyyy..",
    ".yyy.yyy.",
    ".yy...yy.",
    "........."
  ],
  "login": [
    "..yyyyy..",
    ".yyyyyyy.",
    "yyyyyyyyy",
    "yykyyykyy",
    "ypyyyyypy",
    "yykyyykyy",
    "yyykkkyyy",
    ".yyyyyyy.",
    "..yyyyy.."
  ],
  "delete": [
    "...kkk...",
    "kkkkkkkkk",
    ".klllllk.",
    ".klklklk.",
    ".klklklk.",
    ".klklklk.",
    ".klllllk.",
    "..kkkkk..",
    "........."
  ],
  "fish": [
    ".........",
    "..bbbb...",
    ".bbbbbb.b",
    "bbkbbbbbb",
    "bpbbbbbbb",
    ".bbbbbb.b",
    "..bbbb...",
    ".........",
    "........."
  ],
  "project": [
    ".....gg..",
    "....k.g..",
    "..rr.rr..",
    ".rrrrrrr.",
    "rrwrrrrrr",
    "rrrrrrrrr",
    ".rrrrrrr.",
    "..rr.rr..",
    "........."
  ],
  "interest": [
    "oo.....oo",
    "opo...opo",
    "ooooooooo",
    "ookoookoo",
    "oooopoooo",
    "ooooooooo",
    ".ooooooo.",
    "..ooooo..",
    "........."
  ],
  "profile": [
    "......kk.",
    ".....kppk",
    "....kyyk.",
    "...kyyk..",
    "..kyyk...",
    ".kyyk....",
    ".kck.....",
    "kk.......",
    "........."
  ],
  "message": [
    ".........",
    ".kkkkkkk.",
    "kpppppppk",
    "kpkpkpkpk",
    "kpppppppk",
    ".kkkkkkk.",
    "..kk.....",
    "...k.....",
    "........."
  ],
  "friend": [
    ".rr...rr.",
    "rrrr.rrrr",
    "rwrrrrrrr",
    "rrrrrrrrr",
    ".rrrrrrr.",
    "..rrrrr..",
    "...rrr...",
    "....r....",
    "........."
  ],
  "report": [
    ".k.......",
    ".krrrrr..",
    ".krrrrrr.",
    ".krrrrr..",
    ".k.......",
    ".k.......",
    ".k.......",
    ".k.......",
    "kkk......"
  ]
};
function pixelIcon(type, px) {
  const grid = PIXEL_ICONS[type] || PIXEL_ICONS.join;
  let rects = "";
  grid.forEach((row, y) => Array.from(row).forEach((c, x) => {
    if (PIXEL_PALETTE[c]) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${PIXEL_PALETTE[c]}"/>`;
  }));
  return `<svg viewBox="0 0 9 9" width="${px}" height="${px}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

function loadActivity() {
  try { const a = JSON.parse(localStorage.getItem(ACTIVITY_KEY)); return Array.isArray(a) ? a : []; } catch (e) { return []; }
}
// user = the visitor's username, text = what they did. The developer's own actions are never logged.
function logActivity(type, text, user) {
  try {
    if (!user || isDevKey(user)) return;
    const list = loadActivity();
    // a chat of many messages is one notification, not one per message
    if (type === "message" && list[0] && list[0].type === "message" && list[0].user === user && Date.now() - list[0].time < 10 * 60 * 1000) return;
    list.unshift({ id: newId(), type: type, user: user, text: String(text).slice(0, 200), time: Date.now() });
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(list.slice(0, ACTIVITY_MAX)));
  } catch (e) {}
}
function activitySeen() {
  try { return Number(localStorage.getItem(ACTIVITY_SEEN_KEY)) || 0; } catch (e) { return 0; }
}
function timeAgo(t) {
  const sec = Math.max(0, Math.round((Date.now() - t) / 1000));
  if (sec < 60) return "just now";
  if (sec < 3600) return Math.round(sec / 60) + " min ago";
  if (sec < 86400) return Math.round(sec / 3600) + " h ago";
  try { return new Date(t).toLocaleDateString(); } catch (e) { return ""; }
}
function BELL_SVG(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>`;
}
function bellHtml() {
  const events = loadActivity();
  const seen = activitySeen();
  const fresh = events.filter(e => e.time > seen).length;
  return `
    <span class="bell-wrap" id="bellWrap">
      <button class="bell-btn" onclick="toggleBell(event)" aria-label="Notifications${fresh ? ", " + fresh + " new" : ""}" aria-expanded="${state.bellOpen}" title="Notifications">${BELL_SVG(30)}</button>
      <span class="unread-badge bell-badge" style="display:${fresh && !state.bellOpen ? "inline-flex" : "none"}">${fresh > 99 ? "99+" : fresh}</span>
      ${state.bellOpen ? `
        <div class="bell-panel" onclick="event.stopPropagation()">
          <div class="bell-head"><span>What's happening</span>${events.length ? `<button type="button" class="small link-btn" onclick="clearActivity()">Clear all</button>` : ""}</div>
          ${events.length ? events.slice(0, 30).map(e => `
            <div class="bell-item ${e.time > state.bellSeenBefore ? "new" : ""}">
              <span class="bell-icon">${pixelIcon(e.type, 18)}</span>
              <div><b>@${escapeHtml(e.user)}</b> ${escapeHtml(e.text)}<small>${escapeHtml(timeAgo(e.time))}</small></div>
            </div>`).join("") : `<p class="bell-empty">Nothing yet. When visitors sign up, log in, chat with you, draw fish or add things, it shows up here.</p>`}
        </div>` : ""}
    </span>`;
}
function toggleBell(event) {
  event.stopPropagation();
  state.menuOpen = false;
  state.bellOpen = !state.bellOpen;
  if (state.bellOpen) {
    state.bellSeenBefore = activitySeen();       // so the new ones stay highlighted while the panel is open
    try { localStorage.setItem(ACTIVITY_SEEN_KEY, String(Date.now())); } catch (e) {}
  }
  render(true);
}
function clearActivity() {
  try { localStorage.setItem(ACTIVITY_KEY, "[]"); } catch (e) {}
  render(true);
}
// Update just the bell when a visitor does something in another tab
function refreshBell() {
  const el = document.getElementById("bellWrap");
  if (el && state.user && state.user.isDeveloper) el.outerHTML = bellHtml();
}

// Top bar: cake logo (the only dropdown button), site name, login/logout, dark mode
function renderNav() {
  const loggedIn = ["app", "delete", "pickname"].includes(state.view) && state.user;
  const hasMenu = (state.view === "app" || state.view === "delete") && state.user;
  const unreadTotal = hasMenu ? totalUnread(state.user.username) : 0;
  const name = loggedIn ? (state.user.name || (state.user.legacy ? "you" : state.user.username)) : "";

  return `
    <nav>
      <div class="brand">
        ${hasMenu ? `<span class="menu-wrap"><button class="menu-btn" onclick="toggleMenu(event)" aria-label="Open menu${unreadTotal ? ", " + unreadTotal + " new messages" : ""}" aria-expanded="${state.menuOpen}"><span></span><span></span><span></span></button><span class="notif-dot" id="navNotif" style="display:${unreadTotal ? "flex" : "none"}">${unreadTotal > 99 ? "99+" : unreadTotal}</span></span>` : ""}
        <span class="logo-btn">
          <img src="${LOGO_SRC}" alt="" onerror="this.outerHTML='🎂'">
        </span>
        <span class="site-name">${SITE_NAME}</span>
        ${hasMenu && state.menuOpen ? `
          <div class="dropdown ${state.menuJustOpened ? "drop-in" : ""}">
            ${TABS.map(tab => `
              <a class="${state.activeTab === tab ? "active" : ""}" onclick="setActiveTab('${tab}')">
                ${tabLabel(tab)}${tab === "FRIENDS" && unreadTotal ? " " + unreadBadge(unreadTotal) : ""}
              </a>`).join("")}
            <a class="${state.view === "delete" ? "active" : ""}" onclick="switchView('delete')">Delete account</a>
          </div>` : ""}
      </div>
      <div class="nav-right">
        ${state.view === "app" && state.user && state.user.isDeveloper ? bellHtml() : ""}
        ${loggedIn
          ? `<button onclick="handleLogout()">Log out (${escapeHtml(name)})</button>`
          : `<button onclick="switchView('login')">Login / Sign up</button>`}
        <button class="theme-icon" onclick="toggleTheme()" aria-label="${state.theme === "dark" ? "Moon: switch to light mode" : "Sun: switch to dark mode"}" title="${state.theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}">${state.theme === "dark" ? MOON_SVG(32) : SUN_SVG(32)}</button>
      </div>
    </nav>
  `;
}

function messageBoxes() {
  return `
    ${state.errorMsg ? `<div class="msg error">${escapeHtml(state.errorMsg)}</div>` : ""}
    ${state.successMsg ? `<div class="msg success">${escapeHtml(state.successMsg)}</div>` : ""}
  `;
}

function renderLoginView() {
  return `
    <div class="auth-wrap">
      <div class="auth-card">
        <h2>Welcome <span class="accent">back</span></h2>
        <div class="subtitle">Log in to see ${SITE_NAME}'s website.</div>
        ${messageBoxes()}
        <form class="auth-form" onsubmit="handleLogin(event)">
          <input type="text" id="loginUsername" placeholder="Username" autocomplete="username" autocapitalize="none" spellcheck="false" required>
          <input type="password" id="loginPassword" placeholder="Password" required>
          <button type="submit">Login</button>
        </form>
        <p class="switch-line">Don't have an account?
          <button type="button" class="link-btn" onclick="switchView('signup')">Sign up</button>
        </p>
        <p class="note">Made your account with an email before? Type that email as the username once, and you'll be asked to pick a username.</p>
        <p class="note">Accounts are saved in this browser only. Your password is stored hashed, never as plain text.</p>
      </div>
    </div>
  `;
}

function renderSignupView() {
  return `
    <div class="auth-wrap">
      <div class="auth-card">
        <h2>Create an <span class="accent">account</span></h2>
        <div class="subtitle">Sign up to see ${SITE_NAME}'s website. No email needed, just pick a username.</div>
        ${messageBoxes()}
        <form class="auth-form" onsubmit="handleSignup(event)">
          <input type="text" id="signupUsername" placeholder="Username" maxlength="20" pattern="@?[A-Za-z0-9_]{3,20}" title="3 to 20 letters, numbers or underscores" autocomplete="username" autocapitalize="none" spellcheck="false" required>
          <input type="text" id="signupName" placeholder="Display name" maxlength="40" required>
          <input type="password" id="signupPassword" placeholder="Password (8+ characters)" minlength="8" required>
          <input type="password" id="signupConfirm" placeholder="Confirm password" minlength="8" required>
          <button type="submit">Sign up</button>
        </form>
        <p class="switch-line">Already have an account?
          <button type="button" class="link-btn" onclick="switchView('login')">Log in</button>
        </p>
        <p class="note">Accounts are saved in this browser only. Your password is stored hashed, never as plain text.</p>
      </div>
    </div>
  `;
}

function renderPickNameView() {
  const dev = isDevKey(state.user.username);
  return `
    <div class="auth-wrap">
      <div class="auth-card">
        <h2>Choose a <span class="accent">username</span></h2>
        <div class="subtitle">${SITE_NAME} now uses usernames instead of emails, so friends never see your email. ${dev ? "Your account uses the developer username." : "Pick one to keep your account and everything in it."}</div>
        ${messageBoxes()}
        <form class="auth-form" onsubmit="handlePickName(event)">
          <input type="text" id="pickUsername" placeholder="Username" maxlength="21" autocomplete="off" autocapitalize="none" spellcheck="false" ${dev ? `value="${escapeHtml(DEVELOPER_USERNAME)}" readonly` : "required"}>
          <button type="submit">Save username</button>
        </form>
        <p class="note">3 to 20 letters, numbers or underscores. Friends add you with this name.</p>
      </div>
    </div>
  `;
}

function renderDeleteView() {
  return `
    <div class="auth-wrap">
      <div class="auth-card">
        <h2>Delete <span class="accent">account</span></h2>
        <div class="subtitle">Entered the wrong info? Delete this account (@${escapeHtml(state.user.username)}), then sign up again with a new username. Your old username is retired: nobody, including you, can use it again.</div>
        ${messageBoxes()}
        <form class="auth-form" onsubmit="handleDelete(event)">
          <input type="password" id="deletePassword" placeholder="Enter your password to confirm" required>
          <button type="submit">Permanently delete my account</button>
          <button type="button" class="link-btn" onclick="switchView('app')">Cancel</button>
        </form>
        <p class="note">This can't be undone.</p>
      </div>
    </div>
  `;
}

// The three pages, shown only to logged-in visitors
function renderAppView() {
  if (state.activeTab === "MEDIA") return renderMediaTab();
  if (state.activeTab === "PROJECTS") return renderProjectsTab();
  if (state.activeTab === "EMOTIONS") return renderEmotionsTab();
  if (state.activeTab === "MOOD") return renderMoodTab();
  if (state.activeTab === "FISH") return renderFishTab();
  if (state.activeTab === "TOMODACHI") return renderTomodachiTab();
  if (state.activeTab === "FRIENDS") return renderFriendsTab();
  return renderHomeTab();
}

// "Jane Doe" -> "JD"; falls back to the default initials
function initialsFor(name) {
  const letters = String(name || "").trim().split(/\s+/).filter(Boolean)
    .slice(0, 2).map(w => Array.from(w)[0].toUpperCase()).join("");
  return letters || INITIALS;
}

// The round picture on the homepage. `src` can be empty (then only the initials show).
function avatarHtml(initials, src) {
  return `
    <div class="avatar">
      ${src ? `<img src="${escapeHtml(src)}" alt="Profile picture"
           onload="this.nextElementSibling.style.display='none'" onerror="this.remove()">` : ""}
      <span>${escapeHtml(initials)}</span>
    </div>`;
}

function renderHomeTab() {
  const u = state.user || {};
  const isDev = !!u.isDeveloper;

  // Developer: the site's own words and the fixed profile picture.
  // Everyone else: the fixed visitor greeting, plus their own (editable) name, picture and bio.
  const shownName = isDev ? SITE_NAME : (u.name || SITE_NAME);
  const greeting = isDev ? "Hi, I'm" : VISITOR_GREETING;
  const welcome = isDev ? WELCOME_TEXT : VISITOR_WELCOME;
  const initials = isDev ? INITIALS : initialsFor(shownName);
  const picture = isDev ? PROFILE_SRC : (pendingAvatar !== undefined ? pendingAvatar : u.avatar);

  if (!isDev && state.editingHome) {
    return `
      <section class="page hero edit-hero">
        ${messageBoxes()}
        <form class="edit-form" onsubmit="saveHome(event)">
          <div class="edit-left">
            ${avatarHtml(initials, picture)}
            <label class="file-btn">Change picture
              <input type="file" accept="image/*" hidden onchange="handleAvatarFile(this)">
            </label>
            <button type="button" class="link-btn" onclick="removeAvatar()">Remove picture</button>
            <p class="note" id="avatarNote">Saved in this browser only.</p>
          </div>
          <div class="edit-right">
            <div class="icon-label">Username (can't be changed)</div>
            <input type="text" value="@${escapeHtml(u.username)}" readonly aria-label="Your username">
            <input type="text" id="editName" value="${escapeHtml(shownName)}" maxlength="40" placeholder="Your name" required>
            <textarea id="editBio" rows="3" maxlength="200" placeholder="Write a short bio about yourself">${escapeHtml(u.bio || "")}</textarea>
            <div class="edit-buttons">
              <button type="submit">Save</button>
              <button type="button" class="link-btn" onclick="cancelEditHome()">Cancel</button>
            </div>
          </div>
        </form>
      </section>
    `;
  }

  return `
    <section class="page hero">
      ${avatarHtml(initials, picture)}
      <h1>${escapeHtml(greeting)} <span class="accent">${escapeHtml(shownName)}</span></h1>
      ${isDev ? `<div class="typing" id="typing"></div>` : ""}
      <p>${escapeHtml(welcome)}</p>
      ${!isDev && u.bio ? `<p class="bio">${escapeHtml(u.bio)}</p>` : ""}
      ${isDev ? "" : `<button onclick="startEditHome()">✏️ Edit profile</button>`}
    </section>
  `;
}

// Every interest the signed-in person sees: the built-in ones, then the ones they added.
// `key` is the name of the interest's checklist.
function allInterests() {
  const mine = (state.user && state.user.interests) || [];
  const builtIn = MEDIA.map(m => ({
    key: m.key, id: null, title: m.title, text: m.text, icon: m.icon, img: (MEDIA_ICON_PNGS[m.key] || ""), verb: m.verb, own: false
  }));
  const added = mine.map(i => ({
    key: "i-" + i.id, id: i.id, title: i.title, text: i.text, icon: i.icon, verb: "finished", own: true
  }));
  return builtIn.concat(added);
}

// The checklist for one interest: what the person saved, or the starter titles
function getChecklist(key) {
  const saved = state.user && state.user.lists && state.user.lists[key];
  if (Array.isArray(saved)) return saved;
  return (STARTER_LISTS[key] || []).map((title, i) => ({ id: "s" + i, title: title, done: false }));
}

// One card on the Media page. Click it to open its checklist.
// `own` cards (added by the visitor) also get Edit / Delete buttons.
function interestCard(item) {
  const items = getChecklist(item.key);
  const done = items.filter(x => x.done).length;
  const hint = items.length
    ? `${done} / ${items.length} ${item.verb} · open list →`
    : "No titles yet · open list →";

  return `
    <div class="card clickable" role="button" tabindex="0" data-key="${item.key}"
         onclick="openChecklist('${item.key}')"
         onkeydown="if(event.target===this&&(event.key==='Enter'||event.key===' ')){event.preventDefault();openChecklist('${item.key}')}">
      <div class="icon">${item.img ? `<img class="icon-img" src="${item.img}" alt="" onerror="this.outerHTML='${escapeHtml(iconOrDefault(item.icon))}'">` : escapeHtml(iconOrDefault(item.icon))}</div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
      <span class="card-hint">${hint}</span>
      ${item.own ? `
        <div class="project-actions">
          <button class="small" onclick="event.stopPropagation(); startEditInterest('${item.id}')">Edit</button>
          <button class="small danger" onclick="event.stopPropagation(); deleteInterest('${item.id}')">Delete</button>
        </div>` : ""}
    </div>`;
}

// The built-in interests are shared; interests people add are private to their own account
function renderMediaTab() {
  const all = allInterests();
  const open = state.openList && all.find(i => i.key === state.openList);
  if (open) return renderChecklistView(open);

  const mine = (state.user && state.user.interests) || [];
  const editing = state.editingInterest;
  const current = editing && editing !== "new" ? mine.find(i => i.id === editing) : null;
  const showForm = editing === "new" || !!current;
  const selected = current ? iconOrDefault(current.icon) : CAT_ICONS[0];

  return `
    <section class="page">
      <div class="page-head">
        <h2>Anime, Comics <span>&amp; Danmei</span></h2>
        ${showForm ? "" : `<button onclick="startEditInterest('new')">+ Add interest</button>`}
      </div>
      <p class="intro">${escapeHtml(MEDIA_INTRO)} Click a card to open its checklist. Interests you add are only visible to you.</p>
      ${messageBoxes()}
      ${showForm ? `
        <form class="auth-form project-form" onsubmit="saveInterest(event)">
          <input type="text" id="interestTitle" value="${escapeHtml(current ? current.title : "")}" maxlength="40" placeholder="Interest (e.g. Movies)" required>
          <textarea id="interestText" rows="3" maxlength="300" placeholder="What do you like about it?">${escapeHtml(current ? current.text : "")}</textarea>
          <div class="icon-label">Pick an icon</div>
          <div class="icon-picker">
            ${CAT_ICONS.map((icon, i) => `
              <label class="icon-option">
                <input type="radio" name="interestIcon" value="${i}" ${icon === selected ? "checked" : ""}>
                <span>${escapeHtml(icon)}</span>
              </label>`).join("")}
          </div>
          <div class="form-row">
            <button type="submit">Save interest</button>
            <button type="button" class="link-btn" onclick="cancelEditInterest()">Cancel</button>
          </div>
        </form>` : ""}
      <div class="cards media-grid">
        ${all.map(item => interestCard(item)).join("")}
      </div>
    </section>
  `;
}

// One column of the checklist screen ("Not yet watched" or "Already watched")
function checkColumn(heading, list, item, emptyText) {
  return `
    <div class="check-col">
      <h3>${escapeHtml(heading)} <span class="count">${list.length}</span></h3>
      ${list.length ? `
        <ul class="checklist">
          ${list.map(x => `
            <li class="check-item ${x.done ? "done" : ""}">
              <label>
                <input type="checkbox" ${x.done ? "checked" : ""} onchange="toggleItem('${item.key}', '${x.id}')">
                <span class="check-title">${escapeHtml(x.title)}</span>
              </label>
              <button class="small danger" onclick="deleteItem('${item.key}', '${x.id}')" aria-label="Remove ${escapeHtml(x.title)}">✕</button>
            </li>`).join("")}
        </ul>` : `<p class="empty-col">${escapeHtml(emptyText)}</p>`}
    </div>`;
}

// The checklist screen that opens when you click an interest card
function renderChecklistView(item) {
  const items = getChecklist(item.key);
  const done = items.filter(x => x.done).length;
  const percent = items.length ? Math.round((done / items.length) * 100) : 0;
  const todo = items.filter(x => !x.done);
  const finished = items.filter(x => x.done);

  return `
    <section class="page">
      <div class="page-head">
        <h2><span>${item.img ? `<img class="icon-img small-icon" src="${item.img}" alt="" onerror="this.outerHTML='${escapeHtml(iconOrDefault(item.icon))}'">` : escapeHtml(iconOrDefault(item.icon))}</span> ${escapeHtml(item.title)}</h2>
        <button onclick="closeChecklist()">← Back</button>
      </div>
      <p class="intro">${escapeHtml(item.text)}</p>
      ${messageBoxes()}
      <form class="add-item-form" onsubmit="addItem(event, '${item.key}')">
        <input type="text" id="itemTitle" maxlength="80" placeholder="Add a title to your ${escapeHtml(item.title)} list" required>
        <button type="submit">Add</button>
      </form>
      <div class="progress" aria-hidden="true"><div class="progress-bar" style="width:${percent}%"></div></div>
      <p class="progress-text">${done} of ${items.length} ${escapeHtml(item.verb)}</p>
      <div class="check-columns">
        ${checkColumn("Not yet " + item.verb, todo, item, "Nothing left, you've " + item.verb + " everything!")}
        ${checkColumn("Already " + item.verb, finished, item, "Nothing ticked off yet.")}
      </div>
    </section>
  `;
}

// Projects are private: each account only ever sees its own list
function renderProjectsTab() {
  const projects = (state.user && state.user.projects) || [];
  const editing = state.editingProject;
  const current = editing && editing !== "new" ? projects.find(p => p.id === editing) : null;
  const showForm = editing === "new" || !!current;
  const selectedFruit = current ? fruitFor(current, projects.indexOf(current)) : FRUIT_ICONS[0];

  return `
    <section class="page">
      <div class="page-head">
        <h2>My <span>Projects</span></h2>
        ${showForm ? "" : `<button onclick="startEditProject('new')">+ Add project</button>`}
      </div>
      <p class="intro">Only you can see the projects you add here. They're saved in this browser.</p>
      ${messageBoxes()}
      ${showForm ? `
        <form class="auth-form project-form" onsubmit="saveProject(event)">
          <input type="text" id="projectTitle" value="${escapeHtml(current ? current.title : "")}" maxlength="60" placeholder="Project title" required>
          <textarea id="projectText" rows="3" maxlength="400" placeholder="What is it about?">${escapeHtml(current ? current.text : "")}</textarea>
          <div class="icon-label">Pick a fruit</div>
          <div class="icon-picker">
            ${FRUIT_ICONS.map((icon, i) => `
              <label class="icon-option">
                <input type="radio" name="projectIcon" value="${i}" ${icon === selectedFruit ? "checked" : ""}>
                <span>${icon}</span>
              </label>`).join("")}
          </div>
          <div class="form-row">
            <button type="submit">Save project</button>
            <button type="button" class="link-btn" onclick="cancelEditProject()">Cancel</button>
          </div>
        </form>` : ""}
      <div class="cards project-grid">
        ${projects.map((p, i) => `
          <div class="project">
            <div class="project-icon">${fruitFor(p, i)}</div>
            <h3>${escapeHtml(p.title)}</h3>
            <p>${escapeHtml(p.text)}</p>
            <div class="project-actions">
              <button class="small" onclick="startEditProject('${p.id}')">Edit</button>
              <button class="small danger" onclick="deleteProject('${p.id}')">Delete</button>
            </div>
          </div>`).join("")}
      </div>
      ${!projects.length && !showForm ? `<p class="intro">No projects yet. Click "Add project" to create your first one.</p>` : ""}
    </section>
  `;
}

// Typing animation on the home page
let typingTimer = null;
function stopTyping() {
  clearTimeout(typingTimer);
  typingTimer = null;
}
function startTyping() {
  if (!document.getElementById("typing")) return;   // visitors don't get the typing line
  let phraseIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const el = document.getElementById("typing");
    if (!el) return;                       // page changed, stop
    const current = TYPING_PHRASES[phraseIndex];
    el.textContent = current.substring(0, charIndex);

    let delay = deleting ? 50 : 100;
    if (!deleting && charIndex < current.length) {
      charIndex++;
    } else if (deleting && charIndex > 0) {
      charIndex--;
    } else if (!deleting) {
      deleting = true;
      delay = 1200;
    } else {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % TYPING_PHRASES.length;
    }
    typingTimer = setTimeout(tick, delay);
  }
  tick();
}


// ----- Emotion bubbles -----
// Every bubble is one emotion. Click one and you get a quote for that feeling.
// Add or change quotes freely: each one is ["the quote", "who said it"].
// An empty "who" shows as "a little reminder".
const EMOTIONS = [
  { key: "happy",     label: "Happy",     emoji: "😊", color: "#fff0a6", dark: "#c9a23c" },
  { key: "sad",       label: "Sad",       emoji: "😢", color: "#b8d8f7", dark: "#4a78ad" },
  { key: "love",      label: "In love",   emoji: "🥰", color: "#f9c4d9", dark: "#b5577f" },
  { key: "disgusted", label: "Disgusted", emoji: "🤢", color: "#cdebb4", dark: "#6a9150" },
  { key: "angry",     label: "Angry",     emoji: "😠", color: "#f7b7ad", dark: "#a9493b" },
  { key: "anxious",   label: "Anxious",   emoji: "😰", color: "#d8c9f2", dark: "#7560a8" },
  { key: "excited",   label: "Excited",   emoji: "🤩", color: "#fdd3a6", dark: "#bf7430" },
  { key: "tired",     label: "Tired",     emoji: "😴", color: "#cfdae0", dark: "#62788a" },
  { key: "other",     label: "Something else", emoji: "🫧", color: "#e4eeea", dark: "#7d9693" }
];

const QUOTES = {
  happy: [
    ["Happiness depends upon ourselves.", "Aristotle"],
    ["Be happy for this moment. This moment is your life.", "Omar Khayyam"],
    ["The best way to cheer yourself up is to try to cheer somebody else up.", "Mark Twain"],
    ["Happiness is not something ready made. It comes from your own actions.", "Dalai Lama"],
    ["Hold on to this feeling. You earned it.", ""],
    ["Today is a good day to have a good day.", ""],
    ["Happiness is a warm puppy.", "Charles M. Schulz"],
    ["Happiness is not by chance, but by choice.", "Jim Rohn"],
    ["Notice the small joys. They add up.", ""],
    ["You're allowed to enjoy this without waiting for the other shoe to drop.", ""],
    ["Smile at something today. Even a tiny thing counts.", ""],
    ["Joy shared is joy doubled. Tell someone your good news.", ""]
  ],
  sad: [
    ["This too shall pass.", "Persian proverb"],
    ["Even the darkest night will end and the sun will rise.", "Victor Hugo, Les Misérables"],
    ["Isn't it nice to think that tomorrow is a new day with no mistakes in it yet?", "L. M. Montgomery, Anne of Green Gables"],
    ["Tomorrow is another day.", "Scarlett O'Hara, Gone with the Wind"],
    ["It's okay to not be okay. Be gentle with yourself today.", ""],
    ["Just keep swimming.", "Dory, Finding Nemo"],
    ["The best way out is always through.", "Robert Frost"],
    ["Fall seven times, stand up eight.", "Japanese proverb"],
    ["Crying is allowed. Let it out, then drink some water.", ""],
    ["You don't have to be strong all the time.", ""],
    ["Small steps still move you forward.", ""]
  ],
  love: [
    ["Love looks not with the eyes, but with the mind.", "William Shakespeare"],
    ["We loved with a love that was more than love.", "Edgar Allan Poe"],
    ["Whatever our souls are made of, his and mine are the same.", "Emily Brontë, Wuthering Heights"],
    ["You pierce my soul. I am half agony, half hope.", "Jane Austen, Persuasion"],
    ["You had me at hello.", "Jerry Maguire"],
    ["As you wish.", "The Princess Bride"],
    ["Where there is love there is life.", "Mahatma Gandhi"],
    ["To love and be loved is to feel the sun from both sides.", "David Viscott"],
    ["Love all, trust a few, do wrong to none.", "William Shakespeare, All's Well That Ends Well"],
    ["All you need is love.", "The Beatles"],
    ["Hold the people you love a little closer today.", ""]
  ],
  disgusted: [
    ["The best revenge is not to be like your enemy.", "Marcus Aurelius"],
    ["You have power over your mind, not outside events.", "Marcus Aurelius"],
    ["Not my circus, not my monkeys.", "Polish proverb"],
    ["Some things are better left in the trash. Walk away and breathe.", ""],
    ["Your peace is worth more than their mess.", ""],
    ["Walk away from what drains you.", ""],
    ["Not everything deserves your attention.", ""],
    ["You are allowed to say “no thanks” and leave.", ""],
    ["Clean it up, wash your hands, and move on.", ""],
    ["It's okay to have standards.", ""],
    ["Bad tastes fade. Have a glass of water and a fresh start.", ""]
  ],
  angry: [
    ["For every minute you are angry you lose sixty seconds of happiness.", "Ralph Waldo Emerson"],
    ["Anyone can become angry, that is easy.", "Aristotle"],
    ["Anger leads to hate.", "Yoda, Star Wars: The Phantom Menace"],
    ["Speak when you are angry and you will make the best speech you will ever regret.", "Ambrose Bierce"],
    ["Take a deep breath. It's a bad moment, not a bad life.", ""],
    ["When angry, count ten before you speak; if very angry, a hundred.", "Thomas Jefferson"],
    ["Feel it, name it, then let it cool.", ""],
    ["It's fine to be mad. It's not fine to burn the bridge tonight.", ""],
    ["Go for a walk first. Send the message later.", ""],
    ["Your anger is telling you something. Listen, then choose your move.", ""],
    ["Cool water, slow breaths, sleep on it.", ""]
  ],
  anxious: [
    ["We suffer more often in imagination than in reality.", "Seneca"],
    ["Courage is not the absence of fear, but the triumph over it.", "Nelson Mandela"],
    ["Nothing in life is to be feared, it is only to be understood.", "Marie Curie"],
    ["Worry does not empty tomorrow of its sorrow.", "Corrie ten Boom"],
    ["All is well.", "3 Idiots"],
    ["Breathe in slowly. You are safe right now.", ""],
    ["You can't stop the waves, but you can learn to surf.", "Jon Kabat-Zinn"],
    ["Feel the fear and do it anyway.", "Susan Jeffers"],
    ["One thing at a time. Right now, just this breath.", ""],
    ["Name five things you can see. You're here.", ""],
    ["You have survived every hard day so far.", ""]
  ],
  excited: [
    ["To infinity and beyond!", "Buzz Lightyear, Toy Story"],
    ["Go confidently in the direction of your dreams.", "Henry David Thoreau"],
    ["Adventure is worthwhile in itself.", "Amelia Earhart"],
    ["The only way to do great work is to love what you do.", "Steve Jobs"],
    ["Ride this wave. Today is the day!", ""],
    ["Nothing great was ever achieved without enthusiasm.", "Ralph Waldo Emerson"],
    ["Seize the day.", "Horace"],
    ["What a time to be alive!", ""],
    ["Let's go! The adventure begins now.", ""],
    ["Keep that spark and use it.", ""],
    ["Dream big, then take the first step today.", ""]
  ],
  tired: [
    ["Rest is not idleness.", "John Lubbock"],
    ["Nature does not hurry, yet everything is accomplished.", "Lao Tzu"],
    ["Tomorrow is another day.", "Scarlett O'Hara, Gone with the Wind"],
    ["Just keep swimming.", "Dory, Finding Nemo"],
    ["You've done enough for today. Rest is allowed.", ""],
    ["Sleep is the best meditation.", "Dalai Lama"],
    ["Rest and be thankful.", "William Wordsworth"],
    ["Almost everything will work again if you unplug it for a few minutes, including you.", "Anne Lamott"],
    ["Being tired isn't weakness. It means you've been trying.", ""],
    ["Drink water, stretch, and close your eyes for a bit.", ""],
    ["The to-do list will still be there tomorrow.", ""]
  ],
  other: [
    ["Feelings are just visitors. Let them come and go.", "Mooji"],
    ["Not all those who wander are lost.", "J. R. R. Tolkien"],
    ["To live is the rarest thing in the world. Most people exist, that is all.", "Oscar Wilde"],
    ["Whatever you are feeling is valid. You don't need a label for it.", ""],
    ["Be gentle with yourself. You're doing the best you can.", ""],
    ["Wonder is the beginning of wisdom.", "Socrates"],
    ["The only way to make sense out of change is to plunge into it and move with it.", "Alan Watts"],
    ["Some days you just exist. That's okay too.", ""],
    ["You don't have to figure it out today.", ""],
    ["Mixed feelings are still feelings. Sit with them a while.", ""],
    ["Take a slow breath and notice what your body is saying.", ""]
  ]
};

const lastQuote = {};   // remembers the last quote shown per emotion so it doesn't repeat right away

function renderEmotionsTab() {
  return `
    <section class="bubble-field" id="bubbleField">
      <p class="bubble-hint">Pop the bubble that matches how you feel 🫧</p>
      <div class="legend" aria-label="Emotion legend">
        <div class="legend-title">Legend</div>
        ${EMOTIONS.map(e => `
          <div class="legend-item"><span class="legend-dot" style="--c:${e.color};--cd:${e.dark}"></span>${escapeHtml(e.label)}</div>`).join("")}
      </div>
      <div class="quote-overlay" id="quoteOverlay" onclick="if(event.target===this)closeQuote()">
        <div class="quote-card" role="dialog" aria-live="polite">
          <div class="quote-emoji" id="quoteEmoji"></div>
          <div class="quote-feeling" id="quoteFeeling"></div>
          <p class="quote-text" id="quoteText"></p>
          <p class="quote-author" id="quoteAuthor"></p>
          <div class="form-row quote-buttons">
            <button type="button" onclick="anotherQuote()">Another quote</button>
            <button type="button" class="link-btn" onclick="closeQuote()">Close</button>
          </div>
        </div>
      </div>
    </section>`;
}

// ---------- Mood tracker (a calendar of how you felt each day) ----------
const MOOD_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MOOD_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function moodKey(y, m, d) {
  return y + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
}
function moodToday() {
  const t = new Date();
  return { y: t.getFullYear(), m: t.getMonth(), d: t.getDate() };
}
function moodShown() {
  if (state.moodMonth) return state.moodMonth;
  const t = moodToday();
  return { y: t.y, m: t.m };
}
function moodFor(key) {
  const moods = (state.user && state.user.moods) || {};
  const entry = moods[key];
  if (!entry || !EMOTIONS.some(e => e.key === entry.emotion)) return null;
  return entry;
}
function isFutureDay(y, m, d) {
  const t = moodToday();
  return new Date(y, m, d) > new Date(t.y, t.m, t.d);
}
// One round mood face (same colors as the emotion bubbles)
function moodFace(emo, size) {
  return `<span class="mood-face" style="--c:${emo.color};--cd:${emo.dark};width:${size}px;height:${size}px;font-size:${Math.round(size * 0.58)}px">${emo.emoji}</span>`;
}

function renderMoodTab() {
  const shown = moodShown();
  const yearly = state.moodView === "yearly";
  return `
    <section class="mood-page">
      <h2 class="mood-title">Calendar</h2>
      <div class="mood-switch" role="tablist">
        <button type="button" class="${yearly ? "" : "on"}" onclick="setMoodView('monthly')">Monthly</button>
        <button type="button" class="${yearly ? "on" : ""}" onclick="setMoodView('yearly')">Yearly</button>
      </div>
      ${yearly ? renderMoodYear(shown) : renderMoodMonth(shown)}
      ${state.moodDay ? renderMoodBox() : ""}
    </section>`;
}

function renderMoodMonth(shown) {
  const first = new Date(shown.y, shown.m, 1).getDay();
  const total = new Date(shown.y, shown.m + 1, 0).getDate();
  const prevTotal = new Date(shown.y, shown.m, 0).getDate();
  const t = moodToday();
  let cells = "";
  for (let i = 0; i < first; i++) cells += `<div class="mood-cell out"><span class="mood-empty">${prevTotal - first + 1 + i}</span></div>`;
  for (let d = 1; d <= total; d++) {
    const key = moodKey(shown.y, shown.m, d);
    const entry = moodFor(key);
    const emo = entry && EMOTIONS.find(e => e.key === entry.emotion);
    const future = isFutureDay(shown.y, shown.m, d);
    const isToday = shown.y === t.y && shown.m === t.m && d === t.d;
    cells += `
      <button type="button" class="mood-cell ${future ? "future" : ""} ${isToday ? "today" : ""}" ${future ? "disabled" : ""}
        onclick="openMoodDay('${key}')" aria-label="${MOOD_MONTHS[shown.m]} ${d}${emo ? ", " + emo.label : ""}">
        ${emo ? moodFace(emo, 42) : `<span class="mood-empty">${d}</span>`}
        ${emo ? `<span class="mood-num">${d}</span>` : ""}
      </button>`;
  }
  const used = first + total;
  for (let i = 0; i < (7 - used % 7) % 7; i++) cells += `<div class="mood-cell out"><span class="mood-empty">${i + 1}</span></div>`;
  return `
    <div class="mood-nav">
      <button type="button" class="mood-arrow" onclick="moodStep(-1)" aria-label="Previous month">‹</button>
      <strong>${MOOD_MONTHS[shown.m]} ${shown.y}</strong>
      <button type="button" class="mood-arrow" onclick="moodStep(1)" aria-label="Next month">›</button>
    </div>
    <div class="mood-grid mood-head">${MOOD_DAYS.map(d => `<span>${d}</span>`).join("")}</div>
    <div class="mood-grid">${cells}</div>
    <p class="mood-hint">Tap a day to log or see your mood</p>
    ${renderMoodLegend()}`;
}

function renderMoodYear(shown) {
  const months = MOOD_MONTHS.map((name, m) => {
    const total = new Date(shown.y, m + 1, 0).getDate();
    const first = new Date(shown.y, m, 1).getDay();
    let dots = "";
    for (let i = 0; i < first; i++) dots += `<i></i>`;
    for (let d = 1; d <= total; d++) {
      const entry = moodFor(moodKey(shown.y, m, d));
      const emo = entry && EMOTIONS.find(e => e.key === entry.emotion);
      dots += emo ? `<i class="on" style="--c:${emo.color};--cd:${emo.dark}" title="${name} ${d}: ${escapeHtml(emo.label)}"></i>` : `<i></i>`;
    }
    return `<button type="button" class="mood-mini" onclick="openMoodMonth(${m})"><span>${name.slice(0, 3)}</span><div class="mood-dots">${dots}</div></button>`;
  }).join("");
  return `
    <div class="mood-nav">
      <button type="button" class="mood-arrow" onclick="moodStep(-12)" aria-label="Previous year">‹</button>
      <strong>${shown.y}</strong>
      <button type="button" class="mood-arrow" onclick="moodStep(12)" aria-label="Next year">›</button>
    </div>
    <div class="mood-year">${months}</div>
    <p class="mood-hint">Tap a month to open it</p>
    ${renderMoodLegend()}`;
}

function renderMoodLegend() {
  return `<div class="mood-legend">${EMOTIONS.map(e => `<span>${moodFace(e, 18)}${escapeHtml(e.label)}</span>`).join("")}</div>`;
}

function renderMoodBox() {
  const [y, mo, d] = state.moodDay.split("-").map(Number);
  const saved = moodFor(state.moodDay);
  const draft = state.moodDraft || { emotion: saved ? saved.emotion : "", note: saved ? saved.note || "" : "" };
  const label = MOOD_MONTHS[mo - 1] + " " + d + ", " + y;
  return `
    <div class="mood-overlay" onclick="if(event.target===this)closeMoodDay()">
      <div class="mood-box" role="dialog" aria-label="Mood for ${label}">
        <h3>${label}</h3>
        <p class="mood-hint">${saved ? "You logged this day. Change it below if you like." : "How did you feel?"}</p>
        <div class="mood-picks">
          ${EMOTIONS.map(e => `
            <button type="button" class="mood-pick ${draft.emotion === e.key ? "on" : ""}" onclick="pickMood('${e.key}')" aria-label="${escapeHtml(e.label)}">
              ${moodFace(e, 44)}<small>${escapeHtml(e.label)}</small>
            </button>`).join("")}
        </div>
        <textarea id="moodNote" maxlength="300" rows="3" placeholder="Add a note (optional)" oninput="state.moodDraft.note=this.value">${escapeHtml(draft.note)}</textarea>
        <div class="form-row">
          <button type="button" onclick="saveMood()" ${draft.emotion ? "" : "disabled"}>Save</button>
          ${saved ? `<button type="button" class="link-btn" onclick="clearMood()">Remove</button>` : ""}
          <button type="button" class="link-btn" onclick="closeMoodDay()">Close</button>
        </div>
      </div>
    </div>`;
}

function setMoodView(view) {
  state.moodView = view;
  state.moodDay = null;
  render(true);
}
function moodStep(months) {
  const shown = moodShown();
  const d = new Date(shown.y, shown.m + months, 1);
  state.moodMonth = { y: d.getFullYear(), m: d.getMonth() };
  render(true);
}
function openMoodMonth(m) {
  state.moodMonth = { y: moodShown().y, m: m };
  state.moodView = "monthly";
  render(true);
}
function openMoodDay(key) {
  const saved = moodFor(key);
  state.moodDay = key;
  state.moodDraft = { emotion: saved ? saved.emotion : "", note: saved ? saved.note || "" : "" };
  render(true);
}
function closeMoodDay() {
  state.moodDay = null;
  state.moodDraft = null;
  render(true);
}
function pickMood(key) {
  if (!state.moodDraft) state.moodDraft = { emotion: "", note: "" };
  const note = document.getElementById("moodNote");
  if (note) state.moodDraft.note = note.value;
  state.moodDraft.emotion = key;
  render(true);
}
function writeMood(key, entry) {
  const users = loadUsers();
  const account = users[state.user.username];
  if (!account) { state.errorMsg = "Couldn't find your account."; return false; }
  if (!account.moods || typeof account.moods !== "object") account.moods = {};
  if (entry) account.moods[key] = entry; else delete account.moods[key];
  try { saveUsers(users); }
  catch (e) { state.errorMsg = "Couldn't save. Is browser storage turned off?"; return false; }
  state.user = userFromAccount(state.user.username, account);
  return true;
}
function saveMood() {
  if (!state.moodDay || !state.moodDraft || !state.moodDraft.emotion) return;
  const note = (state.moodDraft.note || "").trim().slice(0, 300);
  if (writeMood(state.moodDay, { emotion: state.moodDraft.emotion, note: note })) closeMoodDay();
  else render(true);
}
function clearMood() {
  if (!state.moodDay) return;
  if (writeMood(state.moodDay, null)) closeMoodDay();
  else render(true);
}

// The field always holds 100 bubbles. Colors come only from the legend (the 9 emotions),
// and each bubble carries its own quote: bubble number i is emotion i % 9 and quote number
// floor(i / 9) of that emotion, so no two bubbles share a quote.
const BUBBLE_COUNT = 100;

function startBubbles() {
  const field = document.getElementById("bubbleField");
  if (!field) return;
  const dims = { w: field.clientWidth, h: field.clientHeight };   // measured once (not 100 times)
  const frag = document.createDocumentFragment();
  for (let i = 0; i < BUBBLE_COUNT; i++) spawnBubble(field, i, dims, frag);
  field.appendChild(frag);                                         // one insert instead of 100
}

function spawnBubble(field, slot, dims, parent) {
  if (!field.isConnected) return;     // the page changed, stop
  dims = dims || { w: field.clientWidth, h: field.clientHeight };
  const emo = EMOTIONS[slot % EMOTIONS.length];
  const list = QUOTES[emo.key];
  const quoteIndex = Math.floor(slot / EMOTIONS.length) % list.length;
  const small = dims.w < 600;
  const size = Math.round((small ? 30 : 38) + Math.random() * (small ? 16 : 22));
  const left = Math.random() * Math.max(0, dims.w - size);
  const top = Math.random() * Math.max(0, dims.h - size);

  const bubble = document.createElement("button");
  bubble.type = "button";
  bubble.className = "bubble";
  bubble.setAttribute("aria-label", emo.label + " bubble");
  bubble.style.cssText =
    `width:${size}px;height:${size}px;left:${left}px;top:${top}px;` +
    `--dx:${Math.round(Math.random() * 60 - 30)}px;--dy:${Math.round(Math.random() * 70 - 35)}px;` +
    `animation-duration:${(5 + Math.random() * 4).toFixed(1)}s;animation-delay:-${(Math.random() * 6).toFixed(1)}s;`;
  bubble.innerHTML =
    `<span class="bubble-face" style="--c:${emo.color};--cd:${emo.dark}"></span>`;
  bubble.onclick = () => popBubble(bubble, field, slot, emo.key, quoteIndex);
  (parent || field).appendChild(bubble);
}

function popBubble(bubble, field, slot, key, quoteIndex) {
  bubble.disabled = true;
  bubble.classList.add("pop");
  showQuote(key, quoteIndex);
  setTimeout(() => bubble.remove(), 300);
  setTimeout(() => spawnBubble(field, slot), 900);    // the same bubble (same color, same quote) floats back in
}

function showQuote(key, forcedIndex) {
  const emo = EMOTIONS.find(e => e.key === key);
  const overlay = document.getElementById("quoteOverlay");
  const list = QUOTES[key];
  if (!emo || !overlay || !list || !list.length) return;

  let i = typeof forcedIndex === "number" ? forcedIndex : Math.floor(Math.random() * list.length);
  if (typeof forcedIndex !== "number" && list.length > 1 && i === lastQuote[key]) i = (i + 1) % list.length;
  lastQuote[key] = i;

  overlay.dataset.emotion = key;
  overlay.style.setProperty("--c", emo.color);
  overlay.style.setProperty("--cd", emo.dark);
  document.getElementById("quoteEmoji").textContent = emo.emoji;
  document.getElementById("quoteFeeling").textContent = emo.key === "other" ? "Feeling something else?" : "Feeling " + emo.label.toLowerCase() + "?";
  document.getElementById("quoteText").textContent = "\u201c" + list[i][0] + "\u201d";
  document.getElementById("quoteAuthor").textContent = "\u2014 " + (list[i][1] || "a little reminder");
  overlay.classList.add("show");
}

function anotherQuote() {
  const overlay = document.getElementById("quoteOverlay");
  if (overlay) showQuote(overlay.dataset.emotion);
}

function closeQuote() {
  const overlay = document.getElementById("quoteOverlay");
  if (overlay) overlay.classList.remove("show");
}

document.addEventListener("keydown", event => { if (event.key === "Escape") closeQuote(); });

// ----- Draw a Fish -----
// Drawings are saved in this browser's storage (key below). Every account on this
// browser sees every drawing, including the developer's. To share between different
// devices you'd need a small online database; loadFish / saveFish are the only two
// functions that would have to change.
const FISH_KEY = "aconite_fish";
const FISH_MAX = 60;                        // the gallery keeps the newest 60 fish
const FISH_W = 400, FISH_H = 300;
const FISH_COLORS = ["#684f48", "#e5604d", "#f59a3d", "#f7c948", "#8cc152", "#5f8b94", "#6aa9e9", "#a78bda", "#f28ab2"];

let fishTool = { color: FISH_COLORS[0], size: 6 };
let fishDraft = null;        // the unfinished drawing, kept while the page is redrawn
let fishUndo = [];           // snapshots for the Undo button
let fishTouched = false;     // has anything been drawn yet?
let fishDrawing = false;
let fishLast = null;

function loadFish() {
  try {
    const list = JSON.parse(localStorage.getItem(FISH_KEY));
    return Array.isArray(list) ? list.filter(f => f && typeof f.img === "string" && f.img.startsWith("data:image/png;base64,")) : [];
  } catch (e) { return []; }
}
function saveFish(list) {
  localStorage.setItem(FISH_KEY, JSON.stringify(list));
}

function resetDrawing() {
  fishDraft = null; fishUndo = []; fishTouched = false; fishDrawing = false; fishLast = null;
}

function stashFishDraft() {
  const canvas = document.getElementById("fishCanvas");
  if (canvas) fishDraft = canvas.toDataURL("image/png");
}

function renderFishTab() {
  const count = Math.min(loadFish().length, SCHOOL_MAX);
  const full = false;                 // the tank always sits beside the drawing board

  return `
    <section class="page fit fish-page ${full ? "tank-full" : ""}">
      <div class="page-head head-left">
        <h2>Draw a <span>Fish</span></h2>
      </div>
      ${messageBoxes()}
      <div class="fit-body">
        ${full ? "" : `
        <div class="fish-panel">
          <canvas id="fishCanvas" width="${FISH_W}" height="${FISH_H}" aria-label="Drawing area"></canvas>
          <div class="swatches">
            ${FISH_COLORS.map(col => `
              <button type="button" class="swatch ${col === fishTool.color ? "selected" : ""}" data-color="${col}"
                style="background:${col}" aria-label="Color ${col}" onclick="setFishColor('${col}')"></button>`).join("")}
            <button type="button" class="small ${fishTool.color === "#ffffff" ? "selected" : ""}" data-color="#ffffff" onclick="setFishColor('#ffffff')">Eraser</button>
          </div>
          <input type="range" min="2" max="30" value="${fishTool.size}" oninput="fishTool.size = Number(this.value)" aria-label="Brush size">
          <div class="form-row fish-buttons">
            <button type="button" class="small" onclick="undoFish()">Undo</button>
            <button type="button" class="small" onclick="clearFish()">Clear</button>
            <button type="button" onclick="postFish()">Post my fish</button>
          </div>
        </div>`}
        <div class="school-tank" id="schoolTank">
          ${oceanSvg()}
          <div class="school-info" id="schoolInfo"><span>Fish count: <b>${count}</b></span><span class="school-tip">Tap a fish to see who drew it \u00b7 double-tap the water to drop food</span></div>
          ${count ? "" : `<p class="school-empty">The tank is empty. Draw a fish and post it!</p>`}
        </div>
      </div>
    </section>
  `;
}

// Get the canvas ready after the page is drawn
function setupFishCanvas() {
  const canvas = document.getElementById("fishCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, FISH_W, FISH_H);
  if (fishDraft) {
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = fishDraft;
  }
  canvas.addEventListener("pointerdown", fishDown);
  canvas.addEventListener("pointermove", fishMove);
  canvas.addEventListener("pointerup", fishUp);
  canvas.addEventListener("pointercancel", fishUp);
}

function fishPoint(event) {
  const canvas = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  return { x: (event.clientX - rect.left) * FISH_W / rect.width, y: (event.clientY - rect.top) * FISH_H / rect.height };
}

function fishSnapshot(ctx) {
  fishUndo.push(ctx.getImageData(0, 0, FISH_W, FISH_H));
  if (fishUndo.length > 15) fishUndo.shift();
}

function fishDown(event) {
  event.preventDefault();
  const canvas = event.currentTarget;
  const ctx = canvas.getContext("2d");
  fishSnapshot(ctx);
  fishDrawing = true;
  fishTouched = true;
  fishLast = fishPoint(event);
  ctx.fillStyle = fishTool.color;
  ctx.beginPath();
  ctx.arc(fishLast.x, fishLast.y, fishTool.size / 2, 0, Math.PI * 2);
  ctx.fill();
  try { canvas.setPointerCapture(event.pointerId); } catch (e) {}
}

function fishMove(event) {
  if (!fishDrawing) return;
  const ctx = event.currentTarget.getContext("2d");
  const p = fishPoint(event);
  ctx.strokeStyle = fishTool.color;
  ctx.lineWidth = fishTool.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(fishLast.x, fishLast.y);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
  fishLast = p;
}

function fishUp() { fishDrawing = false; }

function setFishColor(color) {
  fishTool.color = color;
  document.querySelectorAll("[data-color]").forEach(el => el.classList.toggle("selected", el.dataset.color === color));
}

function undoFish() {
  const canvas = document.getElementById("fishCanvas");
  const snap = fishUndo.pop();
  if (canvas && snap) canvas.getContext("2d").putImageData(snap, 0, 0);
}

function clearFish() {
  const canvas = document.getElementById("fishCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  fishSnapshot(ctx);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, FISH_W, FISH_H);
  fishTouched = false;
}

function postFish() {
  const canvas = document.getElementById("fishCanvas");
  if (!canvas) return;
  if (!fishTouched) { state.errorMsg = "Draw a fish first, then post it."; state.successMsg = ""; render(true); return; }

  const me = state.user;
  const list = loadFish();
  list.unshift({
    id: newId(),
    owner: me.username,
    name: me.isDeveloper ? SITE_NAME : (me.name || me.username),
    isDev: !!me.isDeveloper,
    time: Date.now(),
    img: canvas.toDataURL("image/png")
  });
  try { saveFish(list.slice(0, FISH_MAX)); }
  catch (e) { state.errorMsg = "Couldn't post. Browser storage may be full or turned off."; state.successMsg = ""; render(true); return; }

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, FISH_W, FISH_H);
  resetDrawing();
  logActivity("fish", "drew a fish and posted it to the gallery", me.username);
  state.errorMsg = "";
  state.successMsg = "Your fish was posted to the gallery!";
  render(true);
}

function deleteFish(id) {
  if (!confirm("Delete this drawing?")) return;
  const me = state.user;
  const list = loadFish();
  const target = list.find(f => f.id === id);
  if (!target || !(target.owner === me.username || me.isDeveloper)) return;   // only the artist or the developer
  try { saveFish(list.filter(f => f.id !== id)); } catch (e) {}
  render(true);
}


// ----- School of fishes -----
// Every posted fish swims together in one tank. The drawings are white-background PNGs, so each
// one is first cleaned (white around the fish becomes see-through) and cropped to the fish.
const SCHOOL_MAX = 60;
const cleanFishCache = {};     // fish id -> { src, ratio }

function cleanFishImage(f, done) {
  if (cleanFishCache[f.id]) { done(cleanFishCache[f.id]); return; }
  const img = new Image();
  img.onerror = () => done(null);
  img.onload = () => {
    const w = img.width, h = img.height;
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, w, h);
    const px = data.data;
    const nearWhite = i => px[i + 3] > 0 && px[i] > 228 && px[i + 1] > 228 && px[i + 2] > 228;
    // flood fill from every edge pixel so white INSIDE the fish is kept
    const stack = [];
    const seen = new Uint8Array(w * h);
    const push = (x, y) => {
      const p = y * w + x;
      if (x < 0 || y < 0 || x >= w || y >= h || seen[p]) return;
      seen[p] = 1;
      if (nearWhite(p * 4)) stack.push(p);
    };
    for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
    for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
    while (stack.length) {
      const p = stack.pop();
      px[p * 4 + 3] = 0;
      const x = p % w, y = (p - x) / w;
      push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
    }
    // crop to the fish
    let minX = w, minY = h, maxX = -1, maxY = -1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (px[(y * w + x) * 4 + 3] > 0) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
    if (maxX < 0) { done(null); return; }          // an empty drawing
    ctx.putImageData(data, 0, 0);
    const cw = maxX - minX + 1, ch = maxY - minY + 1;
    const out = document.createElement("canvas");
    out.width = cw; out.height = ch;
    out.getContext("2d").drawImage(c, minX, minY, cw, ch, 0, 0, cw, ch);
    const result = { src: out.toDataURL("image/png"), ratio: cw / ch };
    cleanFishCache[f.id] = result;
    done(result);
  };
  img.src = f.img;
}


// The sea behind the fish: water, light rays, a reef of corals, seaweed, rocks, shells and bubbles.
// Colors come from CSS variables so it also has a dark (deep sea) mode.
function oceanSvg() {
  let seed = 11;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const r1 = n => n.toFixed(1);

  // far reef silhouette
  let far = "M0 330 ";
  for (let x = 0; x <= 1000; x += 50) far += `L${x} ${300 + rnd() * 40} `;
  far += "L1000 420 L0 420 Z";

  // sea floor
  let sand = "M0 372 ";
  for (let x = 0; x <= 1000; x += 100) sand += `Q${x + 50} ${360 + rnd() * 22} ${x + 100} ${368 + rnd() * 12} `;
  sand += "L1000 420 L0 420 Z";

  // light rays
  let rays = "";
  for (let i = 0; i < 6; i++) { const x = 80 + i * 170 + rnd() * 40; rays += `<polygon points="${x},0 ${x + 50},0 ${x + 150},400 ${x - 40},400"/>`; }

  // seaweed (swaying)
  let weed = "";
  for (const x of [60, 120, 410, 540, 860, 930, 700]) {
    const h = 90 + rnd() * 90, sway = 14 + rnd() * 10;
    weed += `<path class="weed" style="animation-delay:-${r1(rnd() * 4)}s" d="M${x} 385 C${x - sway} ${385 - h * 0.35} ${x + sway} ${385 - h * 0.7} ${x} ${385 - h}" />`;
  }

  // branching corals
  const branch = (x, y, len, ang, depth, cls) => {
    const x2 = x + Math.sin(ang) * len, y2 = y - Math.cos(ang) * len;
    let out = `<line x1="${r1(x)}" y1="${r1(y)}" x2="${r1(x2)}" y2="${r1(y2)}" class="${cls}" stroke-width="${3 + depth * 2}" stroke-linecap="round"/>`;
    if (depth > 0) { out += branch(x2, y2, len * 0.72, ang - 0.5, depth - 1, cls) + branch(x2, y2, len * 0.72, ang + 0.5, depth - 1, cls); }
    return out;
  };
  let coral = "";
  coral += branch(230, 392, 34, -0.1, 3, "coral-a");
  coral += branch(610, 394, 30, 0.1, 3, "coral-b");
  coral += branch(790, 392, 36, -0.15, 3, "coral-c");
  coral += branch(30, 396, 28, 0.2, 2, "coral-b");

  // brain corals, fan coral, tube corals
  const brain = (x, y, r, cls) => `<g class="${cls}"><circle cx="${x}" cy="${y}" r="${r}"/><path class="brain-lines" d="M${x - r * 0.6} ${y - r * 0.2} q${r * 0.3} ${-r * 0.4} ${r * 0.6} 0 t${r * 0.6} 0 M${x - r * 0.5} ${y + r * 0.3} q${r * 0.3} ${-r * 0.4} ${r * 0.5} 0 t${r * 0.5} 0"/></g>`;
  const fan = (x, y, cls) => `<g class="${cls}"><path d="M${x} ${y} L${x - 46} ${y - 70} Q${x} ${y - 100} ${x + 46} ${y - 70} Z"/><path class="fan-lines" d="M${x} ${y} L${x - 24} ${y - 84} M${x} ${y} L${x} ${y - 90} M${x} ${y} L${x + 24} ${y - 84}"/></g>`;
  const tubes = (x, y, cls) => [0, 1, 2, 3].map(i => `<rect class="${cls}" x="${x + i * 13}" y="${y - 30 - (i % 2) * 18 - i * 3}" width="10" height="${40 + (i % 2) * 18}" rx="5"/>`).join("");

  let things = brain(330, 388, 34, "coral-brain") + brain(880, 392, 28, "coral-brain2") +
    fan(480, 392, "coral-fan") + fan(155, 394, "coral-fan2") +
    tubes(690, 392, "tube-a") + tubes(60, 398, "tube-b") + tubes(950, 400, "tube-a");

  // rocks, shells, starfish
  const rocks = `<ellipse class="rock" cx="380" cy="404" rx="46" ry="22"/><ellipse class="rock2" cx="765" cy="406" rx="60" ry="26"/>
    <ellipse class="rock2" cx="10" cy="404" rx="50" ry="26"/><ellipse class="rock" cx="990" cy="408" rx="44" ry="22"/>`;
  const star = (x, y) => { let pts = ""; for (let i = 0; i < 10; i++) { const r = i % 2 ? 5 : 13, a = -Math.PI / 2 + i * Math.PI / 5; pts += `${r1(x + Math.cos(a) * r)},${r1(y + Math.sin(a) * r)} `; } return `<polygon class="starfish" points="${pts}"/>`; };
  const shell = (x, y) => `<path class="shell" d="M${x - 10} ${y} Q${x} ${y - 22} ${x + 10} ${y} Z"/><path class="shell-lines" d="M${x} ${y} L${x} ${y - 14} M${x} ${y} L${x - 5} ${y - 12} M${x} ${y} L${x + 5} ${y - 12}"/>`;
  const small = star(285, 402) + star(820, 405) + shell(560, 404) + shell(430, 408) + shell(920, 410);

  // bubbles
  let bubbles = "";
  for (let i = 0; i < 16; i++) bubbles += `<circle class="o-bubble" cx="${Math.round(rnd() * 1000)}" cy="400" r="${r1(2 + rnd() * 5)}" style="animation-duration:${r1(7 + rnd() * 8)}s;animation-delay:-${r1(rnd() * 12)}s"/>`;

  return `
    <svg class="ocean" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="oceanWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" class="w-top"/><stop offset="0.6" class="w-mid"/><stop offset="1" class="w-low"/>
        </linearGradient>
      </defs>
      <rect width="1000" height="420" fill="url(#oceanWater)"/>
      <g class="rays">${rays}</g>
      <path class="far-reef" d="${far}"/>
      <g class="weeds">${weed}</g>
      <g class="corals">${coral}</g>
      ${things}
      <path class="sand" d="${sand}"/>
      ${rocks}
      ${small}
      <g class="o-bubbles">${bubbles}</g>
    </svg>`;
}

// The tank is always on the page. All fish follow one invisible leader that drifts back and forth,
// so they swim together; they spread out over the whole tank. Food pellets pull the nearest fish.
function startSchool() {
  const tank = document.getElementById("schoolTank");
  if (!tank) return;
  const me = state.user || {};
  const fishList = loadFish().slice(0, SCHOOL_MAX);
  const swimmers = [];
  const pellets = [];
  let selected = null;

  fishList.forEach(f => {
    cleanFishImage(f, clean => {
      if (!clean || !tank.isConnected) return;
      const width = 46 + Math.random() * 30;
      const el = document.createElement("div");
      el.className = "school-fish";
      el.style.width = width + "px";
      el.innerHTML = `<img src="${clean.src}" alt="A fish by ${escapeHtml(f.name || "a visitor")}" draggable="false">`;
      el.onclick = () => showFishInfo(f);
      tank.appendChild(el);
      swimmers.push({
        el: el, img: el.firstElementChild, w: width, h: width / clean.ratio,
        fx: Math.random() - 0.5, fy: Math.random() - 0.5,       // place in the school (fractions of the tank)
        x: Math.random() * tank.clientWidth, y: Math.random() * tank.clientHeight,
        phase: Math.random() * 6.28, dir: 1
      });
    });
  });

  function showFishInfo(f) {
    const info = document.getElementById("schoolInfo");
    if (!info) return;
    const canDelete = f.owner === me.username || me.isDeveloper;
    info.innerHTML = `<span>Fish by <b>${escapeHtml(f.name || "a visitor")}</b>${f.isDev ? ` <span class="badge">Developer</span>` : ""}
      ${f.time ? " \u00b7 " + escapeHtml(new Date(f.time).toLocaleDateString()) : ""}</span>
      ${canDelete ? `<button class="small danger" onclick="deleteFish('${escapeHtml(f.id)}')">Delete</button>` : ""}`;
  }

  function dropPellet(clientX, clientY, spread) {
    const r = tank.getBoundingClientRect();
    const el = document.createElement("div");
    el.className = "pellet";
    tank.appendChild(el);
    const jx = spread ? (Math.random() - 0.5) * 2 * spread : 0;
    const jy = spread ? (Math.random() - 0.5) * 2 * spread : 0;
    pellets.push({ el: el, x: clientX - r.left + jx, y: clientY - r.top + jy });
    if (pellets.length > 20) { pellets.shift().el.remove(); }
  }
  tank.style.touchAction = "manipulation";   // so a double tap feeds the fish instead of zooming
  tank.addEventListener("dblclick", e => {
    if (e.target !== tank && !e.target.classList.contains("school-light")) return;
    for (let i = 0; i < 5; i++) dropPellet(e.clientX, e.clientY, 22);   // double tap = 5 food
  });
  let press = null;
  tank.addEventListener("pointerdown", e => {
    if (e.target !== tank) return;
    press = setTimeout(() => dropPellet(e.clientX, e.clientY), 550);   // long-press also drops food
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach(ev => tank.addEventListener(ev, () => clearTimeout(press)));

  const lead = { x: 0, y: 0, dir: 1, t: 0 };
  let last = performance.now();

  function frame(now) {
    if (!tank.isConnected) return;            // the page changed, stop
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const W = tank.clientWidth, H = tank.clientHeight;
    lead.t += dt;
    const nx = W / 2 + Math.sin(lead.t * 0.22) * W * 0.12;
    lead.dir = Math.cos(lead.t * 0.22) >= 0 ? 1 : -1;
    lead.x = nx;
    lead.y = H / 2 + Math.sin(lead.t * 0.31) * H * 0.06;

    pellets.forEach((p, i) => {
      p.y = Math.min(H - 8, p.y + 34 * dt);
      p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    });

    swimmers.forEach(s => {
      s.phase += dt * 2.2;
      let tx = lead.x + s.fx * W * 0.9 - s.w / 2;
      let ty = lead.y + s.fy * H * 0.8 + Math.sin(s.phase) * 8 - s.h / 2;
      let ease = 1 - Math.pow(0.35, dt);
      // hungry? swim to the closest pellet and eat it
      let near = null, best = 1e9;
      pellets.forEach(p => { const d = Math.hypot(p.x - s.x - s.w / 2, p.y - s.y - s.h / 2); if (d < best) { best = d; near = p; } });
      if (near && best < Math.max(W, H) * 0.7) {
        tx = near.x - s.w / 2; ty = near.y - s.h / 2;
        ease = 1 - Math.pow(0.05, dt);       // swim to food a little faster than normal
      }
      const before = s.x;
      s.x += (tx - s.x) * ease;
      s.y += (ty - s.y) * ease;
      s.x = Math.max(0, Math.min(W - s.w, s.x));
      s.y = Math.max(34, Math.min(H - s.h - 4, s.y));
      // eat the food as soon as it is inside the fish's body (so food on the bottom or top is still reachable)
      if (near && pellets.indexOf(near) !== -1 &&
          near.x >= s.x - 4 && near.x <= s.x + s.w + 4 && near.y >= s.y - 4 && near.y <= s.y + s.h + 8) {
        const gone = near.el;
        pellets.splice(pellets.indexOf(near), 1);
        gone.style.transition = "opacity .15s";
        gone.style.opacity = "0";
        setTimeout(() => gone.remove(), 160);
        s.chomp = 0.25;                          // a little "munch" pulse
      }
      if (s.chomp > 0) s.chomp -= dt;
      if (s.x - before > 0.15) s.dir = 1; else if (s.x - before < -0.15) s.dir = -1;
      s.el.style.transform = `translate(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px)`;
      s.img.style.transform = `scaleX(${s.dir}) rotate(${(Math.sin(s.phase) * 4).toFixed(1)}deg) scale(${s.chomp > 0 ? 1.18 : 1})`;
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// ----- Tomodachi: an animal builder + zoo -----
const ANIMAL_OPTS = [["cat", "Cat"], ["dog", "Dog"], ["bunny", "Bunny"], ["bear", "Bear"], ["fox", "Fox"], ["panda", "Panda"]];
// Starting look when you switch animal (you can change everything afterwards)
const ANIMAL_DEFAULTS = {
  cat:   { fur: "#e8a86b", pattern: "tabby",  patternColor: "#c27a3a" },
  dog:   { fur: "#d8b892", pattern: "solid",  patternColor: "#684f48" },
  bunny: { fur: "#ffffff", pattern: "solid",  patternColor: "#f0c9a0" },
  bear:  { fur: "#6b5a52", pattern: "solid",  patternColor: "#f0c9a0" },
  fox:   { fur: "#e8a86b", pattern: "tuxedo", patternColor: "#ffffff" },
  panda: { fur: "#ffffff", pattern: "solid",  patternColor: "#33302f" }
};
const BODY_OPTS = [["slim", "Slim"], ["round", "Round"], ["chonky", "Chonky"]];
const EAR_OPTS = [["pointy", "Pointy"], ["round", "Round"], ["folded", "Folded"]];
const PATTERN_OPTS = [["solid", "Solid"], ["tabby", "Tabby stripes"], ["spots", "Spots"], ["tuxedo", "Tuxedo"], ["calico", "Calico"], ["points", "Pointed"]];
const FUR_COLORS = [["#f5e6d3", "Cream"], ["#ffffff", "White"], ["#e8a86b", "Ginger"], ["#a9a9ad", "Gray"], ["#6b5a52", "Brown"], ["#33302f", "Black"], ["#d8b892", "Sand"]];
const PATTERN_COLORS = [["#ffffff", "White"], ["#c27a3a", "Dark ginger"], ["#684f48", "Chocolate"], ["#7d7d82", "Slate"], ["#33302f", "Black"], ["#f0c9a0", "Peach"]];
const EYE_COLORS = [["#6fb36b", "Green"], ["#e5b93c", "Amber"], ["#5b9bd5", "Blue"], ["#b6733a", "Copper"], ["#7cc6c0", "Teal"]];

function pickOption(list, value, fallback) {
  return list.some(x => x[0] === value) ? value : fallback;
}

// Only values from the lists above are ever used, so a cat is always safe to draw
function sanitizeCat(c) {
  c = c && typeof c === "object" ? c : {};
  return {
    animal: pickOption(ANIMAL_OPTS, c.animal, "cat"),
    name: String(c.name || "").slice(0, 20),
    body: pickOption(BODY_OPTS, c.body, "round"),
    ears: pickOption(EAR_OPTS, c.ears, "pointy"),
    pattern: pickOption(PATTERN_OPTS, c.pattern, "tabby"),
    fur: pickOption(FUR_COLORS, c.fur, "#e8a86b"),
    patternColor: pickOption(PATTERN_COLORS, c.patternColor, "#c27a3a"),
    eyes: pickOption(EYE_COLORS, c.eyes, "#6fb36b")
  };
}

function currentCat() {
  return sanitizeCat(state.catDraft || (state.user && state.user.cat));
}

// Draws the cat as an SVG picture. `px` (optional) sets a fixed width for downloading.
function catSvg(cfg, px, uid) {
  uid = uid || "";
  const ink = "#684f48", pink = "#f4b6c2";
  const b = { slim: { rx: 56, ry: 62 }, round: { rx: 72, ry: 62 }, chonky: { rx: 90, ry: 68 } }[cfg.body];
  const cy = 235, bottom = cy + b.ry;
  const fur = cfg.fur, pc = cfg.patternColor, pat = cfg.pattern;
  const pointed = pat === "points";
  const tailFill = pointed ? pc : fur;
  const earFill = pointed ? pc : fur;
  const pawFill = (pat === "tuxedo" || pointed) ? pc : fur;
  const mirror = x => 300 - x;

  // tail
  const tx = 150 + b.rx - 12;
  const tail = `M${tx} 255 C${tx + 45} 262 ${tx + 58} 200 ${tx + 28} 172`;

  // ears
  let ears = "";
  if (cfg.ears === "pointy") {
    ears = `
      <path d="M92 112 L90 36 L144 78 Z" fill="${earFill}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M${mirror(92)} 112 L${mirror(90)} 36 L${mirror(144)} 78 Z" fill="${earFill}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M101 100 L100 56 L130 80 Z" fill="${pink}"/>
      <path d="M${mirror(101)} 100 L${mirror(100)} 56 L${mirror(130)} 80 Z" fill="${pink}"/>`;
  } else if (cfg.ears === "round") {
    ears = `
      <circle cx="104" cy="70" r="26" fill="${earFill}" stroke="${ink}" stroke-width="3"/>
      <circle cx="196" cy="70" r="26" fill="${earFill}" stroke="${ink}" stroke-width="3"/>
      <circle cx="104" cy="72" r="13" fill="${pink}"/>
      <circle cx="196" cy="72" r="13" fill="${pink}"/>`;
  } else {
    ears = `
      <ellipse cx="108" cy="86" rx="26" ry="17" transform="rotate(-30 108 86)" fill="${earFill}" stroke="${ink}" stroke-width="3"/>
      <ellipse cx="192" cy="86" rx="26" ry="17" transform="rotate(30 192 86)" fill="${earFill}" stroke="${ink}" stroke-width="3"/>`;
  }

  // patterns (body part and head part)
  let bodyPat = "", headPat = "";
  if (pat === "tabby") {
    bodyPat = [208, 230, 252].map(y => `
      <path d="M${150 - b.rx} ${y} L${150 - b.rx + 34} ${y + 4}" stroke="${pc}" stroke-width="8" stroke-linecap="round"/>
      <path d="M${150 + b.rx} ${y} L${150 + b.rx - 34} ${y + 4}" stroke="${pc}" stroke-width="8" stroke-linecap="round"/>`).join("");
    headPat = `
      <path d="M150 72 L150 96 M132 75 L135 94 M168 75 L165 94 M84 124 L108 128 M84 140 L106 142 M216 124 L192 128 M216 140 L194 142"
        stroke="${pc}" stroke-width="6" stroke-linecap="round" fill="none"/>`;
  } else if (pat === "spots") {
    bodyPat = `<circle cx="120" cy="230" r="14" fill="${pc}"/><circle cx="185" cy="245" r="16" fill="${pc}"/>
      <circle cx="150" cy="206" r="9" fill="${pc}"/><circle cx="202" cy="214" r="9" fill="${pc}"/>`;
    headPat = `<circle cx="112" cy="98" r="11" fill="${pc}"/><circle cx="190" cy="102" r="9" fill="${pc}"/>`;
  } else if (pat === "tuxedo") {
    bodyPat = `<ellipse cx="150" cy="232" rx="30" ry="46" fill="${pc}"/>`;
    headPat = `<path d="M150 72 C138 100 132 122 150 150 C168 122 162 100 150 72 Z" fill="${pc}"/>
      <ellipse cx="150" cy="152" rx="26" ry="18" fill="${pc}"/>`;
  } else if (pat === "calico") {
    bodyPat = `<ellipse cx="115" cy="235" rx="26" ry="30" fill="#5b4a45"/><ellipse cx="190" cy="225" rx="28" ry="26" fill="${pc}"/>`;
    headPat = `<ellipse cx="108" cy="100" rx="26" ry="22" fill="${pc}"/><ellipse cx="194" cy="106" rx="22" ry="20" fill="#5b4a45"/>`;
  } else if (pointed) {
    headPat = `<ellipse cx="150" cy="146" rx="34" ry="30" fill="${pc}" opacity="0.9"/>`;
  }

  // face
  const eyes = [125, 175].map(x => `
    <ellipse cx="${x}" cy="126" rx="13" ry="14" fill="${cfg.eyes}" stroke="${ink}" stroke-width="2"/>
    <ellipse cx="${x}" cy="127" rx="4.5" ry="11" fill="#2b2220"/>
    <circle cx="${x + 4}" cy="121" r="3.5" fill="#ffffff"/>`).join("");

  const name = cfg.name
    ? `<text x="150" y="333" text-anchor="middle" font-size="20" font-weight="700" fill="${ink}" font-family="Comfortaa, 'Segoe UI', sans-serif">${escapeHtml(cfg.name)}</text>` : "";
  const size = px ? ` width="${px}" height="${Math.round(px * 345 / 300)}"` : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 345"${size} role="img" aria-label="Your cat">
    <defs>
      <clipPath id="catBodyClip${uid}"><ellipse cx="150" cy="${cy}" rx="${b.rx}" ry="${b.ry}"/></clipPath>
      <clipPath id="catHeadClip${uid}"><ellipse cx="150" cy="130" rx="66" ry="58"/></clipPath>
    </defs>
    <path d="${tail}" fill="none" stroke="${ink}" stroke-width="28" stroke-linecap="round"/>
    <path d="${tail}" fill="none" stroke="${tailFill}" stroke-width="22" stroke-linecap="round"/>
    <ellipse cx="150" cy="${cy}" rx="${b.rx}" ry="${b.ry}" fill="${fur}"/>
    <g clip-path="url(#catBodyClip${uid})">${bodyPat}</g>
    <ellipse cx="150" cy="${cy}" rx="${b.rx}" ry="${b.ry}" fill="none" stroke="${ink}" stroke-width="3"/>
    <ellipse cx="122" cy="${bottom - 6}" rx="20" ry="11" fill="${pawFill}" stroke="${ink}" stroke-width="3"/>
    <ellipse cx="178" cy="${bottom - 6}" rx="20" ry="11" fill="${pawFill}" stroke="${ink}" stroke-width="3"/>
    ${ears}
    <ellipse cx="150" cy="130" rx="66" ry="58" fill="${fur}"/>
    <g clip-path="url(#catHeadClip${uid})">${headPat}</g>
    <ellipse cx="150" cy="130" rx="66" ry="58" fill="none" stroke="${ink}" stroke-width="3"/>
    ${eyes}
    <circle cx="108" cy="150" r="9" fill="${pink}" opacity="0.5"/>
    <circle cx="192" cy="150" r="9" fill="${pink}" opacity="0.5"/>
    <path d="M144 140 L156 140 L150 148 Z" fill="#f2a0b0" stroke="${ink}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M150 148 Q143 158 135 154 M150 148 Q157 158 165 154" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>
    <path d="M118 148 L78 140 M118 154 L76 156 M118 160 L80 170 M182 148 L222 140 M182 154 L224 156 M182 160 L220 170"
      stroke="${ink}" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
    ${name}
  </svg>`;
}


// Dog, bunny, bear, fox and panda share the cat's body and pattern options but have their own
// ears, face, and tail.
function animalSvg(cfg, px, uid) {
  uid = uid || "";
  const ink = "#684f48", pink = "#f4b6c2", dark = "#33302f";
  const a = cfg.animal;
  const b = { slim: { rx: 56, ry: 62 }, round: { rx: 72, ry: 62 }, chonky: { rx: 90, ry: 68 } }[cfg.body];
  const cy = 235, bottom = cy + b.ry;
  const fur = cfg.fur, pc = cfg.patternColor, pat = cfg.pattern;
  const panda = a === "panda";
  const pawFill = panda ? dark : (pat === "tuxedo" ? pc : fur);
  const earFill = panda ? dark : fur;
  const stroke = `stroke="${ink}" stroke-width="3"`;
  const mirror = x => 300 - x;

  // tail
  const tx = 150 + b.rx - 12;
  let tail = "";
  if (a === "dog") {
    const d = `M${tx} 250 C${tx + 36} 240 ${tx + 44} 205 ${tx + 30} 178`;
    tail = `<path d="${d}" fill="none" stroke="${ink}" stroke-width="22" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${fur}" stroke-width="16" stroke-linecap="round"/>`;
  } else if (a === "fox") {
    tail = `<path d="M${tx} 262 C${tx + 70} 270 ${tx + 84} 190 ${tx + 40} 160 C${tx + 30} 200 ${tx + 10} 220 ${tx - 6} 226 Z" fill="${fur}" ${stroke} stroke-linejoin="round"/>
      <path d="M${tx + 40} 160 C${tx + 58} 172 ${tx + 70} 186 ${tx + 74} 204 C${tx + 60} 196 ${tx + 48} 190 ${tx + 36} 190 Z" fill="#ffffff" ${stroke} stroke-linejoin="round"/>`;
  } else {
    const r = a === "bunny" ? 17 : 13;
    tail = `<circle cx="${tx + 14}" cy="${bottom - 22}" r="${r}" fill="${panda ? "#ffffff" : fur}" ${stroke}/>`;
  }

  // ears
  let ears = "";
  if (a === "dog") {
    ears = `
      <ellipse cx="86" cy="120" rx="22" ry="42" transform="rotate(14 86 120)" fill="${pat === "solid" ? fur : pc}" ${stroke}/>
      <ellipse cx="214" cy="120" rx="22" ry="42" transform="rotate(-14 214 120)" fill="${pat === "solid" ? fur : pc}" ${stroke}/>`;
  } else if (a === "bunny") {
    ears = `
      <ellipse cx="116" cy="40" rx="18" ry="54" transform="rotate(-8 116 40)" fill="${fur}" ${stroke}/>
      <ellipse cx="184" cy="40" rx="18" ry="54" transform="rotate(8 184 40)" fill="${fur}" ${stroke}/>
      <ellipse cx="116" cy="44" rx="8" ry="38" transform="rotate(-8 116 44)" fill="${pink}"/>
      <ellipse cx="184" cy="44" rx="8" ry="38" transform="rotate(8 184 44)" fill="${pink}"/>`;
  } else if (a === "fox") {
    ears = `
      <path d="M88 110 L82 24 L142 78 Z" fill="${fur}" ${stroke} stroke-linejoin="round"/>
      <path d="M${mirror(88)} 110 L${mirror(82)} 24 L${mirror(142)} 78 Z" fill="${fur}" ${stroke} stroke-linejoin="round"/>
      <path d="M96 98 L92 52 L126 80 Z" fill="${dark}"/>
      <path d="M${mirror(96)} 98 L${mirror(92)} 52 L${mirror(126)} 80 Z" fill="${dark}"/>`;
  } else {   // bear and panda: round ears
    ears = `
      <circle cx="98" cy="78" r="23" fill="${earFill}" ${stroke}/>
      <circle cx="202" cy="78" r="23" fill="${earFill}" ${stroke}/>
      ${panda ? "" : `<circle cx="98" cy="80" r="11" fill="${pink}"/><circle cx="202" cy="80" r="11" fill="${pink}"/>`}`;
  }

  // patterns
  let bodyPat = "", headPat = "";
  if (pat === "tabby") {
    bodyPat = [208, 230, 252].map(y => `
      <path d="M${150 - b.rx} ${y} L${150 - b.rx + 34} ${y + 4}" stroke="${pc}" stroke-width="8" stroke-linecap="round"/>
      <path d="M${150 + b.rx} ${y} L${150 + b.rx - 34} ${y + 4}" stroke="${pc}" stroke-width="8" stroke-linecap="round"/>`).join("");
    headPat = `<path d="M150 72 L150 96 M132 75 L135 94 M168 75 L165 94" stroke="${pc}" stroke-width="6" stroke-linecap="round" fill="none"/>`;
  } else if (pat === "spots") {
    bodyPat = `<circle cx="120" cy="230" r="14" fill="${pc}"/><circle cx="185" cy="245" r="16" fill="${pc}"/><circle cx="150" cy="206" r="9" fill="${pc}"/>`;
    headPat = `<circle cx="112" cy="98" r="11" fill="${pc}"/><circle cx="190" cy="102" r="9" fill="${pc}"/>`;
  } else if (pat === "tuxedo") {
    bodyPat = `<ellipse cx="150" cy="232" rx="30" ry="46" fill="${pc}"/>`;
    headPat = `<ellipse cx="150" cy="158" rx="40" ry="26" fill="${pc}"/>`;
  } else if (pat === "calico") {
    bodyPat = `<ellipse cx="115" cy="235" rx="26" ry="30" fill="#5b4a45"/><ellipse cx="190" cy="225" rx="28" ry="26" fill="${pc}"/>`;
    headPat = `<ellipse cx="108" cy="100" rx="26" ry="22" fill="${pc}"/><ellipse cx="194" cy="106" rx="22" ry="20" fill="#5b4a45"/>`;
  } else if (pat === "points") {
    headPat = `<ellipse cx="150" cy="146" rx="34" ry="30" fill="${pc}" opacity="0.9"/>`;
  }
  if (panda) {   // panda eye patches, always
    headPat += `<ellipse cx="118" cy="128" rx="19" ry="25" transform="rotate(22 118 128)" fill="${dark}"/>
      <ellipse cx="182" cy="128" rx="19" ry="25" transform="rotate(-22 182 128)" fill="${dark}"/>`;
  }

  // face
  const eyeCol = panda ? "#ffffff" : cfg.eyes;
  const eyes = [122, 178].map(x => `
    <circle cx="${x}" cy="126" r="${panda ? 9 : 12}" fill="${eyeCol}" stroke="${panda ? dark : ink}" stroke-width="2"/>
    <circle cx="${x}" cy="127" r="${panda ? 5 : 7}" fill="#2b2220"/>
    <circle cx="${x + 3}" cy="122" r="2.8" fill="#ffffff"/>`).join("");

  let snout = "";
  if (a === "dog") {
    snout = `<ellipse cx="150" cy="152" rx="32" ry="24" fill="#fff6e4" ${stroke} opacity="0.95"/>
      <ellipse cx="150" cy="141" rx="11" ry="8" fill="${dark}"/>
      <path d="M150 149 L150 158 M150 158 Q140 168 132 160 M150 158 Q160 168 168 160" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="150" cy="168" rx="8" ry="6" fill="#f2a0b0"/>`;
  } else if (a === "bunny") {
    snout = `<ellipse cx="150" cy="150" rx="24" ry="18" fill="#fff6e4" opacity="0.9"/>
      <path d="M144 142 L156 142 L150 150 Z" fill="#f2a0b0" stroke="${ink}" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M150 150 Q143 160 135 156 M150 150 Q157 160 165 156" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>
      <rect x="144" y="157" width="6" height="10" rx="1.5" fill="#ffffff" ${stroke.replace('stroke-width="3"', 'stroke-width="1.5"')}/>
      <rect x="150" y="157" width="6" height="10" rx="1.5" fill="#ffffff" ${stroke.replace('stroke-width="3"', 'stroke-width="1.5"')}/>`;
  } else if (a === "fox") {
    snout = `<path d="M96 150 C110 138 130 148 150 140 C170 148 190 138 204 150 C196 174 170 186 150 186 C130 186 104 174 96 150 Z" fill="#ffffff" opacity="0.95"/>
      <ellipse cx="150" cy="144" rx="9" ry="7" fill="${dark}"/>
      <path d="M150 150 Q142 162 132 156 M150 150 Q158 162 168 156" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/>`;
  } else {   // bear, panda
    snout = `<ellipse cx="150" cy="154" rx="28" ry="22" fill="${panda ? "#ffffff" : "#f3dcc2"}" ${stroke.replace('stroke-width="3"', 'stroke-width="2"')} opacity="0.95"/>
      <ellipse cx="150" cy="145" rx="10" ry="7" fill="${dark}"/>
      <path d="M150 152 L150 160 M150 160 Q141 168 133 162 M150 160 Q159 168 167 162" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/>`;
  }

  const name = cfg.name
    ? `<text x="150" y="333" text-anchor="middle" font-size="20" font-weight="700" fill="${ink}" font-family="Comfortaa, 'Segoe UI', sans-serif">${escapeHtml(cfg.name)}</text>` : "";
  const size = px ? ` width="${px}" height="${Math.round(px * 345 / 300)}"` : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 345"${size} role="img" aria-label="Your ${a}">
    <defs>
      <clipPath id="catBodyClip${uid}"><ellipse cx="150" cy="${cy}" rx="${b.rx}" ry="${b.ry}"/></clipPath>
      <clipPath id="catHeadClip${uid}"><ellipse cx="150" cy="130" rx="66" ry="58"/></clipPath>
    </defs>
    ${tail}
    <ellipse cx="150" cy="${cy}" rx="${b.rx}" ry="${b.ry}" fill="${fur}"/>
    <g clip-path="url(#catBodyClip${uid})">${bodyPat}</g>
    <ellipse cx="150" cy="${cy}" rx="${b.rx}" ry="${b.ry}" fill="none" ${stroke}/>
    <ellipse cx="122" cy="${bottom - 6}" rx="20" ry="11" fill="${pawFill}" ${stroke}/>
    <ellipse cx="178" cy="${bottom - 6}" rx="20" ry="11" fill="${pawFill}" ${stroke}/>
    ${ears}
    <ellipse cx="150" cy="130" rx="66" ry="58" fill="${fur}"/>
    <g clip-path="url(#catHeadClip${uid})">${headPat}</g>
    <ellipse cx="150" cy="130" rx="66" ry="58" fill="none" ${stroke}/>
    ${snout}
    ${eyes}
    <circle cx="100" cy="152" r="9" fill="${pink}" opacity="0.5"/>
    <circle cx="200" cy="152" r="9" fill="${pink}" opacity="0.5"/>
    ${name}
  </svg>`;
}

// Draws whichever animal the settings ask for
function petSvg(cfg, px, uid) {
  return cfg.animal === "cat" ? catSvg(cfg, px, uid) : animalSvg(cfg, px, uid);
}

function chipGroup(label, field, options, current) {
  return `
    <div class="opt-group">
      <div class="icon-label">${label}</div>
      <div class="chips">
        ${options.map(o => `<button type="button" class="chip ${o[0] === current ? "selected" : ""}" onclick="setCat('${field}', '${o[0]}')">${escapeHtml(o[1])}</button>`).join("")}
      </div>
    </div>`;
}

function swatchGroup(label, field, options, current) {
  return `
    <div class="opt-group">
      <div class="icon-label">${label}</div>
      <div class="swatches">
        ${options.map(o => `<button type="button" class="swatch ${o[0] === current ? "selected" : ""}" style="background:${o[0]}"
          title="${escapeHtml(o[1])}" aria-label="${escapeHtml(o[1])}" onclick="setCat('${field}', '${o[0]}')"></button>`).join("")}
      </div>
    </div>`;
}

function renderTomodachiTab() {
  if (state.zooOpen) return renderZooView();
  const cat = currentCat();
  return `
    <section class="page fit tomo-page">
      <div class="page-head head-left">
        <h2>Tomodachi <span>animal builder</span></h2>
        <button type="button" onclick="openZoo()">Zoo</button>
      </div>
      <p class="intro">Pick an animal, color it, then save it to move into the Zoo or download it.</p>
      ${messageBoxes()}
      <div class="cat-builder fit-body">
        <div class="cat-stage" id="catStage">${petSvg(cat)}</div>
        <div class="cat-options">
          <input type="text" id="catName" value="${escapeHtml(cat.name)}" maxlength="20" placeholder="Your pet's name" oninput="setCatName(this.value)">
          ${chipGroup("Animal", "animal", ANIMAL_OPTS, cat.animal)}
          ${chipGroup("Body", "body", BODY_OPTS, cat.body)}
          ${cat.animal === "cat" ? chipGroup("Ears", "ears", EAR_OPTS, cat.ears) : ""}
          ${swatchGroup("Fur color", "fur", FUR_COLORS, cat.fur)}
          ${chipGroup("Fur pattern", "pattern", PATTERN_OPTS, cat.pattern)}
          ${swatchGroup("Pattern / spot color", "patternColor", PATTERN_COLORS, cat.patternColor)}
          ${swatchGroup("Eye color", "eyes", EYE_COLORS, cat.eyes)}
          <div class="form-row cat-buttons">
            <button type="button" onclick="saveCat()">Save my animal</button>
            <button type="button" onclick="downloadCat()">Download PNG</button>
            <button type="button" class="small" onclick="randomCat()">Randomize</button>
          </div>
          
        </div>
      </div>
    </section>
  `;
}

function setCat(field, value) {
  const cat = currentCat();
  cat[field] = value;
  if (field === "animal" && ANIMAL_DEFAULTS[value]) Object.assign(cat, ANIMAL_DEFAULTS[value]);
  state.catDraft = sanitizeCat(cat);
  state.successMsg = "";
  render(true);
}

function setCatName(value) {
  const cat = currentCat();
  cat.name = value;
  state.catDraft = sanitizeCat(cat);
  const stage = document.getElementById("catStage");
  if (stage) stage.innerHTML = petSvg(state.catDraft);
}

function randomCat() {
  const rand = list => list[Math.floor(Math.random() * list.length)][0];
  state.catDraft = sanitizeCat({
    animal: currentCat().animal, name: currentCat().name, body: rand(BODY_OPTS), ears: rand(EAR_OPTS), pattern: rand(PATTERN_OPTS),
    fur: rand(FUR_COLORS), patternColor: rand(PATTERN_COLORS), eyes: rand(EYE_COLORS)
  });
  state.successMsg = "";
  render(true);
}

function saveCat() {
  const cat = currentCat();
  const users = loadUsers();
  const account = users[state.user.username];
  if (!account) { state.errorMsg = "Couldn't find your account."; render(true); return; }
  account.cat = cat;
  try { saveUsers(users); }
  catch (e) { state.errorMsg = "Couldn't save. Is browser storage turned off?"; render(true); return; }
  state.user = userFromAccount(state.user.username, account);
  state.catDraft = null;
  state.errorMsg = "";
  state.successMsg = "Saved! Your animal will be here next time, and it's now living in the Zoo.";
  try { putInZoo(cat); } catch (e) { state.successMsg = "Saved! (The Zoo couldn't be updated: browser storage is full or off.)"; }
  render(true);
}

// Turn the cat picture into a PNG file and download it
function downloadCat() {
  const cat = currentCat();
  const img = new Image();
  img.onload = () => {
    const w = 900, h = Math.round(w * 345 / 300);
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff6e4";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    const link = document.createElement("a");
    link.download = ((cat.name || "my-" + cat.animal).replace(/[^\w-]+/g, "-")) + ".png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  img.onerror = () => { state.errorMsg = "Couldn't make the picture. Try again."; render(true); };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(petSvg(cat, 900));
}


// ----- The Zoo -----
// Every saved animal (visitors' and the developer's) lives here, walking around a forest and
// meeting each other. Like the fish, the list is kept in this browser's storage; loadZoo /
// saveZoo are the only two functions to change if you add an online database.
const ZOO_KEY = "aconite_zoo";
const ZOO_MAX = 40;

function loadZoo() {
  try {
    const list = JSON.parse(localStorage.getItem(ZOO_KEY));
    return Array.isArray(list) ? list.filter(z => z && z.id && z.cat).map(z => ({ ...z, cat: sanitizeCat(z.cat) })) : [];
  } catch (e) { return []; }
}
function saveZoo(list) {
  localStorage.setItem(ZOO_KEY, JSON.stringify(list));
}

// One animal per account: saving again replaces your old one
function putInZoo(cat) {
  const me = state.user;
  const list = loadZoo().filter(z => z.owner !== me.username);
  list.unshift({
    id: "pet-" + me.username,
    owner: me.username,
    by: me.isDeveloper ? SITE_NAME : (me.name || me.username),
    isDev: !!me.isDeveloper,
    time: Date.now(),
    cat: cat
  });
  saveZoo(list.slice(0, ZOO_MAX));
}

function removeFromZoo(id) {
  const me = state.user;
  const list = loadZoo();
  const target = list.find(z => z.id === id);
  if (!target || !(target.owner === me.username || me.isDeveloper)) return;   // only the owner or the developer
  if (!confirm("Remove this animal from the zoo?")) return;
  try { saveZoo(list.filter(z => z.id !== id)); } catch (e) {}
  render(true);
}

function openZoo() { state.zooOpen = true; state.errorMsg = ""; state.successMsg = ""; render(); }
function closeZoo() { state.zooOpen = false; render(); }

// A forest drawn in SVG. The colors come from CSS variables, so it switches with dark mode.
function forestSvg() {
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const pine = (x, base, h, w, cls) => `
    <g class="${cls}">
      <rect x="${x - w * 0.07}" y="${base - h * 0.18}" width="${w * 0.14}" height="${h * 0.18}" class="trunk"/>
      <polygon points="${x},${base - h} ${x - w / 2},${base - h * 0.3} ${x + w / 2},${base - h * 0.3}"/>
      <polygon points="${x},${base - h * 0.78} ${x - w * 0.58},${base - h * 0.12} ${x + w * 0.58},${base - h * 0.12}"/>
    </g>`;
  let far = "", mid = "", near = "", stars = "", flies = "";
  for (let x = -20; x < 1040; x += 38) far += pine(x + rnd() * 14, 330, 150 + rnd() * 60, 70 + rnd() * 20, "tree-far");
  for (let x = -10; x < 1040; x += 70) mid += pine(x + rnd() * 30, 360, 210 + rnd() * 70, 105 + rnd() * 25, "tree-mid");
  for (const x of [40, 330, 690, 960]) near += pine(x + rnd() * 30, 420, 330 + rnd() * 50, 150, "tree-near");
  for (let i = 0; i < 36; i++) stars += `<circle cx="${(rnd() * 1000).toFixed(0)}" cy="${(rnd() * 160).toFixed(0)}" r="${(0.8 + rnd() * 1.4).toFixed(1)}"/>`;
  for (let i = 0; i < 14; i++) flies += `<circle cx="${(rnd() * 1000).toFixed(0)}" cy="${(200 + rnd() * 190).toFixed(0)}" r="3" style="animation-delay:-${(rnd() * 6).toFixed(1)}s"/>`;
  return `
    <svg class="forest" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <rect class="sky" width="1000" height="420"/>
      <g class="stars">${stars}</g>
      <circle class="sun" cx="840" cy="78" r="34"/>
      <g class="far">${far}</g>
      <g class="mid">${mid}</g>
      <rect class="ground" y="330" width="1000" height="90"/>
      <g class="near">${near}</g>
      <g class="fireflies">${flies}</g>
    </svg>`;
}

function renderZooView() {
  const me = state.user || {};
  const zoo = loadZoo();
  return `
    <section class="page fit zoo-page">
      <div class="page-head head-left">
        <h2>Tomodachi <span>Zoo</span></h2>
        <button type="button" onclick="closeZoo()">\u2190 Back to builder</button>
      </div>
      <p class="intro">Everyone\u2019s saved animals live here <span class="count-pill">${zoo.length} ${zoo.length === 1 ? "animal" : "animals"}</span></p>
      <div class="fit-body"><div class="zoo-scene" id="zooScene">
        ${forestSvg()}
        ${zoo.length ? "" : `<p class="school-empty">The zoo is empty. Save an animal to be the first resident!</p>`}
      </div></div>
      ${zoo.length ? `
        <div class="zoo-list">
          ${zoo.map(z => `
            <span class="zoo-chip">${escapeHtml(z.cat.name || ANIMAL_OPTS.find(o => o[0] === z.cat.animal)[1])}
              <small>by ${escapeHtml(z.by || "a visitor")}</small>${z.isDev ? ` <span class="badge">Developer</span>` : ""}
              ${(z.owner === me.username || me.isDeveloper) ? `<button class="small danger" onclick="removeFromZoo('${escapeHtml(z.id)}')" aria-label="Remove from zoo">\u2715</button>` : ""}
            </span>`).join("")}
        </div>` : ""}
    </section>`;
}

function startZoo() {
  const scene = document.getElementById("zooScene");
  if (!scene) return;
  const zoo = loadZoo();
  const walkers = zoo.map((z, i) => {
    const el = document.createElement("div");
    el.className = "zoo-animal";
    const cfg = Object.assign({}, z.cat, { name: "" });         // the name is shown as a label instead
    el.innerHTML = `<div class="zoo-body">${petSvg(cfg, null, "z" + i)}</div>
      <span class="zoo-label">${escapeHtml(z.cat.name || z.by || "")}</span><span class="zoo-heart">\u2665</span>`;
    scene.appendChild(el);
    return {
      el: el, body: el.firstElementChild, heart: el.querySelector(".zoo-heart"),
      x: Math.random(), y: Math.random(), tx: Math.random(), ty: Math.random(),
      speed: 0.02 + Math.random() * 0.025, dir: 1, wait: Math.random() * 2, bob: Math.random() * 6, meet: 0, greetedAt: -99
    };
  });
  let last = performance.now(), clock = 0;

  function frame(now) {
    if (!scene.isConnected) return;               // the page changed, stop
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now; clock += dt;
    const W = scene.clientWidth, H = scene.clientHeight;
    const size = Math.max(70, Math.min(120, W / 7));
    const top = H * 0.55, span = Math.max(10, H * 0.45 - size * 1.45);   // animals walk on the grass band

    walkers.forEach(w => {
      w.el.style.width = size + "px";
      w.bob += dt * 6;
      if (w.meet > 0) {                           // saying hello: stand still
        w.meet -= dt;
        w.heart.style.opacity = w.meet > 0 ? 1 : 0;
      } else {
        w.heart.style.opacity = 0;
        if (w.wait > 0) w.wait -= dt;
        else {
          const dx = (w.tx - w.x) * W, dy = (w.ty - w.y) * span;
          const dist = Math.hypot(dx, dy);
          if (dist < 6) { w.tx = Math.random(); w.ty = Math.random(); w.wait = 1 + Math.random() * 3; }
          else {
            const step = Math.min(dist, w.speed * W * dt);
            w.x += (dx / dist) * step / W;
            w.y += (dy / dist) * step / span;
            if (Math.abs(dx) > 3) w.dir = dx > 0 ? 1 : -1;
          }
        }
        // meet a neighbour: both stop, face each other and show a heart
        walkers.forEach(o => {
          if (o === w || o.meet > 0 || w.meet > 0) return;
          if (clock - w.greetedAt < 8 || clock - o.greetedAt < 8) return;
          if (Math.abs(o.x - w.x) * W < size * 0.9 && Math.abs(o.y - w.y) * span < size * 0.5) {
            w.meet = o.meet = 2.2; w.greetedAt = o.greetedAt = clock;
            w.dir = o.x >= w.x ? 1 : -1; o.dir = -w.dir;
          }
        });
      }
      const px = w.x * Math.max(0, W - size), py = top + w.y * span;
      w.el.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px)`;
      w.el.style.zIndex = Math.round(py);
      const hop = w.meet > 0 || w.wait > 0 ? 0 : Math.abs(Math.sin(w.bob)) * 5;
      w.body.style.transform = `translateY(${(-hop).toFixed(1)}px) scaleX(${w.dir})`;
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}


// ----- Friends & chat -----
// Friend lists and messages are kept in this browser's storage (like accounts, fish and the zoo), so
// they work between accounts that are used on the SAME browser. To chat across different devices you'd
// need a small server; loadSocial/saveSocial and loadChats/saveChats are the only functions to change.
const FRIENDS_KEY = "aconite_friends";   // { username: { friends: [], incoming: [], outgoing: [] } }
const CHATS_KEY = "aconite_chats";       // { "userA\nuserB": [ { from, text, t } ] }
const REPORTS_KEY = "aconite_reports";   // [ { id, from, about, reason, time, messages } ] (read by the developer)
const CHAT_MAX = 200;                    // each conversation keeps its newest 200 messages

function strList(a) { return Array.isArray(a) ? a.filter(x => typeof x === "string") : []; }
function loadSocial() {
  try { const o = JSON.parse(localStorage.getItem(FRIENDS_KEY)); return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
  catch (e) { return {}; }
}
function saveSocial(all) { localStorage.setItem(FRIENDS_KEY, JSON.stringify(all)); }
function loadChats() {
  try { const o = JSON.parse(localStorage.getItem(CHATS_KEY)); return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
  catch (e) { return {}; }
}
function saveChats(all) { localStorage.setItem(CHATS_KEY, JSON.stringify(all)); }
function loadReports() {
  try { const l = JSON.parse(localStorage.getItem(REPORTS_KEY)); return Array.isArray(l) ? l.filter(r => r && r.id && r.from && r.about) : []; }
  catch (e) { return []; }
}
function saveReports(list) { localStorage.setItem(REPORTS_KEY, JSON.stringify(list)); }

// Nicknames and blocks are private: they are saved inside your own account
function getNick(me, other) {
  const acct = loadUsers()[me];
  const n = acct && acct.nicks && typeof acct.nicks === "object" ? acct.nicks[other] : "";
  return typeof n === "string" ? n : "";
}
function blockedOf(me) {
  const acct = loadUsers()[me];
  return acct && Array.isArray(acct.blocked) ? acct.blocked.filter(x => typeof x === "string") : [];
}
function isBlocked(me, other) { return blockedOf(me).includes(other); }
// The name you see for someone: your nickname for them, otherwise their own display name
function friendLabel(key) {
  const me = state.user && state.user.username;
  return (me && getNick(me, key)) || displayName(key);
}

// ----- Unread messages (the notifications) -----
// "seen" (inside your own account) remembers, for each friend, the time of the last message of theirs you have read.
const BASE_TITLE = document.title;

// { friendUsername: { count, last } } for every friend who has sent you something you haven't read
function unreadMap(me) {
  const chats = loadChats(), acct = loadUsers()[me];
  const seen = acct && acct.seen && typeof acct.seen === "object" ? acct.seen : {};
  const out = {};
  socialOf(loadSocial(), me).friends.forEach(f => {
    const list = Array.isArray(chats[chatKey(me, f)]) ? chats[chatKey(me, f)] : [];
    const since = Number(seen[f]) || 0;
    const fresh = list.filter(m => m && m.from === f && typeof m.text === "string" && m.t > since);
    if (fresh.length) out[f] = { count: fresh.length, last: fresh[fresh.length - 1] };
  });
  return out;
}
function totalUnread(me) {
  const map = unreadMap(me);
  return Object.keys(map).reduce((n, k) => n + map[k].count, 0);
}
// Mark everything `other` has sent you as read
function markRead(me, other) {
  const list = loadChats()[chatKey(me, other)];
  if (!Array.isArray(list)) return;
  const latest = list.reduce((mx, m) => m && m.from === other && typeof m.t === "number" ? Math.max(mx, m.t) : mx, 0);
  if (!latest) return;
  const users = loadUsers(), acct = users[me];
  if (!acct) return;
  if (!acct.seen || typeof acct.seen !== "object") acct.seen = {};
  if ((Number(acct.seen[other]) || 0) >= latest) return;
  acct.seen[other] = latest;
  try { saveUsers(users); } catch (e) {}
}
function previewOf(text) {
  return "\u201c" + (text.length > 40 ? text.slice(0, 40) + "\u2026" : text) + "\u201d";
}
function unreadBadge(n) {
  return `<span class="unread-badge" title="${n} new" aria-label="${n} new messages">${n > 99 ? "99+" : n}</span>`;
}
// Update the red number on the menu button and the page title without redrawing the page
function updateUnreadBadges() {
  const n = state.user && state.view === "app" ? totalUnread(state.user.username) : 0;
  const dot = document.getElementById("navNotif");
  if (dot) { dot.textContent = n > 99 ? "99+" : String(n); dot.style.display = n ? "flex" : "none"; }
  document.title = (n ? "(" + n + ") " : "") + BASE_TITLE;
}

function socialOf(all, email) {
  const r = all[email] && typeof all[email] === "object" ? all[email] : {};
  return { friends: strList(r.friends), incoming: strList(r.incoming), outgoing: strList(r.outgoing) };
}
function chatKey(a, b) { return [a, b].sort().join("\n"); }
function isFriend(me, other) { return socialOf(loadSocial(), me).friends.includes(other); }

function displayName(key) {
  if (isDevKey(key)) return SITE_NAME;
  const acct = loadUsers()[key];
  return (acct && acct.name) || (isLegacyKey(key) ? "A visitor" : String(key));
}
// "@username" for showing to other people (never an email)
// " (developer)" beside the developer's name
function devTag(key) { return isDevKey(key) ? ` <span class="dev-tag">(developer)</span>` : ""; }
// The small round profile picture other people see: their picture, or just their initial
function profilePicOf(key) {
  if (isDevKey(key)) return PROFILE_SRC;
  const acct = loadUsers()[key];
  return acct && typeof acct.avatar === "string" ? acct.avatar : "";
}
function miniAvatar(key) {
  const letter = (Array.from(displayName(key).trim())[0] || "?").toUpperCase();
  const src = profilePicOf(key);
  return `<span class="mini-avatar">${src ? `<img src="${escapeHtml(src)}" alt="" onerror="this.remove()">` : ""}<b>${escapeHtml(letter)}</b></span>`;
}
function handleOf(key) { return isLegacyKey(key) ? "" : "@" + key; }
function timeLabel(t) {
  try { return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; }
}
function saveSocialSafe(all) {
  try { saveSocial(all); return true; }
  catch (e) { state.errorMsg = "Couldn't save. Is browser storage turned off?"; state.successMsg = ""; return false; }
}
// Make a and b friends and clear any pending requests between them
function makeFriends(all, a, b) {
  const ra = socialOf(all, a), rb = socialOf(all, b);
  ra.incoming = ra.incoming.filter(x => x !== b); ra.outgoing = ra.outgoing.filter(x => x !== b);
  rb.incoming = rb.incoming.filter(x => x !== a); rb.outgoing = rb.outgoing.filter(x => x !== a);
  if (!ra.friends.includes(b)) ra.friends.push(b);
  if (!rb.friends.includes(a)) rb.friends.push(a);
  all[a] = ra; all[b] = rb;
}

// `onName` (optional) is the name of a function to call when the person's name is clicked
function friendRow(user, buttons, active, note, onName) {
  const nicked = friendLabel(user) !== displayName(user);
  const sub = [handleOf(user), nicked ? displayName(user) : "", note].filter(Boolean).join(" · ");
  const click = onName
    ? ` clickable" role="button" tabindex="0" data-user="__U__" onclick="${onName}(this.dataset.user)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${onName}(this.dataset.user)}`
    : "";
  return `<div class="friend-row ${active ? "active" : ""}">
    ${miniAvatar(user)}
    <div class="friend-name${click}">${escapeHtml(friendLabel(user))}${devTag(user)}<small>${escapeHtml(sub)}</small></div>${buttons}</div>`;
}

// Everything someone has ticked off or added, as lowercase words, to compare two visitors
function favouritesOf(account) {
  const set = new Set();
  const lists = account && account.lists && typeof account.lists === "object" ? account.lists : {};
  Object.keys(lists).forEach(k => {
    if (Array.isArray(lists[k])) lists[k].forEach(x => { if (x && x.done && typeof x.title === "string") set.add(x.title.trim().toLowerCase()); });
  });
  (Array.isArray(account && account.interests) ? account.interests : []).forEach(i => {
    if (i && typeof i.title === "string") set.add("interest:" + i.title.trim().toLowerCase());
  });
  return set;
}

// Visitors you might want to add: not you, not already a friend, no request pending.
// People with mutual friends and shared interests come first, then the newest visitors.
function suggestedVisitors(me, limit) {
  const users = loadUsers(), all = loadSocial(), mine = socialOf(all, me);
  const skip = new Set([me].concat(mine.friends, mine.incoming, mine.outgoing));
  const myFavs = favouritesOf(users[me]);
  const myBlocked = blockedOf(me);
  return Object.keys(users)
    .filter(k => !isLegacyKey(k) && !skip.has(k) && !myBlocked.includes(k) && !blockedOf(k).includes(me))
    .map(k => {
      const mutual = socialOf(all, k).friends.filter(f => mine.friends.includes(f)).length;
      let shared = 0;
      favouritesOf(users[k]).forEach(t => { if (myFavs.has(t)) shared++; });
      return { username: k, mutual: mutual, shared: shared, score: mutual * 3 + shared, created: users[k].created || 0 };
    })
    .sort((a, b) => b.score - a.score || b.created - a.created || a.username.localeCompare(b.username))
    .slice(0, limit || 5);
}
function suggestionNote(s) {
  const bits = [];
  if (s.mutual) bits.push(s.mutual + (s.mutual === 1 ? " mutual friend" : " mutual friends"));
  if (s.shared) bits.push(s.shared + (s.shared === 1 ? " shared interest" : " shared interests"));
  return bits.length ? bits.join(", ") : "Also visiting";
}

// Lists show only a few people; a "See all" button on the heading line shows the rest
const SIDE_LIMIT = 2;     // Suggested visitors and My friends show this many
const PICK_LIMIT = 5;     // the big "Pick a friend" box shows this many
function seeAllBtn(key, total, limit) {
  if (total <= limit) return "";
  return `<button type="button" class="small see-all" onclick="openListPage('${key}')">See all</button>`;
}
function limited(list, key, limit) { return list.slice(0, limit); }

// The "See all" page: only that one list, with a Back button
const LIST_TITLES = { suggested: "Suggested visitors", friends: "My friends", pick: "Pick a friend to start chatting" };
function listPageHtml(key) {
  const me = state.user.username;
  const mine = socialOf(loadSocial(), me);
  const unread = unreadMap(me);
  const btn = (label, fn, cls) => `<button type="button" class="small ${cls || ""}" data-user="__U__" onclick="${fn}(this.dataset.user)">${label}</button>`;
  const withUser = (html, user) => html.split("__U__").join(escapeHtml(user));
  let rows = "", count = 0;

  if (key === "suggested") {
    const list = suggestedVisitors(me, 50);
    count = list.length;
    rows = list.map(s => withUser(friendRow(s.username, btn("Add", "addSuggested"), false, suggestionNote(s), "openProfile"), s.username)).join("");
  } else if (key === "friends") {
    const list = mine.friends;
    count = list.length;
    rows = list.map(u => withUser(friendRow(u, (unread[u] ? unreadBadge(unread[u].count) : "") + btn("Chat", "openChat"), false, "", "openProfile"), u)).join("");
  } else {
    const list = mine.friends.filter(u => !unread[u]);
    count = list.length;
    rows = list.map(u => withUser(friendRow(u, btn("Chat", "openChat"), false, "", "openChat"), u)).join("");
  }

  return `
    <section class="page fit friends-page list-page">
      <div class="page-head head-left">
        <h2>${escapeHtml(LIST_TITLES[key] || "Friends")} <span class="count-pill">${count}</span></h2>
        <button type="button" class="small" onclick="closeListPage()">← Back</button>
      </div>
      ${messageBoxes()}
      <div class="fit-body">
        <div class="list-page-body">
          ${rows || `<p class="note" style="margin:0">Nobody here right now.</p>`}
        </div>
      </div>
    </section>`;
}
function openListPage(key) {
  state.listPage = key;
  state.chatMenu = false;
  state.errorMsg = ""; state.successMsg = "";
  render();
}
function closeListPage() { state.listPage = null; state.errorMsg = ""; state.successMsg = ""; render(); }

function friendsSideHtml() {
  const me = state.user.username;
  const mine = socialOf(loadSocial(), me);
  const suggestions = suggestedVisitors(me, 50);
  const blocked = blockedOf(me);
  const unread = unreadMap(me);
  const unreadUsers = Object.keys(unread);
  const unreadTotalCount = unreadUsers.reduce((n, u) => n + unread[u].count, 0);
  const btn = (label, fn, cls) => `<button type="button" class="small ${cls || ""}" data-user="__U__" onclick="${fn}(this.dataset.user)">${label}</button>`;
  const withUser = (html, user) => html.split("__U__").join(escapeHtml(user));

  return `
    <p class="note" style="margin:0">Your username: <b>@${escapeHtml(me)}</b>. Share it so friends can add you.</p>
    ${unreadUsers.length ? `<div class="side-new-msgs"><h3>New messages <span class="count-pill">${unreadTotalCount}</span></h3>
      ${unreadUsers.map(u => withUser(friendRow(u, unreadBadge(unread[u].count) + btn("Open", "openChat"), false, previewOf(unread[u].last.text)), u)).join("")}</div>` : ""}
    <form class="auth-form" onsubmit="sendRequest(event)">
      <div class="icon-label">Add a visitor by their username</div>
      <div class="add-item-form" style="margin:0">
        <input type="text" id="friendUsername" placeholder="@username" maxlength="21" autocomplete="off" autocapitalize="none" spellcheck="false" required>
        <button type="submit">Add</button>
      </div>
    </form>
    ${mine.incoming.length ? `<h3>Requests <span class="count-pill">${mine.incoming.length}</span></h3>
      ${mine.incoming.map(u => withUser(friendRow(u, btn("Accept", "acceptRequest") + btn("Decline", "declineRequest", "danger")), u)).join("")}` : ""}
    <h3>Suggested visitors${seeAllBtn("suggested", suggestions.length, SIDE_LIMIT)}</h3>
    ${suggestions.length
      ? limited(suggestions, "suggested", SIDE_LIMIT).map(s => withUser(friendRow(s.username, btn("Add", "addSuggested"), false, suggestionNote(s), "openProfile"), s.username)).join("")
      : `<p class="note" style="margin:0">No suggestions right now. They appear as more visitors sign up.</p>`}
    ${mine.outgoing.length ? `<h3>Sent</h3>
      ${mine.outgoing.map(u => withUser(friendRow(u, btn("Cancel", "cancelRequest", "danger")), u)).join("")}` : ""}
    <h3>My friends <span class="count-pill">${mine.friends.length}</span>${seeAllBtn("friends", mine.friends.length, SIDE_LIMIT)}</h3>
    ${mine.friends.length
      ? limited(mine.friends, "friends", SIDE_LIMIT).map(u => withUser(friendRow(u, (unread[u] ? unreadBadge(unread[u].count) : "") + btn("Chat", "openChat"), state.chatWith === u, "", "openProfile"), u)).join("")
      : `<p class="note" style="margin:0">No friends yet. Add someone by their username, or pick from the suggestions.</p>`}
    ${blocked.length ? `<h3>Blocked <span class="count-pill">${blocked.length}</span></h3>
      ${blocked.map(u => withUser(friendRow(u, btn("Unblock", "unblockUser")), u)).join("")}` : ""}
    ${state.user.isDeveloper ? reportsHtml() : ""}
  `;
}

// Developer only: reports sent by visitors
function reportsHtml() {
  const list = loadReports();
  if (!list.length) return "";
  return `<h3>Reports <span class="count-pill">${list.length}</span></h3>
    ${list.map(r => `
      <div class="friend-row report-row">
        <div class="friend-name">${escapeHtml(handleOf(r.from) || "a visitor")} reported ${escapeHtml(handleOf(r.about) || "a visitor")}
          <small>${escapeHtml(r.reason || "No reason given")} · ${escapeHtml(new Date(r.time || 0).toLocaleDateString())}</small>
          ${Array.isArray(r.messages) && r.messages.length ? `<details><summary>Recent messages</summary>${r.messages.map(m => `<small>${escapeHtml(handleOf(m.from) || "?")}: ${escapeHtml(m.text)}</small>`).join("")}</details>` : ""}
        </div>
        <button type="button" class="small danger" data-user="${escapeHtml(r.id)}" onclick="dismissReport(this.dataset.user)">Dismiss</button>
      </div>`).join("")}`;
}

function chatMessagesHtml(me, other) {
  const list = (loadChats()[chatKey(me, other)] || []).filter(m => m && typeof m.from === "string" && typeof m.text === "string");
  if (!list.length) return `<p class="chat-empty">No messages yet. Say hi!</p>`;
  return list.map(m => `<div class="bubble-msg ${m.from === me ? "mine" : "theirs"}">${escapeHtml(m.text)}<time>${escapeHtml(timeLabel(m.t))}</time></div>`).join("");
}

// The big box when no chat is open: new messages first, then everyone you can pick to chat with
function chatPickerHtml(me) {
  const unread = unreadMap(me), unreadUsers = Object.keys(unread);
  const friends = socialOf(loadSocial(), me).friends;
  const others = friends.filter(u => !unread[u]);   // anyone already under New messages is not listed twice
  const open = `<button type="button" class="small" data-user="__U__" onclick="openChat(this.dataset.user)">Chat</button>`;
  const row = (u, buttons, note) => friendRow(u, buttons, false, note, "openChat").split("__U__").join(escapeHtml(u));
  return `<div class="chat-pick">
    ${unreadUsers.length ? `<h3>New messages <span class="count-pill">${unreadUsers.reduce((n, u) => n + unread[u].count, 0)}</span></h3>
      ${unreadUsers.map(u => row(u, unreadBadge(unread[u].count) + open.split("__U__").join(escapeHtml(u)), previewOf(unread[u].last.text))).join("")}` : ""}
    <h3>Pick a friend to start chatting${seeAllBtn("pick", others.length, PICK_LIMIT)}</h3>
    ${!friends.length
      ? `<p class="note" style="margin:0">No friends yet. Add someone by their username on the left.</p>`
      : others.length
        ? limited(others, "pick", PICK_LIMIT).map(u => row(u, open.split("__U__").join(escapeHtml(u)))).join("")
        : `<p class="note" style="margin:0">All your friends are in New messages above.</p>`}
  </div>`;
}

function chatPanelHtml() {
  const me = state.user.username, other = state.chatWith;
  if (!other || !isFriend(me, other)) {
    return chatPickerHtml(me);
  }
  return `
    <div class="chat-head">
      <button type="button" class="small chat-back" onclick="closeChat()">← Back</button>
      ${miniAvatar(other)}
      <span class="chat-title">${escapeHtml(friendLabel(other))}${devTag(other)}</span>
      <button type="button" class="chat-info" onclick="toggleChatMenu(event)" aria-label="Chat options" aria-expanded="${state.chatMenu}" title="Chat options">¡</button>
      ${state.chatMenu ? `
        <div class="chat-menu" onclick="event.stopPropagation()">
          <button type="button" onclick="chatNickname()">Nickname</button>
          <button type="button" onclick="chatDeleteHistory()">Delete chat</button>
          <button type="button" class="danger" onclick="chatUnfriend()">Unfriend</button>
          <button type="button" class="danger" onclick="chatBlock()">Block</button>
          <button type="button" class="danger" onclick="chatReport()">Report</button>
        </div>` : ""}
    </div>
    <div class="chat-messages" id="chatMessages">${chatMessagesHtml(me, other)}</div>
    <form class="chat-form" onsubmit="sendChat(event)">
      <input type="text" id="chatInput" maxlength="500" placeholder="Write a message" autocomplete="off" required>
      <button type="submit">Send</button>
    </form>`;
}

// ----- Friend profile page -----
// Click a friend's name to open their profile: picture, name, username, bio, and their list of friends.
function profileHtml(user) {
  const me = state.user.username;
  const acct = loadUsers()[user] || {};
  const isMe = user === me;
  const name = displayName(user);
  const bio = isDevKey(user) ? WELCOME_TEXT : (acct.bio || "");
  const friends = socialOf(loadSocial(), user).friends.filter(f => f !== user && !isBlocked(me, f));
  const iAmFriend = isFriend(me, user);
  const canAdd = !isMe && !iAmFriend && !socialOf(loadSocial(), me).outgoing.includes(user) && !isBlocked(me, user) && !isLegacyKey(user);
  const row = f => friendRow(f, "", false, f === me ? "You" : "", "openProfile").split("__U__").join(escapeHtml(f));

  return `
    <section class="page fit friends-page profile-page">
      <div class="page-head head-left">
        <h2>Profile</h2>
        <button type="button" class="small" onclick="closeProfile()">← Back</button>
      </div>
      ${messageBoxes()}
      <div class="fit-body profile-body">
        <div class="profile-card">
          ${avatarHtml(initialsFor(name), profilePicOf(user))}
          <h2 class="profile-name">${escapeHtml(name)}${devTag(user)}</h2>
          ${handleOf(user) ? `<div class="profile-username">${escapeHtml(handleOf(user))}</div>` : ""}
          <p class="profile-bio">${bio ? escapeHtml(bio) : "No bio yet."}</p>
          <div class="profile-actions">
            ${iAmFriend ? `<button type="button" class="small" onclick="chatFromProfile('${escapeHtml(user)}')">Chat</button>` : ""}
            ${canAdd ? `<button type="button" class="small" onclick="addFromProfile('${escapeHtml(user)}')">Add friend</button>` : ""}
            ${isMe ? `<span class="note">This is you</span>` : ""}
          </div>
        </div>
        <div class="profile-friends">
          <h3>Friends <span class="count-pill">${friends.length}</span></h3>
          ${friends.length ? friends.map(row).join("") : `<p class="note" style="margin:0">No friends yet.</p>`}
        </div>
      </div>
    </section>`;
}
function openProfile(username) {
  state.listPage = null;
  state.viewProfile = username;
  state.chatMenu = false;
  state.errorMsg = ""; state.successMsg = "";
  render();
}
function closeProfile() { state.viewProfile = null; state.errorMsg = ""; state.successMsg = ""; render(); }
function addFromProfile(username) { requestFriend(username); render(true); }
function chatFromProfile(username) { state.viewProfile = null; openChat(username); }

function renderFriendsTab() {
  const me = state.user.username;
  if (state.viewProfile) return profileHtml(state.viewProfile);
  if (state.listPage) return listPageHtml(state.listPage);
  if (state.chatWith && !isFriend(me, state.chatWith)) state.chatWith = null;
  if (!state.chatWith) state.chatMenu = false;
  if (state.chatWith) markRead(me, state.chatWith);      // the chat is open, so its messages count as read
  return `
    <section class="page fit friends-page">
      <div class="page-head head-left"><h2>Friends</h2></div>
      ${messageBoxes()}
      <div class="fit-body friends-body ${state.chatWith ? "chat-open" : ""}">
        <div class="friends-side" id="friendsSide">${friendsSideHtml()}</div>
        <div class="chat-panel" id="chatPanel">${chatPanelHtml()}</div>
      </div>
    </section>`;
}

function scrollChatToEnd() {
  const el = document.getElementById("chatMessages");
  if (el) el.scrollTop = el.scrollHeight;
}
function refreshChatMessages(force) {
  const el = document.getElementById("chatMessages");
  if (!el || !state.chatWith) return;
  const atEnd = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
  el.innerHTML = chatMessagesHtml(state.user.username, state.chatWith);
  if (force || atEnd) el.scrollTop = el.scrollHeight;
}

// Send a friend request to `target` (a username), or accept theirs if they already asked you
function requestFriend(target) {
  const me = state.user.username;
  state.errorMsg = ""; state.successMsg = "";
  const all = loadSocial();
  const mine = socialOf(all, me);

  if (!USERNAME_RULE.test(target)) state.errorMsg = "Usernames are 3 to 20 letters, numbers or underscores.";
  else if (target === me) state.errorMsg = "That's your own username.";
  else if (!loadUsers()[target]) state.errorMsg = "Nobody has the username @" + target + " on this browser yet.";
  else if (isBlocked(me, target)) state.errorMsg = "You blocked @" + target + ". Unblock them first to send a request.";
  else if (isBlocked(target, me)) state.errorMsg = "You can't send a request to that visitor.";
  else if (mine.friends.includes(target)) state.errorMsg = displayName(target) + " is already your friend.";
  else if (mine.outgoing.includes(target)) state.errorMsg = "You already sent a request to " + displayName(target) + ".";
  else {
    if (mine.incoming.includes(target)) {            // they already asked you: you become friends right away
      makeFriends(all, me, target);
      state.successMsg = "You and " + displayName(target) + " are now friends!";
    } else {
      const theirs = socialOf(all, target);
      mine.outgoing.push(target);
      if (!theirs.incoming.includes(me)) theirs.incoming.push(me);
      all[me] = mine; all[target] = theirs;
      state.successMsg = "Friend request sent to " + displayName(target) + ".";
      if (isDevKey(target)) logActivity("friend", "sent you a friend request", me);
    }
    saveSocialSafe(all);
  }
}

function sendRequest(event) {
  event.preventDefault();
  requestFriend(cleanUsername(document.getElementById("friendUsername").value));
  render(true);
}

function addSuggested(username) {
  requestFriend(username);
  render(true);
}

function acceptRequest(username) {
  const me = state.user.username, all = loadSocial();
  if (!socialOf(all, me).incoming.includes(username)) return;
  makeFriends(all, me, username);
  state.errorMsg = ""; state.successMsg = "You and " + displayName(username) + " are now friends!";
  saveSocialSafe(all);
  render(true);
}
function dropRequest(from, to, all) {               // remove a pending request from `from` to `to`
  const a = socialOf(all, from), b = socialOf(all, to);
  a.outgoing = a.outgoing.filter(x => x !== to);
  b.incoming = b.incoming.filter(x => x !== from);
  all[from] = a; all[to] = b;
}
function declineRequest(username) {
  const all = loadSocial();
  dropRequest(username, state.user.username, all);
  state.errorMsg = ""; state.successMsg = "";
  saveSocialSafe(all);
  render(true);
}
function cancelRequest(username) {
  const all = loadSocial();
  dropRequest(state.user.username, username, all);
  state.errorMsg = ""; state.successMsg = "";
  saveSocialSafe(all);
  render(true);
}
function removeFriend(username) {
  if (!confirm("Remove " + displayName(username) + " from your friends? Your chat with them will be deleted.")) return;
  const me = state.user.username, all = loadSocial();
  const a = socialOf(all, me), b = socialOf(all, username);
  a.friends = a.friends.filter(x => x !== username);
  b.friends = b.friends.filter(x => x !== me);
  all[me] = a; all[username] = b;
  state.errorMsg = ""; state.successMsg = "";
  if (saveSocialSafe(all)) {
    try { const chats = loadChats(); delete chats[chatKey(me, username)]; saveChats(chats); } catch (e) {}
  }
  if (state.chatWith === username) state.chatWith = null;
  state.friendOptions = null;
  render(true);
}

// Click a friend's name to show or hide their remove (✕) button
function toggleFriendOptions(username) {
  state.friendOptions = state.friendOptions === username ? null : username;
  render(true);
}

function toggleChatMenu(event) {
  event.stopPropagation();
  state.chatMenu = !state.chatMenu;
  render(true);
}

// Give a friend a nickname only you see (empty = remove it)
function chatNickname() {
  const me = state.user.username, other = state.chatWith;
  state.chatMenu = false; state.errorMsg = ""; state.successMsg = "";
  if (!other) { render(true); return; }
  const typed = prompt("Nickname for " + displayName(other) + " (only you will see it). Leave empty to remove it.", getNick(me, other));
  if (typed !== null) {
    const users = loadUsers(), acct = users[me];
    if (acct) {
      if (!acct.nicks || typeof acct.nicks !== "object") acct.nicks = {};
      const nick = typed.trim().slice(0, 20);
      if (nick) acct.nicks[other] = nick; else delete acct.nicks[other];
      try { saveUsers(users); state.successMsg = nick ? "Nickname saved." : "Nickname removed."; }
      catch (e) { state.errorMsg = "Couldn't save. Is browser storage turned off?"; }
    }
  }
  render(true);
}

// Clear the messages (the conversation is shared, so it clears for both of you)
function chatDeleteHistory() {
  const me = state.user.username, other = state.chatWith;
  state.chatMenu = false; state.errorMsg = ""; state.successMsg = "";
  if (other && confirm("Delete all messages with " + friendLabel(other) + "? This clears the chat for both of you.")) {
    try { const chats = loadChats(); delete chats[chatKey(me, other)]; saveChats(chats); state.successMsg = "Chat deleted."; }
    catch (e) { state.errorMsg = "Couldn't delete. Is browser storage turned off?"; }
  }
  render(true);
}

function chatUnfriend() {
  const other = state.chatWith;
  state.chatMenu = false;
  if (other) removeFriend(other); else render(true);
}

function chatBlock() {
  const other = state.chatWith;
  state.chatMenu = false;
  if (other) blockUser(other); else render(true);
}

function chatReport() {
  const other = state.chatWith;
  state.chatMenu = false;
  if (other) reportUser(other); else render(true);
}

// Block: unfriend, cancel any requests both ways, delete the chat, and hide each other from suggestions
function blockUser(username) {
  const me = state.user.username;
  state.errorMsg = ""; state.successMsg = "";
  if (!confirm("Block " + friendLabel(username) + "? You'll be unfriended, the chat will be deleted, and they won't be able to send you requests.")) { render(true); return; }
  const users = loadUsers(), acct = users[me];
  if (!acct) { state.errorMsg = "Couldn't find your account."; render(true); return; }
  acct.blocked = blockedOf(me).filter(x => x !== username).concat(username);
  const all = loadSocial(), a = socialOf(all, me), b = socialOf(all, username);
  ["friends", "incoming", "outgoing"].forEach(k => { a[k] = a[k].filter(x => x !== username); b[k] = b[k].filter(x => x !== me); });
  all[me] = a; all[username] = b;
  try {
    saveUsers(users);
    saveSocial(all);
    const chats = loadChats(); delete chats[chatKey(me, username)]; saveChats(chats);
    state.successMsg = "You blocked " + displayName(username) + ". You can unblock them at the bottom of this list.";
  } catch (e) { state.errorMsg = "Couldn't save. Is browser storage turned off?"; }
  if (state.chatWith === username) state.chatWith = null;
  state.friendOptions = null;
  render(true);
}

function unblockUser(username) {
  const me = state.user.username;
  state.errorMsg = ""; state.successMsg = "";
  const users = loadUsers(), acct = users[me];
  if (acct) {
    acct.blocked = blockedOf(me).filter(x => x !== username);
    try { saveUsers(users); state.successMsg = "You unblocked " + displayName(username) + "."; }
    catch (e) { state.errorMsg = "Couldn't save. Is browser storage turned off?"; }
  }
  render(true);
}

// Report: saves the reason and the last few messages for the site owner to read
function reportUser(username) {
  const me = state.user.username;
  state.errorMsg = ""; state.successMsg = "";
  const reason = prompt("Report " + friendLabel(username) + ". What happened? (The last few messages in this chat are included.)", "");
  if (reason === null) { render(true); return; }
  const msgs = (loadChats()[chatKey(me, username)] || [])
    .filter(m => m && typeof m.from === "string" && typeof m.text === "string")
    .slice(-10).map(m => ({ from: m.from, text: m.text.slice(0, 500), t: m.t }));
  try {
    const list = loadReports();
    list.unshift({ id: newId(), from: me, about: username, reason: reason.trim().slice(0, 300), time: Date.now(), messages: msgs });
    saveReports(list.slice(0, 100));
    logActivity("report", "reported " + (handleOf(username) || "a visitor"), me);
    state.successMsg = "Thanks, your report was saved for the site owner to review.";
  } catch (e) { state.errorMsg = "Couldn't save the report. Is browser storage turned off?"; }
  render(true);
}

function dismissReport(id) {
  if (!state.user.isDeveloper) return;
  try { saveReports(loadReports().filter(r => r.id !== id)); } catch (e) {}
  render(true);
}

function openChat(username) {
  if (!isFriend(state.user.username, username)) return;
  state.listPage = null;
  state.viewProfile = null;
  state.chatWith = username;
  state.chatMenu = false;
  state.errorMsg = ""; state.successMsg = "";
  render(true);
  scrollChatToEnd();
  const box = document.getElementById("chatInput");
  if (box) box.focus();
}
function closeChat() { state.chatWith = null; state.chatMenu = false; render(true); }

function sendChat(event) {
  event.preventDefault();
  const me = state.user.username, other = state.chatWith;
  const box = document.getElementById("chatInput");
  const text = box.value.trim().slice(0, 500);
  if (!text || !other) return;
  if (!isFriend(me, other)) { state.chatWith = null; state.errorMsg = "You're no longer friends with that visitor."; render(true); return; }
  try {
    const chats = loadChats(), key = chatKey(me, other);
    const list = Array.isArray(chats[key]) ? chats[key] : [];
    list.push({ from: me, text: text, t: Date.now() });
    chats[key] = list.slice(-CHAT_MAX);
    saveChats(chats);
    if (isDevKey(other)) logActivity("message", "sent you a message", me);
  } catch (e) { state.errorMsg = "Couldn't send. Is browser storage turned off?"; render(true); return; }
  box.value = "";
  refreshChatMessages(true);
  box.focus();
}

// When another tab of this browser changes friends or messages, update this one
window.addEventListener("storage", event => {
  if (state.view !== "app" || !state.user) return;
  if (event.key === ACTIVITY_KEY) refreshBell();
  const me = state.user.username;
  const onFriends = state.activeTab === "FRIENDS";
  if (onFriends && event.key === CHATS_KEY) {
    refreshChatMessages();
    if (state.chatWith) markRead(me, state.chatWith);
  }
  if (onFriends && [CHATS_KEY, FRIENDS_KEY, USERS_KEY, REPORTS_KEY].includes(event.key)) {
    if (state.chatWith && !isFriend(me, state.chatWith)) { state.chatWith = null; render(true); return; }
    const side = document.getElementById("friendsSide");
    if (side && !side.contains(document.activeElement)) side.innerHTML = friendsSideHtml();
    const panel = document.getElementById("chatPanel");
    if (panel && !state.chatWith && !panel.contains(document.activeElement)) panel.innerHTML = chatPanelHtml();
  }
  if ([CHATS_KEY, FRIENDS_KEY, USERS_KEY].includes(event.key)) updateUnreadBadges();
});

// Remove everything social about an account that was just deleted
function removeSocial(username) {
  try {
    const all = loadSocial();
    delete all[username];
    Object.keys(all).forEach(k => {
      const r = socialOf(all, k);
      all[k] = { friends: r.friends.filter(x => x !== username), incoming: r.incoming.filter(x => x !== username), outgoing: r.outgoing.filter(x => x !== username) };
    });
    saveSocial(all);
    const chats = loadChats();
    Object.keys(chats).forEach(k => { if (k.split("\n").includes(username)) delete chats[k]; });
    saveChats(chats);
  } catch (e) {}
}

(function () {
  const st = document.createElement("style");
  st.textContent = `
    .friends-body { gap: 14px; }
    .friends-side { flex: 0 0 min(340px, 40%); min-width: 0; min-height: 0; overflow-y: auto; display: grid; align-content: start; gap: 10px; padding-right: 6px; }
    .friends-side h3 { font-size: 1.05rem; display: flex; align-items: center; gap: 8px; }
    .friend-row { display: flex; align-items: center; gap: 6px; padding: 8px 10px; border-radius: 14px; background: var(--card); border: 1px solid var(--border); }
    .friend-row.active { outline: 2px solid var(--accent-soft); }
    .friend-name { flex: 1; min-width: 0; font-weight: 700; overflow-wrap: anywhere; }
    .friend-name.clickable { cursor: pointer; }
    .friend-name small { display: block; font-weight: 600; color: var(--muted); font-size: 0.72rem; }
    .chat-panel { flex: 1; min-width: 0; min-height: 0; display: flex; flex-direction: column; border-radius: 16px; border: 1px solid var(--border); background: var(--card); overflow: hidden; }
    .chat-head { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid var(--border); font-weight: 700; }
    .chat-back { display: none; }
    .chat-pick { flex: 1; min-height: 0; overflow-y: auto; padding: 14px; display: grid; align-content: start; gap: 10px; }
    .chat-pick h3 { font-size: 1.05rem; display: flex; align-items: center; gap: 8px; }
    .side-new-msgs { display: none; }
    @media (max-width: 700px) { .side-new-msgs { display: grid; gap: 10px; } }
    .mini-avatar { position: relative; width: 36px; height: 36px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center; background: var(--accent); color: var(--on-accent); }
    .mini-avatar b { font-size: 1rem; font-weight: 800; line-height: 1; }
    .mini-avatar img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; background: var(--card); }
    .dev-tag { font-weight: 600; font-size: 0.8em; color: var(--accent); }
    .unread-badge, .notif-dot { min-width: 20px; height: 20px; padding: 0 6px; border-radius: 10px; background: #e5604d; color: #fff;
      font-size: 0.72rem; font-weight: 800; line-height: 1; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .menu-wrap { position: relative; display: flex; flex-shrink: 0; }
    .notif-dot { position: absolute; top: -8px; right: -10px; pointer-events: none; box-shadow: 0 0 0 2px var(--card, #fff); }
    .chat-head { position: relative; }
    .chat-title { flex: 1; min-width: 0; overflow-wrap: anywhere; }
    .chat-head .chat-info { margin-left: auto; flex-shrink: 0; width: 30px; height: 30px; padding: 0; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 800; line-height: 1;
      background: none; color: var(--accent); border: 2px solid var(--accent); }
    .chat-head .chat-info:hover { background: var(--mint); color: #3b2d29; transform: none; opacity: 1; }
    .chat-menu { position: absolute; right: 10px; top: calc(100% - 4px); z-index: 20; min-width: 150px; display: grid; gap: 2px; padding: 6px;
      border-radius: 14px; background: var(--card); border: 1px solid var(--border); box-shadow: 0 8px 24px rgba(0,0,0,.18); }
    .chat-menu button { text-align: left; background: none; color: inherit; padding: 8px 12px; border-radius: 10px; box-shadow: none; }
    .chat-menu button:hover { background: var(--mint); color: #3b2d29; transform: none; opacity: 1; }
    .chat-menu button.danger { color: #c0392b; }
    .report-row details small { display: block; font-weight: 500; }
    .chat-messages { flex: 1; min-height: 0; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
    .bubble-msg { max-width: 78%; padding: 8px 12px; border-radius: 16px; overflow-wrap: anywhere; white-space: pre-wrap; }
    .bubble-msg.mine { align-self: flex-end; background: var(--accent); color: var(--on-accent); border-bottom-right-radius: 4px; }
    .bubble-msg.theirs { align-self: flex-start; background: var(--mint); color: #3b2d29; border-bottom-left-radius: 4px; }
    .bubble-msg time { display: block; font-size: 0.65rem; opacity: 0.7; margin-top: 2px; }
    .chat-form { display: flex; gap: 8px; padding: 10px; border-top: 1px solid var(--border); }
    .chat-form input { flex: 1; min-width: 0; }
    .chat-empty { margin: auto; color: var(--muted); text-align: center; padding: 20px; }
    @media (max-width: 700px) {
      .friends-side { flex: 1 1 auto; padding-right: 0; }
      .friends-body .chat-panel { display: none; }
      .friends-body.chat-open .friends-side { display: none; }
      .friends-body.chat-open .chat-panel { display: flex; }
      .chat-back { display: inline-block; }
    }
  `;
  document.head.appendChild(st);
})();

// ---------- 6. ACTIONS (what buttons do) ----------

function switchView(view) {
  state.fishSchool = false;
  state.zooOpen = false;
  state.editingHome = false;
  state.editingProject = null;
  state.editingInterest = null;
  state.openList = null;
  state.view = view;
  state.errorMsg = "";
  state.successMsg = "";
  state.menuOpen = false;
  render();
}

function setActiveTab(tab) {
  state.fishSchool = false;
  state.zooOpen = false;
  state.editingHome = false;
  state.editingProject = null;
  state.editingInterest = null;
  state.openList = null;
  state.errorMsg = "";
  state.successMsg = "";
  state.activeTab = tab;
  state.bellOpen = false;
  state.viewProfile = null;
  state.listPage = null;
  state.friendOptions = null;
  state.chatMenu = false;
  state.menuOpen = false;
  try { sessionStorage.setItem("aconite_tab", tab); } catch (e) {}
  render();
}

function toggleMenu(event) {
  event.stopPropagation();
  state.bellOpen = false;
  if (state.view !== "app" && state.view !== "delete") return;        // the menu is only for logged-in visitors
  state.menuOpen = !state.menuOpen;
  state.menuJustOpened = state.menuOpen;
  render();
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", state.theme); } catch (e) {}
  render();
}

// After a fresh login or sign-up, always open the Home page (not whatever tab was open before)
function goHomeFirst() {
  state.activeTab = "HOME";
  state.viewProfile = null;
  state.editingHome = false;
  state.openList = null;
  try { sessionStorage.setItem("aconite_tab", "HOME"); } catch (e) {}
}

async function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  try {
    const loggedUser = await checkLogin(username, password);
    startSession(loggedUser);
    logActivity("login", "logged in", loggedUser.username);
    goHomeFirst();   // logging in always starts on the Home page
  } catch (error) {
    state.errorMsg = error.message;
  }
  render();
}

async function handleSignup(event) {
  event.preventDefault();
  const username = document.getElementById("signupUsername").value;
  const name = document.getElementById("signupName").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;

  if (password !== confirm) { state.errorMsg = "Passwords do not match."; render(); return; }
  try {
    const newUser = await createAccount(name, username, password);
    startSession(newUser);
    logActivity("join", "joined the site", newUser.username);
    goHomeFirst();   // a new account starts on the Home page
  } catch (error) {
    state.errorMsg = error.message;
  }
  render();
}

// Old email accounts: choose a username, then carry on
function handlePickName(event) {
  event.preventDefault();
  const typed = document.getElementById("pickUsername").value;
  try {
    state.user = renameAccount(state.user.username, typed);
    state.view = "app";
    state.errorMsg = "";
  } catch (error) {
    state.errorMsg = error.message;
  }
  render();
}

// Picture chosen in the edit form but not saved yet:
// undefined = unchanged, "" = remove it, otherwise a small image as a data URL
let pendingAvatar;

function setAvatarPreview(src) {
  const avatar = document.querySelector("#app .avatar");
  if (!avatar) return;
  const old = avatar.querySelector("img");
  if (old) old.remove();
  avatar.querySelector("span").style.display = "";
  if (src) {
    const img = document.createElement("img");
    img.alt = "Profile picture";
    img.src = src;
    avatar.insertBefore(img, avatar.firstChild);
  }
}

// Shrink the chosen image to a 200x200 square so it fits easily in browser storage
function handleAvatarFile(input) {
  const file = input.files && input.files[0];
  const note = document.getElementById("avatarNote");
  if (!file) return;
  if (!file.type.startsWith("image/")) { note.textContent = "Please choose an image file."; return; }

  const reader = new FileReader();
  reader.onerror = () => { note.textContent = "Couldn't read that file."; };
  reader.onload = () => {
    const img = new Image();
    img.onerror = () => { note.textContent = "Couldn't open that image."; };
    img.onload = () => {
      const size = 200;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      const side = Math.min(img.width, img.height);   // crop to a centered square
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      pendingAvatar = canvas.toDataURL("image/jpeg", 0.85);
      setAvatarPreview(pendingAvatar);
      note.textContent = "Looks good! Press Save to keep it.";
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function removeAvatar() {
  pendingAvatar = "";
  setAvatarPreview("");
  const note = document.getElementById("avatarNote");
  if (note) note.textContent = "Picture removed. Press Save to keep that.";
}

function startEditInterest(id) {
  state.editingInterest = id;
  state.errorMsg = "";
  render();
  const title = document.getElementById("interestTitle");
  if (title) title.focus();
}

function cancelEditInterest() {
  state.editingInterest = null;
  state.errorMsg = "";
  render();
}

// Save the user's interests back to their own account.
// `removeListKey` (optional) also deletes that interest's checklist.
function saveInterestList(interests, removeListKey) {
  const users = loadUsers();
  const account = users[state.user.username];
  if (!account) { state.errorMsg = "Couldn't find your account."; return false; }
  account.interests = interests;
  if (removeListKey && account.lists) delete account.lists[removeListKey];
  try { saveUsers(users); }
  catch (e) { state.errorMsg = "Couldn't save. Is browser storage turned off?"; return false; }
  state.user = userFromAccount(state.user.username, account);
  return true;
}

function saveInterest(event) {
  event.preventDefault();
  const title = document.getElementById("interestTitle").value.trim();
  const text = document.getElementById("interestText").value.trim();
  const picked = document.querySelector('input[name="interestIcon"]:checked');
  const icon = picked ? CAT_ICONS[Number(picked.value)] : undefined;   // only icons from CAT_ICONS
  if (!title) { state.errorMsg = "Give your interest a name."; render(); return; }
  if (!icon) { state.errorMsg = "Pick one of the cat icons."; render(); return; }

  const interests = state.user.interests.slice();
  const newInterest = state.editingInterest === "new";
  if (state.editingInterest === "new") {
    interests.push({ id: newId(), title: title, text: text, icon: icon });
  } else {
    const item = interests.find(x => x.id === state.editingInterest);
    if (item) { item.title = title; item.text = text; item.icon = icon; }
  }
  if (saveInterestList(interests)) {
    if (newInterest) logActivity("interest", "added a new interest: \u201c" + title + "\u201d", state.user.username);
    state.editingInterest = null; state.errorMsg = "";
  }
  render();
}

function deleteInterest(id) {
  if (!confirm("Delete this interest and its checklist?")) return;
  saveInterestList(state.user.interests.filter(i => i.id !== id), "i-" + id);
  render();
}

// ----- Checklists -----

function openChecklist(key) {
  state.openList = key;
  state.editingInterest = null;
  state.errorMsg = "";
  render();
}

function closeChecklist() {
  state.openList = null;
  state.errorMsg = "";
  render();
}

// Save one interest's checklist to the signed-in account
function saveChecklist(key, items) {
  const users = loadUsers();
  const account = users[state.user.username];
  if (!account) { state.errorMsg = "Couldn't find your account."; return false; }
  if (!account.lists || typeof account.lists !== "object") account.lists = {};
  account.lists[key] = items;
  try { saveUsers(users); }
  catch (e) { state.errorMsg = "Couldn't save. Is browser storage turned off?"; return false; }
  state.user = userFromAccount(state.user.username, account);
  return true;
}

function toggleItem(key, id) {
  const items = getChecklist(key).map(x => x.id === id ? { id: x.id, title: x.title, done: !x.done } : x);
  state.errorMsg = "";
  saveChecklist(key, items);
  render(true);
}

function addItem(event, key) {
  event.preventDefault();
  const title = document.getElementById("itemTitle").value.trim();
  if (!title) return;

  const items = getChecklist(key).slice();
  if (items.some(x => x.title.toLowerCase() === title.toLowerCase())) {
    state.errorMsg = "\"" + title + "\" is already on your list.";
    render(true);
    return;
  }
  items.push({ id: newId(), title: title, done: false });
  state.errorMsg = "";
  saveChecklist(key, items);
  render(true);
  const box = document.getElementById("itemTitle");
  if (box) box.focus();
}

function deleteItem(key, id) {
  state.errorMsg = "";
  saveChecklist(key, getChecklist(key).filter(x => x.id !== id));
  render(true);
}

// ----- Projects -----

function startEditProject(id) {
  state.editingProject = id;
  state.errorMsg = "";
  render();
  const title = document.getElementById("projectTitle");
  if (title) title.focus();
}

function cancelEditProject() {
  state.editingProject = null;
  state.errorMsg = "";
  render();
}

// Save the user's projects list back to their own account
function saveProjectList(projects) {
  const users = loadUsers();
  const account = users[state.user.username];
  if (!account) { state.errorMsg = "Couldn't find your account."; return false; }
  account.projects = projects;
  try { saveUsers(users); }
  catch (e) { state.errorMsg = "Couldn't save. Is browser storage turned off?"; return false; }
  state.user = userFromAccount(state.user.username, account);
  return true;
}

function saveProject(event) {
  event.preventDefault();
  const title = document.getElementById("projectTitle").value.trim();
  const text = document.getElementById("projectText").value.trim();
  const picked = document.querySelector('input[name="projectIcon"]:checked');
  const icon = picked ? FRUIT_ICONS[Number(picked.value)] : undefined;   // only icons from FRUIT_ICONS
  if (!title) { state.errorMsg = "Give your project a title."; render(); return; }
  if (!icon) { state.errorMsg = "Pick one of the fruit icons."; render(); return; }

  const projects = state.user.projects.slice();
  const newProject = state.editingProject === "new";
  if (state.editingProject === "new") {
    projects.push({ id: newId(), title: title, text: text, icon: icon });
  } else {
    const p = projects.find(x => x.id === state.editingProject);
    if (p) { p.title = title; p.text = text; p.icon = icon; }
  }
  if (saveProjectList(projects)) {
    if (newProject) logActivity("project", "added a new project: \u201c" + title + "\u201d", state.user.username);
    state.editingProject = null; state.errorMsg = "";
  }
  render();
}

function deleteProject(id) {
  if (!confirm("Delete this project?")) return;
  saveProjectList(state.user.projects.filter(p => p.id !== id));
  render();
}

function startEditHome() {
  pendingAvatar = undefined;
  state.editingHome = true;
  state.errorMsg = "";
  render();
}

function cancelEditHome() {
  pendingAvatar = undefined;
  state.editingHome = false;
  state.errorMsg = "";
  render();
}

function saveHome(event) {
  event.preventDefault();
  const name = document.getElementById("editName").value.trim();
  const bio = document.getElementById("editBio").value.trim();
  if (!name) { state.errorMsg = "Your name can't be empty."; render(); return; }

  const users = loadUsers();
  const account = users[state.user.username];
  if (!account) { state.errorMsg = "Couldn't find your account."; render(); return; }
  account.name = name;
  account.bio = bio;
  if (pendingAvatar !== undefined) account.avatar = pendingAvatar;
  try { saveUsers(users); }
  catch (e) { state.errorMsg = "Couldn't save. Is browser storage turned off?"; render(); return; }

  state.user = userFromAccount(state.user.username, account);
  logActivity("profile", "updated their profile", state.user.username);
  pendingAvatar = undefined;
  state.editingHome = false;
  state.errorMsg = "";
  render();
}

async function handleDelete(event) {
  event.preventDefault();
  const password = document.getElementById("deletePassword").value;
  try {
    const user = await checkLogin(state.user.username, password);   // confirm it's really them
    logActivity("delete", "deleted their account", user.username);
    const users = loadUsers();
    delete users[user.username];
    saveUsers(users);
    retireUsername(user.username);          // nobody (not even you) can claim this username again
    removeSocial(user.username);
    endSession();
    state.errorMsg = "";
    state.successMsg = "Your account was deleted. You can sign up again.";
  } catch (error) {
    state.errorMsg = error.message === "Wrong username or password."
      ? "Wrong password." : error.message;
  }
  render();
}

function handleLogout() {
  endSession();
  render();
}

// Click anywhere else to close the dropdown
document.addEventListener("click", () => {
  if (state.bellOpen) {
    state.bellOpen = false;
    render(true);
  } else if (state.menuOpen) {
    state.menuOpen = false;
    render();
  } else if (state.chatMenu) {
    state.chatMenu = false;
    render(true);
  }
});



// Header look: menu button (three lines), logo size, site name, sun/moon icon.
// Change the numbers here to resize things.
(function () {
  const st = document.createElement("style");
  st.textContent = `
    nav .brand { gap: 12px; }
    nav .menu-btn { display: flex; flex-direction: column; justify-content: center; gap: 4px;
      width: 30px; height: 30px; padding: 5px; border-radius: 8px; background: none; flex-shrink: 0; }
    nav .menu-btn span { display: block; width: 100%; height: 3px; border-radius: 2px; background: var(--accent); }
    nav .menu-btn:hover { transform: none; opacity: 1; background: var(--mint); }
    nav .menu-btn:hover span { background: #3b2d29; }
    nav .logo-btn { display: flex; align-items: center; }
    nav .logo-btn img { height: 48px; width: auto; display: block; }
    nav .site-name { font-size: 2rem; line-height: 1.2; }
    nav button.theme-icon { background: none; padding: 2px; border-radius: 0; line-height: 0; display: block; flex-shrink: 0; }
    nav button.theme-icon:hover { transform: scale(1.12); opacity: 1; }
    nav button.theme-icon svg { display: block; }
    .icon-img { height: 42px; width: auto; display: block; }
    .icon-img.small-icon { height: 32px; width: auto; display: inline-block; vertical-align: middle; }
    .card .icon:has(.icon-img) { margin-bottom: 12px; }

    /* Chat: the Back button is always visible, so you can leave a chat and stay on the Friends page */
    .chat-head .chat-back { display: inline-block !important; flex-shrink: 0; order: -1; margin-right: 2px; }

    /* "See all" sits at the right end of a list heading */
    .see-all { margin-left: auto; flex-shrink: 0; }

    .list-page-body { flex: 1; min-width: 0; min-height: 0; overflow-y: auto; display: grid; align-content: start; gap: 10px; padding: 14px;
      border-radius: 16px; border: 1px solid var(--border); background: var(--card); }

    /* Menu: hangs from the header, flush left, slides down out of it */
    nav .dropdown { position: fixed !important; left: 0 !important; right: auto !important; margin: 0 !important; z-index: 40;
      bottom: 0; min-width: 230px; overflow-y: auto; background: var(--card);
      border: 1px solid var(--border); border-top: none; border-left: none; border-radius: 0 !important;
      box-shadow: 0 8px 18px rgba(0,0,0,.14); transform-origin: top left; }
    nav .dropdown.drop-in { animation: dropFromHeader .24s ease-out; }
    @keyframes dropFromHeader {
      from { clip-path: inset(0 0 100% 0); transform: translateY(-14px); opacity: .4; }
      to   { clip-path: inset(0 0 0 0);    transform: translateY(0);     opacity: 1; }
    }

    /* Mood tracker */
    .mood-page { width: min(440px, 100%); margin: 0 auto; padding: 8px 4px 24px; text-align: center; }
    .mood-title { margin: 6px 0 12px; font-size: 1.8rem; }
    .mood-switch { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
    .mood-switch button { padding: 10px; border-radius: 10px; background: var(--card); color: inherit; border: 1px solid var(--border); font-weight: 700; }
    .mood-switch button.on { background: var(--accent); color: #fff; border-color: var(--accent); }
    .mood-nav { display: flex; align-items: center; justify-content: space-between; margin: 6px 4px 10px; }
    .mood-arrow { background: none; color: inherit; font-size: 1.6rem; line-height: 1; padding: 2px 10px; border-radius: 8px; }
    .mood-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px 2px; }
    .mood-head span { font-size: 0.75rem; opacity: 0.6; padding: 4px 0; }
    .mood-cell { display: flex; flex-direction: column; align-items: center; gap: 2px; background: none; color: inherit; padding: 2px 0; border-radius: 12px; min-height: 62px; }
    .mood-cell:hover:not(:disabled) { transform: scale(1.06); }
    .mood-cell.future { opacity: 0.45; cursor: default; }
    .mood-cell.today .mood-empty { border-style: solid; border-color: var(--accent); }
    .mood-empty { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%;
      border: 1.5px dashed var(--border); font-size: 0.78rem; opacity: 0.7; box-sizing: border-box; }
    .mood-cell.out .mood-empty { opacity: 0.35; }
    .mood-num { font-size: 0.72rem; font-weight: 700; opacity: 0.75; }
    .mood-face { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; background: var(--c);
      box-shadow: inset 0 -3px 0 rgba(0,0,0,.08); flex-shrink: 0; }
    body.dark .mood-face { background: var(--cd); }
    .mood-hint { margin: 14px 0 8px; font-size: 0.85rem; opacity: 0.65; }
    .mood-legend { display: flex; flex-wrap: wrap; gap: 6px 12px; justify-content: center; margin-top: 10px; font-size: 0.75rem; }
    .mood-legend span { display: inline-flex; align-items: center; gap: 4px; }
    .mood-year { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .mood-mini { background: var(--card); color: inherit; border: 1px solid var(--border); border-radius: 12px; padding: 8px 6px; display: grid; gap: 6px; }
    .mood-mini > span { font-weight: 800; font-size: 0.85rem; }
    .mood-dots { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
    .mood-dots i { display: block; aspect-ratio: 1; border-radius: 50%; background: var(--border); opacity: 0.35; }
    .mood-dots i.on { background: var(--c); opacity: 1; }
    body.dark .mood-dots i.on { background: var(--cd); }
    .mood-overlay { position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; padding: 16px; }
    .mood-box { width: min(380px, 100%); max-height: 90vh; overflow-y: auto; background: var(--card); color: inherit; border: 1px solid var(--border);
      border-radius: 16px; padding: 18px; display: grid; gap: 10px; box-shadow: 0 10px 30px rgba(0,0,0,.3); }
    .mood-box h3, .mood-box p { margin: 0; }
    .mood-picks { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .mood-pick { display: grid; justify-items: center; gap: 3px; background: none; color: inherit; padding: 6px 2px; border-radius: 12px; border: 2px solid transparent; }
    .mood-pick.on { border-color: var(--accent); }
    .mood-pick small { font-size: 0.7rem; }
    .mood-box textarea { width: 100%; box-sizing: border-box; resize: none; }
    .mood-box .form-row { display: flex; gap: 10px; align-items: center; justify-content: center; }

    /* Developer notification bell */
    .bell-wrap { position: relative; display: inline-flex; align-items: center; flex-shrink: 0; }
    nav button.bell-btn { background: none; padding: 2px; border-radius: 0; line-height: 0; display: block; }
    nav button.bell-btn:hover { transform: scale(1.12); opacity: 1; }
    .bell-badge { position: absolute; top: -8px; right: -10px; pointer-events: none; box-shadow: 0 0 0 2px var(--card, #fff); }
    .bell-panel { position: absolute; right: 0; top: calc(100% + 10px); z-index: 60; width: min(270px, 84vw); max-height: 50vh; overflow-y: auto;
      border-radius: 12px; background: #fffaf6; color: #3b2d29; border: 1px solid #e3d3ca; box-shadow: 0 6px 18px rgba(0,0,0,.25); opacity: 1; }
    body.dark .bell-panel { background: #2b2422; color: #f4ebe6; border-color: #4a3f3b; }
    .bell-panel .bell-head, .bell-panel .bell-item { border-bottom-color: #e3d3ca; }
    body.dark .bell-panel .bell-head, body.dark .bell-panel .bell-item { border-bottom-color: #4a3f3b; }
    body.dark .bell-panel .link-btn { color: #f4ebe6; }
    body.dark .bell-item.new { background: #4a3a34; color: #f4ebe6; }
    .bell-head { display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 6px 10px; font-weight: 800; font-size: 0.8rem; border-bottom: 1px solid var(--border); }
    .bell-head .small { font-size: 0.7rem; padding: 2px 6px; }
    .bell-item { display: flex; gap: 7px; align-items: flex-start; padding: 6px 10px; border-bottom: 1px solid var(--border); font-size: 0.75rem; line-height: 1.3; overflow-wrap: anywhere; }
    .bell-item:last-child { border-bottom: none; }
    .bell-item.new { background: var(--mint); color: #3b2d29; }
    .bell-item small { display: block; opacity: 0.7; font-size: 0.65rem; margin-top: 1px; }
    .bell-icon { line-height: 0; flex-shrink: 0; margin-top: 1px; }
    .bell-icon svg { display: block; image-rendering: pixelated; }
    .bell-empty { margin: 0; padding: 12px 10px; text-align: center; color: var(--muted); font-size: 0.75rem; }

    /* Friend profile page */
    .profile-body { display: flex; gap: 20px; align-items: stretch; min-height: 0; }
    .profile-card { flex: 0 0 min(340px, 42%); min-width: 0; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px;
      padding: 18px; border-radius: 16px; border: 1px solid var(--border); background: var(--card); overflow-y: auto; }
    .profile-card .avatar { width: 120px; height: 120px; margin: 0 0 4px; font-size: 2.2rem; }
    .profile-name { margin: 0; overflow-wrap: anywhere; }
    .profile-username { opacity: 0.7; font-weight: 600; }
    .profile-bio { margin: 6px 0; overflow-wrap: anywhere; white-space: pre-wrap; }
    .profile-actions { display: flex; gap: 8px; align-items: center; justify-content: center; flex-wrap: wrap; }
    .profile-friends { flex: 1; min-width: 0; min-height: 0; overflow-y: auto; display: grid; align-content: start; gap: 10px; padding: 14px;
      border-radius: 16px; border: 1px solid var(--border); background: var(--card); }
    .profile-friends h3 { margin: 0; }
    @media (max-width: 700px) {
      .profile-body { flex-direction: column; overflow-y: auto; }
      .profile-card { flex-basis: auto; overflow: visible; }
      .profile-friends { overflow: visible; }
    }

    /* Emotion bubbles: keep 100 floating bubbles smooth */
    .bubble { will-change: transform; contain: layout style; backface-visibility: hidden; }
    .bubble, .bubble-face { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
    .bubble-field:has(.quote-overlay.show) .bubble { animation-play-state: paused; }

    /* Media + Projects: one row = 5 cards; the 6th card drops to a second row */
    @media (min-width: 900px) {
      .media-grid, .project-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px; align-items: start; }
    }
    /* Media cards: every card is exactly the size of the Manga card (sized in sizeMediaCards) */
    .media-grid { align-items: start; }
    .media-grid .card { box-sizing: border-box; display: flex; flex-direction: column; overflow: hidden; }
    .media-grid .card p { flex: 1 1 auto; min-height: 0; overflow-y: auto; }
    .media-grid .card .card-hint { margin-top: auto; padding-top: 8px; flex-shrink: 0; }
    .media-grid .card .project-actions { flex-shrink: 0; }

    /* Emotion bubbles: keep 100 floating bubbles smooth */
    .bubble { will-change: transform; contain: layout style; backface-visibility: hidden; }
    .bubble, .bubble-face { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
    .bubble-field:has(.quote-overlay.show) .bubble { animation-play-state: paused; }

    /* Media + Projects: one row = 5 cards; the 6th card drops to a second row */
    @media (min-width: 900px) {
      .media-grid, .project-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px; align-items: start; }
    }
    /* Media cards: every card is as tall as the tallest one, whatever its text length */
    .media-grid { grid-auto-rows: 1fr; }
    .media-grid .card { height: 100%; box-sizing: border-box; display: flex; flex-direction: column; min-height: 240px; }
    .media-grid .card .card-hint { margin-top: auto; padding-top: 8px; }

    /* Edit profile: everything side by side so it fits the screen without scrolling */
    .edit-hero { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
    .edit-form { display: flex; gap: 28px; align-items: center; width: min(720px, 100%); max-height: 100%; }
    .edit-left { flex: 0 0 170px; display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }
    .edit-left .avatar { width: 110px; height: 110px; margin: 0; font-size: 2rem; }
    .edit-left .note { margin: 0; font-size: 0.75rem; }
    .edit-right { flex: 1; min-width: 0; display: grid; gap: 8px; }
    .edit-right .icon-label { margin: 0; font-size: 0.8rem; }
    .edit-right input, .edit-right textarea { width: 100%; box-sizing: border-box; margin: 0; }
    .edit-right textarea { resize: none; }
    .edit-buttons { display: flex; gap: 12px; align-items: center; }
    @media (max-width: 600px) {
      .edit-form { flex-direction: column; gap: 12px; }
      .edit-left { flex-basis: auto; }
      .edit-left .avatar { width: 80px; height: 80px; }
    }
  `;
  document.head.appendChild(st);
})();

// ---------- 7. START ----------

const savedUser = restoreSession();
if (savedUser) {
  startSession(savedUser);   // still logged in from last time
} else {
  state.view = "login";
}
render();
