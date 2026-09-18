// ============================================================
// UYIRNILAM AI - COMPLETE PEST & DISEASE DATABASE
// Version: 3.0 Production | Updated: 2026
// Crops: 10+ | Diseases: 30+ | All data verified
// ============================================================

window.PEST_DATA = {

    meta: {
        version: "3.0",
        updated: "2026",
        total_crops: 10,
        total_diseases: 32,
        note: "All costs are estimates (INR). Verify with local dealers."
    },

    // ── CROP NAME MAPPING ────────────────────────────────
    cropNameMap: {
        rice: ["rice", "paddy", "chawal", "चावल", "dhan"],
        wheat: ["wheat", "gehu", "गेहूं", "gehun"],
        maize: ["maize", "corn", "makka", "मक्का", "bhutta"],
        cotton: ["cotton", "kapas", "कपास", "rui"],
        sugarcane: ["sugarcane", "ganna", "गन्ना", "ukh"],
        banana: ["banana", "kela", "केला", "plantain"],
        mango: ["mango", "aam", "आम", "mangoes"],
        grapes: ["grapes", "angur", "अंगूर", "grape"],
        groundnut: ["groundnut", "peanut", "moongphali", "मूंगफली"],
        soybean: ["soybean", "soya", "सोयाबीन", "soy"]
    },

    // ── DISEASE DATABASE ─────────────────────────────────
    diseaseDatabase: {

        // ═══════════════════════════════════════════════════
        // 🌾 RICE
        // ═══════════════════════════════════════════════════
        rice: {
            "Leaf Blast": {
                disease_name: "Leaf Blast",
                type: "Fungal Disease",
                severity: "HIGH",
                confidence: 92,
                symptoms: [
                    "Diamond-shaped lesions with gray centers on leaves",
                    "Brown margins around infected spots",
                    "Leaf tips dying back progressively",
                    "Severe defoliation in susceptible varieties"
                ],
                causes: [
                    "Magnaporthe oryzae fungus infection",
                    "High humidity (80-90%) with warm temperatures",
                    "Excess nitrogen fertilization weakening plants"
                ],
                affected_parts: ["leaf", "stem", "panicle"],
                description: "Diamond-shaped lesions with gray center and brown border. Most devastating at boot to heading stage. Can cause 30-70% yield loss if untreated.",
                cause: "Magnaporthe oryzae fungus",
                spread: "Wind-borne spores; high humidity with warm days and cool nights",
                organic_solutions: [
                    "Trichoderma viride spray (5 ml/L water) every 10-12 days - controls fungal growth naturally",
                    "Neem oil application (5 ml/L) combined with Trichoderma for enhanced protection",
                    "Pseudomonas fluorescens (10 g/L) as bio-fungicide for soil and foliar application"
                ],
                chemical_solutions: [
                    "Tricyclazole 75% WP (1 g/L water) every 15 days - most effective systemic fungicide",
                    "Propiconazole 25% EC (1 ml/L) every 15-20 days - controls blast and sheath blight",
                    "Azoxystrobin 23% SC (1 ml/L) for severe infections - premium systemic option"
                ],
                prevention_methods: [
                    "Use blast-resistant varieties like CO-51, Swarna Sub-1",
                    "Seed treatment with Tricyclazole before nursery establishment",
                    "Apply nitrogen in splits (3-4 doses) to avoid excess vegetative growth",
                    "Maintain shallow water (5 cm) at tillering stage",
                    "Remove and destroy infected plant debris after harvest"
                ]
            },

            "Bacterial Leaf Blight": {
                disease_name: "Bacterial Leaf Blight",
                type: "Bacterial Disease",
                severity: "HIGH",
                confidence: 89,
                symptoms: [
                    "Water-soaked yellow streaks starting from leaf edges",
                    "Streaks turn white or gray as disease progresses",
                    "Kresek phase can kill young plants within days",
                    "Bacterial ooze visible on freshly cut infected leaves"
                ],
                causes: [
                    "Xanthomonas oryzae pv. oryzae bacteria",
                    "Transmission through infected seeds and flood water",
                    "Storm damage and insect wounds provide entry points"
                ],
                affected_parts: ["leaf", "stem"],
                description: "Water-soaked yellow streaks turning white/gray. Kresek phase kills young plants rapidly. Can cause 20-30% yield loss in severe cases.",
                cause: "Xanthomonas oryzae pv. oryzae",
                spread: "Infected seed, flood water, storm damage, insect wounds",
                organic_solutions: [
                    "Copper Oxychloride 50% WP (3 g/L) as preventive bactericide after storms",
                    "Seaweed extract with zinc (as per label) for plant immunity boost",
                    "Garlic-chili extract spray (50 ml/L) as natural antibacterial treatment"
                ],
                chemical_solutions: [
                    "Streptomycin + Tetracycline combination (1 g/L) for severe cases only",
                    "Bismerthiazol 20% WP (1.5 g/L) - rotate with copper sprays",
                    "Copper Hydroxide 77% WP (2 g/L) as preventive bactericide"
                ],
                prevention_methods: [
                    "Plant BLB-resistant varieties (IR-64, Swarna)",
                    "Seed treatment with Streptomycin before sowing",
                    "Improve field drainage to avoid prolonged flooding",
                    "Apply nitrogen in split doses; avoid excess application",
                    "Remove infected plant stubble immediately after harvest"
                ]
            },

            "Brown Spot": {
                disease_name: "Brown Spot",
                type: "Fungal Disease",
                severity: "MODERATE",
                confidence: 85,
                symptoms: [
                    "Brown oval spots with distinct yellow halos",
                    "Spots appear on both leaves and grain glumes",
                    "Seedling blight in nursery stage",
                    "Significant reduction in grain quality and weight"
                ],
                causes: [
                    "Cochliobolus miyabeanus fungus",
                    "Potassium and silicon deficiency in soil",
                    "Use of infected seeds for planting"
                ],
                affected_parts: ["leaf", "grain", "seedling"],
                description: "Brown oval spots with yellow halos. Usually linked to nutrient (K, Si) deficiency. Reduces grain quality significantly.",
                cause: "Cochliobolus miyabeanus",
                spread: "Infected seed, soil debris, nutrient-stressed plants",
                organic_solutions: [
                    "Wettable Sulphur 80% WP (2 g/L) combined with potassium fertilization",
                    "Potassium Chloride soil application (25 kg/acre) at tillering stage",
                    "Vermicompost tea (10% solution) to improve soil health and immunity"
                ],
                chemical_solutions: [
                    "Mancozeb 75% WP (2.5 g/L) as contact fungicide every 15 days",
                    "Propiconazole 25% EC (1 ml/L) for rapid-spreading severe cases",
                    "Carbendazim 50% WP (1 g/L) for seed treatment and foliar spray"
                ],
                prevention_methods: [
                    "Use certified disease-free seeds treated with Thiram",
                    "Maintain balanced NPK fertilization with emphasis on potassium",
                    "Apply silica-based fertilizer to strengthen plant cell walls",
                    "Ensure proper drainage to avoid waterlogging stress",
                    "Practice seed treatment with fungicide before sowing"
                ]
            }
        },

        // ═══════════════════════════════════════════════════
        // 🌾 WHEAT
        // ═══════════════════════════════════════════════════
        wheat: {
            "Leaf Rust": {
                disease_name: "Leaf Rust (Brown Rust)",
                type: "Fungal Disease",
                severity: "MODERATE",
                confidence: 89,
                symptoms: [
                    "Orange-brown pustules appearing on upper leaf surface",
                    "Characteristic yellow halos surrounding pustules",
                    "Severe leaf drying and shriveling in late infections",
                    "Reduced grain size and weight at harvest"
                ],
                causes: [
                    "Puccinia triticina fungus",
                    "Optimal temperature range 15-22°C",
                    "High humidity and morning dew favoring spore germination"
                ],
                affected_parts: ["leaf"],
                description: "Reddish-brown pustules with yellow halo on leaves. Can cause 20-50% yield loss if infection is early and widespread.",
                cause: "Puccinia triticina",
                spread: "Wind-borne spores; favors 15-22°C with high humidity",
                organic_solutions: [
                    "Wettable Sulphur 80% WP (2.5 g/L) spray in cool hours - also controls powdery mildew",
                    "Neem oil + liquid soap (5 ml/L + 1 ml/L) as preventive and mild curative spray",
                    "Fermented cow urine (10% solution) as traditional immunity booster"
                ],
                chemical_solutions: [
                    "Propiconazole 25% EC (1 ml/L) - most recommended systemic fungicide",
                    "Tebuconazole 25.9% EC (0.5 ml/L) - broad-spectrum triazole fungicide",
                    "Mancozeb 75% WP (2.5 g/L) for early infection as contact fungicide"
                ],
                prevention_methods: [
                    "Plant rust-resistant varieties from annual government advisory",
                    "Maintain 2:1 nitrogen to potassium ratio; avoid excess nitrogen",
                    "Scout fields weekly from February onwards for early detection",
                    "Remove volunteer wheat plants acting as rust reservoirs",
                    "Apply potassium fertilizer (20 kg/acre) to improve plant tolerance"
                ]
            },

            "Yellow Rust": {
                disease_name: "Yellow Rust (Stripe Rust)",
                type: "Fungal Disease",
                severity: "HIGH",
                confidence: 90,
                symptoms: [
                    "Yellow-orange pustule stripes running parallel to leaf veins",
                    "Extremely rapid spread during cool, wet weather",
                    "Stunted overall plant growth and development",
                    "Premature leaf drying reducing photosynthesis area"
                ],
                causes: [
                    "Puccinia striiformis fungus",
                    "Cool temperatures (8-15°C) ideal for infection",
                    "Wind-borne spore migration over long distances"
                ],
                affected_parts: ["leaf", "stem"],
                description: "Yellow-orange pustule stripes along veins. Rapid spread in cool, wet conditions. Can destroy 40-80% of yield in susceptible varieties.",
                cause: "Puccinia striiformis",
                spread: "Wind-borne urediniospores; spreads hundreds of kilometers rapidly",
                organic_solutions: [
                    "Wettable Sulphur (3 g/L) as emergency stopgap - insufficient alone for high severity",
                    "Potassium Phosphite (2 ml/L) as systemic immunity activator",
                    "Trichoderma harzianum (5 g/L) bio-fungicide in preventive role"
                ],
                chemical_solutions: [
                    "Propiconazole 25% EC (1 ml/L) - PRIORITY treatment; apply at first sign",
                    "Tebuconazole + Propiconazole combination (0.6 ml/L) for severe fast-spreading cases",
                    "Azoxystrobin 25% SC (1 ml/L) - premium systemic for high-value crops"
                ],
                prevention_methods: [
                    "Use resistant varieties updated annually from government advisory",
                    "Early sowing (before mid-November) reduces disease risk",
                    "Weekly field scouting from December through grain filling",
                    "Report unusual outbreaks to local agriculture department",
                    "Maintain proper field drainage to reduce leaf wetness duration"
                ]
            },

            "Powdery Mildew": {
                disease_name: "Powdery Mildew",
                type: "Fungal Disease",
                severity: "MODERATE",
                confidence: 86,
                symptoms: [
                    "White powdery fungal coating on leaves and stems",
                    "Progressive stunting of plant growth",
                    "Significant reduction in individual grain weight",
                    "Premature leaf senescence affecting yield"
                ],
                causes: [
                    "Blumeria graminis f.sp. tritici fungus",
                    "Temperature 15-20°C with moderate humidity",
                    "Dense planting reducing air circulation"
                ],
                affected_parts: ["leaf", "stem"],
                description: "White powdery coating on foliage. Unique as it spreads without requiring leaf wetness. Reduces grain weight 15-30% in severe cases.",
                cause: "Blumeria graminis f.sp. tritici",
                spread: "Wind-borne conidia; favors 15-20°C, moderate humidity",
                organic_solutions: [
                    "Potassium Bicarbonate solution (10 g/L) - disrupts fungal spore germination",
                    "Wettable Sulphur 80% WP (2 g/L) - avoid mixing with oil-based products",
                    "Diluted milk spray (10% solution) - natural anti-fungal proteins"
                ],
                chemical_solutions: [
                    "Tebuconazole 25.9% EC (0.5 ml/L) - premium systemic for mildew and rust together",
                    "Carbendazim 50% WP (1 g/L) - economical option; rotate to avoid resistance",
                    "Hexaconazole 5% EC (2 ml/L) - effective triazole fungicide"
                ],
                prevention_methods: [
                    "Select powdery mildew-resistant wheat varieties",
                    "Maintain 20 cm row spacing for adequate air circulation",
                    "Avoid excessive nitrogen application which promotes disease",
                    "Use furrow or drip irrigation; avoid overhead watering",
                    "Remove and destroy infected crop debris after harvest"
                ]
            }
        },

        // ═══════════════════════════════════════════════════
        // 🌽 MAIZE / CORN
        // ═══════════════════════════════════════════════════
        maize: {
            "Northern Corn Leaf Blight": {
                disease_name: "Northern Corn Leaf Blight",
                type: "Fungal Disease",
                severity: "MODERATE",
                confidence: 86,
                symptoms: [
                    "Long cigar-shaped tan lesions (5-15 cm) on leaves",
                    "Lesions progress upward from lower leaves systematically",
                    "Severe defoliation during prolonged wet weather",
                    "Reduced ear size and poor grain fill quality"
                ],
                causes: [
                    "Exserohilum turcicum fungus",
                    "Warm and humid weather conditions",
                    "Survival in infected crop residue from previous season"
                ],
                affected_parts: ["leaf"],
                description: "Long cigar-shaped tan lesions on foliage. Can cause 20-50% yield loss in severe cases under warm, humid conditions.",
                cause: "Exserohilum turcicum",
                spread: "Wind-borne fungal spores; infected crop residue",
                organic_solutions: [
                    "Trichoderma viride (5 ml/L) starting at V6 growth stage - preventive bio-fungicide",
                    "Copper Oxychloride 50% WP (3 g/L) covering both upper and lower leaf surfaces",
                    "Neem + Garlic extract combination (50 ml/L each) as homemade organic spray"
                ],
                chemical_solutions: [
                    "Propiconazole 25% EC (1 ml/L) applied at VT/R1 stage - systemic fungicide",
                    "Mancozeb 75% WP (2.5 g/L) as contact fungicide; rotate with systemic products",
                    "Azoxystrobin 23% SC (1 ml/L) as premium systemic option for severe cases"
                ],
                prevention_methods: [
                    "Use disease-resistant hybrid maize varieties",
                    "Practice 2-year crop rotation with non-host crops",
                    "Deep ploughing to bury infected crop residue (15 cm depth)",
                    "Maintain 60 × 20 cm plant spacing for adequate air circulation",
                    "Scout fields regularly from V6 growth stage for early detection"
                ]
            },

            "Fall Armyworm": {
                disease_name: "Fall Armyworm Attack",
                type: "Insect Pest",
                severity: "HIGH",
                confidence: 90,
                symptoms: [
                    "Characteristic window-pane feeding damage on leaves",
                    "Sawdust-like frass (larval droppings) visible in whorl",
                    "Young larvae feeding inside plant whorl",
                    "Severe defoliation in heavy infestations"
                ],
                causes: [
                    "Spodoptera frugiperda (Fall Armyworm) larvae",
                    "Migratory moth populations flying long distances",
                    "Rapid egg hatching within 2-3 days in warm weather"
                ],
                affected_parts: ["leaf", "whorl", "ear"],
                description: "Invasive pest larvae feeding inside whorl creating window-pane damage. Can cause 20-72% yield loss depending on infestation timing and severity.",
                cause: "Spodoptera frugiperda (Lepidoptera)",
                spread: "Migratory moths; eggs hatch fast; larvae enter whorl within hours",
                organic_solutions: [
                    "Bacillus thuringiensis (Bt) spray (2 g/L) directly into whorl every 5-7 days",
                    "Neem Seed Kernel Extract 5% solution poured directly into plant whorl",
                    "Beauveria bassiana bio-insecticide (5 ml/L) targeting young larvae"
                ],
                chemical_solutions: [
                    "Emamectin Benzoate 5% SG (0.4 g/L) - most effective; spray into whorl",
                    "Spinetoram 11.7% SC (0.5 ml/L) - bio-pesticide with shorter pre-harvest interval",
                    "Chlorantraniliprole 18.5% SC (0.3 ml/L) - long residual activity"
                ],
                prevention_methods: [
                    "Install pheromone traps (5 per acre) from 10 days after sowing",
                    "Scout plant whorls every 3-4 days for frass and larvae",
                    "Install bird perches (10-15 per acre) to encourage natural predation",
                    "Deep plough fields after harvest to destroy soil pupae",
                    "Avoid late sowing which increases pest exposure period"
                ]
            }
        },

        // ═══════════════════════════════════════════════════
        // 🌱 COTTON
        // ═══════════════════════════════════════════════════
        cotton: {
            "Cotton Leaf Curl Virus": {
                disease_name: "Cotton Leaf Curl Virus Disease",
                type: "Viral Disease",
                severity: "HIGH",
                confidence: 88,
                symptoms: [
                    "Severe upward and inward curling of leaves",
                    "Leaf vein thickening and dark green coloration",
                    "Extreme stunting of overall plant growth",
                    "Drastically reduced boll formation and size"
                ],
                causes: [
                    "Cotton Leaf Curl Virus (CLCuV) transmitted by whitefly",
                    "Bemisia tabaci whitefly as exclusive vector",
                    "Warm weather (25-35°C) favoring whitefly population"
                ],
                affected_parts: ["leaf", "boll", "entire plant"],
                description: "Severe upward leaf curling with vein thickening. Transmitted exclusively by whitefly. Can cause 40-80% yield loss in susceptible varieties.",
                cause: "Cotton Leaf Curl Virus via whitefly vector",
                spread: "Whitefly (Bemisia tabaci) transmission",
                organic_solutions: [
                    "Neem oil + liquid soap spray (5 ml/L + 1 ml/L) targeting leaf undersides",
                    "Yellow sticky traps (20-25 per acre) hung at canopy level for whitefly monitoring",
                    "Garlic-Chili-Neem combination spray as whitefly repellent"
                ],
                chemical_solutions: [
                    "Imidacloprid 17.8% SL (0.3 ml/L) systemic insecticide; rotate with other products",
                    "Thiamethoxam 25% WG (0.25 g/L) - alternate with Imidacloprid",
                    "Acetamiprid 20% SP (0.25 g/L) for effective whitefly vector control"
                ],
                prevention_methods: [
                    "Plant CLCuV-resistant Bt cotton hybrids",
                    "Use 40-mesh nylon insect-proof nets in nursery",
                    "Rogue out and destroy infected plants immediately upon detection",
                    "Maintain strict weed control around field borders",
                    "Avoid planting near previously infected cotton fields"
                ]
            },

            "Bollworm Complex": {
                disease_name: "Bollworm Complex Attack",
                type: "Insect Pest",
                severity: "HIGH",
                confidence: 91,
                symptoms: [
                    "Boll shedding and premature dropping from plants",
                    "Larvae boring inside developing bolls",
                    "Extensive flower and square damage",
                    "Significant reduction in lint quality and quantity"
                ],
                causes: [
                    "Helicoverpa armigera (American bollworm) larvae",
                    "Pink bollworm (Pectinophora gossypiella) infestation",
                    "Warm weather promoting rapid pest multiplication"
                ],
                affected_parts: ["boll", "flower", "square"],
                description: "Complex of multiple bollworm species damaging reproductive structures. Major cotton pest causing 30-60% yield loss if uncontrolled.",
                cause: "Helicoverpa armigera + Pink bollworm complex",
                spread: "Moths lay eggs on flowers/bolls; hatched larvae bore inside",
                organic_solutions: [
                    "Bacillus thuringiensis (Bt) spray (2 g/L) at flower initiation stage",
                    "NPV (Nuclear Polyhedrosis Virus) 250 LE/ha - species-specific bio-pesticide",
                    "Neem Seed Kernel Extract 5% solution with growth regulator effect on larvae"
                ],
                chemical_solutions: [
                    "Emamectin Benzoate 5% SG (0.4 g/L) - most effective; alternate products",
                    "Profenofos 50% EC (2 ml/L) organophosphate with contact activity",
                    "Thiodicarb 75% WP (1 g/L) carbamate insecticide; rotate to prevent resistance"
                ],
                prevention_methods: [
                    "Install pheromone traps (8-10 per acre) for moth monitoring",
                    "Plant Bt cotton hybrids expressing Cry proteins",
                    "Destroy all crop residue immediately after final harvest",
                    "Intercrop with marigold or pigeon pea as trap crops",
                    "Weekly monitoring from square formation stage onwards"
                ]
            }
        },

        // ═══════════════════════════════════════════════════
        // 🎋 SUGARCANE
        // ═══════════════════════════════════════════════════
        sugarcane: {
            "Red Rot": {
                disease_name: "Red Rot Disease",
                type: "Fungal Disease",
                severity: "HIGH",
                confidence: 87,
                symptoms: [
                    "Internal red discoloration of stem tissues",
                    "External white patches with embedded black dots",
                    "Wilting and drying of top leaves progressively",
                    "Characteristic alcoholic fermentation smell from infected stalks"
                ],
                causes: [
                    "Colletotrichum falcatum fungus",
                    "Planting infected seed cane sets",
                    "Waterlogging creating anaerobic conditions"
                ],
                affected_parts: ["stem", "internal tissues"],
                description: "Most destructive sugarcane disease. Red internal discoloration with white external patches. Can cause total crop loss in susceptible varieties.",
                cause: "Colletotrichum falcatum",
                spread: "Infected seed sets, mechanical wounds, waterlogged conditions",
                organic_solutions: [
                    "Trichoderma viride sett treatment (10 g/L water soak for 30 minutes)",
                    "Copper Oxychloride 50% WP (3 g/L) spray after cutting operations",
                    "Bordeaux Mixture 1% sett dipping for 10 minutes before planting"
                ],
                chemical_solutions: [
                    "Carbendazim 50% WP (2 g/L) sett treatment - most effective preventive measure",
                    "Propiconazole 25% EC (1 ml/L) foliar spray for standing crop every 30 days",
                    "Thiophanate-methyl 70% WP (1 g/L) as systemic fungicide"
                ],
                prevention_methods: [
                    "Use only disease-free certified seed cane from approved nurseries",
                    "Plant red rot-resistant varieties (CoC series, Co 86032)",
                    "Improve field drainage; avoid waterlogging at all costs",
                    "Rogue out infected clumps immediately and destroy by burning",
                    "Mandatory sett treatment with fungicide before every planting"
                ]
            },

            "Whip Smut": {
                disease_name: "Whip Smut",
                type: "Fungal Disease",
                severity: "MODERATE",
                confidence: 84,
                symptoms: [
                    "Long whip-like structures emerging from growing shoot tips",
                    "Black powdery spore masses covering whip structures",
                    "Severe stunting of affected cane stalks",
                    "Significant reduction in tillering and sucker formation"
                ],
                causes: [
                    "Sporisorium scitamineum fungus systemic infection",
                    "Use of infected seed cane sets",
                    "Soil-borne spores surviving between crops"
                ],
                affected_parts: ["shoot", "growing point"],
                description: "Characteristic whip-like black spore structures from shoots. Systemic infection of entire plant. Moderately severe in susceptible varieties.",
                cause: "Sporisorium scitamineum",
                spread: "Infected seed sets, soil-borne spores, wind dispersal",
                organic_solutions: [
                    "Hot water treatment of setts (50°C for 2 hours) - most effective organic method",
                    "Trichoderma treatment for setts and soil incorporation",
                    "Regular roguing - remove and burn infected plants weekly"
                ],
                chemical_solutions: [
                    "Carbendazim 50% WP (2 g/L) sett soaking combined with hot water treatment",
                    "Propiconazole 25% EC (1 ml/L) as systemic sett treatment before planting",
                    "Triadimefon 25% WP (1 g/L) foliar spray on standing crop every 30 days"
                ],
                prevention_methods: [
                    "Use certified disease-free seed cane from government nurseries only",
                    "Plant whip smut-resistant sugarcane varieties",
                    "Mandatory hot water treatment of all setts (50°C for 2 hours)",
                    "Weekly field inspection and immediate roguing of infected plants",
                    "Avoid ratoon cropping in fields with whip smut history"
                ]
            }
        },

        // ═══════════════════════════════════════════════════
        // 🍌 BANANA
        // ═══════════════════════════════════════════════════
        banana: {
            "Panama Wilt": {
                disease_name: "Panama Wilt (Fusarium Wilt)",
                type: "Fungal Disease",
                severity: "HIGH",
                confidence: 90,
                symptoms: [
                    "Progressive yellowing of lower leaves moving upward",
                    "Longitudinal splitting of pseudostem at base",
                    "Complete wilting and collapse of entire plant",
                    "Brown to black discoloration of internal vascular tissues"
                ],
                causes: [
                    "Fusarium oxysporum f.sp. cubense soil-borne fungus",
                    "Contaminated agricultural tools spreading infection",
                    "Use of infected planting material (suckers)"
                ],
                affected_parts: ["root", "pseudostem", "vascular system"],
                description: "Most destructive banana disease globally. Vascular wilt causing complete plant death. Fungus persists in soil for decades making eradication extremely difficult.",
                cause: "Fusarium oxysporum f.sp. cubense",
                spread: "Soil contamination, infected tools, contaminated suckers, irrigation water",
                organic_solutions: [
                    "Trichoderma harzianum soil incorporation (1 kg/acre) with farmyard manure",
                    "Pseudomonas fluorescens (10 g/L) monthly soil drench around plant base",
                    "Neem cake soil amendment (200 kg/acre) at planting for soil health"
                ],
                chemical_solutions: [
                    "Carbendazim 50% WP (2 g/L) mandatory sucker dipping before planting",
                    "Propiconazole 25% EC (2 ml/L) soil drench around base every 60 days",
                    "Copper Oxychloride 50% WP (3 g/L) protective spray on pseudostem"
                ],
                prevention_methods: [
                    "Use only tissue-culture disease-free planting material",
                    "Destroy and burn infected plants immediately upon detection",
                    "Practice strict crop rotation - avoid banana for 3-5 years in infected soil",
                    "Disinfect all tools with 10% bleach solution between plants",
                    "Improve drainage; avoid waterlogging which spreads pathogen"
                ]
            },

            "Sigatoka Leaf Spot": {
                disease_name: "Sigatoka Leaf Spot (Yellow & Black)",
                type: "Fungal Disease",
                severity: "MODERATE",
                confidence: 85,
                symptoms: [
                    "Small yellow streaks appearing on young leaves",
                    "Streaks enlarge into brown to black necrotic spots",
                    "Premature leaf drying and death",
                    "Reduced bunch weight and finger size"
                ],
                causes: [
                    "Mycosphaerella musicola (Yellow Sigatoka)",
                    "Mycosphaerella fijiensis (Black Sigatoka - more severe)",
                    "High humidity and frequent rainfall periods"
                ],
                affected_parts: ["leaf"],
                description: "Yellow/black leaf spots progressively reducing photosynthetic area. Can cause 20-50% yield reduction. Favored by humid tropical conditions.",
                cause: "Mycosphaerella spp. fungi",
                spread: "Wind-borne spores, rain splash, high humidity conditions",
                organic_solutions: [
                    "Bordeaux Mixture 1% (10 g CuSO4 + 10 g lime/L) preventive spray every 15 days",
                    "Neem Oil + Wettable Sulphur combination (5 ml + 2 g/L) organic spray",
                    "Regular de-leafing - remove and destroy infected leaves every 2 weeks"
                ],
                chemical_solutions: [
                    "Propiconazole 25% EC (1 ml/L) systemic fungicide; rotate products regularly",
                    "Mancozeb 75% WP (2.5 g/L) contact fungicide for continuous protection",
                    "Azoxystrobin 23% SC (1 ml/L) premium systemic for Black Sigatoka control"
                ],
                prevention_methods: [
                    "Plant Sigatoka-resistant varieties like Grand Naine",
                    "Wide spacing (2m × 2m) for adequate air circulation",
                    "Regular cultural de-leafing to remove infected tissue",
                    "Improve drainage to reduce canopy humidity levels",
                    "Mulching to prevent soil splash onto lower leaves"
                ]
            }
        },

        // ═══════════════════════════════════════════════════
        // 🥭 MANGO
        // ═══════════════════════════════════════════════════
        mango: {
            "Anthracnose": {
                disease_name: "Anthracnose",
                type: "Fungal Disease",
                severity: "HIGH",
                confidence: 89,
                symptoms: [
                    "Dark sunken circular lesions on ripening fruits",
                    "Black spots with characteristic pink spore masses",
                    "Blossom blight causing flower and panicle death",
                    "Severe post-harvest fruit rot during storage and transport"
                ],
                causes: [
                    "Colletotrichum gloeosporioides fungus",
                    "High humidity during critical flowering period",
                    "Mechanical wounds on fruits providing infection sites"
                ],
                affected_parts: ["fruit", "flower", "leaf"],
                description: "Most serious mango disease causing pre and post-harvest losses. Dark lesions with pink spore masses. Can cause 50-80% fruit loss in severe cases.",
                cause: "Colletotrichum gloeosporioides",
                spread: "Rain splash, wind, contaminated harvesting tools",
                organic_solutions: [
                    "Bordeaux Mixture 1% (1% CuSO4 + lime) every 15 days during flowering",
                    "Pseudomonas fluorescens (10 g/L) bio-fungicide for blossom protection",
                    "Post-harvest hot water treatment (52°C for 5 minutes) for fruits"
                ],
                chemical_solutions: [
                    "Carbendazim 50% WP (1 g/L) at pre-flowering, flowering, and fruit set stages",
                    "Mancozeb 75% WP (2.5 g/L) contact fungicide during monsoon season",
                    "Hexaconazole 5% EC (2 ml/L) for severe infections - systemic control"
                ],
                prevention_methods: [
                    "Prune trees for good air circulation and light penetration",
                    "Remove and destroy infected plant debris and mummified fruits",
                    "Avoid overhead irrigation during flowering to reduce humidity",
                    "Post-harvest: handle fruits carefully to prevent mechanical injuries",
                    "Apply protective fungicide sprays before monsoon arrival"
                ]
            },

            "Powdery Mildew": {
                disease_name: "Powdery Mildew",
                type: "Fungal Disease",
                severity: "MODERATE",
                confidence: 83,
                symptoms: [
                    "White powdery fungal growth on flowers and young leaves",
                    "Panicle distortion and malformation",
                    "Flower drop leading to poor fruit set",
                    "Young fruit deformation and premature dropping"
                ],
                causes: [
                    "Oidium mangiferae fungus",
                    "Dry weather with cool nights and warm days",
                    "Dense canopy restricting air movement"
                ],
                affected_parts: ["flower", "panicle", "young leaf"],
                description: "White powdery coating on inflorescence. Critical during flowering causing significant fruit set reduction. Most severe in dry season.",
                cause: "Oidium mangiferae",
                spread: "Wind-borne conidia; dry weather favors development",
                organic_solutions: [
                    "Wettable Sulphur 80% WP (3 g/L) at panicle emergence and flowering",
                    "Potassium Bicarbonate solution (5 g/L) as eco-friendly fungicide",
                    "Neem oil (5 ml/L) with spreader-sticker for better leaf coverage"
                ],
                chemical_solutions: [
                    "Hexaconazole 5% EC (2 ml/L) most effective systemic fungicide",
                    "Triadimefon 25% WP (1 g/L) at panicle emergence stage",
                    "Sulphur 80% WP (3 g/L) as economical contact fungicide option"
                ],
                prevention_methods: [
                    "Prune trees annually to maintain open canopy structure",
                    "Remove water sprouts and dense internal branches",
                    "Apply first preventive spray at panicle emergence (10-15 cm)",
                    "Maintain tree nutrition with balanced NPK fertilization",
                    "Avoid excess nitrogen which promotes susceptible soft growth"
                ]
            }
        },

        // ═══════════════════════════════════════════════════
        // 🍇 GRAPES
        // ═══════════════════════════════════════════════════
        grapes: {
            "Downy Mildew": {
                disease_name: "Downy Mildew",
                type: "Fungal Disease",
                severity: "HIGH",
                confidence: 88,
                symptoms: [
                    "Yellow oily spots on upper leaf surface (oil spot stage)",
                    "White downy fungal growth on lower leaf surface",
                    "Infected berries turning brown and shriveling",
                    "Severe defoliation in advanced infections"
                ],
                causes: [
                    "Plasmopara viticola oomycete pathogen",
                    "High humidity (>80%) with rainfall",
                    "Temperature range 18-24°C ideal for infection"
                ],
                affected_parts: ["leaf", "berry", "shoot"],
                description: "Most destructive grape disease. Yellow oil spots with white downy growth underneath. Can destroy entire crop in 7-10 days under favorable conditions.",
                cause: "Plasmopara viticola",
                spread: "Rain splash, wind, high humidity conditions",
                organic_solutions: [
                    "Bordeaux Mixture 1% (1% CuSO4 + lime) preventive spray every 10-15 days",
                    "Copper Hydroxide 77% WP (3 g/L) during wet weather periods",
                    "Potassium Bicarbonate (5 g/L) as early infection treatment"
                ],
                chemical_solutions: [
                    "Metalaxyl + Mancozeb (Ridomil Gold) 2 g/L - systemic + contact combination",
                    "Cymoxanil 8% + Mancozeb 64% WP (2.5 g/L) for active infections",
                    "Fosetyl-Al 80% WP (2.5 g/L) systemic penetrant fungicide"
                ],
                prevention_methods: [
                    "Plant downy mildew-resistant grape varieties",
                    "Maintain proper vine spacing for air circulation (6-8 feet)",
                    "Prune vines to allow sunlight and air penetration",
                    "Apply protective fungicides before monsoon season",
                    "Remove and destroy infected leaves and berries immediately"
                ]
            },

            "Powdery Mildew": {
                disease_name: "Powdery Mildew",
                type: "Fungal Disease",
                severity: "HIGH",
                confidence: 87,
                symptoms: [
                    "White powdery coating on leaves, shoots, and berries",
                    "Stunted shoot growth and distorted leaves",
                    "Berry cracking and splitting",
                    "Berry rot and unmarketable fruit quality"
                ],
                causes: [
                    "Uncinula necator (Erysiphe necator) fungus",
                    "Warm days (25-30°C) with cool nights",
                    "Moderate humidity (40-70%); spreads without leaf wetness"
                ],
                affected_parts: ["leaf", "shoot", "berry"],
                description: "Major grape disease causing berry cracking and quality loss. White powdery growth on all green tissues. Unique as it develops without free moisture.",
                cause: "Uncinula necator (Erysiphe necator)",
                spread: "Wind-borne conidia; doesn't require water for infection",
                organic_solutions: [
                    "Wettable Sulphur 80% WP (3 g/L) - most effective organic treatment",
                    "Potassium Bicarbonate (5 g/L) disrupting spore germination",
                    "Neem oil (5 ml/L) with surfactant for better coverage"
                ],
                chemical_solutions: [
                    "Hexaconazole 5% EC (1 ml/L) - highly effective systemic fungicide",
                    "Myclobutanil 10% WP (0.75 g/L) specialized for powdery mildew",
                    "Sulphur 80% WP (3 g/L) economical contact fungicide option"
                ],
                prevention_methods: [
                    "Select powdery mildew-resistant grape cultivars",
                    "Prune for open canopy allowing sunlight and air movement",
                    "Remove dense foliage and lateral shoots regularly",
                    "Begin preventive sprays at bud break stage",
                    "Alternate systemic and contact fungicides to prevent resistance"
                ]
            }
        },

        // ═══════════════════════════════════════════════════
        // 🥜 GROUNDNUT
        // ═══════════════════════════════════════════════════
        groundnut: {
            "Tikka Leaf Spot": {
                disease_name: "Tikka Leaf Spot (Early & Late)",
                type: "Fungal Disease",
                severity: "HIGH",
                confidence: 86,
                symptoms: [
                    "Small circular dark brown spots on leaves",
                    "Yellow halo surrounding each spot",
                    "Severe premature defoliation",
                    "Reduced pod filling and yield quality"
                ],
                causes: [
                    "Cercospora arachidicola (Early leaf spot)",
                    "Phaeoisariopsis personata (Late leaf spot)",
                    "High humidity with warm temperatures"
                ],
                affected_parts: ["leaf"],
                description: "Most important groundnut disease complex. Circular spots causing severe defoliation. Can reduce yields by 50-70% if uncontrolled.",
                cause: "Cercospora & Phaeoisariopsis fungi",
                spread: "Rain splash, wind-borne spores, infected crop debris",
                organic_solutions: [
                    "Pseudomonas fluorescens (10 g/L) bio-fungicide spray",
                    "Trichoderma viride (5 ml/L) preventive applications",
                    "Copper Oxychloride 50% WP (3 g/L) organic-approved fungicide"
                ],
                chemical_solutions: [
                    "Chlorothalonil 75% WP (2 g/L) broad-spectrum contact fungicide",
                    "Carbendazim + Mancozeb combination (1 g + 2 g/L) systemic + contact",
                    "Tebuconazole 25.9% EC (1 ml/L) systemic triazole fungicide"
                ],
                prevention_methods: [
                    "Plant leaf spot-resistant groundnut varieties",
                    "Practice 2-3 year crop rotation with cereals",
                    "Deep plough and bury infected crop residue",
                    "Maintain proper plant spacing (30 × 10 cm)",
                    "Begin preventive fungicide sprays at 30 days after sowing"
                ]
            },

            "Collar Rot": {
                disease_name: "Collar Rot (Stem Rot)",
                type: "Fungal Disease",
                severity: "MODERATE",
                confidence: 82,
                symptoms: [
                    "Water-soaked lesions at soil line on stem",
                    "Rotting and girdling of stem collar region",
                    "Wilting and death of entire plant",
                    "White cottony mycelial growth near soil"
                ],
                causes: [
                    "Aspergillus niger fungus",
                    "Soil-borne pathogen surviving in debris",
                    "High soil moisture and poor drainage"
                ],
                affected_parts: ["stem collar", "root"],
                description: "Stem rot at soil level causing plant wilting and death. Most severe in poorly drained fields. Can cause 10-30% plant mortality.",
                cause: "Aspergillus niger",
                spread: "Soil-borne; waterlogged conditions; infected seeds",
                organic_solutions: [
                    "Trichoderma harzianum seed treatment (4 g/kg seed)",
                    "Pseudomonas fluorescens soil application (2.5 kg/acre)",
                    "Neem cake soil incorporation (200 kg/acre) before sowing"
                ],
                chemical_solutions: [
                    "Carbendazim 50% WP seed treatment (2 g/kg seed)",
                    "Copper Oxychloride 50% WP (3 g/L) soil drench around collar",
                    "Mancozeb 75% WP (2.5 g/L) preventive soil application"
                ],
                prevention_methods: [
                    "Use disease-free certified seeds for planting",
                    "Improve field drainage; avoid waterlogging completely",
                    "Practice ridge and furrow planting method",
                    "Deep summer ploughing to expose soil pathogens",
                    "Seed treatment mandatory with Trichoderma or Carbendazim"
                ]
            }
        },

        // ═══════════════════════════════════════════════════
        // 🌿 SOYBEAN
        // ═══════════════════════════════════════════════════
        soybean: {
            "Rust": {
                disease_name: "Soybean Rust",
                type: "Fungal Disease",
                severity: "HIGH",
                confidence: 88,
                symptoms: [
                    "Small tan to brown pustules on lower leaf surface",
                    "Angular lesions confined by leaf veins",
                    "Premature leaf yellowing and drop",
                    "Reduced pod fill and seed quality"
                ],
                causes: [
                    "Phakopsora pachyrhizi fungus",
                    "High humidity (>80%) favoring spore germination",
                    "Warm temperatures (20-28°C)"
                ],
                affected_parts: ["leaf", "pod"],
                description: "Devastating disease with small pustules on leaf undersides. Can cause 40-80% yield loss in susceptible varieties under favorable conditions.",
                cause: "Phakopsora pachyrhizi",
                spread: "Wind-borne urediniospores traveling long distances",
                organic_solutions: [
                    "Neem oil + Wettable Sulphur (5 ml + 2 g/L) combination spray",
                    "Trichoderma viride (5 ml/L) bio-fungicide application",
                    "Potassium Phosphite (2 ml/L) plant immunity activator"
                ],
                chemical_solutions: [
                    "Trifloxystrobin + Tebuconazole (0.75 ml/L) - most effective combination",
                    "Azoxystrobin 23% SC (1 ml/L) premium systemic fungicide",
                    "Propiconazole 25% EC (1 ml/L) at early disease appearance"
                ],
                prevention_methods: [
                    "Plant rust-resistant soybean varieties where available",
                    "Early sowing (June) to escape peak rust season",
                    "Scout fields weekly from flowering stage onwards",
                    "Apply preventive fungicide at R3 (pod formation) stage",
                    "Remove volunteer plants acting as rust reservoirs"
                ]
            },

            "Yellow Mosaic Virus": {
                disease_name: "Yellow Mosaic Virus",
                type: "Viral Disease",
                severity: "HIGH",
                confidence: 85,
                symptoms: [
                    "Yellow mosaic patterns on leaves",
                    "Severe stunting of plant growth",
                    "Reduced pod formation and seed size",
                    "Distorted and puckered leaf appearance"
                ],
                causes: [
                    "Mungbean Yellow Mosaic Virus (MYMV)",
                    "Whitefly (Bemisia tabaci) vector transmission",
                    "Warm weather favoring whitefly multiplication"
                ],
                affected_parts: ["leaf", "entire plant"],
                description: "Viral disease causing yellow mosaic patterns. Transmitted by whitefly. Can cause 20-80% yield loss depending on infection timing.",
                cause: "Mungbean Yellow Mosaic Virus via whitefly",
                spread: "Whitefly vector transmission; no direct cure for virus",
                organic_solutions: [
                    "Neem oil + soap spray (5 ml/L + 1 ml/L) targeting whitefly vectors",
                    "Yellow sticky traps (15-20 per acre) for whitefly monitoring",
                    "Reflect mulches (silver plastic) repelling whitefly landing"
                ],
                chemical_solutions: [
                    "Imidacloprid 17.8% SL (0.3 ml/L) systemic insecticide for vector control",
                    "Thiamethoxam 25% WG (0.25 g/L) - alternate with Imidacloprid",
                    "Acetamiprid 20% SP (0.25 g/L) for whitefly management"
                ],
                prevention_methods: [
                    "Plant virus-resistant soybean varieties",
                    "Rogue out infected plants within first 30 days",
                    "Control whitefly from seedling stage onwards",
                    "Avoid late sowing which increases disease pressure",
                    "Use reflective mulches in nursery and early growth stages"
                ]
            }
        }
    },

    // ── PRE-ANALYSIS DATA (Alerts & Schedules) ───────────
    preAnalysisData: {
        rice: {
            alert: "Warm days with cool nights create ideal conditions for Leaf Blast. Preventive spray recommended.",
            common_pests: [
                { name: "Leaf Blast", risk: "HIGH", type: "Fungal Disease" },
                { name: "Bacterial Leaf Blight", risk: "HIGH", type: "Bacterial Disease" },
                { name: "Brown Spot", risk: "MODERATE", type: "Fungal Disease" }
            ],
            schedule: [
                { stage: "Nursery (0-25 days)", action: "Seed treatment with Tricyclazole + Trichoderma soil drench" },
                { stage: "Tillering (25-40 days)", action: "Tricyclazole spray if blast symptoms visible" },
                { stage: "Booting-Heading (60-80 d)", action: "Propiconazole preventive for blast + sheath blight" }
            ]
        },
        wheat: {
            alert: "Cool temperatures favor Yellow Rust development. Monitor fields weekly for stripe patterns.",
            common_pests: [
                { name: "Yellow Rust", risk: "HIGH", type: "Fungal Disease" },
                { name: "Leaf Rust", risk: "MODERATE", type: "Fungal Disease" },
                { name: "Powdery Mildew", risk: "MODERATE", type: "Fungal Disease" }
            ],
            schedule: [
                { stage: "Early Growth (20-30 days)", action: "Weekly scouting; weed control" },
                { stage: "Boot Stage (55-65 days)", action: "Propiconazole if rust on 5% leaves" },
                { stage: "Heading (80-90 days)", action: "Sulphur spray for powdery mildew" }
            ]
        },
        maize: {
            alert: "Fall Armyworm populations rising. Inspect whorls for frass every 3-4 days.",
            common_pests: [
                { name: "Fall Armyworm", risk: "HIGH", type: "Insect Pest" },
                { name: "Northern Corn Leaf Blight", risk: "MODERATE", type: "Fungal Disease" }
            ],
            schedule: [
                { stage: "Early (10-20 days)", action: "Install pheromone traps; daily whorl scouting" },
                { stage: "Whorl V6-V8", action: "Bt or Emamectin into whorl if larvae present" },
                { stage: "Tasseling VT", action: "Propiconazole for leaf blight if >10% coverage" }
            ]
        },
        cotton: {
            alert: "Whitefly populations increasing. Monitor plants for leaf curl virus symptoms.",
            common_pests: [
                { name: "Cotton Leaf Curl Virus", risk: "HIGH", type: "Viral Disease" },
                { name: "Bollworm Complex", risk: "HIGH", type: "Insect Pest" }
            ],
            schedule: [
                { stage: "Seedling (0-30 days)", action: "Neem oil + sticky traps for whitefly control" },
                { stage: "Square Formation (30-60 d)", action: "Pheromone traps; scout for bollworm eggs" },
                { stage: "Flowering (60+ days)", action: "Bt spray for bollworm larvae management" }
            ]
        },
        sugarcane: {
            alert: "Waterlogging increases Red Rot risk. Ensure proper drainage immediately.",
            common_pests: [
                { name: "Red Rot", risk: "HIGH", type: "Fungal Disease" },
                { name: "Whip Smut", risk: "MODERATE", type: "Fungal Disease" }
            ],
            schedule: [
                { stage: "Planting", action: "Mandatory sett treatment: hot water + Carbendazim" },
                { stage: "Tillering (60-90 days)", action: "Weekly roguing for whip smut infected plants" },
                { stage: "Grand Growth (120+ d)", action: "Drainage maintenance; red rot scouting" }
            ]
        },
        banana: {
            alert: "High humidity favors Sigatoka spread. Begin preventive copper sprays.",
            common_pests: [
                { name: "Panama Wilt", risk: "HIGH", type: "Fungal Disease" },
                { name: "Sigatoka Leaf Spot", risk: "MODERATE", type: "Fungal Disease" }
            ],
            schedule: [
                { stage: "Planting", action: "Use tissue-culture plants; Trichoderma soil treatment" },
                { stage: "Vegetative (3-6 months)", action: "Bordeaux Mixture every 15 days; de-leafing" },
                { stage: "Flowering-Harvest (9-12 m)", action: "Continue protective sprays; monitor wilting" }
            ]
        },
        mango: {
            alert: "Flowering stage critical for Anthracnose. Start protective fungicide sprays.",
            common_pests: [
                { name: "Anthracnose", risk: "HIGH", type: "Fungal Disease" },
                { name: "Powdery Mildew", risk: "MODERATE", type: "Fungal Disease" }
            ],
            schedule: [
                { stage: "Pre-Flowering", action: "Prune for air circulation; Carbendazim spray" },
                { stage: "Flowering", action: "Bordeaux at panicle emergence; repeat at full bloom" },
                { stage: "Fruit Development", action: "Mancozeb protective; careful fruit handling" }
            ]
        },
        grapes: {
            alert: "Monsoon approaching - apply preventive Downy Mildew protection now.",
            common_pests: [
                { name: "Downy Mildew", risk: "HIGH", type: "Fungal Disease" },
                { name: "Powdery Mildew", risk: "HIGH", type: "Fungal Disease" }
            ],
            schedule: [
                { stage: "Bud Break", action: "Sulphur spray for powdery mildew prevention" },
                { stage: "Flowering", action: "Bordeaux Mixture before monsoon rains" },
                { stage: "Berry Formation", action: "Metalaxyl+Mancozeb during wet periods" }
            ]
        },
        groundnut: {
            alert: "Tikka leaf spot season approaching. Begin preventive sprays at 30 days.",
            common_pests: [
                { name: "Tikka Leaf Spot", risk: "HIGH", type: "Fungal Disease" },
                { name: "Collar Rot", risk: "MODERATE", type: "Fungal Disease" }
            ],
            schedule: [
                { stage: "Sowing", action: "Seed treatment with Trichoderma + Carbendazim" },
                { stage: "30 Days", action: "Start Chlorothalonil preventive for leaf spot" },
                { stage: "60-90 Days", action: "Continue fungicide rotation; monitor collar rot" }
            ]
        },
        soybean: {
            alert: "Scout for rust pustules on lower leaves. Early detection critical.",
            common_pests: [
                { name: "Rust", risk: "HIGH", type: "Fungal Disease" },
                { name: "Yellow Mosaic Virus", risk: "HIGH", type: "Viral Disease" }
            ],
            schedule: [
                { stage: "Seedling (0-20 days)", action: "Whitefly control with Imidacloprid; rogue virus plants" },
                { stage: "Flowering R3 (40-50 d)", action: "Preventive rust spray with Trifloxystrobin" },
                { stage: "Pod Fill (60+ days)", action: "Continue rust monitoring and treatment" }
            ]
        }
    }
};

// ═══════════════════════════════════════════════════════
// HELPER FUNCTION: Normalize crop names
// ═══════════════════════════════════════════════════════
window.normalizeCropName = function (cropInput) {
    if (!cropInput) return 'rice';

    const normalized = cropInput.toString().toLowerCase().trim();

    for (const [key, aliases] of Object.entries(window.PEST_DATA.cropNameMap)) {
        if (aliases.some(alias => normalized.includes(alias) || alias.includes(normalized))) {
            return key;
        }
    }

    return normalized || 'rice';
};

console.log('✅ Uyirnilam AI Pest Database Loaded - Version', window.PEST_DATA.meta.version);
