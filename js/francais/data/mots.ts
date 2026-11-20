/* =====================================================================
   data/mots.js — banque de mots M.FR.MOTS
   Mots de la Liste orthographique du MEQ (2019) : 1re année (lo 1) et 2e année (lo 2),
   relevés dans « Liste orthographique — Document de référence », sections 2.3.3 et 2.3.4
   (les formes conjuguées de aimer, aller, avoir, dire, être, faire sont dans verbes.js).
   Mots d'appui (lo 0) : mots imageables pour les sons, les syllabes et les rimes.

   Une ligne = w | classe | lo | emoji | phrase de dictée | extras (cle=valeur;…)
     classe : nm, nf, nmf (nom épicène), adj, v, det, pron, adv, prep, conj, int
     extras : fem=  pl= (pluriel si ≠ w+s)  mu=lettre:justification (lettre muette finale)
              syl=a-b (syllabes ORALES sûres — absent = mot exclu du comptage)
              r=clé de rime  gr=graphèmes séparés par « . » (son:override, « x: » = muette)
   L'emoji n'est donné que s'il est sans ambiguïté (sert aux questions à image).
   ===================================================================== */

/** Classe d'une ligne de la banque (nm, nf, nmf = nom épicène…). */
type FrClasseCode = 'nm' | 'nf' | 'nmf' | 'adj' | 'v' | 'det' | 'pron' | 'adv' | 'prep' | 'conj' | 'int';
/** Classe de mots (cls). */
type FrClasse = 'nom' | 'adj' | 'verbe' | 'det' | 'pron' | 'adv' | 'prep' | 'conj' | 'int';
/** Graphème : lettres g, son s ('' = lettre muette). */
interface FrGrapheme {
  g: string;
  s: string;
}
/** Mot de la banque (M.FR.MOTS). */
interface FrMot {
  w: string;
  c: FrClasseCode;
  cls: FrClasse;
  /** Liste orthographique : 1re année (1), 2e année (2), mot d'appui (0). */
  lo: number;
  /** Phrase de dictée. */
  phrase: string;
  /** Genre d'un nom. */
  g?: 'm' | 'f' | 'mf';
  em?: string;
  fem?: string;
  pl?: string;
  /** Lettre muette finale, et le mot où on l'entend. */
  mu?: string;
  why?: string;
  /** Syllabes orales sûres. */
  syl?: string[];
  /** Clé de rime. */
  r?: string;
  gr?: FrGrapheme[];
}
interface FrancaisApi {
  MOTS: FrMot[];
  /** Graphème → son (notation de gr). */
  SND: Record<string, string>;
  mot(w: string): FrMot | undefined;
}
interface DataRegistry {
  'fr.mots': FrMot[];
}

(function () {
  'use strict';
  const M = window.M;
  M.FR = M.FR || ({} as FrancaisApi);

  const RAW = `
à|prep|1||Je vais à l'école à pied.|
aile|nf|1||L'oiseau ouvre une aile.|
aimer|v|1||Tu vas aimer ce livre.|
air|nm|1||Le ballon est rempli d'air.|
ami|nm|1||Mon ami joue avec moi.|fem=amie
animal|nm|1||Le chien est un animal.|pl=animaux
arbre|nm|1|🌳|Un écureuil grimpe dans l'arbre.|
avoir|v|1||Je vais avoir sept ans.|
beau|adj|1||Il fait beau aujourd'hui.|fem=belle;pl=beaux
beaucoup|adv|1||Il y a beaucoup de neige.|
bébé|nm|1|👶|Le bébé dort dans son lit.|syl=bé-bé;gr=b.é.b.é
blanc|adj|1||Mon chat est blanc.|fem=blanche;mu=c:blanche
bleu|adj|1||Le ciel est bleu.|fem=bleue;gr=b.l.eu
bon|adj|1||Ce gâteau est très bon.|fem=bonne
bonbon|nm|1|🍬|Léa mange un bonbon rouge.|syl=bon-bon;r=on;gr=b.on.b.on
bouche|nf|1|👄|J'ouvre grand la bouche.|gr=b.ou.ch.e:
bras|nm|1||Papa me prend dans ses bras.|mu=s
brun|adj|1||Mon chien a le poil brun.|fem=brune
carte|nf|1||J'écris une carte à ma grand-maman.|
chambre|nf|1||Ma chambre est bleue.|
chanter|v|1||J'aime chanter avec maman.|
chapeau|nm|1|👒|Il porte un chapeau rouge.|pl=chapeaux;syl=cha-peau;r=o;gr=ch.a.p.eau
chat|nm|1|🐱|Le chat dort sur mon lit.|fem=chatte;mu=t:chatte;syl=chat;r=a;gr=ch.a.t:
chaud|adj|1||Il fait chaud en été.|fem=chaude;mu=d:chaude
chemin|nm|1||Ce chemin mène au lac.|
cher|adj|1||Ce vélo est cher.|fem=chère
chercher|v|1||Je dois chercher mon chat.|
cheval|nm|1|🐴|Le cheval court dans le champ.|pl=chevaux;r=al
cheveu|nm|1||J'ai un cheveu dans ma soupe.|pl=cheveux
chien|nm|1|🐶|Mon chien aime courir.|fem=chienne;syl=chien;gr=ch.i.en:in
chose|nf|1||J'ai une chose à te dire.|
ciel|nm|1||Le ciel est tout bleu.|pl=cieux
cinq|det|1||J'ai cinq doigts à chaque main.|
classe|nf|1||Ma classe est très grande.|
cœur|nm|1|❤️|Mon cœur bat vite.|r=eur;gr=c.œu:eu.r
cou|nm|1||La girafe a un long cou.|gr=c.ou
coup|nm|1||Il donne un coup de pied au ballon.|
dame|nf|1||Une dame promène son chien.|
dans|prep|1||Le chat dort dans son panier.|
de|prep|1||Je bois un verre de lait.|
demander|v|1||Je vais demander de l'aide.|
dent|nf|1|🦷|J'ai perdu une dent.|mu=t:dentiste;syl=dent;r=an;gr=d.en.t:
deux|det|1||J'ai deux mains.|
devenir|v|1||Je veux devenir pompier.|
devoir|nm|1||Je fais mon devoir après l'école.|
dimanche|nm|1||Dimanche, on va chez grand-maman.|
dix|det|1||J'ai dix doigts.|
donner|v|1||Je vais donner un dessin à papa.|
dormir|v|1||Le bébé aime dormir.|
doux|adj|1||Le lapin est tout doux.|fem=douce
du|det|1||Je mange du pain.|
des|det|1||J'ai des billes dans mon sac.|
eau|nf|1|💧|Je bois de l'eau.|gr=eau
école|nf|1|🏫|Je vais à l'école à pied.|gr=é.c.o.l.e:
enfant|nmf|1|🧒|Cet enfant joue au parc.|mu=t:enfance;syl=en-fant;r=an;gr=en.f.an.t:
et|conj|1||J'aime les pommes et les poires.|
être|v|1||Je veux être gentil.|
famille|nf|1||Ma famille est grande.|
fenêtre|nf|1||Le chat regarde par la fenêtre.|
fête|nf|1|🎉|C'est ma fête aujourd'hui !|gr=f.ê.t.e:
feu|nm|1|🔥|Le feu brûle dans le foyer.|pl=feux;syl=feu;r=eu;gr=f.eu
feuille|nf|1|🍁|Une feuille tombe de l'arbre.|gr=f.eu.ill.e:
fille|nf|1|👧|Cette fille court vite.|gr=f.ill.e:
finir|v|1||Je dois finir mon dessin.|
fleur|nf|1|🌸|Cette fleur sent bon.|syl=fleur;r=eur;gr=f.l.eu.r
fois|nf|1||Je saute trois fois.|
forêt|nf|1|🌲|Le loup vit dans la forêt.|gr=f.o.r.ê.t:
frère|nm|1||Mon frère a huit ans.|gr=f.r.è.r.e:
garçon|nm|1|👦|Ce garçon lit un livre.|syl=gar-çon;r=on;gr=g.a.r.ç.on
grand|adj|1||Mon frère est grand.|fem=grande;mu=d:grande
gris|adj|1||Le ciel est gris.|fem=grise;mu=s:grise
gros|adj|1||Ce chien est gros.|fem=grosse;mu=s:grosse
heure|nf|1||À quelle heure part l'autobus ?|
heureux|adj|1||Je suis heureux aujourd'hui.|fem=heureuse
histoire|nf|1||Papa me lit une histoire.|
huit|det|1||L'araignée a huit pattes.|
il|pron|1||Il fait beau.|
elle|pron|1||Elle joue au ballon.|
jardin|nm|1||Les tomates poussent dans le jardin.|syl=jar-din;r=in;gr=j.a.r.d.in
jaune|adj|1||Le soleil est jaune.|
je|pron|1||Je lis un livre.|
jeu|nm|1||Ce jeu est amusant.|pl=jeux;gr=j.eu
jeudi|nm|1||Jeudi, j'ai de la musique.|
joie|nf|1||Elle saute de joie.|
joli|adj|1||Ton dessin est joli.|fem=jolie
jouer|v|1||J'aime jouer dehors.|
jour|nm|1||Un jour, je serai grand.|
journée|nf|1||Quelle belle journée !|
lapin|nm|1|🐰|Le lapin mange une carotte.|fem=lapine;syl=la-pin;r=in;gr=l.a.p.in
le|det|1||Le chat dort.|
la|det|1||La lune brille.|
les|det|1||Les enfants jouent dehors.|
lettre|nf|1|✉️|J'écris une lettre à mon ami.|gr=l.e:è.tt.r.e:
lever|v|1||Je dois me lever tôt.|
lire|v|1||J'aime lire dans mon lit.|
lit|nm|1|🛏️|Je dors dans mon lit.|mu=t;syl=lit;r=i;gr=l.i.t:
livre|nm|1|📖|Je lis un livre.|
long|adj|1||Le serpent est long.|fem=longue
loup|nm|1|🐺|Le loup hurle dans la nuit.|fem=louve;mu=p;syl=loup;r=ou;gr=l.ou.p:
lundi|nm|1||Lundi, je retourne à l'école.|
lune|nf|1|🌙|La lune brille la nuit.|gr=l.u.n.e:
main|nf|1|✋|Je lève la main.|syl=main;r=in;gr=m.ain
mais|conj|1||Je veux jouer, mais il pleut.|
maison|nf|1|🏠|Ma maison est bleue.|syl=mai-son;r=on;gr=m.ai.s:z.on
maman|nf|1||Maman prépare le souper.|r=an;gr=m.a.m.an
manger|v|1||J'aime manger des fraises.|
marche|nf|1||On fait une marche dans le parc.|
mardi|nm|1||Mardi, je vais à la piscine.|
matin|nm|1||Ce matin, il neige.|
merci|int|1||Je dis merci à mon ami.|
mercredi|nm|1||Mercredi, on va à la bibliothèque.|
mère|nf|1||Ma mère s'appelle Julie.|gr=m.è.r.e:
midi|nm|1||On mange à midi.|
mon|det|1||Mon chat est noir.|
ma|det|1||Ma sœur est petite.|
mes|det|1||Mes bottes sont mouillées.|
monde|nm|1||Il y a beaucoup de monde au parc.|
montagne|nf|1|⛰️|Nous montons la montagne.|gr=m.on.t.a.gn.e:
mot|nm|1||J'écris un mot.|mu=t
mouton|nm|1|🐑|Le mouton mange de l'herbe.|syl=mou-ton;r=on;gr=m.ou.t.on
musique|nf|1|🎵|J'écoute de la musique.|
neige|nf|1|❄️|La neige tombe doucement.|gr=n.ei.g:j.e:
neuf|det|1||Mon frère a neuf ans.|
nez|nm|1|👃|Le clown a un nez rouge.|gr=n.ez
noir|adj|1||Mon chat est noir.|fem=noire;gr=n.oi.r
nom|nm|1||J'écris mon nom sur ma feuille.|
nous|pron|1||Nous allons au parc.|
nuit|nf|1||La nuit, je dors.|mu=t
œil|nm|1|👁️|J'ai une poussière dans l'œil.|pl=yeux
œuf|nm|1|🥚|La poule pond un œuf.|
oiseau|nm|1|🐦|L'oiseau chante dans l'arbre.|pl=oiseaux;syl=oi-seau;r=o;gr=oi.s:z.eau
on|pron|1||On va jouer dehors.|
oreille|nf|1|👂|Mon chat a une oreille noire.|
ou|conj|1||Veux-tu du lait ou du jus ?|
ouvrir|v|1||Peux-tu ouvrir la porte ?|
page|nf|1||Tourne la page.|
pain|nm|1|🍞|Je mange du pain.|syl=pain;r=in;gr=p.ain
papa|nm|1||Papa lit le journal.|
papier|nm|1||Je dessine sur du papier.|
parler|v|1||J'aime parler avec mon ami.|
pauvre|adj|1||Le pauvre chat a froid.|
pays|nm|1||Le Canada est un grand pays.|
père|nm|1||Mon père est grand.|
personne|nf|1||Une personne attend l'autobus.|
petit|adj|1||Mon frère est petit.|fem=petite;mu=t:petite
phrase|nf|1||J'écris une phrase.|
pied|nm|1|🦶|J'ai mal au pied.|mu=d
place|nf|1||Il reste une place à côté de moi.|
plaisir|nm|1||Je t'aide avec plaisir.|
plein|adj|1||Mon verre est plein.|fem=pleine
pluie|nf|1|🌧️|La pluie tombe sur le toit.|
plus|adv|1||Je veux plus de soupe.|
poisson|nm|1|🐟|Le poisson nage dans l'eau.|syl=pois-son;r=on;gr=p.oi.ss.on
pomme|nf|1|🍎|Je croque une pomme rouge.|gr=p.o.mm.e:
porte|nf|1|🚪|Ferme la porte, s'il te plaît.|
poule|nf|1|🐔|La poule picore du maïs.|gr=p.ou.l.e:
poupée|nf|1||Ma sœur joue avec sa poupée.|
pouvoir|v|1||Je veux pouvoir nager.|
premier|adj|1||C'est mon premier jour d'école.|fem=première
quand|conj|1||Je ris quand tu chantes.|
quatre|det|1||La table a quatre pattes.|
queue|nf|1||Le chien remue la queue.|
qui|pron|1||Qui veut jouer avec moi ?|
regarder|v|1||J'aime regarder les étoiles.|
robe|nf|1|👗|Elle porte une robe verte.|
roi|nm|1||Le roi porte une couronne.|syl=roi;gr=r.oi
rose|adj|1||Ma tuque est rose.|
rouge|adj|1||La fraise est rouge.|
route|nf|1||La route est longue.|
rue|nf|1||J'habite sur cette rue.|
sac|nm|1||Mon sac est lourd.|
samedi|nm|1||Samedi, je joue au soccer.|
sept|det|1||J'ai sept ans.|
six|det|1||Il y a six œufs dans le nid.|
sœur|nf|1||Ma sœur a dix ans.|
soir|nm|1||Le soir, je prends mon bain.|
soleil|nm|1|☀️|Le soleil brille.|syl=so-leil
son|det|1||Il range son sac.|
sa|det|1||Elle prend sa tuque.|
souris|nf|1|🐭|La souris mange du fromage.|mu=s;syl=sou-ris;r=i;gr=s.ou.r.i.s:
table|nf|1||Le souper est sur la table.|
terre|nf|1||Je plante une graine dans la terre.|
tête|nf|1||Je mets ma tuque sur ma tête.|
ton|det|1||Range ton manteau.|
ta|det|1||Où est ta mitaine ?|
tes|det|1||Mets tes bottes.|
train|nm|1|🚂|Le train roule vite.|syl=train;r=in;gr=t.r.ain
trois|det|1||J'ai trois crayons.|gr=t.r.oi.s:
tu|pron|1||Tu es mon ami.|
un|det|1||J'ai un chien.|
une|det|1||J'ai une sœur.|
vélo|nm|1|🚲|Je fais du vélo.|syl=vé-lo;r=o;gr=v.é.l.o
vendredi|nm|1||Vendredi, on mange de la pizza.|
vent|nm|1||Le vent souffle fort.|mu=t
vert|adj|1||Mon chandail est vert.|fem=verte;mu=t:verte
vie|nf|1||La vie est belle.|
ville|nf|1||J'habite dans une grande ville.|
visage|nm|1||Elle a un beau visage.|
voir|v|1||Je vais voir grand-maman.|
voler|v|1||L'oiseau aime voler.|
vouloir|v|1||Tu vas vouloir du gâteau.|
vous|pron|1||Vous êtes gentils.|
aller|v|2||Je vais aller au parc.|
alors|adv|2||Il pleut, alors je joue en dedans.|
amuser|v|2||On va s'amuser au parc.|
an|nm|2||Mon petit frère a un an.|
appeler|v|2||Je vais appeler grand-papa.|
après|adv|2||Après l'école, je joue dehors.|
arrêter|v|2||Il faut arrêter au feu rouge.|
arriver|v|2||L'autobus va arriver.|
attendre|v|2||Je dois attendre mon tour.|
au|det|2||Je vais au parc.|
aujourd'hui|adv|2||Aujourd'hui, il fait beau.|
aussi|adv|2||Moi aussi, j'aime le chocolat.|
auto|nf|2|🚗|L'auto est dans le garage.|syl=au-to;r=o;gr=au.t.o
automne|nm|2|🍂|En automne, les feuilles tombent.|
autour|prep|2||Les enfants dansent autour du sapin.|
autre|adj|2||Je veux une autre pomme.|
avant|prep|2||Je me lave les mains avant le dîner.|
avec|prep|2||Je joue avec mon chien.|
banane|nf|2|🍌|Le singe mange une banane.|
bas|adj|2||Le mur est bas.|fem=basse;mu=s:basse
bois|nm|2||La cabane est en bois.|
bout|nm|2||Je marche jusqu'au bout de la rue.|mu=t
brebis|nf|2||La brebis est la maman de l'agneau.|
bruit|nm|2||Le tonnerre fait du bruit.|mu=t
café|nm|2|☕|Papa boit un café.|syl=ca-fé;gr=c.a.f.é
campagne|nf|2||Mes grands-parents vivent à la campagne.|
canard|nm|2|🦆|Le canard nage sur le lac.|fem=cane;mu=d;syl=ca-nard;r=ar;gr=c.a.n.a.r.d:
carotte|nf|2|🥕|Le lapin croque une carotte.|gr=c.a.r.o.tt.e:
ce|det|2||Ce livre est à moi.|fem=cette
celui|pron|2||Je veux celui-là.|
cent|det|2||Il y a cent pages dans ce livre.|
certains|det|2||Certains enfants aiment les épinards.|
chanson|nf|2|🎶|On chante une chanson.|
chaque|det|2||Je lis chaque soir.|
chez|prep|2||Je vais chez mon ami.|
cinquante|det|2||Il y a cinquante billes dans le pot.|
comme|conj|2||Il court vite comme le vent.|
comment|adv|2||Comment vas-tu ?|
coq|nm|2|🐓|Le coq chante le matin.|gr=c.o.q:k
côté|nm|2||Assieds-toi à côté de moi.|
cour|nf|2||On joue dans la cour d'école.|
cousin|nm|2||Mon cousin vient souper.|fem=cousine
déjà|adv|2||Tu as déjà fini ?|
depuis|prep|2||Il neige depuis ce matin.|
dernier|adj|2||C'est le dernier jour de l'école.|fem=dernière
derrière|prep|2||Le chat se cache derrière l'arbre.|
deuxième|adj|2||Je suis en deuxième année.|
devant|prep|2||L'autobus arrête devant l'école.|
dire|v|2||Je vais dire bonjour.|
donc|conj|2||Il pleut, donc je prends mon parapluie.|
douze|det|2||Il y a douze œufs dans la boîte.|
élève|nmf|2||Chaque élève a un pupitre.|
en|prep|2||Je vais à l'école en autobus.|
encore|adv|2||Je veux encore jouer.|
enfin|adv|2||Enfin, c'est l'été !|
ensuite|adv|2||Je mange, ensuite je brosse mes dents.|
entendre|v|2||J'aime entendre les oiseaux.|
entre|prep|2||Le chat est entre les deux chaises.|
été|nm|2||En été, je me baigne au lac.|
face|nf|2||Le parc est en face de l'école.|
faire|v|2||Je vais faire un gâteau.|
fantôme|nm|2|👻|Le fantôme se cache dans le grenier.|
faux|adj|2||Ce que tu dis est faux.|fem=fausse
fée|nf|2|🧚|La fée a une baguette magique.|syl=fée;gr=f.é.e:
femme|nf|2||Cette femme est ma tante.|
figure|nf|2||Le carré est une figure.|
fils|nm|2||Le fils de ma tante est mon cousin.|
fort|adj|2||Mon papa est fort.|fem=forte;mu=t:forte
froid|adj|2||Il fait froid ce matin.|fem=froide;mu=d:froide
fruit|nm|2||La pomme est un fruit.|mu=t
grand-maman|nf|2||Ma grand-maman fait des tartes.|
grand-mère|nf|2||Ma grand-mère habite à Gaspé.|
grand-papa|nm|2||Mon grand-papa a une barbe.|
grand-père|nm|2||Mon grand-père aime pêcher.|
haut|adj|2||L'arbre est très haut.|fem=haute;mu=t:haute
hiver|nm|2|☃️|En hiver, je glisse en traîneau.|gr=h:.i.v.e:è.r
homme|nm|2||Cet homme conduit l'autobus.|
ici|adv|2||Viens ici !|
idée|nf|2|💡|J'ai une bonne idée !|
image|nf|2||Regarde cette belle image.|
jamais|adv|2||Je ne mange jamais de piment.|
joyeux|adj|2||Joyeux anniversaire !|fem=joyeuse
jument|nf|2||La jument court avec son poulain.|mu=t
là|adv|2||Mon chat est là.|
laid|adj|2||Ce monstre est laid.|fem=laide;mu=d:laide
large|adj|2||La rivière est large.|
leçon|nf|2||J'apprends ma leçon.|
lecture|nf|2||J'aime l'heure de la lecture.|
légume|nm|2||La carotte est un légume.|
leur|det|2||Les enfants rangent leur chambre.|
loin|adv|2||La lune est loin.|
lorsque|conj|2||Je souris lorsque tu chantes.|
madame|nf|2||Bonjour, madame Tremblay !|
maintenant|adv|2||Range ta chambre maintenant.|
mal|nm|2||J'ai mal au ventre.|pl=maux
malade|adj|2||Je suis malade, je reste au lit.|
marier|v|2||Ma tante va se marier.|
me|pron|2||Mon chien me suit partout.|
même|adj|2||Nous avons le même chandail.|
mettre|v|2||Je vais mettre ma tuque.|
mieux|adv|2||Je me sens mieux.|
moi|pron|2||Viens avec moi.|
moins|adv|2||J'ai moins de billes que toi.|
moment|nm|2||Attends un moment.|
monsieur|nm|2||Bonjour, monsieur !|
monstre|nm|2||Le monstre de mon histoire est gentil.|
monter|v|2||Je vais monter l'escalier.|
nature|nf|2||J'aime marcher dans la nature.|
ni|conj|2||Il n'a ni chat ni chien.|
non|adv|2||Non, merci.|
notre|det|2||Notre maison est jaune.|
nos|det|2||Nos amis arrivent.|
nouveau|adj|2||J'ai un nouveau sac.|fem=nouvelle;pl=nouveaux
oncle|nm|2||Mon oncle a un camion.|
onze|det|2||Mon frère a onze ans.|
orange|nf|2|🍊|Je mange une orange.|gr=o.r.an.g:j.e:
oui|adv|2||Oui, je veux jouer !|
paire|nf|2||J'ai une nouvelle paire de bottes.|
par|prep|2||Le chat entre par la fenêtre.|
parce que|conj|2||Je reste au lit parce que je suis malade.|
parent|nm|2||Chaque parent vient au spectacle.|mu=t
parfois|adv|2||Parfois, je vais à la piscine.|
partout|adv|2||Il y a de la neige partout.|
pas|adv|2||Je ne dors pas.|
passer|v|2||Je vais passer chez toi.|
patate|nf|2|🥔|Je mange une patate au four.|
patte|nf|2||Le chien me donne la patte.|
peau|nf|2||Le soleil chauffe ma peau.|
peine|nf|2||J'ai de la peine quand mon ami part.|
pendant|prep|2||Je lis pendant le voyage.|
penser|v|2||Je vais penser à toi.|
peu|adv|2||Il reste un peu de lait.|
peur|nf|2||J'ai peur du noir.|
peut-être|adv|2||Il va peut-être neiger.|
porc|nm|2||Le porc vit à la ferme.|mu=c
pour|prep|2||Ce cadeau est pour toi.|
pourquoi|adv|2||Pourquoi le ciel est-il bleu ?|
prendre|v|2||Je vais prendre l'autobus.|
près|prep|2||J'habite près de l'école.|
prince|nm|2|🤴|Le prince monte à cheval.|fem=princesse
printemps|nm|2|🌷|Au printemps, la neige fond.|
propre|adj|2||Mon chandail est propre.|
puis|adv|2||Je mange, puis je joue.|
quarante|det|2||Il y a quarante élèves dans le gymnase.|
quatorze|det|2||Ma sœur a quatorze ans.|
que|conj|2||Je pense que tu as raison.|
quelque|det|2||Il y a quelque chose sous le lit.|
quinze|det|2||Mon cousin a quinze ans.|
reine|nf|2|👸|La reine porte une couronne.|
répondre|v|2||Je lève la main pour répondre.|
rester|v|2||Je veux rester ici.|
sage|adj|2||Le chien est sage.|
sans|prep|2||Je sors sans ma tuque.|
savoir|v|2||Je veux savoir lire.|
se|pron|2||Le chat se lave.|
seize|det|2||Ma cousine a seize ans.|
semaine|nf|2||Il y a sept jours dans une semaine.|
seul|adj|2||Je suis seul dans ma chambre.|fem=seule
si|conj|2||Si tu veux, on joue dehors.|
soixante|det|2||Il y a soixante minutes dans une heure.|
sortir|v|2||Je vais sortir dehors.|
sous|prep|2||Le chat dort sous la table.|
souvent|adv|2||Je joue souvent au parc.|
suivre|v|2||Je vais suivre mon frère.|
sur|prep|2||Le livre est sur la table.|
surtout|adv|2||J'aime les fruits, surtout les fraises.|
tableau|nm|2||L'enseignante écrit au tableau.|pl=tableaux
tant|adv|2||Je t'aime tant !|
tante|nf|2||Ma tante habite à Montréal.|
tard|adv|2||Il est tard, je vais au lit.|
te|pron|2||Je te donne un bonbon.|
tellement|adv|2||Je suis tellement content !|
temps|nm|2||Quel temps fait-il ?|
toi|pron|2||Ce cadeau est pour toi.|
tomber|v|2||Attention, tu vas tomber !|
toujours|adv|2||Je dis toujours merci.|
tourner|v|2||Il faut tourner à droite.|
tout|det|2||J'ai mangé tout le gâteau.|fem=toute
treize|det|2||Il y a treize billes dans mon sac.|
trente|det|2||Il y a trente jours en novembre.|
très|adv|2||Il fait très froid.|
trop|adv|2||Ma soupe est trop chaude.|
trouver|v|2||Je vais trouver mon ballon.|
truie|nf|2||La truie roule dans la boue.|
venir|v|2||Peux-tu venir chez moi ?|
vers|prep|2||L'oiseau vole vers son nid.|
vieux|adj|2||Mon grand-papa a un vieux camion.|fem=vieille
vingt|det|2||J'ai vingt billes.|
vite|adv|2||Le lièvre court vite.|
voici|prep|2||Voici mon chien.|
voilà|prep|2||Voilà ton sac !|
voix|nf|2||Elle a une belle voix.|
votre|det|2||Votre maison est belle.|
vos|det|2||Mettez vos bottes.|
vrai|adj|2||C'est vrai !|fem=vraie
vraiment|adv|2||Ce film est vraiment drôle.|
y|pron|2||J'y vais demain.|
zéro|det|2||J'ai fait zéro faute !|
éléphant|nm|0|🐘|L'éléphant a une longue trompe.|syl=é-lé-phant;r=an;gr=é.l.é.ph.an.t:
chocolat|nm|0|🍫|J'aime le chocolat chaud.|syl=cho-co-lat;r=a;gr=ch.o.c.o.l.a.t:
gâteau|nm|0|🎂|Maman fait un gâteau.|pl=gâteaux;syl=gâ-teau;r=o;gr=g.â.t.eau
bateau|nm|0|⛵|Le bateau flotte sur le lac.|pl=bateaux;syl=ba-teau;r=o;gr=b.a.t.eau
cadeau|nm|0|🎁|J'ouvre mon cadeau.|pl=cadeaux;syl=ca-deau;r=o;gr=c.a.d.eau
chameau|nm|0|🐫|Le chameau marche dans le désert.|pl=chameaux;syl=cha-meau;r=o;gr=ch.a.m.eau
moto|nf|0|🏍️|La moto fait du bruit.|syl=mo-to;r=o;gr=m.o.t.o
robot|nm|0|🤖|Mon robot danse.|syl=ro-bot;r=o;gr=r.o.b.o.t:
escargot|nm|0|🐌|L'escargot avance lentement.|syl=es-car-got;r=o;gr=e:è.s.c.a.r.g.o.t:
ballon|nm|0|🎈|Mon ballon est rouge.|syl=bal-lon;r=on;gr=b.a.ll.on
savon|nm|0|🧼|Je me lave avec du savon.|syl=sa-von;r=on;gr=s.a.v.on
cochon|nm|0|🐷|Le cochon est tout rose.|syl=co-chon;r=on;gr=c.o.ch.on
citron|nm|0|🍋|Le citron est jaune.|syl=ci-tron;r=on;gr=c:s.i.t.r.on
papillon|nm|0|🦋|Le papillon vole dans le jardin.|syl=pa-pi-llon;r=on;gr=p.a.p.ill.on
champignon|nm|0|🍄|Je trouve un champignon dans la forêt.|syl=cham-pi-gnon;r=on;gr=ch.am:an.p.i.gn.on
sapin|nm|0|🎄|Le sapin est vert.|syl=sa-pin;r=in;gr=s.a.p.in
dauphin|nm|0|🐬|Le dauphin saute hors de l'eau.|syl=dau-phin;r=in;gr=d.au.ph.in
hibou|nm|0|🦉|Le hibou voit la nuit.|syl=hi-bou;r=ou;gr=h:.i.b.ou
kangourou|nm|0|🦘|Le kangourou saute très haut.|syl=kan-gou-rou;r=ou;gr=k.an.g.ou.r.ou
panda|nm|0|🐼|Le panda mange du bambou.|syl=pan-da;r=a;gr=p.an.d.a
koala|nm|0|🐨|Le koala dort dans l'arbre.|syl=ko-a-la;r=a;gr=k.o.a.l.a
pyjama|nm|0||Je mets mon pyjama.|
fourmi|nf|0|🐜|La fourmi transporte une miette.|syl=four-mi;r=i;gr=f.ou.r.m.i
kiwi|nm|0|🥝|Le kiwi est vert à l'intérieur.|syl=ki-wi;r=i;gr=k.i.w.i
tracteur|nm|0|🚜|Le tracteur roule dans le champ.|syl=trac-teur;r=eur;gr=t.r.a.c.t.eu.r
ordinateur|nm|0|💻|Papa travaille à l'ordinateur.|syl=or-di-na-teur;r=eur;gr=o.r.d.i.n.a.t.eu.r
tortue|nf|0|🐢|La tortue avance lentement.|syl=tor-tue;gr=t.o.r.t.u.e:
fusée|nf|0|🚀|La fusée part vers la lune.|syl=fu-sée;gr=f.u.s:z.é.e:
zèbre|nm|0|🦓|Le zèbre a des rayures.|gr=z.è.b.r.e:
serpent|nm|0|🐍|Le serpent glisse dans l'herbe.|syl=ser-pent;r=an;gr=s.e:è.r.p.en.t:
girafe|nf|0|🦒|La girafe a un long cou.|gr=g:j.i.r.a.f.e:
vache|nf|0|🐄|La vache donne du lait.|gr=v.a.ch.e:
chaise|nf|0|🪑|Je m'assois sur ma chaise.|gr=ch.ai.s:z.e:
fraise|nf|0|🍓|La fraise est rouge.|gr=f.r.ai.s:z.e:
lait|nm|0|🥛|Je bois un verre de lait.|mu=t:laitier;gr=l.ai.t:
poire|nf|0|🍐|La poire est mûre.|gr=p.oi.r.e:
étoile|nf|0|⭐|Une étoile brille dans le ciel.|gr=é.t.oi.l.e:
bougie|nf|0|🕯️|J'éteins la bougie.|gr=b.ou.g:j.i.e:
citrouille|nf|0|🎃|On creuse une citrouille.|gr=c:s.i.t.r.ou.ill.e:
grenouille|nf|0|🐸|La grenouille saute dans l'étang.|gr=g.r.e.n.ou.ill.e:
araignée|nf|0|🕷️|L'araignée tisse sa toile.|syl=a-rai-gnée;gr=a.r.ai.gn.é.e:
cygne|nm|0|🦢|Le cygne nage sur le lac.|gr=c:s.y:i.gn.e:
nid|nm|0|🪺|L'oiseau construit son nid.|mu=d;gr=n.i.d:
tomate|nf|0|🍅|La tomate pousse dans le jardin.|gr=t.o.m.a.t.e:
ananas|nm|0|🍍|L'ananas est sucré.|
pingouin|nm|0|🐧|Le pingouin glisse sur la glace.|
castor|nm|0|🦫|Le castor construit un barrage.|syl=cas-tor;gr=c.a.s.t.o.r
renard|nm|0|🦊|Le renard a une longue queue.|mu=d;syl=re-nard;r=ar;gr=r.e.n.a.r.d:
mouche|nf|0|🪰|La mouche vole autour de moi.|gr=m.ou.ch.e:
jupe|nf|0||Sa jupe est bleue.|
`;

  const CLS: Record<FrClasseCode, FrClasse> = {
    nm: 'nom',
    nf: 'nom',
    nmf: 'nom',
    adj: 'adj',
    v: 'verbe',
    det: 'det',
    pron: 'pron',
    adv: 'adv',
    prep: 'prep',
    conj: 'conj',
    int: 'int',
  };
  const SND: Record<string, string> = {
    a: 'a',
    à: 'a',
    â: 'a',
    e: 'e',
    é: 'é',
    è: 'è',
    ê: 'è',
    ai: 'è',
    ei: 'è',
    er: 'é',
    ez: 'é',
    i: 'i',
    y: 'i',
    î: 'i',
    o: 'o',
    ô: 'o',
    au: 'o',
    eau: 'o',
    u: 'u',
    ou: 'ou',
    oi: 'oi',
    on: 'on',
    om: 'on',
    an: 'an',
    am: 'an',
    en: 'an',
    em: 'an',
    in: 'in',
    im: 'in',
    ain: 'in',
    ein: 'in',
    eu: 'eu',
    œu: 'eu',
    ch: 'ch',
    gn: 'gn',
    ill: 'ill',
    c: 'k',
    k: 'k',
    qu: 'k',
    q: 'k',
    ç: 's',
    s: 's',
    ss: 's',
    ph: 'f',
    f: 'f',
    g: 'g',
    gu: 'g',
    j: 'j',
    z: 'z',
    h: '',
    b: 'b',
    d: 'd',
    l: 'l',
    ll: 'l',
    m: 'm',
    mm: 'm',
    n: 'n',
    p: 'p',
    r: 'r',
    t: 't',
    tt: 't',
    v: 'v',
    w: 'w',
  };
  const isCode = (x: string): x is FrClasseCode => Object.prototype.hasOwnProperty.call(CLS, x);
  const parse = (line: string): FrMot => {
    const [w, cls, lo, em, phrase, extra] = line.split('|');
    if (!isCode(cls)) throw new Error('mots.js : classe inconnue « ' + cls + ' » (' + w + ')');
    const o: FrMot = { w, c: cls, cls: CLS[cls], lo: Number(lo), phrase };
    if (cls === 'nm') o.g = 'm';
    if (cls === 'nf') o.g = 'f';
    if (cls === 'nmf') o.g = 'mf';
    if (em) o.em = em;
    (extra || '')
      .split(';')
      .filter(Boolean)
      .forEach((kv) => {
        const k = kv.slice(0, kv.indexOf('=')),
          v = kv.slice(kv.indexOf('=') + 1);
        if (k === 'syl') o.syl = v.split('-');
        else if (k === 'gr')
          o.gr = v.split('.').map((p) => {
            const [g, s] = p.split(':');
            return { g, s: s === undefined ? (SND[g] ?? g) : s };
          });
        else if (k === 'mu') {
          const [l, why] = v.split(':');
          o.mu = l;
          if (why) o.why = why;
        } else if (k === 'fem' || k === 'pl' || k === 'r') o[k] = v;
      });
    return o;
  };
  const MOTS = RAW.trim()
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map(parse);
  M.FR.MOTS = MOTS;
  M.FR.SND = SND;
  M.FR.mot = (w) => MOTS.find((m) => m.w === w);
  M.registerData('fr.mots', MOTS);
})();
