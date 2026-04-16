import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────── DESIGN TOKENS ─────────────────── */
const T = {
  ember:"#E8501A", emberDim:"#B83D12", emberGlow:"#FF6B35",
  gold:"#F5A623", goldLight:"#FFD166",
  sage:"#3A7D44", sageLight:"#4EAF5A",
  ink:"#0F0D0B", inkMid:"#1E1A16", inkSoft:"#2C2620",
  bone:"#FBF6EE", boneDim:"#F0E8D8",
  sand:"#D4C4A8", mist:"#8A7A68",
  white:"#FFFFFF", success:"#3A9A5C", red:"#E53E3E", purple:"#6B46C1",
  teal:"#0E8A7D", sky:"#0EA5E9", pink:"#EC4899", orange:"#F97316",
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  :root { font-size: 16px; }
  body { background: ${T.bone}; overscroll-behavior: none; }
  ::-webkit-scrollbar { display: none; }
  button, input, select, textarea { font-family: inherit; }
  @keyframes slideUp   { from { opacity:0; transform:translateY(22px) } to { opacity:1; transform:translateY(0) } }
  @keyframes slideDown { from { opacity:0; transform:translateY(-12px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fadeIn    { from { opacity:0 } to { opacity:1 } }
  @keyframes pop       { 0%{transform:scale(1)} 50%{transform:scale(0.91)} 100%{transform:scale(1)} }
  @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.45} }
  @keyframes shimmer   { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes float     { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
  @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes heartbeat { 0%,100%{transform:scale(1)} 14%{transform:scale(1.3)} 28%{transform:scale(1)} 42%{transform:scale(1.2)} 70%{transform:scale(1)} }
  @keyframes ripple    { 0%{transform:scale(0);opacity:0.6} 100%{transform:scale(4);opacity:0} }
  @keyframes badgePop  { 0%{transform:scale(0)} 60%{transform:scale(1.3)} 100%{transform:scale(1)} }
  @keyframes confetti  { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(300px) rotate(720deg);opacity:0} }
  @keyframes slideInRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes glow { 0%,100%{box-shadow:0 0 10px ${T.ember}44} 50%{box-shadow:0 0 28px ${T.ember}88} }
  @keyframes typing { 0%,60%,100%{opacity:1} 30%{opacity:0} }
  @keyframes waveIn { from{opacity:0;transform:translateY(10px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes slideInLeft { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
  .slide-up  { animation: slideUp  0.42s cubic-bezier(.22,.68,0,1.08) both; }
  .slide-down { animation: slideDown 0.3s ease both; }
  .fade-in   { animation: fadeIn   0.35s ease both; }
  .pop       { animation: pop      0.32s ease; }
  .float     { animation: float    3s ease-in-out infinite; }
  .pulse     { animation: pulse    1.8s ease-in-out infinite; }
  .spin      { animation: spin     0.8s linear infinite; }
  .slide-in-right { animation: slideInRight 0.4s ease both; }
  .bounce    { animation: bounce   2s ease-in-out infinite; }
  .glow      { animation: glow     2s ease-in-out infinite; }
  .shimmer-bg {
    background: linear-gradient(90deg, ${T.boneDim} 25%, ${T.bone} 50%, ${T.boneDim} 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  .card-hover { transition: transform 0.18s, box-shadow 0.18s; }
  .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.14) !important; }
  .card-hover:active { transform: scale(0.97); }
  .btn-press:active { transform: scale(0.95); }
  input:focus { outline: none; }
  select:focus { outline: none; }
  textarea:focus { outline: none; }
  .glass { background: rgba(251,246,238,0.92); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); }
  .dark-glass { background: rgba(15,13,11,0.88); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); }
`;

/* ─────────────────── DATA ─────────────────── */
const CATEGORIES = [
  { id:1, name:"Soups & Stews",  emoji:"🍲", col:"#C8421A", bg:"#FFF1ED" },
  { id:2, name:"Rice Dishes",    emoji:"🍛", col:"#D4A017", bg:"#FFFBF0" },
  { id:3, name:"Swallows",       emoji:"🫓", col:"#3A7D44", bg:"#F0FFF4" },
  { id:4, name:"Grills & Sides", emoji:"🍗", col:"#8B4513", bg:"#FFF5EE" },
  { id:5, name:"Drinks",         emoji:"🥤", col:"#1A6B8A", bg:"#EFF8FF" },
  { id:6, name:"Snacks",         emoji:"🥪", col:"#9B59B6", bg:"#FAF5FF" },
];

const POPULAR = [
  { id:1, name:"Egusi Soup",   desc:"With Pounded Yam",      price:2500, rating:4.9, reviews:248, tag:"Bestseller", emoji:"🍲", time:"20 min", spicy:2, cal:"520 kcal", halal:true, vegan:false },
  { id:2, name:"Jollof Rice",  desc:"Party-style + Chicken", price:2000, rating:4.8, reviews:312, tag:"Special",    emoji:"🍛", time:"25 min", spicy:1, cal:"610 kcal", halal:true, vegan:false },
  { id:3, name:"Pepper Soup",  desc:"Catfish & Assorted",    price:3000, rating:4.7, reviews:189, tag:"🔥 Hot",     emoji:"🌶️", time:"30 min", spicy:3, cal:"380 kcal", halal:true, vegan:false },
  { id:4, name:"Suya Platter", desc:"With Onion & Yaji",     price:3500, rating:4.9, reviews:201, tag:"Must Try",   emoji:"🍢", time:"15 min", spicy:2, cal:"490 kcal", halal:true, vegan:false },
];

const MENU = {
  "Soups & Stews": [
    { id:11, name:"Egusi Soup",   desc:"Rich melon seed soup with assorted meat & stockfish",  price:2500, emoji:"🍲", cal:"520 kcal", time:"20 min", spicy:2, tag:"Bestseller", allergens:["nuts"], halal:true, vegan:false, rating:4.9 },
    { id:12, name:"Pepper Soup",  desc:"Spicy catfish & assorted meat in aromatic broth",       price:3000, emoji:"🌶️", cal:"380 kcal", time:"30 min", spicy:3, tag:"🔥 Hot",    allergens:["fish"], halal:true, vegan:false, rating:4.7 },
    { id:13, name:"Ofe Onugbu",   desc:"Bitter leaf soup with stockfish & assorted meat",       price:2800, emoji:"🫙", cal:"460 kcal", time:"25 min", spicy:1, tag:"Local Fav",  allergens:["fish"], halal:true, vegan:false, rating:4.8 },
    { id:14, name:"Ogbono Soup",  desc:"Draw soup with assorted meat & dried fish",             price:2500, emoji:"🍜", cal:"490 kcal", time:"22 min", spicy:1, allergens:["fish"], halal:true, vegan:false, rating:4.6 },
    { id:15, name:"Banga Soup",   desc:"Rich palm nut soup, Delta style perfection",            price:2800, emoji:"🥘", cal:"540 kcal", time:"28 min", spicy:2, allergens:[], halal:true, vegan:false, rating:4.8 },
  ],
  "Rice Dishes": [
    { id:21, name:"Jollof Rice",       desc:"Party-style with smoky tomato & fried chicken",  price:2000, emoji:"🍛", cal:"610 kcal", time:"25 min", spicy:1, tag:"Special",  allergens:[], halal:true, vegan:false, rating:4.8 },
    { id:22, name:"Fried Rice",        desc:"Nigerian-style with vegetables & coleslaw",       price:2200, emoji:"🍚", cal:"580 kcal", time:"20 min", spicy:0, allergens:["eggs"], halal:true, vegan:false, rating:4.7 },
    { id:23, name:"White Rice & Stew", desc:"Classic with rich tomato & assorted meat stew",  price:1800, emoji:"🍽️", cal:"530 kcal", time:"15 min", spicy:0, allergens:[], halal:true, vegan:false, rating:4.5 },
    { id:24, name:"Coconut Rice",      desc:"Fragrant coconut-infused rice with peppers",      price:2500, emoji:"🥥", cal:"620 kcal", time:"30 min", spicy:1, allergens:["tree nuts"], halal:true, vegan:true, rating:4.9 },
  ],
  "Swallows": [
    { id:31, name:"Pounded Yam", desc:"Smooth & stretchy, freshly pounded",      price:800,  emoji:"🫓", cal:"240 kcal", time:"10 min", spicy:0, allergens:[], halal:true, vegan:true, rating:4.9 },
    { id:32, name:"Fufu",        desc:"Cassava fufu, soft & perfectly textured",  price:700,  emoji:"🫓", cal:"200 kcal", time:"10 min", spicy:0, allergens:[], halal:true, vegan:true, rating:4.8 },
    { id:33, name:"Eba",         desc:"Garri eba, firm & satisfying",             price:600,  emoji:"🫓", cal:"180 kcal", time:"8 min",  spicy:0, allergens:[], halal:true, vegan:true, rating:4.7 },
    { id:34, name:"Amala",       desc:"Silky yam flour swallow",                  price:800,  emoji:"🫓", cal:"220 kcal", time:"10 min", spicy:0, allergens:[], halal:true, vegan:true, rating:4.9 },
  ],
  "Grills & Sides": [
    { id:41, name:"Suya Platter",    desc:"Spiced beef skewers with yaji & onions",       price:3500, emoji:"🍢", cal:"490 kcal", time:"15 min", spicy:3, tag:"Must Try", allergens:["nuts"], halal:true, vegan:false, rating:4.9 },
    { id:42, name:"Grilled Chicken", desc:"Full chicken, marinated & charcoal grilled",   price:4500, emoji:"🍗", cal:"680 kcal", time:"35 min", spicy:1, allergens:[], halal:true, vegan:false, rating:4.8 },
    { id:43, name:"Fried Plantain",  desc:"Sweet ripe plantain, crispy edges",            price:800,  emoji:"🍌", cal:"210 kcal", time:"12 min", spicy:0, allergens:[], halal:true, vegan:true, rating:4.7 },
    { id:44, name:"Moi Moi",         desc:"Seasoned steamed bean pudding",                price:700,  emoji:"🫘", cal:"190 kcal", time:"10 min", spicy:0, allergens:["eggs"], halal:true, vegan:false, rating:4.6 },
  ],
  "Drinks": [
    { id:51, name:"Zobo Drink",  desc:"Hibiscus & ginger, chilled to perfection", price:500, emoji:"🥤", cal:"90 kcal",  time:"5 min", spicy:0, allergens:[], halal:true, vegan:true, rating:4.9 },
    { id:52, name:"Kunu",        desc:"Millet drink, sweet & delicately spiced",   price:500, emoji:"🥛", cal:"120 kcal", time:"5 min", spicy:0, allergens:[], halal:true, vegan:true, rating:4.8 },
    { id:53, name:"Fresh Juice", desc:"Freshly blended seasonal fruit",            price:800, emoji:"🧃", cal:"140 kcal", time:"8 min", spicy:0, allergens:[], halal:true, vegan:true, rating:4.7 },
    { id:54, name:"Soft Drinks", desc:"Coke, Fanta, Sprite – ice cold",            price:300, emoji:"🥃", cal:"150 kcal", time:"2 min", spicy:0, allergens:[], halal:true, vegan:true, rating:4.5 },
  ],
  "Snacks": [
    { id:61, name:"Puff Puff",  desc:"Golden deep-fried dough balls, 6pcs",       price:600, emoji:"🟡", cal:"310 kcal", time:"10 min", spicy:0, allergens:["gluten"], halal:true, vegan:true, rating:4.8 },
    { id:62, name:"Chin Chin",  desc:"Crispy fried pastry snack, full bag",        price:500, emoji:"🟤", cal:"280 kcal", time:"5 min",  spicy:0, allergens:["gluten"], halal:true, vegan:true, rating:4.7 },
    { id:63, name:"Meat Pie",   desc:"Flaky pastry with spiced meat filling",      price:800, emoji:"🥧", cal:"380 kcal", time:"8 min",  spicy:1, allergens:["gluten","eggs"], halal:true, vegan:false, rating:4.8 },
    { id:64, name:"Akara",      desc:"Bean fritters, crispy outside, soft inside", price:500, emoji:"🔶", cal:"240 kcal", time:"10 min", spicy:0, allergens:[], halal:true, vegan:true, rating:4.6 },
  ],
};

const PROMOS = [
  { id:1, title:"Buy One Get One", sub:"Jollof Rice — Today Only!", badge:"BOGO",     col1:"#1A3A1A", col2:"#2D6A2D", icon:"🍛", code:"BOGO24" },
  { id:2, title:"Family Combo",    sub:"Soup + Swallow for 4",       badge:"Save 20%", col1:"#3A1A0A", col2:"#8B3A12", icon:"🍲", code:"FAM20"  },
  { id:3, title:"Free Delivery",   sub:"Orders above ₦5,000",        badge:"Limited",  col1:"#1A1A3A", col2:"#2D2D8B", icon:"🛵", code:null     },
];

const REVIEWS = [
  { id:1, name:"Amaka O.",    rating:5, text:"Best egusi in Jos! Delivered hot and fresh every time. My go-to every weekend!", time:"2 hours ago", avatar:"👩🏾", verified:true, helpful:14, photo:"🍲" },
  { id:2, name:"Chukwudi E.", rating:5, text:"The suya platter is absolutely divine. My whole family loved it — we order weekly.", time:"Yesterday",  avatar:"👨🏿", verified:true, helpful:22, photo:null },
  { id:3, name:"Fatima B.",   rating:5, text:"Fast delivery, amazing taste. Jenny's Kitchen is top tier!", time:"2 days ago", avatar:"👩🏿", verified:true, helpful:8, photo:"🍛" },
  { id:4, name:"Emeka N.",    rating:4, text:"Jollof rice is on another level. Delivery was quick too. Will definitely order again.", time:"3 days ago", avatar:"👨🏾", verified:false, helpful:5, photo:null },
];

const ORDER_HISTORY = [
  { id:"JK-2026-0039", date:"Apr 12, 2026", items:["Egusi Soup","Pounded Yam","Zobo Drink"], total:3800, status:"Delivered", branch:"Jos Main", rating:5 },
  { id:"JK-2026-0031", date:"Apr 5, 2026",  items:["Jollof Rice","Suya Platter"],            total:5500, status:"Delivered", branch:"Kano Branch", rating:5 },
  { id:"JK-2026-0028", date:"Mar 28, 2026", items:["Pepper Soup","Eba","Kunu"],               total:4200, status:"Delivered", branch:"Abuja Branch", rating:4 },
];

const COMBOS = [
  { id:"c1", name:"Soup & Swallow Combo", desc:"Any soup + any swallow + a drink", price:3500, originalPrice:4200, emoji:"🍲🫓🥤", saves:700 },
  { id:"c2", name:"Family Feast",         desc:"2 soups + 2 swallows + 4 drinks",  price:9800, originalPrice:12000, emoji:"🥘🥘🫓🫓", saves:2200 },
  { id:"c3", name:"Grill Party Pack",     desc:"Suya + Grilled Chicken + Plantain + 2 Drinks", price:7500, originalPrice:9400, emoji:"🍢🍗🍌", saves:1900 },
];

const NOTIFICATIONS = [
  { id:1, icon:"🎁", title:"New Promo!", sub:"Use JENNY10 for 10% off today", time:"Now", unread:true },
  { id:2, icon:"🛵", title:"Order Delivered", sub:"Your order #JK-0039 was delivered", time:"2h ago", unread:true },
  { id:3, icon:"⭐", title:"Rate your order", sub:"How was your Egusi Soup?", time:"Yesterday", unread:false },
  { id:4, icon:"🔥", title:"Flash Sale!", sub:"Suya platter — 15% off for 2 hours", time:"2 days ago", unread:false },
];

const BRANCHES = [
  { id:1, name:"Jenny's Kitchen – Jos Main",  address:"12 Ahmadu Bello Way, Jos", state:"Plateau State", phone:"+234 800 123 4567", hours:"7am–10pm", distance:"0.8 km", rating:4.9, reviews:248, open:true, emoji:"🏪", lat:9.8965, lng:8.8583, delivery:true, pickup:true, highlight:"Original branch", wait:"20 min" },
  { id:2, name:"Jenny's Kitchen – Abuja",     address:"Plot 14, Wuse Zone 5, Abuja", state:"FCT Abuja",   phone:"+234 800 123 4568", hours:"8am–11pm", distance:"3.2 km", rating:4.8, reviews:182, open:true, emoji:"🏬", lat:9.0579, lng:7.4951, delivery:true, pickup:true, highlight:"Fastest delivery", wait:"15 min" },
  { id:3, name:"Jenny's Kitchen – Kano",      address:"44 Bompai Road, Kano", state:"Kano State",  phone:"+234 800 123 4569", hours:"7am–10pm", distance:"1.2 km", rating:4.7, reviews:134, open:true, emoji:"🏠", lat:12.0022, lng:8.5920, delivery:true, pickup:false, highlight:"New branch!", wait:"25 min" },
  { id:4, name:"Jenny's Kitchen – Kaduna",    address:"15 Independence Way, Kaduna", state:"Kaduna State",phone:"+234 800 123 4570", hours:"8am–9pm",  distance:"5.1 km", rating:4.6, reviews:98,  open:false, emoji:"🏢", lat:10.5105, lng:7.4165, delivery:false, pickup:true, highlight:"Coming soon", wait:"—" },
  { id:5, name:"Jenny's Kitchen – Bauchi",    address:"8 Dass Road, Bauchi", state:"Bauchi State",phone:"+234 800 123 4571", hours:"7am–9pm",  distance:"6.7 km", rating:4.8, reviews:76,  open:true, emoji:"🏡", lat:10.3158, lng:9.8442, delivery:true, pickup:true, highlight:"Local favourite", wait:"30 min" },
];

const RIDER = { name:"Ibrahim A.", rating:4.9, deliveries:2400, phone:"+234 811 234 5678", emoji:"🛵" };

const LOYALTY_TIERS = [
  { name:"Bronze", min:0,   max:199,  col:"#CD7F32", icon:"🥉" },
  { name:"Silver", min:200, max:499,  col:"#C0C0C0", icon:"🥈" },
  { name:"Gold",   min:500, max:999,  col:"#FFD700", icon:"🥇" },
  { name:"Diamond",min:1000,max:9999, col:"#B9F2FF", icon:"💎" },
];

const ADDRESSES = [
  { id:1, label:"Home", address:"14 Bompai Road, Kano", default:true, icon:"🏠" },
  { id:2, label:"Work", address:"Civic Centre, Kano", default:false, icon:"🏢" },
];

const fp = (p) => `₦${p.toLocaleString()}`;

/* ─────────────────── UTILITY COMPONENTS ─────────────────── */
function Stars({ r, size = 8, interactive = false, onRate }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 10 10"
          onClick={() => interactive && onRate && onRate(i)}
          style={{ cursor: interactive ? "pointer" : "default" }}>
          <polygon points="5,0.5 6.5,3.8 10,4.2 7.5,6.5 8.2,10 5,8.3 1.8,10 2.5,6.5 0,4.2 3.5,3.8"
            fill={i <= Math.round(r) ? T.gold : T.sand} />
        </svg>
      ))}
      <span style={{ fontSize:size-1, fontWeight:700, color:T.mist, marginLeft:3 }}>{r}</span>
    </div>
  );
}

function SpicyMeter({ level }) {
  if (!level) return null;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:2 }}>
      {[1,2,3].map(i => <span key={i} style={{ fontSize:8, opacity: i <= level ? 1 : 0.25 }}>🌶️</span>)}
    </div>
  );
}

function Pill({ children, col = T.ember, light = false, small = false }) {
  return (
    <span style={{
      display:"inline-block",
      padding: small ? "2px 7px" : "3px 10px",
      borderRadius:20, fontSize: small ? 8 : 9,
      fontWeight:800, letterSpacing:"0.05em", textTransform:"uppercase",
      background: light ? `${col}20` : col,
      color: light ? col : T.white,
      border: light ? `1px solid ${col}40` : "none",
      flexShrink:0,
    }}>{children}</span>
  );
}

function Badge({ count }) {
  if (!count) return null;
  return (
    <div style={{
      position:"absolute", top:-5, right:-6,
      background:`linear-gradient(135deg, ${T.ember}, ${T.emberDim})`,
      color:T.white, width:18, height:18, borderRadius:9,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:9, fontWeight:900, boxShadow:`0 2px 6px ${T.ember}66`,
      animation:"badgePop 0.35s cubic-bezier(.22,.68,0,1.3)",
      border:`2px solid ${T.bone}`,
    }}>{count > 9 ? "9+" : count}</div>
  );
}

function AddBtn({ onClick, popping, count = 0, onDecrement }) {
  const [ripple, setRipple] = useState(false);
  const handleClick = () => { setRipple(true); setTimeout(() => setRipple(false), 600); onClick(); };
  if (count > 0) {
    return (
      <div style={{ display:"flex", alignItems:"center", gap:0, background:`linear-gradient(135deg, ${T.ember}, ${T.emberDim})`, borderRadius:22, overflow:"hidden", boxShadow:`0 4px 14px ${T.ember}44` }}>
        <button onClick={onDecrement} style={{ width:28, height:28, border:"none", background:"transparent", color:T.white, fontSize:15, fontWeight:800, cursor:"pointer" }}>−</button>
        <span style={{ color:T.white, fontWeight:800, fontSize:12, minWidth:16, textAlign:"center" }}>{count}</span>
        <button onClick={handleClick} style={{ width:28, height:28, border:"none", background:"transparent", color:T.white, fontSize:15, fontWeight:800, cursor:"pointer" }}>+</button>
      </div>
    );
  }
  return (
    <button onClick={handleClick} className={popping ? "pop" : ""} style={{
      width:34, height:34, borderRadius:12,
      background:`linear-gradient(135deg, ${T.ember}, ${T.emberDim})`,
      border:"none", color:T.white, fontSize:20, fontWeight:700, cursor:"pointer",
      display:"flex", alignItems:"center", justifyContent:"center",
      boxShadow:`0 4px 16px ${T.ember}55`, flexShrink:0,
      position:"relative", overflow:"hidden", transition:"transform 0.15s",
    }}>
      {ripple && <div style={{ position:"absolute", inset:0, borderRadius:12, background:"rgba(255,255,255,0.4)", animation:"ripple 0.6s ease-out" }}/>}
      +
    </button>
  );
}

function Toast({ visible, message = "Added to cart" }) {
  if (!visible) return null;
  return (
    <div style={{
      position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)",
      zIndex:9000, background:T.ink, color:T.white,
      padding:"12px 20px", borderRadius:30,
      display:"flex", alignItems:"center", gap:10,
      boxShadow:"0 8px 28px rgba(0,0,0,0.3)",
      animation:"slideUp 0.3s ease, fadeIn 0.3s ease",
      whiteSpace:"nowrap", minWidth:180,
    }}>
      <span style={{ fontSize:14 }}>✓</span>
      <span style={{ fontSize:13, fontWeight:700 }}>{message}</span>
    </div>
  );
}

/* ─────────────────── LOGIN SCREEN ─────────────────── */
function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | signup | phone
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handle = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin({ name: name || "Guest User", email, phone }); }, 1200);
  };

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg, ${T.ink} 0%, ${T.inkSoft} 60%, ${T.ember}22 100%)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 20px", position:"relative", overflow:"hidden" }}>
      {/* BG circles */}
      <div style={{ position:"absolute", top:-80, right:-80, width:260, height:260, borderRadius:"50%", background:`radial-gradient(circle, ${T.ember}40 0%, transparent 70%)` }} />
      <div style={{ position:"absolute", bottom:-60, left:-60, width:200, height:200, borderRadius:"50%", background:`radial-gradient(circle, ${T.gold}30 0%, transparent 70%)` }} />

      {/* Logo */}
      <div className="float" style={{ marginBottom:28, textAlign:"center" }}>
        <div style={{ width:80, height:80, borderRadius:26, background:`linear-gradient(135deg, ${T.ember}, ${T.emberDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:42, margin:"0 auto 12px", boxShadow:`0 12px 36px ${T.ember}66` }}>👩‍🍳</div>
        <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:34, fontWeight:700, color:T.white, lineHeight:1 }}>Jenny's Kitchen</div>
        <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, marginTop:4, fontWeight:500 }}>Nigeria's #1 Food Experience</div>
      </div>

      {/* Card */}
      <div className="glass" style={{ width:"100%", maxWidth:400, borderRadius:28, padding:"28px 24px", boxShadow:"0 24px 60px rgba(0,0,0,0.35)" }}>
        {/* Tabs */}
        <div style={{ display:"flex", background:T.boneDim, borderRadius:16, padding:4, marginBottom:22, gap:4 }}>
          {["login","signup"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex:1, padding:"9px", borderRadius:12, border:"none", cursor:"pointer",
              background: mode===m ? `linear-gradient(135deg, ${T.ember}, ${T.emberDim})` : "transparent",
              color: mode===m ? T.white : T.mist,
              fontWeight:800, fontSize:12, textTransform:"capitalize", transition:"all 0.2s",
            }}>{m === "login" ? "Sign In" : "Sign Up"}</button>
          ))}
        </div>

        {mode === "signup" && (
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.mist, marginBottom:6 }}>Full Name</div>
            <div style={{ background:T.white, borderRadius:14, display:"flex", alignItems:"center", gap:10, padding:"13px 16px", border:`1.5px solid ${T.boneDim}` }}>
              <span style={{ opacity:.45 }}>👤</span>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" style={{ flex:1, border:"none", fontSize:13, background:"transparent", color:T.ink }} />
            </div>
          </div>
        )}

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.mist, marginBottom:6 }}>Email Address</div>
          <div style={{ background:T.white, borderRadius:14, display:"flex", alignItems:"center", gap:10, padding:"13px 16px", border:`1.5px solid ${T.boneDim}` }}>
            <span style={{ opacity:.45 }}>✉️</span>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" style={{ flex:1, border:"none", fontSize:13, background:"transparent", color:T.ink }} />
          </div>
        </div>

        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.mist, marginBottom:6 }}>Password</div>
          <div style={{ background:T.white, borderRadius:14, display:"flex", alignItems:"center", gap:10, padding:"13px 16px", border:`1.5px solid ${T.boneDim}` }}>
            <span style={{ opacity:.45 }}>🔒</span>
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" type={showPass ? "text" : "password"} style={{ flex:1, border:"none", fontSize:13, background:"transparent", color:T.ink }} />
            <button onClick={() => setShowPass(s => !s)} style={{ border:"none", background:"none", cursor:"pointer", fontSize:14, opacity:.5 }}>{showPass ? "🙈" : "👁️"}</button>
          </div>
          {mode === "login" && <div style={{ textAlign:"right", marginTop:6, fontSize:11, color:T.ember, fontWeight:700, cursor:"pointer" }}>Forgot password?</div>}
        </div>

        <button onClick={handle} className="btn-press" disabled={loading} style={{
          width:"100%", background:`linear-gradient(135deg, ${T.ember}, ${T.emberDim})`,
          color:T.white, border:"none", borderRadius:18, padding:"15px",
          fontWeight:800, fontSize:14, cursor:"pointer",
          boxShadow:`0 8px 24px ${T.ember}55`, transition:"opacity 0.2s",
          opacity: loading ? 0.7 : 1,
        }}>
          {loading ? <span className="spin" style={{ display:"inline-block" }}>⏳</span> : (mode === "login" ? "Sign In →" : "Create Account →")}
        </button>

        {/* Divider */}
        <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0" }}>
          <div style={{ flex:1, height:1, background:T.boneDim }} />
          <span style={{ fontSize:11, color:T.sand, fontWeight:600 }}>or continue with</span>
          <div style={{ flex:1, height:1, background:T.boneDim }} />
        </div>

        <div style={{ display:"flex", gap:10 }}>
          {[["📱","Phone"], ["🇬","Google"], ["👤","Guest"]].map(([ic, label]) => (
            <button key={label} onClick={() => onLogin({ name:"Guest User", email:"guest@jenny.ng", phone:"" })} style={{
              flex:1, padding:"11px 8px", borderRadius:14, border:`1.5px solid ${T.boneDim}`,
              background:T.white, cursor:"pointer", fontSize:10, fontWeight:700, color:T.ink,
              display:"flex", flexDirection:"column", alignItems:"center", gap:4, transition:"all 0.2s",
            }}>
              <span style={{ fontSize:18 }}>{ic}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop:16, color:"rgba(255,255,255,0.3)", fontSize:10, textAlign:"center" }}>
        By continuing you agree to Jenny's Kitchen Terms & Privacy Policy
      </div>
    </div>
  );
}

/* ─────────────────── ITEM DETAIL MODAL ─────────────────── */
function ItemDetailModal({ item, onClose, onAddToCart, inCartQty, onDecrement }) {
  const [qty, setQty] = useState(inCartQty || 1);
  const [spice, setSpice] = useState("Medium");
  const [notes, setNotes] = useState("");
  const [extras, setExtras] = useState([]);
  const [activeTab, setActiveTab] = useState("customize"); // customize | reviews | nutrition

  const EXTRAS = [
    { name:"Extra Meat", price:500 }, { name:"Extra Fish", price:400 },
    { name:"Extra Pepper", price:100 }, { name:"Double Portion", price:item.price },
    { name:"Extra Sauce", price:200 }, { name:"Side Salad", price:300 },
  ];
  const NUTRITION = [
    ["Calories", item.cal], ["Protein", "24g"], ["Carbs", "52g"],
    ["Fat", "18g"], ["Sodium", "480mg"], ["Fibre", "4g"],
  ];

  const toggleExtra = (e) => setExtras(prev => prev.includes(e.name) ? prev.filter(x => x !== e.name) : [...prev, e.name]);
  const extrasTotal = EXTRAS.filter(e => extras.includes(e.name)).reduce((s, e) => s + e.price, 0);
  const total = (item.price + extrasTotal) * qty;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:5000, background:"rgba(15,13,11,0.75)", display:"flex", alignItems:"flex-end", justifyContent:"center", animation:"fadeIn 0.25s" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="slide-up" style={{ background:T.bone, borderRadius:"28px 28px 0 0", width:"100%", maxWidth:430, maxHeight:"90vh", overflow:"auto", paddingBottom:24 }}>
        {/* Hero */}
        <div style={{ height:180, background:`linear-gradient(160deg, ${T.ink} 0%, ${T.inkSoft} 100%)`, borderRadius:"28px 28px 0 0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:88, position:"relative" }}>
          {item.emoji}
          <button onClick={onClose} style={{ position:"absolute", top:16, right:16, width:36, height:36, borderRadius:12, background:"rgba(255,255,255,0.15)", border:"none", color:T.white, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          {item.tag && <div style={{ position:"absolute", top:16, left:16 }}><Pill col={T.ember}>{item.tag}</Pill></div>}
        </div>
        <div style={{ padding:"18px 18px 0" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:26, fontWeight:700, color:T.ink, lineHeight:1.1 }}>{item.name}</div>
              <div style={{ fontSize:12, color:T.mist, marginTop:4, lineHeight:1.5 }}>{item.desc}</div>
            </div>
            <div style={{ fontWeight:900, color:T.ember, fontSize:22 }}>{fp(item.price)}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, flexWrap:"wrap" }}>
            <Stars r={item.rating || 4.8} size={10} />
            <SpicyMeter level={item.spicy} />
            <span style={{ fontSize:10, color:T.mist, background:T.boneDim, padding:"3px 8px", borderRadius:10 }}>⏱ {item.time}</span>
            {item.halal && <Pill col={T.sage} light small>✓ Halal</Pill>}
            {item.vegan && <Pill col={T.teal} light small>🌿 Vegan</Pill>}
          </div>

          {/* Sub-tabs */}
          <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${T.boneDim}`, marginBottom:16 }}>
            {["customize","nutrition","reviews"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex:1, padding:"8px 4px", border:"none", background:"transparent", fontSize:10, fontWeight:800, cursor:"pointer", color: activeTab===tab ? T.ember : T.mist, borderBottom: activeTab===tab ? `2px solid ${T.ember}` : "2px solid transparent", textTransform:"capitalize", transition:"all 0.2s" }}>
                {tab === "customize" ? "✏️ Customize" : tab === "nutrition" ? "📊 Nutrition" : "⭐ Reviews"}
              </button>
            ))}
          </div>

          {activeTab === "customize" && (
            <>
              {/* Spice level */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontWeight:700, fontSize:12, color:T.ink, marginBottom:8 }}>🌶️ Spice Level</div>
                <div style={{ display:"flex", gap:8 }}>
                  {["Mild","Medium","Hot","Extra Hot"].map(s => (
                    <button key={s} onClick={() => setSpice(s)} style={{
                      padding:"6px 12px", borderRadius:20, fontSize:10, fontWeight:700, cursor:"pointer", border:"none",
                      background: spice === s ? `linear-gradient(135deg, ${T.ember}, ${T.emberDim})` : T.boneDim,
                      color: spice === s ? T.white : T.mist,
                      transition:"all 0.2s",
                    }}>{s}</button>
                  ))}
                </div>
              </div>
              {/* Extras */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontWeight:700, fontSize:12, color:T.ink, marginBottom:8 }}>➕ Add Extras</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {EXTRAS.map(e => {
                    const sel = extras.includes(e.name);
                    return (
                      <button key={e.name} onClick={() => toggleExtra(e)} style={{
                        padding:"7px 13px", borderRadius:20, fontSize:10, fontWeight:700, cursor:"pointer",
                        border: sel ? `1.5px solid ${T.ember}` : `1.5px solid ${T.sand}`,
                        background: sel ? `${T.ember}12` : T.white,
                        color: sel ? T.ember : T.mist,
                        transition:"all 0.2s",
                      }}>{sel ? "✓ " : ""}{e.name} +{fp(e.price)}</button>
                    );
                  })}
                </div>
              </div>
              {/* Special instructions */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontWeight:700, fontSize:12, color:T.ink, marginBottom:6 }}>📝 Special Instructions</div>
                <textarea
                  placeholder="e.g. No onions, extra spicy, pack separately..."
                  value={notes} onChange={e => setNotes(e.target.value)}
                  style={{ width:"100%", background:T.white, border:`1.5px solid ${T.boneDim}`, borderRadius:14, padding:"10px 14px", fontSize:12, color:T.ink, resize:"none", minHeight:60, lineHeight:1.5 }}
                />
              </div>
              {item.allergens && item.allergens.length > 0 && (
                <div style={{ marginBottom:14, background:`${T.gold}12`, borderRadius:12, padding:"8px 12px", border:`1px solid ${T.gold}30` }}>
                  <span style={{ fontSize:10, color:"#8B6914", fontWeight:700 }}>⚠️ Contains: {item.allergens.join(", ")}</span>
                </div>
              )}
            </>
          )}

          {activeTab === "nutrition" && (
            <div style={{ marginBottom:14 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                {NUTRITION.map(([label, val]) => (
                  <div key={label} style={{ background:T.white, borderRadius:14, padding:"12px 10px", textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontWeight:900, fontSize:14, color:T.ember }}>{val}</div>
                    <div style={{ fontSize:9, color:T.mist, fontWeight:600, marginTop:2 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:12, background:`${T.teal}10`, borderRadius:12, padding:"10px 14px", border:`1px solid ${T.teal}30` }}>
                <div style={{ fontSize:10, color:T.teal, fontWeight:700 }}>🌿 Dietary: {item.halal ? "✓ Halal" : ""} {item.vegan ? "✓ Vegan" : ""} {item.allergens?.length ? `⚠️ Contains ${item.allergens.join(", ")}` : ""}</div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div style={{ marginBottom:14 }}>
              {REVIEWS.slice(0,3).map((r, i) => (
                <div key={i} style={{ background:T.white, borderRadius:16, padding:"12px", marginBottom:8, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <span style={{ fontSize:22 }}>{r.avatar}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:12, color:T.ink }}>{r.name} {r.verified && <span style={{ color:T.sky, fontSize:9 }}>✓</span>}</div>
                      <Stars r={r.rating} size={8} />
                    </div>
                    <span style={{ fontSize:9, color:T.sand }}>{r.time}</span>
                  </div>
                  <div style={{ fontSize:11, color:T.mist, lineHeight:1.5 }}>{r.text}</div>
                </div>
              ))}
            </div>
          )}

          {/* Qty + Add */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:0, background:T.boneDim, borderRadius:22, overflow:"hidden" }}>
              <button onClick={() => setQty(q => Math.max(1, q-1))} style={{ width:36, height:36, border:"none", background:"transparent", fontSize:18, fontWeight:800, cursor:"pointer", color:T.ink }}>−</button>
              <span style={{ fontWeight:800, fontSize:15, minWidth:24, textAlign:"center", color:T.ink }}>{qty}</span>
              <button onClick={() => setQty(q => q+1)} style={{ width:36, height:36, border:"none", background:"transparent", fontSize:18, fontWeight:800, cursor:"pointer", color:T.ink }}>+</button>
            </div>
            <button onClick={() => { for(let i=0; i<qty; i++) onAddToCart({...item, spice, notes, extras}); onClose(); }} className="btn-press" style={{
              flex:1, background:`linear-gradient(135deg, ${T.ember}, ${T.emberDim})`,
              color:T.white, border:"none", borderRadius:18, padding:"14px",
              fontWeight:800, fontSize:14, cursor:"pointer",
              boxShadow:`0 6px 20px ${T.ember}44`,
            }}>Add to Cart · {fp(total)}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── AI ASSISTANT (Bottom Bar + Modal) ─────────────────── */
function AIAssistant({ onClose, onAddToCart, cart, inline = false }) {
  const [messages, setMessages] = useState([
    { role:"assistant", text:"Hey! 👩‍🍳 I'm Jenny's AI — what are you craving today? I can suggest dishes, combos, dietary options, or help you order!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const allMenuItems = Object.values(MENU).flat();

  const sendMessage = async (overrideInput) => {
    const userMsg = (overrideInput || input).trim();
    if (!userMsg || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role:"user", text:userMsg }]);
    setLoading(true);

    try {
      const menuContext = allMenuItems.map(i => `${i.name} (₦${i.price}) - ${i.desc} - ${i.cal} - Spicy:${i.spicy} - ${i.halal?"Halal":""} - ${i.vegan?"Vegan":""}`).join("\n");
      const cartContext = cart.length > 0 ? `Cart: ${cart.map(i => `${i.name} x${i.qty}`).join(", ")}` : "Cart empty";

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:`You are Jenny's Kitchen AI food assistant — warm, helpful, enthusiastic about Nigerian cuisine.

MENU:
${menuContext}

${cartContext}

BRANCHES: Jos (main), Abuja, Kano, Kaduna, Bauchi.

Personality: Friendly, concise (under 100 words unless explaining), use food emojis naturally. You can recommend dishes, suggest combos, explain Nigerian food, give dietary advice (halal/vegan), help with orders. Never add to cart directly — tell them to tap + on the item.`,
          messages:[
            ...messages.slice(-10).map(m => ({ role:m.role, content:m.text })),
            { role:"user", content:userMsg }
          ]
        })
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't respond. Try again!";
      setMessages(prev => [...prev, { role:"assistant", text:reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role:"assistant", text:"Connection issue. Try again shortly! 🙏" }]);
    }
    setLoading(false);
  };

  const quickPrompts = ["Most popular dish?", "Suggest a combo for 2", "Vegan options?", "What's halal?", "Cheapest meal?"];

  if (inline) {
    // Bottom bar inline mode
    return (
      <div style={{ background:T.white, borderTop:`1px solid ${T.boneDim}` }}>
        {/* Mini messages preview - last 2 */}
        {messages.length > 1 && (
          <div style={{ maxHeight:120, overflowY:"auto", padding:"10px 14px 0" }}>
            {messages.slice(-3).map((msg, i) => (
              <div key={i} style={{ display:"flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom:6 }}>
                {msg.role === "assistant" && <span style={{ fontSize:14, marginRight:5 }}>🤖</span>}
                <div style={{
                  maxWidth:"78%",
                  background: msg.role === "user" ? `linear-gradient(135deg, ${T.ember}, ${T.emberDim})` : T.boneDim,
                  color: msg.role === "user" ? T.white : T.ink,
                  borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  padding:"8px 12px", fontSize:11.5, lineHeight:1.5,
                }}>{msg.text}</div>
              </div>
            ))}
            {loading && <div style={{ fontSize:11, color:T.mist, paddingLeft:22, paddingBottom:4 }}>Jenny is typing…</div>}
            <div ref={messagesEndRef} />
          </div>
        )}
        {/* Quick prompts (first interaction only) */}
        {messages.length <= 1 && (
          <div style={{ padding:"8px 14px 0", display:"flex", gap:7, overflowX:"auto", scrollbarWidth:"none" }}>
            {quickPrompts.map(p => (
              <button key={p} onClick={() => sendMessage(p)} style={{ padding:"5px 11px", borderRadius:20, fontSize:9.5, fontWeight:700, cursor:"pointer", flexShrink:0, background:`${T.purple}12`, border:`1px solid ${T.purple}30`, color:T.purple }}>{p}</button>
            ))}
          </div>
        )}
        {/* Input */}
        <div style={{ padding:"8px 14px 10px", display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ width:28, height:28, borderRadius:9, background:`linear-gradient(135deg, ${T.purple}, #8B5CF6)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>🤖</div>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask Jenny's AI anything…"
            style={{ flex:1, background:T.boneDim, border:"none", borderRadius:16, padding:"9px 14px", fontSize:12, color:T.ink }}
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
            width:36, height:36, borderRadius:11, border:"none", cursor:"pointer",
            background: input.trim() ? `linear-gradient(135deg, ${T.ember}, ${T.emberDim})` : T.boneDim,
            color:T.white, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.2s",
          }}>➤</button>
        </div>
      </div>
    );
  }

  // Modal mode
  return (
    <div style={{ position:"fixed", inset:0, zIndex:6000, background:"rgba(15,13,11,0.75)", display:"flex", alignItems:"flex-end", justifyContent:"center", animation:"fadeIn 0.25s" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="slide-up" style={{ background:T.bone, borderRadius:"28px 28px 0 0", width:"100%", maxWidth:430, height:"80vh", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"18px 18px 14px", borderBottom:`1px solid ${T.boneDim}`, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:46, height:46, borderRadius:16, background:`linear-gradient(135deg, ${T.purple}, #8B5CF6)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🤖</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:15, color:T.ink }}>Jenny's AI Assistant</div>
            <div style={{ fontSize:11, color:T.sage, fontWeight:600 }}>● Online · Powered by Claude AI</div>
          </div>
          <button onClick={onClose} style={{ width:34, height:34, borderRadius:11, background:T.boneDim, border:"none", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 0" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display:"flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom:12, animation:"waveIn 0.3s ease both" }}>
              {msg.role === "assistant" && (
                <div style={{ width:32, height:32, borderRadius:10, background:`linear-gradient(135deg, ${T.purple}, #8B5CF6)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, marginRight:8, flexShrink:0, alignSelf:"flex-end" }}>🤖</div>
              )}
              <div style={{
                maxWidth:"76%",
                background: msg.role === "user" ? `linear-gradient(135deg, ${T.ember}, ${T.emberDim})` : T.white,
                color: msg.role === "user" ? T.white : T.ink,
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding:"11px 14px", fontSize:13, lineHeight:1.55,
                boxShadow:"0 2px 10px rgba(0,0,0,0.08)",
              }}>{msg.text}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <div style={{ width:32, height:32, borderRadius:10, background:`linear-gradient(135deg, ${T.purple}, #8B5CF6)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🤖</div>
              <div style={{ background:T.white, borderRadius:"18px 18px 18px 4px", padding:"12px 16px", display:"flex", gap:5, alignItems:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.08)" }}>
                {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:T.mist, animation:`typing 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 2 && (
          <div style={{ padding:"12px 16px 0", display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none" }}>
            {quickPrompts.map(p => (
              <button key={p} onClick={() => sendMessage(p)} style={{
                padding:"7px 13px", borderRadius:20, fontSize:10.5, fontWeight:700, cursor:"pointer", flexShrink:0,
                background:`${T.purple}12`, border:`1px solid ${T.purple}30`, color:T.purple,
              }}>{p}</button>
            ))}
          </div>
        )}

        <div style={{ padding:"12px 16px 20px", display:"flex", gap:10, alignItems:"center" }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask me anything about the menu…"
            style={{ flex:1, background:T.white, border:`1.5px solid ${T.boneDim}`, borderRadius:22, padding:"12px 16px", fontSize:13, color:T.ink }}
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
            width:44, height:44, borderRadius:14, border:"none", cursor:"pointer",
            background: input.trim() ? `linear-gradient(135deg, ${T.ember}, ${T.emberDim})` : T.boneDim,
            color:T.white, fontSize:18, display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.2s",
          }}>➤</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── NEARBY LOCATIONS SCREEN ─────────────────── */
function LocationsScreen({ onSelectBranch }) {
  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDelivery, setFilterDelivery] = useState(false);

  let filtered = BRANCHES.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.state.toLowerCase().includes(search.toLowerCase()) ||
    b.address.toLowerCase().includes(search.toLowerCase())
  );
  if (filterOpen) filtered = filtered.filter(b => b.open);
  if (filterDelivery) filtered = filtered.filter(b => b.delivery);

  return (
    <div style={{ paddingBottom:160 }}>
      <div style={{ background:`linear-gradient(160deg, ${T.ink} 0%, ${T.inkSoft} 100%)`, padding:"20px 18px 22px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, opacity:0.12, backgroundImage:"repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.04) 28px, rgba(255,255,255,0.04) 29px), repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(255,255,255,0.04) 28px, rgba(255,255,255,0.04) 29px)" }}/>
        {BRANCHES.filter(b=>b.open).map((b,i) => (
          <div key={b.id} style={{ position:"absolute", width:12, height:12, borderRadius:"50%", background:T.ember,
            top:`${20 + (i*14)}%`, left:`${12 + i*18}%`,
            boxShadow:`0 0 0 8px ${T.ember}22, 0 0 0 16px ${T.ember}11`, animation:`pulse 2s ${i*0.4}s ease-in-out infinite`
          }} />
        ))}
        <div style={{ position:"relative", zIndex:2 }}>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:26, fontWeight:700, color:T.white, marginBottom:4 }}>Our Locations</div>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12, marginBottom:14 }}>{BRANCHES.filter(b=>b.open).length} branches open · Across Northern Nigeria</div>
          <div style={{ background:"rgba(255,255,255,0.09)", borderRadius:16, display:"flex", alignItems:"center", gap:10, padding:"11px 14px", border:"1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ opacity:.5, fontSize:15 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search city or branch name…"
              style={{ flex:1, border:"none", fontSize:13, background:"transparent", color:T.white }} />
            {search && <span onClick={() => setSearch("")} style={{ color:"rgba(255,255,255,0.4)", cursor:"pointer" }}>✕</span>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"flex", gap:0, background:T.white, borderBottom:`1px solid ${T.boneDim}` }}>
        {[["5","Branches"],["3","States"],["4.8","Avg Rating"],["30min","Avg Delivery"]].map(([v,l]) => (
          <div key={l} style={{ flex:1, padding:"11px 0", textAlign:"center", borderRight:`1px solid ${T.boneDim}` }}>
            <div style={{ fontWeight:900, fontSize:16, color:T.ember }}>{v}</div>
            <div style={{ fontSize:9, color:T.mist, fontWeight:600 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ padding:"12px 14px 0", display:"flex", gap:8 }}>
        <button onClick={() => setFilterOpen(s=>!s)} style={{ padding:"6px 14px", borderRadius:20, fontSize:10.5, fontWeight:700, cursor:"pointer", background: filterOpen ? `${T.sage}18` : T.boneDim, border: filterOpen ? `1.5px solid ${T.sage}` : `1px solid ${T.sand}`, color: filterOpen ? T.sage : T.mist }}>● Open Now</button>
        <button onClick={() => setFilterDelivery(s=>!s)} style={{ padding:"6px 14px", borderRadius:20, fontSize:10.5, fontWeight:700, cursor:"pointer", background: filterDelivery ? `${T.teal}18` : T.boneDim, border: filterDelivery ? `1.5px solid ${T.teal}` : `1px solid ${T.sand}`, color: filterDelivery ? T.teal : T.mist }}>🛵 Delivery</button>
      </div>

      <div style={{ padding:"12px 14px" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"40px 20px", color:T.mist }}>
            <div style={{ fontSize:40, marginBottom:10 }}>📍</div>
            <div style={{ fontWeight:700, fontSize:14 }}>No branches found</div>
          </div>
        )}
        {filtered.map((branch, i) => (
          <div key={branch.id} className="slide-up card-hover" style={{ animationDelay:`${i*0.06}s`, background:T.white, borderRadius:22, padding:"16px", marginBottom:12, boxShadow:"0 3px 16px rgba(0,0,0,0.08)", cursor:"pointer", border: selectedBranch === branch.id ? `2px solid ${T.ember}` : `1.5px solid ${T.boneDim}` }}
            onClick={() => setSelectedBranch(selectedBranch === branch.id ? null : branch.id)}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
              <div style={{ width:52, height:52, borderRadius:16, background: branch.open ? `${T.ember}14` : `${T.sand}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{branch.emoji}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                  <div style={{ fontWeight:700, fontSize:13, color:T.ink, lineHeight:1.3 }}>{branch.name}</div>
                  <div style={{ fontSize:9, fontWeight:800, padding:"3px 8px", borderRadius:20, background: branch.open ? `${T.sage}18` : `${T.sand}40`, color: branch.open ? T.sage : T.mist, flexShrink:0, marginLeft:6 }}>
                    {branch.open ? "● Open" : "○ Closed"}
                  </div>
                </div>
                <div style={{ fontSize:11, color:T.mist, marginBottom:6 }}>📍 {branch.address}</div>
                <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                  <Stars r={branch.rating} size={8} />
                  <span style={{ fontSize:10, color:T.sky, fontWeight:700 }}>📏 {branch.distance}</span>
                  {branch.open && <span style={{ fontSize:10, color:T.success, fontWeight:700 }}>⏱ ~{branch.wait}</span>}
                </div>
                <div style={{ marginTop:6, display:"flex", gap:6 }}>
                  {branch.highlight && <Pill col={T.ember} light small>{branch.highlight}</Pill>}
                  {branch.delivery && <Pill col={T.teal} light small>🛵 Delivery</Pill>}
                  {branch.pickup && <Pill col={T.purple} light small>🏃 Pickup</Pill>}
                </div>
              </div>
            </div>

            {selectedBranch === branch.id && (
              <div className="slide-down" style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${T.boneDim}` }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                  {[["📞","Phone",branch.phone],["🕐","Hours",branch.hours],["🗺️","State",branch.state],["📏","Distance",branch.distance]].map(([ic,l,v]) => (
                    <div key={l} style={{ background:T.boneDim, borderRadius:12, padding:"10px 12px" }}>
                      <div style={{ fontSize:10, color:T.mist, marginBottom:2 }}>{ic} {l}</div>
                      <div style={{ fontWeight:700, fontSize:12, color:T.ink }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <a href={`tel:${branch.phone}`} style={{ flex:1, background:`${T.sky}14`, border:`1.5px solid ${T.sky}40`, borderRadius:14, padding:"10px", fontSize:11, fontWeight:800, color:T.sky, cursor:"pointer", textDecoration:"none", textAlign:"center", display:"block" }}>
                    📞 Call Branch
                  </a>
                  {branch.open && (
                    <button onClick={() => onSelectBranch && onSelectBranch(branch)} style={{ flex:1, background:`linear-gradient(135deg, ${T.ember}, ${T.emberDim})`, border:"none", borderRadius:14, padding:"10px", fontSize:11, fontWeight:800, color:T.white, cursor:"pointer", boxShadow:`0 4px 14px ${T.ember}44` }}>
                      🛵 Order Here
                    </button>
                  )}
                  <button onClick={() => window.open(`https://maps.google.com/?q=${branch.lat},${branch.lng}`, "_blank")} style={{ width:44, background:`${T.sage}14`, border:`1.5px solid ${T.sage}40`, borderRadius:14, padding:"10px", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    🗺️
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────── HOME SCREEN ─────────────────── */
function HomeScreen({ onAddToCart, onNavigate, cart, wishlist, setWishlist, showToast, onOpenAI, user }) {
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [promoIdx, setPromoIdx] = useState(0);
  const [searchQ, setSearchQ] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 900); return () => clearTimeout(t); }, []);
  useEffect(() => { const t = setInterval(() => setPromoIdx(i => (i + 1) % PROMOS.length), 4000); return () => clearInterval(t); }, []);

  const inCart = (id) => cart.find(c => c.id === id);
  const toggleWish = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    showToast(wishlist.includes(id) ? "Removed from favourites" : "❤️ Saved to favourites");
  };

  const promo = PROMOS[promoIdx];
  const allItems = Object.values(MENU).flat();
  const searchResults = searchQ.length > 1 ? allItems.filter(i =>
    i.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    i.desc.toLowerCase().includes(searchQ.toLowerCase())
  ) : [];

  const hr = new Date().getHours();
  const greeting = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ paddingBottom:160 }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(160deg, ${T.ink} 0%, ${T.inkSoft} 100%)`, padding:"20px 18px 24px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:220, height:220, borderRadius:"50%", background:`radial-gradient(circle, ${T.ember}30 0%, transparent 70%)` }} />
        <div style={{ position:"relative", zIndex:2 }}>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12, marginBottom:4, fontWeight:500 }}>{greeting} 👋</div>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:26, fontWeight:700, color:T.white, lineHeight:1.1, marginBottom:14 }}>
            {user?.name ? `Welcome back, ${user.name.split(" ")[0]}!` : "What are you craving today?"}
          </div>

          {/* Search bar */}
          <div style={{ background:"rgba(255,255,255,0.09)", borderRadius:16, display:"flex", alignItems:"center", gap:8, padding:"10px 14px", border:"1px solid rgba(255,255,255,0.08)", cursor:"text" }}
            onClick={() => setShowSearch(true)}>
            <span style={{ fontSize:15, opacity:0.5 }}>🔍</span>
            <input
              value={searchQ} onChange={e => setSearchQ(e.target.value)}
              onFocus={() => setShowSearch(true)}
              placeholder="Search dishes, categories…"
              style={{ flex:1, border:"none", fontSize:13, background:"transparent", color:T.white }}
            />
            <button onClick={onOpenAI} style={{ width:36, height:36, borderRadius:12, background:`linear-gradient(135deg, ${T.purple}, #8B5CF6)`, border:"none", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>🤖</button>
          </div>

          {/* Search results dropdown */}
          {showSearch && searchQ.length > 1 && (
            <div style={{ marginTop:8, background:T.white, borderRadius:18, overflow:"hidden", maxHeight:200, overflowY:"auto", boxShadow:"0 8px 32px rgba(0,0,0,0.25)", animation:"slideDown 0.2s ease" }}>
              {searchResults.length === 0 ? (
                <div style={{ padding:"16px", textAlign:"center", color:T.mist, fontSize:12 }}>No results for "{searchQ}"</div>
              ) : searchResults.slice(0,6).map(item => (
                <div key={item.id} onClick={() => { setSelectedItem(item); setShowSearch(false); setSearchQ(""); }} style={{ padding:"10px 14px", display:"flex", alignItems:"center", gap:10, cursor:"pointer", borderBottom:`1px solid ${T.boneDim}` }}>
                  <span style={{ fontSize:22 }}>{item.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:12, color:T.ink }}>{item.name}</div>
                    <div style={{ fontSize:10, color:T.mist }}>{fp(item.price)}</div>
                  </div>
                  <span style={{ fontSize:11, color:T.ember, fontWeight:700 }}>+</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showSearch && <div style={{ position:"fixed", inset:0, zIndex:1 }} onClick={() => { setShowSearch(false); setSearchQ(""); }} />}

      {/* Promo banner */}
      {!loading && (
        <div style={{ margin:"14px 14px 0", borderRadius:22, overflow:"hidden", boxShadow:`0 8px 28px ${T.ember}22`, cursor:"pointer" }}>
          <div style={{ background:`linear-gradient(135deg, ${promo.col1}, ${promo.col2})`, padding:"16px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", right:-10, top:-10, fontSize:78, opacity:0.15 }}>{promo.icon}</div>
            <div>
              <div style={{ color:"rgba(255,255,255,0.6)", fontSize:9, fontWeight:700, letterSpacing:"0.08em", marginBottom:3 }}>LIMITED TIME OFFER</div>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:19, fontWeight:700, color:T.white, marginBottom:3 }}>{promo.title}</div>
              <div style={{ color:"rgba(255,255,255,0.65)", fontSize:11 }}>{promo.sub}</div>
              {promo.code && <div style={{ marginTop:7, background:"rgba(255,255,255,0.15)", display:"inline-block", padding:"3px 11px", borderRadius:20, color:T.white, fontSize:10, fontWeight:800 }}>CODE: {promo.code}</div>}
            </div>
            <Pill col={T.gold}>{promo.badge}</Pill>
          </div>
          <div style={{ background:promo.col1, padding:"5px", display:"flex", justifyContent:"center", gap:4 }}>
            {PROMOS.map((_, i) => <div key={i} style={{ width: i === promoIdx ? 16 : 5, height:5, borderRadius:3, background: i === promoIdx ? T.white : "rgba(255,255,255,0.25)", transition:"all 0.3s" }} />)}
          </div>
        </div>
      )}

      {/* AI strip */}
      <div style={{ margin:"14px 14px 0" }}>
        <div onClick={onOpenAI} style={{ background:`linear-gradient(135deg, ${T.purple}18, ${T.purple}08)`, border:`1.5px solid ${T.purple}30`, borderRadius:18, padding:"13px 16px", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
          <div style={{ width:40, height:40, borderRadius:13, background:`linear-gradient(135deg, ${T.purple}, #8B5CF6)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🤖</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:13, color:T.purple }}>AI Food Recommendations</div>
            <div style={{ fontSize:11, color:T.mist }}>Personalised for you · Ask anything</div>
          </div>
          <div style={{ color:T.purple, fontSize:20 }}>›</div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding:"18px 14px 0" }}>
        <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:21, fontWeight:700, color:T.ink, marginBottom:12 }}>Browse Categories</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10 }}>
          {CATEGORIES.map((cat, i) => (
            <div key={cat.id} className="card-hover" style={{ background:T.white, borderRadius:18, padding:"14px 10px", textAlign:"center", cursor:"pointer", boxShadow:"0 2px 10px rgba(0,0,0,0.07)", border:`1.5px solid ${T.boneDim}`, animationDelay:`${i*0.05}s` }}
              onClick={() => onNavigate("menu", cat.name)}>
              <div style={{ fontSize:28, marginBottom:6 }}>{cat.emoji}</div>
              <div style={{ fontSize:10, fontWeight:700, color:T.ink, lineHeight:1.2 }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending / Popular */}
      <div style={{ padding:"20px 14px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:21, fontWeight:700, color:T.ink }}>🔥 Trending Now</div>
          <button onClick={() => onNavigate("menu")} style={{ fontSize:11, color:T.ember, fontWeight:700, background:`${T.ember}12`, border:"none", padding:"5px 12px", borderRadius:20, cursor:"pointer" }}>See all</button>
        </div>
        <div style={{ display:"flex", gap:12, overflowX:"auto", scrollbarWidth:"none", paddingBottom:4 }}>
          {loading ? [1,2,3].map(i => <div key={i} className="shimmer-bg" style={{ borderRadius:22, width:170, height:200, flexShrink:0 }} />) :
            POPULAR.map((item, i) => {
              const c = inCart(item.id);
              const wished = wishlist.includes(item.id);
              return (
                <div key={item.id} className="slide-up card-hover" style={{ animationDelay:`${i*0.08}s`, background:T.white, borderRadius:22, minWidth:170, flexShrink:0, overflow:"hidden", boxShadow:"0 4px 18px rgba(0,0,0,0.09)", cursor:"pointer", border:`1.5px solid ${T.boneDim}` }}>
                  <div style={{ height:110, background:`linear-gradient(135deg, ${T.ink}, ${T.inkSoft})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:54, position:"relative" }}
                    onClick={() => setSelectedItem(item)}>
                    {item.emoji}
                    {item.tag && <div style={{ position:"absolute", top:8, left:8 }}><Pill col={T.ember} small>{item.tag}</Pill></div>}
                    <button onClick={e => { e.stopPropagation(); toggleWish(item.id); }} style={{ position:"absolute", top:8, right:8, width:28, height:28, borderRadius:9, background:"rgba(255,255,255,0.15)", border:"none", fontSize:15, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {wished ? "❤️" : "🤍"}
                    </button>
                  </div>
                  <div style={{ padding:"10px 12px 12px" }} onClick={() => setSelectedItem(item)}>
                    <div style={{ fontWeight:700, fontSize:12.5, color:T.ink, marginBottom:2 }}>{item.name}</div>
                    <div style={{ fontSize:10, color:T.mist, marginBottom:6 }}>{item.desc}</div>
                    <Stars r={item.rating} size={8} />
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                      <span style={{ fontWeight:900, color:T.ember, fontSize:14 }}>{fp(item.price)}</span>
                      <div onClick={e => e.stopPropagation()}>
                        <AddBtn onClick={() => { onAddToCart(item); }} onDecrement={() => onAddToCart({...item, _remove:true})} count={c?.qty||0} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>

      {/* Combos */}
      <div style={{ padding:"20px 14px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:21, fontWeight:700, color:T.ink }}>🔥 Best Combos</div>
          <Pill col={T.gold} light>Save up to 20%</Pill>
        </div>
        <div style={{ display:"flex", gap:12, overflowX:"auto", scrollbarWidth:"none", paddingBottom:4 }}>
          {COMBOS.map((combo, i) => (
            <div key={combo.id} className="card-hover" style={{ background:T.white, borderRadius:22, padding:"14px", minWidth:190, flexShrink:0, boxShadow:"0 4px 18px rgba(0,0,0,0.09)", cursor:"pointer", border:`1.5px solid ${T.boneDim}` }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{combo.emoji}</div>
              <div style={{ fontWeight:700, fontSize:12.5, color:T.ink, marginBottom:4 }}>{combo.name}</div>
              <div style={{ fontSize:10, color:T.mist, marginBottom:10, lineHeight:1.4 }}>{combo.desc}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontWeight:900, color:T.ember, fontSize:14 }}>{fp(combo.price)}</div>
                  <div style={{ fontSize:9, color:T.sand, textDecoration:"line-through" }}>{fp(combo.originalPrice)}</div>
                </div>
                <Pill col={T.success} small>Save {fp(combo.saves)}</Pill>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div style={{ padding:"20px 14px 0" }}>
        <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:21, fontWeight:700, color:T.ink, marginBottom:12 }}>⭐ What Customers Say</div>
        {REVIEWS.map((r, i) => (
          <div key={r.id} className="slide-up" style={{ animationDelay:`${i*0.06}s`, background:T.white, borderRadius:20, padding:"14px 16px", marginBottom:10, boxShadow:"0 2px 10px rgba(0,0,0,0.07)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <span style={{ fontSize:26 }}>{r.avatar}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13, color:T.ink }}>{r.name} {r.verified && <Pill col={T.sky} small light>✓ Verified</Pill>}</div>
                <Stars r={r.rating} size={9} />
              </div>
              <span style={{ fontSize:9, color:T.sand }}>{r.time}</span>
            </div>
            <div style={{ fontSize:11.5, color:T.mist, lineHeight:1.65 }}>{r.text}</div>
            <div style={{ marginTop:8, display:"flex", gap:8, alignItems:"center" }}>
              <button style={{ fontSize:10, color:T.mist, background:"none", border:"none", cursor:"pointer" }}>👍 Helpful ({r.helpful})</button>
              {r.photo && <span style={{ fontSize:18 }}>{r.photo}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Jenny's note */}
      <div style={{ margin:"16px 14px 0", background:T.white, borderRadius:22, padding:"18px 16px", boxShadow:"0 3px 16px rgba(0,0,0,0.07)" }}>
        <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
          <div style={{ width:50, height:50, borderRadius:16, flexShrink:0, background:`linear-gradient(135deg, ${T.ember}, ${T.emberDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>👩‍🍳</div>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:16, fontWeight:700, color:T.ink, marginBottom:4 }}>A note from Jenny</div>
            <div style={{ fontSize:11.5, color:T.mist, lineHeight:1.7, fontStyle:"italic" }}>"Every dish is prepared fresh daily using recipes passed down from my mother. No shortcuts, no preservatives — just love and tradition in every bite."</div>
            <div style={{ marginTop:10, display:"flex", gap:6, flexWrap:"wrap" }}>
              <Pill col={T.sage} light>✓ Fresh Daily</Pill>
              <Pill col={T.gold} light>✓ No Preservatives</Pill>
              <Pill col={T.purple} light>✓ Homemade</Pill>
              <Pill col={T.teal} light>✓ Halal Certified</Pill>
            </div>
          </div>
        </div>
      </div>

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={onAddToCart}
          inCartQty={inCart(selectedItem.id)?.qty || 0}
          onDecrement={() => onAddToCart({...selectedItem, _remove:true})}
        />
      )}
    </div>
  );
}

/* ─────────────────── MENU SCREEN ─────────────────── */
function MenuScreen({ onAddToCart, activeCategory: initCat, cart, showToast }) {
  const [cat, setCat]     = useState(initCat || "Soups & Stews");
  const [anim, setAnim]   = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort]   = useState("default");
  const [filterSpicy, setFilterSpicy] = useState(false);
  const [filterHalal, setFilterHalal] = useState(false);
  const [filterVegan, setFilterVegan] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [priceRange, setPriceRange] = useState("all");

  const addItem = (item) => { setAnim(item.id); onAddToCart(item); setTimeout(() => setAnim(null), 400); };

  let items = (MENU[cat] || []).filter(it =>
    it.name.toLowerCase().includes(search.toLowerCase()) || it.desc.toLowerCase().includes(search.toLowerCase())
  );
  if (filterSpicy) items = items.filter(it => it.spicy > 0);
  if (filterHalal) items = items.filter(it => it.halal);
  if (filterVegan) items = items.filter(it => it.vegan);
  if (priceRange === "under1k") items = items.filter(it => it.price < 1000);
  if (priceRange === "1k-2k") items = items.filter(it => it.price >= 1000 && it.price <= 2000);
  if (priceRange === "over2k") items = items.filter(it => it.price > 2000);
  if (sort === "price-asc")  items = [...items].sort((a,b) => a.price - b.price);
  if (sort === "price-desc") items = [...items].sort((a,b) => b.price - a.price);
  if (sort === "rating")     items = [...items].sort((a,b) => (b.rating||4.8) - (a.rating||4.8));
  if (sort === "time")       items = [...items].sort((a,b) => parseInt(a.time) - parseInt(b.time));

  const catData = CATEGORIES.find(c => c.name === cat);
  const inCart = (id) => cart.find(c => c.id === id);

  return (
    <div style={{ paddingBottom:160 }}>
      <div style={{ padding:"16px 14px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:26, fontWeight:700, color:T.ink }}>Our Menu</div>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={() => setViewMode(v => v==="list"?"grid":"list")} style={{ width:36, height:36, borderRadius:10, background:T.boneDim, border:`1px solid ${T.sand}`, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {viewMode === "list" ? "⊞" : "≡"}
            </button>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ background:T.boneDim, border:`1px solid ${T.sand}`, borderRadius:10, padding:"6px 10px", fontSize:11, color:T.ink, fontWeight:600, cursor:"pointer" }}>
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
              <option value="time">Fastest</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div style={{ background:T.white, borderRadius:16, display:"flex", alignItems:"center", gap:10, padding:"11px 14px", marginBottom:10, boxShadow:"0 2px 12px rgba(0,0,0,0.07)", border:`1.5px solid ${T.boneDim}` }}>
          <span style={{ opacity:.4 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search menu…"
            style={{ flex:1, border:"none", fontSize:13, background:"transparent", color:T.ink }} />
          {search && <span onClick={() => setSearch("")} style={{ color:T.mist, cursor:"pointer" }}>✕</span>}
        </div>

        {/* Filters row */}
        <div style={{ display:"flex", gap:8, marginBottom:10, overflowX:"auto", scrollbarWidth:"none" }}>
          {[
            { label:"🌶️ Spicy", active:filterSpicy, toggle:() => setFilterSpicy(s=>!s), col:T.red },
            { label:"☪️ Halal", active:filterHalal, toggle:() => setFilterHalal(s=>!s), col:T.sage },
            { label:"🌿 Vegan", active:filterVegan, toggle:() => setFilterVegan(s=>!s), col:T.teal },
          ].map(f => (
            <button key={f.label} onClick={f.toggle} style={{ padding:"6px 13px", borderRadius:20, fontSize:10.5, fontWeight:700, cursor:"pointer", flexShrink:0, background: f.active ? `${f.col}18` : T.boneDim, border: f.active ? `1.5px solid ${f.col}` : `1px solid ${T.sand}`, color: f.active ? f.col : T.mist }}>{f.label}</button>
          ))}
          {["all","under1k","1k-2k","over2k"].map(p => (
            <button key={p} onClick={() => setPriceRange(p)} style={{ padding:"6px 11px", borderRadius:20, fontSize:10, fontWeight:700, cursor:"pointer", flexShrink:0, background: priceRange===p ? `${T.gold}18` : T.boneDim, border: priceRange===p ? `1.5px solid ${T.gold}` : `1px solid ${T.sand}`, color: priceRange===p ? "#8B6914" : T.mist }}>
              {p==="all"?"💰 All":p==="under1k"?"<₦1k":p==="1k-2k"?"₦1k-2k":">₦2k"}
            </button>
          ))}
        </div>

        {/* Category tabs */}
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:14, scrollbarWidth:"none" }}>
          {CATEGORIES.map(c => {
            const active = cat === c.name;
            return (
              <button key={c.id} onClick={() => { setCat(c.name); setSearch(""); }} style={{
                padding:"8px 14px", borderRadius:30, border: active ? "none" : `1.5px solid ${T.sand}`,
                background: active ? `linear-gradient(135deg, ${T.ember}, ${T.emberDim})` : T.white,
                color: active ? T.white : T.mist,
                fontWeight:700, fontSize:11, cursor:"pointer",
                whiteSpace:"nowrap", flexShrink:0,
                boxShadow: active ? `0 5px 16px ${T.ember}44` : "none",
                transition:"all 0.2s",
              }}>{c.emoji} {c.name}</button>
            );
          })}
        </div>
      </div>

      {catData && (
        <div style={{ margin:"0 14px 14px", background:`linear-gradient(135deg, ${catData.col}18, ${catData.col}08)`, border:`1.5px solid ${catData.col}28`, borderRadius:18, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontSize:30 }}>{catData.emoji}</div>
          <div>
            <div style={{ fontWeight:700, fontSize:14, color:T.ink }}>{catData.name}</div>
            <div style={{ fontSize:11, color:T.mist }}>{items.length} item{items.length !== 1 ? "s" : ""} {search ? "found" : "available"}</div>
          </div>
        </div>
      )}

      <div style={{ padding:"0 14px" }}>
        {items.length === 0 && (
          <div style={{ textAlign:"center", padding:"40px 20px", color:T.mist }}>
            <div style={{ fontSize:42, marginBottom:10 }}>🍽️</div>
            <div style={{ fontWeight:700, fontSize:14 }}>No matches found</div>
            <div style={{ fontSize:12, marginTop:4 }}>Try adjusting your filters</div>
          </div>
        )}
        {viewMode === "grid" ? (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {items.map((item, i) => {
              const c = inCart(item.id);
              return (
                <div key={item.id} className="slide-up card-hover" style={{ animationDelay:`${i*0.04}s`, background:T.white, borderRadius:20, overflow:"hidden", boxShadow:"0 3px 16px rgba(0,0,0,0.08)", cursor:"pointer" }}
                  onClick={() => setSelectedItem(item)}>
                  <div style={{ height:100, background:`linear-gradient(135deg, ${T.ink}, ${T.inkSoft})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:46, position:"relative" }}>
                    {item.emoji}
                    {item.tag && <div style={{ position:"absolute", top:6, left:6 }}><Pill col={T.ember} small>{item.tag}</Pill></div>}
                  </div>
                  <div style={{ padding:"10px" }}>
                    <div style={{ fontWeight:700, fontSize:12, color:T.ink, marginBottom:2 }}>{item.name}</div>
                    <div style={{ fontWeight:900, color:T.ember, fontSize:13, marginBottom:6 }}>{fp(item.price)}</div>
                    <div onClick={e => e.stopPropagation()}>
                      <AddBtn onClick={() => addItem(item)} onDecrement={() => onAddToCart({...item,_remove:true})} popping={anim===item.id} count={c?.qty||0} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          items.map((item, i) => {
            const c = inCart(item.id);
            return (
              <div key={item.id} className="slide-up card-hover" style={{ animationDelay:`${i*0.04}s`, background:T.white, borderRadius:22, marginBottom:11, padding:"14px", display:"flex", gap:14, alignItems:"center", boxShadow:"0 3px 16px rgba(0,0,0,0.08)", cursor:"pointer" }}
                onClick={() => setSelectedItem(item)}>
                <div style={{ width:76, height:76, borderRadius:18, background:`linear-gradient(135deg, ${T.inkMid}, ${T.inkSoft})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:38, flexShrink:0 }}>
                  {item.emoji}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:2 }}>
                    <div style={{ fontWeight:700, fontSize:13.5, color:T.ink, lineHeight:1.2 }}>{item.name}</div>
                    {item.tag && <Pill col={T.ember} small>{item.tag}</Pill>}
                  </div>
                  <div style={{ fontSize:10.5, color:T.mist, marginBottom:5, lineHeight:1.4 }}>{item.desc}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:7, flexWrap:"wrap" }}>
                    <Stars r={item.rating||4.8} size={8} />
                    <span style={{ fontSize:9, color:T.mist }}>⏱ {item.time}</span>
                    <span style={{ fontSize:9, color:T.mist }}>🔥 {item.cal}</span>
                    <SpicyMeter level={item.spicy} />
                    {item.halal && <Pill col={T.sage} light small>Halal</Pill>}
                    {item.vegan && <Pill col={T.teal} light small>Vegan</Pill>}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontWeight:900, color:T.ember, fontSize:15 }}>{fp(item.price)}</span>
                    <div onClick={e => e.stopPropagation()}>
                      <AddBtn onClick={() => addItem(item)} onDecrement={() => onAddToCart({...item,_remove:true})} popping={anim===item.id} count={c?.qty||0} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={onAddToCart}
          inCartQty={inCart(selectedItem.id)?.qty || 0}
          onDecrement={() => onAddToCart({...selectedItem, _remove:true})}
        />
      )}
    </div>
  );
}

/* ─────────────────── CART SCREEN ─────────────────── */
function CartScreen({ cart, onUpdateQty, onCheckout }) {
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [payMethod, setPayMethod] = useState("card");
  const [deliveryType, setDeliveryType] = useState("delivery");
  const [tip, setTip] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [scheduleTime, setScheduleTime] = useState("now");
  const [groupMode, setGroupMode] = useState(false);

  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const deliveryFee = deliveryType === "pickup" ? 0 : (subtotal >= 5000 ? 0 : 500);
  const discount = promoApplied === "JENNY10" ? Math.floor(subtotal * 0.1) : promoApplied === "BOGO24" ? Math.floor(subtotal * 0.15) : promoApplied === "FAM20" ? Math.floor(subtotal * 0.2) : 0;
  const total = subtotal + deliveryFee - discount + tip;

  const applyPromo = () => {
    const code = promoCode.toUpperCase();
    if (["JENNY10","BOGO24","FAM20"].includes(code)) setPromoApplied(code);
    else { setPromoApplied("invalid"); setTimeout(() => setPromoApplied(null), 2000); }
  };

  if (cart.length === 0) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60vh", gap:16, padding:"0 30px" }}>
      <div style={{ fontSize:64 }}>🛒</div>
      <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:24, fontWeight:700, color:T.ink, textAlign:"center" }}>Your cart is empty</div>
      <div style={{ color:T.mist, fontSize:12, textAlign:"center", lineHeight:1.6 }}>Add some delicious dishes to get started!</div>
    </div>
  );

  return (
    <div style={{ padding:"16px 14px 120px" }}>
      <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:26, fontWeight:700, color:T.ink, marginBottom:16 }}>Your Cart</div>

      {/* Delivery / Pickup toggle */}
      <div style={{ background:T.white, borderRadius:20, padding:"6px", display:"flex", gap:6, marginBottom:14, boxShadow:"0 2px 12px rgba(0,0,0,0.07)" }}>
        {["delivery","pickup"].map(d => (
          <button key={d} onClick={() => setDeliveryType(d)} style={{ flex:1, padding:"10px", borderRadius:14, border:"none", cursor:"pointer", fontWeight:800, fontSize:12, background: deliveryType === d ? `linear-gradient(135deg, ${T.ember}, ${T.emberDim})` : "transparent", color: deliveryType === d ? T.white : T.mist, transition:"all 0.2s" }}>
            {d === "delivery" ? "🛵 Delivery" : "🏃 Pickup"}
          </button>
        ))}
      </div>

      {/* Schedule */}
      <div style={{ background:T.white, borderRadius:16, padding:"14px", marginBottom:14, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
        <div style={{ fontWeight:700, fontSize:12, color:T.ink, marginBottom:10 }}>⏱ Schedule Order</div>
        <div style={{ display:"flex", gap:8 }}>
          {["now","30min","1hour","tonight"].map(t => (
            <button key={t} onClick={() => setScheduleTime(t)} style={{ flex:1, padding:"7px 4px", borderRadius:12, border: scheduleTime===t ? `1.5px solid ${T.ember}` : `1px solid ${T.sand}`, background: scheduleTime===t ? `${T.ember}12` : T.boneDim, fontSize:9.5, fontWeight:700, color: scheduleTime===t ? T.ember : T.mist, cursor:"pointer" }}>
              {t==="now"?"Now":t==="30min"?"30 min":t==="1hour"?"1 hour":"Tonight"}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery address (if delivery mode) */}
      {deliveryType === "delivery" && (
        <div style={{ background:T.white, borderRadius:16, padding:"14px", marginBottom:14, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
          <div style={{ fontWeight:700, fontSize:12, color:T.ink, marginBottom:10 }}>📍 Delivery Address</div>
          {ADDRESSES.map((addr, i) => (
            <div key={addr.id} onClick={() => setSelectedAddress(i)} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:12, cursor:"pointer", background: selectedAddress===i ? `${T.ember}10` : "transparent", border: selectedAddress===i ? `1.5px solid ${T.ember}40` : "1px solid transparent", marginBottom:6, transition:"all 0.2s" }}>
              <span style={{ fontSize:18 }}>{addr.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:12, color:T.ink }}>{addr.label}</div>
                <div style={{ fontSize:10, color:T.mist }}>{addr.address}</div>
              </div>
              {selectedAddress===i && <span style={{ color:T.ember }}>●</span>}
            </div>
          ))}
          <button style={{ marginTop:6, width:"100%", padding:"8px", borderRadius:12, border:`1.5px dashed ${T.sand}`, background:"transparent", fontSize:11, fontWeight:700, color:T.mist, cursor:"pointer" }}>+ Add New Address</button>
        </div>
      )}

      {/* Group order toggle */}
      <div style={{ background:T.white, borderRadius:16, padding:"12px 14px", marginBottom:14, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
        <div>
          <div style={{ fontWeight:700, fontSize:12, color:T.ink }}>👥 Group Order</div>
          <div style={{ fontSize:10, color:T.mist }}>Share link for others to add items</div>
        </div>
        <button onClick={() => setGroupMode(s=>!s)} style={{ width:46, height:26, borderRadius:13, border:"none", cursor:"pointer", background: groupMode ? T.ember : T.boneDim, position:"relative", transition:"all 0.2s" }}>
          <div style={{ position:"absolute", top:3, left: groupMode ? 23 : 3, width:20, height:20, borderRadius:10, background:T.white, boxShadow:"0 1px 4px rgba(0,0,0,0.2)", transition:"all 0.2s" }} />
        </button>
      </div>

      {groupMode && (
        <div style={{ background:`${T.teal}10`, border:`1.5px solid ${T.teal}30`, borderRadius:16, padding:"12px 14px", marginBottom:14, textAlign:"center" }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.teal }}>🔗 Group Link Generated</div>
          <div style={{ fontSize:10, color:T.mist, marginTop:4 }}>jnk.ng/group/abc123 · Share with your group!</div>
          <button style={{ marginTop:8, padding:"6px 16px", borderRadius:20, background:T.teal, color:T.white, border:"none", fontSize:10, fontWeight:800, cursor:"pointer" }}>Copy Link</button>
        </div>
      )}

      {/* Cart items */}
      {cart.map((item, i) => (
        <div key={item.id} className="slide-up" style={{ animationDelay:`${i*0.04}s`, background:T.white, borderRadius:22, padding:"14px", marginBottom:11, display:"flex", gap:12, alignItems:"center", boxShadow:"0 2px 14px rgba(0,0,0,0.07)" }}>
          <div style={{ width:60, height:60, borderRadius:16, background:`linear-gradient(135deg, ${T.inkMid}, ${T.inkSoft})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, flexShrink:0 }}>{item.emoji||"🍽️"}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:13, color:T.ink, marginBottom:2 }}>{item.name}</div>
            {item.spice && <div style={{ fontSize:10, color:T.mist }}>Spice: {item.spice}</div>}
            {item.extras?.length > 0 && <div style={{ fontSize:10, color:T.mist }}>+ {item.extras.join(", ")}</div>}
            <div style={{ fontWeight:900, color:T.ember, fontSize:14, marginTop:4 }}>{fp(item.price * item.qty)}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:0, background:T.boneDim, borderRadius:22, overflow:"hidden" }}>
            <button onClick={() => onUpdateQty(item.id, item.qty - 1)} style={{ width:30, height:30, border:"none", background:"transparent", fontSize:16, fontWeight:800, cursor:"pointer", color:T.ink }}>−</button>
            <span style={{ fontWeight:800, fontSize:13, minWidth:20, textAlign:"center", color:T.ink }}>{item.qty}</span>
            <button onClick={() => onUpdateQty(item.id, item.qty + 1)} style={{ width:30, height:30, border:"none", background:"transparent", fontSize:16, fontWeight:800, cursor:"pointer", color:T.ink }}>+</button>
          </div>
        </div>
      ))}

      {/* Tip */}
      <div style={{ background:T.white, borderRadius:16, padding:"14px", marginBottom:14, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
        <div style={{ fontWeight:700, fontSize:12, color:T.ink, marginBottom:10 }}>💝 Add a Tip for Your Rider</div>
        <div style={{ display:"flex", gap:8 }}>
          {[0,100,200,500].map(t => (
            <button key={t} onClick={() => setTip(t)} style={{ flex:1, padding:"8px 4px", borderRadius:12, border: tip===t ? `1.5px solid ${T.ember}` : `1px solid ${T.sand}`, background: tip===t ? `${T.ember}12` : T.boneDim, fontSize:11, fontWeight:700, color: tip===t ? T.ember : T.mist, cursor:"pointer" }}>
              {t===0 ? "Skip" : `₦${t}`}
            </button>
          ))}
        </div>
      </div>

      {/* Promo */}
      <div style={{ background:T.white, borderRadius:16, padding:"14px", marginBottom:14, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
        <div style={{ fontWeight:700, fontSize:12, color:T.ink, marginBottom:10 }}>🎟️ Promo Code</div>
        <div style={{ display:"flex", gap:8 }}>
          <input value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} placeholder="Enter code (e.g. JENNY10)" style={{ flex:1, background:T.boneDim, border:"none", borderRadius:12, padding:"10px 14px", fontSize:12, color:T.ink }} />
          <button onClick={applyPromo} style={{ padding:"10px 18px", borderRadius:12, background:`linear-gradient(135deg, ${T.ember}, ${T.emberDim})`, color:T.white, border:"none", fontSize:11, fontWeight:800, cursor:"pointer" }}>Apply</button>
        </div>
        {promoApplied === "invalid" && <div style={{ fontSize:11, color:T.red, marginTop:6 }}>❌ Invalid code. Try JENNY10, BOGO24, or FAM20</div>}
        {promoApplied && promoApplied !== "invalid" && <div style={{ fontSize:11, color:T.success, marginTop:6 }}>✓ Code {promoApplied} applied! Saved {fp(discount)}</div>}
      </div>

      {/* Payment */}
      <div style={{ background:T.white, borderRadius:16, padding:"14px", marginBottom:14, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
        <div style={{ fontWeight:700, fontSize:12, color:T.ink, marginBottom:10 }}>💳 Payment Method</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {[["card","💳","Card"], ["bank","🏦","Bank Transfer"], ["wallet","👛","Wallet"], ["cash","💵","Cash on Delivery"]].map(([id,ic,label]) => (
            <button key={id} onClick={() => setPayMethod(id)} style={{ padding:"10px", borderRadius:14, border: payMethod===id ? `1.5px solid ${T.ember}` : `1px solid ${T.sand}`, background: payMethod===id ? `${T.ember}10` : T.boneDim, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:16 }}>{ic}</span>
              <span style={{ fontSize:10.5, fontWeight:700, color: payMethod===id ? T.ember : T.mist }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Order summary */}
      <div style={{ background:T.white, borderRadius:16, padding:"16px", marginBottom:16, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
        <div style={{ fontWeight:700, fontSize:12, color:T.ink, marginBottom:10 }}>Order Summary</div>
        {[["Subtotal", fp(subtotal)], ["Delivery Fee", deliveryFee===0 ? "FREE 🎉" : fp(deliveryFee)], discount>0 ? ["Discount", `-${fp(discount)}`] : null, tip>0 ? ["Rider Tip", fp(tip)] : null].filter(Boolean).map(([l,v]) => (
          <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:T.mist, marginBottom:6 }}>
            <span>{l}</span>
            <span style={{ fontWeight:700, color: v.startsWith("-") ? T.success : T.ink }}>{v}</span>
          </div>
        ))}
        <div style={{ borderTop:`1px solid ${T.boneDim}`, marginTop:10, paddingTop:10, display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontWeight:800, fontSize:14, color:T.ink }}>Total</span>
          <span style={{ fontWeight:900, fontSize:18, color:T.ember }}>{fp(total)}</span>
        </div>
      </div>

      <button onClick={onCheckout} className="btn-press glow" style={{
        width:"100%", background:`linear-gradient(135deg, ${T.ember}, ${T.emberDim})`,
        color:T.white, border:"none", borderRadius:20, padding:"16px",
        fontWeight:900, fontSize:15, cursor:"pointer",
        boxShadow:`0 8px 24px ${T.ember}55`,
      }}>🍽️ Place Order · {fp(total)}</button>
    </div>
  );
}

/* ─────────────────── TRACK SCREEN ─────────────────── */
function TrackScreen() {
  const [step, setStep] = useState(1);
  const [showChat, setShowChat] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { from:"rider", text:"Hi! I've picked up your order and I'm on my way 🛵" }
  ]);
  const [rating, setRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const steps = [
    { icon:"✅", label:"Order Confirmed", time:"12:34 PM", desc:"Jenny's Kitchen received your order" },
    { icon:"👩‍🍳", label:"Preparing Your Food", time:"12:36 PM", desc:"Chefs are working on your meal" },
    { icon:"📦", label:"Ready for Pickup", time:"~12:50 PM", desc:"Being handed to your rider" },
    { icon:"🛵", label:"On The Way", time:"~12:55 PM", desc:"Ibrahim is heading to you" },
    { icon:"🏠", label:"Delivered!", time:"~1:05 PM", desc:"Enjoy your meal!" },
  ];
  const progress = ((step) / (steps.length - 1)) * 100;

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    setChatHistory(prev => [...prev, { from:"user", text:chatMsg }]);
    setChatMsg("");
    setTimeout(() => {
      const replies = ["Got it! On my way 🛵", "I'm 5 minutes away!", "No problem, I'll be careful with that!", "Almost there! 🏃"];
      setChatHistory(prev => [...prev, { from:"rider", text:replies[Math.floor(Math.random()*replies.length)] }]);
    }, 1500);
  };

  return (
    <div style={{ padding:"16px 14px 120px" }}>
      <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:24, fontWeight:700, color:T.ink, marginBottom:14 }}>Live Tracking</div>

      {/* Map visual */}
      <div style={{ background:`linear-gradient(160deg, ${T.ink} 0%, ${T.inkSoft} 100%)`, borderRadius:22, padding:"20px", marginBottom:12, position:"relative", overflow:"hidden" }}>
        {/* Fake map grid */}
        <div style={{ position:"absolute", inset:0, opacity:0.08, backgroundImage:"repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 21px)" }}/>
        <div style={{ position:"relative", zIndex:2 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div>
              <div style={{ color:T.white, fontWeight:800, fontSize:14 }}>Order #JK-2026-0040</div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11 }}>
                {step < steps.length-1 ? `Est. arrival: ~1:05 PM` : "Order Delivered! ✅"}
              </div>
            </div>
            {step < steps.length-1 && (
              <div className="bounce" style={{ width:44, height:44, borderRadius:14, background:T.ember, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🛵</div>
            )}
          </div>
          {/* Progress bar */}
          <div style={{ height:6, background:"rgba(255,255,255,0.1)", borderRadius:3, overflow:"hidden", marginBottom:8 }}>
            <div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg, ${T.ember}, ${T.gold})`, borderRadius:3, transition:"width 0.6s ease" }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ color:"rgba(255,255,255,0.35)", fontSize:9 }}>Order placed</span>
            <span style={{ color:"rgba(255,255,255,0.35)", fontSize:9 }}>Delivered</span>
          </div>
        </div>
      </div>

      {/* Rider */}
      <div style={{ background:T.white, borderRadius:22, padding:"14px 16px", marginBottom:12, boxShadow:"0 2px 14px rgba(0,0,0,0.07)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:48, height:48, borderRadius:15, background:`${T.ember}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>🛵</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:13, color:T.ink }}>{RIDER.name} · Your Rider</div>
            <div style={{ fontSize:11, color:T.mist }}>⭐ {RIDER.rating} · {RIDER.deliveries.toLocaleString()}+ deliveries</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <a href={`tel:${RIDER.phone}`} style={{ width:40, height:40, borderRadius:13, background:`${T.sage}18`, border:`1.5px solid ${T.sage}`, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none" }}>📞</a>
            <button onClick={() => setShowChat(s => !s)} style={{ width:40, height:40, borderRadius:13, background:`${T.ember}18`, border:`1.5px solid ${T.ember}44`, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>💬</button>
          </div>
        </div>

        {showChat && (
          <div className="slide-down" style={{ marginTop:12, borderTop:`1px solid ${T.boneDim}`, paddingTop:12 }}>
            <div style={{ maxHeight:130, overflowY:"auto", marginBottom:10 }}>
              {chatHistory.map((m, i) => (
                <div key={i} style={{ display:"flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", marginBottom:6 }}>
                  <div style={{ maxWidth:"78%", background: m.from === "user" ? `linear-gradient(135deg, ${T.ember}, ${T.emberDim})` : T.boneDim, color: m.from === "user" ? T.white : T.ink, borderRadius:12, padding:"7px 11px", fontSize:11 }}>{m.text}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key==="Enter" && sendChat()} placeholder="Message rider…" style={{ flex:1, background:T.boneDim, border:"none", borderRadius:12, padding:"8px 12px", fontSize:11, color:T.ink }} />
              <button onClick={sendChat} style={{ width:34, height:34, borderRadius:11, background:T.ember, border:"none", cursor:"pointer", color:T.white, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>➤</button>
            </div>
          </div>
        )}
      </div>

      {/* Steps */}
      <div style={{ background:T.white, borderRadius:22, padding:"20px 18px", marginBottom:12, boxShadow:"0 3px 16px rgba(0,0,0,0.07)" }}>
        {steps.map((s, i) => {
          const done = i < step; const active = i === step;
          return (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                <div style={{ width:40, height:40, borderRadius:20, background: done ? `linear-gradient(135deg, ${T.success}, #2D7A44)` : active ? `linear-gradient(135deg, ${T.ember}, ${T.emberDim})` : T.boneDim, display:"flex", alignItems:"center", justifyContent:"center", fontSize: done ? 14 : 18, transition:"all 0.4s", boxShadow: active ? `0 4px 16px ${T.ember}55` : done ? `0 4px 12px ${T.success}44` : "none" }}>
                  {done ? "✓" : s.icon}
                </div>
                {i < steps.length-1 && <div style={{ width:2, height:28, background: done ? T.success : T.boneDim, transition:"background 0.4s", marginTop:2 }}/>}
              </div>
              <div style={{ paddingTop:8, flex:1, paddingBottom: i < steps.length-1 ? 4 : 0 }}>
                <div style={{ fontWeight:700, fontSize:13, color: done||active ? T.ink : T.sand, transition:"color 0.4s" }}>{s.label}</div>
                {s.time !== "—" && <div style={{ fontSize:10, color:T.mist, marginTop:1 }}>{s.time}</div>}
                {active && <div style={{ fontSize:10, color:T.ember, marginTop:2, fontStyle:"italic" }}>{s.desc}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rate */}
      {step === steps.length-1 && (
        <div style={{ background:T.white, borderRadius:22, padding:"18px", marginBottom:12, boxShadow:"0 3px 16px rgba(0,0,0,0.07)" }}>
          {ratingSubmitted ? (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:40, marginBottom:8 }}>🙏</div>
              <div style={{ fontWeight:700, fontSize:14, color:T.ink }}>Thank you for your feedback!</div>
              <div style={{ fontSize:11, color:T.mist }}>Your rating helps Jenny improve.</div>
            </div>
          ) : (
            <>
              <div style={{ fontWeight:700, fontSize:13, color:T.ink, marginBottom:8 }}>Rate Your Experience</div>
              <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:12 }}>
                {[1,2,3,4,5].map(i => (
                  <button key={i} onClick={() => setRating(i)} style={{ fontSize:28, background:"none", border:"none", cursor:"pointer", opacity: i <= rating ? 1 : 0.3, transition:"all 0.18s", transform: i <= rating ? "scale(1.2)" : "scale(1)" }}>⭐</button>
                ))}
              </div>
              {rating > 0 && (
                <button onClick={() => setRatingSubmitted(true)} className="btn-press" style={{ width:"100%", background:`linear-gradient(135deg, ${T.sage}, ${T.sageLight})`, color:T.white, border:"none", padding:"12px", borderRadius:14, fontWeight:800, fontSize:13, cursor:"pointer" }}>
                  Submit Rating
                </button>
              )}
            </>
          )}
        </div>
      )}

      <button onClick={() => setStep(s => Math.min(s+1, steps.length-1))} className="btn-press" style={{
        width:"100%", marginTop:6,
        background: step === steps.length-1 ? `${T.sage}22` : `linear-gradient(135deg, ${T.ember}, ${T.emberDim})`,
        color: step === steps.length-1 ? T.sage : T.white,
        border:"none", borderRadius:18, padding:"15px",
        fontWeight:800, fontSize:13, cursor:"pointer",
      }}>{step === steps.length-1 ? "✓ Order Delivered!" : "Simulate Next Step →"}</button>

      <div style={{ marginTop:12, background:`${T.ember}0E`, borderRadius:18, padding:"14px 16px" }}>
        <div style={{ fontWeight:700, fontSize:12.5, color:T.ember, marginBottom:4 }}>Need help?</div>
        <div style={{ fontSize:11.5, color:T.mist }}>📞 Jenny's Kitchen: <strong style={{ color:T.ink }}>+234 800 123 4567</strong></div>
      </div>
    </div>
  );
}

/* ─────────────────── NOTIFICATIONS PANEL ─────────────────── */
function NotificationsPanel({ onClose }) {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, unread:false })));

  return (
    <div style={{ position:"fixed", inset:0, zIndex:4000, background:"rgba(15,13,11,0.7)", display:"flex", alignItems:"flex-end", justifyContent:"center", animation:"fadeIn 0.25s" }}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="slide-up" style={{ background:T.bone, borderRadius:"28px 28px 0 0", width:"100%", maxWidth:430, maxHeight:"75vh", overflow:"auto", paddingBottom:30 }}>
        <div style={{ padding:"20px 18px 0", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:22, fontWeight:700, color:T.ink }}>Notifications</div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={markAll} style={{ fontSize:10, color:T.ember, fontWeight:700, background:`${T.ember}14`, border:"none", padding:"5px 12px", borderRadius:20, cursor:"pointer" }}>Mark all read</button>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:10, background:T.boneDim, border:"none", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>
        </div>
        <div style={{ padding:"0 14px" }}>
          {notifs.map((n, i) => (
            <div key={n.id} onClick={() => setNotifs(prev => prev.map(x => x.id===n.id ? {...x, unread:false} : x))} className="slide-up card-hover" style={{ animationDelay:`${i*0.05}s`, background: n.unread ? T.white : T.boneDim, borderRadius:20, padding:"14px", marginBottom:8, display:"flex", gap:12, cursor:"pointer", border: n.unread ? `1.5px solid ${T.ember}30` : "none", boxShadow: n.unread ? `0 3px 14px rgba(0,0,0,0.09)` : "none" }}>
              <div style={{ width:44, height:44, borderRadius:14, background:`${T.ember}14`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{n.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13, color:T.ink, display:"flex", justifyContent:"space-between" }}>
                  {n.title}
                  {n.unread && <div style={{ width:8, height:8, borderRadius:4, background:T.ember, marginTop:3 }} />}
                </div>
                <div style={{ fontSize:11, color:T.mist, marginTop:2 }}>{n.sub}</div>
                <div style={{ fontSize:9, color:T.sand, marginTop:4 }}>{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── ACCOUNT SCREEN ─────────────────── */
function AccountScreen({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [dietPref, setDietPref] = useState(["halal"]);
  const [lang, setLang] = useState("en");
  const loyaltyPoints = 340;
  const loyaltyMax = 500;
  const currentTier = LOYALTY_TIERS[1]; // Silver
  const nextTier = LOYALTY_TIERS[2];

  const toggleDiet = (d) => setDietPref(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  return (
    <div style={{ paddingBottom:160 }}>
      {/* Profile hero */}
      <div style={{ background:`linear-gradient(160deg, ${T.ink} 0%, ${T.inkSoft} 100%)`, padding:"26px 20px 22px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:220, height:220, borderRadius:"50%", background:`radial-gradient(circle, ${T.ember}33 0%, transparent 70%)` }}/>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
          <div style={{ position:"relative" }}>
            <div style={{ width:68, height:68, borderRadius:22, background:`linear-gradient(135deg, ${T.ember}, ${T.emberDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:34 }}>👤</div>
            <div style={{ position:"absolute", bottom:-4, right:-4, width:22, height:22, borderRadius:7, background:T.gold, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11 }}>✏️</div>
          </div>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:21, fontWeight:700, color:T.white }}>{user?.name || "Guest User"}</div>
            <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11, marginBottom:8 }}>{user?.email || "Kano, Kano State 🇳🇬"}</div>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <span style={{ background:`${currentTier.col}33`, border:`1px solid ${currentTier.col}66`, color:currentTier.col, padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:900 }}>{currentTier.icon} {currentTier.name}</span>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          {[["12","Orders"],["4.9","Avg Rating"],[`${loyaltyPoints}`,"Points"]].map(([v,l]) => (
            <div key={l} style={{ flex:1, background:"rgba(255,255,255,0.08)", borderRadius:14, padding:"10px 8px", textAlign:"center", border:"1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontWeight:900, fontSize:18, color:T.white }}>{v}</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", marginTop:1 }}>{l}</div>
            </div>
          ))}
        </div>
        {/* Loyalty bar */}
        <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:16, padding:"14px", border:"1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <div>
              <div style={{ color:T.white, fontWeight:700, fontSize:12 }}>🏆 Loyalty Points</div>
              <div style={{ color:"rgba(255,255,255,0.45)", fontSize:10 }}>{loyaltyPoints} / {loyaltyMax} pts to {nextTier.name}</div>
            </div>
            <div style={{ background:currentTier.col, color:T.ink, padding:"4px 10px", borderRadius:20, fontSize:9, fontWeight:900 }}>{currentTier.name.toUpperCase()}</div>
          </div>
          <div style={{ height:6, background:"rgba(255,255,255,0.1)", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${(loyaltyPoints/loyaltyMax)*100}%`, background:`linear-gradient(90deg, ${T.gold}, ${T.goldLight})`, borderRadius:3 }}/>
          </div>
          <div style={{ marginTop:8, fontSize:10, color:"rgba(255,255,255,0.4)" }}>🎁 Redeem 500 pts for ₦1,000 off your next order</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${T.boneDim}` }}>
        {["profile","orders","preferences","addresses"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex:1, padding:"11px 4px", border:"none", background:"transparent", fontWeight:700, fontSize:9.5, cursor:"pointer", textTransform:"capitalize", color: activeTab===tab ? T.ember : T.mist, borderBottom: activeTab===tab ? `2.5px solid ${T.ember}` : "2.5px solid transparent", transition:"all 0.2s" }}>
            {tab === "orders" ? "📋 Orders" : tab === "addresses" ? "📍 Saved" : tab === "preferences" ? "⚙️ Prefs" : "👤 Profile"}
          </button>
        ))}
      </div>

      <div style={{ padding:"14px" }}>
        {activeTab === "profile" && (
          <div>
            {[
              { icon:"❤️", label:"Favourites",         sub:"Your saved dishes",     badge:"3" },
              { icon:"💳", label:"Payment Methods",     sub:"Cards & mobile money",  badge:null },
              { icon:"🔔", label:"Notifications",       sub:"Offers & updates",      badge:"2" },
              { icon:"🎁", label:"Refer & Earn",        sub:"Get ₦500 per referral", badge:"NEW" },
              { icon:"🏆", label:"Loyalty Rewards",     sub:`${loyaltyPoints} pts · Redeem now`, badge:null },
              { icon:"⭐", label:"Rate the App",        sub:"Tell us what you think", badge:null },
              { icon:"💬", label:"Live Support Chat",   sub:"Chat with our team",    badge:"1" },
              { icon:"❓", label:"Help & FAQ",          sub:"Common questions",      badge:null },
              { icon:"📞", label:"Contact Jenny",       sub:"+234 800 123 4567",     badge:null },
            ].map((item, i) => (
              <div key={i} className="slide-up card-hover" style={{ animationDelay:`${i*0.04}s`, background:T.white, borderRadius:20, padding:"14px 16px", marginBottom:8, display:"flex", alignItems:"center", gap:14, boxShadow:"0 2px 10px rgba(0,0,0,0.06)", cursor:"pointer" }}>
                <div style={{ width:44, height:44, borderRadius:14, background:`${T.ember}10`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, position:"relative" }}>
                  {item.icon}
                  {item.badge && <div style={{ position:"absolute", top:-4, right:-4, background:T.ember, color:T.white, minWidth:16, height:16, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:7, fontWeight:900, padding:"0 3px" }}>{item.badge}</div>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:13.5, color:T.ink }}>{item.label}</div>
                  <div style={{ fontSize:11, color:T.mist }}>{item.sub}</div>
                </div>
                <div style={{ color:T.sand, fontSize:22, fontWeight:300 }}>›</div>
              </div>
            ))}
            <div onClick={onLogout} style={{ marginTop:8, padding:"14px", background:`${T.red}0E`, borderRadius:18, cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:44, height:44, borderRadius:14, background:`${T.red}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🚪</div>
              <div style={{ fontWeight:700, fontSize:13.5, color:T.red }}>Sign Out</div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:18, fontWeight:700, color:T.ink, marginBottom:14 }}>Order History</div>
            {ORDER_HISTORY.map((order, i) => (
              <div key={order.id} className="slide-up" style={{ animationDelay:`${i*0.06}s`, background:T.white, borderRadius:22, padding:"16px", marginBottom:10, boxShadow:"0 2px 12px rgba(0,0,0,0.07)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <div style={{ fontWeight:800, fontSize:12, color:T.ember }}>{order.id}</div>
                  <Pill col={T.sage}>{order.status}</Pill>
                </div>
                <div style={{ fontSize:11, color:T.mist, marginBottom:4 }}>📍 {order.branch} · 📅 {order.date}</div>
                <div style={{ fontSize:11.5, color:T.ink, marginBottom:10 }}>{order.items.join(" · ")}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontWeight:900, color:T.ember, fontSize:15 }}>{fp(order.total)}</div>
                  <div style={{ display:"flex", gap:8 }}>
                    <Stars r={order.rating} size={9} />
                    <button style={{ padding:"5px 12px", borderRadius:12, background:`${T.ember}14`, border:`1px solid ${T.ember}30`, color:T.ember, fontSize:10, fontWeight:800, cursor:"pointer" }}>Reorder</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "preferences" && (
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:18, fontWeight:700, color:T.ink, marginBottom:14 }}>Dietary Preferences</div>
            {["halal","vegan","vegetarian","gluten-free","dairy-free","nut-free"].map(d => (
              <div key={d} onClick={() => toggleDiet(d)} style={{ background:T.white, borderRadius:16, padding:"13px 16px", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                <span style={{ fontWeight:700, fontSize:13, color:T.ink, textTransform:"capitalize" }}>
                  {d==="halal"?"☪️":d==="vegan"?"🌿":d==="vegetarian"?"🥦":d==="gluten-free"?"🌾":d==="dairy-free"?"🥛":"🥜"} {d}
                </span>
                <div style={{ width:44, height:24, borderRadius:12, background: dietPref.includes(d) ? T.ember : T.boneDim, position:"relative", transition:"all 0.2s" }}>
                  <div style={{ position:"absolute", top:2, left: dietPref.includes(d) ? 22 : 2, width:20, height:20, borderRadius:10, background:T.white, boxShadow:"0 1px 4px rgba(0,0,0,0.2)", transition:"all 0.2s" }} />
                </div>
              </div>
            ))}

            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:18, fontWeight:700, color:T.ink, marginBottom:10, marginTop:20 }}>Language</div>
            {[["en","🇬🇧","English"],["ha","🇳🇬","Hausa"],["yo","🇳🇬","Yoruba"],["ig","🇳🇬","Igbo"]].map(([code, flag, name]) => (
              <div key={code} onClick={() => setLang(code)} style={{ background:T.white, borderRadius:16, padding:"12px 16px", marginBottom:8, display:"flex", alignItems:"center", gap:12, cursor:"pointer", border: lang===code ? `2px solid ${T.ember}` : `1.5px solid ${T.boneDim}`, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                <span style={{ fontSize:22 }}>{flag}</span>
                <span style={{ fontWeight:700, fontSize:13, color:T.ink, flex:1 }}>{name}</span>
                {lang===code && <span style={{ color:T.ember, fontWeight:900 }}>✓</span>}
              </div>
            ))}
          </div>
        )}

        {activeTab === "addresses" && (
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:18, fontWeight:700, color:T.ink, marginBottom:14 }}>Saved Addresses</div>
            {ADDRESSES.map((addr, i) => (
              <div key={addr.id} style={{ background:T.white, borderRadius:20, padding:"14px 16px", marginBottom:10, boxShadow:"0 2px 10px rgba(0,0,0,0.07)", border: addr.default ? `2px solid ${T.ember}` : `1.5px solid ${T.boneDim}` }}>
                <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <div style={{ width:44, height:44, borderRadius:14, background:`${T.ember}12`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{addr.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:13, color:T.ink }}>{addr.label} {addr.default && <Pill col={T.ember} small light>Default</Pill>}</div>
                    <div style={{ fontSize:11, color:T.mist, marginTop:2 }}>{addr.address}</div>
                  </div>
                  <button style={{ fontSize:12, color:T.mist, background:T.boneDim, border:"none", padding:"5px 10px", borderRadius:10, cursor:"pointer" }}>Edit</button>
                </div>
              </div>
            ))}
            <button style={{ width:"100%", padding:"13px", borderRadius:20, border:`2px dashed ${T.sand}`, background:"transparent", fontSize:12, fontWeight:700, color:T.mist, cursor:"pointer" }}>
              + Add New Address
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop:4, textAlign:"center", color:T.sand, fontSize:11, paddingBottom:10 }}>
        Jenny's Kitchen 🇳🇬 © 2026 · Built with ❤️<br/>
        <span style={{ fontSize:10 }}>v5.0 Ultra · AI Powered by Claude</span>
      </div>
    </div>
  );
}

/* ─────────────────── FAVOURITES SCREEN ─────────────────── */
function FavouritesScreen({ onAddToCart, wishlist, setWishlist, showToast }) {
  const allItems = Object.values(MENU).flat();
  const favItems = allItems.filter(i => wishlist.includes(i.id));
  const popularFavs = POPULAR.filter(i => wishlist.includes(i.id));
  const merged = [...new Map([...popularFavs, ...favItems].map(i=>[i.id,i])).values()];
  const [anim, setAnim] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const addItem = (item) => { setAnim(item.id); onAddToCart(item); setTimeout(() => setAnim(null), 400); };

  if (merged.length === 0) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60vh", gap:14, padding:"0 30px" }}>
      <div style={{ fontSize:64 }}>🤍</div>
      <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:24, fontWeight:700, color:T.ink, textAlign:"center" }}>No favourites yet</div>
      <div style={{ color:T.mist, fontSize:12, textAlign:"center", lineHeight:1.6 }}>Tap the ❤️ on any dish to save it here for quick ordering</div>
    </div>
  );

  return (
    <div style={{ padding:"16px 14px 160px" }}>
      <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:26, fontWeight:700, color:T.ink, marginBottom:4 }}>Favourites</div>
      <div style={{ color:T.mist, fontSize:12, marginBottom:18 }}>{merged.length} saved dish{merged.length !== 1 ? "es" : ""}</div>
      {merged.map((item, i) => (
        <div key={item.id} className="slide-up card-hover" style={{ animationDelay:`${i*0.05}s`, background:T.white, borderRadius:22, padding:"14px", marginBottom:11, display:"flex", alignItems:"center", gap:14, boxShadow:"0 2px 16px rgba(0,0,0,0.08)" }}>
          <div onClick={() => setSelectedItem(item)} style={{ width:72, height:72, borderRadius:20, flexShrink:0, background:`linear-gradient(135deg, ${T.ember}18, ${T.gold}18)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:38, border:`1.5px solid ${T.sand}`, cursor:"pointer" }}>{item.emoji}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:13.5, color:T.ink, marginBottom:2 }}>{item.name}</div>
            <div style={{ fontSize:10.5, color:T.mist, marginBottom:6 }}>{item.desc}</div>
            <Stars r={item.rating || 4.8} />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
              <span style={{ fontWeight:900, color:T.ember, fontSize:15 }}>{fp(item.price)}</span>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <button onClick={() => { setWishlist(prev => prev.filter(x => x !== item.id)); showToast("Removed from favourites"); }} style={{ fontSize:18, background:"none", border:"none", cursor:"pointer" }}>❤️</button>
                <AddBtn onClick={() => addItem(item)} onDecrement={() => {}} popping={anim===item.id} count={0} />
              </div>
            </div>
          </div>
        </div>
      ))}
      {selectedItem && <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} onAddToCart={onAddToCart} inCartQty={0} onDecrement={() => {}} />}
    </div>
  );
}

/* ─────────────────── ROOT APP ─────────────────── */
export default function App() {
  const [user, setUser]           = useState(null); // null = not logged in
  const [screen, setScreen]       = useState("home");
  const [activeCat, setActiveCat] = useState(null);
  const [cart, setCart]           = useState([]);
  const [toast, setToast]         = useState(false);
  const [toastMsg, setToastMsg]   = useState("Added to cart");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [wishlist, setWishlist]   = useState([1, 4]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAI, setShowAI]       = useState(false);
  const [showInlineAI, setShowInlineAI] = useState(false);
  const [confetti, setConfetti]   = useState(false);
  const toastRef = useRef(null);

  const cartCount = cart.reduce((s,i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const unreadNotifs = NOTIFICATIONS.filter(n => n.unread).length;

  const showToast = useCallback((msg = "Added to cart") => {
    setToastMsg(msg);
    clearTimeout(toastRef.current);
    setToast(true);
    toastRef.current = setTimeout(() => setToast(false), 2400);
  }, []);

  const addToCart = useCallback((item) => {
    if (item._remove) {
      setCart(prev => {
        const ex = prev.find(i => i.id === item.id);
        if (!ex) return prev;
        if (ex.qty <= 1) return prev.filter(i => i.id !== item.id);
        return prev.map(i => i.id === item.id ? { ...i, qty:i.qty-1 } : i);
      });
      return;
    }
    setCart(prev => {
      const ex = prev.find(i => i.id === item.id);
      if (ex) return prev.map(i => i.id === item.id ? { ...i, qty:i.qty+1 } : i);
      return [...prev, { ...item, qty:1 }];
    });
    showToast(`${item.emoji || "🍽️"} Added to cart`);
  }, [showToast]);

  const updateQty = useCallback((id, qty) => {
    if (qty <= 0) { setCart(prev => prev.filter(i => i.id !== id)); showToast("Item removed"); }
    else setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }, [showToast]);

  const navigate = useCallback((s, cat) => {
    setActiveCat(cat || null);
    setScreen(s);
  }, []);

  const checkout = () => {
    setOrderPlaced(true);
    setConfetti(true);
    setCart([]);
    showToast("🎉 Order placed!");
    setTimeout(() => setConfetti(false), 3000);
    setTimeout(() => { setOrderPlaced(false); setScreen("track"); }, 1800);
  };

  const TABS = [
    { id:"home",      icon:"🏠", label:"Home"      },
    { id:"menu",      icon:"🍽️", label:"Menu"      },
    { id:"locations", icon:"📍", label:"Nearby"    },
    { id:"fav",       icon:"❤️", label:"Saved"     },
    { id:"account",   icon:"👤", label:"Account"   },
  ];

  const confettiColors = [T.ember, T.gold, T.sage, T.purple, T.sky, T.pink];

  // Show login screen if not logged in
  if (!user) {
    return (
      <div style={{ maxWidth:430, margin:"0 auto", minHeight:"100vh", fontFamily:"'DM Sans', 'Segoe UI', sans-serif" }}>
        <style>{FONTS}</style>
        <LoginScreen onLogin={(u) => setUser(u)} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth:430, margin:"0 auto", minHeight:"100vh", background:T.bone, fontFamily:"'DM Sans', 'Segoe UI', sans-serif", position:"relative", overflow:"hidden" }}>
      <style>{FONTS}</style>

      {/* Confetti */}
      {confetti && [...Array(22)].map((_, i) => (
        <div key={i} style={{
          position:"fixed", zIndex:9999,
          left:`${Math.random()*90+5}%`, top:-20,
          width:8, height:8,
          borderRadius: Math.random()>0.5 ? "50%" : 2,
          background: confettiColors[i % confettiColors.length],
          animation:`confetti ${0.8+Math.random()*1.2}s ${Math.random()*0.5}s ease-in both`,
          pointerEvents:"none",
        }} />
      ))}

      {/* Order placed overlay */}
      {orderPlaced && (
        <div style={{ position:"fixed", inset:0, zIndex:8000, background:"rgba(15,13,11,0.88)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, animation:"fadeIn 0.3s ease" }}>
          <div style={{ fontSize:72, animation:"float 2s ease-in-out infinite" }}>🎉</div>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:30, fontWeight:700, color:T.white, textAlign:"center" }}>Order Placed!</div>
          <div style={{ color:"rgba(255,255,255,0.55)", fontSize:13, textAlign:"center" }}>Jenny's Kitchen is preparing your meal</div>
          <div style={{ color:T.ember, fontSize:12, fontWeight:700 }}>Redirecting to tracking…</div>
        </div>
      )}

      {/* Header */}
      <div className="glass" style={{ padding:"11px 16px 10px", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 1px 20px rgba(0,0,0,0.09)", position:"sticky", top:0, zIndex:200, borderBottom:`1px solid ${T.boneDim}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:40, height:40, borderRadius:13, background:`linear-gradient(135deg, ${T.ember}, ${T.emberDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:21, boxShadow:`0 4px 12px ${T.ember}55` }}>👩‍🍳</div>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:700, fontSize:17, color:T.ink, lineHeight:1.1 }}>Jenny's Kitchen</div>
            <div style={{ fontSize:9, color:T.mist, fontWeight:500, display:"flex", alignItems:"center", gap:4 }}>
              📍 {screen === "locations" ? "5 locations" : "Kano Branch"} · <span style={{ color:T.success, fontWeight:700 }}>Open</span>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <button onClick={() => setShowAI(true)} style={{ width:38, height:38, borderRadius:12, background:`linear-gradient(135deg, ${T.purple}22, ${T.purple}11)`, border:`1px solid ${T.purple}30`, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>🤖</button>
          <button onClick={() => setShowNotifs(true)} style={{ width:38, height:38, borderRadius:12, background:T.boneDim, border:"none", fontSize:16, cursor:"pointer", position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
            🔔
            {unreadNotifs > 0 && <Badge count={unreadNotifs} />}
          </button>
          <button onClick={() => setScreen("cart")} style={{ width:38, height:38, borderRadius:12, background: cartCount > 0 ? `${T.ember}14` : T.boneDim, border: cartCount > 0 ? `1.5px solid ${T.ember}30` : "none", fontSize:16, cursor:"pointer", position:"relative", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
            🛒
            <Badge count={cartCount} />
          </button>
        </div>
      </div>

      {/* Cart mini bar */}
      {cartCount > 0 && screen !== "cart" && (
        <div onClick={() => setScreen("cart")} className="slide-down" style={{ position:"sticky", top:62, zIndex:199, margin:"0 14px", background:`linear-gradient(135deg, ${T.ember}, ${T.emberDim})`, borderRadius:"0 0 18px 18px", padding:"8px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", boxShadow:`0 6px 20px ${T.ember}44` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:14 }}>🛒</span>
            <span style={{ color:T.white, fontSize:12, fontWeight:700 }}>{cartCount} item{cartCount !== 1 ? "s" : ""} in cart</span>
          </div>
          <div style={{ color:T.white, fontWeight:900, fontSize:13 }}>{fp(cartTotal + (cartTotal >= 5000 ? 0 : 500))} →</div>
        </div>
      )}

      {/* Content */}
      <div key={screen} className="slide-up" style={{ minHeight:"calc(100vh - 128px)", overflowY:"auto" }}>
        {screen==="home"      && <HomeScreen onAddToCart={addToCart} onNavigate={navigate} cart={cart} wishlist={wishlist} setWishlist={setWishlist} showToast={showToast} onOpenAI={() => setShowAI(true)} user={user} />}
        {screen==="menu"      && <MenuScreen onAddToCart={addToCart} onNavigate={navigate} activeCategory={activeCat} cart={cart} showToast={showToast} />}
        {screen==="locations" && <LocationsScreen onSelectBranch={(b) => { showToast(`📍 ${b.name} selected`); navigate("menu"); }} />}
        {screen==="fav"       && <FavouritesScreen onAddToCart={addToCart} wishlist={wishlist} setWishlist={setWishlist} showToast={showToast} />}
        {screen==="cart"      && <CartScreen cart={cart} onUpdateQty={updateQty} onCheckout={checkout} />}
        {screen==="track"     && <TrackScreen />}
        {screen==="account"   && <AccountScreen user={user} onLogout={() => setUser(null)} />}
      </div>

      <Toast visible={toast} message={toastMsg} />

      {showNotifs && <NotificationsPanel onClose={() => setShowNotifs(false)} />}
      {showAI     && <AIAssistant onClose={() => setShowAI(false)} onAddToCart={addToCart} cart={cart} />}

      {/* Bottom Nav + AI inline chatbar */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, zIndex:200 }}>
        {/* Inline AI bar (expandable) */}
        <AIAssistant inline onClose={() => setShowInlineAI(false)} onAddToCart={addToCart} cart={cart} />

        {/* Navigation tabs */}
        <div className="glass" style={{ borderTop:`1px solid ${T.boneDim}`, display:"flex", boxShadow:"0 -4px 20px rgba(0,0,0,0.09)", paddingBottom:"env(safe-area-inset-bottom)" }}>
          {TABS.map(tab => {
            const active = screen === tab.id;
            return (
              <button key={tab.id} onClick={() => setScreen(tab.id)} style={{ flex:1, padding:"9px 0 11px", border:"none", background:"transparent", display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", position:"relative", transition:"transform 0.15s" }}>
                {active && <div style={{ position:"absolute", top:0, left:"15%", right:"15%", height:3, background:`linear-gradient(90deg, ${T.ember}, ${T.gold})`, borderRadius:"0 0 6px 6px" }}/>}
                <div style={{ fontSize:18, position:"relative", transform: active ? "scale(1.12)" : "scale(1)", transition:"transform 0.2s cubic-bezier(.22,.68,0,1.3)" }}>
                  {tab.icon}
                  {tab.id==="fav" && wishlist.length > 0 && <Badge count={wishlist.length} />}
                </div>
                <div style={{ fontSize:9, fontWeight: active ? 800 : 500, color: active ? T.ember : T.mist, transition:"color 0.2s" }}>{tab.label}</div>
              </button>
            );
          })}
          {cartCount > 0 && (
            <button onClick={() => setScreen("cart")} style={{ position:"absolute", right:8, top:-22, width:44, height:44, borderRadius:22, background:`linear-gradient(135deg, ${T.ember}, ${T.emberDim})`, border:`3px solid ${T.bone}`, cursor:"pointer", fontSize:20, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 4px 18px ${T.ember}55` }}>
              🛒
              <Badge count={cartCount} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
