/* =========================================
   PASSEPORT CARBONE
   CALCUL DU BILAN CARBONE MENSUEL
   ========================================= */


/* =========================================
   OUTIL — RÉSULTAT NON CALCULABLE
   ========================================= */

function resultatNonCalculable(message) {

    return {
        emission: 0,
        calculable: false,
        message: message
    };

}


/* =========================================
   OUTIL — CONVERSION CARBURANT
   ========================================= */

function calculerCombustible(
    quantite,
    facteur
) {

    if (!facteur || !quantite || quantite <= 0) {

        return {
            emission: 0,
            calculable: true
        };

    }


    /*
     * Conversion litres → TJ
     */

    if (
        facteur.unite === "litre" &&
        facteur.conversionVolumeMasse > 0 &&
        facteur.NCV > 0
    ) {

        const masseTonnes =
            quantite /
            facteur.conversionVolumeMasse;


        const energieTJ =
            masseTonnes *
            (facteur.NCV / 1000);


        const CO2 =
            energieTJ *
            facteur.facteurCO2;


        const CH4 =
            energieTJ *
            facteur.facteurCH4;


        const N2O =
            energieTJ *
            facteur.facteurN2O;


        const CO2e =
            CO2 +
            (CH4 * GWP_BURKINA.CH4) +
            (N2O * GWP_BURKINA.N2O);


        return {

            emission: CO2e,

            CO2: CO2,
            CH4: CH4,
            N2O: N2O,

            energieTJ: energieTJ,

            calculable: true

        };

    }


    /*
     * Conversion kg → TJ
     */

    if (
        facteur.unite === "kg" &&
        facteur.NCV > 0
    ) {

        const masseGg =
            quantite / 1000000;


        const energieTJ =
            masseGg *
            facteur.NCV;


        const CO2 =
            energieTJ *
            facteur.facteurCO2;


        const CH4 =
            energieTJ *
            facteur.facteurCH4;


        const N2O =
            energieTJ *
            facteur.facteurN2O;


        const CO2e =
            CO2 +
            (CH4 * GWP_BURKINA.CH4) +
            (N2O * GWP_BURKINA.N2O);


        return {

            emission: CO2e,

            CO2: CO2,
            CH4: CH4,
            N2O: N2O,

            energieTJ: energieTJ,

            calculable: true

        };

    }


    return resultatNonCalculable(
        "Conversion impossible avec les données disponibles."
    );

}


/* =========================================
   ÉLECTRICITÉ
   ========================================= */

function calculerElectricite(kWh) {

    if (!kWh || kWh <= 0) {

        return {
            emission: 0,
            calculable: true
        };

    }


    if (
        !FACTEUR_ELECTRICITE ||
        !FACTEUR_ELECTRICITE.facteur
    ) {

        return resultatNonCalculable(
            "Facteur d'émission électrique indisponible."
        );

    }


    const emission =
        kWh *
        FACTEUR_ELECTRICITE.facteur;


    return {

        emission: emission,

        CO2: emission,

        calculable: true,

        facteur:
            FACTEUR_ELECTRICITE.facteur

    };

}


/* =========================================
   FLUIDE FRIGORIGÈNE
   ========================================= */

function calculerFluide(
    quantite,
    type = "r134a"
) {

    if (!quantite || quantite <= 0) {

        return {
            emission: 0,
            calculable: true
        };

    }


    const fluide =
        FACTEURS_FRIGORIGENES[type];


    if (!fluide) {

        return resultatNonCalculable(
            "Facteur du fluide frigorigène indisponible."
        );

    }


    const emission =
        quantite *
        fluide.facteur;


    return {

        emission: emission,

        CO2e: emission,

        calculable: true,

        facteur:
            fluide.facteur

    };

}


/* =========================================
   AGRICULTURE — ÉLEVAGE
   =========================================

   Pour cette première version,
   les facteurs spécifiques au type
   d'animal doivent être documentés
   avant d'être utilisés.

   On ne crée donc pas de fausse précision.
   ========================================= */

function calculerElevage(animaux) {

    if (!animaux || animaux <= 0) {

        return {
            emission: 0,
            calculable: true
        };

    }


    return resultatNonCalculable(
        "Facteur d'émission spécifique au type d'élevage à documenter."
    );

}


/* =========================================
   AGRICULTURE — FUMIER
   ========================================= */

function calculerFumier(quantite) {

    if (!quantite || quantite <= 0) {

        return {
            emission: 0,
            calculable: true
        };

    }


    return resultatNonCalculable(
        "Facteur d'émission du traitement du fumier à documenter."
    );

}


/* =========================================
   AGRICULTURE — ENGRAIS AZOTÉS
   ========================================= */

function calculerEngrais(quantite) {

    if (!quantite || quantite <= 0) {

        return {
            emission: 0,
            calculable: true
        };

    }


    return resultatNonCalculable(
        "Facteur d'émission des engrais azotés à documenter."
    );

}


/* =========================================
   DÉCHETS ORGANIQUES
   ========================================= */

function calculerDechets(quantite) {

    if (!quantite || quantite <= 0) {

        return {
            emission: 0,
            calculable: true
        };

    }


    return resultatNonCalculable(
        "Le mode de traitement des déchets doit être précisé."
    );

}


/* =========================================
   CALCUL AGROALIMENTAIRE
   ========================================= */

function calculerAgroalimentaire(valeurs) {

    const bois =
        calculerCombustible(
            valeurs.bois,
            FACTEURS_COMBUSTIBLES.fioul
        );


    /*
     * Le charbon et le bois nécessitent
     * des facteurs spécifiques adaptés
     * à la biomasse.
     *
     * Ils restent donc non calculés
     * jusqu'à validation des facteurs.
     */

    let charbon =
        resultatNonCalculable(
            "Facteur du charbon de bois à documenter."
        );


    if (!valeurs.charbon) {

        charbon = {
            emission: 0,
            calculable: true
        };

    }


    /*
     * Pour le bois, le facteur fioul ne doit
     * finalement PAS être utilisé.
     *
     * On annule donc ce calcul provisoire.
     */

    if (valeurs.bois > 0) {

        charbon = charbon;

    }


    const butane =
        calculerCombustible(
            valeurs.butane,
            FACTEURS_COMBUSTIBLES.propane
        );


    const dechets =
        calculerDechets(
            valeurs.dechets
        );


    return {

        emissions: {

            bois: 0,

            charbon:
                charbon.emission,

            butane:
                butane.emission,

            dechets:
                dechets.emission

        },

        calculabilite: {

            bois: false,

            charbon:
                charbon.calculable,

            butane:
                butane.calculable,

            dechets:
                dechets.calculable

        },

        total:
            charbon.emission +
            butane.emission +
            dechets.emission

    };

}


/* =========================================
   CALCUL BTP
   ========================================= */

function calculerBTP(valeurs) {

    const diesel =
        calculerCombustible(
            valeurs.dieselBtp,
            FACTEURS_COMBUSTIBLES.diesel
        );


    const bois =
        resultatNonCalculable(
            "Facteur de la biomasse utilisée dans les briques à documenter."
        );


    const ciment =
        resultatNonCalculable(
            "Facteur d'émission du ciment à documenter."
        );


    if (!valeurs.boisBtp) {

        bois.calculable = true;

    }


    if (!valeurs.cimentBtp) {

        ciment.calculable = true;

    }


    return {

        emissions: {

            diesel:
                diesel.emission,

            bois:
                bois.emission,

            ciment:
                ciment.emission

        },

        calculabilite: {

            diesel:
                diesel.calculable,

            bois:
                bois.calculable,

            ciment:
                ciment.calculable

        },

        total:
            diesel.emission

    };

}


/* =========================================
   CALCUL INDUSTRIE
   ========================================= */

function calculerIndustrie(valeurs) {

    const electricite =
        calculerElectricite(
            valeurs.electricite
        );


    const diesel =
        calculerCombustible(
            valeurs.dieselIndustrie,
            FACTEURS_COMBUSTIBLES.diesel
        );


    /*
     * Le type de fluide n'est pas encore
     * demandé dans le formulaire.
     *
     * On utilise donc R-134a uniquement
     * comme valeur technique provisoire.
     */

    const fluide =
        calculerFluide(
            valeurs.fluideIndustrie,
            "r134a"
        );


    return {

        emissions: {

            electricite:
                electricite.emission,

            diesel:
                diesel.emission,

            fluide:
                fluide.emission

        },

        calculabilite: {

            electricite:
                electricite.calculable,

            diesel:
                diesel.calculable,

            fluide:
                fluide.calculable

        },

        total:
            electricite.emission +
            diesel.emission +
            fluide.emission

    };

}


/* =========================================
   CALCUL COMMERCE
   ========================================= */

function calculerCommerce(valeurs) {

    const essence =
        calculerCombustible(
            valeurs.essence,
            FACTEURS_COMBUSTIBLES.essence
        );


    const diesel =
        calculerCombustible(
            valeurs.dieselCommerce,
            FACTEURS_COMBUSTIBLES.diesel
        );


    const fluide =
        calculerFluide(
            valeurs.fluideCommerce,
            "r134a"
        );


    return {

        emissions: {

            essence:
                essence.emission,

            diesel:
                diesel.emission,

            fluide:
                fluide.emission

        },

        calculabilite: {

            essence:
                essence.calculable,

            diesel:
                diesel.calculable,

            fluide:
                fluide.calculable

        },

        total:
            essence.emission +
            diesel.emission +
            fluide.emission

    };

}


/* =========================================
   CALCUL AGRICULTURE
   ========================================= */

function calculerAgriculture(valeurs) {

    const animaux =
        calculerElevage(
            valeurs.animaux
        );


    const fumier =
        calculerFumier(
            valeurs.fumier
        );


    const engrais =
        calculerEngrais(
            valeurs.engrais
        );


    return {

        emissions: {

            animaux:
                animaux.emission,

            fumier:
                fumier.emission,

            engrais:
                engrais.emission

        },

        calculabilite: {

            animaux:
                animaux.calculable,

            fumier:
                fumier.calculable,

            engrais:
                engrais.calculable

        },

        total:
            animaux.emission +
            fumier.emission +
            engrais.emission

    };

}


/* =========================================
   FONCTION PRINCIPALE
   ========================================= */

function calculerBilanMensuel(donnees) {

    if (!donnees) {

        return null;

    }


    const valeurs =
        donnees.valeurs || {};


    let resultat;


    switch (donnees.secteur) {

        case "agroalimentaire":

            resultat =
                calculerAgroalimentaire(
                    valeurs
                );

            break;


        case "btp":

            resultat =
                calculerBTP(
                    valeurs
                );

            break;


        case "industrie":

            resultat =
                calculerIndustrie(
                    valeurs
                );

            break;


        case "commerce":

            resultat =
                calculerCommerce(
                    valeurs
                );

            break;


        case "agriculture":

            resultat =
                calculerAgriculture(
                    valeurs
                );

            break;


        default:

            return null;

    }


    /*
     * Conversion kgCO2e → tCO2e
     */

    const totalKgCO2e =
        resultat.total;


    const totalTCO2e =
        totalKgCO2e / 1000;


    return {

        nom:
            donnees.nom,

        mois:
            donnees.mois,

        secteur:
            donnees.secteur,


        emissions:
            resultat.emissions,


        calculabilite:
            resultat.calculabilite,


        totalKgCO2e:
            totalKgCO2e,


        totalTCO2e:
            totalTCO2e,


        unite:
            "kgCO2e",


        periode:
            "mensuelle"

    };

}


/* =========================================
   ANALYSE DU NIVEAU D'ÉMISSION
   ========================================= */

function determinerNiveauEmission(
    totalKgCO2e
) {

    if (totalKgCO2e < 1000) {

        return {

            niveau: "faible",

            titre: "Émissions faibles",

            message:
                "Le niveau d'émission calculé est relativement faible pour le mois évalué."

        };

    }


    if (totalKgCO2e < 5000) {

        return {

            niveau: "modere",

            titre: "Émissions modérées",

            message:
                "Les émissions méritent une attention particulière et peuvent être réduites."

        };

    }


    if (totalKgCO2e < 10000) {

        return {

            niveau: "eleve",

            titre: "Émissions élevées",

            message:
                "Le niveau d'émission est élevé. Des mesures de réduction sont recommandées."

        };

    }


    return {

        niveau: "tres-eleve",

        titre: "Émissions très élevées",

        message:
            "Le niveau d'émission est très élevé. Une analyse approfondie des principales sources est recommandée."

    };

}


/* =========================================
   CONSEILS
   ========================================= */

function genererConseils(
    secteur,
    niveau
) {

    const conseils = [];


    if (
        niveau === "eleve" ||
        niveau === "tres-eleve"
    ) {

        conseils.push(
            "Identifier les principales sources d'émission du mois."
        );

        conseils.push(
            "Réduire autant que possible la consommation de combustibles fossiles."
        );

    }


    switch (secteur) {

        case "agroalimentaire":

            conseils.push(
                "Optimiser l'utilisation du bois, du charbon et du GPL dans les équipements de cuisson."
            );

            conseils.push(
                "Améliorer la gestion et le traitement des déchets organiques."
            );

            break;


        case "btp":

            conseils.push(
                "Optimiser les déplacements des engins et des camions."
            );

            conseils.push(
                "Réduire la consommation de diesel lorsque cela est possible."
            );

            break;


        case "industrie":

            conseils.push(
                "Surveiller la consommation électrique mensuelle."
            );

            conseils.push(
                "Limiter l'utilisation des groupes électrogènes."
            );

            break;


        case "commerce":

            conseils.push(
                "Optimiser les trajets des véhicules de livraison."
            );

            conseils.push(
                "Entretenir régulièrement les véhicules."
            );

            break;


        case "agriculture":

            conseils.push(
                "Améliorer la gestion du fumier."
            );

            conseils.push(
                "Optimiser l'utilisation des engrais azotés."
            );

            break;

    }


    return conseils;

}


/* =========================================
   EXPOSITION
   ========================================= */

window.PasseportCarboneCalcul = {

    calculerBilanMensuel:
        calculerBilanMensuel,

    determinerNiveauEmission:
        determinerNiveauEmission,

    genererConseils:
        genererConseils

};
