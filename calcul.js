/* =========================================
   PASSEPORT CARBONE
   MOTEUR DE CALCUL MENSUEL
   Logique : donnée d'activité × facteur d'émission = kg CO2e
   ========================================= */


/* =========================================
   OUTIL — NOMBRE SÛR
   ========================================= */

function _nombre(valeur) {
    const resultat = Number(valeur);
    if (!Number.isFinite(resultat) || resultat < 0) return 0;
    return resultat;
}


/* =========================================
   OUTIL — ÉNERGIE EN TJ DEPUIS UN COMBUSTIBLE
   ========================================= */

function _energieTJ(quantite, facteur) {
    if (!facteur || !facteur.NCV) return 0;

    if (facteur.unite === "litre") {
        if (!facteur.densite) return 0;
        const masse = quantite * facteur.densite;           // kg
        return masse * facteur.NCV / 1_000_000;             // TJ
    }

    if (facteur.unite === "kg") {
        return quantite * facteur.NCV / 1_000_000;          // TJ
    }

    return 0;
}


/* =========================================
   CALCUL COMBUSTIBLE — RETOURNE {co2e, biogenique}
   ========================================= */

function calculerCombustible(quantite, facteur) {
    quantite = _nombre(quantite);
    if (!facteur || quantite === 0) {
        return { co2e: 0, biogenique: 0 };
    }

    const energieTJ = _energieTJ(quantite, facteur);
    if (energieTJ <= 0) return { co2e: 0, biogenique: 0 };

    const CO2 = energieTJ * (facteur.facteurCO2 || 0);
    const CH4 = energieTJ * (facteur.facteurCH4 || 0);
    const N2O = energieTJ * (facteur.facteurN2O || 0);

    /* Si biomasse : CO2 biogénique sorti du total opérationnel */
    const biogenique = facteur.biogenique ? CO2 : 0;
    const co2Oper = facteur.biogenique ? 0 : CO2;

    const co2e = co2Oper
        + CH4 * GWP_BURKINA.CH4
        + N2O * GWP_BURKINA.N2O;

    return { co2e: co2e, biogenique: biogenique };
}


/* =========================================
   CALCUL ÉLECTRICITÉ
   input : { kwh } ou { fcfa } (fallback estimé)
   ========================================= */

function calculerElectricite(input) {
    if (!input) return { co2e: 0, estime: false };

    const facteur = FACTEUR_ELECTRICITE_PAR_DEFAUT === "reseau_2014"
        ? FACTEURS_ELECTRICITE[1]
        : FACTEURS_ELECTRICITE[0];

    /* Saisie directe en kWh */
    if (input.kwh != null && _nombre(input.kwh) > 0) {
        return {
            co2e: _nombre(input.kwh) * facteur.facteur,
            estime: false,
            facteurId: facteur.id,
            anneeReference: facteur.anneeReference
        };
    }

    /* Fallback FCFA → kWh (estimation provisoire) */
    if (input.fcfa != null && _nombre(input.fcfa) > 0) {
        const kwh = _nombre(input.fcfa) / TARIF_MOYEN_FCFA_KWH.valeur;
        return {
            co2e: kwh * facteur.facteur,
            estime: true,
            kwh_estime: kwh,
            tarifUtilise: TARIF_MOYEN_FCFA_KWH.valeur,
            facteurId: facteur.id,
            anneeReference: facteur.anneeReference
        };
    }

    return { co2e: 0, estime: false };
}


/* =========================================
   CALCUL FLUIDE FRIGORIGÈNE
   ========================================= */

function calculerFluide(typeId, masseKg) {
    const masse = _nombre(masseKg);
    if (!typeId || masse === 0) {
        return { co2e: 0, manquant: true };
    }
    const fluide = FACTEURS_FRIGORIGENES[typeId];
    if (!fluide) return { co2e: 0, manquant: true };

    return { co2e: masse * fluide.facteur, fluide: fluide.nom };
}


/* =========================================
   CALCUL CIMENT
   ========================================= */

function calculerCiment(masseKg) {
    const masse = _nombre(masseKg);
    if (masse === 0) return { co2e: 0 };
    return { co2e: masse * FACTEUR_CIMENT.facteur, provisoire: true };
}


/* =========================================
   CALCUL ÉLEVAGE — FERMENTATION ENTÉRIQUE
   espèce → facteur annuel ÷ 12
   ========================================= */

function calculerElevage(especeId, nombre) {
    const nb = _nombre(nombre);
    if (!especeId || nb === 0) return { co2e: 0 };
    const esp = FACTEURS_ELEVAGE[especeId];
    if (!esp) return { co2e: 0 };
    return {
        co2e: nb * esp.facteurCO2eAnnuel / 12,
        espece: esp.nom
    };
}


/* =========================================
   CALCUL ENGRAIS AZOTÉS
   masse → kgN → N2O direct (+ CO2 urée)
   ========================================= */

function calculerEngrais(produitId, masseKg) {
    const masse = _nombre(masseKg);
    if (!produitId || masse === 0) return { co2e: 0 };

    const prod = FACTEURS_ENGRAIS[produitId];
    if (!prod) return { co2e: 0 };

    const n_kg = masse * prod.teneurN;
    const n2o_co2e = n_kg * FACTEUR_N2O_DIRECT_PAR_KG_N;
    const urea_co2 = prod.facteurCO2Uree ? masse * prod.facteurCO2Uree : 0;

    return {
        co2e: n2o_co2e + urea_co2,
        detail: {
            masse: masse,
            azote_kg: n_kg,
            n2o_co2e: n2o_co2e,
            urea_co2: urea_co2
        }
    };
}


/* =========================================
   CALCUL DÉCHETS
   Pas de quantification sans facteur par filière.
   La pratique est enregistrée.
   ========================================= */

function calculerDechets(masseKg, destinationId) {
    return {
        co2e: 0,
        masse: _nombre(masseKg) || null,
        destination: destinationId || null,
        note: "Pratique enregistrée. Quantification en attente de facteurs par filière."
    };
}


/* =========================================
   MOTEUR PAR SOURCE
   Chaque source a un kind qui sélectionne la logique.
   ========================================= */

function calculerSource(sourceId, input) {
    if (!input) return null;

    const kind = input.kind;
    const qualite = input.qualite || "declaree";
    const base = {
        sourceId: sourceId,
        label: input.label || sourceId,
        qualite: qualite,
        co2e: 0,
        biogenique: 0
    };

    switch (kind) {

        case "combustible": {
            const facteur = FACTEURS_COMBUSTIBLES[input.facteurId];
            const r = calculerCombustible(input.quantite, facteur);
            base.co2e = r.co2e;
            base.biogenique = r.biogenique;
            base.facteurId = input.facteurId;
            if (facteur && facteur.biogenique) base.biogenique_note = facteur.note;
            break;
        }

        case "electricite": {
            const r = calculerElectricite(input);
            base.co2e = r.co2e;
            if (r.estime) {
                base.qualite = "estimee";
                base.note = `Estimation à partir de ${input.fcfa} FCFA (tarif moyen ${r.tarifUtilise} FCFA/kWh).`;
            }
            break;
        }

        case "fluide": {
            const r = calculerFluide(input.typeFluide, input.masse);
            if (r.manquant) {
                base.qualite = "manquante";
                base.note = "Masse rechargée indisponible — aucun calcul possible.";
            } else {
                base.co2e = r.co2e;
            }
            break;
        }

        case "ciment": {
            const r = calculerCiment(input.masseKg);
            base.co2e = r.co2e;
            if (r.provisoire) base.note = FACTEUR_CIMENT.note;
            break;
        }

        case "elevage": {
            const r = calculerElevage(input.espece, input.nombre);
            base.co2e = r.co2e;
            break;
        }

        case "engrais": {
            const r = calculerEngrais(input.produitId, input.masseKg);
            base.co2e = r.co2e;
            if (r.detail) base.detail_engrais = r.detail;
            break;
        }

        case "fumier": {
            /* La gestion du fumier est enregistrée mais pas encore quantifiée.
               Les émissions dépendent du mode de gestion et de l'espèce —
               facteurs par filière à documenter avant tout calcul. */
            base.co2e = 0;
            base.note = "Pratique de gestion du fumier enregistrée. Quantification en attente de facteurs par filière.";
            if (input.mode) base.mode_fumier = input.mode;
            break;
        }

        case "dechets": {
            const r = calculerDechets(input.masseKg, input.destination);
            base.co2e = 0;
            base.note = r.note;
            if (r.destination) base.destination = r.destination;
            break;
        }

        default:
            return null;
    }

    /* On conserve la saisie d'origine pour l'affichage du détail dans le rapport */
    return Object.assign({}, base, { input: input });
}


/* =========================================
   ACTIONS PRIORITAIRES PAR TOP-SOURCE
   ========================================= */

const ACTIONS_PAR_SOURCE = {

    "Diesel / Gasoil": "Suivez les litres par véhicule et par kilomètre. Réduisez les trajets à vide, entretenez les moteurs, regroupez les livraisons.",
    "Diesel — véhicules": "Suivez les litres par véhicule et par kilomètre. Réduisez les trajets à vide, entretenez les moteurs, regroupez les livraisons.",
    "Diesel — groupe électrogène / chaudière": "Vérifiez le rendement du groupe. Comparez avec un raccordement au réseau ou une alternative solaire si disponible.",
    "Essence": "Suivez les litres par véhicule. Optimisez les itinéraires, limitez les trajets à vide.",
    "Électricité du réseau": "Relevez les kWh chaque mois. Identifiez les postes les plus énergivores (froid, moteurs, éclairage).",
    "GPL / Butane": "Vérifiez l'état des brûleurs et des équipements. Comparez avec le bois ou le charbon selon votre approvisionnement.",
    "GPL / Butane / Propane": "Vérifiez l'état des brûleurs et des équipements. Comparez avec le bois ou le charbon selon votre approvisionnement.",
    "Bois de chauffe": "Réduisez les pertes de chaleur, optimisez les fours. Étudiez une comparaison avec le GPL.",
    "Bois / biomasse (cuisson de briques)": "Réduisez les pertes de chaleur, optimisez les fours. Étudiez une comparaison avec d'autres combustibles.",
    "Charbon de bois": "Réduisez les pertes de chaleur, optimisez les fours. Étudiez une comparaison avec le GPL.",
    "Ciment (achats)": "Limitez les pertes de matériaux, optimisez les dosages, réduisez les trajets d'approvisionnement.",
    "Fluides frigorigènes (recharges)": "Contrôlez l'étanchéité des installations. Conservez les fiches d'intervention pour suivre les recharges.",
    "Fioul lourd / résiduel": "Vérifiez l'état des chaudières. Étudiez une alternative moins carbonée.",
    "Bovins": "Améliorez la ration alimentaire et suivez la productivité. Documentez les pratiques d'élevage.",
    "Ovins": "Améliorez la ration alimentaire et suivez la productivité. Documentez les pratiques d'élevage.",
    "Caprins": "Améliorez la ration alimentaire et suivez la productivité. Documentez les pratiques d'élevage.",
    "Porcins": "Améliorez la ration alimentaire et suivez la productivité. Documentez les pratiques d'élevage.",
    "Engrais azotés": "Fractionnez les apports, ajustez au besoin réel des cultures, privilégiez les périodes optimales."
};


/* =========================================
   CONSEILS PAR SECTEUR
   ========================================= */

const CONSEILS_SECTEURS = {
    agroalimentaire: [
        "Réduire progressivement la consommation de bois et de charbon lorsque des solutions plus efficaces sont disponibles.",
        "Améliorer le rendement des foyers, fours et équipements de cuisson.",
        "Éviter l'accumulation prolongée des déchets organiques et privilégier une gestion adaptée."
    ],
    btp: [
        "Optimiser les déplacements des engins et des camions pour réduire la consommation de diesel.",
        "Entretenir régulièrement les engins de chantier.",
        "Évaluer progressivement l'utilisation de matériaux et procédés moins émetteurs."
    ],
    industrie: [
        "Surveiller régulièrement la consommation électrique des équipements.",
        "Réduire l'utilisation des groupes électrogènes lorsque des alternatives sont disponibles.",
        "Assurer un suivi des systèmes de climatisation et des fluides frigorigènes."
    ],
    commerce: [
        "Optimiser les itinéraires et les déplacements des véhicules.",
        "Limiter les trajets à vide et regrouper les livraisons.",
        "Contrôler régulièrement les équipements frigorifiques."
    ],
    agriculture: [
        "Améliorer la gestion du fumier et des effluents d'élevage.",
        "Optimiser l'utilisation des engrais azotés.",
        "Suivre séparément les différents types d'animaux élevés."
    ]
};


/* =========================================
   NIVEAU D'ÉMISSION
   ========================================= */

function determinerNiveauEmission(totalKg) {
    totalKg = _nombre(totalKg);

    if (totalKg < 100) {
        return { niveau: "faible", titre: "Émissions relativement faibles",
                 message: "Le niveau est faible pour le périmètre déclaré. Continuez à suivre vos consommations chaque mois." };
    }
    if (totalKg < 1000) {
        return { niveau: "modere", titre: "Émissions à surveiller",
                 message: "Un suivi régulier est recommandé. Identifiez les principales sources." };
    }
    if (totalKg < 5000) {
        return { niveau: "eleve", titre: "Émissions élevées",
                 message: "Identifiez les principales sources et mettez en place des actions prioritaires." };
    }
    return { niveau: "tres-eleve", titre: "Émissions très élevées",
             message: "Une analyse approfondie et un plan d'action prioritaire sont recommandés." };
}


/* =========================================
   GÉNÉRATION DES ACTIONS PRIORITAIRES
   Basées sur le top 3 des sources.
   ========================================= */

function genererActions(top3) {
    const actions = [];
    for (const item of top3) {
        const act = ACTIONS_PAR_SOURCE[item.label];
        if (act) actions.push({ source: item.label, texte: act });
        if (actions.length >= 2) break;
    }
    if (actions.length === 0) {
        actions.push({
            source: "Général",
            texte: "Suivez cette source en priorité chaque mois, puis identifiez une action concrète à tester."
        });
    }
    return actions;
}


/* =========================================
   FONCTION PRINCIPALE
   ========================================= */

function calculerBilanMensuel(donnees) {
    if (!donnees) return null;

    const secteur = donnees.secteur || null;
    const valeurs = donnees.valeurs || {};

    const details = [];
    let total_co2e = 0;
    let total_biogenic = 0;
    const qualityCounts = { confirmee: 0, declaree: 0, estimee: 0, manquante: 0 };

    /* On parcourt les sources déclarées */
    for (const sourceId of Object.keys(valeurs)) {
        const input = valeurs[sourceId];
        if (!input || input.skipped) continue;

        const r = calculerSource(sourceId, input);
        if (!r) continue;

        total_co2e += r.co2e;
        total_biogenic += r.biogenique;
        if (qualityCounts[r.qualite] !== undefined) qualityCounts[r.qualite]++;

        details.push(r);
    }

    /* Top 3 */
    const top3 = [...details]
        .filter(d => d.co2e > 0)
        .sort((a, b) => b.co2e - a.co2e)
        .slice(0, 3);

    /* Part des émissions par statut de qualité */
    const totalForShare = total_co2e || 1;
    const qualityShare = { confirmee: 0, declaree: 0, estimee: 0 };
    for (const d of details) {
        if (qualityShare[d.qualite] !== undefined) {
            qualityShare[d.qualite] += d.co2e / totalForShare;
        }
    }

    /* Niveau et conseils */
    const niveau = determinerNiveauEmission(total_co2e);
    const conseilsSecteur = CONSEILS_SECTEURS[secteur] || [];
    const actions = genererActions(top3);

    return {
        nom: donnees.nom || null,
        mois: donnees.mois || null,
        secteur: secteur,
        total_co2e_kg: total_co2e,
        total_co2e_t: total_co2e / 1000,
        total_biogenic_kg: total_biogenic,
        details: details,
        top3: top3,
        qualityCounts: qualityCounts,
        qualityShare: qualityShare,
        niveau: niveau,
        conseilsSecteur: conseilsSecteur,
        actions: actions
    };
}


/* =========================================
   EXPOSITION
   ========================================= */

window.PasseportCarboneCalcul = {
    calculerBilanMensuel: calculerBilanMensuel,
    determinerNiveauEmission: determinerNiveauEmission,
    calculerCombustible: calculerCombustible,
    calculerElectricite: calculerElectricite,
    calculerFluide: calculerFluide,
    calculerCiment: calculerCiment,
    calculerElevage: calculerElevage,
    calculerEngrais: calculerEngrais
};
