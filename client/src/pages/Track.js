import {
  MapContainer, TileLayer, Marker, Polyline, Popup, useMap, Circle,
} from "react-leaflet";
import { useEffect, useState, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation, useNavigate } from "react-router-dom";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl:       require("leaflet/dist/images/marker-icon.png"),
  shadowUrl:     require("leaflet/dist/images/marker-shadow.png"),
});

const STORE = { lat: 30.9010, lng: 75.8573 };
const DRIVER_POOL = [
  { name: "Rahul Kumar",  phone: "+91 98765 43210", rating: "4.9", trips: "2.4k", bike: "DL-1C-2341",    avatar: "👨‍🦱", since: "2022", vehicle: "Bajaj Pulsar" },
  { name: "Amit Singh",   phone: "+91 87654 32109", rating: "4.8", trips: "1.9k", bike: "UP-32-KL-4512", avatar: "👨",   since: "2021", vehicle: "Honda Activa" },
  { name: "Deepak Verma", phone: "+91 76543 21098", rating: "4.7", trips: "3.1k", bike: "HR-26-AB-9870", avatar: "👨‍🦳", since: "2020", vehicle: "TVS Jupiter" },
];
const STEPS = [
  { key: "confirmed", label: "Order Confirmed",  icon: "✓",  desc: "Your order has been received & confirmed" },
  { key: "packed",    label: "Packed & Ready",   icon: "📦", desc: "Items packed & quality checked by store" },
  { key: "picked",    label: "Driver Picked Up", icon: "🛵", desc: "Driver collected your order from store" },
  { key: "enroute",   label: "Out for Delivery", icon: "📍", desc: "Driver is heading to your location" },
  { key: "otp",       label: "OTP Verification", icon: "🔐", desc: "Verify to confirm your delivery" },
  { key: "delivered", label: "Delivered! 🎉",    icon: "🎉", desc: "Order delivered. Enjoy your meal!" },
];
const FOOD_EMOJIS = { milk:"🥛",bread:"🍞",egg:"🥚",chip:"🍟",drink:"🥤",biscuit:"🍪",yogurt:"🫙",water:"💧",nut:"🥜",paneer:"🧀",energy:"⚡",maggi:"🍜",oats:"🌾",rice:"🍚",dal:"🫘",oil:"🫙",sugar:"🍬",ghee:"🧈",tea:"🍵",coffee:"☕",noodle:"🍜",chocolate:"🍫",juice:"🧃",butter:"🧈",cheese:"🧀" };
const CHAT_QUICK = ["I'm downstairs 👇", "Please call before arriving 📞", "Leave at door 🚪", "Add extra time, I'll be there ⏳", "Ring the bell 🔔", "Gate code: 1234 🔑"];
const CANNED_DRIVER_MSGS = [
  "Hello! I've picked up your order, heading to you now 🛵",
  "On my way! Will reach in a few minutes 🚀",
  "Stuck at a signal, slight delay. Really sorry! 🙏",
  "Almost there, just 2 mins away! ⚡",
  "I've reached your area, coming to your door 📍",
];

function getEmoji(name = "") {
  const n = name.toLowerCase();
  for (const [k, v] of Object.entries(FOOD_EMOJIS)) if (n.includes(k)) return v;
  return "🛍️";
}

function lerp(a, b, t) { return a + (b - a) * t; }

function interpolateLatLng(from, to, t) {
  return [lerp(from[0], to[0], t), lerp(from[1], to[1], t)];
}

function haversine([lat1, lon1], [lat2, lon2]) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function getBearing([lat1, lon1], [lat2, lon2]) {
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1*Math.PI/180)*Math.sin(lat2*Math.PI/180) - Math.sin(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.cos(dLon);
  return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
}

function lerpAngle(a, b, t) {
  let diff = b - a;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return a + diff * t;
}

const makeDriverIcon = (bearing = 0) => new L.DivIcon({
  className: "",
  iconSize: [56, 56],
  iconAnchor: [28, 28],
  html: `<div style="width:56px;height:56px;position:relative;">
    <div style="position:absolute;inset:0;background:radial-gradient(circle,#00e5ff 30%,transparent 70%);border-radius:50%;opacity:.15;animation:dRipple 2s ease-in-out infinite;"></div>
    <div style="position:absolute;inset:4px;background:radial-gradient(circle,#00e5ff 30%,transparent 70%);border-radius:50%;opacity:.08;animation:dRipple 2s ease-in-out infinite .5s;"></div>
    <div style="position:absolute;inset:10px;background:linear-gradient(135deg,#0d1117,#1a2740);border:2px solid #00e5ff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 0 16px #00e5ff60,0 2px 8px rgba(0,0,0,.6);">
      <span style="display:block;transform:rotate(${bearing}deg);transition:transform 0.3s ease;">🛵</span>
    </div>
  </div>
  <style>
    @keyframes dRipple{0%{transform:scale(1);opacity:.15}50%{transform:scale(1.5);opacity:.05}100%{transform:scale(1);opacity:.15}}
  </style>`,
});

const storeIcon = new L.DivIcon({
  className: "",
  iconSize: [48, 56],
  iconAnchor: [24, 56],
  html: `<div style="position:relative;width:48px;">
    <div style="width:48px;height:48px;background:linear-gradient(135deg,#0a0f1a,#1a2535);border:2px solid #00e5ff;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 0 20px #00e5ff40,0 4px 16px rgba(0,0,0,.6);">🏪</div>
    <div style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid #00e5ff;"></div>
  </div>`,
});

const destIcon = new L.DivIcon({
  className: "",
  iconSize: [44, 54],
  iconAnchor: [22, 54],
  html: `<div style="width:44px;height:54px;position:relative;">
    <div style="width:44px;height:44px;background:linear-gradient(135deg,#dc2626,#ef4444);border:2.5px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(220,38,38,.6),0 0 32px rgba(220,38,38,.2);">
      <span style="transform:rotate(45deg);font-size:20px;">🏠</span>
    </div>
    <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:10px;height:10px;background:#dc2626;border-radius:50%;box-shadow:0 0 14px #dc262690;"></div>
  </div>`,
});

function SmoothMapController({ targetPos, trackDriver, zoom }) {
  const map = useMap();
  const animRef = useRef(null);
  const currentCenter = useRef(null);

  useEffect(() => {
    if (!trackDriver || !targetPos) return;
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const start = currentCenter.current || targetPos;
    const end = targetPos;
    const duration = 800;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const lat = lerp(start[0], end[0], ease);
      const lng = lerp(start[1], end[1], ease);
      map.setView([lat, lng], zoom || map.getZoom(), { animate: false });
      if (t < 1) animRef.current = requestAnimationFrame(animate);
      else currentCenter.current = end;
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [targetPos?.[0], targetPos?.[1], trackDriver]);

  return null;
}

function MapFitter({ positions }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (!fitted.current && positions.length > 1) {
      try {
        map.fitBounds(L.latLngBounds(positions), { padding: [70, 70], animate: true, duration: 1 });
        fitted.current = true;
      } catch {}
    }
  }, [positions.length]);
  return null;
}

async function callClaudeAPI(messages) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are a friendly delivery driver named {DRIVER_NAME} working for Zappit, a quick commerce delivery app in India. You are currently delivering an order. 
      Keep responses very short (1-2 sentences max), conversational, and helpful. Use casual Indian English, occasionally add emojis. 
      You can answer questions about: delivery status, ETA, your location (you're en route), order details.
      Never reveal you're an AI. Speak as if you're the actual driver on the road.`,
      messages,
    }),
  });
  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  return data.content?.[0]?.text || "Sorry, can't reply right now 🛵";
}

export default function Track() {
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = location.state?.cartItems || [];
  const orderId   = location.state?.orderId   || "ZP" + Math.floor(Math.random() * 900000 + 100000);
  const totalAmt  = location.state?.total     || cartItems.reduce((s, i) => s + i.price * (i.qty || 1), 0);

  const [route,           setRoute]          = useState([]);
  const [traveledRoute,   setTraveledRoute]  = useState([]);
  const [driverPos,       setDriverPos]      = useState(null);
  const [driverBearing,   setDriverBearing]  = useState(0);
  const [driver]                             = useState(DRIVER_POOL[Math.floor(Math.random() * DRIVER_POOL.length)]);
  const [step,            setStep]           = useState(0);
  const [loading,         setLoading]        = useState(true);
  const [loadStep,        setLoadStep]       = useState("Locating your GPS...");
  const [loadPct,         setLoadPct]        = useState(0);
  const [progress,        setProgress]       = useState(0);
  const [elapsed,         setElapsed]        = useState(0);
  const [itemStatus,      setItemStatus]     = useState({});
  const [userLoc,         setUserLoc]        = useState({ lat: 30.9121, lng: 75.8650 });
  const [locLoading,      setLocLoading]     = useState(true);
  const [routeError,      setRouteError]     = useState(false);
  const [otp]                                = useState(String(Math.floor(1000 + Math.random() * 9000)));
  const [enteredOtp,      setEnteredOtp]     = useState("");
  const [otpVerified,     setOtpVerified]    = useState(false);
  const [showOtpBox,      setShowOtpBox]     = useState(false);
  const [otpError,        setOtpError]       = useState("");
  const [showCallModal,   setShowCallModal]  = useState(false);
  const [showRateModal,   setShowRateModal]  = useState(false);
  const [rating,          setRating]         = useState(0);
  const [ratingDone,      setRatingDone]     = useState(false);
  const [activeTab,       setActiveTab]      = useState("status");
  const [mapStyle,        setMapStyle]       = useState("dark");
  const [trackDriver,     setTrackDriver]    = useState(true);
  const [chatMsgs,        setChatMsgs]       = useState([{ from: "driver", text: "Hello! I've picked up your order and I'm heading to you right now 🛵", time: new Date() }]);
  const [chatInput,       setChatInput]      = useState("");
  const [chatLoading,     setChatLoading]    = useState(false);
  const [speedKmh,        setSpeedKmh]       = useState(0);
  const [distanceLeft,    setDistanceLeft]   = useState(null);
  const [totalRouteDist,  setTotalRouteDist] = useState(null);
  const [copied,          setCopied]         = useState(false);
  const [weather,         setWeather]        = useState({ temp: "32°C", desc: "Partly Cloudy", icon: "⛅" });
  const [notification,    setNotification]   = useState(null);
  const [mapZoom,         setMapZoom]        = useState(15);
  const [showStats,       setShowStats]      = useState(false);
  const [tripStats,       setTripStats]      = useState({ maxSpeed: 0, avgSpeed: 0, speedReadings: [] });
  const [driverTrail,     setDriverTrail]    = useState([]);

  const elapsedRef      = useRef(null);
  const pctRef          = useRef(null);
  const animFrameRef    = useRef(null);
  const segmentRef      = useRef({ fromIdx: 0, toIdx: 1, progress: 0 });
  const speedPerSegRef  = useRef(0.004);
  const chatEndRef      = useRef(null);
  const driverMsgIdx    = useRef(0);
  const roadRef         = useRef([]);
  const chatHistoryRef  = useRef([]);
  const lastSpeedRef    = useRef(0);

  const MAP_TILES = {
    dark:      { url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",      attr: "© CartoDB" },
    light:     { url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",     attr: "© CartoDB" },
    satellite: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attr: "© Esri" },
    osm:       { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",                 attr: "© OpenStreetMap" },
  };

  const pushNotif = useCallback((msg, type = "info") => {
    setNotification({ msg, type, id: Date.now() });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  useEffect(() => {
    elapsedRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(elapsedRef.current);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs]);

  useEffect(() => {
    const loadSteps = [
      "Locating your GPS...",
      "Connecting to map servers...",
      "Fetching live road route...",
      "Assigning nearest driver...",
      "Starting live tracking...",
    ];
    let i = 0;
    pctRef.current = setInterval(() => {
      i++;
      setLoadPct(Math.min(90, i * 18));
      if (i < loadSteps.length) setLoadStep(loadSteps[i]);
    }, 600);

    const fallbackLoc = { lat: 30.9121, lng: 75.8650 };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          setUserLoc({ lat, lng });
          setLocLoading(false);
          initTracking({ lat, lng });
        },
        () => {
          setLocLoading(false);
          initTracking(fallbackLoc);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      setLocLoading(false);
      initTracking(fallbackLoc);
    }

    return () => clearInterval(pctRef.current);
  }, []);

  const initTracking = async (dest) => {
    const statusMap = {};
    cartItems.forEach((_, i) => { statusMap[i] = "pending"; });
    setItemStatus(statusMap);

    await new Promise(r => setTimeout(r, 700));
    setStep(1);
    pushNotif("📦 Order confirmed and being packed!", "success");
    await new Promise(r => setTimeout(r, 1000));
    setStep(2);
    pushNotif("🛵 Driver assigned and picking up your order", "info");

    const road = await getRoadRoute(STORE, dest);
    roadRef.current = road;
    setRoute(road);
    setDriverPos({ lat: STORE.lat, lng: STORE.lng });

    if (road.length > 1) {
      let dist = 0;
      for (let k = 0; k < road.length - 1; k++) dist += haversine(road[k], road[k+1]);
      setTotalRouteDist(dist);
      setDistanceLeft(dist);
    }

    clearInterval(pctRef.current);
    setLoadPct(100);
    setTimeout(() => setLoading(false), 500);

    await new Promise(r => setTimeout(r, 500));
    setStep(3);
    pushNotif("🛵 Driver is on his way to you!", "success");
    startSmoothDriver(road, dest);
  };

  const getRoadRoute = async (from, to) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson&steps=false`;
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      const data = await res.json();
      if (data.routes?.[0]?.geometry?.coordinates) {
        return data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
      }
    } catch {}
    setRouteError(true);
    return buildFallbackRoute(from, to);
  };

  const buildFallbackRoute = (from, to) => {
    const pts = [];
    const n = 60;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const jitter = (Math.random() - 0.5) * 0.0015;
      pts.push([
        from.lat + (to.lat - from.lat) * t + jitter * Math.sin(t * Math.PI * 2),
        from.lng + (to.lng - from.lng) * t + jitter * Math.cos(t * Math.PI * 2),
      ]);
    }
    return pts;
  };

  const startSmoothDriver = (road, dest) => {
    if (road.length < 2) return;
    const cartLen = Math.max(cartItems.length, 1);
    let fromIdx = 0;
    let segProgress = 0;
    let lastTimestamp = null;
    let currentBearing = 0;
    let trailBuffer = [road[0]];
    const SPEED = 0.0032;

    const milestones = new Set();
    const notifThresholds = [
      { pct: 25, msg: "🛵 Driver is 75% away", type: "info" },
      { pct: 50, msg: "📍 Driver is halfway there!", type: "info" },
      { pct: 75, msg: "⚡ Almost there, 2 mins away!", type: "warn" },
    ];

    const tick = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      segProgress += SPEED * delta * 60;

      while (segProgress >= 1 && fromIdx < road.length - 2) {
        segProgress -= 1;
        fromIdx++;
        trailBuffer.push(road[fromIdx]);
        if (trailBuffer.length > 80) trailBuffer = trailBuffer.slice(-80);
      }

      if (fromIdx >= road.length - 2) {
        const lastPt = road[road.length - 1];
        setDriverPos({ lat: lastPt[0], lng: lastPt[1] });
        setTraveledRoute([...road]);
        setProgress(100);
        setDistanceLeft(0);
        setSpeedKmh(0);
        setStep(4);
        setShowOtpBox(true);
        pushNotif("📍 Driver has arrived! Please verify your OTP.", "warn");
        return;
      }

      const from = road[fromIdx];
      const to   = road[fromIdx + 1];
      const t    = Math.max(0, Math.min(1, segProgress));
      const [lat, lng] = interpolateLatLng(from, to, t);

      const targetBearing = getBearing(from, to);
      currentBearing = lerpAngle(currentBearing, targetBearing, 0.12);

      setDriverPos({ lat, lng });
      setDriverBearing(Math.round(currentBearing));
      setTraveledRoute(prev => {
        const updated = [...trailBuffer, [lat, lng]];
        return updated;
      });

      const pct = Math.round(((fromIdx + t) / (road.length - 1)) * 100);
      setProgress(pct);

      const distM = haversine(from, [lat, lng]);
      const kmh   = Math.round(Math.min(55, (distM / delta) * 3.6 * SPEED * 60));
      const smoothKmh = Math.round(lastSpeedRef.current * 0.85 + kmh * 0.15);
      lastSpeedRef.current = smoothKmh;
      setSpeedKmh(smoothKmh);

      setTripStats(prev => {
        const readings = [...prev.speedReadings, smoothKmh].slice(-30);
        const avg = Math.round(readings.reduce((s, v) => s + v, 0) / readings.length);
        return { maxSpeed: Math.max(prev.maxSpeed, smoothKmh), avgSpeed: avg, speedReadings: readings };
      });

      if (roadRef.current.length > 0) {
        let remaining = 0;
        const fullIdx = Math.round(fromIdx + t);
        for (let k = fullIdx; k < road.length - 1; k++) remaining += haversine(road[k], road[k+1]);
        setDistanceLeft(remaining);
      }

      cartItems.forEach((_, i) => {
        const threshold = Math.round(((i + 1) / cartLen) * 70);
        if (pct >= threshold) {
          setItemStatus(prev => prev[i] === "pending" ? { ...prev, [i]: "enroute" } : prev);
        }
      });

      notifThresholds.forEach(({ pct: threshold, msg, type }) => {
        if (!milestones.has(threshold) && pct >= threshold && pct < threshold + 5) {
          milestones.add(threshold);
          pushNotif(msg, type);
          if (driverMsgIdx.current < CANNED_DRIVER_MSGS.length) {
            const txt = CANNED_DRIVER_MSGS[driverMsgIdx.current++];
            setChatMsgs(prev => [...prev, { from: "driver", text: txt, time: new Date() }]);
          }
        }
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      clearInterval(elapsedRef.current);
    };
  }, []);

  const verifyOtp = () => {
    if (enteredOtp === otp) {
      setOtpVerified(true);
      setOtpError("");
      setStep(5);
      setShowOtpBox(false);
      cartItems.forEach((_, i) => setItemStatus(prev => ({ ...prev, [i]: "delivered" })));
      pushNotif("🎉 Order delivered successfully! Enjoy!", "success");
      setTimeout(() => setShowRateModal(true), 1500);
    } else {
      setOtpError("Incorrect OTP. Please check again.");
    }
  };

  const sendChat = async (quickText) => {
    const msg = quickText || chatInput.trim();
    if (!msg || chatLoading) return;
    const userMsg = { from: "user", text: msg, time: new Date() };
    setChatMsgs(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    chatHistoryRef.current = [
      ...chatHistoryRef.current,
      { role: "user", content: msg },
    ].slice(-12);

    try {
      const systemWithDriver = `You are a friendly delivery driver named ${driver.name} working for Zappit, a quick commerce delivery app in India. You are currently delivering an order on your ${driver.vehicle} (${driver.bike}). Current delivery progress: ${progress}%. Keep responses very short (1-2 sentences max), warm, and helpful. Use casual Indian English with occasional emojis. Never reveal you're an AI.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 150,
          system: systemWithDriver,
          messages: chatHistoryRef.current,
        }),
      });

      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Got it! On my way 🛵";

      chatHistoryRef.current = [
        ...chatHistoryRef.current,
        { role: "assistant", content: reply },
      ].slice(-12);

      setChatMsgs(prev => [...prev, { from: "driver", text: reply, time: new Date() }]);
    } catch {
      const fallbacks = ["Sure! On my way 🛵", "Got it, no problem! 👍", "Okay understood! 🙏", "Will do! Almost there ⚡"];
      setChatMsgs(prev => [...prev, { from: "driver", text: fallbacks[Math.floor(Math.random() * fallbacks.length)], time: new Date() }]);
    } finally {
      setChatLoading(false);
    }
  };

  const copyTracking = () => {
    navigator.clipboard.writeText(`Track my Zappit order ${orderId}: https://zappstore.in/track/${orderId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const etaSeconds = distanceLeft !== null && speedKmh > 0
    ? Math.round((distanceLeft / (speedKmh / 3.6)))
    : Math.max(0, 360 - elapsed);
  const etaMin = Math.floor(etaSeconds / 60);
  const etaSec = etaSeconds % 60;

  const distLeftStr = distanceLeft !== null
    ? distanceLeft > 1000
      ? (distanceLeft / 1000).toFixed(1) + " km"
      : Math.round(distanceLeft) + " m"
    : "—";

  const driverIcon = makeDriverIcon(driverBearing);
  const tile = MAP_TILES[mapStyle];
  const smoothDriverPos = driverPos ? [driverPos.lat, driverPos.lng] : null;

  const allPos = [
    [STORE.lat, STORE.lng],
    ...(driverPos ? [[driverPos.lat, driverPos.lng]] : []),
    [userLoc.lat, userLoc.lng],
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:#060a0f;--surf:#0b1018;--card:#0f1822;--card2:#131e2c;--border:#1c2d42;--bhi:#1e3448;
      --text:#ddeeff;--sub:#6b8fab;--dim:#1a2d3e;--accent:#00e5ff;--accentd:#00b5cc;
      --green:#2eff7a;--orange:#ff9f1c;--red:#ff3860;--warn:#ffdd57;--purple:#9b59f5;
      --mono:'JetBrains Mono',monospace;--display:'Outfit',sans-serif;--r:12px;
    }
    body{background:var(--bg);color:var(--text);font-family:var(--display);}
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideL{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideR{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.95)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes glow{0%,100%{opacity:.8;text-shadow:0 0 10px #00e5ff60}50%{opacity:1;text-shadow:0 0 24px #00e5ffaa,0 0 48px #00e5ff30}}
    @keyframes notifIn{from{transform:translateX(calc(100% + 20px));opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes shimmer{0%{background-position:-300px 0}100%{background-position:300px 0}}
    @keyframes progressShine{0%{left:-100%}100%{left:200%}}
    @keyframes dotBounce{0%,80%,100%{transform:scale(0);opacity:.3}40%{transform:scale(1);opacity:1}}
    .track-root{display:flex;height:100vh;overflow:hidden;background:var(--bg);}
    .sidebar{width:370px;flex-shrink:0;background:var(--surf);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden;z-index:10;}
    .map-panel{flex:1;position:relative;overflow:hidden;}
    .map-panel .leaflet-container{width:100%;height:100%;}
    .leaflet-container{background:#040709!important;}
    .sb-body{flex:1;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--border) transparent;}
    .sb-body::-webkit-scrollbar{width:4px;}
    .sb-body::-webkit-scrollbar-track{background:transparent;}
    .sb-body::-webkit-scrollbar-thumb{background:var(--bhi);border-radius:2px;}
    .tab-btn{flex:1;padding:10px 4px;font-size:10px;font-family:var(--mono);letter-spacing:.8px;border:none;background:none;cursor:pointer;color:var(--sub);border-bottom:2px solid transparent;transition:all .2s;text-transform:uppercase;font-weight:500;}
    .tab-btn.active{color:var(--accent);border-bottom-color:var(--accent);background:rgba(0,229,255,.04);}
    .tab-btn:hover:not(.active){color:var(--text);background:rgba(255,255,255,.03);}
    .map-btn{background:rgba(11,16,24,.92);backdrop-filter:blur(16px);border:1px solid var(--border);color:var(--text);border-radius:10px;padding:8px 14px;font-size:11px;font-family:var(--mono);cursor:pointer;transition:all .18s;display:flex;align-items:center;gap:7px;white-space:nowrap;}
    .map-btn:hover{border-color:var(--accent);color:var(--accent);background:rgba(0,229,255,.06);}
    .map-btn.active{border-color:var(--accent);background:rgba(0,229,255,.1);color:var(--accent);}
    .stat-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;transition:border-color .2s;}
    .stat-card:hover{border-color:var(--bhi);}
    .chat-bubble-user{background:linear-gradient(135deg,var(--accent),var(--accentd));color:#000;border-radius:16px 16px 4px 16px;padding:10px 14px;font-size:13px;max-width:220px;margin-left:auto;word-break:break-word;font-weight:500;line-height:1.45;}
    .chat-bubble-driver{background:var(--card2);border:1px solid var(--border);color:var(--text);border-radius:16px 16px 16px 4px;padding:10px 14px;font-size:13px;max-width:220px;word-break:break-word;line-height:1.45;}
    .notif-toast{position:fixed;top:18px;right:18px;z-index:9999;animation:notifIn .4s cubic-bezier(.34,1.56,.64,1) both;}
    .step-line{position:absolute;left:13px;top:28px;width:2px;height:calc(100% + 2px);z-index:0;transition:background .6s;}
    .typing-dot{width:7px;height:7px;background:var(--sub);border-radius:50%;display:inline-block;animation:dotBounce 1.2s infinite ease-in-out;}
    input:focus{outline:none;border-color:var(--accent)!important;box-shadow:0 0 0 3px rgba(0,229,255,.1);}
    .progress-bar-track{height:6px;background:var(--dim);border-radius:4px;overflow:hidden;position:relative;}
    .progress-bar-fill{height:100%;background:linear-gradient(90deg,var(--accentd),var(--accent),var(--green));border-radius:4px;transition:width .6s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden;}
    .progress-bar-fill::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);animation:progressShine 2.5s infinite;}
    @media(max-width:820px){
      .track-root{flex-direction:column}
      .sidebar{width:100%;height:52vh;min-height:260px}
      .map-panel{flex:1;min-height:220px}
    }
  `;

  return (
    <>
      <style>{css}</style>

      {notification && (
        <div className="notif-toast">
          <div style={{
            background: notification.type === "success" ? "rgba(46,255,122,.1)" : notification.type === "warn" ? "rgba(255,221,87,.1)" : "rgba(0,229,255,.09)",
            border: `1px solid ${notification.type === "success" ? "rgba(46,255,122,.5)" : notification.type === "warn" ? "rgba(255,221,87,.5)" : "rgba(0,229,255,.4)"}`,
            borderRadius: 14, padding: "12px 20px", display: "flex", alignItems: "center", gap: 11,
            backdropFilter: "blur(20px)", fontSize: 13, color: "var(--text)", fontWeight: 500,
            boxShadow: "0 12px 40px rgba(0,0,0,.6)", maxWidth: 340,
          }}>
            <span style={{ fontSize: 17 }}>{notification.type === "success" ? "✅" : notification.type === "warn" ? "⚠️" : "ℹ️"}</span>
            {notification.msg}
          </div>
        </div>
      )}

      <div className="track-root">

        {loading && (
          <div style={{ position: "absolute", inset: 0, background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 9000, gap: 24 }}>
            <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--accent)", letterSpacing: 5, fontWeight: 600, animation: "glow 2s infinite", textTransform: "uppercase" }}>⚡ Zappit Live Track</div>
            <div style={{ position: "relative", width: 64, height: 64 }}>
              <div style={{ position: "absolute", inset: 0, border: "2px solid var(--dim)", borderRadius: "50%" }} />
              <div style={{ position: "absolute", inset: 0, border: "2.5px solid transparent", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
              <div style={{ position: "absolute", inset: 8, background: "var(--card)", borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🛵</div>
            </div>
            <div style={{ fontSize: 13, color: "var(--sub)", fontFamily: "var(--mono)", letterSpacing: .5 }}>{loadStep}</div>
            <div style={{ width: 220, height: 3, background: "var(--dim)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${loadPct}%`, background: "linear-gradient(90deg,var(--accentd),var(--accent))", borderRadius: 3, transition: "width .4s ease", boxShadow: "0 0 10px var(--accent)" }} />
            </div>
          </div>
        )}

        {showCallModal && (
          <div onClick={() => setShowCallModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 8000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)", animation: "fadeIn .2s ease" }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: "28px 32px", minWidth: 280, boxShadow: "0 32px 80px rgba(0,0,0,.8)", animation: "fadeUp .25s ease" }}>
              <div style={{ width: 64, height: 64, background: "rgba(46,255,122,.1)", border: "2px solid rgba(46,255,122,.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 16px" }}>📞</div>
              <div style={{ textAlign: "center", marginBottom: 8, fontSize: 17, fontWeight: 700 }}>{driver.name}</div>
              <div style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: "var(--accent)", fontFamily: "var(--mono)", marginBottom: 6 }}>{driver.phone}</div>
              <div style={{ textAlign: "center", fontSize: 11, color: "var(--sub)", marginBottom: 22 }}>{driver.vehicle} · {driver.bike}</div>
              <div style={{ display: "flex", gap: 10 }}>
                <a href={`tel:${driver.phone.replace(/\s/g, "")}`} style={{ flex: 1, background: "linear-gradient(135deg,var(--green),#22c55e)", color: "#000", border: "none", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer", textDecoration: "none", textAlign: "center" }}>📞 Call Now</a>
                <button onClick={() => setShowCallModal(false)} style={{ flex: 1, background: "var(--surf)", border: "1px solid var(--border)", color: "var(--sub)", borderRadius: 12, padding: "12px", fontSize: 14, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showRateModal && !ratingDone && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 8000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", animation: "fadeIn .25s ease" }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 22, padding: "32px", maxWidth: 320, width: "90%", boxShadow: "0 32px 80px rgba(0,0,0,.8)", animation: "fadeUp .3s ease", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Order Delivered!</div>
              <div style={{ fontSize: 13, color: "var(--sub)", marginBottom: 24 }}>How was your delivery experience?</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 22 }}>
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setRating(s)} style={{ fontSize: 30, background: "none", border: "none", cursor: "pointer", filter: s <= rating ? "none" : "grayscale(1) opacity(.35)", transition: "all .15s", transform: s <= rating ? "scale(1.1)" : "scale(1)" }}>⭐</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { setRatingDone(true); pushNotif("⭐ Thanks for rating! See you next time.", "success"); }} style={{ flex: 1, background: "linear-gradient(135deg,var(--accent),var(--accentd))", color: "#000", border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Submit Rating</button>
                <button onClick={() => setRatingDone(true)} style={{ background: "var(--surf)", border: "1px solid var(--border)", color: "var(--sub)", borderRadius: 12, padding: "13px 16px", fontSize: 14, cursor: "pointer" }}>Skip</button>
              </div>
            </div>
          </div>
        )}

        <div className="sidebar">
          <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid var(--border)", flexShrink: 0, background: "linear-gradient(180deg,rgba(0,229,255,.04) 0%,transparent 100%)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: "var(--sub)", fontFamily: "var(--mono)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Live Tracking</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", letterSpacing: -.3 }}>Order #{orderId}</div>
              </div>
              <div style={{ display: "flex", gap: 7 }}>
                <button onClick={copyTracking} title="Share tracking link" style={{ background: copied ? "rgba(46,255,122,.1)" : "var(--card)", border: `1px solid ${copied ? "rgba(46,255,122,.4)" : "var(--border)"}`, color: copied ? "var(--green)" : "var(--sub)", borderRadius: 9, padding: "7px 10px", fontSize: 13, cursor: "pointer", transition: "all .2s" }}>
                  {copied ? "✓" : "🔗"}
                </button>
                <button onClick={() => navigate(-1)} style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--sub)", borderRadius: 9, padding: "7px 10px", fontSize: 13, cursor: "pointer" }}>✕</button>
              </div>
            </div>

            <div style={{ background: "var(--card2)", border: "1px solid var(--bhi)", borderRadius: 14, padding: "12px 14px", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 46, height: 46, background: "linear-gradient(135deg,var(--accentd),var(--accent))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, color: "#000" }}>{driver.avatar}</div>
                  <div style={{ position: "absolute", bottom: 1, right: 1, width: 12, height: 12, background: "var(--green)", border: "2px solid var(--card2)", borderRadius: "50%" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{driver.name}</div>
                  <div style={{ fontSize: 10, color: "var(--sub)", marginTop: 2, fontFamily: "var(--mono)" }}>
                    <span style={{ color: "#fbbf24" }}>{"★".repeat(Math.floor(+driver.rating))}</span> {driver.rating} · {driver.vehicle}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--dim)", marginTop: 2, fontFamily: "var(--mono)" }}>{driver.bike} · {driver.trips} trips · Since {driver.since}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setShowCallModal(true)} style={{ background: "rgba(46,255,122,.08)", border: "1px solid rgba(46,255,122,.25)", color: "var(--green)", borderRadius: 9, padding: "8px 11px", fontSize: 14, cursor: "pointer", transition: "all .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(46,255,122,.16)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(46,255,122,.08)"}>📞</button>
                  <button onClick={() => setActiveTab("chat")} style={{ background: "rgba(0,229,255,.06)", border: "1px solid rgba(0,229,255,.2)", color: "var(--accent)", borderRadius: 9, padding: "8px 11px", fontSize: 14, cursor: "pointer", transition: "all .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(0,229,255,.14)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(0,229,255,.06)"}>💬</button>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
              {[
                { icon: "🕐", val: `${String(Math.floor(elapsed/60)).padStart(2,"0")}:${String(elapsed%60).padStart(2,"0")}`, label: "elapsed" },
                { icon: "⚡", val: `${speedKmh}`, label: "km/h" },
                { icon: "📍", val: distLeftStr, label: "left" },
                { icon: "⏱", val: etaMin > 0 ? `${etaMin}m` : `${etaSec}s`, label: "ETA" },
              ].map(c => (
                <div key={c.label} className="stat-card" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, marginBottom: 2 }}>{c.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--mono)" }}>{c.val}</div>
                  <div style={{ fontSize: 9, color: "var(--dim)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: .5 }}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            {["status", "items", "chat", "info"].map(tab => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                {tab === "status" ? "📍 Status" : tab === "items" ? "📦 Items" : tab === "chat" ? "💬 Chat" : "ℹ Info"}
              </button>
            ))}
          </div>

          <div className="sb-body">

            {activeTab === "status" && (
              <div style={{ padding: "16px 18px 0", animation: "slideL .25s ease" }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: "var(--sub)", fontFamily: "var(--mono)", letterSpacing: 1, textTransform: "uppercase" }}>Route Progress</span>
                    <span style={{ fontSize: 10, color: "var(--accent)", fontFamily: "var(--mono)", fontWeight: 700 }}>{progress}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--sub)", fontFamily: "var(--mono)", marginTop: 5 }}>
                    <span>🏪 Store</span>
                    {totalRouteDist && <span>{(totalRouteDist/1000).toFixed(1)} km total</span>}
                    <span>🏠 You</span>
                  </div>
                </div>

                <div style={{ fontSize: 9, color: "var(--sub)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, fontFamily: "var(--mono)" }}>Delivery Timeline</div>
                {STEPS.map((s, i) => {
                  const done   = i < step;
                  const active = i === step;
                  const last   = i === STEPS.length - 1;
                  return (
                    <div key={s.key} style={{ display: "flex", alignItems: "flex-start", gap: 13, position: "relative" }}>
                      {!last && (
                        <div className="step-line" style={{ background: done ? "linear-gradient(to bottom,var(--accent),rgba(0,229,255,.3))" : "var(--dim)" }} />
                      )}
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, zIndex: 1, transition: "all .4s",
                        border: `2px solid ${done || active ? "var(--accent)" : "var(--dim)"}`,
                        background: done ? "linear-gradient(135deg,var(--accent),var(--accentd))" : active ? "rgba(0,229,255,.1)" : "var(--surf)",
                        color: done ? "#000" : active ? "var(--accent)" : "var(--sub)",
                        animation: active ? "pulse 1.6s infinite" : "none",
                        boxShadow: active ? "0 0 14px rgba(0,229,255,.4)" : done ? "0 0 8px rgba(0,229,255,.2)" : "none",
                      }}>
                        {done ? "✓" : s.icon}
                      </div>
                      <div style={{ padding: "3px 0 20px", flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: !done && !active ? "var(--sub)" : "var(--text)", transition: "color .4s" }}>{s.label}</div>
                        {(done || active) && <div style={{ fontSize: 11, color: "var(--sub)", marginTop: 2, lineHeight: 1.45 }}>{s.desc}</div>}
                      </div>
                      {active && <div style={{ fontSize: 9, color: "var(--accent)", fontFamily: "var(--mono)", marginTop: 6, animation: "pulse 1.4s infinite", letterSpacing: 1, fontWeight: 600 }}>LIVE</div>}
                    </div>
                  );
                })}

                {showOtpBox && !otpVerified && (
                  <div style={{ background: "rgba(255,221,87,.06)", border: "1px solid rgba(255,221,87,.3)", borderRadius: 14, padding: "16px", marginBottom: 16, animation: "fadeUp .3s ease" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--warn)", marginBottom: 4 }}>🔐 OTP Verification Required</div>
                    <div style={{ fontSize: 11, color: "var(--sub)", marginBottom: 12 }}>Share this OTP with your driver to confirm delivery</div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: "var(--warn)", textAlign: "center", fontFamily: "var(--mono)", letterSpacing: 8, marginBottom: 14, textShadow: "0 0 24px rgba(255,221,87,.5)" }}>{otp}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input value={enteredOtp} onChange={e => setEnteredOtp(e.target.value)} placeholder="Enter OTP" maxLength={4}
                        onKeyDown={e => e.key === "Enter" && verifyOtp()}
                        style={{ flex: 1, background: "var(--surf)", border: `1px solid ${otpError ? "var(--red)" : "var(--border)"}`, borderRadius: 10, padding: "10px 14px", color: "var(--text)", fontSize: 18, fontFamily: "var(--mono)", letterSpacing: 4, textAlign: "center", transition: "border-color .2s" }} />
                      <button onClick={verifyOtp} style={{ background: "linear-gradient(135deg,var(--warn),#e6b800)", color: "#000", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>VERIFY</button>
                    </div>
                    {otpError && <div style={{ fontSize: 11, color: "var(--red)", marginTop: 7 }}>{otpError}</div>}
                  </div>
                )}

                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px", marginBottom: 6 }}>
                  <div style={{ fontSize: 10, color: "var(--sub)", fontFamily: "var(--mono)", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>Trip Stats</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                    {[
                      { label: "Max Speed", val: `${tripStats.maxSpeed} km/h`, col: "var(--orange)" },
                      { label: "Avg Speed", val: `${tripStats.avgSpeed} km/h`, col: "var(--accent)" },
                      { label: "Weather",   val: `${weather.icon} ${weather.temp}`, col: "var(--sub)" },
                    ].map(s => (
                      <div key={s.label} style={{ textAlign: "center", padding: "8px 4px", background: "var(--surf)", borderRadius: 9 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: s.col, fontFamily: "var(--mono)" }}>{s.val}</div>
                        <div style={{ fontSize: 9, color: "var(--sub)", marginTop: 2, fontFamily: "var(--mono)" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "var(--sub)", fontFamily: "var(--mono)" }}>Order Total</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: "var(--accent)", fontFamily: "var(--mono)" }}>₹{totalAmt}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "items" && (
              <div style={{ padding: "16px 18px 0", animation: "slideL .25s ease" }}>
                <div style={{ fontSize: 9, color: "var(--sub)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12, fontFamily: "var(--mono)" }}>Your Items ({cartItems.length})</div>
                {cartItems.length === 0
                  ? <div style={{ color: "var(--sub)", fontSize: 13, textAlign: "center", padding: "40px 0" }}>No items in this order</div>
                  : cartItems.map((item, i) => {
                      const status = itemStatus[i] || "pending";
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px", background: "var(--card)", border: `1px solid ${status === "delivered" ? "rgba(46,255,122,.2)" : status === "enroute" ? "rgba(0,229,255,.15)" : "var(--border)"}`, borderRadius: 12, marginBottom: 8, transition: "all .4s", animation: "fadeUp .3s ease" }}>
                          <div style={{ width: 42, height: 42, background: "var(--card2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, border: "1px solid var(--border)" }}>{getEmoji(item.name)}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                            <div style={{ fontSize: 10, color: "var(--sub)", fontFamily: "var(--mono)", marginTop: 2 }}>₹{item.price} × {item.qty || 1} = ₹{item.price * (item.qty || 1)}</div>
                          </div>
                          <span style={{
                            fontSize: 9, fontFamily: "var(--mono)", padding: "4px 9px", borderRadius: 6, letterSpacing: ".5px", flexShrink: 0, fontWeight: 700, textTransform: "uppercase",
                            ...(status === "pending"   ? { background: "rgba(255,159,28,.08)",  color: "var(--orange)", border: "1px solid rgba(255,159,28,.3)" }
                              : status === "enroute"   ? { background: "rgba(0,229,255,.08)",   color: "var(--accent)", border: "1px solid rgba(0,229,255,.3)" }
                              : { background: "rgba(46,255,122,.08)", color: "var(--green)",  border: "1px solid rgba(46,255,122,.3)" }),
                          }}>
                            {status === "pending" ? "⏳ Pending" : status === "enroute" ? "🛵 En Route" : "✓ Done"}
                          </span>
                        </div>
                      );
                    })
                }
                <div style={{ background: "linear-gradient(135deg,rgba(0,229,255,.06),rgba(0,229,255,.02))", border: "1px solid rgba(0,229,255,.2)", borderRadius: 12, padding: "14px", marginTop: 4, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--sub)", marginBottom: 2 }}>Order Total</div>
                      <div style={{ fontSize: 10, color: "var(--sub)", fontFamily: "var(--mono)" }}>{cartItems.length} items</div>
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "var(--accent)", fontFamily: "var(--mono)" }}>₹{totalAmt}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "chat" && (
              <div style={{ display: "flex", flexDirection: "column", height: "100%", animation: "slideR .25s ease" }}>
                <div style={{ padding: "10px 18px 8px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: "var(--sub)", fontFamily: "var(--mono)", display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 7, height: 7, background: "var(--green)", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
                    Chat with {driver.name} · AI-powered
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
                  {chatMsgs.map((m, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.from === "user" ? "flex-end" : "flex-start", animation: "fadeUp .25s ease" }}>
                      {m.from === "driver" && <div style={{ fontSize: 10, color: "var(--sub)", marginBottom: 3, fontFamily: "var(--mono)" }}>{driver.name}</div>}
                      <div className={m.from === "user" ? "chat-bubble-user" : "chat-bubble-driver"}>{m.text}</div>
                      <div style={{ fontSize: 9, color: "var(--dim)", marginTop: 3, fontFamily: "var(--mono)" }}>{m.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", animation: "fadeUp .25s ease" }}>
                      <div style={{ fontSize: 10, color: "var(--sub)", marginBottom: 3, fontFamily: "var(--mono)" }}>{driver.name}</div>
                      <div className="chat-bubble-driver" style={{ display: "flex", gap: 5, alignItems: "center", padding: "12px 16px" }}>
                        {[0,.2,.4].map((d, i) => (
                          <span key={i} className="typing-dot" style={{ animationDelay: `${d}s` }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div style={{ padding: "8px 14px", borderTop: "1px solid var(--border)", background: "var(--card)", flexShrink: 0 }}>
                  <div style={{ display: "flex", gap: 5, marginBottom: 8, overflowX: "auto", paddingBottom: 2 }}>
                    {CHAT_QUICK.map((q, i) => (
                      <button key={i} onClick={() => sendChat(q)} disabled={chatLoading}
                        style={{ background: "var(--surf)", border: "1px solid var(--border)", color: "var(--sub)", borderRadius: 20, padding: "4px 11px", fontSize: 10, fontFamily: "var(--mono)", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all .15s", opacity: chatLoading ? .5 : 1 }}
                        onMouseEnter={e => { if (!chatLoading) e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--sub)"; }}>
                        {q}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !chatLoading && sendChat()}
                      placeholder={chatLoading ? "Driver is typing..." : "Message your driver..."}
                      disabled={chatLoading}
                      style={{ flex: 1, background: "var(--surf)", border: "1px solid var(--border)", borderRadius: 11, padding: "10px 13px", color: "var(--text)", fontSize: 13, fontFamily: "var(--display)", transition: "border-color .2s", opacity: chatLoading ? .7 : 1 }} />
                    <button onClick={() => sendChat()} disabled={chatLoading || !chatInput.trim()}
                      style={{ background: chatLoading || !chatInput.trim() ? "var(--dim)" : "linear-gradient(135deg,var(--accent),var(--accentd))", border: "none", color: "#000", borderRadius: 11, padding: "10px 16px", fontSize: 16, cursor: chatLoading || !chatInput.trim() ? "default" : "pointer", transition: "all .2s", fontWeight: 700 }}>
                      {chatLoading ? "⌛" : "➤"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "info" && (
              <div style={{ padding: "16px 18px 0", animation: "slideL .25s ease" }}>
                <div style={{ fontSize: 9, color: "var(--sub)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, fontFamily: "var(--mono)" }}>Order Information</div>
                {[
                  { label: "Order ID", val: orderId, mono: true },
                  { label: "Driver", val: driver.name },
                  { label: "Vehicle", val: `${driver.vehicle} (${driver.bike})`, mono: true },
                  { label: "Rating", val: `⭐ ${driver.rating} · ${driver.trips} trips` },
                  { label: "On Zappit Since", val: driver.since },
                  { label: "Total Amount", val: `₹${totalAmt}`, accent: true },
                  { label: "GPS Status", val: locLoading ? "Using default location" : "🛰 Real GPS Active", green: !locLoading },
                  { label: "Route Type", val: routeError ? "⚠ Fallback route" : "🛣 Live road route" },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: "var(--sub)" }}>{r.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: r.accent ? "var(--accent)" : r.green ? "var(--green)" : "var(--text)", fontFamily: r.mono ? "var(--mono)" : "var(--display)" }}>{r.val}</span>
                  </div>
                ))}

                <div style={{ marginTop: 10, marginBottom: 16 }}>
                  <button onClick={copyTracking} style={{ width: "100%", background: copied ? "rgba(46,255,122,.1)" : "rgba(0,229,255,.08)", border: `1px solid ${copied ? "rgba(46,255,122,.4)" : "rgba(0,229,255,.25)"}`, color: copied ? "var(--green)" : "var(--accent)", borderRadius: 12, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--display)", transition: "all .2s" }}>
                    {copied ? "✓ Link Copied!" : "🔗 Share Tracking Link"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="map-panel">
          <div style={{ position: "absolute", top: 14, left: 14, zIndex: 500, display: "flex", flexDirection: "column", gap: 7, animation: "fadeUp .4s ease" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {Object.keys(MAP_TILES).map(k => (
                <button key={k} className={`map-btn ${mapStyle === k ? "active" : ""}`} onClick={() => setMapStyle(k)}>
                  {k === "dark" ? "🌑" : k === "light" ? "🌕" : k === "satellite" ? "🛰" : "🗺"} {k}
                </button>
              ))}
            </div>
          </div>

          <div style={{ position: "absolute", top: 14, right: 14, zIndex: 500, display: "flex", flexDirection: "column", gap: 7, animation: "fadeUp .4s ease" }}>
            <button className={`map-btn ${trackDriver ? "active" : ""}`} onClick={() => setTrackDriver(t => !t)}>
              🎯 {trackDriver ? "Following" : "Free View"}
            </button>
            {driverPos && (
              <div style={{ background: "rgba(11,16,24,.94)", backdropFilter: "blur(16px)", border: "1px solid var(--border)", borderRadius: 10, padding: "9px 14px", fontSize: 10, fontFamily: "var(--mono)", color: "var(--sub)", lineHeight: 1.6 }}>
                <div>📍 {driverPos.lat.toFixed(5)}, {driverPos.lng.toFixed(5)}</div>
                <div style={{ color: "var(--accent)", marginTop: 2 }}>⚡ {speedKmh} km/h · {progress}%</div>
              </div>
            )}
            <div style={{ background: "rgba(11,16,24,.94)", backdropFilter: "blur(16px)", border: "1px solid var(--border)", borderRadius: 10, padding: "9px 14px", fontSize: 10, fontFamily: "var(--mono)", color: "var(--sub)" }}>
              ⏱ <b style={{ color: "var(--text)" }}>{String(Math.floor(elapsed/60)).padStart(2,"0")}:{String(elapsed%60).padStart(2,"0")}</b>
            </div>
            {!locLoading && (
              <div style={{ background: "rgba(46,255,122,.06)", backdropFilter: "blur(14px)", border: "1px solid rgba(46,255,122,.25)", borderRadius: 10, padding: "9px 14px", fontSize: 10, fontFamily: "var(--mono)", color: "var(--green)", display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, background: "var(--green)", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
                GPS Active
              </div>
            )}
          </div>

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "rgba(0,0,0,.4)", zIndex: 500 }}>
            <div style={{ height: "100%", background: "linear-gradient(90deg,var(--accentd),var(--accent),var(--green))", width: `${progress}%`, transition: "width .6s ease", boxShadow: "0 0 16px var(--accent)" }} />
          </div>

          {!loading && (
            <MapContainer center={[userLoc.lat, userLoc.lng]} zoom={14} style={{ width: "100%", height: "100%" }} zoomControl={true}>
              <TileLayer key={mapStyle} url={tile.url} attribution={tile.attr} />

              {allPos.length > 1 && !trackDriver && <MapFitter positions={allPos} />}
              {smoothDriverPos && trackDriver && <SmoothMapController targetPos={smoothDriverPos} trackDriver={trackDriver} zoom={15} />}

              <Marker position={[STORE.lat, STORE.lng]} icon={storeIcon}>
                <Popup><div style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 1.7 }}>🏪 <b>ZAPP Store</b><br />Ludhiana, Punjab<br /><span style={{ color: "#888" }}>Origin Point</span></div></Popup>
              </Marker>

              <Marker position={[userLoc.lat, userLoc.lng]} icon={destIcon}>
                <Popup><div style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 1.7 }}>🏠 <b>Your Location</b><br />{locLoading ? "Default (GPS unavailable)" : "Real GPS Location"}<br /><span style={{ color: "#888" }}>{userLoc.lat.toFixed(5)}, {userLoc.lng.toFixed(5)}</span></div></Popup>
              </Marker>

              {route.length > 0 && (
                <>
                  <Polyline positions={route} pathOptions={{ color: "rgba(0,229,255,0.08)", weight: 14, lineCap: "round", lineJoin: "round" }} />
                  <Polyline positions={route} pathOptions={{ color: "rgba(0,229,255,0.22)", weight: 4, lineCap: "round", lineJoin: "round", dashArray: "12,9" }} />
                </>
              )}

              {traveledRoute.length > 1 && (
                <Polyline positions={traveledRoute} pathOptions={{ color: "#00e5ff", weight: 5, lineCap: "round", lineJoin: "round", opacity: 0.95 }} />
              )}

              {driverPos && (
                <Marker position={[driverPos.lat, driverPos.lng]} icon={driverIcon}>
                  <Popup><div style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 1.8 }}>
                    🛵 <b>{driver.name}</b><br />
                    {driver.vehicle} · {driver.bike}<br />
                    Progress: <b>{progress}%</b><br />
                    Speed: <b>{speedKmh} km/h</b><br />
                    <span style={{ color: "#888" }}>Distance left: {distLeftStr}</span>
                  </div></Popup>
                </Marker>
              )}

              {driverPos && (
                <Circle center={[driverPos.lat, driverPos.lng]} radius={60}
                  pathOptions={{ color: "#00e5ff", fillColor: "#00e5ff", fillOpacity: 0.05, weight: 1.5, opacity: 0.4 }} />
              )}
            </MapContainer>
          )}
        </div>
      </div>
    </>
  );
}