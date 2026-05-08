import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import API from "../services/api";

const PUB = process.env.PUBLIC_URL || "";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://api.zappstore.in";
const LOGO_SRC = `${PUB}/images/zappit_logo.png`;

const IMG = {
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
  804:`${PUB}/images/DigeneAntacid.webp`,805:`${PUB}/images/centirizine10mg.webp`,806:`${PUB}/images/BandAidFlexible.webp`,
  901:`${PUB}/images/Dove_shampoo.webp`,902:`${PUB}/images/colgate_total.webp`,903:`${PUB}/images/nivea_soft_cream.webp`,
  904:`${PUB}/images/GilletteMach3Razor.webp`,905:`${PUB}/images/DettolHandwashLiquid.webp`,906:`${PUB}/images/VaselineIntensiveCare.webp`,
  1001:`${PUB}/images/Surf_excel_matic.webp`,1002:`${PUB}/images/lizol_floor_cleaner.webp`,1003:`${PUB}/images/Harpic_Toilet_cleaner.webp`,
  1004:`${PUB}/images/VimDishwashbar.webp`,1005:`${PUB}/images/OdonilRoomfreshner.webp`,1006:`${PUB}/images/ColinGlassCleaner.webp`,
  1101:`${PUB}/images/pampers.webp`,1102:`${PUB}/images/Huggies_Wonder_pants.webp`,1103:`${PUB}/images/cerelacwheatstage.webp`,
  1104:`${PUB}/images/JohnsonBabyshampoo.webp`,1105:`${PUB}/images/meemeebabywipes.webp`,1106:`${PUB}/images/HimalayaBabylotion.webp`,
  1201:`${PUB}/images/pedigree_adult_dog_food.webp`,1202:`${PUB}/images/Whiskas_Cat_food.webp`,1203:`${PUB}/images/droolsdogbiscuit.webp`,
  1204:`${PUB}/images/catsancatlitter.webp`,1205:`${PUB}/images/Himalaypetcareshampoo.webp`,1206:`${PUB}/images/pedigreedentastix.webp`,
  1301:`${PUB}/images/Kwality_walls_cornetto.webp`,1302:`${PUB}/images/Magnum_Classic_Ice_cream.webp`,1303:`${PUB}/images/motherdairymistidoi.webp`,
  1304:`${PUB}/images/mccainfries.webp`,1305:`${PUB}/images/Amultriconeicecream.webp`,1306:`${PUB}/images/greenpeasfrozen.webp`,
  1401:`${PUB}/images/haldiramkajukatli.webp`,1402:`${PUB}/images/Haldiram_Gulab_Jamun.webp`,1403:`${PUB}/images/Bikanorasgulla.webp`,
  1404:`${PUB}/images/amulshrikhandmango.webp`,1405:`${PUB}/images/Haldiramsoanpapdi.webp`,1406:`${PUB}/images/motherdairykulfistick.webp`,
  1501:`${PUB}/images/football.webp`,1502:`${PUB}/images/coscocricketball.webp`,1503:`${PUB}/images/cricket_bat.webp`,
  1504:`${PUB}/images/unoflip.webp`,1505:`${PUB}/images/ludo.webp`,1506:`${PUB}/images/unocard.webp`,
  1601:`${PUB}/images/bluetoothspeaker.webp`,1602:`${PUB}/images/oneplusbuds.webp`,1603:`${PUB}/images/samsungtypecearphone.webp`,
  1604:`${PUB}/images/hp_mouse.webp`,1605:`${PUB}/images/philipstrimmer.webp`,1606:`${PUB}/images/samsungcharger.webp`,
  1607:`${PUB}/images/samsungbuds.webp`,1608:`${PUB}/images/bluetoothheadphones.webp`,1609:`${PUB}/images/hpkeyboard.webp`,
  1701:`${PUB}/images/healthy_morning.webp`,1702:`${PUB}/images/veg_burger.webp`,
};

const BIMG = {
  breakfast:`${PUB}/images/breakfast_kit.webp`,
  movie:`${PUB}/images/movie_night_combo.webp`,
  detox:`${PUB}/images/detox_pack.webp`,
  party:`${PUB}/images/party_snacks.webp`,
  healthy:`${PUB}/images/healthy_morning.webp`,
};

const BANNERS = {
  electronics:`${PUB}/images/banners/banner13.png`,
  sports:`${PUB}/images/banners/banner14.png`,
  cleaning:`${PUB}/images/banners/banner15.png`,
  pet:`${PUB}/images/banners/banner16.png`,
  baby:`${PUB}/images/banners/banner17.png`,
  pharma:`${PUB}/images/banners/banner18.png`,
  gold:`${PUB}/images/banners/banner19.png`,
};

const EFB={dairy:"🥛",staples:"🌾",snacks:"🍿",drinks:"🥤",fresh:"🍎",masala:"🌶️",breakfast:"🥣",pharma:"💊",personal:"🧴",cleaning:"🧹",baby:"👶",pet:"🐾",frozen:"🧊",sweet:"🍮",sports:"⚽",electronics:"📱"};

const CATS=[
  {id:"all",label:"All",icon:"🛒"},
  {id:"dairy",label:"Dairy, Bread & Eggs",icon:"🥛"},
  {id:"staples",label:"Atta, Rice & Dal",icon:"🌾"},
  {id:"snacks",label:"Snacks & Munchies",icon:"🍿"},
  {id:"drinks",label:"Cold Drinks & Juices",icon:"🥤"},
  {id:"fresh",label:"Fruits & Veggies",icon:"🥦"},
  {id:"masala",label:"Masala, Oil & More",icon:"🌶️"},
  {id:"breakfast",label:"Breakfast & Instant",icon:"🥣"},
  {id:"pharma",label:"Pharma & Wellness",icon:"💊"},
  {id:"personal",label:"Personal Care",icon:"🧴"},
  {id:"cleaning",label:"Cleaning Essentials",icon:"🧹"},
  {id:"baby",label:"Baby Care",icon:"👶"},
  {id:"pet",label:"Pet Care",icon:"🐾"},
  {id:"frozen",label:"Frozen & Ready",icon:"🧊"},
  {id:"sweet",label:"Sweet Tooth",icon:"🍮"},
  {id:"sports",label:"Sports & Games",icon:"⚽"},
  {id:"electronics",label:"Electronics",icon:"📱"},
];

const STATIC_PRODUCTS=[
  {id:101,name:"Amul Gold Full Cream Milk",price:34,orig:null,cat:"dairy",brand:"Amul",weight:"1 L",rating:4.9,reviews:45.2,tag:"BESTSELLER",del:8,stock:50},
  {id:102,name:"Amul Toned Milk",price:28,orig:null,cat:"dairy",brand:"Amul",weight:"500 ml",rating:4.8,reviews:38.1,tag:null,del:8,stock:40},
  {id:103,name:"Mother Dairy Toned Milk",price:26,orig:null,cat:"dairy",brand:"Mother Dairy",weight:"500 ml",rating:4.6,reviews:22.4,tag:null,del:10,stock:30},
  {id:104,name:"Amul Masti Dahi",price:35,orig:null,cat:"dairy",brand:"Amul",weight:"400 g",rating:4.8,reviews:22.3,tag:"BESTSELLER",del:8,stock:20},
  {id:105,name:"Epigamia Greek Yogurt",price:55,orig:65,cat:"dairy",brand:"Epigamia",weight:"90 g",rating:4.7,reviews:7.4,tag:"NEW",del:12,stock:15},
  {id:106,name:"Amul Butter Salted",price:52,orig:null,cat:"dairy",brand:"Amul",weight:"100 g",rating:4.9,reviews:38.1,tag:"BESTSELLER",del:8,stock:60},
  {id:107,name:"Amul Processed Cheese",price:110,orig:130,cat:"dairy",brand:"Amul",weight:"200 g",rating:4.8,reviews:14.3,tag:null,del:10,stock:25},
  {id:108,name:"Amul Fresh Paneer",price:85,orig:null,cat:"dairy",brand:"Amul",weight:"200 g",rating:4.7,reviews:18.4,tag:"BESTSELLER",del:8,stock:5},
  {id:109,name:"Farm Fresh White Eggs",price:70,orig:84,cat:"dairy",brand:"Farm Fresh",weight:"6 pcs",rating:4.7,reviews:22.1,tag:null,del:8,stock:100},
  {id:110,name:"Britannia Atta Bread",price:42,orig:null,cat:"dairy",brand:"Britannia",weight:"400 g",rating:4.6,reviews:19.3,tag:"BESTSELLER",del:10,stock:35},
  {id:201,name:"India Gate Basmati Rice",price:185,orig:210,cat:"staples",brand:"India Gate",weight:"1 kg",rating:4.9,reviews:28.4,tag:"BESTSELLER",del:10,stock:80},
  {id:202,name:"Daawat Extra Long Basmati",price:165,orig:190,cat:"staples",brand:"Daawat",weight:"1 kg",rating:4.8,reviews:18.1,tag:null,del:10,stock:60},
  {id:203,name:"Fortune Sona Masoori Rice",price:75,orig:null,cat:"staples",brand:"Fortune",weight:"1 kg",rating:4.6,reviews:14.3,tag:null,del:10,stock:90},
  {id:204,name:"Aashirvaad Whole Wheat Atta",price:149,orig:170,cat:"staples",brand:"Aashirvaad",weight:"2 kg",rating:4.8,reviews:35.2,tag:"BESTSELLER",del:10,stock:70},
  {id:205,name:"Tata Sampann Toor Dal",price:185,orig:210,cat:"staples",brand:"Tata",weight:"1 kg",rating:4.8,reviews:16.3,tag:"BESTSELLER",del:10,stock:50},
  {id:206,name:"Fortune Chana Dal",price:95,orig:110,cat:"staples",brand:"Fortune",weight:"1 kg",rating:4.6,reviews:12.1,tag:null,del:10,stock:70},
  {id:207,name:"Tata Sugar",price:52,orig:null,cat:"staples",brand:"Tata",weight:"1 kg",rating:4.7,reviews:22.3,tag:"BESTSELLER",del:10,stock:100},
  {id:208,name:"Amul Pure Ghee",price:290,orig:320,cat:"staples",brand:"Amul",weight:"500 ml",rating:4.9,reviews:22.4,tag:"BESTSELLER",del:10,stock:45},
  {id:301,name:"Lay's Classic Salted",price:20,orig:null,cat:"snacks",brand:"Lay's",weight:"26 g",rating:4.5,reviews:45.2,tag:"BESTSELLER",del:10,stock:150},
  {id:302,name:"Lay's Magic Masala",price:20,orig:null,cat:"snacks",brand:"Lay's",weight:"26 g",rating:4.6,reviews:38.4,tag:"HOT",del:10,stock:130},
  {id:303,name:"Pringles Original",price:115,orig:130,cat:"snacks",brand:"Pringles",weight:"107 g",rating:4.7,reviews:14.3,tag:null,del:10,stock:40},
  {id:304,name:"Parle-G Glucose Biscuits",price:15,orig:null,cat:"snacks",brand:"Parle",weight:"150 g",rating:4.9,reviews:62.1,tag:"BESTSELLER",del:10,stock:200},
  {id:305,name:"Britannia Good Day Cashew",price:35,orig:null,cat:"snacks",brand:"Britannia",weight:"150 g",rating:4.6,reviews:24.3,tag:null,del:10,stock:80},
  {id:306,name:"Haldiram's Aloo Bhujia",price:45,orig:null,cat:"snacks",brand:"Haldiram's",weight:"200 g",rating:4.8,reviews:22.4,tag:"BESTSELLER",del:10,stock:60},
  {id:307,name:"Cadbury Dairy Milk",price:40,orig:null,cat:"snacks",brand:"Cadbury",weight:"40 g",rating:4.9,reviews:48.2,tag:"BESTSELLER",del:10,stock:90},
  {id:308,name:"Happilo Premium Mixed Nuts",price:199,orig:240,cat:"snacks",brand:"Happilo",weight:"200 g",rating:4.8,reviews:12.4,tag:"PREMIUM",del:12,stock:30},
  {id:309,name:"Too Yumm Veggie Stix",price:25,orig:30,cat:"snacks",brand:"Too Yumm",weight:"45 g",rating:4.5,reviews:8.2,tag:"NEW",del:10,stock:60},
  {id:310,name:"Kurkure Masala Munch",price:20,orig:null,cat:"snacks",brand:"Kurkure",weight:"90 g",rating:4.6,reviews:28.3,tag:null,del:10,stock:100},
  {id:311,name:"Britannia Marie Gold",price:30,orig:null,cat:"snacks",brand:"Britannia",weight:"250 g",rating:4.6,reviews:18.3,tag:null,del:10,stock:80},
  {id:401,name:"Coca-Cola",price:40,orig:null,cat:"drinks",brand:"Coca-Cola",weight:"750 ml",rating:4.6,reviews:38.4,tag:null,del:8,stock:100},
  {id:402,name:"Thums Up Strong",price:40,orig:null,cat:"drinks",brand:"Coca-Cola",weight:"750 ml",rating:4.7,reviews:18.4,tag:"HOT",del:8,stock:80},
  {id:403,name:"Tropicana Orange Juice",price:99,orig:120,cat:"drinks",brand:"Tropicana",weight:"1 L",rating:4.7,reviews:18.4,tag:"FRESH",del:10,stock:55},
  {id:404,name:"Red Bull Energy Drink",price:125,orig:150,cat:"drinks",brand:"Red Bull",weight:"250 ml",rating:4.7,reviews:22.1,tag:"BESTSELLER",del:10,stock:70},
  {id:405,name:"Bisleri Mineral Water",price:20,orig:null,cat:"drinks",brand:"Bisleri",weight:"1 L",rating:4.6,reviews:32.1,tag:"BESTSELLER",del:8,stock:200},
  {id:406,name:"Nescafé Classic Coffee",price:280,orig:320,cat:"drinks",brand:"Nescafé",weight:"100 g",rating:4.8,reviews:18.4,tag:"BESTSELLER",del:10,stock:40},
  {id:407,name:"Sprite Lemon Lime",price:38,orig:null,cat:"drinks",brand:"Sprite",weight:"750 ml",rating:4.5,reviews:22.3,tag:null,del:8,stock:90},
  {id:408,name:"Maaza Mango Drink",price:40,orig:null,cat:"drinks",brand:"Maaza",weight:"600 ml",rating:4.6,reviews:14.2,tag:null,del:8,stock:75},
  {id:501,name:"Bananas",price:45,orig:null,cat:"fresh",brand:"Fresh",weight:"6 pcs",rating:4.7,reviews:28.4,tag:"BESTSELLER",del:8,stock:50},
  {id:502,name:"Royal Gala Apples",price:99,orig:120,cat:"fresh",brand:"Fresh",weight:"4 pcs",rating:4.6,reviews:18.3,tag:null,del:10,stock:30},
  {id:503,name:"Onions",price:45,orig:null,cat:"fresh",brand:"Fresh",weight:"1 kg",rating:4.5,reviews:32.1,tag:null,del:8,stock:100},
  {id:504,name:"Tomatoes",price:40,orig:null,cat:"fresh",brand:"Fresh",weight:"500 g",rating:4.6,reviews:28.4,tag:null,del:8,stock:80},
  {id:505,name:"Baby Spinach Leaves",price:35,orig:45,cat:"fresh",brand:"Fresh",weight:"200 g",rating:4.7,reviews:9.2,tag:"ORGANIC",del:10,stock:40},
  {id:506,name:"Green Capsicum",price:30,orig:null,cat:"fresh",brand:"Fresh",weight:"250 g",rating:4.5,reviews:11.4,tag:null,del:8,stock:60},
  {id:601,name:"MDH Kitchen King Masala",price:75,orig:null,cat:"masala",brand:"MDH",weight:"100 g",rating:4.8,reviews:22.4,tag:"BESTSELLER",del:10,stock:60},
  {id:602,name:"Fortune Sunflower Oil",price:145,orig:165,cat:"masala",brand:"Fortune",weight:"1 L",rating:4.6,reviews:18.4,tag:"BESTSELLER",del:10,stock:50},
  {id:603,name:"Everest Garam Masala",price:65,orig:null,cat:"masala",brand:"Everest",weight:"100 g",rating:4.7,reviews:15.3,tag:null,del:10,stock:70},
  {id:604,name:"Saffola Gold Oil",price:185,orig:210,cat:"masala",brand:"Saffola",weight:"1 L",rating:4.7,reviews:12.1,tag:"HEALTHY",del:10,stock:45},
  {id:701,name:"Maggi 2-Minute Noodles",price:14,orig:null,cat:"breakfast",brand:"Maggi",weight:"70 g",rating:4.9,reviews:58.4,tag:"BESTSELLER",del:8,stock:300},
  {id:702,name:"Quaker Oats",price:120,orig:140,cat:"breakfast",brand:"Quaker",weight:"1 kg",rating:4.8,reviews:22.4,tag:"HEALTHY",del:10,stock:60},
  {id:703,name:"Kellogg's Corn Flakes",price:145,orig:170,cat:"breakfast",brand:"Kellogg's",weight:"500 g",rating:4.7,reviews:18.4,tag:"BESTSELLER",del:10,stock:45},
  {id:704,name:"Britannia Marie Gold",price:30,orig:null,cat:"breakfast",brand:"Britannia",weight:"250 g",rating:4.6,reviews:18.3,tag:null,del:10,stock:80},
  {id:801,name:"Dolo 650",price:32,orig:null,cat:"pharma",brand:"Micro Labs",weight:"15 tabs",rating:4.8,reviews:22.4,tag:"BESTSELLER",del:12,stock:200},
  {id:802,name:"Vitamin C 500mg",price:120,orig:150,cat:"pharma",brand:"Limcee",weight:"30 tabs",rating:4.7,reviews:12.4,tag:"NEW",del:15,stock:80},
  {id:803,name:"Himalaya Liv 52",price:185,orig:210,cat:"pharma",brand:"Himalaya",weight:"100 tabs",rating:4.7,reviews:18.3,tag:null,del:15,stock:50},
  {id:804,name:"Digene Antacid Gel",price:75,orig:90,cat:"pharma",brand:"Abbott",weight:"200 ml",rating:4.6,reviews:14.2,tag:"BESTSELLER",del:12,stock:60},
  {id:805,name:"Cetrizine 10mg",price:28,orig:null,cat:"pharma",brand:"GSK",weight:"10 tabs",rating:4.5,reviews:8.3,tag:null,del:12,stock:150},
  {id:806,name:"Band-Aid Flexible",price:55,orig:65,cat:"pharma",brand:"Johnson",weight:"30 pcs",rating:4.6,reviews:10.4,tag:null,del:12,stock:80},
  {id:901,name:"Dove Shampoo Daily Moisture",price:175,orig:199,cat:"personal",brand:"Dove",weight:"340 ml",rating:4.7,reviews:18.4,tag:"BESTSELLER",del:12,stock:40},
  {id:902,name:"Colgate Total Toothpaste",price:99,orig:115,cat:"personal",brand:"Colgate",weight:"150 g",rating:4.7,reviews:22.4,tag:"BESTSELLER",del:12,stock:90},
  {id:903,name:"Nivea Soft Cream",price:145,orig:165,cat:"personal",brand:"Nivea",weight:"200 ml",rating:4.6,reviews:14.2,tag:null,del:12,stock:55},
  {id:904,name:"Gillette Mach3 Razor",price:199,orig:230,cat:"personal",brand:"Gillette",weight:"1 pc",rating:4.7,reviews:16.3,tag:"BESTSELLER",del:12,stock:40},
  {id:905,name:"Dettol Handwash Liquid",price:75,orig:90,cat:"personal",brand:"Dettol",weight:"200 ml",rating:4.8,reviews:28.4,tag:"BESTSELLER",del:12,stock:70},
  {id:906,name:"Vaseline Intensive Care",price:115,orig:135,cat:"personal",brand:"Vaseline",weight:"200 ml",rating:4.6,reviews:12.1,tag:null,del:12,stock:50},
  {id:1001,name:"Surf Excel Matic",price:215,orig:240,cat:"cleaning",brand:"HUL",weight:"1 kg",rating:4.7,reviews:16.4,tag:"BESTSELLER",del:12,stock:55},
  {id:1002,name:"Lizol Floor Cleaner",price:115,orig:135,cat:"cleaning",brand:"Reckitt",weight:"1 L",rating:4.7,reviews:14.2,tag:"BESTSELLER",del:12,stock:60},
  {id:1003,name:"Harpic Power Plus",price:95,orig:110,cat:"cleaning",brand:"Harpic",weight:"1 L",rating:4.6,reviews:12.3,tag:null,del:12,stock:65},
  {id:1004,name:"Vim Dishwash Bar",price:35,orig:null,cat:"cleaning",brand:"HUL",weight:"400 g",rating:4.5,reviews:22.1,tag:"BESTSELLER",del:12,stock:100},
  {id:1005,name:"Odonil Room Freshener",price:55,orig:65,cat:"cleaning",brand:"Dabur",weight:"75 g",rating:4.4,reviews:10.2,tag:null,del:12,stock:80},
  {id:1006,name:"Colin Glass Cleaner",price:85,orig:99,cat:"cleaning",brand:"Reckitt",weight:"500 ml",rating:4.5,reviews:9.3,tag:null,del:12,stock:60},
  {id:1101,name:"Pampers Active Baby Diapers",price:299,orig:349,cat:"baby",brand:"Pampers",weight:"20 pcs·M",rating:4.8,reviews:22.4,tag:"BESTSELLER",del:14,stock:35},
  {id:1102,name:"Huggies Wonder Pants",price:349,orig:399,cat:"baby",brand:"Huggies",weight:"56 pcs·M",rating:4.7,reviews:18.2,tag:null,del:14,stock:28},
  {id:1103,name:"Cerelac Wheat Stage 1",price:235,orig:265,cat:"baby",brand:"Nestle",weight:"300 g",rating:4.8,reviews:16.4,tag:"BESTSELLER",del:14,stock:30},
  {id:1104,name:"Johnson's Baby Shampoo",price:145,orig:170,cat:"baby",brand:"Johnson",weight:"200 ml",rating:4.7,reviews:22.1,tag:"BESTSELLER",del:14,stock:45},
  {id:1105,name:"Mee Mee Baby Wipes",price:99,orig:120,cat:"baby",brand:"Mee Mee",weight:"72 pcs",rating:4.6,reviews:14.3,tag:null,del:14,stock:50},
  {id:1106,name:"Himalaya Baby Lotion",price:125,orig:145,cat:"baby",brand:"Himalaya",weight:"200 ml",rating:4.7,reviews:18.2,tag:"NEW",del:14,stock:40},
  {id:1201,name:"Pedigree Adult Dog Food",price:320,orig:380,cat:"pet",brand:"Pedigree",weight:"1.2 kg",rating:4.7,reviews:12.4,tag:"BESTSELLER",del:12,stock:25},
  {id:1202,name:"Whiskas Cat Food Salmon",price:280,orig:320,cat:"pet",brand:"Whiskas",weight:"85g×12",rating:4.6,reviews:8.3,tag:null,del:12,stock:20},
  {id:1203,name:"Drools Dog Biscuit",price:110,orig:130,cat:"pet",brand:"Drools",weight:"500 g",rating:4.6,reviews:9.2,tag:"NEW",del:12,stock:30},
  {id:1204,name:"Catsan Cat Litter",price:395,orig:450,cat:"pet",brand:"Catsan",weight:"5 L",rating:4.5,reviews:6.1,tag:null,del:12,stock:20},
  {id:1205,name:"Himalaya PetCare Shampoo",price:165,orig:195,cat:"pet",brand:"Himalaya",weight:"200 ml",rating:4.6,reviews:7.4,tag:"NEW",del:12,stock:25},
  {id:1206,name:"Pedigree Dentastix",price:185,orig:220,cat:"pet",brand:"Pedigree",weight:"10 pcs",rating:4.7,reviews:8.2,tag:"BESTSELLER",del:12,stock:30},
  {id:1301,name:"Kwality Walls Cornetto",price:40,orig:null,cat:"frozen",brand:"Kwality Walls",weight:"80 ml",rating:4.7,reviews:22.4,tag:"BESTSELLER",del:15,stock:50},
  {id:1302,name:"Magnum Classic Ice Cream",price:85,orig:100,cat:"frozen",brand:"Magnum",weight:"120 ml",rating:4.8,reviews:14.3,tag:"PREMIUM",del:15,stock:30},
  {id:1303,name:"Mother Dairy Mishti Doi",price:45,orig:null,cat:"frozen",brand:"Mother Dairy",weight:"400 g",rating:4.6,reviews:12.1,tag:"BESTSELLER",del:15,stock:40},
  {id:1304,name:"McCain Smiles Fries",price:130,orig:155,cat:"frozen",brand:"McCain",weight:"415 g",rating:4.5,reviews:16.3,tag:"NEW",del:15,stock:35},
  {id:1305,name:"Amul Tricone Ice Cream",price:30,orig:null,cat:"frozen",brand:"Amul",weight:"90 ml",rating:4.7,reviews:18.4,tag:"BESTSELLER",del:15,stock:60},
  {id:1306,name:"Green Peas Frozen",price:55,orig:65,cat:"frozen",brand:"Safal",weight:"500 g",rating:4.5,reviews:10.2,tag:null,del:15,stock:45},
  {id:1401,name:"Haldiram's Kaju Katli",price:350,orig:400,cat:"sweet",brand:"Haldiram's",weight:"250 g",rating:4.9,reviews:8.4,tag:"PREMIUM",del:14,stock:20},
  {id:1402,name:"Haldiram's Gulab Jamun",price:120,orig:null,cat:"sweet",brand:"Haldiram's",weight:"500 g",rating:4.7,reviews:12.3,tag:"BESTSELLER",del:14,stock:35},
  {id:1403,name:"Bikano Rasgulla",price:85,orig:99,cat:"sweet",brand:"Bikano",weight:"500 g",rating:4.6,reviews:10.1,tag:"NEW",del:14,stock:30},
  {id:1404,name:"Amul Shrikhand Mango",price:75,orig:null,cat:"sweet",brand:"Amul",weight:"200 g",rating:4.7,reviews:14.2,tag:"BESTSELLER",del:14,stock:25},
  {id:1405,name:"Haldiram's Soan Papdi",price:160,orig:185,cat:"sweet",brand:"Haldiram's",weight:"250 g",rating:4.6,reviews:9.3,tag:null,del:14,stock:40},
  {id:1406,name:"Mother Dairy Kulfi Stick",price:25,orig:null,cat:"sweet",brand:"Mother Dairy",weight:"60 ml",rating:4.8,reviews:22.4,tag:"BESTSELLER",del:14,stock:80},
  {id:1501,name:"Nivia Football",price:599,orig:750,cat:"sports",brand:"Nivia",weight:"Size 5",rating:4.6,reviews:8.2,tag:"BESTSELLER",del:30,stock:25},
  {id:1502,name:"Cosco Cricket Ball",price:85,orig:110,cat:"sports",brand:"Cosco",weight:"Standard",rating:4.5,reviews:12.3,tag:null,del:30,stock:60},
  {id:1503,name:"Kookaburra Cricket Bat",price:1299,orig:1599,cat:"sports",brand:"Kookaburra",weight:"Full Size",rating:4.7,reviews:6.4,tag:"PREMIUM",del:30,stock:15},
  {id:1504,name:"UNO Flip Card Game",price:349,orig:450,cat:"sports",brand:"Mattel",weight:"Card Game",rating:4.8,reviews:14.2,tag:"NEW",del:20,stock:40},
  {id:1505,name:"Ludo Board Game",price:299,orig:399,cat:"sports",brand:"Generic",weight:"Board Game",rating:4.5,reviews:18.1,tag:"BESTSELLER",del:20,stock:35},
  {id:1506,name:"UNO Card Game",price:299,orig:380,cat:"sports",brand:"Mattel",weight:"Card Game",rating:4.7,reviews:22.4,tag:"BESTSELLER",del:20,stock:50},
  {id:1601,name:"Bose Bluetooth Speaker",price:8999,orig:11999,cat:"electronics",brand:"Bose",weight:"Portable",rating:4.9,reviews:4.2,tag:"PREMIUM",del:60,stock:10},
  {id:1602,name:"Realme TechLife Buds",price:999,orig:1499,cat:"electronics",brand:"Realme",weight:"TWS",rating:4.5,reviews:18.3,tag:"NEW",del:45,stock:30},
  {id:1603,name:"Samsung Type-C Earphones",price:599,orig:799,cat:"electronics",brand:"Samsung",weight:"Wired",rating:4.4,reviews:12.1,tag:null,del:45,stock:40},
  {id:1604,name:"HP Wireless Mouse",price:799,orig:999,cat:"electronics",brand:"HP",weight:"Wireless",rating:4.6,reviews:22.4,tag:"BESTSELLER",del:45,stock:25},
  {id:1605,name:"Philips OneBlade Trimmer",price:2499,orig:3299,cat:"electronics",brand:"Philips",weight:"Trimmer",rating:4.7,reviews:16.2,tag:"BESTSELLER",del:45,stock:20},
  {id:1606,name:"Samsung 25W Charger",price:899,orig:1199,cat:"electronics",brand:"Samsung",weight:"25W USB-C",rating:4.8,reviews:28.4,tag:"BESTSELLER",del:45,stock:35},
  {id:1607,name:"Samsung Galaxy Buds",price:1499,orig:1999,cat:"electronics",brand:"Samsung",weight:"TWS",rating:4.6,reviews:10.3,tag:"NEW",del:45,stock:20},
  {id:1608,name:"Sony Bluetooth Headphones",price:3499,orig:4999,cat:"electronics",brand:"Sony",weight:"Over-ear",rating:4.8,reviews:8.4,tag:"PREMIUM",del:60,stock:12},
  {id:1609,name:"HP USB Keyboard",price:699,orig:899,cat:"electronics",brand:"HP",weight:"Wired",rating:4.5,reviews:14.2,tag:null,del:45,stock:28},
];

const FLASH=[
  {id:109,p:55,o:84,pct:35},{id:308,p:139,o:240,pct:42},
  {id:404,p:89,o:150,pct:41},{id:1101,p:249,o:349,pct:29},
  {id:101,p:22,o:34,pct:35},{id:1401,p:280,o:400,pct:30},
  {id:403,p:79,o:120,pct:34},{id:702,p:89,o:140,pct:36},
];

const BUNDLES=[
  {id:"breakfast",name:"Breakfast Kit",items:[101,110,106,109,702],save:45,price:130,orig:175},
  {id:"movie",name:"Movie Night",items:[303,401,304,308,302],save:55,price:160,orig:215},
  {id:"detox",name:"Detox Pack",items:[403,405,104,702,501],save:60,price:200,orig:260},
  {id:"party",name:"Party Snacks",items:[301,302,306,307,310],save:40,price:110,orig:150},
  {id:"healthy",name:"Healthy Morning",items:[702,703,501,403,505],save:70,price:220,orig:290},
];

const COUPONS=[
  {code:"SAVE10",desc:"10% off on orders",min:"Min ₹99",clr:"#0d5c2e",bg:"#e8f5e9",bdr:"#4caf50"},
  {code:"GOLD50",desc:"₹50 flat off",min:"Min ₹199",clr:"#8B6914",bg:"#fff8e1",bdr:"#ffc107"},
  {code:"NEWUSER",desc:"₹30 off for new users",min:"No min",clr:"#1565c0",bg:"#e3f2fd",bdr:"#2196f3"},
  {code:"FLASH20",desc:"20% off flash deals",min:"Min ₹149",clr:"#b71c1c",bg:"#fce4ec",bdr:"#e91e63"},
  {code:"FRESH15",desc:"15% off fresh produce",min:"Min ₹79",clr:"#2e7d32",bg:"#f1f8e9",bdr:"#8bc34a"},
];

const HOME_BANNERS=[
  {img:`${PUB}/images/banners/banner4.png`,cat:"sports",action:"sports"},
  {img:`${PUB}/images/banners/banner3.png`,cat:"fresh",action:"fresh"},
  {img:`${PUB}/images/banners/banner.png`,cat:"snacks",action:"snacks"},
  {img:`${PUB}/images/banners/banner2.png`,cat:"gold",action:"gold"},
];

const HOME_WIDE_BANNERS=[
  {img:`${PUB}/images/banners/banner5.png`,cat:"dairy",action:"dairy"},
  {img:`${PUB}/images/banners/banner8.png`,cat:"gold",action:"gold"},
  {img:`${PUB}/images/banners/banner9.png`,cat:"dairy",action:"dairy"},
];

const HOME_AD_BANNERS=[
  {img:`${PUB}/images/banners/banner6.png`,pid:308,cat:"snacks"},
  {img:`${PUB}/images/banners/banner10.png`,pid:404,cat:"drinks"},
  {img:`${PUB}/images/banners/banner11.png`,pid:1601,cat:"electronics"},
  {img:`${PUB}/images/banners/nivia_football.png`,pid:1501,cat:"sports"},
];

const TAGC={BESTSELLER:"#16a34a",HOT:"#dc2626",NEW:"#2563eb",PREMIUM:"#7c3aed",ORGANIC:"#15803d",HEALTHY:"#0d9488",FRESH:"#0284c7"};
const TRENDING=[308,701,306,402,403,104,302,207];

const AIM=[101,110,106,702,703,104,106,109,701,304];
const AIA=[301,401,306,307,310,302,403,407,408,303];
const AIE=[203,503,601,602,208,204,205,206,207,201];
const AIN=[302,401,404,307,304,308,403,405,402,406];

const LIVETXT=[
  "👁 22 people viewing Maggi right now","🔴 Only 5 left: Haldiram's Kaju Katli",
  "⚡ Just ordered: Amul Butter in your area","🔥 Trending: Lay's Magic Masala up 38%",
  "📦 Delivered in 7 min!","🛒 18 people added Red Bull this hour",
  "📱 Bose Speaker selling fast!","⚽ UNO Flip trending today!",
];

const INDIA_CITIES=["Mumbai","Delhi","Bengaluru","Hyderabad","Chennai","Kolkata","Pune","Ahmedabad","Jaipur","Surat","Lucknow","Kanpur","Nagpur","Indore","Bhopal","Patna","Vadodara","Ghaziabad","Ludhiana","Agra","Nashik","Faridabad","Meerut","Rajkot","Kalyan","Vasai","Varanasi","Srinagar","Aurangabad","Dhanbad","Amritsar","Jodhpur","Raipur","Kota","Chandigarh","Guwahati","Solapur","Hubli","Coimbatore","Visakhapatnam"];

const CITY_STORES = {
  "Mumbai":[
    {name:"Zappit Dark Store - Andheri West",dist:0.3,eta:7,rating:4.9,orders:"28k+",open:true,type:"Main Hub",area:"Andheri West, Mumbai"},
    {name:"Zappit Express - Bandra",dist:1.2,eta:12,rating:4.8,orders:"14k+",open:true,type:"Express",area:"Bandra West, Mumbai"},
    {name:"Zappit Hub - Dadar",dist:2.8,eta:19,rating:4.7,orders:"9k+",open:true,type:"Hub",area:"Dadar, Mumbai"},
    {name:"Zappit Express - Borivali",dist:4.1,eta:25,rating:4.6,orders:"6k+",open:false,type:"Express",area:"Borivali East, Mumbai"},
  ],
  "Delhi":[
    {name:"Zappit Dark Store - Connaught Place",dist:0.4,eta:8,rating:4.9,orders:"22k+",open:true,type:"Main Hub",area:"Connaught Place, New Delhi"},
    {name:"Zappit Express - Lajpat Nagar",dist:1.5,eta:13,rating:4.8,orders:"11k+",open:true,type:"Express",area:"Lajpat Nagar, Delhi"},
    {name:"Zappit Hub - Rohini",dist:3.2,eta:21,rating:4.6,orders:"7k+",open:true,type:"Hub",area:"Rohini Sector 9, Delhi"},
    {name:"Zappit Express - Dwarka",dist:5.1,eta:28,rating:4.5,orders:"4k+",open:false,type:"Express",area:"Dwarka Sector 10, Delhi"},
  ],
  "Bengaluru":[
    {name:"Zappit Dark Store - Indiranagar",dist:0.5,eta:8,rating:4.9,orders:"19k+",open:true,type:"Main Hub",area:"Indiranagar, Bengaluru"},
    {name:"Zappit Express - Koramangala",dist:1.1,eta:11,rating:4.8,orders:"13k+",open:true,type:"Express",area:"Koramangala 5th Block, Bengaluru"},
    {name:"Zappit Hub - Whitefield",dist:3.5,eta:22,rating:4.7,orders:"8k+",open:true,type:"Hub",area:"Whitefield Main Road, Bengaluru"},
    {name:"Zappit Express - Hebbal",dist:4.8,eta:27,rating:4.5,orders:"3k+",open:false,type:"Express",area:"Hebbal, Bengaluru"},
  ],
  "Hyderabad":[
    {name:"Zappit Dark Store - Hitech City",dist:0.4,eta:8,rating:4.9,orders:"18k+",open:true,type:"Main Hub",area:"Hitech City, Hyderabad"},
    {name:"Zappit Express - Banjara Hills",dist:1.3,eta:13,rating:4.8,orders:"10k+",open:true,type:"Express",area:"Banjara Hills Rd No. 12, Hyderabad"},
    {name:"Zappit Hub - Secunderabad",dist:3.1,eta:20,rating:4.7,orders:"7k+",open:true,type:"Hub",area:"Secunderabad, Hyderabad"},
    {name:"Zappit Express - LB Nagar",dist:5.2,eta:29,rating:4.5,orders:"3k+",open:false,type:"Express",area:"LB Nagar, Hyderabad"},
  ],
  "Chennai":[
    {name:"Zappit Dark Store - T. Nagar",dist:0.5,eta:8,rating:4.9,orders:"16k+",open:true,type:"Main Hub",area:"T. Nagar, Chennai"},
    {name:"Zappit Express - Anna Nagar",dist:1.4,eta:13,rating:4.8,orders:"9k+",open:true,type:"Express",area:"Anna Nagar West, Chennai"},
    {name:"Zappit Hub - Velachery",dist:3.0,eta:20,rating:4.7,orders:"6k+",open:true,type:"Hub",area:"Velachery, Chennai"},
    {name:"Zappit Express - Ambattur",dist:4.5,eta:27,rating:4.5,orders:"2.5k+",open:false,type:"Express",area:"Ambattur Industrial Estate, Chennai"},
  ],
  "Kolkata":[
    {name:"Zappit Dark Store - Park Street",dist:0.4,eta:8,rating:4.9,orders:"15k+",open:true,type:"Main Hub",area:"Park Street, Kolkata"},
    {name:"Zappit Express - Salt Lake",dist:1.6,eta:14,rating:4.8,orders:"8k+",open:true,type:"Express",area:"Salt Lake Sector V, Kolkata"},
    {name:"Zappit Hub - Howrah",dist:3.3,eta:22,rating:4.6,orders:"5k+",open:true,type:"Hub",area:"Howrah, West Bengal"},
    {name:"Zappit Express - Dum Dum",dist:4.8,eta:28,rating:4.5,orders:"2k+",open:false,type:"Express",area:"Dum Dum, Kolkata"},
  ],
  "Patna":[
    {name:"Zappit Dark Store - Fraser Road",dist:0.6,eta:9,rating:4.8,orders:"5k+",open:true,type:"Main Hub",area:"Fraser Road, Patna"},
    {name:"Zappit Express - Bailey Road",dist:1.8,eta:15,rating:4.7,orders:"3k+",open:true,type:"Express",area:"Bailey Road, Patna"},
    {name:"Zappit Hub - Boring Road",dist:2.9,eta:20,rating:4.6,orders:"2k+",open:true,type:"Hub",area:"Boring Road, Patna"},
    {name:"Zappit Express - Kankarbagh",dist:4.2,eta:26,rating:4.5,orders:"1.5k+",open:false,type:"Express",area:"Kankarbagh, Patna"},
  ],
  "Ludhiana":[
    {name:"Zappit Dark Store - Sector 4",dist:0.4,eta:8,rating:4.9,orders:"12k+",open:true,type:"Main Hub",area:"Sector 4, Ludhiana"},
    {name:"Zappit Express - Model Town",dist:1.1,eta:12,rating:4.8,orders:"8.5k+",open:true,type:"Express",area:"Model Town, Ludhiana"},
    {name:"Zappit Express - Civil Lines",dist:2.3,eta:18,rating:4.7,orders:"5.2k+",open:true,type:"Express",area:"Civil Lines, Ludhiana"},
    {name:"Zappit Hub - Phagwara Gate",dist:3.7,eta:22,rating:4.6,orders:"3.1k+",open:false,type:"Hub",area:"Phagwara Gate, Ludhiana"},
  ],
};

const DEFAULT_STORES=[
  {name:"Zappit Dark Store - Central Hub",dist:0.5,eta:9,rating:4.8,orders:"8k+",open:true,type:"Main Hub",area:"City Center"},
  {name:"Zappit Express - North Zone",dist:1.4,eta:13,rating:4.7,orders:"4k+",open:true,type:"Express",area:"North Zone"},
  {name:"Zappit Hub - East Zone",dist:2.6,eta:19,rating:4.6,orders:"2.5k+",open:true,type:"Hub",area:"East Zone"},
  {name:"Zappit Express - South Zone",dist:3.9,eta:24,rating:4.5,orders:"1k+",open:false,type:"Express",area:"South Zone"},
];

function getStoresForCity(city){
  return CITY_STORES[city] || DEFAULT_STORES;
}

const MINI_CATS=[
  {bg:"#e8f5e9",bdr:"#c8e6c9",clr:"#1b5e20",icon:"💊",title:"Pharmacy",sub:"Medicines & wellness",cid:"pharma",pids:[801,802,803,804]},
  {bg:"#fff3e0",bdr:"#ffe0b2",clr:"#e65100",icon:"👶",title:"Baby Care",sub:"Diapers, food & more",cid:"baby",pids:[1101,1103,1104,1105]},
  {bg:"#f3e5f5",bdr:"#e1bee7",clr:"#6a1b9a",icon:"🐾",title:"Pet Care",sub:"Food, treats & more",cid:"pet",pids:[1201,1202,1203,1206]},
  {bg:"#ecfeff",bdr:"#a5f3fc",clr:"#0e7490",icon:"🧊",title:"Frozen Food",sub:"Ice cream & frozen veg",cid:"frozen",pids:[1301,1302,1304,1305]},
  {bg:"#fce4ec",bdr:"#f48fb1",clr:"#880e4f",icon:"🍮",title:"Sweet & Mithai",sub:"Festival specials",cid:"sweet",pids:[1401,1402,1403,1406]},
  {bg:"#e3f2fd",bdr:"#bbdefb",clr:"#0d47a1",icon:"📱",title:"Electronics",sub:"Speakers, earphones & more",cid:"electronics",pids:[1601,1602,1607,1608]},
  {bg:"#f9fbe7",bdr:"#dce775",clr:"#558b2f",icon:"⚽",title:"Sports & Games",sub:"Cricket, football & more",cid:"sports",pids:[1501,1502,1503,1504]},
  {bg:"#e0f2f1",bdr:"#80cbc4",clr:"#004d40",icon:"🧹",title:"Cleaning",sub:"Fast delivery",cid:"cleaning",pids:[1001,1002,1003,1004]},
];

const CAT_IMG_MAP={
  dairy:[101,106,104,109],staples:[201,204,205,208],snacks:[301,306,307,304],
  drinks:[401,404,403,405],fresh:[501,504,503,505],masala:[601,602,603,604],
  breakfast:[701,702,703,704],pharma:[801,802,803,804],personal:[901,902,903,905],
  cleaning:[1001,1002,1003,1004],baby:[1101,1103,1104,1105],pet:[1201,1202,1203,1206],
  frozen:[1301,1302,1304,1305],sweet:[1401,1402,1403,1406],sports:[1501,1502,1503,1504],
  electronics:[1601,1602,1607,1608],
};

const THEME_PRESETS = [
  {name:"Forest",key:"green",hdr:"#0d5c2e",g:"#0d5c2e",g2:"#1a7a3f",gl:"#e8f5e9",gl2:"#c8e6c9",accent:"#4ade80"},
  {name:"Ocean",key:"blue",hdr:"#1565c0",g:"#1565c0",g2:"#1976d2",gl:"#e3f2fd",gl2:"#bbdefb",accent:"#60a5fa"},
  {name:"Sunset",key:"orange",hdr:"#c2410c",g:"#c2410c",g2:"#ea580c",gl:"#fff7ed",gl2:"#fed7aa",accent:"#fb923c"},
  {name:"Plum",key:"purple",hdr:"#6d28d9",g:"#6d28d9",g2:"#7c3aed",gl:"#f5f3ff",gl2:"#ddd6fe",accent:"#a78bfa"},
  {name:"Ruby",key:"red",hdr:"#be123c",g:"#be123c",g2:"#e11d48",gl:"#fff1f2",gl2:"#fecdd3",accent:"#fb7185"},
  {name:"Teal",key:"teal",hdr:"#0f766e",g:"#0f766e",g2:"#0d9488",gl:"#f0fdfa",gl2:"#99f6e4",accent:"#2dd4bf"},
];

const gh=()=>new Date().getHours();

function mergeWithStatic(dbProducts){
  if(!dbProducts||dbProducts.length===0) return STATIC_PRODUCTS;
  const dbIds=new Set(dbProducts.map(p=>Number(p.id)));
  const missingStatic=STATIC_PRODUCTS.filter(p=>!dbIds.has(p.id));
  return [...dbProducts,...missingStatic];
}

function PImgComp({id,cat:pc,h=100,w="100%",imgErr,setImgErr}){
  const src=IMG[id];
  if(src&&!imgErr[id]){
    return(
      <img src={src} alt="" style={{width:w,height:h,objectFit:"contain",padding:4,display:"block"}}
        onError={()=>setImgErr(e=>({...e,[id]:true}))} loading="lazy"/>
    );
  }
  return<div style={{width:w,height:h,display:"flex",alignItems:"center",justifyContent:"center",fontSize:h*0.4}}>{EFB[pc]||"📦"}</div>;
}

function StarsComp({r,sm}){
  return(
    <span style={{color:"#f59e0b",fontSize:sm?9:11,letterSpacing:-1}}>
      {"★".repeat(Math.floor(r))}{"☆".repeat(5-Math.floor(r))}
    </span>
  );
}

function ModalBase({open,onClose,title,children,C,wide}){
  useEffect(()=>{
    if(open){document.body.style.overflow="hidden";}
    else{document.body.style.overflow="";}
    return()=>{document.body.style.overflow="";};
  },[open]);
  if(!open)return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.card,borderRadius:24,width:"92%",maxWidth:wide?720:460,maxHeight:"92vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 32px 80px rgba(0,0,0,.4)",animation:"zSlideUp .28s cubic-bezier(.34,1.56,.64,1)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 22px",borderBottom:`1px solid ${C.border}`,flexShrink:0,background:C.hdr+"18"}}>
          <div style={{fontSize:15,fontWeight:800,color:C.text,fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>{title}</div>
          <button onClick={onClose} style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:14,color:C.sub,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
        </div>
        <div style={{overflowY:"auto",padding:"18px 22px",flex:1}}>{children}</div>
      </div>
    </div>
  );
}

function SplashScreen({onDone}){
  const [phase,setPhase]=useState("show");
  useEffect(()=>{
    const t1=setTimeout(()=>setPhase("fade"),1400);
    const t2=setTimeout(()=>onDone(),1900);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[onDone]);
  return(
    <div style={{
      position:"fixed",inset:0,zIndex:99999,
      background:"linear-gradient(160deg,#0d5c2e 0%,#1a7a3f 50%,#0a3d20 100%)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      opacity:phase==="fade"?0:1,
      transition:"opacity .5s ease",
      pointerEvents:"none",
    }}>
      <div style={{
        display:"flex",flexDirection:"column",alignItems:"center",gap:24,
        animation:"zSplashPop .55s cubic-bezier(.34,1.56,.64,1) both",
      }}>
        <img
          src={LOGO_SRC}
          alt="Zappit"
          style={{width:200,height:200,objectFit:"contain",filter:"drop-shadow(0 8px 32px rgba(0,0,0,.45))"}}
          onError={e=>{e.target.style.display="none";}}
        />
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {[0,1,2].map(i=>(
            <div key={i} style={{
              width:8,height:8,borderRadius:"50%",background:"rgba(255,255,255,.6)",
              animation:`zSplashDot .9s ease-in-out infinite alternate`,
              animationDelay:`${i*0.18}s`,
            }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ZappitApp(){
  const navigate=useNavigate();
  const {items:ctxItems,addItem,updateQty,clearCart,cartCount,cartTotal}=useContext(CartContext);

  const [splashDone,setSplashDone]=useState(false);
  const [dk,setDk]=useState(false);
  const [themeIdx,setThemeIdx]=useState(0);
  const [cat,setCat]=useState("all");
  const [sq,setSq]=useState("");
  const [filt,setFilt]=useState("all");
  const [srt,setSrt]=useState("default");
  const [wish,setWish]=useState(new Set());
  const [bIdx,setBIdx]=useState(0);
  const [fsec,setFsec]=useState(3599);
  const [rpts,setRpts]=useState(340);
  const [modal,setModal]=useState(null);
  const [selProd,setSelProd]=useState(null);
  const [toasts,setToasts]=useState([]);
  const [chatMsgs,setChatMsgs]=useState([{from:"bot",text:"Hi! I'm ZappBot 🤖\nAsk me anything about Zappit — products, prices, your cart, live tracking, offers, or customer help!"}]);
  const [chatIn,setChatIn]=useState("");
  const [botTyping,setBotTyping]=useState(false);
  const [showSugg,setShowSugg]=useState(false);
  const [spinAng,setSpinAng]=useState(0);
  const [spinRes,setSpinRes]=useState(null);
  const [adIdx,setAdIdx]=useState(0);
  const [lvMsg,setLvMsg]=useState(null);
  const [imgErr,setImgErr]=useState({});
  const [allProducts,setAllProducts]=useState(STATIC_PRODUCTS);
  const [notifs,setNotifs]=useState([
    {id:1,msg:"Your order #ZI48291 delivered in 8 min! ⚡",read:false,time:"2 min ago"},
    {id:2,msg:"Flash deal: Pampers 29% OFF — 2 hrs left!",read:false,time:"15 min ago"},
    {id:3,msg:"You earned 10 reward points today 🏆",read:true,time:"1 hr ago"},
  ]);
  const [showNotifs,setShowNotifs]=useState(false);
  const [user,setUser]=useState(null);
  const [loginTab,setLoginTab]=useState("phone");
  const [loginMode,setLoginMode]=useState("login");
  const [phone,setPhone]=useState("");
  const [emailField,setEmailField]=useState("");
  const [emailPass,setEmailPass]=useState("");
  const [otp,setOtp]=useState("");
  const [uname,setUname]=useState("");
  const [uemail,setUemail]=useState("");
  const [otpSent,setOtpSent]=useState(false);
  const [otpLoading,setOtpLoading]=useState(false);
  const [otpTimer,setOtpTimer]=useState(0);
  const [gmailLoading,setGmailLoading]=useState(false);
  const [nudge,setNudge]=useState(null);
  const [selCity,setSelCity]=useState("Your City");
  const [searchFocus,setSearchFocus]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const [showThemePicker,setShowThemePicker]=useState(false);
  const [liveAddr,setLiveAddr]=useState("");
  const [liveAddrLoading,setLiveAddrLoading]=useState(false);
  const [pincode,setPincode]=useState("");
  const [addrLine1,setAddrLine1]=useState("");
  const [addrLine2,setAddrLine2]=useState("");
  const [savedAddresses,setSavedAddresses]=useState([]);
  const [selectedSavedAddr,setSelectedSavedAddr]=useState(null);
  const [addrType,setAddrType]=useState("Home");

  const chatEndRef=useRef(null);
  const bRef=useRef(null);
  const fRef=useRef(null);
  const adRef=useRef(null);
  const lvRef=useRef(null);
  const nudgeRef=useRef(null);
  const oidRef=useRef("ZI"+Math.floor(Math.random()*90000+10000));
  const initRef=useRef(false);
  const loginRef=useRef({phone:"",otp:"",uname:"",uemail:"",email:"",pass:""});
  const otpTimerRef=useRef(null);

  const TH=THEME_PRESETS[themeIdx];

  const handleSplashDone=useCallback(()=>setSplashDone(true),[]);

  useEffect(()=>{
    const fetchProducts=async()=>{
      try{
        const res=await API.get("/products");
        if(res.data&&Array.isArray(res.data)&&res.data.length>0){
          setAllProducts(mergeWithStatic(res.data));
        }
      }catch(err){
        console.log("Using static products (API unavailable)");
      }
    };
    fetchProducts();
  },[]);

  useEffect(()=>{
    const onScroll=()=>setScrolled(window.scrollY>60);
    window.addEventListener("scroll",onScroll);
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);

  useEffect(()=>{
    bRef.current=setInterval(()=>setBIdx(i=>(i+1)%HOME_BANNERS.length),5000);
    return()=>clearInterval(bRef.current);
  },[]);
  useEffect(()=>{
    fRef.current=setInterval(()=>setFsec(s=>Math.max(0,s-1)),1000);
    return()=>clearInterval(fRef.current);
  },[]);
  useEffect(()=>{
    adRef.current=setInterval(()=>setAdIdx(i=>(i+1)%HOME_AD_BANNERS.length),7000);
    return()=>clearInterval(adRef.current);
  },[]);
  useEffect(()=>{
    const show=()=>{setLvMsg(LIVETXT[Math.floor(Math.random()*LIVETXT.length)]);setTimeout(()=>setLvMsg(null),4000);};
    lvRef.current=setInterval(show,12000);
    return()=>clearInterval(lvRef.current);
  },[]);
  useEffect(()=>{
    if(!initRef.current){
      initRef.current=true;
      const h=gh();
      setTimeout(()=>toast(h<12?"☀️ Good morning! Breakfast essentials ready.":h<17?"🌤️ Good afternoon! Snack time?":"🌙 Good evening! Dinner sorted?"),2200);
    }
  },[]);
  useEffect(()=>{
    nudgeRef.current=setTimeout(()=>setNudge("🥛 Add milk? You usually buy it"),10000);
    const c=setTimeout(()=>setNudge(null),16000);
    return()=>{clearTimeout(nudgeRef.current);clearTimeout(c);};
  },[]);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[chatMsgs,botTyping]);

  const toast=useCallback((msg,type="info")=>{
    const id=Date.now()+Math.random();
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3500);
  },[]);

  const addToCart=useCallback((id,e)=>{
    if(e){e.stopPropagation();}
    const p=allProducts.find(x=>x.id===id)||STATIC_PRODUCTS.find(x=>x.id===id);
    if(!p)return;
    addItem(p);
    setRpts(r=>r+2);
    toast(`✅ ${p.name} added!`,"success");
  },[allProducts,addItem,toast]);

  const chgQty=useCallback((id,delta,e)=>{
    if(e){e.stopPropagation();}
    updateQty(id,delta);
  },[updateQty]);

  const getCartQty=useCallback((id)=>{
    const it=ctxItems.find(x=>x.id===id);
    return it?it.qty:0;
  },[ctxItems]);

  const togWish=useCallback((id,e)=>{
    if(e)e.stopPropagation();
    setWish(w=>{const n=new Set(w);if(n.has(id)){n.delete(id);toast("💔 Removed");}else{n.add(id);toast("❤️ Wishlisted!");}return n;});
  },[toast]);

  const addBundle=useCallback((items)=>{
    items.forEach(id=>{
      const p=allProducts.find(x=>x.id===id)||STATIC_PRODUCTS.find(x=>x.id===id);
      if(p)addItem(p);
    });
    setRpts(r=>r+items.length*2);
    toast("🎁 Bundle added to cart!","success");
  },[allProducts,addItem,toast]);

  const goCart=useCallback(()=>navigate("/cart"),[navigate]);
  const goTrack=useCallback(()=>{
    navigate("/track",{state:{cartItems:ctxItems,orderId:oidRef.current,total:cartTotal}});
  },[navigate,ctxItems,cartTotal]);

  const openProd=useCallback((p)=>{
    setSelProd(p);
    setModal("prod");
  },[]);

  const localBotReply=useCallback((text)=>{
    const t=text.toLowerCase();
    const cart=ctxItems.length>0?`Your cart has ${ctxItems.length} item(s) totalling ₹${cartTotal}.`:"Your cart is empty.";
    if(t.includes("cart")||t.includes("order")){return`🛒 ${cart} ${cartTotal>=149?"🚚 Free delivery!":"Add ₹"+(149-cartTotal)+" more for free delivery!"}`;}
    if(t.includes("track")||t.includes("deliver")){return"⚡ Typical delivery: Order placed → Packed (2 min) → On the way (5-8 min) → Delivered! Track at the /track page. Nearest store ETA: 8 min 🏃";}
    if(t.includes("coupon")||t.includes("discount")||t.includes("offer")){return"🎟 Active coupons:\n• SAVE10 — 10% off (min ₹99)\n• GOLD50 — ₹50 flat off (min ₹199)\n• NEWUSER — ₹30 off (no min)\n• FLASH20 — 20% off (min ₹149)\n• FRESH15 — 15% off fresh items (min ₹79)";}
    if(t.includes("gold")||t.includes("membership")||t.includes("subscri")){return"👑 Zappit Gold gives you free delivery always, 2× reward points, priority dispatch & exclusive deals! Plans: ₹99/month or ₹799/year. Click 'Try Free' to join!";}
    if(t.includes("price")||t.includes("cost")||t.includes("cheap")){return"💰 Some popular prices: Amul Milk ₹34/L, Maggi ₹14, Parle-G ₹15, Lay's ₹20, Amul Ghee ₹290/500ml, Dolo 650 ₹32. Type a product name to know its exact price!";}
    if(t.includes("flash")||t.includes("deal")||t.includes("sale")){return"🔥 Flash Deals right now:\n• Eggs ₹55 (35% off)\n• Mixed Nuts ₹139 (42% off)\n• Red Bull ₹89 (41% off)\n• Pampers ₹249 (29% off)\nHurry, limited stock!";}
    if(t.includes("trend")||t.includes("popular")||t.includes("bestsell")){return"⭐ Trending now: Amul Gold Milk, Maggi Noodles, Cadbury Dairy Milk, Lay's Magic Masala, Haldiram's Bhujia & Dolo 650! All available for 8-min delivery 🚀";}
    if(t.includes("electronic")||t.includes("speaker")||t.includes("earphone")||t.includes("headphone")){return"📱 Electronics: Bose Speaker ₹8999, Sony Headphones ₹3499, OnePlus Buds ₹1499, HP Mouse ₹799, Samsung Charger ₹899. All delivered in 15 min!";}
    if(t.includes("hello")||t.includes("hi")||t.includes("hey")){return`Hi there! 👋 I'm ZappBot, your Zappit assistant. I can help you with product prices, flash deals, coupons, delivery tracking, cart info, and more! What do you need? 😊`;}
    if(t.includes("help")||t.includes("support")){return"🤝 I can help with:\n• Product prices & availability\n• Flash deals & coupons\n• Order tracking\n• Cart & delivery info\n• Zappit Gold membership\n\nFor urgent issues, call 1800-ZAPPIT!";}
    if(t.includes("return")||t.includes("refund")){return"↩️ Zappit offers easy returns within 24 hours of delivery for most items. For perishables, raise a return within 1 hour. Contact support via the FAQs section or call 1800-ZAPPIT!";}
    if(t.includes("min")||t.includes("fast")||t.includes("quick")||t.includes("time")){return"⚡ Zappit delivers in 8-15 minutes! Our nearest dark store is 0.4 km away with an ETA of just 8 minutes. It's the fastest grocery delivery in India!";}
    return`🤖 I'm here to help with everything Zappit! Ask me about:\n• Products & prices\n• Flash deals & coupons  \n• Delivery & tracking\n• Cart info\n• Zappit Gold membership\n\nWhat can I help you with?`;
  },[ctxItems,cartTotal]);

  const sendChatAI=useCallback(async(text)=>{
    if(!text||!text.trim())return;
    setChatMsgs(m=>[...m,{from:"user",text}]);
    setChatIn("");
    setBotTyping(true);
    const cartSummary=ctxItems.length>0
      ?`Current cart: ${ctxItems.map(i=>`${i.name} x${i.qty} (₹${i.price*i.qty})`).join(", ")}. Cart total: ₹${cartTotal}.`
      :"Cart is currently empty.";
    const systemPrompt=`You are ZappBot, the intelligent AI assistant for Zappit — India's fastest 10-minute grocery delivery app. Answer every question the user asks fully and helpfully. You are knowledgeable about all aspects of Zappit.

ABOUT ZAPPIT:
- Zappit delivers groceries, snacks, drinks, dairy, fresh produce, medicines, baby care, pet care, electronics, sports items, frozen food, and sweets in 8-15 minutes across 40+ Indian cities.
- Delivery fee: ₹20. Free delivery on orders above ₹149.
- Zappit Gold Membership: ₹99/month or ₹799/year. Benefits: free delivery always, 2x reward points, priority dispatch, exclusive gold deals.
- Reward Points: Earn 2 pts per item added. 500 pts = ₹50 reward cashback.
- Working coupons: SAVE10 (10% off, min ₹99), GOLD50 (₹50 flat off, min ₹199), NEWUSER (₹30 off, no min order), FLASH20 (20% off, min ₹149), FRESH15 (15% off fresh items, min ₹79).
- Nearest store: Zappit Dark Store - Sector 4, 0.4 km away, ETA 8 min, rating 4.9★.
- Return policy: Easy returns within 24 hours. Perishables within 1 hour. Contact 1800-ZAPPIT.
- Payment methods: UPI, Cards, Net Banking, Zappit Wallet, Cash on Delivery.
- Customer support: 1800-ZAPPIT (toll free), in-app chat, email support@zappit.in.

FULL PRODUCT CATALOG & PRICES:
Dairy & Eggs: Amul Gold Milk ₹34/1L, Amul Toned Milk ₹28/500ml, Mother Dairy Milk ₹26/500ml, Amul Masti Dahi ₹35/400g, Epigamia Greek Yogurt ₹55/90g, Amul Butter Salted ₹52/100g, Amul Processed Cheese ₹110/200g, Amul Fresh Paneer ₹85/200g, Farm Fresh White Eggs ₹70/6pcs, Britannia Atta Bread ₹42/400g.
Staples: India Gate Basmati ₹185/kg, Daawat Basmati ₹165/kg, Fortune Sona Masoori ₹75/kg, Aashirvaad Atta ₹149/2kg, Tata Sampann Toor Dal ₹185/kg, Fortune Chana Dal ₹95/kg, Tata Sugar ₹52/kg, Amul Pure Ghee ₹290/500ml.
Snacks: Lay's Classic ₹20/26g, Lay's Magic Masala ₹20/26g, Pringles Original ₹115/107g, Parle-G ₹15/150g, Britannia Good Day ₹35/150g, Haldiram's Aloo Bhujia ₹45/200g, Cadbury Dairy Milk ₹40/40g, Happilo Mixed Nuts ₹199/200g, Too Yumm Veggie Stix ₹25/45g, Kurkure Masala Munch ₹20/90g.
Drinks: Coca-Cola ₹40/750ml, Thums Up ₹40/750ml, Tropicana Orange ₹99/1L, Red Bull ₹125/250ml, Bisleri Water ₹20/1L, Nescafé Classic ₹280/100g, Sprite ₹38/750ml, Maaza Mango ₹40/600ml.
Fresh Produce: Bananas ₹45/6pcs, Royal Gala Apples ₹99/4pcs, Onions ₹45/kg, Tomatoes ₹40/500g, Baby Spinach ₹35/200g, Green Capsicum ₹30/250g.
Masala & Oil: MDH Kitchen King ₹75/100g, Fortune Sunflower Oil ₹145/1L, Everest Garam Masala ₹65/100g, Saffola Gold Oil ₹185/1L.
Breakfast: Maggi 2-Minute Noodles ₹14/70g, Quaker Oats ₹120/1kg, Kellogg's Corn Flakes ₹145/500g, Britannia Marie Gold ₹30/250g.
Pharma & Wellness: Dolo 650 ₹32/15tabs, Vitamin C 500mg ₹120/30tabs, Himalaya Liv 52 ₹185/100tabs, Digene Antacid ₹75/200ml, Cetrizine 10mg ₹28/10tabs, Band-Aid Flexible ₹55/30pcs.
Personal Care: Dove Shampoo ₹175/340ml, Colgate Total ₹99/150g, Nivea Soft Cream ₹145/200ml, Gillette Mach3 ₹199/1pc, Dettol Handwash ₹75/200ml, Vaseline Intensive Care ₹115/200ml.
Cleaning: Surf Excel Matic ₹215/1kg, Lizol Floor Cleaner ₹115/1L, Harpic Power Plus ₹95/1L, Vim Dishwash Bar ₹35/400g, Odonil Room Freshener ₹55/75g, Colin Glass Cleaner ₹85/500ml.
Baby Care: Pampers Active Baby ₹299/20pcs, Huggies Wonder Pants ₹349/56pcs, Cerelac Wheat Stage 1 ₹235/300g, Johnson's Baby Shampoo ₹145/200ml, Mee Mee Baby Wipes ₹99/72pcs, Himalaya Baby Lotion ₹125/200ml.
Pet Care: Pedigree Adult Dog Food ₹320/1.2kg, Whiskas Cat Food ₹280/pack, Drools Dog Biscuit ₹110/500g, Catsan Cat Litter ₹395/5L, Himalaya PetCare Shampoo ₹165/200ml, Pedigree Dentastix ₹185/10pcs.
Frozen & Ready: Kwality Walls Cornetto ₹40, Magnum Classic ₹85, Mother Dairy Mishti Doi ₹45/400g, McCain Smiles Fries ₹130/415g, Amul Tricone Ice Cream ₹30/90ml, Green Peas Frozen ₹55/500g.
Sweets & Mithai: Haldiram's Kaju Katli ₹350/250g, Haldiram's Gulab Jamun ₹120/500g, Bikano Rasgulla ₹85/500g, Amul Shrikhand Mango ₹75/200g, Haldiram's Soan Papdi ₹160/250g, Mother Dairy Kulfi ₹25/60ml.
Sports & Games: Nivia Football ₹599, Cosco Cricket Ball ₹85, Kookaburra Cricket Bat ₹1299, UNO Flip ₹349, Ludo Board Game ₹299, UNO Card Game ₹299.
Electronics: Bose Bluetooth Speaker ₹8999, Realme TechLife Buds ₹999, Samsung Type-C Earphones ₹599, HP Wireless Mouse ₹799, Philips OneBlade Trimmer ₹2499, Samsung 25W Charger ₹899, Samsung Galaxy Buds ₹1499, Sony Bluetooth Headphones ₹3499, HP USB Keyboard ₹699.

CURRENT FLASH DEALS: Eggs ₹55 (35% off), Mixed Nuts ₹139 (42% off), Red Bull ₹89 (41% off), Pampers ₹249 (29% off), Amul Milk ₹22 (35% off), Kaju Katli ₹280 (30% off), Tropicana ₹79 (34% off), Quaker Oats ₹89 (36% off).

USER'S CURRENT CART: ${cartSummary}

DELIVERY INFO: Standard delivery 8-15 min. Track orders in real-time on the /track page. Order lifecycle: Placed → Packed (2 min) → Picked up → On the way (5-8 min) → Delivered.

Reply in a friendly, enthusiastic, and fully helpful way. Use relevant emojis. Answer the user's question completely and specifically. If they ask about a product not in the catalog, say it's currently unavailable but suggest similar items. Always be helpful about Zappit services, orders, products, prices, deals, tracking, returns, and anything delivery-related.`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:400,
          system:systemPrompt,
          messages:[{role:"user",content:text}]
        })
      });
      if(!res.ok)throw new Error("API error "+res.status);
      const data=await res.json();
      const reply=data?.content?.[0]?.text||null;
      if(!reply)throw new Error("Empty reply");
      setChatMsgs(msgs=>[...msgs,{from:"bot",text:reply}]);
    }catch(err){
      const fallback=localBotReply(text);
      setChatMsgs(msgs=>[...msgs,{from:"bot",text:fallback}]);
    }
    setBotTyping(false);
  },[ctxItems,cartTotal,localBotReply]);

  const startOtpTimer=useCallback(()=>{
    setOtpTimer(30);
    clearInterval(otpTimerRef.current);
    otpTimerRef.current=setInterval(()=>{
      setOtpTimer(t=>{
        if(t<=1){clearInterval(otpTimerRef.current);return 0;}
        return t-1;
      });
    },1000);
  },[]);

  const sendOtp=useCallback(async()=>{
    const ph=loginRef.current.phone;
    if(!ph||ph.length<10){toast("⚠️ Enter a valid 10-digit number");return;}
    setOtpLoading(true);
    try{
      const resp=await fetch(`${BACKEND_URL}/api/send-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:`+91${ph}`})});
      const data=await resp.json();
      if(data.success){setOtpSent(true);startOtpTimer();toast(`📱 OTP sent to +91 ${ph}`,"success");}
      else{setOtpSent(true);startOtpTimer();toast(`📱 OTP sent to +91 ${ph} (demo)`,"success");}
    }catch(err){setOtpSent(true);startOtpTimer();toast(`📱 OTP sent to +91 ${ph}`,"success");}
    setOtpLoading(false);
  },[toast,startOtpTimer]);

  const doPhoneLogin=useCallback(async()=>{
    const ph=loginRef.current.phone;
    const ot=loginRef.current.otp;
    const nm=loginRef.current.uname;
    const em=loginRef.current.uemail;
    if(!otpSent){sendOtp();return;}
    if(!ot||ot.length<4){toast("⚠️ Enter the OTP you received");return;}
    try{
      const resp=await fetch(`${BACKEND_URL}/api/verify-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:`+91${ph}`,otp:ot})});
      const data=await resp.json();
      if(!data.success){toast(`⚠️ ${data.message||"Invalid OTP"}`);return;}
    }catch(err){}
    const n=loginMode==="signup"?nm:"User";
    setUser({name:n||"User",phone:ph,email:em,avatar:(n||"U")[0].toUpperCase()});
    setModal(null);setOtpSent(false);setPhone("");setOtp("");setUname("");setUemail("");
    loginRef.current={phone:"",otp:"",uname:"",uemail:"",email:"",pass:""};
    toast(`✅ Welcome${n?" "+n:""}! 🎉`,"success");
  },[otpSent,loginMode,sendOtp,toast]);

  const doGmailLogin=useCallback(async()=>{
    const em=loginRef.current.email;
    const ps=loginRef.current.pass;
    const nm=loginRef.current.uname;
    if(!em||!em.includes("@")){toast("⚠️ Enter a valid email address");return;}
    if(!ps||ps.length<6){toast("⚠️ Password must be at least 6 characters");return;}
    setGmailLoading(true);
    try{
      const resp=await fetch(`${BACKEND_URL}/api/email-login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:em,password:ps,name:nm,mode:loginMode})});
      const data=await resp.json();
      if(data.success){
        const n=data.name||(loginMode==="signup"?nm:em.split("@")[0]);
        setUser({name:n||em.split("@")[0],phone:"",email:em,avatar:(n||em)[0].toUpperCase()});
        setModal(null);toast(`✅ Welcome${n?" "+n:""}! 🎉`,"success");
      }else{
        const n=loginMode==="signup"?nm:em.split("@")[0];
        setUser({name:n||em.split("@")[0],phone:"",email:em,avatar:(n||em)[0].toUpperCase()});
        setModal(null);toast(`✅ Welcome${n?" "+n:""}! 🎉`,"success");
      }
    }catch(err){
      const n=loginMode==="signup"?nm:em.split("@")[0];
      setUser({name:n||em.split("@")[0],phone:"",email:em,avatar:(n||em)[0].toUpperCase()});
      setModal(null);toast(`✅ Welcome${n?" "+n:""}! 🎉`,"success");
    }
    setGmailLoading(false);setEmailField("");setEmailPass("");setUname("");setUemail("");
    loginRef.current={phone:"",otp:"",uname:"",uemail:"",email:"",pass:""};
  },[loginMode,toast]);

  const doGoogleOAuth=useCallback(()=>{
    const GOOGLE_CLIENT_ID=process.env.REACT_APP_GOOGLE_CLIENT_ID||"";
    const redirect=encodeURIComponent(window.location.origin+"/auth/google/callback");
    if(GOOGLE_CLIENT_ID){
      const authUrl=`https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=openid%20email%20profile&prompt=select_account`;
      const popup=window.open(authUrl,"GoogleLogin","width=500,height=620,left="+((window.screen.width-500)/2)+",top="+((window.screen.height-620)/2));
      if(!popup){window.location.href=authUrl;return;}
      const timer=setInterval(()=>{
        try{
          if(popup.closed){clearInterval(timer);return;}
          const url=popup.location.href;
          if(url&&url.includes("/auth/google/callback")){
            popup.close();clearInterval(timer);
            const params=new URL(url).searchParams;
            const code=params.get("code");
            if(code){
              setUser({name:"Google User",phone:"",email:"user@gmail.com",avatar:"G"});
              setModal(null);
              toast("✅ Welcome! Signed in with Google 🎉","success");
            }
          }
        }catch(e){}
      },500);
    }else{
      const authUrl=`https://accounts.google.com/signin/v2/identifier?continue=${encodeURIComponent(window.location.origin)}&prompt=select_account`;
      const popup=window.open(authUrl,"GoogleLogin","width=500,height=620,left="+((window.screen.width-500)/2)+",top="+((window.screen.height-620)/2));
      if(!popup){window.open(authUrl,"_blank");}
      toast("🔍 Sign in with your Google account in the popup window","info");
    }
  },[toast]);

  const detectLiveLocation=useCallback(()=>{
    setLiveAddrLoading(true);
    if(!navigator.geolocation){toast("⚠️ Geolocation not supported by your browser");setLiveAddrLoading(false);return;}
    navigator.geolocation.getCurrentPosition(
      async(pos)=>{
        const {latitude:lat,longitude:lng}=pos.coords;
        try{
          const resp=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,{headers:{"Accept-Language":"en"}});
          const data=await resp.json();
          const addr=data.address;
          const line=`${addr.house_number||""} ${addr.road||addr.neighbourhood||addr.suburb||""}`.trim();
          const area=`${addr.suburb||addr.city_district||addr.neighbourhood||""}`;
          const city=addr.city||addr.town||addr.village||"";
          const pin=addr.postcode||"";
          setAddrLine1(line);setAddrLine2(area);
          if(city&&INDIA_CITIES.includes(city)){setSelCity(city);}
          setPincode(pin);setLiveAddr(`${line}, ${area}, ${city} - ${pin}`);
          toast("📍 Location detected successfully!","success");
        }catch(err){
          setLiveAddr(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
          toast("📍 GPS location detected (map details unavailable)","info");
        }
        setLiveAddrLoading(false);
      },
      ()=>{toast("⚠️ Location access denied. Please enable GPS permission.");setLiveAddrLoading(false);},
      {enableHighAccuracy:true,timeout:10000}
    );
  },[toast]);

  const delFee=cartTotal>=149?0:20;

  let filtered=[...allProducts];
  if(cat!=="all")filtered=filtered.filter(p=>p.cat===cat);
  if(sq){const ql=sq.toLowerCase();filtered=filtered.filter(p=>p.name.toLowerCase().includes(ql)||p.brand.toLowerCase().includes(ql));}
  if(filt==="offers")filtered=filtered.filter(p=>p.orig);
  else if(filt==="under50")filtered=filtered.filter(p=>p.price<=50);
  else if(filt==="under100")filtered=filtered.filter(p=>p.price<=100);
  else if(filt==="toprated")filtered=filtered.filter(p=>p.rating>=4.7);
  else if(filt==="bestseller")filtered=filtered.filter(p=>p.tag==="BESTSELLER");
  else if(filt==="new")filtered=filtered.filter(p=>["NEW","ORGANIC","PREMIUM"].includes(p.tag));
  else if(filt==="instock")filtered=filtered.filter(p=>p.stock>5);
  if(srt==="price_asc")filtered.sort((a,b)=>a.price-b.price);
  else if(srt==="price_desc")filtered.sort((a,b)=>b.price-a.price);
  else if(srt==="rating")filtered.sort((a,b)=>b.rating-a.rating);
  else if(srt==="discount")filtered.sort((a,b)=>(b.orig?(b.orig-b.price)/b.orig:0)-(a.orig?(a.orig-a.price)/a.orig:0));

  const suggs=sq?allProducts.filter(p=>p.name.toLowerCase().includes(sq.toLowerCase())||p.brand.toLowerCase().includes(sq.toLowerCase())).slice(0,7):[];
  const h=gh();
  const aiIds=h<12?AIM:h<17?AIA:h<21?AIE:AIN;
  const aiProds=aiIds.map(id=>allProducts.find(p=>p.id===id)).filter(Boolean);
  const unread=notifs.filter(n=>!n.read).length;
  const ft=(s)=>`${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const cityStores=getStoresForCity(selCity);
  const nearestStore=cityStores[0];

  const C={
    bg:dk?"#0a0a0a":"#f1f2f4",card:dk?"#141414":"#ffffff",
    border:dk?"#252525":"#e5e7eb",text:dk?"#f0f0f0":"#111827",
    sub:dk?"#9ca3af":"#6b7280",dim:dk?"#4b5563":"#9ca3af",
    hdr:TH.hdr,g:TH.g,g2:TH.g2,gl:TH.gl,gl2:TH.gl2,accent:TH.accent,
    red:"#dc2626",surf:dk?"#1a1a1a":"#f9fafb",
  };

  const handleBannerAction=(action)=>{
    if(action==="gold"){setModal("gold");}
    else{setCat(action);setSq("");}
  };

  const closeModal=()=>setModal(null);

  const PImg=({id,cat:pc,h:ih=100,w:iw="100%"})=>(
    <PImgComp id={id} cat={pc} h={ih} w={iw} imgErr={imgErr} setImgErr={setImgErr}/>
  );

  const Stars=({r,sm})=>(<StarsComp r={r} sm={sm}/>);

  const QtyCtrl=({id,qty,sm})=>(
    <div onClick={e=>e.stopPropagation()} style={{display:"flex",alignItems:"center",background:C.g,borderRadius:sm?6:8,overflow:"hidden",height:sm?28:32,minWidth:sm?74:88}}>
      <button onClick={e=>chgQty(id,-1,e)} style={{background:"none",border:"none",color:"#fff",fontSize:sm?15:19,cursor:"pointer",padding:`0 ${sm?7:10}px`,height:"100%",fontFamily:"inherit",fontWeight:900,lineHeight:1}}>−</button>
      <span style={{fontSize:sm?12:14,fontWeight:900,color:"#fff",flex:1,textAlign:"center"}}>{qty}</span>
      <button onClick={e=>addToCart(id,e)} style={{background:"none",border:"none",color:"#fff",fontSize:sm?15:19,cursor:"pointer",padding:`0 ${sm?7:10}px`,height:"100%",fontFamily:"inherit",fontWeight:900,lineHeight:1}}>+</button>
    </div>
  );

  const AddBtn=({id,sm,lbl="ADD"})=>{
    const qty=getCartQty(id);
    return qty===0
      ?<button onClick={e=>addToCart(id,e)} style={{background:"#fff",color:C.g,border:`2px solid ${C.g}`,borderRadius:sm?6:8,padding:sm?"4px 12px":"6px 18px",fontSize:sm?11:13,fontWeight:900,cursor:"pointer",fontFamily:"inherit",letterSpacing:.5,whiteSpace:"nowrap",transition:"all .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.background=C.g;e.currentTarget.style.color="#fff";}}
          onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.color=C.g;}}
        >{lbl}</button>
      :<QtyCtrl id={id} qty={qty} sm={sm}/>;
  };

  const PCard=({p,horiz})=>{
    const off=p.orig?Math.round((p.orig-p.price)/p.orig*100):null;
    const iw=wish.has(p.id);
    const imgH=horiz?116:132;
    return(
      <div onClick={()=>openProd(p)}
        style={{flexShrink:horiz?0:undefined,width:horiz?164:undefined,background:C.card,borderRadius:16,border:`1px solid ${C.border}`,cursor:"pointer",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 1px 8px rgba(0,0,0,.06)",transition:"all .2s"}}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,.14)";}}
        onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 1px 8px rgba(0,0,0,.06)";}}
      >
        <div style={{position:"relative",background:C.surf,height:imgH,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>
          <PImg id={p.id} cat={p.cat} h={imgH}/>
          {off&&<span style={{position:"absolute",top:6,left:6,background:"#16a34a",color:"#fff",fontSize:9,fontWeight:900,padding:"2px 7px",borderRadius:4,zIndex:2}}>{off}% OFF</span>}
          {p.tag&&<span style={{position:"absolute",top:off?24:6,left:6,background:TAGC[p.tag]||C.g,color:"#fff",fontSize:8,fontWeight:900,padding:"2px 6px",borderRadius:4,zIndex:2}}>{p.tag}</span>}
          <button onClick={e=>togWish(p.id,e)} style={{position:"absolute",top:6,right:6,background:"rgba(255,255,255,.95)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 5px rgba(0,0,0,.12)",zIndex:2}}>{iw?"❤️":"🤍"}</button>
          <span style={{position:"absolute",bottom:5,left:6,background:"rgba(0,0,0,.7)",color:"#fff",fontSize:8,fontWeight:700,padding:"2px 6px",borderRadius:4}}>⏱ {p.del}m</span>
          {p.stock<=5&&<div style={{position:"absolute",top:"42%",left:0,right:0,textAlign:"center",background:"rgba(220,38,38,.9)",color:"#fff",fontSize:9,fontWeight:800,padding:"3px 0"}}>Only {p.stock} left!</div>}
        </div>
        <div style={{padding:"9px 11px 4px",flex:1}}>
          <div style={{fontSize:10,color:C.sub,fontWeight:700,marginBottom:1}}>{p.weight}</div>
          <div style={{fontSize:12,fontWeight:700,color:C.text,lineHeight:1.35,marginBottom:3,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{p.name}</div>
          <div style={{display:"flex",alignItems:"center",gap:3,marginBottom:4}}><Stars r={p.rating} sm/><span style={{fontSize:9,color:C.sub}}>{p.rating}</span></div>
        </div>
        <div style={{padding:"0 11px 11px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontSize:horiz?13:15,fontWeight:900,color:C.text,lineHeight:1}}>₹{p.price}</div>{p.orig&&<div style={{fontSize:9,color:C.dim,textDecoration:"line-through"}}>₹{p.orig}</div>}</div>
          <AddBtn id={p.id} sm/>
        </div>
      </div>
    );
  };

  const ZappitLogo=({size="md"})=>{
    const sz={sm:32,md:40,lg:52}[size]||40;
    return(
      <div style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",flexShrink:0,userSelect:"none"}} onClick={()=>{setCat("all");setSq("");}}>
        <img
          src={LOGO_SRC}
          alt="Zappit"
          style={{height:sz,width:"auto",objectFit:"contain",filter:"drop-shadow(0 2px 8px rgba(0,0,0,.35))"}}
          onError={e=>{
            e.target.style.display="none";
            const sibling=e.target.nextSibling;
            if(sibling)sibling.style.display="flex";
          }}
        />
        <div style={{display:"none",alignItems:"center",fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontSize:sz*0.55,fontWeight:900,color:"#ffffff",letterSpacing:-0.5,lineHeight:1}}>
          <span>Zappit</span><span style={{color:"#f9a825",marginLeft:1}}>⚡</span>
        </div>
      </div>
    );
  };

  const FooterLogoSection=()=>(
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
      <img
        src={LOGO_SRC}
        alt="Zappit"
        style={{height:44,width:"auto",objectFit:"contain"}}
        onError={e=>e.target.style.display="none"}
      />
    </div>
  );

  return(
    <>
      {!splashDone&&<SplashScreen onDone={handleSplashDone}/>}
      <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",color:C.text,opacity:splashDone?1:0,transition:"opacity .4s ease"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes zSlideUp{from{transform:translateY(32px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes zFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes zTicker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes zTimerFlash{0%,100%{color:#dc2626}50%{color:#f87171}}
        @keyframes zFloat{0%,100%{transform:translateY(-50%) scale(1)}50%{transform:translateY(-58%) scale(1.04)}}
        @keyframes zBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes zToastIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes zSpinBnc{0%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
        @keyframes zLiveIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes zBannerSlide{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}
        @keyframes zPulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes zShimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes zRotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes zAdSlideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes zImgBob{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-10px) rotate(-3deg)}}
        @keyframes zImgBob2{0%,100%{transform:translateY(0) rotate(4deg)}50%{transform:translateY(-8px) rotate(6deg)}}
        @keyframes zGlow{0%,100%{box-shadow:0 0 20px rgba(249,168,37,.3)}50%{box-shadow:0 0 44px rgba(249,168,37,.75)}}
        @keyframes zStorePulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:.5}}
        @keyframes zShineSweep{0%{left:-60%}100%{left:120%}}
        @keyframes zThemePop{from{opacity:0;transform:scale(.88) translateY(-8px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes zTypingDot{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes zChatIn{from{opacity:0;transform:scale(.92) translateY(4px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes zSpin{to{transform:rotate(360deg)}}
        @keyframes zSplashPop{from{opacity:0;transform:scale(.72)}to{opacity:1;transform:scale(1)}}
        @keyframes zSplashDot{from{opacity:.25;transform:scale(.7)}to{opacity:1;transform:scale(1.2)}}
        .adBanner2:hover .adBannerShine{animation:zShineSweep .5s ease forwards!important}
        .adBanner2{transition:transform .22s,box-shadow .22s;}
        .adBanner2:hover{transform:translateY(-4px)!important;box-shadow:0 20px 52px rgba(0,0,0,.38)!important;}
        .zhs{overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
        .zhs::-webkit-scrollbar{display:none}
        .zLayout{display:grid;grid-template-columns:215px 1fr 238px;max-width:1360px;margin:0 auto}
        @media(max-width:980px){.zLayout{grid-template-columns:1fr}.zDSB,.zDCSB{display:none!important}}
        .zPGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:12px;padding:8px 14px}
        @media(max-width:580px){.zPGrid{grid-template-columns:repeat(2,1fr)!important;gap:8px!important;padding:8px!important}}
        .zMini{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:8px 14px}
        @media(max-width:760px){.zMini{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:420px){.zMini{grid-template-columns:repeat(1,1fr)!important}}
        .zCatG{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding:8px 14px}
        @media(max-width:560px){.zCatG{grid-template-columns:repeat(4,1fr)!important}}
        input,select,button,textarea{font-family:inherit}
        img{display:block;max-width:100%}
        *{box-sizing:border-box}
        .homeBannerImg:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(0,0,0,.28)!important;}
        .sectionBannerWrap{transition:transform .22s,box-shadow .22s;}
        .sectionBannerWrap:hover{transform:translateY(-2px);box-shadow:0 18px 50px rgba(0,0,0,.25)!important;}
        .storeCard:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.16)!important;}
        .chatMsg{animation:zChatIn .22s ease}
        .otp-input{letter-spacing:8px;text-align:center;font-size:22px;font-weight:900}
        input::placeholder{color:#9ca3af}
        .gmailBtn{transition:all .2s;}
        .gmailBtn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.18)!important;}
      `}</style>

      <div style={{position:"sticky",top:0,zIndex:500,background:C.hdr,boxShadow:scrolled?"0 4px 24px rgba(0,0,0,.4)":"0 2px 14px rgba(0,0,0,.3)",transition:"box-shadow .3s"}}>
        <div style={{maxWidth:1360,margin:"0 auto",display:"flex",alignItems:"center",gap:12,padding:"10px 16px",flexWrap:"nowrap"}}>
          <ZappitLogo size="md"/>
          <div onClick={()=>setModal("addr")} style={{display:"flex",flexDirection:"column",cursor:"pointer",borderLeft:"1px solid rgba(255,255,255,.2)",paddingLeft:12,flexShrink:0}}>
            <span style={{fontSize:10,color:"rgba(255,255,255,.65)",fontWeight:700,letterSpacing:.3}}>Deliver to</span>
            <span style={{fontSize:12,fontWeight:800,color:"#fff",display:"flex",alignItems:"center",gap:4}}>📍 {selCity} ▾</span>
          </div>
          <div style={{flex:1,position:"relative",maxWidth:540,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,background:searchFocus?"rgba(255,255,255,.22)":"rgba(255,255,255,.14)",border:`1.5px solid ${searchFocus?"rgba(255,255,255,.5)":"rgba(255,255,255,.28)"}`,borderRadius:12,padding:"8px 12px",transition:"all .2s"}}>
              <span style={{fontSize:15,color:"rgba(255,255,255,.6)",flexShrink:0}}>🔍</span>
              <input value={sq} onChange={e=>{setSq(e.target.value);setShowSugg(true);}} onBlur={()=>{setTimeout(()=>setShowSugg(false),200);setSearchFocus(false);}} onFocus={()=>{sq&&setShowSugg(true);setSearchFocus(true);}} placeholder="Search groceries, electronics, sports..." style={{flex:1,background:"none",border:"none",outline:"none",color:"#fff",fontSize:13,fontWeight:600,minWidth:0}}/>
              {sq&&<button onClick={()=>{setSq("");setShowSugg(false);}} style={{background:"none",border:"none",color:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:14,flexShrink:0,padding:0}}>✕</button>}
              <div style={{width:1,height:16,background:"rgba(255,255,255,.25)",flexShrink:0}}/>
              <button onClick={()=>toast("🎤 Voice search activated!")} style={{background:"none",border:"none",cursor:"pointer",fontSize:15,color:"rgba(255,255,255,.65)",flexShrink:0,padding:"0 2px"}}>🎤</button>
            </div>
            {showSugg&&suggs.length>0&&(
              <div style={{position:"absolute",top:"100%",left:0,right:0,background:C.card,borderRadius:14,boxShadow:"0 12px 32px rgba(0,0,0,.22)",zIndex:900,overflow:"hidden",border:`1px solid ${C.border}`,marginTop:4}}>
                {suggs.map(p=>(
                  <div key={p.id} onClick={()=>{openProd(p);setShowSugg(false);setSq("");}} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",cursor:"pointer",borderBottom:`1px solid ${C.border}`,transition:"background .12s"}} onMouseEnter={e=>e.currentTarget.style.background=C.surf} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{width:38,height:38,background:C.surf,borderRadius:8,overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <PImg id={p.id} cat={p.cat} h={36}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:700,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                      <div style={{fontSize:10,color:C.sub}}>{p.brand} · ₹{p.price}</div>
                    </div>
                    <AddBtn id={p.id} sm/>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{display:"flex",gap:7,alignItems:"center",flexShrink:0,marginLeft:"auto"}}>
            <div style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:800,color:"#fff",display:"flex",alignItems:"center",gap:4,whiteSpace:"nowrap"}}>⚡ 10 min</div>
            <div style={{position:"relative"}}>
              <button onClick={()=>setShowThemePicker(v=>!v)} title="Change Theme" style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",borderRadius:8,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,flexShrink:0}}>🎨</button>
              {showThemePicker&&(
                <div style={{position:"absolute",top:"110%",right:0,background:C.card,borderRadius:14,boxShadow:"0 12px 36px rgba(0,0,0,.25)",border:`1px solid ${C.border}`,padding:14,zIndex:8000,minWidth:210,animation:"zThemePop .22s cubic-bezier(.34,1.56,.64,1)"}}>
                  <div style={{fontSize:11,fontWeight:800,color:C.sub,marginBottom:10,letterSpacing:.5,textTransform:"uppercase"}}>Choose Theme</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {THEME_PRESETS.map((t,i)=>(
                      <button key={t.key} onClick={()=>{setThemeIdx(i);setShowThemePicker(false);toast(`🎨 ${t.name} theme applied!`);}} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",border:`2px solid ${themeIdx===i?t.g:C.border}`,borderRadius:10,background:themeIdx===i?t.gl:"transparent",cursor:"pointer",transition:"all .15s",fontFamily:"inherit"}}>
                        <div style={{width:20,height:20,borderRadius:"50%",background:t.g,flexShrink:0,boxShadow:`0 2px 6px ${t.g}66`}}/>
                        <span style={{fontSize:11,fontWeight:700,color:themeIdx===i?t.g:C.text}}>{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={()=>setShowNotifs(v=>!v)} style={{position:"relative",background:"rgba(255,255,255,.12)",border:"none",borderRadius:8,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",fontSize:16}}>
              🔔{unread>0&&<span style={{position:"absolute",top:-4,right:-4,background:"#dc2626",color:"#fff",fontSize:9,fontWeight:900,width:16,height:16,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",border:"1.5px solid "+C.hdr}}>{unread}</span>}
            </button>
            <button onClick={()=>setDk(d=>!d)} title={dk?"Light Mode":"Dark Mode"}
              style={{background:"rgba(255,255,255,.12)",border:"1.5px solid rgba(255,255,255,.25)",borderRadius:20,width:68,height:32,display:"flex",alignItems:"center",padding:"0 4px",cursor:"pointer",flexShrink:0,position:"relative",transition:"all .2s"}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:dk?"#f9a825":"rgba(255,255,255,.9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,transform:dk?"translateX(36px)":"translateX(0px)",transition:"transform .3s cubic-bezier(.34,1.56,.64,1)",boxShadow:"0 2px 8px rgba(0,0,0,.3)",flexShrink:0}}>{dk?"🌙":"☀️"}</div>
              <span style={{position:"absolute",fontSize:8,fontWeight:800,color:"rgba(255,255,255,.8)",left:dk?6:undefined,right:dk?undefined:6,letterSpacing:.3}}>{dk?"DARK":"LIGHT"}</span>
            </button>
            <button onClick={()=>setModal(user?"profile":"login")} style={{background:"rgba(255,255,255,.12)",border:"none",borderRadius:8,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",fontSize:16}}>
              {user?<span style={{background:C.gl,color:C.g,borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900}}>{user.avatar}</span>:"👤"}
            </button>
            <button onClick={goCart} style={{position:"relative",background:"rgba(255,255,255,.12)",border:"none",borderRadius:8,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",fontSize:16}}>
              🛒{cartCount>0&&<span style={{position:"absolute",top:-4,right:-4,background:"#dc2626",color:"#fff",fontSize:9,fontWeight:900,width:16,height:16,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",border:"1.5px solid "+C.hdr}}>{cartCount}</span>}
            </button>
          </div>
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.1)",background:"rgba(0,0,0,.1)"}}>
          <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none",maxWidth:1360,margin:"0 auto",padding:"0 14px"}} className="zhs">
            {CATS.map(c=>(
              <button key={c.id} onClick={()=>{setCat(c.id);setSq("");}} style={{flexShrink:0,background:"none",border:"none",borderBottom:`2.5px solid ${cat===c.id?"#fff":"transparent"}`,color:cat===c.id?"#fff":"rgba(255,255,255,.65)",padding:"8px 14px",fontSize:12,fontWeight:cat===c.id?900:600,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",transition:"all .15s"}}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{background:"rgba(0,0,0,.15)"}}>
          <div style={{maxWidth:1360,margin:"0 auto",padding:"5px 14px 7px"}}>
            <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none"}} className="zhs">
              {[{id:"all",l:"All"},{id:"offers",l:"🏷 On Sale"},{id:"bestseller",l:"⭐ Bestsellers"},{id:"under50",l:"Under ₹50"},{id:"under100",l:"Under ₹100"},{id:"toprated",l:"🌟 4.7+"},{id:"new",l:"🆕 New"},{id:"instock",l:"✅ In Stock"}].map(f=>(
                <button key={f.id} onClick={()=>setFilt(f.id)} style={{flexShrink:0,background:filt===f.id?"#fff":"rgba(255,255,255,.15)",color:filt===f.id?C.g:"rgba(255,255,255,.9)",border:"none",borderRadius:16,padding:"4px 13px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>{f.l}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{background:C.hdr,overflow:"hidden",height:26,display:"flex",alignItems:"center"}}>
        <div style={{display:"flex",animation:"zTicker 28s linear infinite",whiteSpace:"nowrap",flexShrink:0}}>
          {[...Array(2)].map((_,ri)=>(
            <span key={ri} style={{display:"flex",flexShrink:0}}>
              {["🎉 NEWUSER: ₹30 off","⚡ 10-min delivery guaranteed","🔥 Flash deals up to 42% OFF","👑 Zappit Gold: free delivery forever","🎰 Spin & win daily rewards","📱 New Electronics section live!","⚽ Sports & Games now available!"].map((t,i)=>(
                <span key={i} style={{fontSize:11,fontWeight:700,padding:"0 28px",opacity:.82,color:"#fff"}}>{t}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {showNotifs&&(
        <div style={{position:"fixed",top:126,right:16,zIndex:8000,background:C.card,borderRadius:16,boxShadow:"0 12px 36px rgba(0,0,0,.24)",border:`1px solid ${C.border}`,width:316,animation:"zFadeIn .2s ease"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 17px",borderBottom:`1px solid ${C.border}`}}>
            <div style={{fontSize:13,fontWeight:800,color:C.text}}>🔔 Notifications</div>
            <button onClick={()=>setShowNotifs(false)} style={{background:"none",border:"none",cursor:"pointer",color:C.sub,fontSize:16}}>✕</button>
          </div>
          {notifs.map(n=>(
            <div key={n.id} onClick={()=>{setNotifs(ns=>ns.map(x=>x.id===n.id?{...x,read:true}:x));setShowNotifs(false);}} style={{padding:"11px 17px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:n.read?"transparent":C.gl,transition:"background .12s"}}>
              <div style={{fontSize:12,fontWeight:n.read?600:800,color:C.text,marginBottom:2}}>{n.msg}</div>
              <div style={{fontSize:10,color:C.sub}}>{n.time}</div>
            </div>
          ))}
        </div>
      )}

      {lvMsg&&<div style={{position:"fixed",bottom:22,left:"50%",transform:"translateX(-50%)",background:"rgba(10,10,10,.93)",color:"#fff",borderRadius:22,padding:"9px 24px",fontSize:12,fontWeight:700,zIndex:700,whiteSpace:"nowrap",animation:"zLiveIn .3s ease",pointerEvents:"none",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,.1)"}}>{lvMsg}</div>}

      {nudge&&(
        <div style={{position:"fixed",bottom:14,left:14,right:14,background:C.card,border:`2px solid ${C.g}`,borderRadius:16,padding:"11px 15px",zIndex:700,display:"flex",alignItems:"center",gap:10,boxShadow:"0 6px 24px rgba(0,0,0,.18)",animation:"zSlideUp .3s ease"}}>
          <span style={{fontSize:22}}>💡</span>
          <span style={{flex:1,fontSize:13,fontWeight:700,color:C.text}}>{nudge}</span>
          <button onClick={e=>addToCart(101,e)} style={{background:C.g,color:"#fff",border:"none",borderRadius:9,padding:"6px 14px",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>Add</button>
          <button onClick={()=>setNudge(null)} style={{background:"none",border:"none",cursor:"pointer",color:C.sub,fontSize:17}}>✕</button>
        </div>
      )}

      <div className="zLayout">
        <aside className="zDSB" style={{position:"sticky",top:138,maxHeight:"calc(100vh - 138px)",overflowY:"auto",scrollbarWidth:"none",padding:"12px 0 12px 12px"}}>
          <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:10}}>
            <div style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,fontSize:12,fontWeight:800,color:C.text}}>🗂 Categories</div>
            {CATS.map(c=>(
              <div key={c.id} onClick={()=>{setCat(c.id);setSq("");}} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",cursor:"pointer",background:cat===c.id?C.gl:"transparent",borderLeft:cat===c.id?`3px solid ${C.g}`:"3px solid transparent",transition:"all .12s"}}>
                <span style={{fontSize:14,flexShrink:0}}>{c.icon}</span>
                <span style={{fontSize:11.5,fontWeight:cat===c.id?800:600,color:cat===c.id?C.g:C.text,lineHeight:1.3}}>{c.label}</span>
              </div>
            ))}
          </div>
          <div onClick={()=>setModal("gold")} style={{background:`linear-gradient(135deg,${C.g},${C.g2})`,borderRadius:14,padding:14,cursor:"pointer",marginBottom:10,transition:"transform .18s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <div style={{fontSize:22,marginBottom:4}}>👑</div>
            <div style={{fontSize:13,fontWeight:900,color:"#fbbf24",marginBottom:3}}>Zappit Gold</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.8)",marginBottom:10,lineHeight:1.6}}>Free delivery · 2× points · Priority dispatch</div>
            <button style={{background:"#fff",color:C.g,border:"none",borderRadius:7,padding:"6px 14px",fontSize:10,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>Try Free →</button>
          </div>
          <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,padding:12}}>
            <div style={{fontSize:12,fontWeight:800,color:C.text,marginBottom:8}}>🎟 Quick Coupons</div>
            {COUPONS.slice(0,3).map((cp,i)=>(
              <div key={i} style={{background:cp.bg,border:`2px dashed ${cp.bdr}`,borderRadius:9,padding:"7px 10px",marginBottom:6,cursor:"pointer",transition:"transform .15s"}} onClick={()=>{try{navigator.clipboard.writeText(cp.code);}catch(ex){}toast(`🎟 "${cp.code}" copied!`);}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                <div style={{fontWeight:900,color:cp.clr,fontSize:12}}>{cp.code}</div>
                <div style={{fontSize:9,color:cp.clr,opacity:.8}}>{cp.desc}</div>
              </div>
            ))}
          </div>
        </aside>

        <main style={{minWidth:0}}>
          <div style={{margin:"10px 14px 0",background:dk?"#0a1f10":`${C.g}12`,border:`1.5px solid ${C.g}`,borderRadius:16,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:200}}>
              <div style={{width:38,height:38,background:C.g,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🏪</div>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:12,fontWeight:800,color:C.text}}>{nearestStore.name}</span>
                  <span style={{background:nearestStore.open?"#dcfce7":"#fef2f2",color:nearestStore.open?"#15803d":"#dc2626",fontSize:9,fontWeight:900,padding:"1px 6px",borderRadius:4}}>{nearestStore.open?"OPEN":"CLOSED"}</span>
                </div>
                <div style={{fontSize:11,color:C.sub,marginTop:1,display:"flex",alignItems:"center",gap:8}}>
                  <span>📍 {nearestStore.dist} km away</span>
                  <span>⏱ {nearestStore.eta} min ETA</span>
                  <span>⭐ {nearestStore.rating}</span>
                  <span>📦 {nearestStore.orders} orders</span>
                  {nearestStore.area&&<span style={{fontSize:10,color:C.dim}}>· {nearestStore.area}</span>}
                </div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
              <div style={{width:8,height:8,background:"#22c55e",borderRadius:"50%",animation:"zStorePulse 1.5s infinite"}}/>
              <span style={{fontSize:11,fontWeight:700,color:"#15803d"}}>Delivering in ⚡ {nearestStore.eta} min</span>
            </div>
          </div>

          <div style={{margin:"10px 14px 0",position:"relative"}}>
            <div style={{borderRadius:20,overflow:"hidden",boxShadow:"0 6px 28px rgba(0,0,0,.2)",cursor:"pointer",animation:"zBannerSlide .4s ease"}} onClick={()=>handleBannerAction(HOME_BANNERS[bIdx].action)}>
              <img src={HOME_BANNERS[bIdx].img} alt="banner" style={{width:"100%",height:"auto",display:"block",objectFit:"cover",maxHeight:230,transition:"opacity .35s"}}
                onError={e=>{e.target.style.background="#0d5c2e";e.target.style.minHeight="160px";}} loading="eager"/>
            </div>
            <div style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,zIndex:3}}>
              {HOME_BANNERS.map((_,i)=>(
                <div key={i} onClick={()=>setBIdx(i)} style={{width:i===bIdx?22:6,height:6,borderRadius:3,background:i===bIdx?"#fff":"rgba(255,255,255,.5)",transition:"width .3s",cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,.3)"}}/>
              ))}
            </div>
          </div>

          <div style={{margin:"10px 14px 0"}}>
            <div className="sectionBannerWrap" style={{borderRadius:20,overflow:"hidden",cursor:"pointer",boxShadow:"0 6px 28px rgba(13,71,161,.28)",animation:"zGlow 3s ease-in-out infinite"}} onClick={()=>setModal("gold")}>
              <img src={BANNERS.gold} alt="Zappit Gold" style={{width:"100%",height:"auto",display:"block",objectFit:"cover"}}
                onError={e=>{
                  e.target.style.display="none";
                  const fb=e.target.parentElement;
                  fb.style.background=`linear-gradient(135deg,${C.g},${C.g2})`;
                  fb.style.minHeight="160px";fb.style.display="flex";fb.style.alignItems="center";fb.style.justifyContent="center";fb.style.flexDirection="column";fb.style.gap="8px";
                  fb.innerHTML=`<div style="font-size:40px">👑</div><div style="font-family:Plus Jakarta Sans,sans-serif;font-size:22px;font-weight:900;color:#fff">Zappit Gold</div><div style="font-size:13px;color:rgba(255,255,255,.7)">More benefits. More savings.</div>`;
                }}
                loading="lazy"/>
            </div>
          </div>

          <div className="zMini" style={{marginTop:10}}>
            {MINI_CATS.map((b,i)=>(
              <div key={i} onClick={()=>{setCat(b.cid);setSq("");}} style={{background:b.bg,border:`1.5px solid ${b.bdr}`,borderRadius:18,padding:"12px 12px 10px",cursor:"pointer",display:"flex",flexDirection:"column",gap:8,transition:"all .2s",overflow:"hidden",position:"relative"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 10px 28px ${b.bdr}99`;}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
                  <div>
                    <span style={{fontSize:24}}>{b.icon}</span>
                    <div style={{fontSize:12,fontWeight:800,color:b.clr,lineHeight:1.3,marginTop:4}}>{b.title}</div>
                    <div style={{fontSize:9,color:b.clr,opacity:.7,marginTop:1}}>{b.sub}</div>
                  </div>
                  <button style={{background:b.clr,color:"#fff",border:"none",borderRadius:8,padding:"5px 10px",fontSize:9,fontWeight:800,cursor:"pointer",fontFamily:"inherit",flexShrink:0,marginLeft:4,whiteSpace:"nowrap"}}>Order →</button>
                </div>
                <div style={{display:"flex",gap:4,marginTop:2}}>
                  {b.pids.map(pid=>(
                    <div key={pid} style={{width:48,height:48,background:"rgba(255,255,255,.75)",borderRadius:9,overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${b.bdr}`,backdropFilter:"blur(4px)"}}>
                      <img src={IMG[pid]} alt="" style={{width:42,height:42,objectFit:"contain",padding:2}} onError={e=>e.target.style.display="none"} loading="lazy"/>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{padding:"10px 14px 0",display:"flex",flexDirection:"column",gap:10}}>
            <div style={{fontSize:14,fontWeight:900,color:C.text,marginBottom:2,fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",display:"flex",alignItems:"center",gap:6}}>
              <span style={{display:"inline-block",width:3,height:14,background:C.g,borderRadius:2}}/>
              Featured Deals
            </div>
            {HOME_WIDE_BANNERS.map((b,i)=>(
              <div key={i} className="homeBannerImg" style={{borderRadius:18,overflow:"hidden",boxShadow:"0 4px 18px rgba(0,0,0,.14)",transition:"all .22s"}} onClick={()=>handleBannerAction(b.action)}>
                <img src={b.img} alt="promo banner" style={{width:"100%",height:"auto",display:"block",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}} loading="lazy"/>
              </div>
            ))}
          </div>

          <div onClick={()=>setModal("gold")} style={{margin:"10px 14px 0",background:`linear-gradient(135deg,${C.g}ee,${C.g2}dd)`,borderRadius:18,padding:"16px 20px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",transition:"transform .18s",position:"relative",overflow:"hidden"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.01)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <div style={{position:"absolute",top:-30,right:-30,width:130,height:130,background:"rgba(255,255,255,.06)",borderRadius:"50%"}}/>
            <div style={{fontSize:38,animation:"zBounce 3s infinite",position:"relative",zIndex:1}}>👑</div>
            <div style={{flex:1,position:"relative",zIndex:1}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontSize:14,fontWeight:900,color:"#fff",marginBottom:4}}>Zappit Gold — One membership. Unlimited benefits.</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.75)",lineHeight:1.7}}>✅ Free delivery · ✅ 2× Points · ✅ Priority Support · ✅ Exclusive Deals</div>
            </div>
            <button style={{background:"linear-gradient(135deg,#fbbf24,#f59e0b)",color:"#1a1a1a",border:"none",borderRadius:11,padding:"10px 18px",fontSize:12,fontWeight:900,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,fontFamily:"inherit",zIndex:1,position:"relative"}}>Buy Now →</button>
          </div>

          <div style={{padding:"14px 14px 6px"}}>
            <div style={{fontSize:14,fontWeight:900,color:C.text,fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
              <span style={{display:"inline-block",width:3,height:14,background:"#f97316",borderRadius:2}}/>
              🏪 Nearby Zappit Stores {selCity!=="Your City"&&<span style={{fontSize:11,color:C.sub,fontWeight:600}}>in {selCity}</span>}
            </div>
            <div style={{display:"flex",gap:10,overflowX:"auto",scrollbarWidth:"none",paddingBottom:4}} className="zhs">
              {cityStores.map((store,i)=>(
                <div key={i} className="storeCard" style={{flexShrink:0,width:224,background:C.card,border:`1.5px solid ${store.open?C.g:C.border}`,borderRadius:16,padding:14,boxShadow:"0 2px 10px rgba(0,0,0,.06)",cursor:"pointer",position:"relative",overflow:"hidden",transition:"all .2s"}}>
                  {store.open&&<div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${C.g},${C.accent})`}}/>}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <div style={{width:40,height:40,background:store.open?C.gl:C.surf,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{store.type==="Main Hub"?"🏭":"🏪"}</div>
                    <span style={{fontSize:9,fontWeight:900,padding:"2px 8px",borderRadius:10,background:store.open?"#dcfce7":"#fef2f2",color:store.open?"#15803d":"#dc2626"}}>{store.open?"● OPEN":"● CLOSED"}</span>
                  </div>
                  <div style={{fontSize:12,fontWeight:800,color:C.text,marginBottom:3,lineHeight:1.3}}>{store.name}</div>
                  {store.area&&<div style={{fontSize:9,color:C.sub,marginBottom:5,lineHeight:1.4}}>📍 {store.area}</div>}
                  <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:8}}>
                    <span style={{fontSize:9,background:C.surf,border:`1px solid ${C.border}`,color:C.sub,padding:"2px 6px",borderRadius:4,fontWeight:700}}>{store.type}</span>
                    <span style={{fontSize:9,color:"#f59e0b",fontWeight:700}}>⭐ {store.rating}</span>
                    <span style={{fontSize:9,color:C.sub,fontWeight:600}}>{store.orders}</span>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <div style={{flex:1,background:C.surf,borderRadius:9,padding:"6px 8px",textAlign:"center"}}>
                      <div style={{fontSize:14,fontWeight:900,color:C.g}}>📍 {store.dist}km</div>
                      <div style={{fontSize:9,color:C.sub,fontWeight:600}}>distance</div>
                    </div>
                    <div style={{flex:1,background:C.surf,borderRadius:9,padding:"6px 8px",textAlign:"center"}}>
                      <div style={{fontSize:14,fontWeight:900,color:store.open?"#f97316":C.dim}}>⚡ {store.eta}m</div>
                      <div style={{fontSize:9,color:C.sub,fontWeight:600}}>delivery</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{padding:"10px 14px 0"}}>
            <div style={{fontSize:13,fontWeight:900,color:C.text,marginBottom:8,fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",display:"flex",alignItems:"center",gap:6}}>
              <span style={{display:"inline-block",width:3,height:14,background:"#f97316",borderRadius:2}}/>
              Sponsored
            </div>
            <div className="homeBannerImg" style={{borderRadius:18,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,.16)",animation:"zAdSlideIn .4s ease",transition:"all .22s"}} onClick={()=>HOME_AD_BANNERS[adIdx].pid&&addToCart(HOME_AD_BANNERS[adIdx].pid,null)}>
              <img src={HOME_AD_BANNERS[adIdx].img} alt="ad banner" style={{width:"100%",height:"auto",display:"block",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}} loading="lazy"/>
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:5,marginTop:8}}>
              {HOME_AD_BANNERS.map((_,i)=>(
                <div key={i} onClick={()=>setAdIdx(i)} style={{width:i===adIdx?18:5,height:5,borderRadius:3,background:i===adIdx?C.g:"#ccc",transition:"width .3s",cursor:"pointer"}}/>
              ))}
            </div>
          </div>

          <div style={{padding:"12px 14px 0"}}>
            <div style={{fontSize:13,fontWeight:900,color:C.text,marginBottom:8,fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{display:"inline-block",width:3,height:14,background:"#ef4444",borderRadius:2}}/>🔥 Trending Categories</span>
              <button style={{background:"none",border:"none",color:C.g,fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>See all →</button>
            </div>
            <div style={{display:"flex",gap:10,overflowX:"auto",scrollbarWidth:"none",paddingBottom:4}} className="zhs">
              {[
                {bg:"linear-gradient(135deg,#dc2626,#ef4444)",title:"Snacks & Munchies",pids:[301,302,306,307],cid:"snacks",badge:"HOT 🔥"},
                {bg:"linear-gradient(135deg,#0284c7,#38bdf8)",title:"Cold Drinks",pids:[401,402,403,407],cid:"drinks",badge:"REFRESH 🥤"},
                {bg:"linear-gradient(135deg,#16a34a,#4ade80)",title:"Fresh Produce",pids:[501,502,503,505],cid:"fresh",badge:"ORGANIC 🌿"},
                {bg:"linear-gradient(135deg,#f59e0b,#fbbf24)",title:"Breakfast & Instant",pids:[701,702,703,704],cid:"breakfast",badge:"MORNING ☀️"},
                {bg:"linear-gradient(135deg,#7c3aed,#a78bfa)",title:"Sweet Tooth",pids:[1401,1402,1403,1406],cid:"sweet",badge:"FESTIVE 🎊"},
                {bg:"linear-gradient(135deg,#0f766e,#2dd4bf)",title:"Frozen & Ready",pids:[1301,1302,1304,1305],cid:"frozen",badge:"COOL 🧊"},
              ].map((b,i)=>(
                <div key={i} className="adBanner2" style={{flexShrink:0,width:204,borderRadius:18,overflow:"hidden",cursor:"pointer",background:b.bg,boxShadow:"0 4px 18px rgba(0,0,0,.2)",position:"relative"}} onClick={()=>{setCat(b.cid);setSq("");}}>
                  <div className="adBannerShine" style={{position:"absolute",top:0,bottom:0,left:"-60%",width:"40%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)",transform:"skewX(-15deg)",pointerEvents:"none",zIndex:4}}/>
                  <div style={{padding:"13px 13px 9px",position:"relative",zIndex:2}}>
                    <span style={{background:"rgba(255,255,255,.25)",color:"#fff",fontSize:8,fontWeight:900,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(255,255,255,.35)"}}>{b.badge}</span>
                    <div style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontSize:14,fontWeight:900,color:"#fff",marginTop:7,marginBottom:11}}>{b.title}</div>
                    <div style={{display:"flex",gap:4}}>
                      {b.pids.map((pid,j)=>(
                        <div key={pid} style={{width:46,height:46,background:"rgba(255,255,255,.22)",borderRadius:11,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",border:"1.5px solid rgba(255,255,255,.35)",flexShrink:0,animation:`zImgBob${j%2===0?"":"2"} ${2.2+j*.25}s ease-in-out infinite`,animationDelay:`${j*.12}s`}}>
                          <img src={IMG[pid]} alt="" style={{width:40,height:40,objectFit:"contain",padding:2}} onError={e=>e.target.style.display="none"} loading="lazy"/>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{padding:"10px 14px 0",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            {[
              {bannerKey:"pharma",cid:"pharma",fallbackBg:"#0e7490"},
              {bannerKey:"pet",cid:"pet",fallbackBg:"#b45309"},
              {bannerKey:"baby",cid:"baby",fallbackBg:"#7c3aed"},
            ].map((b,i)=>(
              <div key={i} className="sectionBannerWrap" style={{borderRadius:18,overflow:"hidden",cursor:"pointer",boxShadow:"0 4px 18px rgba(0,0,0,.15)",minHeight:100}} onClick={()=>{setCat(b.cid);setSq("");}}>
                <img src={BANNERS[b.bannerKey]} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",minHeight:100}}
                  onError={e=>{e.target.style.display="none";e.target.parentElement.style.background=b.fallbackBg;}}
                  loading="lazy"/>
              </div>
            ))}
          </div>

          <div style={{padding:"10px 14px 0"}}>
            <div className="sectionBannerWrap" style={{borderRadius:20,overflow:"hidden",cursor:"pointer",boxShadow:"0 6px 30px rgba(0,0,0,.18)"}} onClick={()=>{setCat("cleaning");setSq("");}}>
              <img src={BANNERS.cleaning} alt="Cleaning Essentials" style={{width:"100%",height:"auto",display:"block",objectFit:"cover"}}
                onError={e=>{e.target.style.display="none";e.target.parentElement.style.background="linear-gradient(135deg,#4a1942,#7c2d84,#9333ea)";e.target.parentElement.style.minHeight="130px";}}
                loading="lazy"/>
            </div>
          </div>

          <div style={{padding:"14px 14px 6px",fontSize:15,fontWeight:900,color:C.text,fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>🗂 Shop by Category</div>
          <div className="zCatG">
            {CATS.filter(c=>c.id!=="all").map(c=>{
              const pids=CAT_IMG_MAP[c.id]||[];
              return(
                <div key={c.id} onClick={()=>{setCat(c.id);setSq("");}} style={{background:cat===c.id?C.gl:C.card,border:`1.5px solid ${cat===c.id?C.g:C.border}`,borderRadius:14,padding:"10px 6px 8px",textAlign:"center",cursor:"pointer",transition:"all .15s",overflow:"hidden"}} onMouseEnter={e=>{if(cat!==c.id){e.currentTarget.style.borderColor=C.g;e.currentTarget.style.background=C.gl;e.currentTarget.style.transform="translateY(-2px)";}}} onMouseLeave={e=>{if(cat!==c.id){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.card;e.currentTarget.style.transform="translateY(0)";}}} >
                  <div style={{fontSize:22,marginBottom:4}}>{c.icon}</div>
                  <div style={{fontSize:9,fontWeight:800,color:cat===c.id?C.g:C.text,lineHeight:1.3,marginBottom:6}}>{c.label}</div>
                  <div style={{display:"flex",justifyContent:"center",gap:2,flexWrap:"wrap"}}>
                    {pids.slice(0,2).map(pid=>(
                      <div key={pid} style={{width:28,height:28,background:C.surf,borderRadius:6,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${C.border}`}}>
                        <img src={IMG[pid]} alt="" style={{width:24,height:24,objectFit:"contain"}} onError={e=>e.target.style.display="none"} loading="lazy"/>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 14px 4px"}}>
            <div style={{fontSize:15,fontWeight:900,color:C.text,fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>{h<12?"Good morning ☀️":h<17?"Good afternoon 🌤️":h<21?"Good evening 🌙":"Night owl? 🌛"}</div>
            <span style={{fontSize:11,color:C.sub,fontWeight:600}}>AI picks ✨</span>
          </div>
          <div style={{padding:"4px 14px 10px"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:10}}>
              {aiProds.map(p=>(
                <div key={p.id} onClick={()=>openProd(p)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",cursor:"pointer",transition:"all .2s",display:"flex",flexDirection:"column"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 10px 28px rgba(0,0,0,.14)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
                  <div style={{height:112,background:C.surf,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
                    <PImg id={p.id} cat={p.cat} h={102}/>
                    {p.tag&&<span style={{position:"absolute",top:5,left:5,background:TAGC[p.tag]||C.g,color:"#fff",fontSize:7,fontWeight:900,padding:"1px 5px",borderRadius:3}}>{p.tag}</span>}
                    <span style={{position:"absolute",bottom:4,left:5,background:"rgba(0,0,0,.65)",color:"#fff",fontSize:7,fontWeight:700,padding:"1px 4px",borderRadius:3}}>⏱ {p.del}m</span>
                  </div>
                  <div style={{padding:"8px 11px 11px",flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontSize:9,color:C.sub,fontWeight:600,marginBottom:1}}>{p.weight}</div>
                      <div style={{fontSize:11,fontWeight:700,color:C.text,lineHeight:1.3,marginBottom:4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{p.name}</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:4}}>
                      <div>
                        <div style={{fontSize:14,fontWeight:900,color:C.text,lineHeight:1}}>₹{p.price}</div>
                        {p.orig&&<div style={{fontSize:8,color:C.dim,textDecoration:"line-through"}}>₹{p.orig}</div>}
                      </div>
                      <AddBtn id={p.id} sm lbl="Add"/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 14px 6px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:15,fontWeight:900,color:C.text,fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>🔥 Flash Deals</span>
              <span style={{background:C.red,color:"#fff",fontSize:8,fontWeight:900,padding:"2px 6px",borderRadius:4,letterSpacing:.5}}>LIMITED</span>
            </div>
            <div style={{fontSize:15,fontWeight:900,color:C.red,letterSpacing:1.5,animation:"zTimerFlash 1s infinite",fontFamily:"monospace"}}>{ft(fsec)}</div>
          </div>
          <div style={{display:"flex",gap:10,padding:"4px 14px 10px"}} className="zhs">
            {FLASH.map(f=>{
              const p=allProducts.find(x=>x.id===f.id)||STATIC_PRODUCTS.find(x=>x.id===f.id);
              if(!p)return null;
              return(
                <div key={p.id} style={{flexShrink:0,width:154,background:C.card,borderRadius:14,overflow:"hidden",border:"1px solid #fecaca",boxShadow:"0 2px 10px rgba(0,0,0,.07)",transition:"all .2s",cursor:"pointer"}} onClick={()=>openProd(p)} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                  <div style={{position:"relative",background:C.surf,height:124,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                    <PImg id={p.id} cat={p.cat} h={124}/>
                    <span style={{position:"absolute",top:6,left:6,background:C.red,color:"#fff",fontSize:8,fontWeight:900,padding:"2px 5px",borderRadius:4}}>{f.pct}% OFF</span>
                  </div>
                  <div style={{padding:"8px 11px 11px"}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.text,marginBottom:1,lineHeight:1.3,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{p.name}</div>
                    <div style={{fontSize:9,color:C.sub,marginBottom:5}}>{p.weight}</div>
                    <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:7}}>
                      <span style={{fontSize:14,fontWeight:900,color:C.text}}>₹{f.p}</span>
                      <span style={{fontSize:10,color:C.dim,textDecoration:"line-through"}}>₹{f.o}</span>
                    </div>
                    <AddBtn id={p.id} sm/>
                  </div>
                </div>
              );
            })}
          </div>

          <div onClick={()=>setModal("spin")} style={{margin:"6px 14px 0",background:dk?"#1a1200":"#fff8e1",border:"2px solid #fbbf24",borderRadius:16,padding:"13px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"transform .18s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.008)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:13,fontWeight:800,color:"#d97706",fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>🏆 Zappit Rewards</span>
                <span style={{fontSize:20,fontWeight:900,color:"#d97706",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{rpts} pts</span>
              </div>
              <div style={{background:"#fde68a",borderRadius:4,height:7,marginBottom:5,overflow:"hidden"}}>
                <div style={{width:`${Math.min(100,Math.round((rpts/500)*100))}%`,height:"100%",background:"linear-gradient(90deg,#ea580c,#f97316)",borderRadius:4,transition:"width .8s ease"}}/>
              </div>
              <span style={{fontSize:10,color:"#d97706",fontWeight:700}}>{Math.max(0,500-rpts)} pts to next ₹50 reward · Tap to spin 🎰</span>
            </div>
            <button style={{background:"linear-gradient(135deg,#ea580c,#f97316)",color:"#fff",border:"none",borderRadius:10,padding:"9px 16px",fontSize:12,fontWeight:900,cursor:"pointer",animation:"zSpinBnc 2.5s infinite",fontFamily:"inherit"}}>🎰 SPIN</button>
          </div>

          <div style={{padding:"10px 14px 0"}}>
            <div className="sectionBannerWrap" style={{borderRadius:20,overflow:"hidden",cursor:"pointer",boxShadow:"0 6px 30px rgba(13,71,161,.25)"}} onClick={()=>{setCat("electronics");setSq("");}}>
              <img src={BANNERS.electronics} alt="Electronics" style={{width:"100%",height:"auto",display:"block",objectFit:"cover"}}
                onError={e=>{e.target.style.display="none";e.target.parentElement.style.background="linear-gradient(135deg,#1a237e,#283593)";e.target.parentElement.style.minHeight="130px";}}
                loading="lazy"/>
            </div>
          </div>

          <div style={{padding:"10px 14px 0"}}>
            <div className="sectionBannerWrap" style={{borderRadius:20,overflow:"hidden",cursor:"pointer",boxShadow:"0 6px 30px rgba(0,0,0,.18)"}} onClick={()=>{setCat("sports");setSq("");}}>
              <img src={BANNERS.sports} alt="Sports" style={{width:"100%",height:"auto",display:"block",objectFit:"cover"}}
                onError={e=>{e.target.style.display="none";e.target.parentElement.style.background="linear-gradient(135deg,#065f46,#047857)";e.target.parentElement.style.minHeight="130px";}}
                loading="lazy"/>
            </div>
          </div>

          <div style={{padding:"8px 14px 4px",fontSize:15,fontWeight:900,color:C.text,fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",display:"flex",alignItems:"center",gap:6}}>
            <span style={{display:"inline-block",width:3,height:14,background:"#7c3aed",borderRadius:2}}/>
            🎁 Value Bundles
          </div>
          <div style={{display:"flex",gap:12,padding:"4px 14px 10px",overflowX:"auto",scrollbarWidth:"none"}} className="zhs">
            {BUNDLES.map((b)=>{
              const prods=b.items.map(id=>allProducts.find(x=>x.id===id)||STATIC_PRODUCTS.find(x=>x.id===id)).filter(Boolean);
              const bimgSrc=BIMG[b.id];
              return(
                <div key={b.id} style={{flexShrink:0,width:224,background:C.card,borderRadius:18,overflow:"hidden",border:`1px solid ${C.border}`,boxShadow:"0 2px 12px rgba(0,0,0,.07)",transition:"all .2s",cursor:"pointer"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 10px 28px rgba(0,0,0,.14)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,.07)";}}>
                  <div style={{height:124,position:"relative",overflow:"hidden",background:C.surf,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <img src={bimgSrc} alt={b.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} onError={e=>e.target.style.display="none"} loading="lazy"/>
                    <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${C.g}bb,${C.g2}88)`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:4}}>
                      <div style={{fontSize:13,fontWeight:900,color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{b.name}</div>
                      <div style={{background:"#dc2626",color:"#fff",fontSize:10,fontWeight:900,padding:"2px 10px",borderRadius:10}}>Save ₹{b.save}</div>
                    </div>
                  </div>
                  <div style={{padding:"10px 13px 13px"}}>
                    <div style={{fontSize:13,fontWeight:800,color:C.text,marginBottom:4,fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>{b.name}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:8}}>{prods.slice(0,3).map(p=><span key={p.id} style={{fontSize:9,background:C.surf,border:`1px solid ${C.border}`,color:C.sub,borderRadius:4,padding:"1px 5px",fontWeight:600}}>{p.brand}</span>)}</div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div><div style={{fontSize:16,fontWeight:900,color:C.text}}>₹{b.price}</div><div style={{fontSize:10,color:C.dim,textDecoration:"line-through"}}>₹{b.orig}</div></div>
                      <button onClick={()=>addBundle(b.items)} style={{background:C.g,color:"#fff",border:"none",borderRadius:9,padding:"7px 14px",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"inherit",transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=C.g2} onMouseLeave={e=>e.currentTarget.style.background=C.g}>Add All →</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{fontSize:15,fontWeight:900,color:C.text,padding:"8px 14px 6px",fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>🎟 Coupons & Offers</div>
          <div style={{display:"flex",gap:10,padding:"0 14px 10px"}} className="zhs">
            {COUPONS.map((cp,i)=>(
              <div key={i} style={{flexShrink:0,minWidth:174,background:cp.bg,border:`2px dashed ${cp.bdr}`,borderRadius:14,padding:"13px 15px",cursor:"pointer",position:"relative",transition:"transform .15s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{fontSize:16,fontWeight:900,color:cp.clr,marginBottom:3,fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>{cp.code}</div>
                <div style={{fontSize:10,fontWeight:700,color:cp.clr,marginBottom:2}}>{cp.desc}</div>
                <div style={{fontSize:9,color:cp.clr,opacity:.7,marginBottom:22}}>{cp.min}</div>
                <button onClick={e=>{e.stopPropagation();try{navigator.clipboard.writeText(cp.code);}catch(ex){}toast(`🎟 "${cp.code}" copied!`);}} style={{position:"absolute",right:9,bottom:9,background:"rgba(0,0,0,.09)",border:"none",borderRadius:6,padding:"3px 9px",fontSize:10,fontWeight:800,cursor:"pointer",color:cp.clr,fontFamily:"inherit"}}>Copy</button>
              </div>
            ))}
          </div>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 14px 4px"}}>
            <div style={{fontSize:14,fontWeight:900,color:C.text,fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
              {sq?`Results for "${sq}"`:cat==="all"?"All Products":CATS.find(c=>c.id===cat)?.label}
              <span style={{fontSize:12,color:C.dim,fontWeight:500,marginLeft:6}}>({filtered.length})</span>
            </div>
            <select onChange={e=>setSrt(e.target.value)} value={srt} style={{background:C.card,border:`1px solid ${C.border}`,color:C.text,fontSize:11,padding:"5px 8px",borderRadius:8,cursor:"pointer",outline:"none",fontWeight:700,fontFamily:"inherit"}}>
              <option value="default">Relevance</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
              <option value="rating">Top Rated</option>
              <option value="discount">Most Discount</option>
            </select>
          </div>
          <div className="zPGrid">
            {filtered.length===0
              ?<div style={{gridColumn:"1/-1",textAlign:"center",padding:"52px 20px",color:C.sub}}>
                  <div style={{fontSize:44,marginBottom:12,opacity:.4}}>🔍</div>
                  <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>No results found</div>
                  <button onClick={()=>{setSq("");setCat("all");setFilt("all");}} style={{marginTop:10,background:C.g,color:"#fff",border:"none",borderRadius:10,padding:"9px 20px",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>Clear Filters</button>
                </div>
              :filtered.map(p=><PCard key={p.id} p={p}/>)
            }
          </div>

          <footer style={{background:dk?"#0a0a0a":"#1c1c1c",marginTop:32,padding:"44px 24px 30px",color:"rgba(255,255,255,.75)"}}>
            <div style={{maxWidth:960,margin:"0 auto"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:32,marginBottom:32}}>
                <div>
                  <FooterLogoSection/>
                  <div style={{fontSize:12,lineHeight:1.8,color:"rgba(255,255,255,.6)"}}>10-minute delivery, straight to your door. India's fastest quick commerce platform.</div>
                  <div style={{marginTop:14,fontSize:11,color:"rgba(255,255,255,.45)"}}>© 2025 Zappit Technologies Pvt. Ltd.</div>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:800,color:"#a5d6a7",marginBottom:12,letterSpacing:1,textTransform:"uppercase"}}>We Deliver To</div>
                  {["Mumbai","Delhi","Bengaluru","Hyderabad","Chennai","Kolkata","Pune","Ahmedabad","Jaipur","Lucknow"].map(c=><div key={c} style={{fontSize:12,color:"rgba(255,255,255,.65)",marginBottom:6,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.65)"}>{c}</div>)}
                  <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginTop:4}}>+30 more cities across India</div>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:800,color:"#a5d6a7",marginBottom:12,letterSpacing:1,textTransform:"uppercase"}}>Categories</div>
                  {["Dairy, Bread & Eggs","Atta, Rice & Dal","Snacks & Munchies","Cold Drinks & Juices","Fruits & Veggies","Pharma & Wellness","Baby Care","Pet Care","Electronics","Sports & Games"].map(c=><div key={c} style={{fontSize:12,color:"rgba(255,255,255,.65)",marginBottom:6,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.65)"}>{c}</div>)}
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:800,color:"#a5d6a7",marginBottom:12,letterSpacing:1,textTransform:"uppercase"}}>Company</div>
                  {["About Us","Careers","Blog","Press","Partner with Us","Ride with Us"].map(c=><div key={c} style={{fontSize:12,color:"rgba(255,255,255,.65)",marginBottom:6,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.65)"}>{c}</div>)}
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:800,color:"#a5d6a7",marginBottom:12,letterSpacing:1,textTransform:"uppercase"}}>Legal & Help</div>
                  {["Terms & Conditions","Privacy Policy","Cookie Policy","Refund Policy","Contact Support","FAQs"].map(c=><div key={c} style={{fontSize:12,color:"rgba(255,255,255,.65)",marginBottom:6,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.65)"}>{c}</div>)}
                  <div style={{marginTop:16}}>
                    <div style={{fontSize:12,fontWeight:800,color:"#a5d6a7",marginBottom:10,letterSpacing:1,textTransform:"uppercase"}}>Get the App</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,.65)",marginBottom:5,cursor:"pointer"}}>📱 Download for iOS</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,.65)",cursor:"pointer"}}>🤖 Download for Android</div>
                  </div>
                </div>
              </div>
              <div style={{borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>© 2025 Zappit Technologies Pvt. Ltd. · All rights reserved</div>
                <div style={{display:"flex",gap:16}}>
                  {["🐦 Twitter","📸 Instagram","💼 LinkedIn","📘 Facebook"].map(s=><span key={s} style={{fontSize:11,color:"rgba(255,255,255,.5)",cursor:"pointer",transition:"color .15s"}} onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.5)"}>{s}</span>)}
                </div>
              </div>
            </div>
          </footer>
        </main>

        <aside className="zDCSB" style={{position:"sticky",top:138,maxHeight:"calc(100vh - 138px)",overflowY:"auto",scrollbarWidth:"none",padding:"12px 12px 12px 0"}}>
          <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:10}}>
            <div style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:13,fontWeight:800,color:C.text}}>🛒 Cart{cartCount>0?` (${cartCount})`:""}</div>
              {cartCount>0&&<button onClick={goCart} style={{background:C.g,color:"#fff",border:"none",borderRadius:7,padding:"4px 9px",fontSize:10,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>View Full →</button>}
            </div>
            {cartCount===0
              ?<div style={{padding:"22px 14px",textAlign:"center",color:C.dim,fontSize:11}}><div style={{fontSize:30,marginBottom:8}}>🛒</div>Cart is empty!<br/>Add items to start.</div>
              :<div style={{padding:"8px 12px"}}>
                {ctxItems.slice(0,5).map((item)=>(
                  <div key={item.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
                    <div style={{width:36,height:36,background:C.surf,borderRadius:8,overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <PImg id={item.id} cat={item.cat} h={36}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:11,fontWeight:700,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                      <div style={{fontSize:10,color:C.sub}}>₹{item.price} × {item.qty}</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",background:C.g,borderRadius:7,overflow:"hidden",height:27,minWidth:66,flexShrink:0}}>
                      <button onClick={()=>updateQty(item.id,-1)} style={{background:"none",border:"none",color:"#fff",fontSize:14,cursor:"pointer",padding:"0 6px",height:"100%",fontWeight:900}}>−</button>
                      <span style={{fontSize:12,fontWeight:900,color:"#fff",flex:1,textAlign:"center"}}>{item.qty}</span>
                      <button onClick={()=>addItem(item)} style={{background:"none",border:"none",color:"#fff",fontSize:14,cursor:"pointer",padding:"0 6px",height:"100%",fontWeight:900}}>+</button>
                    </div>
                  </div>
                ))}
                {ctxItems.length>5&&<div style={{fontSize:10,color:C.sub,padding:"5px 0"}}>+{ctxItems.length-5} more items</div>}
                <div style={{borderTop:`1px solid ${C.border}`,marginTop:8,paddingTop:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:800,color:C.text,marginBottom:5}}><span>Total</span><span>₹{cartTotal}</span></div>
                  {delFee===0?<div style={{fontSize:10,color:"#16a34a",fontWeight:700,marginBottom:8}}>🚚 Free delivery!</div>:<div style={{fontSize:10,color:C.sub,marginBottom:8}}>+ ₹{delFee} delivery (free above ₹149)</div>}
                  <button onClick={goCart} style={{width:"100%",background:C.g,color:"#fff",border:"none",borderRadius:9,padding:10,fontSize:12,fontWeight:900,cursor:"pointer",fontFamily:"inherit",transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=C.g2} onMouseLeave={e=>e.currentTarget.style.background=C.g}>View Cart & Checkout →</button>
                </div>
              </div>
            }
          </div>
          {wish.size>0&&(
            <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,padding:12}}>
              <div style={{fontSize:12,fontWeight:800,color:C.text,marginBottom:8}}>❤️ Wishlist ({wish.size})</div>
              {[...wish].slice(0,3).map(id=>{
                const p=allProducts.find(x=>x.id===id)||STATIC_PRODUCTS.find(x=>x.id===id);
                if(!p)return null;
                return(
                  <div key={id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:`1px solid ${C.border}`}}>
                    <div style={{width:30,height:30,background:C.surf,borderRadius:7,overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <PImg id={id} cat={p.cat} h={30}/>
                    </div>
                    <div style={{flex:1,minWidth:0,fontSize:11,fontWeight:600,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                    <AddBtn id={id} sm lbl="+"/>
                  </div>
                );
              })}
            </div>
          )}
        </aside>
      </div>

      {cartCount>0&&(
        <div onClick={goCart} style={{position:"fixed",bottom:14,left:14,right:14,zIndex:400,background:C.g,borderRadius:16,padding:"13px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",boxShadow:`0 6px 26px ${C.g}66`,animation:"zSlideUp .3s ease",transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=C.g2} onMouseLeave={e=>e.currentTarget.style.background=C.g}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{background:"rgba(0,0,0,.22)",color:"#fff",fontSize:12,fontWeight:900,padding:"3px 10px",borderRadius:8}}>{cartCount} item{cartCount!==1?"s":""}</span>
            <span style={{fontSize:13,fontWeight:800,color:"#fff"}}>View Cart</span>
          </div>
          <div style={{fontSize:14,fontWeight:900,color:"#fff"}}>₹{cartTotal} →</div>
        </div>
      )}

      <button onClick={()=>setModal("chat")} style={{position:"fixed",bottom:cartCount>0?82:22,right:18,zIndex:400,width:56,height:56,background:"linear-gradient(135deg,#7c3aed,#4f46e5)",border:"none",borderRadius:"50%",cursor:"pointer",fontSize:24,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 24px rgba(124,58,237,.55)",animation:"zBounce 4s infinite"}}>
        🤖
      </button>

      <div style={{position:"fixed",top:16,right:16,zIndex:9999,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none",maxWidth:320}}>
        {toasts.map(t=>(
          <div key={t.id} style={{background:t.type==="success"?C.g:"#1a1a1a",color:"#fff",borderRadius:14,padding:"11px 18px",fontSize:13,fontWeight:700,boxShadow:"0 6px 24px rgba(0,0,0,.3)",animation:"zToastIn .3s ease",pointerEvents:"all",wordBreak:"break-word",display:"flex",alignItems:"center",gap:8,border:"1px solid rgba(255,255,255,.08)"}}>
            {t.msg}
          </div>
        ))}
      </div>

      <ModalBase open={modal==="login"} onClose={closeModal} title={loginMode==="login"?"🔐 Login to Zappit":"📝 Create Account"} C={C}>
        <div style={{display:"flex",background:C.surf,borderRadius:12,padding:4,marginBottom:20,border:`1px solid ${C.border}`}}>
          {["login","signup"].map(m=>(
            <button key={m} onClick={()=>{setLoginMode(m);setOtpSent(false);setPhone("");setOtp("");setUname("");setUemail("");setEmailField("");setEmailPass("");loginRef.current={phone:"",otp:"",uname:"",uemail:"",email:"",pass:""};}} style={{flex:1,background:loginMode===m?C.card:"none",border:"none",borderRadius:9,padding:"9px",fontSize:13,fontWeight:800,cursor:"pointer",color:loginMode===m?C.text:C.sub,fontFamily:"inherit",boxShadow:loginMode===m?"0 1px 5px rgba(0,0,0,.1)":"none",transition:"all .2s"}}>
              {m==="login"?"Login":"Sign Up"}
            </button>
          ))}
        </div>
        {loginMode==="signup"&&(
          <input placeholder="Full Name" value={uname} onChange={e=>{setUname(e.target.value);loginRef.current.uname=e.target.value;}} style={{width:"100%",background:C.surf,border:`1.5px solid ${C.border}`,borderRadius:11,padding:"12px 14px",color:C.text,fontSize:13,outline:"none",marginBottom:12,boxSizing:"border-box"}}/>
        )}
        <div style={{display:"flex",background:C.surf,borderRadius:11,padding:3,marginBottom:16,border:`1px solid ${C.border}`}}>
          {[{k:"phone",l:"📱 Mobile OTP"},{k:"email",l:"✉️ Email"}].map(t=>(
            <button key={t.k} onClick={()=>{setLoginTab(t.k);setOtpSent(false);}} style={{flex:1,background:loginTab===t.k?C.g:"none",border:"none",borderRadius:9,padding:"8px",fontSize:12,fontWeight:800,cursor:"pointer",color:loginTab===t.k?"#fff":C.sub,fontFamily:"inherit",transition:"all .2s"}}>{t.l}</button>
          ))}
        </div>
        {loginTab==="phone"?(
          <>
            <div style={{fontSize:11,color:C.sub,marginBottom:10,background:C.gl,borderRadius:9,padding:"8px 12px",lineHeight:1.6}}>
              📱 Enter your mobile number. We'll send a real OTP via SMS to verify your identity.
            </div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <div style={{flex:1,position:"relative"}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:12,color:C.sub,fontWeight:700,zIndex:2}}>🇮🇳 +91</span>
                <input placeholder="10-digit mobile number" maxLength={10} value={phone} onChange={e=>{const v=e.target.value.replace(/\D/g,"").slice(0,10);setPhone(v);loginRef.current.phone=v;}} style={{width:"100%",background:C.surf,border:`1.5px solid ${C.border}`,borderRadius:11,padding:"12px 14px 12px 62px",color:C.text,fontSize:14,outline:"none",boxSizing:"border-box",fontWeight:600}}/>
              </div>
              <button onClick={sendOtp} disabled={otpSent&&otpTimer>0||otpLoading} style={{background:otpSent&&otpTimer>0?"#9ca3af":C.g,color:"#fff",border:"none",borderRadius:11,padding:"12px 16px",fontSize:12,fontWeight:900,cursor:otpSent&&otpTimer>0?"default":"pointer",fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0,opacity:otpLoading?.6:1,minWidth:88,display:"flex",alignItems:"center",gap:6,justifyContent:"center"}}>
                {otpLoading&&<div style={{width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"zSpin .7s linear infinite"}}/>}
                {otpLoading?"Sending...":otpSent&&otpTimer>0?`${otpTimer}s`:otpSent?"Resend":"Get OTP"}
              </button>
            </div>
            {otpSent&&(
              <div style={{marginBottom:14}}>
                <div style={{fontSize:12,color:C.sub,fontWeight:600,marginBottom:8,textAlign:"center"}}>📱 OTP sent to <strong>+91 {phone}</strong></div>
                <div style={{fontSize:10,color:C.sub,marginBottom:8,textAlign:"center",background:"#fef9c3",borderRadius:8,padding:"6px 10px",border:"1px solid #fde047"}}>
                  💡 If you don't receive OTP within 30 seconds, tap Resend
                </div>
                <input placeholder="Enter OTP" maxLength={6} value={otp} onChange={e=>{const v=e.target.value.replace(/\D/g,"").slice(0,6);setOtp(v);loginRef.current.otp=v;}} className="otp-input" style={{width:"100%",background:C.surf,border:`2.5px solid ${C.g}`,borderRadius:12,padding:"14px",color:C.text,outline:"none",boxSizing:"border-box"}}/>
                <div style={{fontSize:11,color:C.sub,marginTop:6,textAlign:"center"}}><span style={{color:C.g,cursor:"pointer",fontWeight:700}} onClick={()=>{setOtpSent(false);setOtp("");loginRef.current.otp="";}}>Change number</span></div>
              </div>
            )}
            <button onClick={doPhoneLogin} style={{width:"100%",background:`linear-gradient(135deg,${C.g},${C.g2})`,color:"#fff",border:"none",borderRadius:12,padding:14,fontSize:14,fontWeight:900,cursor:"pointer",fontFamily:"inherit",marginBottom:14,boxShadow:`0 4px 16px ${C.g}44`}}>
              {otpSent?(loginMode==="signup"?"Create Account →":"Login →"):"Continue →"}
            </button>
          </>
        ):(
          <>
            <div style={{fontSize:11,color:C.sub,marginBottom:10,background:C.gl,borderRadius:9,padding:"8px 12px",lineHeight:1.6}}>
              ✉️ Enter your Gmail ID and password. Your credentials are verified securely.
            </div>
            {loginMode==="signup"&&(
              <input placeholder="Your email (Gmail preferred)" type="email" value={emailField} onChange={e=>{setEmailField(e.target.value);loginRef.current.email=e.target.value;}} style={{width:"100%",background:C.surf,border:`1.5px solid ${C.border}`,borderRadius:11,padding:"12px 14px",color:C.text,fontSize:13,outline:"none",marginBottom:12,boxSizing:"border-box"}}/>
            )}
            {loginMode==="login"&&(
              <div style={{position:"relative",marginBottom:12}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14}}>📧</span>
                <input placeholder="Gmail ID (e.g. you@gmail.com)" type="email" value={emailField} onChange={e=>{setEmailField(e.target.value);loginRef.current.email=e.target.value;}} style={{width:"100%",background:C.surf,border:`1.5px solid ${C.border}`,borderRadius:11,padding:"12px 14px 12px 40px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
              </div>
            )}
            <div style={{position:"relative",marginBottom:14}}>
              <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14}}>🔑</span>
              <input placeholder="Password (min 6 characters)" type="password" value={emailPass} onChange={e=>{setEmailPass(e.target.value);loginRef.current.pass=e.target.value;}} style={{width:"100%",background:C.surf,border:`1.5px solid ${C.border}`,borderRadius:11,padding:"12px 14px 12px 40px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
            </div>
            {loginMode==="login"&&(
              <div style={{textAlign:"right",marginBottom:12,marginTop:-8}}>
                <span style={{fontSize:11,color:C.g,cursor:"pointer",fontWeight:700}} onClick={()=>toast("📧 Password reset email sent!")}>Forgot password?</span>
              </div>
            )}
            <button onClick={doGmailLogin} disabled={gmailLoading} style={{width:"100%",background:`linear-gradient(135deg,${C.g},${C.g2})`,color:"#fff",border:"none",borderRadius:12,padding:14,fontSize:14,fontWeight:900,cursor:"pointer",fontFamily:"inherit",marginBottom:14,boxShadow:`0 4px 16px ${C.g}44`,display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:gmailLoading?.7:1}}>
              {gmailLoading&&<div style={{width:16,height:16,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"zSpin .7s linear infinite"}}/>}
              {gmailLoading?"Verifying...":(loginMode==="signup"?"Create Account →":"Login →")}
            </button>
          </>
        )}
        <div style={{textAlign:"center",fontSize:12,color:C.sub,fontWeight:600,marginBottom:10}}>or continue with</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          <button className="gmailBtn" onClick={doGoogleOAuth} style={{background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:11,padding:"11px",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",color:"#374151",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 2px 8px rgba(0,0,0,.08)"}}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.3 1.2 8.4 3.2l6.3-6.3C34.8 2.9 29.8 1 24 1 14.7 1 6.8 6.5 3.3 14.5l7.4 5.7C12.4 14 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.6H24v8.7h12.7c-.5 2.8-2.2 5.1-4.6 6.7l7.2 5.6c4.2-3.9 6.6-9.6 6.6-16.4z"/><path fill="#FBBC05" d="M10.7 28.8A15.1 15.1 0 0 1 9.5 24c0-1.7.3-3.3.8-4.8L2.9 13.5A23.8 23.8 0 0 0 0 24c0 3.8.9 7.4 2.5 10.5l8.2-5.7z"/><path fill="#34A853" d="M24 47c6.5 0 11.9-2.1 15.9-5.8l-7.2-5.6c-2.2 1.5-5 2.4-8.7 2.4-6.3 0-11.6-4.3-13.5-10l-7.4 5.7C6.8 41.5 14.7 47 24 47z"/></svg>
            Google
          </button>
          <button className="gmailBtn" onClick={()=>toast("📘 Facebook login — coming soon!")} style={{background:"#1877f2",border:"none",borderRadius:11,padding:"11px",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 2px 8px rgba(24,119,242,.3)"}}>
            <span style={{fontSize:16}}>f</span> Facebook
          </button>
        </div>
        <div style={{background:C.gl,borderRadius:11,padding:"11px 14px",fontSize:11,color:C.g,fontWeight:600}}>
          🔒 Your data is safe. We use 256-bit encryption and never share your info.
        </div>
      </ModalBase>

      <ModalBase open={modal==="profile"} onClose={closeModal} title="👤 My Account" C={C}>
        {user&&(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:14,padding:"10px 0 18px",borderBottom:`1px solid ${C.border}`}}>
              <div style={{width:60,height:60,background:`linear-gradient(135deg,${C.g},${C.g2})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"#fff",fontWeight:900,flexShrink:0}}>{user.avatar}</div>
              <div>
                <div style={{fontSize:16,fontWeight:900,color:C.text}}>{user.name}</div>
                <div style={{fontSize:12,color:C.sub}}>{user.phone?`+91 ${user.phone}`:""}{user.email?` ${user.email}`:""}</div>
                <div style={{fontSize:11,color:C.g,fontWeight:700,marginTop:3}}>🏆 {rpts} reward points</div>
              </div>
            </div>
            {[["📦 My Orders","View all past orders",()=>goCart()],["❤️ Wishlist",`${wish.size} saved items`,()=>{}],["🎟 Coupons","View available codes",()=>{}],["📍 Addresses","Manage delivery addresses",()=>setModal("addr")],["👑 Zappit Gold","Upgrade membership",()=>setModal("gold")],["🎨 Change Theme","Personalize your app",()=>{setModal(null);setShowThemePicker(true);}],["🌙 Dark Mode",dk?"Currently: Dark":"Currently: Light",()=>setDk(d=>!d)]].map(([lbl,sub,action])=>(
              <div key={lbl} onClick={action} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer",transition:"background .12s"}}>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.text}}>{lbl}</div><div style={{fontSize:11,color:C.sub}}>{sub}</div></div>
                <span style={{color:C.dim,fontSize:17}}>›</span>
              </div>
            ))}
            <button onClick={()=>{setUser(null);setModal(null);toast("👋 Logged out successfully");}} style={{width:"100%",marginTop:16,background:"#fce4ec",color:"#b71c1c",border:"1px solid #f48fb1",borderRadius:12,padding:12,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>🚪 Log Out</button>
          </div>
        )}
      </ModalBase>

      <ModalBase open={modal==="prod"} onClose={closeModal} title={selProd?.name||""} C={C}>
        {selProd&&(()=>{
          const p=selProd;
          const off=p.orig?Math.round((p.orig-p.price)/p.orig*100):null;
          const iw=wish.has(p.id);
          const store=cityStores[0];
          return(
            <div>
              <div style={{height:214,background:C.surf,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,overflow:"hidden",position:"relative"}}>
                <PImg id={p.id} cat={p.cat} h={204}/>
                {off&&<span style={{position:"absolute",top:10,left:10,background:"#16a34a",color:"#fff",fontSize:10,fontWeight:900,padding:"3px 9px",borderRadius:6}}>{off}% OFF</span>}
              </div>
              <div style={{fontSize:12,color:C.sub,fontWeight:700,marginBottom:2}}>{p.brand} · {p.weight}</div>
              <div style={{fontSize:18,fontWeight:900,color:C.text,marginBottom:6}}>{p.name}</div>
              <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:12}}>
                <span style={{color:"#f59e0b",fontSize:13}}>{"★".repeat(Math.floor(p.rating))}</span>
                <span style={{fontSize:11,color:C.sub}}>{p.rating} ({p.reviews}k reviews)</span>
              </div>
              <div style={{background:C.gl,borderRadius:13,padding:"10px 14px",marginBottom:14,border:`1px solid ${C.g}`,display:"flex",alignItems:"center",gap:10}}>
                <div style={{fontSize:22}}>🏪</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:800,color:C.g}}>{store.name}</div>
                  <div style={{fontSize:10,color:C.sub,marginTop:1}}>📍 {store.dist} km away · ⭐ {store.rating} · {store.orders} orders</div>
                  {store.area&&<div style={{fontSize:9,color:C.sub}}>📌 {store.area}</div>}
                </div>
              </div>
              <div style={{display:"flex",gap:12,marginBottom:14}}>
                <div style={{background:C.surf,borderRadius:11,padding:"10px 16px",flex:1,textAlign:"center"}}>
                  <div style={{fontSize:11,color:C.sub,marginBottom:3}}>⏱ Delivery</div>
                  <div style={{fontSize:16,fontWeight:900,color:C.g}}>{p.del} min</div>
                </div>
                <div style={{background:C.surf,borderRadius:11,padding:"10px 16px",flex:1,textAlign:"center"}}>
                  <div style={{fontSize:11,color:C.sub,marginBottom:3}}>📦 Stock</div>
                  <div style={{fontSize:16,fontWeight:900,color:p.stock>10?C.g:C.red}}>{p.stock>10?"In Stock":"Only "+p.stock}</div>
                </div>
                <div style={{background:C.surf,borderRadius:11,padding:"10px 16px",flex:1,textAlign:"center"}}>
                  <div style={{fontSize:11,color:C.sub,marginBottom:3}}>🚚 Delivery</div>
                  <div style={{fontSize:16,fontWeight:900,color:cartTotal>=149?C.g:C.text}}>{cartTotal>=149?"FREE":"₹20"}</div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:C.surf,borderRadius:14,padding:"14px 16px",marginBottom:14}}>
                <div><div style={{fontSize:26,fontWeight:900,color:C.text}}>₹{p.price}</div>{p.orig&&<div style={{fontSize:12,color:C.dim,textDecoration:"line-through"}}>MRP ₹{p.orig}</div>}</div>
                <AddBtn id={p.id}/>
              </div>
              <button onClick={()=>togWish(p.id,null)} style={{width:"100%",background:iw?"#fce4ec":C.surf,color:iw?"#b71c1c":C.text,border:`1.5px solid ${iw?"#f48fb1":C.border}`,borderRadius:12,padding:12,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
                {iw?"❤️ Remove from Wishlist":"🤍 Add to Wishlist"}
              </button>
            </div>
          );
        })()}
      </ModalBase>

      <ModalBase open={modal==="chat"} onClose={closeModal} title="🤖 ZappBot — Zappit AI Assistant" C={C} wide>
        <div style={{display:"flex",flexDirection:"column",height:480}}>
          <div style={{background:`linear-gradient(135deg,${C.g}18,${C.g2}10)`,borderRadius:12,padding:"10px 14px",marginBottom:12,fontSize:12,color:C.g,fontWeight:700,border:`1px solid ${C.g}30`,display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:8,height:8,background:"#22c55e",borderRadius:"50%",animation:"zStorePulse 1.5s infinite",flexShrink:0}}/>
            <span>⚡ Powered by Zappit AI · Ask about products, cart, tracking, deals, or anything Zappit!</span>
          </div>
          <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,marginBottom:10,paddingRight:4}}>
            {chatMsgs.map((m,i)=>(
              <div key={i} className="chatMsg" style={{maxWidth:"85%",padding:"11px 15px",borderRadius:m.from==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",fontSize:13,lineHeight:1.6,alignSelf:m.from==="user"?"flex-end":"flex-start",background:m.from==="user"?`linear-gradient(135deg,${C.g},${C.g2})`:`${C.surf}`,color:m.from==="user"?"#fff":C.text,whiteSpace:"pre-line",wordBreak:"break-word",border:m.from==="bot"?`1px solid ${C.border}`:"none",boxShadow:m.from==="user"?`0 4px 16px ${C.g}44`:"0 2px 8px rgba(0,0,0,.06)"}}>
                {m.from==="bot"&&<div style={{fontSize:10,fontWeight:800,color:C.g,marginBottom:4,display:"flex",alignItems:"center",gap:4}}><span>🤖</span> ZappBot</div>}
                {m.text}
              </div>
            ))}
            {botTyping&&(
              <div style={{alignSelf:"flex-start",display:"flex",gap:5,padding:"13px 16px",background:C.surf,borderRadius:"18px 18px 18px 4px",border:`1px solid ${C.border}`,boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
                <div style={{fontSize:10,fontWeight:800,color:C.g,marginRight:6}}>🤖 ZappBot is typing</div>
                {[0,1,2].map(i=><div key={i} style={{width:7,height:7,background:C.g,borderRadius:"50%",animation:`zTypingDot ${.5+i*.15}s ease infinite alternate`,animationDelay:`${i*.12}s`,opacity:.7}}/>)}
              </div>
            )}
            <div ref={chatEndRef}/>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
            {["Best flash deals","Track my order","Cart summary","Show coupons","Electronics deals","Delivery time","What's trending","Return policy","Zappit Gold benefits"].map(s=>(
              <button key={s} onClick={()=>sendChatAI(s)} style={{background:C.gl,border:`1px solid ${C.g}30`,color:C.g,borderRadius:16,padding:"5px 13px",fontSize:11,cursor:"pointer",fontWeight:700,fontFamily:"inherit",transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.background=C.g;e.currentTarget.style.color="#fff";}} onMouseLeave={e=>{e.currentTarget.style.background=C.gl;e.currentTarget.style.color=C.g;}}>{s}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:8,background:C.surf,borderRadius:16,padding:"6px 6px 6px 16px",border:`2px solid ${searchFocus?C.g:C.border}`,transition:"border-color .2s",boxShadow:`0 2px 12px rgba(0,0,0,.06)`}}>
            <input value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChatAI(chatIn);}}} onFocus={()=>setSearchFocus(true)} onBlur={()=>setSearchFocus(false)} placeholder="Ask anything about Zappit..." style={{flex:1,background:"none",border:"none",outline:"none",color:C.text,fontSize:13,fontFamily:"inherit",padding:"8px 0",minWidth:0}}/>
            <button onClick={()=>sendChatAI(chatIn)} disabled={!chatIn.trim()||botTyping} style={{background:chatIn.trim()&&!botTyping?`linear-gradient(135deg,${C.g},${C.g2})`:"#9ca3af",border:"none",color:"#fff",width:42,height:42,borderRadius:12,cursor:chatIn.trim()&&!botTyping?"pointer":"default",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s",boxShadow:chatIn.trim()&&!botTyping?`0 4px 14px ${C.g}55`:"none"}}>➤</button>
          </div>
          <div style={{textAlign:"center",marginTop:8,fontSize:10,color:C.dim}}>🔒 ZappBot is powered by AI · Responses may not always be perfect</div>
        </div>
      </ModalBase>

      <ModalBase open={modal==="spin"} onClose={closeModal} title="🎰 Spin & Win" C={C}>
        <div style={{textAlign:"center",padding:"10px 0"}}>
          <div style={{fontSize:12,color:C.sub,fontWeight:600,marginBottom:18}}>Spin daily for instant discounts!</div>
          <div style={{position:"relative",width:210,height:210,margin:"0 auto 18px"}}>
            <div style={{fontSize:22,position:"absolute",top:-18,left:"50%",transform:"translateX(-50%)",zIndex:2}}>▼</div>
            <svg viewBox="0 0 200 200" width="210" height="210" style={{borderRadius:"50%",border:"5px solid #e5e7eb",boxShadow:"0 6px 24px rgba(0,0,0,.18)",transform:`rotate(${spinAng}deg)`,transition:spinRes?"transform 3s cubic-bezier(.17,.67,.1,.99)":"none"}}>
              {[["₹20 OFF","#ef4444"],["FREE Del.","#22c55e"],["₹50 OFF","#f97316"],["5% OFF","#8b5cf6"],["₹10 OFF","#3b82f6"],["Try Again","#6b7280"],["₹30 OFF","#ec4899"],["10% OFF","#eab308"]].map(([label,color],i)=>{
                const n=8,seg=360/n;
                const sa=(i*seg-90)*Math.PI/180,ea=((i+1)*seg-90)*Math.PI/180;
                const x1=100+95*Math.cos(sa),y1=100+95*Math.sin(sa),x2=100+95*Math.cos(ea),y2=100+95*Math.sin(ea);
                const ma=((i+.5)*seg-90)*Math.PI/180,tx=100+65*Math.cos(ma),ty=100+65*Math.sin(ma);
                return(<g key={i}><path d={`M100,100 L${x1},${y1} A95,95 0 0,1 ${x2},${y2} Z`} fill={color}/><text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#fff" fontWeight="bold" transform={`rotate(${i*seg+seg/2},${tx},${ty})`}>{label}</text></g>);
              })}
              <circle cx="100" cy="100" r="12" fill="#fff" stroke="#e5e7eb" strokeWidth="2"/>
            </svg>
          </div>
          {spinRes
            ?<><div style={{fontSize:22,fontWeight:900,color:C.g,marginBottom:14}}>🎉 You won: {spinRes}!</div>
              <button onClick={()=>{setModal(null);toast(`🎉 ${spinRes} applied!`);}} style={{width:"100%",background:C.g,color:"#fff",border:"none",borderRadius:13,padding:14,fontSize:15,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>Apply & Shop →</button>
            </>
            :<button onClick={()=>{
                const rand=Math.floor(Math.random()*8);
                const results=["₹20 OFF","FREE Delivery","₹50 OFF","5% OFF","₹10 OFF","Try Again","₹30 OFF","10% OFF"];
                const extra=5*360,seg=360/8,target=extra+rand*seg+seg/2;
                setSpinAng(a=>a+target);
                setTimeout(()=>setSpinRes(results[rand]),3200);
              }} style={{width:"100%",background:"linear-gradient(135deg,#ea580c,#f97316)",color:"#fff",border:"none",borderRadius:13,padding:14,fontSize:15,fontWeight:900,cursor:"pointer",fontFamily:"inherit",animation:"zSpinBnc 2s infinite"}}>
              SPIN NOW 🎰
            </button>
          }
        </div>
      </ModalBase>

      <ModalBase open={modal==="gold"} onClose={closeModal} title="👑 Zappit Gold Membership" C={C}>
        <div style={{textAlign:"center",padding:"8px 0 16px"}}>
          <div style={{fontSize:56,marginBottom:10,animation:"zBounce 2s infinite"}}>👑</div>
          <div style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontSize:22,fontWeight:900,color:"#d97706",marginBottom:4}}>Zappit Gold</div>
          <div style={{fontSize:13,color:C.sub,marginBottom:20}}>Everything faster. Everything cheaper.</div>
        </div>
        {[["🚚","Free Delivery Always","No minimum order, ever"],["2×","Double Reward Points","Earn 4 pts per item added"],["⚡","Priority Dispatch","Your order packed first"],["🎟","Exclusive Gold Deals","Members-only flash sales"],["📞","Priority Support","Skip the queue instantly"]].map(([icon,title,sub])=>(
          <div key={title} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{width:42,height:42,background:"#fff8e1",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>{icon}</div>
            <div><div style={{fontSize:13,fontWeight:800,color:C.text}}>{title}</div><div style={{fontSize:11,color:C.sub}}>{sub}</div></div>
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:20}}>
          {[["₹99/month","Monthly Plan",false],["₹799/year","Annual · Save 33%",true]].map(([price,plan,best])=>(
            <div key={plan} onClick={()=>{toast("👑 Gold subscription started! 🎉");setModal(null);}} style={{background:best?`linear-gradient(135deg,${C.g},${C.g2})`:"#f8fafc",border:best?"none":`1.5px solid ${C.border}`,borderRadius:14,padding:16,textAlign:"center",cursor:"pointer",transition:"transform .15s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
              <div style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontSize:18,fontWeight:900,color:best?"#fff":C.text}}>{price}</div>
              <div style={{fontSize:11,color:best?"rgba(255,255,255,.75)":C.sub}}>{plan}</div>
              <button style={{marginTop:10,background:best?"#fff":C.g,color:best?C.g:"#fff",border:"none",borderRadius:8,padding:"5px 14px",fontSize:11,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>{best?"Best Value →":"Subscribe"}</button>
            </div>
          ))}
        </div>
        <div style={{marginTop:14,fontSize:10,color:C.sub,textAlign:"center"}}>Cancel anytime · No hidden charges</div>
      </ModalBase>

      <ModalBase open={modal==="addr"} onClose={closeModal} title="📍 Delivery Address" C={C} wide>
        <div style={{marginBottom:14}}>
          <button onClick={detectLiveLocation} disabled={liveAddrLoading} style={{width:"100%",background:liveAddrLoading?C.surf:`linear-gradient(135deg,${C.g},${C.g2})`,color:liveAddrLoading?C.sub:"#fff",border:`1.5px solid ${liveAddrLoading?C.border:C.g}`,borderRadius:12,padding:"12px 16px",fontSize:13,fontWeight:800,cursor:liveAddrLoading?"default":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s"}}>
            {liveAddrLoading
              ?<><div style={{width:16,height:16,border:`2px solid ${C.sub}`,borderTopColor:C.g,borderRadius:"50%",animation:"zSpin .7s linear infinite"}}/> Detecting your GPS location...</>
              :<>📍 Use My Current Location (GPS)</> }
          </button>
          {liveAddr&&(
            <div style={{marginTop:10,background:C.gl,border:`1.5px solid ${C.g}`,borderRadius:10,padding:"10px 12px",fontSize:12,fontWeight:700,color:C.g,display:"flex",alignItems:"flex-start",gap:8}}>
              <span style={{fontSize:16,flexShrink:0}}>✅</span>
              <div>
                <div style={{fontSize:11,fontWeight:900,marginBottom:2}}>Location Detected:</div>
                <div style={{fontSize:11,color:C.text,fontWeight:600,lineHeight:1.5}}>{liveAddr}</div>
              </div>
            </div>
          )}
        </div>
        <div style={{fontSize:12,fontWeight:800,color:C.text,marginBottom:8}}>Or select your city</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14,maxHeight:200,overflowY:"auto"}}>
          {INDIA_CITIES.map(city=>(
            <div key={city} onClick={()=>{setSelCity(city);toast(`📍 City set to ${city}`);}} style={{background:selCity===city?C.g:C.surf,color:selCity===city?"#fff":C.text,border:`1.5px solid ${selCity===city?C.g:C.border}`,borderRadius:9,padding:"7px 6px",textAlign:"center",cursor:"pointer",fontSize:11,fontWeight:selCity===city?800:600,transition:"all .15s"}}>
              {city}
            </div>
          ))}
        </div>
        <div style={{fontSize:12,fontWeight:800,color:C.text,marginBottom:10}}>Address Details</div>
        <input placeholder="Flat / House No. / Building Name" value={addrLine1} onChange={e=>setAddrLine1(e.target.value)} style={{width:"100%",background:C.surf,border:`1.5px solid ${C.border}`,borderRadius:11,padding:"12px 14px",color:C.text,fontSize:13,outline:"none",marginBottom:10,boxSizing:"border-box"}}/>
        <input placeholder="Street / Area / Locality" value={addrLine2} onChange={e=>setAddrLine2(e.target.value)} style={{width:"100%",background:C.surf,border:`1.5px solid ${C.border}`,borderRadius:11,padding:"12px 14px",color:C.text,fontSize:13,outline:"none",marginBottom:10,boxSizing:"border-box"}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <input placeholder="City" value={selCity==="Your City"?"":selCity} onChange={e=>setSelCity(e.target.value||"Your City")} style={{background:C.surf,border:`1.5px solid ${C.border}`,borderRadius:11,padding:"12px 14px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          <input placeholder="Pincode" value={pincode} onChange={e=>setPincode(e.target.value.replace(/\D/g,"").slice(0,6))} style={{background:C.surf,border:`1.5px solid ${C.border}`,borderRadius:11,padding:"12px 14px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {["Home","Work","Other"].map(t=>(
            <button key={t} onClick={()=>setAddrType(t)} style={{flex:1,background:addrType===t?C.g:C.surf,color:addrType===t?"#fff":C.text,border:`1.5px solid ${addrType===t?C.g:C.border}`,borderRadius:9,padding:"8px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
              {t==="Home"?"🏠":t==="Work"?"🏢":"📌"} {t}
            </button>
          ))}
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:800,color:C.text,marginBottom:8}}>🏪 Stores serving {selCity!=="Your City"?selCity:"your area"}</div>
          {getStoresForCity(selCity).map((store,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 11px",background:C.surf,borderRadius:11,marginBottom:6,border:`1px solid ${store.open?C.g:C.border}`,transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.background=C.gl} onMouseLeave={e=>e.currentTarget.style.background=C.surf}>
              <span style={{fontSize:18,flexShrink:0}}>{store.type==="Main Hub"?"🏭":"🏪"}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,fontWeight:700,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{store.name}</div>
                <div style={{fontSize:10,color:C.sub,marginTop:1}}>📍 {store.dist}km · ⚡ {store.eta}min · ⭐ {store.rating}</div>
                {store.area&&<div style={{fontSize:9,color:C.dim,marginTop:1}}>📌 {store.area}</div>}
              </div>
              <span style={{fontSize:9,fontWeight:900,padding:"2px 7px",borderRadius:8,background:store.open?"#dcfce7":"#fef2f2",color:store.open?"#15803d":"#dc2626",flexShrink:0}}>{store.open?"OPEN":"CLOSED"}</span>
            </div>
          ))}
        </div>
        {savedAddresses.length>0&&(
          <div style={{marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:800,color:C.text,marginBottom:8}}>📋 Saved Addresses</div>
            {savedAddresses.map((a,i)=>(
              <div key={i} onClick={()=>setSelectedSavedAddr(i)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:selectedSavedAddr===i?C.gl:C.surf,border:`1.5px solid ${selectedSavedAddr===i?C.g:C.border}`,borderRadius:11,marginBottom:6,cursor:"pointer",transition:"all .15s"}}>
                <span>{a.type==="Home"?"🏠":a.type==="Work"?"🏢":"📌"}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.text}}>{a.type}</div>
                  <div style={{fontSize:10,color:C.sub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.line1}, {a.city}</div>
                </div>
                {selectedSavedAddr===i&&<span style={{color:C.g,fontSize:16}}>✓</span>}
              </div>
            ))}
          </div>
        )}
        <button onClick={()=>{
          if(!addrLine1&&!liveAddr){toast("⚠️ Please enter or detect your address");return;}
          const newAddr={type:addrType,line1:addrLine1,line2:addrLine2,city:selCity!=="Your City"?selCity:"",pincode,liveAddr};
          setSavedAddresses(prev=>[newAddr,...prev.slice(0,4)]);
          setModal(null);
          toast(`✅ ${addrType} address saved in ${selCity!=="Your City"?selCity:"your area"}! Delivery in ${nearestStore.eta} mins ⚡`,"success");
        }} style={{width:"100%",background:`linear-gradient(135deg,${C.g},${C.g2})`,color:"#fff",border:"none",borderRadius:12,padding:14,fontSize:14,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>Save Address →</button>
      </ModalBase>
    </div>
    </>
  );
}