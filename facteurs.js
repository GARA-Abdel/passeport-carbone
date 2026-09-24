/* =========================================
   PASSEPORT CARBONE
   BASE DE FACTEURS D'ÉMISSION
   Prototype de recherche — 2026
   Référence méthodologique : cahier des charges
   ========================================= */


/* =========================================
   POTENTIELS DE RÉCHAUFFEMENT GLOBAL (AR4, 100 ans)
   ========================================= */

const GWP_BURKINA = {
    CO2: 1,
    CH4: 25,
    N2O: 298,
    reference: "IPCC AR4 — horizon 100 ans",
    note: "Cohérent avec les GWP des fluides frigorigènes du prototype."
};


/* =========================================
   COMBUSTIBLES FOSSILES ET BIOMASSE
   Facteurs GIEC 2006, Vol.2, Ch.3
   NCV = pouvoir calorifique inférieur (MJ/kg)
   densite = kg/L pour les liquides
   ========================================= */

const FACTEURS_COMBUSTIBLES = {

    essence: {
        nom: "Essence",
        unite: "litre",
        NCV: 44.3,
        densite: 0.745,
        facteurCO2: 69300,
        facteurCH4: 33,
        facteurN2O: 3.2,
        uniteFacteur: "kg/TJ",
        source: "GIEC 2006, Vol.2, Ch.3 — combustion mobile",
        anneeReference: 2006,
        perimetre: "Scope 1",
        statut: "default",
        usage: "moteur de véhicule"
    },

    diesel_moteur: {
        nom: "Diesel / Gasoil — moteur de véhicule",
        unite: "litre",
        NCV: 43.0,
        densite: 0.845,
        facteurCO2: 74100,
        facteurCH4: 3.9,
        facteurN2O: 3.9,
        uniteFacteur: "kg/TJ",
        source: "GIEC 2006, Vol.2, Ch.3, Table 3.2.2 (routes)",
        anneeReference: 2006,
        perimetre: "Scope 1",
        statut: "default",
        usage: "moteur"
    },

    diesel_groupe: {
        nom: "Diesel — groupe électrogène / chaudière",
        unite: "litre",
        NCV: 43.0,
        densite: 0.845,
        facteurCO2: 74100,
        facteurCH4: 3,
        facteurN2O: 0.6,
        uniteFacteur: "kg/TJ",
        source: "GIEC 2006, Vol.2, Ch.3, Table 3.2.1 (stationnaire, autres secteurs)",
        anneeReference: 2006,
        perimetre: "Scope 1",
        statut: "default",
        usage: "stationnaire"
    },

    propane: {
        nom: "GPL / Butane / Propane",
        unite: "kg",
        NCV: 47.3,
        densite: null,
        facteurCO2: 63100,
        facteurCH4: 5,
        facteurN2O: 0.1,
        uniteFacteur: "kg/TJ",
        source: "GIEC 2006, Vol.2, Ch.3 — combustion stationnaire",
        anneeReference: 2006,
        perimetre: "Scope 1",
        statut: "default"
    },

    fioul: {
        nom: "Fioul lourd / résiduel",
        unite: "kg",
        NCV: 40.4,
        densite: 0.950,
        facteurCO2: 77400,
        facteurCH4: 3,
        facteurN2O: 0.6,
        uniteFacteur: "kg/TJ",
        source: "GIEC 2006, Vol.2, Ch.3 — combustion institutionnelle",
        anneeReference: 2006,
        perimetre: "Scope 1",
        statut: "default"
    },

    bois: {
        nom: "Bois de chauffe",
        unite: "kg",
        NCV: 15,
        densite: null,
        facteurCO2: 112000,
        facteurCH4: 30,
        facteurN2O: 4,
        uniteFacteur: "kg/TJ",
        source: "GIEC 2006, Vol.2, Ch.3 — biomasse solide",
        anneeReference: 2006,
        perimetre: "Scope 1 + biogénique",
        statut: "default",
        biogenique: true,
        note: "Le CO2 est biogénique et reporté séparément. Seuls CH4 et N2O entrent dans le total opérationnel."
    },

    charbon_bois: {
        nom: "Charbon de bois",
        unite: "kg",
        NCV: 29,
        densite: null,
        facteurCO2: 112000,
        facteurCH4: 200,
        facteurN2O: 1,
        uniteFacteur: "kg/TJ",
        source: "GIEC 2006, Vol.2, Ch.3 — combustion institutionnelle (GHG Protocol)",
        anneeReference: 2006,
        perimetre: "Scope 1 + biogénique",
        statut: "default",
        biogenique: true,
        note: "CO2 biogénique séparé. Ne couvre pas la fabrication du charbon, le transport du bois, ni la déforestation."
    }

};


/* =========================================
   ÉLECTRICITÉ — FACTEURS VERSIONNÉS
   ========================================= */

const FACTEURS_ELECTRICITE = [

    {
        id: "reseau_2018",
        nom: "Réseau électrique — référence 2018",
        facteur: 0.569,
        unite: "kgCO2e/kWh",
        anneeReference: 2018,
        zone: "Burkina Faso / SONABEL",
        perimetre: "Scope 2 (location-based)",
        statut: "reference",
        source: "Étude mix électrique SONABEL 2018",
        note: "Facteur de référence retenu pour le prototype. À actualiser dès qu'une valeur récente est disponible."
    },

    {
        id: "reseau_2014",
        nom: "Réseau électrique — historique 2014",
        facteur: 0.588,
        unite: "kgCO2e/kWh",
        anneeReference: 2014,
        zone: "Burkina Faso / WAPP",
        perimetre: "Scope 2 (location-based)",
        statut: "historique",
        source: "UNFCCC / West African Power Pool",
        note: "Ne pas présenter comme facteur officiel 2026. Conservé pour la traçabilité."
    }

];

const FACTEUR_ELECTRICITE_PAR_DEFAUT = "reseau_2018";

/* Tarif moyen SONABEL pour le fallback FCFA → kWh (professionnel, estimation) */
const TARIF_MOYEN_FCFA_KWH = {
    valeur: 130,
    unite: "FCFA/kWh",
    zone: "Burkina Faso",
    source: "Estimation — grille SONABEL professionnelle, à affiner par usage",
    statut: "provisoire"
};


/* =========================================
   FLUIDES FRIGORIGÈNES — GWP AR4
   ========================================= */

const FACTEURS_FRIGORIGENES = {

    r134a: {
        nom: "R-134a",
        facteur: 1430,
        unite: "kgCO2e/kg",
        type: "GWP AR4",
        source: "IPCC AR4 — 100 ans"
    },

    r404a: {
        nom: "R-404A",
        facteur: 3922,
        unite: "kgCO2e/kg",
        type: "GWP AR4",
        source: "IPCC AR4 — 100 ans"
    },

    r32: {
        nom: "R-32",
        facteur: 675,
        unite: "kgCO2e/kg",
        type: "GWP AR4",
        source: "IPCC AR4 — 100 ans"
    },

    r410a: {
        nom: "R-410A",
        facteur: 2088,
        unite: "kgCO2e/kg",
        type: "GWP AR4",
        source: "IPCC AR4 — 100 ans"
    },

    r407c: {
        nom: "R-407C",
        facteur: 1774,
        unite: "kgCO2e/kg",
        type: "GWP AR4",
        source: "IPCC AR4 — 100 ans"
    }

};


/* =========================================
   CIMENT — FACTEUR PROVISOIRE
   ========================================= */

const FACTEUR_CIMENT = {
    nom: "Ciment (moyenne générique)",
    facteur: 0.85,
    unite: "kgCO2e/kg",
    statut: "provisoire",
    source: "Valeur générique internationale (clinker moyen)",
    note: "Approximation provisoire. À remplacer dès qu'un facteur fournisseur ou régional représentatif du ciment commercialisé au Burkina Faso est disponible. Poste séparé du diesel des engins et de l'électricité du chantier."
};


/* =========================================
   ÉLEVAGE — FERMENTATION ENTÉRIQUE
   GIEC 2006, Vol.4, Ch.10 — valeurs Afrique subsaharienne
   ========================================= */

const FACTEURS_ELEVAGE = {

    bovins: {
        nom: "Bovins",
        facteurCH4Annuel: 31,
        unite: "kgCH4/tête/an",
        facteurCO2eAnnuel: 775,
        source: "GIEC 2006, Vol.4, Ch.10, Table 10.10 (Afrique)",
        statut: "default",
        note: "Divisé par 12 pour obtenir une estimation mensuelle."
    },

    ovins: {
        nom: "Ovins",
        facteurCH4Annuel: 5,
        unite: "kgCH4/tête/an",
        facteurCO2eAnnuel: 125,
        source: "GIEC 2006, Vol.4, Ch.10, Table 10.10 (Afrique)",
        statut: "default"
    },

    caprins: {
        nom: "Caprins",
        facteurCH4Annuel: 5,
        unite: "kgCH4/tête/an",
        facteurCO2eAnnuel: 125,
        source: "GIEC 2006, Vol.4, Ch.10, Table 10.10 (Afrique)",
        statut: "default"
    },

    porcins: {
        nom: "Porcins",
        facteurCH4Annuel: 1,
        unite: "kgCH4/tête/an",
        facteurCO2eAnnuel: 25,
        source: "GIEC 2006, Vol.4, Ch.10, Table 10.10 (Afrique)",
        statut: "default"
    }

};

const GESTION_FUMIER = [
    { id: "paturage",   nom: "Laissé au pâturage" },
    { id: "tas",        nom: "Stocké en tas" },
    { id: "compost",    nom: "Composté" },
    { id: "fosse",      nom: "Fosse / accumulation" },
    { id: "epandage",   nom: "Épandu sur les sols" },
    { id: "biodigesteur", nom: "Biodigesteur" }
];


/* =========================================
   ENGRAIS AZOTÉS
   GIEC 2006, Vol.4, Ch.11 — émissions directes N2O
   ========================================= */

const FACTEURS_ENGRAIS = {

    uree: {
        nom: "Urée (46 % N)",
        teneurN: 0.46,
        facteurCO2Uree: 0.733,
        source: "GIEC 2006, Vol.4, Ch.11 + hydrolyse urée",
        statut: "default"
    },

    npk_15_15_15: {
        nom: "NPK 15-15-15 (15 % N)",
        teneurN: 0.15,
        source: "GIEC 2006, Vol.4, Ch.11",
        statut: "default"
    },

    npk_14_23_14: {
        nom: "NPK 14-23-14 (14 % N, coton)",
        teneurN: 0.14,
        source: "GIEC 2006, Vol.4, Ch.11",
        statut: "default"
    },

    sulfate_ammonium: {
        nom: "Sulfate d'ammonium (21 % N)",
        teneurN: 0.21,
        source: "GIEC 2006, Vol.4, Ch.11",
        statut: "default"
    }

};

/* Facteur N2O direct : 0.01 kg N2O-N / kg N, converti en N2O (× 44/28), pondéré GWP AR4 */
const FACTEUR_N2O_DIRECT_PAR_KG_N = 0.01 * (44 / 28) * GWP_BURKINA.N2O; // ≈ 4.68 kgCO2e/kgN


/* =========================================
   DÉCHETS ORGANIQUES
   Le facteur dépend du mode de traitement.
   Tant qu'aucune quantité ET destination ne sont fournies,
   aucune estimation n'est produite.
   ========================================= */

const DESTINATIONS_DECHETS = [
    { id: "compostage",    nom: "Compostage" },
    { id: "brulage",       nom: "Brûlage" },
    { id: "decharge",      nom: "Mise en décharge" },
    { id: "alim_animale",  nom: "Alimentation animale" },
    { id: "biodigesteur",  nom: "Biodigesteur" }
];


/* =========================================
   UNITÉS LOCALES — CONVERSIONS DOCUMENTÉES
   Chaque conversion affiche sa source.
   Les valeurs marquées "provisoire" doivent être confirmées.
   ========================================= */

const UNITES_LOCALES = {

    carburant_liquide: [
        { id: "litre",    nom: "Litres",          multiplicateur: 1 },
        { id: "bidon_20", nom: "Bidon de 20 L",   multiplicateur: 20 },
        { id: "fut_200",  nom: "Fût de 200 L",    multiplicateur: 200 }
    ],

    gpl: [
        { id: "bouteille_6",   nom: "Bouteille 6 kg",    multiplicateur: 6,   provisoire: false },
        { id: "bouteille_12_5",nom: "Bouteille 12,5 kg", multiplicateur: 12.5,provisoire: false },
        { id: "bouteille_25",  nom: "Bouteille 25 kg",   multiplicateur: 25,  provisoire: false },
        { id: "bouteille_50",  nom: "Bouteille 50 kg",   multiplicateur: 50,  provisoire: false },
        { id: "kg",            nom: "Kilogrammes",       multiplicateur: 1 }
    ],

    bois: [
        { id: "kg",    nom: "Kilogrammes",    multiplicateur: 1 },
        { id: "fagot", nom: "Fagot (~20 kg)", multiplicateur: 20, provisoire: true }
    ],

    charbon: [
        { id: "kg",  nom: "Kilogrammes",   multiplicateur: 1 },
        { id: "sac", nom: "Sac (~30 kg)",  multiplicateur: 30, provisoire: true }
    ],

    ciment: [
        { id: "sac_50", nom: "Sac de 50 kg", multiplicateur: 50 },
        { id: "tonne",  nom: "Tonne",        multiplicateur: 1000 }
    ],

    engrais: [
        { id: "sac_50", nom: "Sac de 50 kg", multiplicateur: 50 },
        { id: "kg",     nom: "Kilogrammes",  multiplicateur: 1 },
        { id: "tonne",  nom: "Tonne",        multiplicateur: 1000 }
    ]

};


/* =========================================
   QUALITÉ DE DONNÉE
   ========================================= */

const QUALITES = {
    confirmee:  { id: "confirmee",  nom: "Confirmée",  description: "Facture, reçu, relevé de compteur, bon de livraison." },
    declaree:   { id: "declaree",   nom: "Déclarée",   description: "Quantité renseignée sans justificatif." },
    estimee:    { id: "estimee",    nom: "Estimée",    description: "Calculée depuis un montant FCFA, un nombre de sacs, une conversion locale." },
    manquante:  { id: "manquante",  nom: "Manquante",  description: "Source identifiée mais quantité indisponible." }
};


/* =========================================
   STRUCTURE GLOBALE — AGRÉGAT
   ========================================= */

const FACTEURS_EMISSION = {

    /* Électricité */
    electricite_reference: FACTEURS_ELECTRICITE[0],
    electricite_historique: FACTEURS_ELECTRICITE[1],

    /* Combustibles */
    essence: FACTEURS_COMBUSTIBLES.essence,
    diesel_moteur: FACTEURS_COMBUSTIBLES.diesel_moteur,
    diesel_groupe: FACTEURS_COMBUSTIBLES.diesel_groupe,
    propane: FACTEURS_COMBUSTIBLES.propane,
    fioul: FACTEURS_COMBUSTIBLES.fioul,

    /* Biomasse */
    bois: FACTEURS_COMBUSTIBLES.bois,
    charbon_bois: FACTEURS_COMBUSTIBLES.charbon_bois,

    /* Fluides */
    r134a: FACTEURS_FRIGORIGENES.r134a,
    r404a: FACTEURS_FRIGORIGENES.r404a,
    r32: FACTEURS_FRIGORIGENES.r32,
    r410a: FACTEURS_FRIGORIGENES.r410a,
    r407c: FACTEURS_FRIGORIGENES.r407c,

    /* BTP */
    ciment: FACTEUR_CIMENT

};
