# PRD — Statut client

| Champ | Valeur |
| --- | --- |
| Identifiant de fonctionnalité | `CUSTOMER-STATUS` |
| Version | `v1.0` |
| Statut | Décisions métier validées — prêt pour planification |

## Objectif métier

Permettre à l'administration d'indiquer de façon fiable si une fiche client est active ou inactive, sans modifier les autres capacités métier du client. Cette information doit être consultable et exploitable par les utilisateurs autorisés, afin de rendre l'état courant du client explicite.

## Utilisateurs et acteurs

- **Administrateur (`ROLE_ADMIN`)** : seul acteur autorisé à modifier le statut d'une fiche client.
- **Utilisateur autorisé à consulter un client** : peut consulter une fiche client, y compris lorsqu'elle est inactive.
- **Client** : fiche métier ; il ne possède pas de compte utilisateur et n'agit pas dans cette fonctionnalité.

## Contexte fonctionnel existant

La fonctionnalité introduit l'information de statut sur la fiche métier Customer. Aucun processus métier existant de désactivation de client n'est à remplacer dans ce MVP.

## Périmètre MVP

Le MVP permet :

- de représenter l'état courant d'un client par `ACTIVE` ou `INACTIVE` ;
- à un administrateur de demander un changement de statut depuis l'API et par une action de l'administration ;
- de consulter un client quel que soit son statut ;
- de retourner une erreur explicite lorsqu'une modification cible un client inexistant ;
- de répéter une demande qui porte déjà sur le statut demandé sans créer d'effet métier supplémentaire.

## Exclusions MVP

Sont hors périmètre :

- compte utilisateur, authentification ou accès direct du client ;
- historique des changements, motif de changement ou notification ;
- suppression de client ;
- changement de statut en masse ;
- exclusion, blocage ou adaptation d'autres opérations métier lorsqu'un client est `INACTIVE`.

## Décisions métier validées et règles

| Référence | Décision métier validée |
| --- | --- |
| `DM-CUSTOMER-STATUS-001` | Customer est une fiche métier et ne correspond pas à un compte utilisateur. |
| `DM-CUSTOMER-STATUS-002` | Seul `ROLE_ADMIN` peut changer le statut d'un client. |
| `DM-CUSTOMER-STATUS-003` | Le MVP offre le changement de statut via une API et une action d'administration. |
| `DM-CUSTOMER-STATUS-004` | Les seuls statuts du MVP sont `ACTIVE` et `INACTIVE`. |
| `DM-CUSTOMER-STATUS-005` | Une transition vers le statut déjà courant est idempotente. |
| `DM-CUSTOMER-STATUS-006` | Une demande concernant un client inexistant produit une erreur explicite. |
| `DM-CUSTOMER-STATUS-007` | `INACTIVE` est informatif : il n'empêche aucune autre opération métier. |
| `DM-CUSTOMER-STATUS-008` | Un client inactif reste consultable. |
| `DM-CUSTOMER-STATUS-009` | Toute écriture est protégée par authentification, autorisation et protection CSRF. |
| `DM-CUSTOMER-STATUS-010` | Le MVP ne comprend ni historique, ni motif, ni notification, ni suppression, ni traitement de masse. |

Les règles fonctionnelles sont donc :

- Le statut courant d'un client est obligatoirement l'une des deux valeurs définies par `DM-CUSTOMER-STATUS-004`.
- Seul un administrateur peut changer ce statut, conformément à `DM-CUSTOMER-STATUS-002` et `DM-CUSTOMER-STATUS-009`.
- Une demande de statut identique au statut courant réussit sans changement métier additionnel, conformément à `DM-CUSTOMER-STATUS-005`.
- L'inactivité n'altère ni la consultation ni les autres opérations métier, conformément à `DM-CUSTOMER-STATUS-007` et `DM-CUSTOMER-STATUS-008`.

## User story

**US-CUSTOMER-STATUS-001 — Changer le statut d'une fiche client**

En tant qu'administrateur, je veux définir une fiche client comme `ACTIVE` ou `INACTIVE` depuis l'API ou l'administration afin que son état courant soit visible sans empêcher les autres opérations métier.

## Critères d'acceptation vérifiables

1. Étant donné un administrateur authentifié et un client existant, lorsqu'il demande `ACTIVE` ou `INACTIVE` depuis l'API ou l'action d'administration, alors le statut courant du client correspond à la valeur demandée. (`DM-CUSTOMER-STATUS-002`, `DM-CUSTOMER-STATUS-003`, `DM-CUSTOMER-STATUS-004`, `DM-CUSTOMER-STATUS-009`)
2. Étant donné un utilisateur qui n'a pas `ROLE_ADMIN`, lorsqu'il tente de changer le statut d'un client, alors la modification est refusée et le statut du client reste inchangé. (`DM-CUSTOMER-STATUS-002`, `DM-CUSTOMER-STATUS-009`)
3. Étant donné une demande d'écriture non authentifiée, non autorisée ou ne satisfaisant pas la protection CSRF requise, lorsqu'elle vise un changement de statut, alors la modification est refusée. (`DM-CUSTOMER-STATUS-009`)
4. Étant donné un client déjà dans le statut demandé, lorsqu'un administrateur répète la demande, alors l'opération est considérée comme réussie et le statut reste inchangé. (`DM-CUSTOMER-STATUS-005`)
5. Étant donné un identifiant de client inexistant, lorsqu'un administrateur demande un changement de statut, alors l'opération échoue avec une erreur explicite et aucun client n'est modifié. (`DM-CUSTOMER-STATUS-006`)
6. Étant donné un client `INACTIVE`, lorsqu'un utilisateur autorisé le consulte, alors sa fiche reste accessible et son statut est visible. (`DM-CUSTOMER-STATUS-007`, `DM-CUSTOMER-STATUS-008`)
7. Étant donné un client `INACTIVE`, lorsqu'une autre opération métier normalement autorisée est réalisée, alors son seul statut `INACTIVE` ne constitue pas un motif de refus. (`DM-CUSTOMER-STATUS-007`)
8. Le MVP ne propose aucune capacité d'historique, motif, notification, suppression ou changement de statut en masse. (`DM-CUSTOMER-STATUS-010`)

## Handoff Planner

Planifier une seule capacité de gestion du statut courant de Customer, couvrant les deux canaux validés (API et administration) et l'ensemble des critères d'acceptation ci-dessus. Aucun comportement supplémentaire pour un client `INACTIVE` ne doit être ajouté.

## Arbitrages humains requis

Aucun pour ce MVP : les décisions métier nécessaires sont listées et validées. Toute question sur le statut initial d'une nouvelle fiche client, les formats de message d'erreur ou l'évolution des opérations métier est hors périmètre et requiert une décision métier explicite avant extension.
