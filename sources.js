/* =========================================
   PASSEPORT CARBONE
   CATALOGUE DES SOURCES ET SECTEURS
   Fichier partagé par formulaire.html et detail.html
   ========================================= */


/* =========================================
   SECTEURS — métadonnées et sources principales
   (Étape 1 : le strict nécessaire, < 10 min)
   ========================================= */

const SECTEURS_META = {

    agroalimentaire: {
        nom: "Agroalimentaire et transformation locale",
        description: "Boulangerie, transformation alimentaire, boissons…",
        sources: ["bois", "charbon", "gpl", "electricite", "dechets"]
    },

    btp: {
        nom: "BTP et matériaux",
        description: "Chantiers, production de matériaux, cuisson de briques…",
        sources: ["diesel_groupe", "essence", "ciment", "electricite", "bois_btp"]
    },

    industrie: {
        nom: "Industrie manufacturière",
        description: "Petites unités de production, ateliers, transformation…",
        sources: ["electricite", "diesel_groupe", "fioul", "gpl", "fluide"]
    },

    commerce: {
        nom: "Commerce, transport et logistique",
        description: "Transport de marchandises ou de personnes, commerce avec flotte…",
        sources: ["diesel_moteur", "essence", "electricite", "fluide"]
    },

    agriculture: {
        nom: "Agriculture et élevage",
        description: "Exploitations agricoles, élevages, polyculture…",
        sources: ["bovins", "ovins", "caprins", "porcins", "fumier", "engrais", "diesel_groupe", "electricite"]
    }

};


/* =========================================
   SECTEURS — sources complémentaires
   (Étape 2 : raffinement progressif, toutes optionnelles)
   ========================================= */

const SECTEURS_COMPLEMENTS = {

    agroalimentaire: ["diesel_moteur", "essence", "fluide", "fioul"],

    btp: ["diesel_moteur", "gpl", "fluide"],

    industrie: ["diesel_moteur", "essence", "bois"],

    commerce: ["gpl", "fioul", "dechets"],

    agriculture: ["essence", "bois", "dechets"]

};


/* =========================================
   CATALOGUE DES SOURCES
   Chaque source a un `kind` qui détermine
   comment le formulaire la rend, et comment
   le moteur de calcul l'interprète.
   ========================================= */

const CATALOGUE_SOURCES = {

    /* --- Carburants fossiles --- */

    essence: {
        kind: "combustible",
        facteurId: "essence",
        label: "⛽ Essence",
        help: "Litres ou bidons consommés pendant le mois (véhicules).",
        unitesId: "carburant_liquide",
        uniteDefaut: "litre"
    },

    diesel_moteur: {
        kind: "combustible",
        facteurId: "diesel_moteur",
        label: "🚛 Diesel — véhicules",
        help: "Litres ou bidons consommés par les véhicules pendant le mois.",
        unitesId: "carburant_liquide",
        uniteDefaut: "litre"
    },

    diesel_groupe: {
        kind: "combustible",
        facteurId: "diesel_groupe",
        label: "⛽ Diesel — groupe électrogène / chaudière",
        help: "Diesel utilisé pour produire de l'électricité ou de la chaleur (hors véhicules).",
        unitesId: "carburant_liquide",
        uniteDefaut: "litre"
    },

    gpl: {
        kind: "combustible",
        facteurId: "propane",
        label: "🔥 GPL / Butane",
        help: "Nombre de bouteilles ou masse totale utilisée pendant le mois.",
        unitesId: "gpl",
        uniteDefaut: "bouteille_12_5"
    },

    fioul: {
        kind: "combustible",
        facteurId: "fioul",
        label: "🔥 Fioul lourd / résiduel",
        help: "Masse de fioul consommée pendant le mois.",
        unitesId: null,
        uniteDefaut: "kg"
    },

    /* --- Biomasse --- */

    bois: {
        kind: "combustible",
        facteurId: "bois",
        label: "🪵 Bois de chauffe",
        help: "Kilogrammes ou fagots utilisés pendant le mois. Le CO₂ biogénique est compté séparément.",
        unitesId: "bois",
        uniteDefaut: "kg"
    },

    bois_btp: {
        kind: "combustible",
        facteurId: "bois",
        label: "🪵 Bois / biomasse (cuisson de briques)",
        help: "Bois utilisé sur chantier pendant le mois.",
        unitesId: "bois",
        uniteDefaut: "kg"
    },

    charbon: {
        kind: "combustible",
        facteurId: "charbon_bois",
        label: "🪨 Charbon de bois",
        help: "Sacs ou kilogrammes utilisés pendant le mois.",
        unitesId: "charbon",
        uniteDefaut: "sac"
    },

    /* --- Électricité --- */

    electricite: {
        kind: "electricite",
        label: "⚡ Électricité du réseau",
        help: "Saisissez de préférence les kWh figurant sur votre facture SONABEL."
    },

    /* --- Fluides --- */

    fluide: {
        kind: "fluide",
        label: "❄️ Fluides frigorigènes (recharges)",
        help: "Quantité de fluide RECHARGÉE pendant le mois. Conservez les fiches d'intervention."
    },

    /* --- Ciment --- */

    ciment: {
        kind: "ciment",
        label: "🧱 Ciment (achats)",
        help: "Sacs de 50 kg ou tonnes achetés/consommés pendant le mois."
    },

    /* --- Déchets --- */

    dechets: {
        kind: "dechets",
        label: "🗑️ Déchets organiques",
        help: "Indiquez la pratique principale. La quantité est optionnelle."
    },

    /* --- Élevage --- */

    bovins:  { kind: "elevage", espece: "bovins",  label: "🐄 Bovins",  help: "Nombre moyen d'animaux présents dans le mois." },
    ovins:   { kind: "elevage", espece: "ovins",   label: "🐑 Ovins",   help: "Nombre moyen d'animaux présents dans le mois." },
    caprins: { kind: "elevage", espece: "caprins", label: "🐐 Caprins", help: "Nombre moyen d'animaux présents dans le mois." },
    porcins: { kind: "elevage", espece: "porcins", label: "🐖 Porcins", help: "Nombre moyen d'animaux présents dans le mois." },

    /* --- Fumier --- */

    fumier: {
        kind: "fumier",
        label: "♻️ Gestion du fumier",
        help: "Mode de gestion principal des déjections animales."
    },

    /* --- Engrais --- */

    engrais: {
        kind: "engrais",
        label: "🌾 Engrais azotés",
        help: "Type d'engrais + masse appliquée pendant le mois."
    }

};


/* =========================================
   RENDU D'UNE SOURCE — HTML
   ========================================= */

function rendreSourceHTML(sourceId, existant) {
    const cat = CATALOGUE_SOURCES[sourceId];
    if (!cat) return "";

    const e = existant || {};
    const n = (name) => `name="${sourceId}_${name}"`;

    let champs = "";

    /* --- COMBUSTIBLE --- */
    if (cat.kind === "combustible") {
        champs += `
            <div class="form-group">
                <label>Quantité</label>
                <input type="number" ${n("quantite")} min="0" step="any"
                    placeholder="Ex. 500" value="${e.quantite || ""}">
            </div>`;

        if (cat.unitesId) {
            const units = UNITES_LOCALES[cat.unitesId] || [];
            champs += `
                <div class="form-group">
                    <label>Unité</label>
                    <select ${n("unite")}>
                        ${units.map(u => `
                            <option value="${u.id}"
                                ${(e.uniteId || cat.uniteDefaut) === u.id ? "selected" : ""}>
                                ${u.nom}${u.provisoire ? " (provisoire)" : ""}
                            </option>`).join("")}
                    </select>
                </div>`;
        } else {
            champs += `<input type="hidden" ${n("unite")} value="kg">`;
        }
    }

    /* --- ÉLECTRICITÉ --- */
    else if (cat.kind === "electricite") {
        champs += `
            <div class="form-group">
                <label style="font-weight:normal;display:flex;gap:8px;align-items:center;margin-bottom:8px">
                    <input type="radio" ${n("mode")} value="kwh" checked> Saisir les kWh (facture)
                </label>
                <label style="font-weight:normal;display:flex;gap:8px;align-items:center">
                    <input type="radio" ${n("mode")} value="fcfa"> Saisir le montant payé (FCFA)
                </label>
            </div>
            <div class="form-group">
                <label>Valeur</label>
                <input type="number" ${n("valeur")} min="0" step="any"
                    placeholder="Ex. 1200" value="${e.valeur || ""}">
                <small>Le montant en FCFA sera marqué « estimé » dans le rapport.</small>
            </div>`;
    }

    /* --- FLUIDE --- */
    else if (cat.kind === "fluide") {
        const fluides = Object.keys(FACTEURS_FRIGORIGENES);
        champs += `
            <div class="form-group">
                <label>Type de fluide</label>
                <select ${n("typeFluide")}>
                    <option value="">— Choisir —</option>
                    ${fluides.map(f => `
                        <option value="${f}"
                            ${e.typeFluide === f ? "selected" : ""}>
                            ${FACTEURS_FRIGORIGENES[f].nom}
                        </option>`).join("")}
                </select>
            </div>
            <div class="form-group">
                <label>Masse rechargée (kg)</label>
                <input type="number" ${n("masse")} min="0" step="any"
                    placeholder="Ex. 1.5" value="${e.masse || ""}">
                <small>Si inconnu, laissez vide : aucune estimation ne sera produite.</small>
            </div>`;
    }

    /* --- CIMENT --- */
    else if (cat.kind === "ciment") {
        champs += `
            <div class="form-group">
                <label>Quantité</label>
                <input type="number" ${n("quantite")} min="0" step="any"
                    placeholder="Ex. 20" value="${e.quantite || ""}">
            </div>
            <div class="form-group">
                <label>Unité</label>
                <select ${n("unite")}>
                    ${UNITES_LOCALES.ciment.map(u => `
                        <option value="${u.id}"
                            ${(e.uniteId || "sac_50") === u.id ? "selected" : ""}>
                            ${u.nom}
                        </option>`).join("")}
                </select>
            </div>`;
    }

    /* --- ÉLEVAGE --- */
    else if (cat.kind === "elevage") {
        champs += `
            <div class="form-group">
                <label>Nombre moyen d'animaux dans le mois</label>
                <input type="number" ${n("nombre")} min="0" step="1"
                    placeholder="Ex. 12" value="${e.nombre || ""}">
            </div>`;
    }

    /* --- FUMIER --- */
    else if (cat.kind === "fumier") {
        champs += `
            <div class="form-group">
                <label>Mode de gestion principal</label>
                <select ${n("mode")}>
                    <option value="">— Choisir —</option>
                    ${GESTION_FUMIER.map(m => `
                        <option value="${m.id}"
                            ${e.mode === m.id ? "selected" : ""}>
                            ${m.nom}
                        </option>`).join("")}
                </select>
                <small>Cette information est enregistrée. Elle sera quantifiée dès que les facteurs par filière seront disponibles.</small>
            </div>`;
    }

    /* --- ENGRAIS --- */
    else if (cat.kind === "engrais") {
        const produits = Object.keys(FACTEURS_ENGRAIS);
        champs += `
            <div class="form-group">
                <label>Type d'engrais</label>
                <select ${n("produitId")}>
                    <option value="">— Choisir —</option>
                    ${produits.map(p => `
                        <option value="${p}"
                            ${e.produitId === p ? "selected" : ""}>
                            ${FACTEURS_ENGRAIS[p].nom}
                        </option>`).join("")}
                </select>
            </div>
            <div class="form-group">
                <label>Masse appliquée</label>
                <input type="number" ${n("quantite")} min="0" step="any"
                    placeholder="Ex. 100" value="${e.quantite || ""}">
            </div>
            <div class="form-group">
                <label>Unité</label>
                <select ${n("unite")}>
                    ${UNITES_LOCALES.engrais.map(u => `
                        <option value="${u.id}"
                            ${(e.uniteId || "kg") === u.id ? "selected" : ""}>
                            ${u.nom}
                        </option>`).join("")}
                </select>
            </div>`;
    }

    /* --- DÉCHETS --- */
    else if (cat.kind === "dechets") {
        champs += `
            <div class="form-group">
                <label>Destination principale</label>
                <select ${n("destination")}>
                    <option value="">— Choisir —</option>
                    ${DESTINATIONS_DECHETS.map(d => `
                        <option value="${d.id}"
                            ${e.destination === d.id ? "selected" : ""}>
                            ${d.nom}
                        </option>`).join("")}
                </select>
            </div>
            <div class="form-group">
                <label>Quantité (kg, facultatif)</label>
                <input type="number" ${n("masseKg")} min="0" step="any"
                    placeholder="Ex. 80" value="${e.masseKg || ""}">
                <small>Si la quantité n'est pas connue, la pratique sera enregistrée sans estimation chiffrée.</small>
            </div>`;
    }

    /* --- Qualité de donnée (toutes sources) --- */
    champs += `
        <div class="form-group">
            <label>Qualité de la donnée</label>
            <select ${n("qualite")}>
                <option value="declaree"  ${(e.qualite || "declaree") === "declaree"  ? "selected" : ""}>Déclarée</option>
                <option value="confirmee" ${e.qualite === "confirmee" ? "selected" : ""}>Confirmée (facture, reçu, relevé)</option>
                <option value="estimee"   ${e.qualite === "estimee"   ? "selected" : ""}>Estimée (conversion locale, montant FCFA)</option>
                <option value="manquante" ${e.qualite === "manquante" ? "selected" : ""}>Manquante (source identifiée, quantité inconnue)</option>
            </select>
        </div>`;

    return `
        <div class="source-bloc" data-source-id="${sourceId}"
             style="padding:22px 0;border-top:1px solid #edf1ed">
            <h3 style="font-size:17px;margin-bottom:6px">${cat.label}</h3>
            <p style="color:#6a756d;font-size:13px;margin-bottom:16px">${cat.help}</p>
            ${champs}
        </div>`;
}


/* =========================================
   LECTURE D'UNE SOURCE DEPUIS LE DOM
   Retourne un objet compatible calcul.js,
   ou null si rien n'a été saisi.
   ========================================= */

function lireSource(cardEl, sourceId) {
    const cat = CATALOGUE_SOURCES[sourceId];
    if (!cat) return null;

    const get = (name) => {
        const el = cardEl.querySelector(`[name="${sourceId}_${name}"]`);
        return el ? el.value : null;
    };
    const num = (name) => {
        const v = get(name);
        if (v === null || v === "") return null;
        const n = Number(v);
        return Number.isFinite(n) && n >= 0 ? n : null;
    };

    const qualite = get("qualite") || "declaree";
    const base = { kind: cat.kind, label: cat.label.replace(/^[^\w]+\s*/, ""), qualite };

    /* --- Combustible --- */
    if (cat.kind === "combustible") {
        const qte = num("quantite");
        if (qte === null || qte === 0) return null;
        const uniteId = get("unite") || cat.uniteDefaut;
        let mult = 1;
        if (cat.unitesId) {
            const u = (UNITES_LOCALES[cat.unitesId] || []).find(x => x.id === uniteId);
            if (u) mult = u.multiplicateur;
        }
        return { ...base, facteurId: cat.facteurId, quantite: qte * mult, uniteId };
    }

    /* --- Électricité --- */
    if (cat.kind === "electricite") {
        const mode = (cardEl.querySelector(`[name="${sourceId}_mode"]:checked`) || {}).value || "kwh";
        const val = num("valeur");
        if (val === null || val === 0) return null;
        if (mode === "kwh") return { ...base, kwh: val };
        return { ...base, fcfa: val, qualite: "estimee" };
    }

    /* --- Fluide --- */
    if (cat.kind === "fluide") {
        const typeFluide = get("typeFluide");
        const masse = num("masse");
        if (!typeFluide || masse === null || masse === 0) return null;
        return { ...base, typeFluide, masse };
    }

    /* --- Ciment --- */
    if (cat.kind === "ciment") {
        const qte = num("quantite");
        if (qte === null || qte === 0) return null;
        const uniteId = get("unite") || "sac_50";
        const u = UNITES_LOCALES.ciment.find(x => x.id === uniteId) || UNITES_LOCALES.ciment[0];
        return { ...base, masseKg: qte * u.multiplicateur };
    }

    /* --- Élevage --- */
    if (cat.kind === "elevage") {
        const nombre = num("nombre");
        if (nombre === null || nombre === 0) return null;
        return { ...base, espece: cat.espece, nombre };
    }

    /* --- Fumier (pratique seulement) --- */
    if (cat.kind === "fumier") {
        const mode = get("mode");
        if (!mode) return null;
        return { ...base, mode };
    }

    /* --- Engrais --- */
    if (cat.kind === "engrais") {
        const produitId = get("produitId");
        const qte = num("quantite");
        if (!produitId || qte === null || qte === 0) return null;
        const uniteId = get("unite") || "kg";
        const u = UNITES_LOCALES.engrais.find(x => x.id === uniteId) || UNITES_LOCALES.engrais[0];
        return { ...base, produitId, masseKg: qte * u.multiplicateur };
    }

    /* --- Déchets --- */
    if (cat.kind === "dechets") {
        const destination = get("destination");
        const masseKg = num("masseKg");
        if (!destination && masseKg === null) return null;
        return { ...base, destination: destination || null, masseKg };
    }

    return null;
}


/* =========================================
   RENDU D'UNE LISTE DE SOURCES
   ========================================= */

function rendreListeSources(container, sourceIds, existant) {
    container.innerHTML = sourceIds.map(id => rendreSourceHTML(id, (existant || {})[id])).join("");
}


/* =========================================
   LECTURE DE TOUTES LES SOURCES D'UN CONTENEUR
   ========================================= */

function lireToutesLesSources(container) {
    const valeurs = {};
    for (const bloc of container.querySelectorAll(".source-bloc")) {
        const id = bloc.dataset.sourceId;
        const input = lireSource(bloc, id);
        if (input) valeurs[id] = input;
    }
    return valeurs;
          }
