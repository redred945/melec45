# M'ELEC — La maison d'électricité

Refonte du site de **M'ELEC** (artisan électricien, chauffagiste, VMC — Saint-Jean-de-Braye, 45).
Site statique (HTML/CSS/JS, aucune dépendance ni étape de build), déployable tel quel sur Vercel.

## Aperçu local

```bash
npx serve -l 4790 melec45      # depuis C:\Users\Reda\Code
```

## Pages

`index` · `electricite-generale` · `vmc` · `chauffage` · `automatisme` · `reseau-informatique` · `borne-de-recharge` · `elide-fire` · `realisations` · `bouzy-la-foret` · `contact` · `mentions-legales`

Tout le contenu texte (services, tarifs/forfaits, mentions légales, zones, horaires) est repris du site d'origine melec45.fr.

## Design

- Palette du client : bordeaux `#801618`, jaune `#FFD200`, brun `#463939`, vert IRVE `#058739` (uniquement pour la borne de recharge).
- Titres : Fraunces (écho au logo serif « M'ELEC — La maison d'électricité »), texte : Figtree.
- Tokens dans `assets/css/style.css` (`:root`).
- Photos : celles du client, converties en WebP (`assets/img/`).

## Mobile

- Hero raccourci sur mobile : les textes ont deux versions (`.d-only` desktop / `.m-only` mobile, bascule à 720 px).
- Carrousels à balayer (`.swipe` : scroll-snap horizontal + pastilles de pagination générées par `app.js`) sur les cartes de services, comparatifs, galeries et photos. Onglets du hero défilables, et panneau du hero à balayer pour changer de métier.
- Pour rendre un autre bloc glissable : lui ajouter la classe `swipe` (ses enfants directs deviennent les diapositives).

## À compléter / vérifier avant mise en ligne

- [ ] **Clé Web3Forms** : remplacer `VOTRE_CLE_WEB3FORMS` dans `contact.html` (`data-access-key`). Tant qu'elle est absente, le formulaire ouvre le mailto de `melec45@orange.fr`.
- [ ] **Avis** : le site affiche « 33 avis » (chiffre repris de l'ancien site) avec un lien vers `https://www.melec45.fr/page-avis`. Remplacer par le lien Google Business du client (ce lien tombera avec l'ancien site). Aucune note ni citation n'a été inventée.
- [ ] **Vérifier le chiffre Elide Fire** « 280 000 incendies / an » (repris tel quel du site d'origine) et sa source.
- [ ] **Licence photo** : `borne-technicien.webp` provient d'une image AdobeStock (repérée sur l'ancien site) — confirmer que la licence couvre le nouveau site.
- [ ] **Rayon d'intervention** : l'ancien site annonce 30 km (Bouzy-la-Forêt), 100 km (VMC, chauffage, contact) et « Loiret + limitrophes » (accueil). J'ai retenu « Loiret + ~100 km », 30 km restant sur la page Bouzy-la-Forêt. À valider avec le client.
- [ ] **Hébergeur** (mentions légales) : indiqué Vercel Inc. — à adapter si l'hébergement change.
- [ ] **Polices** : chargées depuis Google Fonts (transmet l'IP au service, précisé dans « Vie privée »). Option RGPD : les héberger en local.
- [ ] **Domaine** : ajouter `canonical`, `sitemap.xml`, `robots.txt` et une image `og:image` une fois le domaine définitif connu ; rediriger les anciennes URL (`/vmc`, `/chauffage`, `/photos-*`, `/page-avis`…).
- [ ] Liens réseaux : seule la page Facebook du client (`facebook.com/Melec-290972847989474`) a été trouvée.
