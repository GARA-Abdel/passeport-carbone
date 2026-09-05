/* =========================================
   PASSEPORT CARBONE
   Facteurs d'émission — Burkina Faso
   =========================================

   Sources principales :
   - MRV Burkina Faso
   - Lignes directrices 2006 du GIEC
   - Données nationales disponibles

   IMPORTANT :
   Les facteurs des combustibles sont conservés
   dans leur unité méthodologique d'origine (kg/TJ).

   Les conversions vers les unités utilisées
   dans les formulaires sont effectuées dans
   calcul.js lorsqu'une donnée de conversion
   suffisamment documentée est disponible.

   Lorsqu'un facteur national suffisamment
   documenté n'est pas disponible, la valeur
   reste volontairement à 0 afin d'éviter
   d'introduire une fausse précision.

   ========================================= */



/* =========================================
   POTENTIELS DE RÉCHAUFFEMENT GLOBAL
   ========================================= */

const GWP_BURKINA = {

    CO2: 1,

    CH4: 28,

    N2O: 265

};



/* =========================================
   FACTEURS NATIONAUX DES COMBUSTIBLES
   Unité : kg de gaz / TJ
   ========================================= */

const FACTEURS_COMBUSTIBLES = {


    /* =====================================
       ⛽ ESSENCE
       ===================================== */

    essence: {

        unite: "litre",

        facteurCO2: 69300,

        facteurCH4: 33,

        facteurN2O: 3.2,

        uniteFacteur: "kg/TJ",


        /*
         * Pouvoir calorifique inférieur
         * Essence automobile :
         * 44,3 TJ/Gg
         */

        NCV: 44.3,


        /*
         * Conversion volume → masse
         *
         * 1351 litres ≈ 1 tonne
         */

        conversionVolumeMasse: 1351,


        source:
            "MRV Burkina Faso + GIEC 2006"

    },



    /* =====================================
       ⛽ DIESEL / GASOIL
       ===================================== */

    diesel: {

        unite: "litre",

        facteurCO2: 74100,

        facteurCH4: 3.9,

        facteurN2O: 3.9,

        uniteFacteur: "kg/TJ",


        /*
         * Pouvoir calorifique inférieur
         * Gas/diesel oil :
         * 43,0 TJ/Gg
         */

        NCV: 43.0,


        /*
         * Conversion volume → masse
         *
         * 1149 litres ≈ 1 tonne
         */

        conversionVolumeMasse: 1149,


        source:
            "MRV Burkina Faso + GIEC 2006"

    },



    /* =====================================
       🔥 GAZ NATUREL
       ===================================== */

    gazNaturel: {

        /*
         * Le formulaire demande actuellement
         * une quantité en mètres cubes (m³).
         */

        unite: "m3",


        /*
         * Aucun facteur national suffisamment
         * documenté n'est actuellement retenu
         * dans notre modèle pour le gaz naturel.
         *
         * Les facteurs restent donc à 0.
         */

        facteurCO2: 0,

        facteurCH4: 0,

        facteurN2O: 0,

        uniteFacteur: "kg/TJ",


        /*
         * NCV non utilisé tant qu'un facteur
         * national approprié et une méthode
         * de conversion m³ → TJ clairement
         * documentée pour notre contexte
         * ne sont pas retenus.
         */

        NCV: 0,

        conversionVolumeMasse: 0,


        statut:
            "Non calculé — facteur national et conversion m³ → énergie à documenter",


        source:
            "MRV Burkina Faso — facteur spécifique à documenter"

    },



    /* =====================================
       🔥 FIOUL
       ===================================== */

    fioul: {

        unite: "litre",

        facteurCO2: 77400,

        facteurCH4: 3,

        facteurN2O: 0.6,

        uniteFacteur: "kg/TJ",


        /*
         * Pouvoir calorifique inférieur
         * Fioul résiduel :
         * 40,4 TJ/Gg
         */

        NCV: 40.4,


        /*
         * Conversion volume → masse
         *
         * 1053 litres ≈ 1 tonne
         */

        conversionVolumeMasse: 1053,


        source:
            "MRV Burkina Faso + GIEC 2006"

    },



    /* =====================================
       🔥 PROPANE / GPL
       ===================================== */

    propane: {

        unite: "kg",

        facteurCO2: 63100,

        facteurCH4: 5,

        facteurN2O: 0.1,

        uniteFacteur: "kg/TJ",


        /*
         * Pouvoir calorifique inférieur
         * GPL :
         * 47,3 TJ/Gg
         */

        NCV: 47.3,


        /*
         * Le propane est saisi directement
         * en kilogrammes dans notre formulaire.
         */

        conversionVolumeMasse: 0,


        source:
            "MRV Burkina Faso + GIEC 2006"

    }

};



/* =========================================
   FACTEUR ÉLECTRICITÉ
   =========================================

   Une valeur historique de référence de
   0,588 kgCO2/kWh a été documentée pour
   le réseau SONABEL en 2014.

   Elle NE DOIT PAS être présentée comme
   le facteur actuel 2026.

   Nous la conservons uniquement comme
   référence documentée en attendant de
   retenir un facteur adapté à la période
   de notre étude.
   ========================================= */

const FACTEUR_ELECTRICITE = {

    unite: "kWh",

    facteur: 0.588,

    uniteFacteur: "kgCO2/kWh",

    anneeReference: 2014,

    statut:
        "Référence historique — à ne pas présenter comme facteur 2026",

    source:
        "Référence réseau SONABEL / Burkina Faso"

};



/* =========================================
   FLUIDES FRIGORIGÈNES
   =========================================

   Les valeurs ci-dessous sont des GWP
   internationaux associés aux substances.

   Elles ne sont PAS présentées comme des
   facteurs d'émission nationaux du Burkina Faso.

   Elles servent uniquement au prototype
   lorsque le fluide effectivement utilisé
   est connu.
   ========================================= */

const FACTEURS_FRIGORIGENES = {


    /* R-134a */

    r134a: {

        unite: "kg",

        facteur: 1430,

        type:
            "GWP",

        source:
            "Valeur GWP internationale de référence"

    },


    /* R-404A */

    r404a: {

        unite: "kg",

        facteur: 3922,

        type:
            "GWP",

        source:
            "Valeur GWP internationale de référence"

    },


    /* R-32 */

    r32: {

        unite: "kg",

        facteur: 675,

        type:
            "GWP",

        source:
            "Valeur GWP internationale de référence"

    }

};



/* =========================================
   DÉCHETS
   =========================================

   Aucun facteur unique n'est retenu ici.

   La quantité de déchets seule ne suffit pas :
   le traitement (enfouissement, compostage,
   incinération, etc.) influence fortement
   les émissions.

   Le calcul sera ajouté lorsque la
   méthodologie sera définie.
   ========================================= */

const FACTEUR_DECHETS = {

    unite: "kg",

    facteur: 0,

    statut:
        "Non calculé — traitement des déchets à préciser",

    source:
        "MRV Burkina Faso"

};



/* =========================================
   RÉSEAUX DE CHALEUR / FROID
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


    /* Électricité */

    electricite:
        FACTEUR_ELECTRICITE,


    /* Combustibles */

    essence:
        FACTEURS_COMBUSTIBLES.essence,

    diesel:
        FACTEURS_COMBUSTIBLES.diesel,

    gazNaturel:
        FACTEURS_COMBUSTIBLES.gazNaturel,

    fioul:
        FACTEURS_COMBUSTIBLES.fioul,

    propane:
        FACTEURS_COMBUSTIBLES.propane,


    /* Fluides frigorigènes */

    r134a:
        FACTEURS_FRIGORIGENES.r134a,

    r404a:
        FACTEURS_FRIGORIGENES.r404a,

    r32:
        FACTEURS_FRIGORIGENES.r32,


    /* Déchets */

    dechets:
        FACTEUR_DECHETS,


    /* Réseaux */

    reseauChaleur:
        FACTEURS_RESEAUX.reseauChaleur,

    reseauFroid:
        FACTEURS_RESEAUX.reseauFroid

};