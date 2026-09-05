/* =========================================
   PASSEPORT CARBONE
   FACTEURS D'EMISSION
   Prototype de recherche — 2026
   ========================================= */


/* =========================================
   POTENTIELS DE RECHAUFFEMENT GLOBAL
   ========================================= */

const GWP_BURKINA = {

    CO2: 1,

    CH4: 28,

    N2O: 265

};


/* =========================================
   COMBUSTIBLES
   =========================================
   
   Les facteurs sont exprimés en kg de gaz
   à effet de serre par TJ d'énergie.
   
   Le moteur de calcul effectue ensuite
   les conversions nécessaires.
   ========================================= */

const FACTEURS_COMBUSTIBLES = {


    /* -----------------------------------------
       ESSENCE
       ----------------------------------------- */

    essence: {

        nom: "Essence",

        unite: "litre",

        facteurCO2: 69300,

        facteurCH4: 33,

        facteurN2O: 3.2,

        uniteFacteur: "kg/TJ",

        NCV: 44.3,

        conversionVolumeMasse: 1351,

        source:
            "Facteurs de référence GIEC 2006 / données nationales disponibles"

    },


    /* -----------------------------------------
       DIESEL / GASOIL
       ----------------------------------------- */

    diesel: {

        nom: "Gasoil / Diesel",

        unite: "litre",

        facteurCO2: 74100,

        facteurCH4: 3.9,

        facteurN2O: 3.9,

        uniteFacteur: "kg/TJ",

        NCV: 43.0,

        conversionVolumeMasse: 1149,

        source:
            "Facteurs de référence GIEC 2006 / données nationales disponibles"

    },


    /* -----------------------------------------
       GPL / BUTANE
       ----------------------------------------- */

    propane: {

        nom: "GPL / Butane",

        unite: "kg",

        facteurCO2: 63100,

        facteurCH4: 5,

        facteurN2O: 0.1,

        uniteFacteur: "kg/TJ",

        NCV: 47.3,

        conversionVolumeMasse: 0,

        source:
            "Facteurs de référence GIEC 2006 / données nationales disponibles"

    },


    /* -----------------------------------------
       FIOUL
       ----------------------------------------- */

    fioul: {

        nom: "Fioul",

        unite: "litre",

        facteurCO2: 77400,

        facteurCH4: 3,

        facteurN2O: 0.6,

        uniteFacteur: "kg/TJ",

        NCV: 40.4,

        conversionVolumeMasse: 1053,

        source:
            "Facteurs de référence GIEC 2006"

    }

};


/* =========================================
   BIOMASSE — BOIS
   =========================================
   
   Le bois est traité séparément car il est
   utilisé directement dans plusieurs activités
   des PME étudiées.
   
   Valeurs utilisées pour le prototype :
   NCV = 15 TJ/Gg
   ========================================= */

const FACTEUR_BOIS = {

    nom: "Bois de chauffe",

    unite: "kg",

    NCV: 15,

    facteurCO2: 112000,

    facteurCH4: 30,

    facteurN2O: 4,

    uniteFacteur: "kg/TJ",

    source:
        "Valeurs de référence utilisées pour le prototype — à affiner selon la biomasse étudiée"

};


/* =========================================
   CHARBON DE BOIS
   ========================================= */

const FACTEUR_CHARBON = {

    nom: "Charbon de bois",

    unite: "kg",

    NCV: 29,

    facteurCO2: 94600,

    facteurCH4: 10,

    facteurN2O: 1.5,

    uniteFacteur: "kg/TJ",

    source:
        "Valeurs de référence utilisées pour le prototype — à documenter selon le contexte national"

};


/* =========================================
   ELECTRICITE
   ========================================= */

const FACTEUR_ELECTRICITE = {

    unite: "kWh",

    facteur: 0.588,

    uniteFacteur: "kgCO2e/kWh",

    anneeReference: 2014,

    statut:
        "Facteur de référence historique — ne pas présenter comme facteur officiel 2026",

    source:
        "Référence historique du réseau électrique du Burkina Faso"


};


/* =========================================
   FLUIDES FRIGORIGENES
   =========================================
   
   Ces valeurs correspondent au GWP des
   fluides et non à des facteurs nationaux
   d'émission.
   ========================================= */

const FACTEURS_FRIGORIGENES = {


    /* R-134a */

    r134a: {

        nom: "R-134a",

        unite: "kg",

        facteur: 1430,

        type: "GWP",

        source:
            "Valeur internationale de référence du GWP"

    },


    /* R-404A */

    r404a: {

        nom: "R-404A",

        unite: "kg",

        facteur: 3922,

        type: "GWP",

        source:
            "Valeur internationale de référence du GWP"

    },


    /* R-32 */

    r32: {

        nom: "R-32",

        unite: "kg",

        facteur: 675,

        type: "GWP",

        source:
            "Valeur internationale de référence du GWP"

    }

};


/* =========================================
   CIMENT
   =========================================
   
   Le ciment représente une source importante
   dans le secteur BTP.
   
   Pour éviter d'utiliser un facteur sans
   justification méthodologique suffisante,
   le calcul automatique reste désactivé
   dans cette version du prototype.
   ========================================= */

const FACTEUR_CIMENT = {

    unite: "kg",

    facteur: 0,

    statut:
        "Facteur à documenter avant intégration au calcul",

    source:
        "Non retenu dans la version actuelle du prototype"

};


/* =========================================
   DECHETS ORGANIQUES
   =========================================
   
   La quantité seule ne permet pas de déterminer
   correctement les émissions.
   
   Le traitement doit être connu :
   compostage, enfouissement, méthanisation,
   brûlage, etc.
   ========================================= */

const FACTEUR_DECHETS = {

    unite: "kg",

    facteur: 0,

    statut:
        "Non calculé — méthode de traitement à préciser",

    source:
        "Méthodologie à définir pour le prototype"


};


/* =========================================
   AGRICULTURE ET ELEVAGE
   =========================================
   
   Ces émissions nécessitent davantage
   d'informations que celles actuellement
   demandées dans le formulaire.
   
   Elles restent donc désactivées pour
   éviter une fausse précision.
   ========================================= */

const FACTEURS_AGRICULTURE = {

    animaux: {

        facteur: 0,

        unite: "animal",

        statut:
            "Non calculé — espèce et catégorie animale à préciser"

    },


    fumier: {

        facteur: 0,

        unite: "kg",

        statut:
            "Non calculé — mode de gestion du fumier à préciser"

    },


    engrais: {

        facteur: 0,

        unite: "kg",

        statut:
            "Non calculé — teneur en azote à préciser"

    }

};


/* =========================================
   RESEAUX DE CHALEUR / FROID
   ========================================= */

const FACTEURS_RESEAUX = {

    reseauChaleur: {

        unite: "kWh",

        facteur: 0,

        statut:
            "Facteur à documenter"

    },


    reseauFroid: {

        unite: "kWh",

        facteur: 0,

        statut:
            "Facteur à documenter"

    }

};


/* =========================================
   STRUCTURE GLOBALE
   ========================================= */

const FACTEURS_EMISSION = {


    /* Electricité */

    electricite:
        FACTEUR_ELECTRICITE,


    /* Combustibles */

    essence:
        FACTEURS_COMBUSTIBLES.essence,

    diesel:
        FACTEURS_COMBUSTIBLES.diesel,

    propane:
        FACTEURS_COMBUSTIBLES.propane,

    fioul:
        FACTEURS_COMBUSTIBLES.fioul,


    /* Biomasse */

    bois:
        FACTEUR_BOIS,

    charbon:
        FACTEUR_CHARBON,


    /* Fluides */

    r134a:
        FACTEURS_FRIGORIGENES.r134a,

    r404a:
        FACTEURS_FRIGORIGENES.r404a,

    r32:
        FACTEURS_FRIGORIGENES.r32,


    /* BTP */

    ciment:
        FACTEUR_CIMENT,


    /* Déchets */

    dechets:
        FACTEUR_DECHETS,


    /* Agriculture */

    animaux:
        FACTEURS_AGRICULTURE.animaux,

    fumier:
        FACTEURS_AGRICULTURE.fumier,

    engrais:
        FACTEURS_AGRICULTURE.engrais,


    /* Réseaux */

    reseauChaleur:
        FACTEURS_RESEAUX.reseauChaleur,

    reseauFroid:
        FACTEURS_RESEAUX.reseauFroid

};
