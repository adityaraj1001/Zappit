import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const STORE_UPI_ID = "6299035125@upi";
const STORE_UPI_NAME = "Zappit";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://api.zappstore.in";

function generateUPIUrl(amount, orderId, note) {
  return `upi://pay?pa=${STORE_UPI_ID}&pn=${encodeURIComponent(STORE_UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note || "Order " + orderId)}&tr=${orderId}`;
}

function generateQRUrl(text) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(text)}&bgcolor=0d0d0d&color=c8f135&margin=14&qzone=1`;
}

const COUPONS = {
  SAVE10: { type: "pct", val: 10, min: 99,  desc: "10% off on orders ₹99+" },
  GOLD50: { type: "flat", val: 50, min: 199, desc: "₹50 flat off on ₹199+" },
  NEWUSER:{ type: "flat", val: 30, min: 0,   desc: "₹30 off – welcome gift" },
  FLASH20:{ type: "pct", val: 20, min: 149,  desc: "20% off on ₹149+" },
  FRESH15:{ type: "pct", val: 15, min: 79,   desc: "15% off fresh produce" },
};

const EFB = { dairy:"🥛", staples:"🌾", snacks:"🍿", drinks:"🥤", fresh:"🍎", masala:"🌶️", breakfast:"🥣", pharma:"💊", personal:"🧴", cleaning:"🧹", baby:"👶", pet:"🐾", frozen:"🧊", sweet:"🍮" };

const PRODUCTS = [
  {id:101,name:"Amul Gold Full Cream Milk",price:34,cat:"dairy",brand:"Amul",weight:"1 L"},
  {id:102,name:"Amul Toned Milk",price:28,cat:"dairy",brand:"Amul",weight:"500 ml"},
  {id:103,name:"Mother Dairy Toned Milk",price:26,cat:"dairy",brand:"Mother Dairy",weight:"500 ml"},
  {id:104,name:"Amul Masti Dahi",price:35,cat:"dairy",brand:"Amul",weight:"400 g"},
  {id:105,name:"Epigamia Greek Yogurt",price:55,cat:"dairy",brand:"Epigamia",weight:"90 g"},
  {id:106,name:"Amul Butter Salted",price:52,cat:"dairy",brand:"Amul",weight:"100 g"},
  {id:107,name:"Amul Processed Cheese",price:110,cat:"dairy",brand:"Amul",weight:"200 g"},
  {id:108,name:"Amul Fresh Paneer",price:85,cat:"dairy",brand:"Amul",weight:"200 g"},
  {id:109,name:"Farm Fresh White Eggs",price:70,cat:"dairy",brand:"Farm Fresh",weight:"6 pcs"},
  {id:110,name:"Britannia Atta Bread",price:42,cat:"dairy",brand:"Britannia",weight:"400 g"},
  {id:201,name:"India Gate Basmati Rice",price:185,cat:"staples",brand:"India Gate",weight:"1 kg"},
  {id:202,name:"Daawat Extra Long Basmati",price:165,cat:"staples",brand:"Daawat",weight:"1 kg"},
  {id:203,name:"Fortune Sona Masoori Rice",price:75,cat:"staples",brand:"Fortune",weight:"1 kg"},
  {id:204,name:"Aashirvaad Whole Wheat Atta",price:149,cat:"staples",brand:"Aashirvaad",weight:"2 kg"},
  {id:205,name:"Tata Sampann Toor Dal",price:185,cat:"staples",brand:"Tata",weight:"1 kg"},
  {id:206,name:"Fortune Chana Dal",price:95,cat:"staples",brand:"Fortune",weight:"1 kg"},
  {id:207,name:"Tata Sugar",price:52,cat:"staples",brand:"Tata",weight:"1 kg"},
  {id:208,name:"Amul Pure Ghee",price:290,cat:"staples",brand:"Amul",weight:"500 ml"},
  {id:301,name:"Lay's Classic Salted",price:20,cat:"snacks",brand:"Lay's",weight:"26 g"},
  {id:302,name:"Lay's Magic Masala",price:20,cat:"snacks",brand:"Lay's",weight:"26 g"},
  {id:303,name:"Pringles Original",price:115,cat:"snacks",brand:"Pringles",weight:"107 g"},
  {id:304,name:"Parle-G Glucose Biscuits",price:15,cat:"snacks",brand:"Parle",weight:"150 g"},
  {id:305,name:"Britannia Good Day Cashew",price:35,cat:"snacks",brand:"Britannia",weight:"150 g"},
  {id:306,name:"Haldiram's Aloo Bhujia",price:45,cat:"snacks",brand:"Haldiram's",weight:"200 g"},
  {id:307,name:"Cadbury Dairy Milk",price:40,cat:"snacks",brand:"Cadbury",weight:"40 g"},
  {id:308,name:"Happilo Premium Mixed Nuts",price:199,cat:"snacks",brand:"Happilo",weight:"200 g"},
  {id:309,name:"Too Yumm Veggie Stix",price:25,cat:"snacks",brand:"Too Yumm",weight:"45 g"},
  {id:310,name:"Kurkure Masala Munch",price:20,cat:"snacks",brand:"Kurkure",weight:"90 g"},
  {id:311,name:"Britannia Marie Gold",price:30,cat:"snacks",brand:"Britannia",weight:"250 g"},
  {id:401,name:"Coca-Cola",price:40,cat:"drinks",brand:"Coca-Cola",weight:"750 ml"},
  {id:402,name:"Thums Up Strong",price:40,cat:"drinks",brand:"Coca-Cola",weight:"750 ml"},
  {id:403,name:"Tropicana Orange Juice",price:99,cat:"drinks",brand:"Tropicana",weight:"1 L"},
  {id:404,name:"Red Bull Energy Drink",price:125,cat:"drinks",brand:"Red Bull",weight:"250 ml"},
  {id:405,name:"Bisleri Mineral Water",price:20,cat:"drinks",brand:"Bisleri",weight:"1 L"},
  {id:406,name:"Nescafé Classic Coffee",price:280,cat:"drinks",brand:"Nescafé",weight:"100 g"},
  {id:407,name:"Sprite Lemon Lime",price:38,cat:"drinks",brand:"Sprite",weight:"750 ml"},
  {id:408,name:"Maaza Mango Drink",price:40,cat:"drinks",brand:"Maaza",weight:"600 ml"},
  {id:501,name:"Bananas",price:45,cat:"fresh",brand:"Fresh",weight:"6 pcs"},
  {id:502,name:"Royal Gala Apples",price:99,cat:"fresh",brand:"Fresh",weight:"4 pcs"},
  {id:503,name:"Onions",price:45,cat:"fresh",brand:"Fresh",weight:"1 kg"},
  {id:504,name:"Tomatoes",price:40,cat:"fresh",brand:"Fresh",weight:"500 g"},
  {id:505,name:"Baby Spinach Leaves",price:35,cat:"fresh",brand:"Fresh",weight:"200 g"},
  {id:506,name:"Green Capsicum",price:30,cat:"fresh",brand:"Fresh",weight:"250 g"},
  {id:601,name:"MDH Kitchen King Masala",price:75,cat:"masala",brand:"MDH",weight:"100 g"},
  {id:602,name:"Fortune Sunflower Oil",price:145,cat:"masala",brand:"Fortune",weight:"1 L"},
  {id:603,name:"Everest Garam Masala",price:65,cat:"masala",brand:"Everest",weight:"100 g"},
  {id:604,name:"Saffola Gold Oil",price:185,cat:"masala",brand:"Saffola",weight:"1 L"},
  {id:701,name:"Maggi 2-Minute Noodles",price:14,cat:"breakfast",brand:"Maggi",weight:"70 g"},
  {id:702,name:"Quaker Oats",price:120,cat:"breakfast",brand:"Quaker",weight:"1 kg"},
  {id:703,name:"Kellogg's Corn Flakes",price:145,cat:"breakfast",brand:"Kellogg's",weight:"500 g"},
  {id:704,name:"Britannia Marie Gold",price:30,cat:"breakfast",brand:"Britannia",weight:"250 g"},
  {id:801,name:"Dolo 650",price:32,cat:"pharma",brand:"Micro Labs",weight:"15 tabs"},
  {id:802,name:"Vitamin C 500mg",price:120,cat:"pharma",brand:"Limcee",weight:"30 tabs"},
  {id:803,name:"Himalaya Liv 52",price:185,cat:"pharma",brand:"Himalaya",weight:"100 tabs"},
  {id:901,name:"Dove Shampoo Daily Moisture",price:175,cat:"personal",brand:"Dove",weight:"340 ml"},
  {id:902,name:"Colgate Total Toothpaste",price:99,cat:"personal",brand:"Colgate",weight:"150 g"},
  {id:903,name:"Nivea Soft Cream",price:145,cat:"personal",brand:"Nivea",weight:"200 ml"},
  {id:1001,name:"Surf Excel Matic",price:215,cat:"cleaning",brand:"HUL",weight:"1 kg"},
  {id:1002,name:"Lizol Floor Cleaner",price:115,cat:"cleaning",brand:"Reckitt",weight:"1 L"},
  {id:1003,name:"Harpic Power Plus",price:95,cat:"cleaning",brand:"Harpic",weight:"1 L"},
  {id:1101,name:"Pampers Active Baby Diapers",price:299,cat:"baby",brand:"Pampers",weight:"20 pcs·M"},
  {id:1102,name:"Huggies Wonder Pants",price:349,cat:"baby",brand:"Huggies",weight:"56 pcs·M"},
  {id:1201,name:"Pedigree Adult Dog Food",price:320,cat:"pet",brand:"Pedigree",weight:"1.2 kg"},
  {id:1202,name:"Whiskas Cat Food Salmon",price:280,cat:"pet",brand:"Whiskas",weight:"85g×12"},
  {id:1301,name:"Kwality Walls Cornetto",price:40,cat:"frozen",brand:"Kwality Walls",weight:"80 ml"},
  {id:1302,name:"Magnum Classic Ice Cream",price:85,cat:"frozen",brand:"Magnum",weight:"120 ml"},
  {id:1401,name:"Haldiram's Kaju Katli",price:249,cat:"sweet",brand:"Haldiram's",weight:"200 g"},
  {id:1402,name:"Haldiram's Gulab Jamun",price:85,cat:"sweet",brand:"Haldiram's",weight:"500 g"},
];

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQty, clearCart, cartTotal, addItem } = useContext(CartContext);

  const PUB = process.env.PUBLIC_URL || "";
  const IMG_MAP = {
    101:`${PUB}/images/Amulgold_milk.webp`,102:`${PUB}/images/amul_toned_milk.webp`,103:`${PUB}/images/mother_dairy_milk.webp`,
    104:`${PUB}/images/amul_masti_curd.webp`,105:`${PUB}/images/epigamia_greek_yougurt.webp`,106:`${PUB}/images/amul_butter_salted.webp`,
    107:`${PUB}/images/Amul_processed_cheese.webp`,108:`${PUB}/images/Amul_fresh_panner.webp`,109:`${PUB}/images/white_eggs.webp`,
    110:`${PUB}/images/Britannia_atta_bread.webp`,201:`${PUB}/images/India_gate_basmati.webp`,202:`${PUB}/images/daawat_extra_long.webp`,
    203:`${PUB}/images/Fortune_sona_massori.webp`,204:`${PUB}/images/Aashirvaad_whole_wheat.webp`,205:`${PUB}/images/tata_sampann_toor_dal.webp`,
    206:`${PUB}/images/tata_sampann_toor_dal.webp`,207:`${PUB}/images/tata_sugar.webp`,208:`${PUB}/images/amul_pure_ghee.webp`,
    301:`${PUB}/images/lays_classic_salted.webp`,302:`${PUB}/images/lays_magic_masala.webp`,303:`${PUB}/images/pringles_originals.webp`,
    304:`${PUB}/images/Parle-g.webp`,305:`${PUB}/images/britannia_good_day.webp`,306:`${PUB}/images/haldiram_Aloo_bujia.webp`,
    307:`${PUB}/images/Cadbury_Dairy_milk.webp`,308:`${PUB}/images/happliomixednuts.webp`,309:`${PUB}/images/Too_Yumm_Veggie_Stix.webp`,
    310:`${PUB}/images/Kurkure_masala_munch.webp`,311:`${PUB}/images/Britannia_Marie_Gold.webp`,401:`${PUB}/images/coca_cola.webp`,
    402:`${PUB}/images/thums_up_strong.webp`,403:`${PUB}/images/tropicana_orange.webp`,404:`${PUB}/images/RedBull.webp`,
    405:`${PUB}/images/Bisleri_water.webp`,406:`${PUB}/images/Nescafe_classic.webp`,407:`${PUB}/images/Sprite.webp`,
    408:`${PUB}/images/Maaza_Mango_Drink.webp`,501:`${PUB}/images/banana.webp`,502:`${PUB}/images/Royal_Gala_apple.webp`,
    503:`${PUB}/images/onions.webp`,504:`${PUB}/images/tomatoes.webp`,505:`${PUB}/images/baby_spinach_leaves.webp`,
    506:`${PUB}/images/Green_Capsicum.webp`,601:`${PUB}/images/mdh_kitchen_king.webp`,602:`${PUB}/images/fortune_sunflower_oil.webp`,
    603:`${PUB}/images/everest_garam_masala.webp`,604:`${PUB}/images/Saffola_Gold_Oil.webp`,701:`${PUB}/images/maggi_2-minutes_noodles.webp`,
    702:`${PUB}/images/Quaker_Oats.webp`,703:`${PUB}/images/kellogg_s_corn_flakes.webp`,704:`${PUB}/images/Britannia_Marie_Gold.webp`,
    801:`${PUB}/images/Dolo_650.webp`,802:`${PUB}/images/Vitamin_C_500mg.webp`,803:`${PUB}/images/Himalaya_Liv52.webp`,
    901:`${PUB}/images/Dove_shampoo.webp`,902:`${PUB}/images/colgate_total.webp`,903:`${PUB}/images/nivea_soft_cream.webp`,
    1001:`${PUB}/images/Surf_excel_matic.webp`,1002:`${PUB}/images/lizol_floor_cleaner.webp`,1003:`${PUB}/images/Harpic_Toilet_cleaner.webp`,
    1101:`${PUB}/images/pampers.webp`,1102:`${PUB}/images/Huggies_Wonder_pants.webp`,1201:`${PUB}/images/pedigree_adult_dog_food.webp`,
    1202:`${PUB}/images/Whiskas_Cat_food.webp`,1301:`${PUB}/images/Kwality_walls_cornetto.webp`,1302:`${PUB}/images/Magnum_Classic_Ice_cream.webp`,
    1401:`${PUB}/images/haldiramkajukatli.webp`,1402:`${PUB}/images/Haldiram_Gulab_Jamun.webp`,
  };

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [paymentStep, setPaymentStep] = useState(false);
  const [payMode, setPayMode] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [upiVerified, setUpiVerified] = useState(false);
  const [upiVerifying, setUpiVerifying] = useState(false);
  const [upiPaid, setUpiPaid] = useState(false);
  const [upiPaymentError, setUpiPaymentError] = useState("");
  const [cardData, setCardData] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [walletSelected, setWalletSelected] = useState(null);
  const [payLaterSelected, setPayLaterSelected] = useState(null);
  const [orderPlacing, setOrderPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId] = useState("ZP" + Math.floor(Math.random() * 900000 + 100000));
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [imgErr, setImgErr] = useState({});
  const [dk] = useState(() => document.documentElement.classList.contains("dark") || window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [avoidCalling, setAvoidCalling] = useState(false);
  const [dontRingBell, setDontRingBell] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  const [customTip, setCustomTip] = useState("");
  const [showCustomTip, setShowCustomTip] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressData, setAddressData] = useState({ flat: "", street: "", city: "Ludhiana", pincode: "141001", label: "Home" });
  const [savedAddress, setSavedAddress] = useState({ flat: "", street: "Sector 12", city: "Ludhiana", pincode: "141001", label: "Home" });
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [paymentVerifying, setPaymentVerifying] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [upiIdPaymentSent, setUpiIdPaymentSent] = useState(false);
  const [showQrZoom, setShowQrZoom] = useState(false);
  const resendTimerRef = useRef(null);
  const paymentPollRef = useRef(null);

  const FREE_DELIVERY_THRESHOLD = 149;
  const distanceKm = 3.2;
  const baseDeliveryRate = 10;
  const kmDeliveryFee = Math.round(distanceKm * baseDeliveryRate);
  const deliveryFee = cartTotal >= FREE_DELIVERY_THRESHOLD ? 0 : kmDeliveryFee;
  const discount = appliedCoupon
    ? appliedCoupon.type === "pct"
      ? Math.round((cartTotal * appliedCoupon.val) / 100)
      : appliedCoupon.val
    : 0;
  const finalTotal = cartTotal + deliveryFee - discount + tipAmount;

  const cartItemIds = new Set(items.map(i => i.id));
  const cartCats = [...new Set(items.map(i => i.cat))];
  const suggestedProducts = PRODUCTS.filter(p => !cartItemIds.has(p.id) && cartCats.includes(p.cat)).slice(0, 10);
  const amountNeededForFreeDelivery = FREE_DELIVERY_THRESHOLD - cartTotal;

  const C = {
    bg: dk ? "#080808" : "#f0f0f0",
    card: dk ? "#111111" : "#ffffff",
    card2: dk ? "#161616" : "#fafafa",
    border: dk ? "#222" : "#e4e4e4",
    text: dk ? "#efefef" : "#111",
    sub: dk ? "#888" : "#555",
    dim: dk ? "#444" : "#aaa",
    accent: "#c8f135",
    g: "#0d5c2e", g2: "#1a7a3f", gl: "#e8f5e9",
    red: "#ef4444",
    surf: dk ? "#141414" : "#f5f5f5",
  };

  useEffect(() => () => {
    clearInterval(resendTimerRef.current);
    clearInterval(paymentPollRef.current);
  }, []);

  const startResendTimer = () => {
    setOtpResendTimer(30);
    resendTimerRef.current = setInterval(() => {
      setOtpResendTimer(t => {
        if (t <= 1) { clearInterval(resendTimerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const sendOtp = async () => {
    const num = mobileNumber.replace(/\D/g, "");
    if (num.length !== 10) { setMobileError("Enter a valid 10-digit mobile number"); return; }
    setMobileError("");
    setOtpSending(true);
    setOtpError("");
    await new Promise(r => setTimeout(r, 1000));
    const mockOtp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(mockOtp);
    setOtpSent(true);
    startResendTimer();
    setOtpSending(false);
    console.log("Demo OTP:", mockOtp);
  };

  const verifyOtpCode = () => {
    if (otp.length < 4) { setOtpError("Enter the OTP sent to your number"); return; }
    if (otp !== generatedOtp) { setOtpError("Incorrect OTP. Please check and try again."); return; }
    setOtpVerified(true);
    setOtpError("");
  };

  const verifyUpiId = async () => {
    if (!upiId || !upiId.includes("@")) { setUpiPaymentError("Enter a valid UPI ID (e.g. name@upi)"); return; }
    setUpiVerifying(true);
    setUpiPaymentError("");
    await new Promise(r => setTimeout(r, 1200));
    setUpiVerifying(false);
    setUpiVerified(true);
  };

  const openUpiApp = (scheme) => {
    const upiUrl = generateUPIUrl(finalTotal, orderId);
    const appUrls = {
      gpay: `gpay://upi/pay?pa=${STORE_UPI_ID}&pn=${encodeURIComponent(STORE_UPI_NAME)}&am=${finalTotal}&cu=INR&tn=${encodeURIComponent("Order " + orderId)}&tr=${orderId}`,
      phonepe: `phonepe://pay?pa=${STORE_UPI_ID}&pn=${encodeURIComponent(STORE_UPI_NAME)}&am=${finalTotal}&cu=INR&tn=${encodeURIComponent("Order " + orderId)}&tr=${orderId}`,
      paytm: `paytmmp://pay?pa=${STORE_UPI_ID}&pn=${encodeURIComponent(STORE_UPI_NAME)}&am=${finalTotal}&cu=INR&tn=${encodeURIComponent("Order " + orderId)}&tr=${orderId}`,
      bhim: `upi://pay?pa=${STORE_UPI_ID}&pn=${encodeURIComponent(STORE_UPI_NAME)}&am=${finalTotal}&cu=INR&tn=${encodeURIComponent("Order " + orderId)}&tr=${orderId}`,
    };
    window.location.href = appUrls[scheme] || upiUrl;
    startPaymentPolling();
  };

  const sendUpiPaymentRequest = () => {
    if (!upiVerified) return;
    const upiUrl = generateUPIUrl(finalTotal, orderId, `Pay ₹${finalTotal} to ${STORE_UPI_NAME} for Order ${orderId}`);
    window.location.href = upiUrl;
    setUpiIdPaymentSent(true);
    startPaymentPolling();
  };

  const startPaymentPolling = () => {
    setPaymentVerifying(true);
    setPaymentFailed(false);
    setTimeout(() => {
      setPaymentVerifying(false);
      setPaymentConfirmed(true);
      setUpiPaid(true);
    }, 4000);
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const cp = COUPONS[code];
    if (!cp) { setCouponError("Invalid coupon code"); return; }
    if (cartTotal < cp.min) { setCouponError(`Min. ₹${cp.min} order required`); return; }
    setAppliedCoupon({ ...cp, code });
    setCouponError("");
  };

  const placeOrder = async () => {
    setOrderPlacing(true);
    await new Promise(r => setTimeout(r, 1800));
    setOrderPlacing(false);
    setOrderPlaced(true);
    clearCart();
    setTimeout(() => navigate("/track", { state: { cartItems: items, orderId, total: finalTotal, mobile: mobileNumber } }), 2500);
  };

  const canPay = () => {
    if (!payMode) return false;
    if (payMode === "cod") return otpVerified;
    if (payMode === "upi") return upiPaid && paymentConfirmed;
    if (payMode === "upi_id") return upiVerified && upiPaid && paymentConfirmed;
    if (payMode === "card") return cardData.number.replace(/\s/g,"").length === 16 && cardData.expiry.length === 5 && cardData.cvv.length === 3 && cardData.name.length > 2;
    if (payMode === "wallet") return !!walletSelected;
    if (payMode === "paylater") return !!payLaterSelected;
    return false;
  };

  const shareCart = () => {
    const cartText = items.map(i => `• ${i.name} ×${i.qty} = ₹${i.price * i.qty}`).join("\n");
    const text = `🛒 My Zappit Cart (Total: ₹${cartTotal})\n\n${cartText}\n\nOrder for ⚡ 10-min delivery on Zappit!`;
    if (navigator.share) navigator.share({ title: "My Zappit Cart", text });
    else navigator.clipboard.writeText(text).then(() => { setShareCopied(true); setTimeout(() => setShareCopied(false), 2500); });
  };

  const saveAddress = () => { setSavedAddress({ ...addressData }); setShowAddressModal(false); };
  const addressDisplay = [savedAddress.flat, savedAddress.street, savedAddress.city].filter(Boolean).join(", ");
  const upiUrl = generateUPIUrl(finalTotal, orderId);
  const qrUrl = generateQRUrl(upiUrl);

  const fmtCard = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExpiry = v => {
    const d = v.replace(/\D/g,"").slice(0,4);
    return d.length > 2 ? d.slice(0,2) + "/" + d.slice(2) : d;
  };

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --accent: #c8f135;
      --g: #0d5c2e;
      --mono: 'DM Mono', monospace;
      --display: 'Syne', sans-serif;
      --body: 'Plus Jakarta Sans', sans-serif;
    }
    html {
      overflow-x: hidden;
    }
    body {
      overflow-x: hidden;
      min-width: 320px;
    }
    @keyframes zSlideUp{from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes zFadeIn{from{opacity:0}to{opacity:1}}
    @keyframes zPulse{0%,100%{opacity:1}50%{opacity:.45}}
    @keyframes zSpin{to{transform:rotate(360deg)}}
    @keyframes zShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
    @keyframes zPop{0%{transform:scale(.5);opacity:0}70%{transform:scale(1.13)}100%{transform:scale(1);opacity:1}}
    @keyframes zGlow{0%,100%{text-shadow:0 0 8px #c8f13570}50%{text-shadow:0 0 22px #c8f135cc}}
    @keyframes zCard{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes checkmark{0%{stroke-dashoffset:50}100%{stroke-dashoffset:0}}
    .z-pay-card { transition: border-color .18s, background .18s, transform .14s; cursor: pointer; }
    .z-pay-card:hover { transform: translateY(-2px); }
    .z-pay-sel { border-color: var(--accent) !important; background: #c8f13512 !important; }
    .z-btn-main { transition: background .16s, transform .13s, box-shadow .16s; }
    .z-btn-main:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(13,92,46,.4); }
    .z-btn-main:active:not(:disabled) { transform: translateY(0); }
    .z-cart-item { transition: background .16s; }
    .z-cart-item:hover { background: ${dk ? "#1a1a1a" : "#fafafa"}; }
    .z-sugg:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,.12); }
    .z-sugg { transition: transform .18s, box-shadow .18s; }
    .z-tag { font-family: var(--mono); }
    input:focus { outline: none; }
    textarea:focus { outline: none; }
    .z-qr-zoom { animation: zPop .28s ease; }

    .z-root {
      min-height: 100vh;
      width: 100%;
      overflow-x: hidden;
    }

    .z-header {
      position: sticky;
      top: 0;
      z-index: 100;
      width: 100%;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    .z-header-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .z-page-wrapper {
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
      padding: 18px 20px 60px;
      box-sizing: border-box;
    }

    .z-cart-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 20px;
      align-items: start;
      width: 100%;
    }

    .z-main-col {
      min-width: 0;
      width: 100%;
    }

    .z-sidebar-col {
      min-width: 0;
      width: 100%;
    }

    .z-sidebar-sticky {
      position: sticky;
      top: 64px;
    }

    @media (max-width: 900px) {
      .z-cart-layout {
        grid-template-columns: 1fr;
      }
      .z-sidebar-sticky {
        position: static;
      }
    }

    @media (max-width: 600px) {
      .z-header-inner {
        padding: 10px 12px;
      }
      .z-page-wrapper {
        padding: 14px 12px 60px;
      }
      .z-header-title {
        font-size: 15px !important;
      }
    }

    @media (max-width: 400px) {
      .z-header-title {
        font-size: 13px !important;
      }
    }
  `;

  if (orderPlaced) return (
    <div style={{ minHeight:"100vh", background: C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--body)" }}>
      <style>{CSS}</style>
      <div style={{ textAlign:"center", animation:"zSlideUp .4s ease" }}>
        <div style={{ fontSize:80, animation:"zPop .5s ease", marginBottom:16 }}>🎉</div>
        <div style={{ fontSize:28, fontWeight:800, color: C.accent, marginBottom:8, fontFamily:"var(--display)" }}>Order Placed!</div>
        <div style={{ fontSize:14, color: C.sub, marginBottom:6 }}>Order ID: <b style={{ color: C.text, fontFamily:"var(--mono)" }}>{orderId}</b></div>
        <div style={{ fontSize:13, color: C.sub }}>Redirecting to live tracking...</div>
        <div style={{ marginTop:22, width:40, height:40, border:`3px solid ${C.border}`, borderTopColor: C.accent, borderRadius:"50%", animation:"zSpin 1s linear infinite", margin:"22px auto" }} />
      </div>
    </div>
  );

  if (items.length === 0) return (
    <div style={{ minHeight:"100vh", background: C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"var(--body)", gap:16 }}>
      <style>{CSS}</style>
      <div style={{ fontSize:72 }}>🛒</div>
      <div style={{ fontSize:22, fontWeight:800, color: C.text, fontFamily:"var(--display)" }}>Your cart is empty</div>
      <div style={{ fontSize:14, color: C.sub }}>Add some items to get started!</div>
      <button onClick={() => navigate("/")} style={{ marginTop:10, background: C.g, color:"#fff", border:"none", borderRadius:14, padding:"13px 32px", fontSize:14, fontWeight:700, cursor:"pointer" }}>← Browse Products</button>
    </div>
  );

  return (
    <div className="z-root" style={{ background: C.bg, fontFamily:"var(--body)", color: C.text }}>
      <style>{CSS}</style>

      <div className="z-header" style={{ background: dk ? "rgba(8,8,8,.97)" : "rgba(255,255,255,.97)", borderBottom:`1px solid ${C.border}` }}>
        <div className="z-header-inner">
          <button onClick={() => navigate("/")} style={{ background:"none", border:`1.5px solid ${C.border}`, color: C.sub, borderRadius:9, padding:"5px 11px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"var(--mono)", flexShrink:0, whiteSpace:"nowrap" }}>← Back</button>
          <img src={`${PUB}/images/zappit_logo.png`} alt="Zappit" style={{ height:32, width:"auto", objectFit:"contain", flexShrink:0 }} onError={e => { e.currentTarget.style.display = "none"; }} />
          <div className="z-header-title" style={{ fontSize:18, fontWeight:800, color: C.text, fontFamily:"var(--display)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", flex:1 }}>
            My Cart <span style={{ color: C.accent, fontFamily:"var(--mono)", fontSize:13 }}>({items.length})</span>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <button onClick={() => setShowShareModal(true)} style={{ background: dk ? "#1a1a1a" : "#f0f0f0", border:`1.5px solid ${C.border}`, color: C.sub, borderRadius:9, padding:"5px 11px", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>🔗 Share</button>
            <div style={{ background: C.accent, color:"#000", borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:800, fontFamily:"var(--mono)", whiteSpace:"nowrap" }}>⚡ 10 MIN</div>
          </div>
        </div>
      </div>

      {showShareModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(8px)" }}>
          <div style={{ background: C.card, borderRadius:22, padding:24, width:"100%", maxWidth:400, animation:"zSlideUp .3s ease", border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:17, fontWeight:800, color: C.text, marginBottom:6, fontFamily:"var(--display)" }}>🔗 Share Your Cart</div>
            <div style={{ fontSize:12, color: C.sub, marginBottom:16 }}>Send your cart to friends or family</div>
            <div style={{ background: C.surf, borderRadius:12, padding:14, marginBottom:16, fontSize:12, color: C.sub, lineHeight:1.8, fontFamily:"var(--mono)" }}>
              {items.map(i => <div key={i.id}>• {i.name} ×{i.qty} — ₹{i.price * i.qty}</div>)}
              <div style={{ marginTop:8, fontWeight:800, color: C.text, borderTop:`1px solid ${C.border}`, paddingTop:8 }}>Total: ₹{cartTotal}</div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={shareCart} style={{ flex:1, background: C.accent, color:"#000", border:"none", borderRadius:12, padding:"12px 0", fontSize:13, fontWeight:800, cursor:"pointer" }}>{shareCopied ? "✅ Copied!" : "📋 Copy & Share"}</button>
              <button onClick={() => setShowShareModal(false)} style={{ flex:1, background: C.surf, color: C.sub, border:`1.5px solid ${C.border}`, borderRadius:12, padding:"12px 0", fontSize:13, fontWeight:700, cursor:"pointer" }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showAddressModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(8px)" }}>
          <div style={{ background: C.card, borderRadius:22, padding:24, width:"100%", maxWidth:440, animation:"zSlideUp .3s ease", border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:17, fontWeight:800, color: C.text, marginBottom:4, fontFamily:"var(--display)" }}>📍 Delivery Address</div>
            <div style={{ fontSize:12, color: C.sub, marginBottom:16 }}>Enter your complete delivery address</div>
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              {["Home","Work","Other"].map(l => (
                <button key={l} onClick={() => setAddressData(a => ({ ...a, label: l }))}
                  style={{ flex:1, background: addressData.label === l ? C.accent : C.surf, color: addressData.label === l ? "#000" : C.sub, border:`1.5px solid ${addressData.label === l ? C.accent : C.border}`, borderRadius:10, padding:"8px 0", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  {l === "Home" ? "🏠" : l === "Work" ? "💼" : "📍"} {l}
                </button>
              ))}
            </div>
            {[{ key:"flat", placeholder:"Flat / House No. / Building Name" }, { key:"street", placeholder:"Street / Area / Locality" }].map(f => (
              <input key={f.key} value={addressData[f.key]} onChange={e => setAddressData(a => ({ ...a, [f.key]: e.target.value }))} placeholder={f.placeholder}
                style={{ width:"100%", background: C.surf, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"11px 14px", color: C.text, fontSize:13, marginBottom:10, fontFamily:"var(--body)" }} />
            ))}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
              <input value={addressData.city} onChange={e => setAddressData(a => ({ ...a, city: e.target.value }))} placeholder="City"
                style={{ background: C.surf, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"11px 14px", color: C.text, fontSize:13 }} />
              <input value={addressData.pincode} onChange={e => setAddressData(a => ({ ...a, pincode: e.target.value.replace(/\D/g,"").slice(0,6) }))} placeholder="Pincode"
                style={{ background: C.surf, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"11px 14px", color: C.text, fontSize:13, fontFamily:"var(--mono)" }} />
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={saveAddress} style={{ flex:1, background: C.g, color:"#fff", border:"none", borderRadius:12, padding:"13px 0", fontSize:14, fontWeight:800, cursor:"pointer" }}>Save Address →</button>
              <button onClick={() => setShowAddressModal(false)} style={{ flex:1, background: C.surf, color: C.sub, border:`1.5px solid ${C.border}`, borderRadius:12, padding:"13px 0", fontSize:13, fontWeight:700, cursor:"pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showQrZoom && (
        <div onClick={() => setShowQrZoom(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.88)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(12px)" }}>
          <div className="z-qr-zoom" onClick={e => e.stopPropagation()} style={{ background: dk ? "#111" : "#fff", borderRadius:24, padding:28, textAlign:"center", border:`2px solid ${C.accent}` }}>
            <div style={{ fontSize:13, fontWeight:700, color: C.sub, marginBottom:14, fontFamily:"var(--mono)" }}>Scan to Pay ₹{finalTotal}</div>
            <img src={qrUrl} alt="UPI QR" style={{ width:260, height:260, borderRadius:12, display:"block" }} />
            <div style={{ marginTop:14, fontSize:13, fontWeight:800, color: C.text, fontFamily:"var(--display)" }}>{STORE_UPI_NAME}</div>
            <div style={{ marginTop:4, fontSize:10, color: C.sub, fontFamily:"var(--mono)" }}>Powered by UPI</div>
            <button onClick={() => setShowQrZoom(false)} style={{ marginTop:16, background: C.surf, color: C.sub, border:`1px solid ${C.border}`, borderRadius:10, padding:"8px 22px", fontSize:12, cursor:"pointer" }}>Close</button>
          </div>
        </div>
      )}

      <div className="z-page-wrapper">
        <div className="z-cart-layout">

          <div className="z-main-col">
            {amountNeededForFreeDelivery > 0 && (
              <div style={{ background: dk ? "#1a1400" : "#fffbeb", border:`1.5px solid #f59e0b40`, borderRadius:14, padding:"12px 16px", marginBottom:14, display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:22, flexShrink:0 }}>🛵</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#f59e0b" }}>Add ₹{amountNeededForFreeDelivery} more for FREE delivery!</div>
                  <div style={{ fontSize:11, color:"#d97706", marginTop:2 }}>₹{kmDeliveryFee} fee for {distanceKm} km · Free above ₹{FREE_DELIVERY_THRESHOLD}</div>
                  <div style={{ marginTop:6, height:5, background: dk ? "#2a2000" : "#fde68a", borderRadius:4, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${Math.min((cartTotal / FREE_DELIVERY_THRESHOLD)*100, 100)}%`, background:"#f59e0b", borderRadius:4, transition:"width .4s" }} />
                  </div>
                </div>
              </div>
            )}

            {!paymentStep ? (
              <>
                <div style={{ background: C.card, borderRadius:18, border:`1px solid ${C.border}`, overflow:"hidden", marginBottom:14 }}>
                  <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ fontSize:13, fontWeight:700, color: C.text }}>{items.length} item{items.length !== 1 ? "s" : ""} in cart</div>
                    <button onClick={() => clearCart()} style={{ background: dk ? "#2a0a0a" : "#fce4ec", color: C.red, border:"none", borderRadius:8, padding:"4px 12px", fontSize:11, fontWeight:800, cursor:"pointer" }}>Clear All</button>
                  </div>

                  {items.map(item => (
                    <div key={item.id} className="z-cart-item" style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 18px", borderBottom:`1px solid ${C.border}`, animation:"zFadeIn .3s ease" }}>
                      <div style={{ width:68, height:68, background: C.surf, borderRadius:12, flexShrink:0, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${C.border}` }}>
                        {IMG_MAP[item.id] && !imgErr[item.id]
                          ? <img src={IMG_MAP[item.id]} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"contain", padding:4 }} onError={() => setImgErr(e => ({ ...e, [item.id]: true }))} />
                          : <span style={{ fontSize:28 }}>{EFB[item.cat] || "📦"}</span>
                        }
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:600, color: C.text, marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div>
                        <div style={{ fontSize:11, color: C.sub, fontFamily:"var(--mono)", marginBottom:6 }}>{item.brand} · {item.weight}</div>
                        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                          <div style={{ display:"flex", alignItems:"center", background: C.surf, borderRadius:9, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                            <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ background:"none", border:"none", color: C.red, fontSize:16, fontWeight:900, cursor:"pointer", padding:"4px 10px" }}>−</button>
                            <span style={{ fontSize:13, fontWeight:800, color: C.text, minWidth:20, textAlign:"center", fontFamily:"var(--mono)" }}>{item.qty}</span>
                            <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ background:"none", border:"none", color: C.g, fontSize:16, fontWeight:900, cursor:"pointer", padding:"4px 10px" }}>+</button>
                          </div>
                          <span style={{ fontSize:13, fontWeight:700, color: C.text, fontFamily:"var(--mono)" }}>₹{item.price * item.qty}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {suggestedProducts.length > 0 && (
                  <div style={{ background: C.card, borderRadius:18, border:`1px solid ${C.border}`, padding:"14px 18px", marginBottom:14 }}>
                    <div style={{ fontSize:13, fontWeight:700, color: C.text, marginBottom:12 }}>🛍 You Might Also Like</div>
                    <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:6 }}>
                      {suggestedProducts.map(p => (
                        <div key={p.id} className="z-sugg" style={{ flexShrink:0, width:120, background: C.surf, borderRadius:14, border:`1px solid ${C.border}`, padding:10 }}>
                          <div style={{ width:54, height:54, background: C.card, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px", border:`1px solid ${C.border}`, overflow:"hidden" }}>
                            {IMG_MAP[p.id] && !imgErr[p.id]
                              ? <img src={IMG_MAP[p.id]} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"contain", padding:3 }} onError={() => setImgErr(e => ({ ...e, [p.id]: true }))} />
                              : <span style={{ fontSize:24 }}>{EFB[p.cat] || "📦"}</span>
                            }
                          </div>
                          <div style={{ fontSize:10, fontWeight:600, color: C.text, textAlign:"center", lineHeight:1.4, marginBottom:5, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{p.name}</div>
                          <div style={{ fontSize:11, fontWeight:800, color: C.accent, textAlign:"center", fontFamily:"var(--mono)" }}>₹{p.price}</div>
                          <button onClick={() => addItem(p)} style={{ width:"100%", marginTop:6, background: C.g, color:"#fff", border:"none", borderRadius:7, padding:"5px 0", fontSize:11, fontWeight:700, cursor:"pointer" }}>+ Add</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ background: C.card, borderRadius:18, border:`1px solid ${C.border}`, padding:"14px 18px", marginBottom:14 }}>
                  <div style={{ fontSize:13, fontWeight:700, color: C.text, marginBottom:10 }}>🏷 Coupon & Offers</div>
                  <div style={{ display:"flex", gap:8 }}>
                    <input value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())} placeholder="Enter coupon code" maxLength={10}
                      style={{ flex:1, minWidth:0, background: C.surf, border:`1.5px solid ${appliedCoupon ? C.accent : C.border}`, borderRadius:10, padding:"9px 13px", color: C.text, fontSize:13, fontFamily:"var(--mono)", letterSpacing:1 }} />
                    <button onClick={applyCoupon} disabled={!!appliedCoupon}
                      style={{ background: appliedCoupon ? "#16a34a" : C.g, color:"#fff", border:"none", borderRadius:10, padding:"9px 16px", fontSize:13, fontWeight:700, cursor: appliedCoupon ? "default" : "pointer", flexShrink:0 }}>
                      {appliedCoupon ? "✓ Applied" : "Apply"}
                    </button>
                  </div>
                  {couponError && <div style={{ fontSize:11, color: C.red, marginTop:6, fontFamily:"var(--mono)" }}>⚠ {couponError}</div>}
                  {appliedCoupon && <div style={{ fontSize:11, color:"#16a34a", marginTop:6, fontFamily:"var(--mono)" }}>✓ {appliedCoupon.code}: {appliedCoupon.desc} — You save ₹{discount}</div>}
                  <div style={{ marginTop:10, display:"flex", gap:8, flexWrap:"wrap" }}>
                    {Object.entries(COUPONS).filter(([k]) => !appliedCoupon || appliedCoupon.code !== k).slice(0,4).map(([code]) => (
                      <button key={code} onClick={() => { setCouponInput(code); }} style={{ background: C.surf, border:`1px dashed ${C.border}`, borderRadius:8, padding:"4px 10px", fontSize:10, fontWeight:700, color: C.sub, cursor:"pointer", fontFamily:"var(--mono)" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = C.accent} onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                        {code}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ background: C.card, borderRadius:18, border:`1px solid ${C.border}`, padding:"14px 18px", marginBottom:14 }}>
                  <div style={{ fontSize:13, fontWeight:700, color: C.text, marginBottom:10 }}>📍 Delivery Address</div>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:11, fontWeight:700, color: C.sub, marginBottom:3, fontFamily:"var(--mono)" }}>{savedAddress.label.toUpperCase()}</div>
                      <div style={{ fontSize:13, color: C.text, lineHeight:1.6 }}>{addressDisplay || "No address set"}</div>
                      <div style={{ fontSize:11, color: C.sub, fontFamily:"var(--mono)" }}>{savedAddress.pincode}</div>
                    </div>
                    <button onClick={() => setShowAddressModal(true)} style={{ background: C.surf, border:`1.5px solid ${C.border}`, color: C.sub, borderRadius:9, padding:"6px 13px", fontSize:11, fontWeight:700, cursor:"pointer", flexShrink:0 }}>Change</button>
                  </div>
                </div>

                <div style={{ background: C.card, borderRadius:18, border:`1px solid ${C.border}`, padding:"14px 18px", marginBottom:14 }}>
                  <div style={{ fontSize:13, fontWeight:700, color: C.text, marginBottom:8 }}>💝 Tip Your Delivery Partner</div>
                  <div style={{ fontSize:11, color: C.sub, marginBottom:10 }}>100% of tip goes directly to your delivery partner</div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {[0, 10, 20, 30, 50].map(t => (
                      <button key={t} onClick={() => { setTipAmount(t); setShowCustomTip(false); setCustomTip(""); }}
                        style={{ background: tipAmount === t && !showCustomTip ? C.accent : C.surf, color: tipAmount === t && !showCustomTip ? "#000" : C.sub, border:`1.5px solid ${tipAmount === t && !showCustomTip ? C.accent : C.border}`, borderRadius:9, padding:"6px 13px", fontSize:12, fontWeight:700, cursor:"pointer", transition:"all .15s" }}>
                        {t === 0 ? "No tip" : `₹${t}`}
                      </button>
                    ))}
                    <button onClick={() => setShowCustomTip(true)} style={{ background: showCustomTip ? C.accent : C.surf, color: showCustomTip ? "#000" : C.sub, border:`1.5px solid ${showCustomTip ? C.accent : C.border}`, borderRadius:9, padding:"6px 13px", fontSize:12, fontWeight:700, cursor:"pointer" }}>Custom</button>
                  </div>
                  {showCustomTip && (
                    <div style={{ marginTop:10, display:"flex", gap:8 }}>
                      <input value={customTip} onChange={e => setCustomTip(e.target.value.replace(/\D/g,""))} placeholder="Enter amount" type="tel"
                        style={{ flex:1, background: C.surf, border:`1.5px solid ${C.border}`, borderRadius:9, padding:"9px 13px", color: C.text, fontSize:13, fontFamily:"var(--mono)" }} />
                      <button onClick={() => { setTipAmount(parseInt(customTip) || 0); }}
                        style={{ background: C.g, color:"#fff", border:"none", borderRadius:9, padding:"9px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>Set</button>
                    </div>
                  )}
                </div>

                <div style={{ background: C.card, borderRadius:18, border:`1px solid ${C.border}`, padding:"14px 18px", marginBottom:14 }}>
                  <div style={{ fontSize:13, fontWeight:700, color: C.text, marginBottom:10 }}>📝 Delivery Instructions</div>
                  <textarea value={deliveryInstructions} onChange={e => setDeliveryInstructions(e.target.value)} placeholder="E.g. Leave at door, call on arrival..." rows={2}
                    style={{ width:"100%", background: C.surf, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"10px 13px", color: C.text, fontSize:13, resize:"none", fontFamily:"var(--body)" }} />
                  <div style={{ marginTop:10, display:"flex", gap:10, flexWrap:"wrap" }}>
                    {[
                      { key:"avoidCalling", label:"🔕 Avoid Calling", val: avoidCalling, set: setAvoidCalling },
                      { key:"dontRingBell", label:"🔔 Don't Ring Bell", val: dontRingBell, set: setDontRingBell },
                    ].map(item => (
                      <button key={item.key} onClick={() => item.set(!item.val)}
                        style={{ background: item.val ? (dk ? "#1a2a1a" : "#e8f5e9") : C.surf, color: item.val ? "#16a34a" : C.sub, border:`1.5px solid ${item.val ? "#16a34a" : C.border}`, borderRadius:9, padding:"6px 13px", fontSize:11, fontWeight:700, cursor:"pointer", transition:"all .15s" }}>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

              </>
            ) : (
              <div style={{ animation:"zCard .35s ease" }}>
                <div style={{ background: C.card, borderRadius:18, border:`1px solid ${C.border}`, padding:"18px", marginBottom:14 }}>
                  <div style={{ fontSize:15, fontWeight:800, color: C.text, marginBottom:4, fontFamily:"var(--display)" }}>Choose Payment Method</div>
                  <div style={{ fontSize:11, color: C.sub, marginBottom:16, fontFamily:"var(--mono)" }}>All payments are 100% secure & encrypted</div>

                  {[
                    { key:"upi", label:"UPI Apps", sub:"GPay, PhonePe, Paytm, BHIM", icon:"🏦" },
                    { key:"upi_id", label:"UPI ID", sub:"Pay directly via your UPI ID", icon:"@" },
                    { key:"card", label:"Credit / Debit Card", sub:"Visa, Mastercard, RuPay", icon:"💳" },
                    { key:"cod", label:"Cash on Delivery", sub:"OTP verified at doorstep", icon:"💵" },
                    { key:"wallet", label:"Wallets", sub:"Paytm, Amazon Pay, Freecharge", icon:"👛" },
                    { key:"paylater", label:"Pay Later / EMI", sub:"Simpl, LazyPay, ZestMoney", icon:"📅" },
                  ].map(m => (
                    <div key={m.key} className={`z-pay-card ${payMode === m.key ? "z-pay-sel" : ""}`}
                      onClick={() => { setPayMode(m.key); setUpiPaid(false); setPaymentConfirmed(false); setPaymentFailed(false); setUpiPaymentError(""); }}
                      style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:13, border:`1.5px solid ${payMode === m.key ? C.accent : C.border}`, marginBottom:9, background: payMode === m.key ? (dk ? "#c8f13510" : "#f0ffd0") : C.surf }}>
                      <div style={{ width:38, height:38, background: payMode === m.key ? C.accent : C.card, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:m.key === "upi_id" ? 15 : 18, fontWeight:900, flexShrink:0, transition:"background .15s" }}>{m.icon}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:700, color: C.text }}>{m.label}</div>
                        <div style={{ fontSize:11, color: C.sub, fontFamily:"var(--mono)", marginTop:1 }}>{m.sub}</div>
                      </div>
                      <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${payMode === m.key ? C.accent : C.dim}`, background: payMode === m.key ? C.accent : "none", flexShrink:0 }} />
                    </div>
                  ))}
                </div>

                {payMode === "upi" && (
                  <div style={{ background: C.card, borderRadius:18, border:`1px solid ${C.border}`, padding:"18px", marginBottom:14, animation:"zSlideUp .3s ease" }}>
                    <div style={{ fontSize:14, fontWeight:700, color: C.text, marginBottom:14 }}>💸 Pay via UPI App</div>

                    {paymentConfirmed ? (
                      <div style={{ textAlign:"center", padding:"20px 0" }}>
                        <div style={{ fontSize:48, marginBottom:8 }}>✅</div>
                        <div style={{ fontSize:16, fontWeight:800, color:"#16a34a" }}>Payment Confirmed!</div>
                        <div style={{ fontSize:12, color: C.sub, fontFamily:"var(--mono)", marginTop:6 }}>₹{finalTotal} received · Order {orderId}</div>
                      </div>
                    ) : (
                      <>
                        <div style={{ background: dk ? "#0d0d0d" : "#f5f5f5", borderRadius:14, padding:16, textAlign:"center", marginBottom:14, border:`1px solid ${C.border}` }}>
                          <div style={{ fontSize:11, color: C.sub, fontFamily:"var(--mono)", marginBottom:10 }}>Scan QR with any UPI app</div>
                          <img onClick={() => setShowQrZoom(true)} src={qrUrl} alt="UPI QR" style={{ width:160, height:160, borderRadius:10, cursor:"pointer", transition:"transform .15s" }}
                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                          <div style={{ marginTop:10, fontSize:14, fontWeight:800, color: C.text, fontFamily:"var(--display)" }}>{STORE_UPI_NAME}</div>
                          <div style={{ fontSize:11, fontWeight:700, color: C.accent, fontFamily:"var(--mono)", marginTop:2 }}>₹{finalTotal}</div>
                          <div style={{ fontSize:10, color: C.dim, marginTop:3 }}>Tap QR to zoom</div>
                        </div>
                        <div style={{ fontSize:12, color: C.sub, marginBottom:10, textAlign:"center" }}>— or pay directly via app —</div>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
                          {[
                            { key:"gpay", label:"Google Pay", color:"#1a73e8", emoji:"🔵" },
                            { key:"phonepe", label:"PhonePe", color:"#6739b7", emoji:"🟣" },
                            { key:"paytm", label:"Paytm", color:"#00baf2", emoji:"🔷" },
                            { key:"bhim", label:"BHIM UPI", color:"#138808", emoji:"🟢" },
                          ].map(a => (
                            <button key={a.key} onClick={() => openUpiApp(a.key)}
                              style={{ background: a.color + "15", border:`1.5px solid ${a.color}40`, borderRadius:11, padding:"10px 0", fontSize:12, fontWeight:700, color: C.text, cursor:"pointer", transition:"all .15s" }}
                              onMouseEnter={e => e.currentTarget.style.background = a.color + "28"} onMouseLeave={e => e.currentTarget.style.background = a.color + "15"}>
                              {a.emoji} {a.label}
                            </button>
                          ))}
                        </div>
                        {paymentVerifying && (
                          <div style={{ marginTop:14, display:"flex", alignItems:"center", justifyContent:"center", gap:10, background: dk ? "#0d1a0d" : "#f0fdf4", borderRadius:12, padding:"12px 16px", border:`1px solid #16a34a30` }}>
                            <div style={{ width:16, height:16, border:`2px solid #16a34a40`, borderTopColor:"#16a34a", borderRadius:"50%", animation:"zSpin 1s linear infinite", flexShrink:0 }} />
                            <span style={{ fontSize:12, color:"#16a34a", fontFamily:"var(--mono)" }}>Confirming payment...</span>
                          </div>
                        )}
                        {paymentFailed && <div style={{ marginTop:10, fontSize:12, color: C.red, textAlign:"center", fontFamily:"var(--mono)" }}>⚠ {upiPaymentError || "Payment not confirmed."}</div>}
                      </>
                    )}
                  </div>
                )}

                {payMode === "upi_id" && (
                  <div style={{ background: C.card, borderRadius:18, border:`1px solid ${C.border}`, padding:"18px", marginBottom:14, animation:"zSlideUp .3s ease" }}>
                    <div style={{ fontSize:14, fontWeight:700, color: C.text, marginBottom:14 }}>🔗 Pay via UPI ID</div>
                    {!upiVerified ? (
                      <>
                        <div style={{ display:"flex", gap:8 }}>
                          <input value={upiId} onChange={e => { setUpiId(e.target.value.toLowerCase()); setUpiPaymentError(""); }} placeholder="yourname@upi"
                            style={{ flex:1, minWidth:0, background: C.surf, border:`1.5px solid ${upiPaymentError ? C.red : C.border}`, borderRadius:10, padding:"11px 14px", color: C.text, fontSize:13, fontFamily:"var(--mono)" }} />
                          <button onClick={verifyUpiId} disabled={upiVerifying}
                            style={{ background: C.g, color:"#fff", border:"none", borderRadius:10, padding:"11px 16px", fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0 }}>
                            {upiVerifying ? "..." : "Verify"}
                          </button>
                        </div>
                        {upiPaymentError && <div style={{ fontSize:11, color: C.red, marginTop:6, fontFamily:"var(--mono)" }}>⚠ {upiPaymentError}</div>}
                      </>
                    ) : paymentConfirmed ? (
                      <div style={{ textAlign:"center", padding:"16px 0" }}>
                        <div style={{ fontSize:40, marginBottom:8 }}>✅</div>
                        <div style={{ fontSize:15, fontWeight:800, color:"#16a34a" }}>Payment Confirmed!</div>
                        <div style={{ fontSize:11, color: C.sub, fontFamily:"var(--mono)", marginTop:4 }}>₹{finalTotal} · {upiId}</div>
                      </div>
                    ) : (
                      <>
                        <div style={{ display:"flex", alignItems:"center", gap:10, background: dk ? "#0d1a0d" : "#f0fdf4", borderRadius:12, padding:"11px 14px", marginBottom:14, border:`1px solid #16a34a30` }}>
                          <div style={{ fontSize:18 }}>✅</div>
                          <div>
                            <div style={{ fontSize:12, fontWeight:700, color:"#16a34a" }}>UPI ID Verified</div>
                            <div style={{ fontSize:11, color: C.sub, fontFamily:"var(--mono)" }}>{upiId}</div>
                          </div>
                        </div>
                        <button onClick={sendUpiPaymentRequest} disabled={upiIdPaymentSent || paymentVerifying}
                          style={{ width:"100%", background: upiIdPaymentSent ? C.surf : C.g, color: upiIdPaymentSent ? C.sub : "#fff", border:`1.5px solid ${upiIdPaymentSent ? C.border : C.g}`, borderRadius:12, padding:"13px 0", fontSize:14, fontWeight:800, cursor: upiIdPaymentSent ? "default" : "pointer" }}>
                          {upiIdPaymentSent ? "Opening UPI app..." : `Send ₹${finalTotal} Payment Request →`}
                        </button>
                        {paymentVerifying && (
                          <div style={{ marginTop:12, display:"flex", alignItems:"center", justifyContent:"center", gap:10, background: dk ? "#0d1a0d" : "#f0fdf4", borderRadius:12, padding:"12px 16px", border:`1px solid #16a34a30` }}>
                            <div style={{ width:16, height:16, border:`2px solid #16a34a40`, borderTopColor:"#16a34a", borderRadius:"50%", animation:"zSpin 1s linear infinite" }} />
                            <span style={{ fontSize:12, color:"#16a34a", fontFamily:"var(--mono)" }}>Waiting for payment confirmation...</span>
                          </div>
                        )}
                        {paymentFailed && <div style={{ marginTop:10, fontSize:12, color: C.red, textAlign:"center", fontFamily:"var(--mono)" }}>⚠ {upiPaymentError}</div>}
                      </>
                    )}
                  </div>
                )}

                {payMode === "card" && (
                  <div style={{ background: C.card, borderRadius:18, border:`1px solid ${C.border}`, padding:"18px", marginBottom:14, animation:"zSlideUp .3s ease" }}>
                    <div style={{ fontSize:14, fontWeight:700, color: C.text, marginBottom:16 }}>💳 Card Details</div>
                    <div style={{ background:`linear-gradient(135deg, ${C.g} 0%, #1a7a3f 100%)`, borderRadius:16, padding:"18px 20px", marginBottom:16, minHeight:130, position:"relative", overflow:"hidden" }}>
                      <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,.06)" }} />
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
                        <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.6)", letterSpacing:2, fontFamily:"var(--mono)" }}>ZAPPIT</div>
                        <div style={{ display:"flex", gap:4 }}>
                          <div style={{ width:22, height:22, borderRadius:"50%", background:"#eb001b", opacity:.9 }} />
                          <div style={{ width:22, height:22, borderRadius:"50%", background:"#f79e1b", opacity:.9, marginLeft:-8 }} />
                        </div>
                      </div>
                      <div style={{ fontSize:15, fontWeight:600, color:"#fff", fontFamily:"var(--mono)", letterSpacing:3, marginBottom:12 }}>
                        {(cardData.number || "•••• •••• •••• ••••").padEnd(19, "•")}
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
                        <div>
                          <div style={{ fontSize:9, color:"rgba(255,255,255,.5)", letterSpacing:1, fontFamily:"var(--mono)" }}>CARD HOLDER</div>
                          <div style={{ fontSize:12, color:"#fff", fontWeight:600, fontFamily:"var(--mono)" }}>{cardData.name.toUpperCase() || "YOUR NAME"}</div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:9, color:"rgba(255,255,255,.5)", letterSpacing:1, fontFamily:"var(--mono)" }}>EXPIRES</div>
                          <div style={{ fontSize:12, color:"#fff", fontWeight:600, fontFamily:"var(--mono)" }}>{cardData.expiry || "MM/YY"}</div>
                        </div>
                      </div>
                    </div>
                    {[
                      { key:"number", label:"Card Number", placeholder:"1234 5678 9012 3456", type:"tel", maxLen:19, fmt: v => fmtCard(v) },
                      { key:"name", label:"Cardholder Name", placeholder:"As on card", type:"text", maxLen:30, fmt: v => v },
                    ].map(f => (
                      <div key={f.key} style={{ marginBottom:12 }}>
                        <div style={{ fontSize:11, fontWeight:600, color: C.sub, marginBottom:5, fontFamily:"var(--mono)" }}>{f.label}</div>
                        <input value={cardData[f.key]} onChange={e => setCardData(d => ({ ...d, [f.key]: f.fmt(e.target.value) }))} placeholder={f.placeholder} type={f.type} maxLength={f.maxLen}
                          style={{ width:"100%", background: C.surf, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"11px 14px", color: C.text, fontSize:14, fontFamily: f.key === "number" ? "var(--mono)" : "var(--body)" }} />
                      </div>
                    ))}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      <div>
                        <div style={{ fontSize:11, fontWeight:600, color: C.sub, marginBottom:5, fontFamily:"var(--mono)" }}>Expiry Date</div>
                        <input value={cardData.expiry} onChange={e => setCardData(d => ({ ...d, expiry: fmtExpiry(e.target.value) }))} placeholder="MM/YY" type="tel" maxLength={5}
                          style={{ width:"100%", background: C.surf, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"11px 14px", color: C.text, fontSize:14, fontFamily:"var(--mono)" }} />
                      </div>
                      <div>
                        <div style={{ fontSize:11, fontWeight:600, color: C.sub, marginBottom:5, fontFamily:"var(--mono)" }}>CVV</div>
                        <input value={cardData.cvv} onChange={e => setCardData(d => ({ ...d, cvv: e.target.value.replace(/\D/g,"").slice(0,3) }))} placeholder="•••" type="password" maxLength={3}
                          style={{ width:"100%", background: C.surf, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"11px 14px", color: C.text, fontSize:14, fontFamily:"var(--mono)" }} />
                      </div>
                    </div>
                    <div style={{ marginTop:12, padding:"10px 14px", background: dk ? "#0d1a0d" : "#f0fdf4", borderRadius:10, fontSize:11, color:"#16a34a", display:"flex", alignItems:"center", gap:6 }}>
                      🔒 256-bit SSL encryption · PCI DSS compliant
                    </div>
                  </div>
                )}

                {payMode === "cod" && (
                  <div style={{ background: C.card, borderRadius:18, border:`1px solid ${C.border}`, padding:"18px", marginBottom:14, animation:"zSlideUp .3s ease" }}>
                    <div style={{ fontSize:14, fontWeight:700, color: C.text, marginBottom:14 }}>📱 Verify Mobile for COD</div>
                    {!otpVerified ? (
                      <>
                        <div style={{ marginBottom:12 }}>
                          <div style={{ fontSize:11, fontWeight:600, color: C.sub, marginBottom:5, fontFamily:"var(--mono)" }}>MOBILE NUMBER</div>
                          <div style={{ display:"flex", gap:8 }}>
                            <div style={{ background: C.surf, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"11px 14px", fontSize:13, color: C.sub, fontFamily:"var(--mono)", flexShrink:0 }}>+91</div>
                            <input value={mobileNumber} onChange={e => { setMobileNumber(e.target.value.replace(/\D/g,"").slice(0,10)); setMobileError(""); }} placeholder="9876543210" type="tel" maxLength={10}
                              style={{ flex:1, minWidth:0, background: C.surf, border:`1.5px solid ${mobileError ? C.red : C.border}`, borderRadius:10, padding:"11px 14px", color: C.text, fontSize:14, fontFamily:"var(--mono)", letterSpacing:1 }} />
                          </div>
                          {mobileError && <div style={{ fontSize:11, color: C.red, marginTop:5, fontFamily:"var(--mono)" }}>⚠ {mobileError}</div>}
                        </div>
                        <button onClick={sendOtp} disabled={otpSending || (otpSent && otpResendTimer > 0)}
                          style={{ width:"100%", background: otpSent ? (otpResendTimer > 0 ? C.surf : C.card) : C.g, color: otpSent ? (otpResendTimer > 0 ? C.dim : C.sub) : "#fff", border: otpSent ? `1.5px solid ${C.border}` : "none", borderRadius:11, padding:"12px", fontSize:13, fontWeight:700, cursor: otpSending || (otpSent && otpResendTimer > 0) ? "default" : "pointer", marginBottom:12 }}>
                          {otpSending ? "Sending OTP..." : otpSent ? (otpResendTimer > 0 ? `Resend in ${otpResendTimer}s` : "Resend OTP") : "Send OTP →"}
                        </button>
                        {otpSent && (
                          <div style={{ animation:"zSlideUp .3s ease" }}>
                            <div style={{ fontSize:11, color:"#16a34a", marginBottom:10, fontWeight:600, fontFamily:"var(--mono)" }}>✅ OTP sent to +91 {mobileNumber}</div>
                            <div style={{ fontSize:10, color:"#f59e0b", marginBottom:10, fontFamily:"var(--mono)" }}>Demo mode: Check browser console for OTP</div>
                            <input value={otp} onChange={e => { setOtp(e.target.value.replace(/\D/g,"").slice(0,6)); setOtpError(""); }} placeholder="Enter OTP" maxLength={6} type="tel"
                              style={{ width:"100%", background: C.surf, border:`2px solid ${otpError ? C.red : C.accent}`, borderRadius:11, padding:"13px 14px", color: C.text, fontSize:24, textAlign:"center", letterSpacing:10, marginBottom:10, fontFamily:"var(--mono)" }} />
                            {otpError && <div style={{ fontSize:11, color: C.red, marginBottom:8, fontFamily:"var(--mono)" }}>⚠ {otpError}</div>}
                            <button onClick={verifyOtpCode} style={{ width:"100%", background: C.g, color:"#fff", border:"none", borderRadius:11, padding:"12px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Verify OTP ✓</button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ display:"flex", alignItems:"center", gap:10, background: dk ? "#0d1a0d" : "#f0fdf4", borderRadius:12, padding:"14px 16px", border:`1px solid #16a34a40` }}>
                        <div style={{ fontSize:24 }}>✅</div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:800, color:"#16a34a" }}>Mobile Verified!</div>
                          <div style={{ fontSize:11, color: C.sub, fontFamily:"var(--mono)" }}>+91 {mobileNumber} · COD enabled</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {payMode === "wallet" && (
                  <div style={{ background: C.card, borderRadius:18, border:`1px solid ${C.border}`, padding:"18px", marginBottom:14, animation:"zSlideUp .3s ease" }}>
                    <div style={{ fontSize:14, fontWeight:700, color: C.text, marginBottom:14 }}>👛 Choose Wallet</div>
                    {[
                      { key:"paytm", label:"Paytm Wallet", emoji:"💙", color:"#00baf2" },
                      { key:"amazon", label:"Amazon Pay", emoji:"🛒", color:"#ff9900" },
                      { key:"freecharge", label:"Freecharge", emoji:"⚡", color:"#f04" },
                      { key:"mobikwik", label:"MobiKwik", emoji:"🔵", color:"#1e8bc3" },
                    ].map(w => (
                      <div key={w.key} onClick={() => setWalletSelected(w.key)} className="z-pay-card"
                        style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:12, border:`1.5px solid ${walletSelected === w.key ? w.color : C.border}`, marginBottom:9, background: walletSelected === w.key ? w.color + "12" : C.surf }}>
                        <div style={{ fontSize:22 }}>{w.emoji}</div>
                        <div style={{ fontSize:13, fontWeight:600, color: C.text }}>{w.label}</div>
                        <div style={{ marginLeft:"auto", width:18, height:18, borderRadius:"50%", border:`2px solid ${walletSelected === w.key ? w.color : C.dim}`, background: walletSelected === w.key ? w.color : "none" }} />
                      </div>
                    ))}
                  </div>
                )}

                {payMode === "paylater" && (
                  <div style={{ background: C.card, borderRadius:18, border:`1px solid ${C.border}`, padding:"18px", marginBottom:14, animation:"zSlideUp .3s ease" }}>
                    <div style={{ fontSize:14, fontWeight:700, color: C.text, marginBottom:14 }}>📅 Pay Later / EMI</div>
                    {[
                      { key:"simpl", label:"Simpl", sub:"Pay in 3 easy parts", emoji:"💚" },
                      { key:"lazypay", label:"LazyPay", sub:"Pay after 15 days", emoji:"💜" },
                      { key:"zestmoney", label:"ZestMoney", sub:"No-cost EMI options", emoji:"🧡" },
                    ].map(p => (
                      <div key={p.key} onClick={() => setPayLaterSelected(p.key)} className="z-pay-card"
                        style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:12, border:`1.5px solid ${payLaterSelected === p.key ? C.accent : C.border}`, marginBottom:9, background: payLaterSelected === p.key ? C.accent + "12" : C.surf }}>
                        <div style={{ fontSize:22 }}>{p.emoji}</div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color: C.text }}>{p.label}</div>
                          <div style={{ fontSize:11, color: C.sub, fontFamily:"var(--mono)" }}>{p.sub}</div>
                        </div>
                        <div style={{ marginLeft:"auto", width:18, height:18, borderRadius:"50%", border:`2px solid ${payLaterSelected === p.key ? C.accent : C.dim}`, background: payLaterSelected === p.key ? C.accent : "none" }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="z-sidebar-col">
            <div className="z-sidebar-sticky">
              <div style={{ background: C.card, borderRadius:18, border:`1px solid ${C.border}`, overflow:"hidden", marginBottom:12 }}>
                <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.border}`, fontSize:13, fontWeight:800, color: C.text }}>🧾 Bill Summary</div>
                <div style={{ padding:"14px 18px" }}>
                  {[
                    { label:"Item Total", val:`₹${cartTotal}` },
                    { label: deliveryFee === 0 ? "Delivery Fee 🎉" : `Delivery Fee (${distanceKm} km)`, val: deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`, green: deliveryFee === 0 },
                    ...(discount > 0 ? [{ label:`Coupon (${appliedCoupon.code})`, val:`-₹${discount}`, green:true }] : []),
                    ...(tipAmount > 0 ? [{ label:"Delivery Tip 💝", val:`₹${tipAmount}` }] : []),
                    { label:"GST (included)", val:`₹${Math.round(finalTotal * 0.05)}`, muted:true },
                  ].map((r, i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:9, fontSize:13 }}>
                      <span style={{ color: r.muted ? C.dim : C.sub, fontWeight:600 }}>{r.label}</span>
                      <span style={{ fontWeight:800, color: r.green ? "#16a34a" : C.text, fontFamily:"var(--mono)" }}>{r.val}</span>
                    </div>
                  ))}
                  <div style={{ borderTop:`2px solid ${C.border}`, marginTop:8, paddingTop:10, display:"flex", justifyContent:"space-between", fontSize:16, fontWeight:900, color: C.text }}>
                    <span>Total</span>
                    <span style={{ fontFamily:"var(--mono)", color: C.accent }}>₹{finalTotal}</span>
                  </div>
                  {deliveryFee === 0 && <div style={{ fontSize:11, color:"#16a34a", fontWeight:700, marginTop:4, fontFamily:"var(--mono)" }}>🎉 Saved ₹{kmDeliveryFee} on delivery!</div>}
                </div>
              </div>

              <div style={{ background: C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:"10px 14px", marginBottom:12 }}>
                <div style={{ fontSize:10, fontWeight:700, color: C.sub, marginBottom:6 }}>🔒 SAFE & SECURE PAYMENTS</div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  {["🔐 256-bit SSL", "🛡 PCI DSS", "✅ RBI Approved", "🏦 100% Safe"].map(t => (
                    <span key={t} style={{ fontSize:10, color: C.dim, fontWeight:600, fontFamily:"var(--mono)" }}>{t}</span>
                  ))}
                </div>
              </div>

              {!paymentStep ? (
                <button onClick={() => setPaymentStep(true)} className="z-btn-main"
                  style={{ width:"100%", background: C.g, color:"#fff", border:"none", borderRadius:14, padding:"14px 18px", fontSize:14, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span>Proceed to Payment</span>
                  <span style={{ fontFamily:"var(--mono)" }}>₹{finalTotal} →</span>
                </button>
              ) : (
                <>
                  <button onClick={placeOrder} disabled={!canPay() || orderPlacing} className="z-btn-main"
                    style={{ width:"100%", background: canPay() ? C.g : C.dim, color:"#fff", border:"none", borderRadius:14, padding:"14px 18px", fontSize:14, fontWeight:800, cursor: canPay() ? "pointer" : "default", display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:8, opacity: canPay() ? 1 : .55 }}>
                    {orderPlacing
                      ? <><div style={{ width:18, height:18, border:"2px solid rgba(255,255,255,.4)", borderTopColor:"#fff", borderRadius:"50%", animation:"zSpin 1s linear infinite" }} /> Placing Order...</>
                      : <><span>Place Order</span><span style={{ fontFamily:"var(--mono)" }}>₹{finalTotal}</span></>
                    }
                  </button>
                  <button onClick={() => { setPaymentStep(false); setPayMode(null); setUpiPaid(false); setPaymentConfirmed(false); }}
                    style={{ width:"100%", background:"none", color: C.sub, border:`1.5px solid ${C.border}`, borderRadius:13, padding:"10px 18px", fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:8 }}>
                    ← Back to Cart
                  </button>
                  {!canPay() && payMode && (
                    <div style={{ marginTop:6, fontSize:11, color:"#f59e0b", textAlign:"center", fontWeight:600, fontFamily:"var(--mono)" }}>
                      {payMode === "cod" && !otpVerified && "Verify your mobile number to continue"}
                      {payMode === "upi" && !paymentConfirmed && "Complete UPI payment to proceed"}
                      {payMode === "upi_id" && !upiVerified && "Verify UPI ID first"}
                      {payMode === "upi_id" && upiVerified && !paymentConfirmed && "Complete payment to proceed"}
                      {payMode === "card" && "Fill all card details correctly"}
                      {payMode === "wallet" && !walletSelected && "Select a wallet to continue"}
                      {payMode === "paylater" && !payLaterSelected && "Select a Pay Later option"}
                    </div>
                  )}
                </>
              )}

              <div style={{ marginTop:12, padding:"10px 14px", background: dk ? "#0d1a0d" : "#f0fdf4", borderRadius:12, fontSize:11, color:"#16a34a", fontWeight:600, display:"flex", alignItems:"flex-start", gap:6 }}>
                <span>ℹ️</span> Placing an order means you agree to our Terms. Payments are fully secured.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}