/* =========================================
   PASSEPORT CARBONE
   MOTEUR DE CALCUL MENSUEL
   ========================================= */


/* =========================================
   OUTIL — VALEUR NUMÉRIQUE
   ========================================= */

function nombre(valeur) {

    const resultat = Number(valeur);

    if (
        !Number.isFinite(resultat) ||
        resultat < 0
    ) {
        return 0;
    }

    return resultat;

}


/* =========================================
   CALCUL COMBUSTIBLE
   ========================================= */

function calculerCombustible(
    quantite,
    facteur
) {

    quantite = nombre(quantite);


    if (
        !facteur ||
        quantite === 0
    ) {
        return 0;
    }


    let energieTJ = 0;


    /*
     * Carburants saisis en litres
     */

    if (
        facteur.unite === "litre" ||
        facteur.unite === "litres"
    ) {

        if (
            !facteur.conversionVolumeMasse ||
            !facteur.NCV
        ) {
            return 0;
        }


        const masseTonnes =
            quantite /
            facteur.conversionVolumeMasse;


        energieTJ =
            masseTonnes *
            (facteur.NCV / 1000);

    }


    /*
     * Combustibles saisis en kg
     */

    else if (
        facteur.unite === "kg"
    ) {

        if (!facteur.NCV) {
            return 0;
        }


        const masseGg =
            quantite /
            1000000;


        energieTJ =
            masseGg *
            facteur.NCV;

    }


    /*
     * Conversion m³
     */

    else if (
        facteur.unite === "m3" ||
        facteur.unite === "m³"
    ) {

        if (
            !facteur.conversionM3VersTJ
        ) {
            return 0;
        }


        energieTJ =
            quantite *
            facteur.conversionM3VersTJ;

    }


    if (
        !Number.isFinite(energieTJ) ||
        energieTJ <= 0
    ) {
        return 0;
    }


    const CO2 =
        energieTJ *
        (facteur.facteurCO2 || 0);


    const CH4 =
        energieTJ *
        (facteur.facteurCH4 || 0);


    const N2O =
        energieTJ *
        (facteur.facteurN2O || 0);


    const CO2e =
        CO2 +
        (
            CH4 *
            GWP_BURKINA.CH4
        ) +
        (
            N2O *
            GWP_BURKINA.N2O
        );


    return CO2e;

}


/* =========================================
   CALCUL ÉLECTRICITÉ
   ========================================= */

function calculerElectricite(
    kWh
) {

    kWh =
        nombre(kWh);


    if (
        kWh === 0 ||
        !FACTEUR_ELECTRICITE
    ) {
        return 0;
    }


    return (
        kWh *
        FACTEUR_ELECTRICITE.facteur
    );

}


/* =========================================
   CALCUL FLUIDE FRIGORIGÈNE
   ========================================= */

function calculerFluide(
    quantite,
    type
) {

    quantite =
        nombre(quantite);


    if (
        quantite === 0 ||
        !type
    ) {
        return 0;
    }


    const fluide =
        FACTEURS_FRIGORIGENES[type];


    if (!fluide) {
        return 0;
    }


    return (
        quantite *
        fluide.facteur
    );

}


/* =========================================
   ÉVALUATION AGROALIMENTAIRE
   ========================================= */

function calculerAgroalimentaire(
    valeurs
) {

    const emissions = {};


    emissions.bois =
        calculerCombustible(
            valeurs.bois,
            {
                unite: "kg",
                NCV: 15,
                facteurCO2: 112000,
                facteurCH4: 30,
                facteurN2O: 4
            }
        );


    emissions.charbon =
        calculerCombustible(
            valeurs.charbon,
            {
                unite: "kg",
                NCV: 29,
                facteurCO2: 94600,
                facteurCH4: 10,
                facteurN2O: 1.5
            }
        );


    emissions.butane =
        calculerCombustible(
            valeurs.butane,
            FACTEURS_COMBUSTIBLES.propane
        );


    /*
     * Les déchets organiques ne sont pas
     * automatiquement convertis en CO₂e.
     *
     * Leur traitement doit être connu.
     */

    emissions.dechets = 0;


    return emissions;

}


/* =========================================
   ÉVALUATION BTP
   ========================================= */

function calculerBTP(
    valeurs
) {

    const emissions = {};


    emissions.diesel =
        calculerCombustible(
            valeurs.dieselBtp,
            FACTEURS_COMBUSTIBLES.diesel
        );


    emissions.bois =
        calculerCombustible(
            valeurs.boisBtp,
            {
                unite: "kg",
                NCV: 15,
                facteurCO2: 112000,
                facteurCH4: 30,
                facteurN2O: 4
            }
        );


    /*
     * Le ciment est déclaré mais n'est pas
     * encore calculé faute de facteur retenu
     * dans notre modèle.
     */

    emissions.ciment = 0;


    return emissions;

}


/* =========================================
   ÉVALUATION INDUSTRIE
   ========================================= */

function calculerIndustrie(
    valeurs
) {

    const emissions = {};


    emissions.electricite =
        calculerElectricite(
            valeurs.electricite
        );


    emissions.diesel =
        calculerCombustible(
            valeurs.dieselIndustrie,
            FACTEURS_COMBUSTIBLES.diesel
        );


    /*
     * Le fluide frigorigène nécessite de connaître
     * précisément le type de fluide.
     *
     * Le formulaire actuel ne le demande pas.
     */

    emissions.fluide = 0;


    return emissions;

}


/* =========================================
   ÉVALUATION COMMERCE
   ========================================= */

function calculerCommerce(
    valeurs
) {

    const emissions = {};


    emissions.essence =
        calculerCombustible(
            valeurs.essence,
            FACTEURS_COMBUSTIBLES.essence
        );


    emissions.diesel =
        calculerCombustible(
            valeurs.dieselCommerce,
            FACTEURS_COMBUSTIBLES.diesel
        );


    /*
     * Le type de fluide n'est pas demandé
     * dans le formulaire actuel.
     */

    emissions.fluide = 0;


    return emissions;

}


/* =========================================
   ÉVALUATION AGRICULTURE / ÉLEVAGE
   ========================================= */

function calculerAgriculture(
    valeurs
) {

    const emissions = {};


    /*
     * Le nombre d'animaux dépend fortement
     * de l'espèce.
     *
     * Sans distinction bovins / ovins / caprins
     * etc., nous ne faisons pas de calcul
     * automatique pour éviter une fausse précision.
     */

    emissions.animaux = 0;


    /*
     * Même principe pour le fumier.
     */

    emissions.fumier = 0;


    /*
     * Les engrais azotés nécessitent une
     * méthodologie précise concernant la quantité
     * d'azote réellement appliquée.
     */

    emissions.engrais = 0;


    return emissions;

}


/* =========================================
   CALCUL SELON LE SECTEUR
   ========================================= */

function calculerEmissionsSecteur(
    secteur,
    valeurs
) {

    switch (secteur) {


        case "agroalimentaire":

            return calculerAgroalimentaire(
                valeurs
            );


        case "btp":

            return calculerBTP(
                valeurs
            );


        case "industrie":

            return calculerIndustrie(
                valeurs
            );


        case "commerce":

            return calculerCommerce(
                valeurs
            );


        case "agriculture":

            return calculerAgriculture(
                valeurs
            );


        default:

            return {};

    }

}


/* =========================================
   CONSEILS PAR SECTEUR
   ========================================= */

const CONSEILS_SECTEURS = {


    agroalimentaire: [

        "Réduire progressivement la consommation de bois et de charbon lorsque des solutions énergétiques plus efficaces sont disponibles.",

        "Améliorer le rendement des foyers, fours et équipements de cuisson.",

        "Éviter l'accumulation prolongée des déchets organiques et privilégier une gestion adaptée.",

        "Suivre chaque mois les consommations de combustibles afin d'identifier les principales sources d'émissions."

    ],


    btp: [

        "Optimiser les déplacements des engins et des camions afin de réduire la consommation de diesel.",

        "Entretenir régulièrement les engins de chantier pour limiter les consommations inutiles.",

        "Évaluer progressivement l'utilisation de matériaux et procédés moins émetteurs.",

        "Suivre mensuellement la consommation de carburant des différents équipements."

    ],


    industrie: [

        "Surveiller régulièrement la consommation d'électricité des équipements.",

        "Réduire l'utilisation des groupes électrogènes lorsque des alternatives sont disponibles.",

        "Entretenir les équipements afin d'améliorer leur efficacité énergétique.",

        "Assurer un suivi des systèmes de climatisation et des fluides frigorigènes."

    ],


    commerce: [

        "Optimiser les itinéraires et les déplacements des véhicules.",

        "Limiter les trajets à vide et regrouper les livraisons lorsque cela est possible.",

        "Entretenir régulièrement les véhicules afin de réduire leur consommation.",

        "Contrôler régulièrement les équipements frigorifiques et leurs fluides."

    ],


    agriculture: [

        "Améliorer la gestion du fumier et des effluents d'élevage.",

        "Optimiser l'utilisation des engrais azotés.",

        "Suivre séparément les différents types d'animaux élevés afin d'améliorer progressivement la précision du bilan.",

        "Mettre en place un suivi mensuel des consommations et des pratiques agricoles."

    ]

};


/* =========================================
   NIVEAUX D'ÉMISSION
   ========================================= */

function determinerNiveauEmission(
    totalKg
) {

    totalKg =
        nombre(totalKg);


    /*
     * Seuils provisoires du prototype.
     *
     * Ils servent à orienter les conseils
     * et ne constituent pas une norme nationale.
     */

    if (totalKg < 100) {

        return {

            niveau: "faible",

            titre:
                "Émissions relativement faibles",

            message:
                "Le niveau d'émission calculé est relativement faible pour le périmètre déclaré. Continuez à suivre vos consommations chaque mois."

        };

    }


    if (totalKg < 1000) {

        return {

            niveau: "modere",

            titre:
                "Émissions à surveiller",

            message:
                "Les émissions calculées nécessitent un suivi régulier. Identifiez les principales sources et recherchez progressivement des possibilités de réduction."

        };

    }


    if (totalKg < 5000) {

        return {

            niveau: "eleve",

            titre:
                "Émissions élevées",

            message:
                "Le niveau d'émission calculé est important. Il est recommandé d'identifier les principales sources et de mettre en place des actions de réduction prioritaires."

        };

    }


    return {

        niveau: "tres-eleve",

        titre:
            "Émissions très élevées",

        message:
            "Le niveau d'émission calculé est très important. Une analyse approfondie des principales sources et un plan d'action prioritaire sont recommandés."

    };

}


/* =========================================
   GÉNÉRATION DES CONSEILS
   ========================================= */

function genererConseils(
    secteur,
    niveau
) {

    const conseils =
        CONSEILS_SECTEURS[secteur]
        ? [
            ...CONSEILS_SECTEURS[secteur]
        ]
        : [];


    /*
     * Conseil supplémentaire lorsque
     * le niveau est élevé.
     */

    if (
        niveau === "eleve" ||
        niveau === "tres-eleve"
    ) {

        conseils.unshift(
            "Priorité : identifier la source qui représente la plus grande part des émissions et agir en premier sur celle-ci."
        );

    }


    return conseils;

}


/* =========================================
   FONCTION PRINCIPALE
   ========================================= */

function calculerBilanMensuel(
    donnees
) {

    if (!donnees) {
        return null;
    }


    const valeurs =
        donnees.valeurs || {};


    const secteur =
        donnees.secteur;


    /*
     * Calcul spécifique au secteur.
     */

    const emissions =
        calculerEmissionsSecteur(
            secteur,
            valeurs
        );


    /*
     * Total.
     */

    let totalKgCO2e = 0;


    Object.keys(
        emissions
    ).forEach(
        function(cle) {

            const valeur =
                nombre(
                    emissions[cle]
                );


            totalKgCO2e +=
                valeur;

        }
    );


    /*
     * Conversion kg → tonne.
     */

    const totalTCO2e =
        totalKgCO2e /
        1000;


    /*
     * Calculabilité.
     */

    const calculabilite = {};


    Object.keys(
        valeurs
    ).forEach(
        function(cle) {

            const quantite =
                nombre(
                    valeurs[cle]
                );


            if (quantite > 0) {

                calculabilite[cle] =
                    emissions[cle] > 0;

            }

        }
    );


    /*
     * Ajout des catégories connues
     * mais non calculées.
     */

    if (
        secteur === "agroalimentaire"
    ) {

        calculabilite.dechets =
            false;

    }


    if (
        secteur === "btp"
    ) {

        calculabilite.ciment =
            false;

    }


    if (
        secteur === "industrie"
    ) {

        calculabilite.fluide =
            false;

    }


    if (
        secteur === "commerce"
    ) {

        calculabilite.fluide =
            false;

    }


    if (
        secteur === "agriculture"
    ) {

        calculabilite.animaux =
            false;

        calculabilite.fumier =
            false;

        calculabilite.engrais =
            false;

    }


    return {

        nom:
            donnees.nom,

        mois:
            donnees.mois,

        secteur:
            secteur,

        emissions:
            emissions,

        calculabilite:
            calculabilite,

        totalKgCO2e:
            totalKgCO2e,

        totalTCO2e:
            totalTCO2e

    };

}


/* =========================================
   EXPOSITION DU MOTEUR
   ========================================= */

window.PasseportCarboneCalcul = {

    calculerBilanMensuel:
        calculerBilanMensuel,

    determinerNiveauEmission:
        determinerNiveauEmission,

    genererConseils:
        genererConseils

};
