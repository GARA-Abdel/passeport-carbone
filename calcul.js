/* =========================================
   PASSEPORT CARBONE
   Calcul du bilan carbone
   ========================================= */


/* =========================================
   OUTIL — RÉSULTAT VIDE / NON CALCULABLE
   ========================================= */

function creerResultatEmissionVide(
    methode = "Calcul non disponible."
) {

    return {

        CO2: 0,
        CH4: 0,
        N2O: 0,
        CO2e: 0,

        calculable: false,
        emissionNulle: false,

        methode: methode

    };

}


/* =========================================
   OUTIL — ÉMISSION RÉELLEMENT NULLE
   ========================================= */

function creerResultatEmissionNulle(
    methode = "Aucune émission calculée."
) {

    return {

        CO2: 0,
        CH4: 0,
        N2O: 0,
        CO2e: 0,

        calculable: true,
        emissionNulle: true,

        methode: methode

    };

}


/* =========================================
   CONVERSION D'UN CARBURANT
   ========================================= */

function convertirLitresVersTJ(
    litres,
    conversionVolumeMasse,
    NCV
) {

    if (
        !Number.isFinite(litres) ||
        litres < 0 ||
        !Number.isFinite(conversionVolumeMasse) ||
        conversionVolumeMasse <= 0 ||
        !Number.isFinite(NCV) ||
        NCV <= 0
    ) {

        return 0;
    }


    const masseTonnes =
        litres / conversionVolumeMasse;


    const energieTJ =
        masseTonnes * (NCV / 1000);


    return energieTJ;

}


/* =========================================
   CONVERSION D'UNE QUANTITÉ EN KG
   ========================================= */

function convertirKgVersTJ(
    kilogrammes,
    NCV
) {

    if (
        !Number.isFinite(kilogrammes) ||
        kilogrammes < 0 ||
        !Number.isFinite(NCV) ||
        NCV <= 0
    ) {

        return 0;
    }


    const masseGg =
        kilogrammes / 1000000;


    const energieTJ =
        masseGg * NCV;


    return energieTJ;

}


/* =========================================
   CALCUL DES ÉMISSIONS D'UN COMBUSTIBLE
   ========================================= */

function calculerEmissionsCombustible(
    quantite,
    unite,
    facteur
) {

    if (!facteur) {

        return creerResultatEmissionVide(
            "Aucun facteur d'émission disponible."
        );

    }


    if (!Number.isFinite(quantite)) {

        return creerResultatEmissionVide(
            "Quantité invalide."
        );

    }


    if (quantite < 0) {

        return creerResultatEmissionVide(
            "La quantité ne peut pas être négative."
        );

    }


    if (quantite === 0) {

        return creerResultatEmissionNulle(
            "Aucune consommation enregistrée pour cette activité."
        );

    }


    let energieTJ = 0;


    /* ================================
       LITRES
       ================================ */

    if (
        unite === "litres" ||
        unite === "litre"
    ) {

        energieTJ =
            convertirLitresVersTJ(
                quantite,
                facteur.conversionVolumeMasse,
                facteur.NCV
            );

    }


    /* ================================
       KG
       ================================ */

    else if (unite === "kg") {

        energieTJ =
            convertirKgVersTJ(
                quantite,
                facteur.NCV
            );

    }


    /* ================================
       MÈTRES CUBES
       ================================ */

    else if (
        unite === "m3" ||
        unite === "m³"
    ) {

        if (
            Number.isFinite(
                facteur.conversionM3VersTJ
            ) &&
            facteur.conversionM3VersTJ > 0
        ) {

            energieTJ =
                quantite *
                facteur.conversionM3VersTJ;

        }

        else {

            return creerResultatEmissionVide(
                "Conversion m³ → TJ non documentée pour ce combustible."
            );

        }

    }


    /* ================================
       UNITÉ NON PRISE EN CHARGE
       ================================ */

    else {

        return creerResultatEmissionVide(
            "Unité de quantité non prise en charge."
        );

    }


    /* ================================
       VÉRIFICATION
       ================================ */

    if (
        !Number.isFinite(energieTJ) ||
        energieTJ <= 0
    ) {

        return creerResultatEmissionVide(
            "Conversion de la quantité en énergie impossible avec les données disponibles."
        );

    }


    /* ================================
       GAZ À EFFET DE SERRE
       ================================ */

    const CO2 =
        energieTJ *
        facteur.facteurCO2;


    const CH4 =
        energieTJ *
        facteur.facteurCH4;


    const N2O =
        energieTJ *
        facteur.facteurN2O;


    /* ================================
       CO₂ ÉQUIVALENT
       ================================ */

    const CO2e =
        CO2 +
        (CH4 * GWP_BURKINA.CH4) +
        (N2O * GWP_BURKINA.N2O);


    return {

        CO2: CO2,
        CH4: CH4,
        N2O: N2O,
        CO2e: CO2e,

        calculable: true,
        emissionNulle: CO2e === 0,

        energieTJ: energieTJ,

        methode:
            "Conversion de l'activité en énergie puis application des facteurs d'émission."

    };

}


/* =========================================
   CALCUL D'UN CARBURANT
   ========================================= */

function calculerEmissionsCarburant(
    quantite,
    facteur
) {

    return calculerEmissionsCombustible(
        quantite,
        "litres",
        facteur
    );

}


/* =========================================
   CALCUL DE L'ÉLECTRICITÉ
   ========================================= */

function calculerEmissionElectricite(
    consommation,
    source = "reseau"
) {

    if (!Number.isFinite(consommation)) {

        return creerResultatEmissionVide(
            "Consommation électrique invalide."
        );

    }


    if (consommation < 0) {

        return creerResultatEmissionVide(
            "La consommation électrique ne peut pas être négative."
        );

    }


    if (consommation === 0) {

        return creerResultatEmissionNulle(
            "Aucune consommation électrique enregistrée."
        );

    }


    /* ================================
       SOLAIRE
       ================================ */

    if (source === "solaire") {

        return creerResultatEmissionNulle(
            "Aucune émission directe attribuée à l'électricité solaire consommée."
        );

    }


    /* ================================
       RÉSEAU
       ================================ */

    if (source === "reseau") {

        const emission =
            consommation *
            FACTEUR_ELECTRICITE.facteur;


        return {

            emission: emission,

            CO2: emission,
            CH4: 0,
            N2O: 0,
            CO2e: emission,

            calculable: true,
            emissionNulle: false,

            source: source,

            facteur:
                FACTEUR_ELECTRICITE.facteur,

            anneeReference:
                FACTEUR_ELECTRICITE.anneeReference,

            methode:
                "Application du facteur électrique de référence enregistré dans facteurs.js."

        };

    }


    /* ================================
       MIXTE
       ================================ */

    if (source === "mixte") {

        const emission =
            consommation *
            FACTEUR_ELECTRICITE.facteur;


        return {

            emission: emission,

            CO2: emission,
            CH4: 0,
            N2O: 0,
            CO2e: emission,

            calculable: true,
            emissionNulle: false,

            source: source,

            facteur:
                FACTEUR_ELECTRICITE.facteur,

            anneeReference:
                FACTEUR_ELECTRICITE.anneeReference,

            methode:
                "Proportion réseau/solaire non renseignée : facteur réseau utilisé provisoirement."

        };

    }


    /* ================================
       AUTRE
       ================================ */

    if (source === "autre") {

        const emission =
            consommation *
            FACTEUR_ELECTRICITE.facteur;


        return {

            emission: emission,

            CO2: emission,
            CH4: 0,
            N2O: 0,
            CO2e: emission,

            calculable: true,
            emissionNulle: false,

            source: source,

            facteur:
                FACTEUR_ELECTRICITE.facteur,

            anneeReference:
                FACTEUR_ELECTRICITE.anneeReference,

            methode:
                "Source non documentée : facteur électrique de référence utilisé provisoirement."

        };

    }


    return creerResultatEmissionVide(
        "Source d'électricité inconnue."
    );

}


/* =========================================
   CALCUL DES FLUIDES FRIGORIGÈNES
   ========================================= */

function calculerEmissionFluide(
    typeFluide,
    quantite
) {

    if (!Number.isFinite(quantite)) {

        return creerResultatEmissionVide(
            "Quantité de fluide invalide."
        );

    }


    if (quantite < 0) {

        return creerResultatEmissionVide(
            "La quantité de fluide ne peut pas être négative."
        );

    }


    if (quantite === 0) {

        return creerResultatEmissionNulle(
            "Aucune recharge de fluide frigorigène enregistrée."
        );

    }


    if (
        !typeFluide ||
        typeFluide === "autre"
    ) {

        return creerResultatEmissionVide(
            "Type de fluide non suffisamment identifié pour le calcul."
        );

    }


    const fluide =
        FACTEURS_FRIGORIGENES[typeFluide];


    if (!fluide) {

        return creerResultatEmissionVide(
            "Aucun facteur GWP disponible pour ce fluide."
        );

    }


    const emission =
        quantite *
        fluide.facteur;


    return {

        emission: emission,

        CO2: emission,
        CH4: 0,
        N2O: 0,
        CO2e: emission,

        calculable: true,
        emissionNulle: emission === 0,

        typeFluide: typeFluide,
        quantite: quantite,

        facteur:
            fluide.facteur,

        methode:
            "Quantité rechargée multipliée par le GWP du fluide frigorigène."

    };

}


/* =========================================
   ÉVALUATION SIMPLIFIÉE
   ========================================= */

function calculerEvaluationSimple(
    entreprise
) {

    if (!entreprise) {

        return null;

    }


    /* ================================
       ÉLECTRICITÉ
       ================================ */

    const resultatElectricite =
        calculerEmissionElectricite(
            Number(entreprise.electricite),
            "reseau"
        );


    const emissionElectricite =
        resultatElectricite.emission || 0;


    /* ================================
       ESSENCE
       ================================ */

    const resultatEssence =
        calculerEmissionsCarburant(
            Number(entreprise.essence),
            FACTEURS_COMBUSTIBLES.essence
        );


    /* ================================
       DIESEL
       ================================ */

    const resultatDiesel =
        calculerEmissionsCarburant(
            Number(entreprise.diesel),
            FACTEURS_COMBUSTIBLES.diesel
        );


    /* ================================
       TOTAL
       ================================ */

    const total =
        emissionElectricite +
        resultatEssence.CO2e +
        resultatDiesel.CO2e;


    return {

        entreprise:
            entreprise.nom,

        periode:
            entreprise.periode,


        activites: {

            electricite:
                Number(entreprise.electricite),

            essence:
                Number(entreprise.essence),

            diesel:
                Number(entreprise.diesel)

        },


        emissions: {

            electricite:
                emissionElectricite,

            essence:
                resultatEssence.CO2e,

            diesel:
                resultatDiesel.CO2e

        },


        calculabilite: {

            electricite:
                resultatElectricite.calculable,

            essence:
                resultatEssence.calculable,

            diesel:
                resultatDiesel.calculable

        },


        detailsElectricite:
            resultatElectricite,


        detailsCombustibles: {

            essence:
                resultatEssence,

            diesel:
                resultatDiesel

        },


        total:
            total

    };

}


/* =========================================
   ÉVALUATION DÉTAILLÉE
   ========================================= */

function calculerEvaluationDetaillee(
    detail
) {

    if (!detail) {

        return null;

    }


    /* ================================
       ÉLECTRICITÉ
       ================================ */

    const resultatElectricite =
        calculerEmissionElectricite(
            Number(detail.electricite),
            detail.sourceElectricite
        );


    const emissionElectricite =
        resultatElectricite.emission || 0;


    /* ================================
       ESSENCE
       ================================ */

    /*
     * detail.html enregistre directement
     * la consommation d'essence.
     */

    const quantiteEssence =
        Number(detail.essence || 0);


    const resultatEssence =
        calculerEmissionsCarburant(
            quantiteEssence,
            FACTEURS_COMBUSTIBLES.essence
        );


    /* ================================
       DIESEL
       ================================ */

    const quantiteDiesel =
        Number(detail.diesel || 0);


    const resultatDiesel =
        calculerEmissionsCarburant(
            quantiteDiesel,
            FACTEURS_COMBUSTIBLES.diesel
        );


    /* =================================
       COMBUSTIBLE FIXE
       ================================= */

    let resultatCombustible;


    const typeCombustible =
        detail.typeCombustible;


    const quantiteCombustible =
        Number(
            detail.quantiteCombustible || 0
        );


    const uniteCombustible =
        detail.uniteCombustible;


    if (
        !typeCombustible ||
        typeCombustible === "aucun"
    ) {

        resultatCombustible =
            creerResultatEmissionNulle(
                "Aucun combustible fixe déclaré."
            );

    }

    else {

        const correspondance = {

            "gaz-naturel":
                "gazNaturel",

            "fioul":
                "fioul",

            "propane":
                "propane"

        };


        const cleFacteur =
            correspondance[typeCombustible];


        const facteur =
            FACTEURS_COMBUSTIBLES[
                cleFacteur
            ];


        if (facteur) {

            resultatCombustible =
                calculerEmissionsCombustible(
                    quantiteCombustible,
                    uniteCombustible,
                    facteur
                );

        }

        else {

            resultatCombustible =
                creerResultatEmissionVide(
                    "Aucun facteur d'émission disponible pour ce combustible."
                );

        }

    }


    const emissionCombustible =
        resultatCombustible.CO2e || 0;


    /* =================================
       FLUIDE FRIGORIGÈNE
       ================================= */

    let resultatRefrigerants;


    const typeFluide =
        detail.typeFluide;


    const recharge =
        detail.rechargeFluide;


    const quantiteFluide =
        Number(
            detail.fluideFrigorifique || 0
        );


    if (recharge === "non") {

        resultatRefrigerants =
            creerResultatEmissionNulle(
                "Aucune recharge de fluide frigorigène déclarée."
            );

    }

    else if (recharge === "inconnu") {

        resultatRefrigerants =
            creerResultatEmissionVide(
                "La présence éventuelle d'une recharge de fluide n'est pas connue."
            );

    }

    else if (recharge === "oui") {

        resultatRefrigerants =
            calculerEmissionFluide(
                typeFluide,
                quantiteFluide
            );

    }

    else {

        /*
         * Si aucune information de recharge
         * n'est disponible, on ne prétend pas
         * qu'il y a zéro émission.
         */

        resultatRefrigerants =
            creerResultatEmissionVide(
                "Information sur la recharge de fluide frigorigène indisponible."
            );

    }


    const emissionRefrigerants =
        resultatRefrigerants.CO2e || 0;


    /* =================================
       DÉCHETS
       ================================= */

    const quantiteDechets =
        Number(detail.dechets || 0);


    let resultatDechets;


    if (quantiteDechets === 0) {

        resultatDechets =
            creerResultatEmissionNulle(
                "Aucun déchet renseigné."
            );

    }

    else {

        resultatDechets =
            creerResultatEmissionVide(
                "Quantité renseignée, mais traitement des déchets non documenté pour le calcul."
            );

    }


    /* =================================
       RÉSEAU CHALEUR / FROID
       ================================= */

    const utiliseReseau =
        detail.reseauEnergie;


    let resultatReseau;


    if (utiliseReseau === "non") {

        resultatReseau =
            creerResultatEmissionNulle(
                "Aucun achat de chaleur ou de froid déclaré."
            );

    }

    else if (utiliseReseau === "oui") {

        resultatReseau =
            creerResultatEmissionVide(
                "Facteur d'émission du réseau de chaleur/froid non documenté."
            );

    }

    else {

        resultatReseau =
            creerResultatEmissionVide(
                "Information sur l'utilisation d'un réseau de chaleur/froid indisponible."
            );

    }


    /* =================================
       TOTAL
       ================================= */

    /*
     * Les catégories non calculables
     * ne sont pas ajoutées au total.
     */

    const total =
        emissionElectricite +
        resultatEssence.CO2e +
        resultatDiesel.CO2e +
        emissionCombustible +
        emissionRefrigerants;


    /* =================================
       CATÉGORIES NON CALCULABLES
       ================================= */

    const categoriesNonCalculables = [];


    if (
        resultatElectricite.calculable === false
    ) {

        categoriesNonCalculables.push(
            "Électricité"
        );

    }


    if (
        resultatEssence.calculable === false &&
        quantiteEssence > 0
    ) {

        categoriesNonCalculables.push(
            "Essence"
        );

    }


    if (
        resultatDiesel.calculable === false &&
        quantiteDiesel > 0
    ) {

        categoriesNonCalculables.push(
            "Diesel"
        );

    }


    if (
        resultatCombustible.calculable === false &&
        quantiteCombustible > 0
    ) {

        categoriesNonCalculables.push(
            "Combustibles fixes"
        );

    }


    if (
        resultatRefrigerants.calculable === false &&
        (
            recharge === "oui" ||
            recharge === "inconnu"
        )
    ) {

        categoriesNonCalculables.push(
            "Fluides frigorigènes"
        );

    }


    if (
        resultatDechets.calculable === false &&
        quantiteDechets > 0
    ) {

        categoriesNonCalculables.push(
            "Déchets"
        );

    }


    if (
        resultatReseau.calculable === false &&
        utiliseReseau === "oui"
    ) {

        categoriesNonCalculables.push(
            "Chaleur / froid acheté"
        );

    }


    /* =================================
       RÉSULTAT DÉTAILLÉ
       ================================= */

    return {

        activites: {

            electricite:
                Number(detail.electricite),

            essence:
                quantiteEssence,

            diesel:
                quantiteDiesel,

            combustible:
                quantiteCombustible,

            dechets:
                quantiteDechets

        },


        emissions: {

            electricite:
                emissionElectricite,

            essence:
                resultatEssence.CO2e,

            diesel:
                resultatDiesel.CO2e,

            combustibles:
                emissionCombustible,

            refrigerants:
                emissionRefrigerants,

            dechets:
                0,

            reseau:
                0

        },


        calculabilite: {

            electricite:
                resultatElectricite.calculable,

            essence:
                resultatEssence.calculable,

            diesel:
                resultatDiesel.calculable,

            combustibles:
                resultatCombustible.calculable,

            refrigerants:
                resultatRefrigerants.calculable,

            dechets:
                resultatDechets.calculable,

            reseau:
                resultatReseau.calculable

        },


        details: {

            electricite:
                resultatElectricite,

            essence:
                resultatEssence,

            diesel:
                resultatDiesel,

            combustible:
                resultatCombustible,

            refrigerants:
                resultatRefrigerants,

            dechets:
                resultatDechets,

            reseau:
                resultatReseau

        },


        categoriesNonCalculables:
            categoriesNonCalculables,


        total:
            total

    };

}


/* =========================================
   COMPARAISON DES DEUX ÉVALUATIONS
   ========================================= */

function comparerEvaluations(
    evaluationSimple,
    evaluationDetaillee
) {

    if (
        !evaluationSimple ||
        !evaluationDetaillee
    ) {

        return null;

    }


    const simple =
        Number(
            evaluationSimple.total
        ) || 0;


    const detaillee =
        Number(
            evaluationDetaillee.total
        ) || 0;


    const difference =
        detaillee - simple;


    const ecartAbsolu =
        Math.abs(difference);


    let pourcentageEcart = 0;


    if (simple !== 0) {

        pourcentageEcart =
            (
                ecartAbsolu /
                Math.abs(simple)
            ) * 100;

    }


    return {

        estimationSimple:
            simple,

        estimationDetaillee:
            detaillee,

        difference:
            difference,

        ecartAbsolu:
            ecartAbsolu,

        pourcentageEcart:
            pourcentageEcart,

        reference:
            "Évaluation simplifiée"

    };

}


/* =========================================
   FONCTION PRINCIPALE
   ========================================= */

function calculerBilanCarbone() {


    /* ================================
       RÉCUPÉRATION DES DONNÉES
       ================================ */

    const entreprise =
        JSON.parse(
            localStorage.getItem(
                "passeportCarboneEntreprise"
            )
        );


    const detail =
        JSON.parse(
            localStorage.getItem(
                "passeportCarboneDetail"
            )
        );


    /* ================================
       VÉRIFICATION
       ================================ */

    if (
        !entreprise ||
        !detail
    ) {

        console.error(
            "Données de l'évaluation introuvables."
        );

        return null;

    }


    /* ================================
       CALCULS
       ================================ */

    const evaluationSimple =
        calculerEvaluationSimple(
            entreprise
        );


    /*
     * On combine les données générales
     * et les données détaillées.
     *
     * Les champs spécifiques au formulaire
     * détaillé restent ceux de "detail".
     */

    const evaluationDetaillee =
        calculerEvaluationDetaillee(
            {
                ...entreprise,
                ...detail
            }
        );


    const comparaison =
        comparerEvaluations(
            evaluationSimple,
            evaluationDetaillee
        );


    /* ================================
       BILAN FINAL
       ================================ */

    return {

        entreprise:
            entreprise.nom,

        periode:
            entreprise.periode,

        simple:
            evaluationSimple,

        detaillee:
            evaluationDetaillee,

        comparaison:
            comparaison

    };

}


/* =========================================
   EXPOSITION DES FONCTIONS
   ========================================= */

window.PasseportCarboneCalcul = {

    calculerBilanCarbone:
        calculerBilanCarbone,

    calculerEvaluationSimple:
        calculerEvaluationSimple,

    calculerEvaluationDetaillee:
        calculerEvaluationDetaillee,

    comparerEvaluations:
        comparerEvaluations

};