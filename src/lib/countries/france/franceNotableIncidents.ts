import type { NotableIncident } from '../../../components/countries/germany/GermanyCrimeVictimsNotableIncidents';

/**
 * France — notable reported incidents (real, named cases with public court records
 * or major-outlet coverage). Ranked roughly by casualty count and national impact.
 * "OQTF" = obligation de quitter le territoire français (French deportation order).
 */
export const FRANCE_NOTABLE_INCIDENTS: readonly NotableIncident[] = [
  {
    id: 'paris-november-2015',
    rank: 1,
    year: '2015',
    location: 'Paris & Saint-Denis (13 November)',
    dateDetail: 'Evening of 13 November 2015',
    locationDetail: 'Bataclan concert hall, Stade de France, and bars/restaurants in the 10th and 11th arrondissements',
    description: 'Coordinated ISIS attacks killed 130 people and wounded more than 400 across Paris.',
    expandedOverview:
      'Three coordinated teams of Islamic State attackers struck Paris on the evening of 13 November 2015: suicide bombers at the Stade de France, gun attacks on bars and restaurants in the 10th and 11th arrondissements, and a mass shooting and hostage siege at the Bataclan concert hall, where 90 people died. In total 130 people were killed and more than 400 injured — the deadliest attack on French soil since the Second World War. Two of the attackers had entered Europe through the Greek island of Leros in October 2015 alongside migrant arrivals, using forged Syrian passports; the rest were French and Belgian nationals who had travelled to Syria.',
    perpetrators:
      'Islamic State cell of French and Belgian nationals; two members entered via the Greek islands in October 2015 on forged Syrian passports.',
    victims: '130 killed, 400+ injured.',
    outcome:
      'The V13 trial ended on 29 June 2022 with all 20 defendants convicted; sole surviving attacker Salah Abdeslam received life without parole.',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/November_2015_Paris_attacks' },
      { label: 'BBC', url: 'https://www.bbc.com/news/world-europe-61947254' },
    ],
    image: {
      src: '/incidents/paris-november-2015.jpg',
      alt: 'The Bataclan concert hall in Paris',
      credit: 'Bataclan concert hall — Chabe01, CC BY-SA 4.0 / Wikimedia Commons',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Salle_Spectacle_Bataclan_-_Paris_XI_(FR75)_-_2022-01-28_-_3.jpg',
    },
  },
  {
    id: 'nice-truck-2016',
    rank: 2,
    year: '2016',
    location: 'Nice (Bastille Day)',
    dateDetail: '14 July 2016',
    locationDetail: 'Promenade des Anglais, Nice — Bastille Day fireworks crowd',
    description: '19-tonne truck driven into a Bastille Day crowd; 86 killed, including 15 children.',
    expandedOverview:
      'On Bastille Day 2016 a 19-tonne cargo truck was deliberately driven for almost two kilometres into the crowd watching fireworks on the Promenade des Anglais in Nice. 86 people were killed, among them 15 children, and more than 450 were injured. The driver was shot dead by police at the scene. The Islamic State claimed the attack, and it directly triggered the extension of France’s state of emergency.',
    perpetrators:
      'Mohamed Lahouaiej-Bouhlel, 31, a Tunisian national resident in France; shot dead at the scene.',
    victims: '86 killed (including 15 children), 450+ injured.',
    outcome:
      'Eight accomplices were convicted in December 2022 on weapons and terrorist-conspiracy charges, with sentences up to 18 years.',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/2016_Nice_truck_attack' },
      { label: 'BBC', url: 'https://www.bbc.com/news/world-europe-63955246' },
    ],
    image: {
      src: '/incidents/nice-truck-2016.png',
      alt: 'The Promenade des Anglais seafront in Nice',
      credit: 'Promenade des Anglais, Nice — 3602kiva, CC0 / Wikimedia Commons',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:CollineDuChateau_NiceFrance2022.png',
    },
  },
  {
    id: 'charlie-hebdo-2015',
    rank: 3,
    year: '2015',
    location: 'Paris (Charlie Hebdo & Hypercacher)',
    dateDetail: '7–9 January 2015',
    locationDetail: 'Charlie Hebdo offices (11th arr.), Montrouge, and the Hypercacher kosher supermarket at Porte de Vincennes',
    description: 'Three days of attacks on a satirical magazine, a policewoman, and a kosher supermarket; 17 killed.',
    expandedOverview:
      'On 7 January 2015 brothers Saïd and Chérif Kouachi stormed the Paris offices of the satirical weekly Charlie Hebdo and shot dead 12 people, including much of the editorial staff, in retaliation for the magazine’s cartoons of the Prophet Muhammad. Over the following two days an associate, Amedy Coulibaly, killed a municipal police officer in Montrouge and then four Jewish hostages at the Hypercacher kosher supermarket at Porte de Vincennes. All three attackers were killed by police. Seventeen victims died in total.',
    perpetrators:
      'Saïd and Chérif Kouachi (French-born, Algerian descent, linked to AQAP) and Amedy Coulibaly (French, Malian descent, pledged to ISIS); all three killed by police.',
    victims: '17 killed — 12 at Charlie Hebdo, one police officer, four hostages at the Hypercacher.',
    outcome:
      'In December 2020 a Paris court convicted all 14 defendants accused of supplying weapons and logistics to the attackers.',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Charlie_Hebdo_shooting' },
      { label: 'BBC', url: 'https://www.bbc.com/news/world-europe-55329134' },
    ],
    image: {
      src: '/incidents/charlie-hebdo-2015.jpg',
      alt: 'Place de la République in Paris, focal point of the post-attack gatherings',
      credit: 'Place de la République, Paris — Britchi Mirela, CC BY-SA 3.0 / Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Place_de_la_Republique,_Monument_for_Gloire_de_la_Republique_Francaise_(2).JPG',
    },
  },
  {
    id: 'samuel-paty-2020',
    rank: 4,
    year: '2020',
    location: 'Conflans-Sainte-Honorine',
    dateDetail: '16 October 2020',
    locationDetail: 'Street near the Collège du Bois d’Aulne, Conflans-Sainte-Honorine (Yvelines)',
    description: 'Teacher Samuel Paty beheaded in the street after showing Muhammad cartoons in a civics class.',
    expandedOverview:
      'Samuel Paty, a 47-year-old history and civics teacher, was beheaded in the street near his school in Conflans-Sainte-Honorine after showing Charlie Hebdo cartoons of the Prophet Muhammad during a lesson on freedom of expression. The attack followed an online hate campaign launched by the father of a pupil — based on a claim the pupil later admitted was false — and amplified by an Islamist activist. The killer was shot dead by police shortly afterwards.',
    perpetrators:
      'Abdoullakh Anzorov, 18, a Chechen-origin refugee born in Moscow who had been granted refugee status in France; shot dead by police.',
    victims: 'Samuel Paty, 47 — schoolteacher.',
    outcome:
      'On 20 December 2024 eight people were convicted over the hate campaign and logistical support, with sentences from one to 16 years; an appeal trial opened in January 2026.',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Murder_of_Samuel_Paty' },
      { label: 'France 24', url: 'https://www.france24.com/en/france/20241220-paris-court-convicts-8-in-connection-with-beheading-of-teacher-samuel-paty' },
    ],
  },
  {
    id: 'lola-daviet-2022',
    rank: 5,
    year: '2022',
    location: 'Paris (19th arr.)',
    dateDetail: '14 October 2022',
    locationDetail: 'Apartment building on rue Manin, Paris 19th arrondissement — body left in a plastic trunk in the inner courtyard',
    description: '12-year-old Lola Daviet raped, tortured and murdered; body left in a box outside her home.',
    expandedOverview:
      'Twelve-year-old Lola Daviet was lured into an apartment in her own building on her way home from school, forced to shower, then raped, tortured and killed. Her mutilated body was hidden in a plastic storage box and left in a communal area outside the building where her parents worked as caretakers; she was found within hours of being reported missing. The killer was an Algerian national living in France under an OQTF deportation order that had never been enforced, and the case became the reference point in French debate over the non-execution of deportation orders.',
    perpetrators:
      'Dahbia Benkired, 24 at the time, an Algerian national subject to an unenforced OQTF deportation order.',
    victims: 'Lola Daviet, 12.',
    outcome:
      'On 24 October 2025 the Paris Assize Court imposed life without parole (perpétuité incompressible, minimum 30 years) — the first such sentence given to a woman in France.',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Murder_of_Lola_Daviet' },
      { label: 'BBC', url: 'https://www.bbc.com/news/articles/cjr07wqeerwo' },
      { label: 'CNN', url: 'https://www.cnn.com/2025/10/24/europe/dahbia-benkired-sentencing-murder-france-latam-intl' },
    ],
  },
  {
    id: 'nice-basilica-2020',
    rank: 6,
    year: '2020',
    location: 'Nice (Notre-Dame basilica)',
    dateDetail: '29 October 2020',
    locationDetail: 'Basilica of Notre-Dame de l’Assomption, avenue Jean-Médecin, Nice',
    description: 'Three worshippers stabbed to death in a basilica by a Tunisian who had landed at Lampedusa weeks earlier.',
    expandedOverview:
      'A Tunisian man stabbed three people to death inside the Notre-Dame basilica in Nice: church worker Vincent Loquès, 55, and worshippers Nadine Vincent, 60, and Simone Barreto Silva, 44, a French-Brazilian mother of three who died after fleeing to a nearby café. The attacker had arrived irregularly at Lampedusa in September 2020, was released with an order to leave Italy, and reached France within weeks. He was shot and wounded by police at the scene.',
    perpetrators:
      'Brahim Aouissaoui, Tunisian national who arrived via Lampedusa in September 2020 after being released with an order to leave Italy.',
    victims: 'Three killed: Vincent Loquès (55), Nadine Vincent (60), Simone Barreto Silva (44).',
    outcome:
      'Sentenced on 26 February 2025 by the Paris special assize court to life imprisonment without parole — the heaviest penalty in the French code. He has appealed.',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/2020_Nice_stabbing' },
      { label: 'France 24', url: 'https://www.france24.com/en/europe/20250226-french-court-hands-life-sentence-tunisian-national-nice-church-attack' },
    ],
    image: {
      src: '/incidents/nice-basilica-2020.jpg',
      alt: 'The Notre-Dame basilica in Nice',
      credit: 'Notre-Dame basilica, Nice — Teresa Grau Ros, CC BY-SA 2.0 / Wikimedia Commons',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Notre-Dame_de_Nice_PC250048_(50551243457).jpg',
    },
  },
  {
    id: 'philippine-2024',
    rank: 7,
    year: '2024',
    location: 'Paris (Bois de Boulogne)',
    dateDetail: 'Body discovered 21 September 2024',
    locationDetail: 'Bois de Boulogne, Paris — buried in woodland near the Université Paris-Dauphine',
    description: '19-year-old student raped and asphyxiated by a Moroccan under an OQTF, already convicted of rape.',
    expandedOverview:
      'The body of Philippine Le Noir de Carlan, a 19-year-old Paris-Dauphine student, was found buried in the Bois de Boulogne on 21 September 2024; she had been raped and died of asphyxiation. The prime suspect, a 22-year-old Moroccan national under an OQTF deportation order, had already been convicted of raping a student in Val-d’Oise and had been released from prison shortly before the killing, then briefly held in a detention centre and freed when the detention could not be extended. He fled to Switzerland, was arrested there on 24 September 2024 and extradited. The case drove the national argument over deporting foreign nationals convicted of sexual offences.',
    perpetrators:
      'Taha Oualidat, 22, Moroccan national under an OQTF, previously convicted of the rape of a student in Val-d’Oise.',
    victims: 'Philippine Le Noir de Carlan, 19 — university student.',
    outcome:
      'Extradited from Switzerland and charged with rape and murder. A 2025 psychiatric assessment found him fully criminally responsible, describing characterised psychopathy; trial pending.',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Murder_of_Philippine_Le_Noir_de_Carlan' },
      { label: 'Wikipédia (FR)', url: 'https://fr.wikipedia.org/wiki/Meurtre_de_Philippine_Le_Noir_de_Carlan' },
    ],
    image: {
      src: '/incidents/philippine-2024.jpg',
      alt: 'The Bois de Boulogne in Paris',
      credit: 'Bois de Boulogne, Paris — Guilhem Vellut, CC BY 2.0 / Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:La_D%C3%A9fense_and_Bois_de_Boulogne_from_the_Eiffel_Tower,_11_June_2017_001.jpg',
    },
  },
  {
    id: 'arras-2023',
    rank: 8,
    year: '2023',
    location: 'Arras (Lycée Gambetta)',
    dateDetail: '13 October 2023',
    locationDetail: 'Cité scolaire Gambetta-Carnot, Arras (Pas-de-Calais)',
    description: 'French teacher Dominique Bernard stabbed to death inside his school; three staff wounded.',
    expandedOverview:
      'Dominique Bernard, a French literature teacher, was fatally stabbed in the throat and chest inside the Gambetta-Carnot school complex in Arras while placing himself between the attacker and his students. Three other staff members were wounded — a PE teacher, a security guard and a maintenance worker. The attacker, a former pupil of the school from a family of Ingush origin known to intelligence services, invoked the Islamic State and cited the 7 October 2023 attacks in a video recorded beforehand. France raised its security posture to the highest level and deployed 7,000 soldiers in response.',
    perpetrators:
      'Mohammed Mogouchkov, 20, of Ingush origin, from a family known to counter-terrorism services; arrested at the scene.',
    victims: 'Dominique Bernard, 57 — teacher, killed. Three school staff wounded.',
    outcome:
      'In June 2026 the national counter-terrorism prosecutor requested that Mogouchkov, his younger brother and his cousin be sent for trial before the juvenile assize court; the trial is expected around late 2027.',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/2023_Arras_school_stabbing' },
      { label: 'Franceinfo', url: 'https://www.franceinfo.fr/faits-divers/attaque-au-couteau-dans-un-lycee-a-arras/assassinat-du-professeur-de-francais-dominique-bernard-un-proces-est-requis-pour-le-principal-suspect-son-frere-et-son-cousin_8075711.html' },
    ],
  },
  {
    id: 'crepol-2023',
    rank: 9,
    year: '2023',
    location: 'Crépol (Drôme)',
    dateDetail: 'Night of 18–19 November 2023',
    locationDetail: 'Village hall "bal de l’hiver", Crépol, Drôme',
    description: '16-year-old Thomas Perotto stabbed to death at a village dance attacked by a group from a Romans-sur-Isère estate.',
    expandedOverview:
      'A group of young men from the La Monnaie estate in Romans-sur-Isère arrived at the winter ball in the village of Crépol and a mass brawl broke out, in which knives were used. Thomas Perotto, a 16-year-old rugby player, was stabbed in the chest and died; around a dozen others were injured, several seriously. The case became a national flashpoint over youth violence and rural-versus-banlieue confrontation, and drew both far-right mobilisation and warnings from prosecutors against unverified claims about the attack.',
    perpetrators:
      'A group from the La Monnaie estate in Romans-sur-Isère; 14 suspects were placed under investigation.',
    victims: 'Thomas Perotto, 16 — killed. Around a dozen others injured, several seriously.',
    outcome:
      'On 11 June 2026 the Valence prosecutor sought the referral of 11 accused to the juvenile assize court for voluntary homicide, attempted homicide and violence; the organised-gang aggravating circumstance was dropped and the fatal blow has never been formally attributed.',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Death_of_Thomas_Perotto' },
      { label: 'Le JDD', url: 'https://www.lejdd.fr/Societe/meurtre-de-thomas-a-crepol-le-parquet-requiert-le-renvoi-de-onze-accuses-aux-assises-176247' },
    ],
  },
  {
    id: 'sarah-halimi-2017',
    rank: 10,
    year: '2017',
    location: 'Paris (11th arr.)',
    dateDetail: '4 April 2017',
    locationDetail: 'Apartment on rue de Vaucouleurs, Paris 11th arrondissement',
    description: 'Jewish retiree beaten and thrown from her window by a neighbour shouting "Allahu Akbar".',
    expandedOverview:
      'Sarah Halimi, a 65-year-old Orthodox Jewish retired doctor and kindergarten director, was beaten in her Paris apartment and thrown from her third-floor window by a neighbour who shouted "Allahu Akbar" and called her a demon. Courts recognised an antisemitic motive, but found the perpetrator had suffered an acute delirium brought on by heavy cannabis use and was therefore not criminally responsible — a ruling upheld by the Cour de cassation in April 2021 that provoked large protests and led Parliament to change the law on self-induced intoxication.',
    perpetrators:
      'Kobili Traoré, a neighbour of Malian origin; found to have acted during a cannabis-induced delirium.',
    victims: 'Sarah Halimi, 65 — retired doctor.',
    outcome:
      'The Cour de cassation confirmed in April 2021 that he could not stand trial due to abolished discernment; he was committed to psychiatric care. France amended its criminal-responsibility law in January 2022 in direct response.',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Killing_of_Sarah_Halimi' },
      { label: 'BBC', url: 'https://www.bbc.com/news/world-europe-56770622' },
    ],
  },
  {
    id: 'marseille-saint-charles-2017',
    rank: 11,
    year: '2017',
    location: 'Marseille (Saint-Charles station)',
    dateDetail: '1 October 2017',
    locationDetail: 'Forecourt of Marseille Saint-Charles railway station',
    description: 'Two 20-year-old cousins stabbed to death at a train station by a Tunisian released from custody the day before.',
    expandedOverview:
      'Two cousins aged 20, Laura Paumier and Mauranne Harel, were stabbed to death outside Marseille’s Saint-Charles station; one was stabbed in the throat, the other in the abdomen. The attacker shouted "Allahu Akbar" and was shot dead by a soldier on Opération Sentinelle patrol. He was an irregular Tunisian migrant who had used at least seven aliases across France and had been arrested for shoplifting in Lyon two days earlier and released the day before the attack, exposing failures in identification and removal procedures.',
    perpetrators:
      'Ahmed Hanachi, Tunisian national living irregularly in France under multiple aliases; released from police custody in Lyon the previous day and shot dead at the scene.',
    victims: 'Laura Paumier and Mauranne Harel, both 20.',
    outcome:
      'The attacker was killed at the scene; the case prompted an inquiry into why a repeatedly identified irregular migrant had never been removed.',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/2017_Marseille_stabbing' },
      { label: 'BBC', url: 'https://www.bbc.com/news/world-europe-41465755' },
    ],
    image: {
      src: '/incidents/marseille-saint-charles-2017.jpg',
      alt: 'The façade of Marseille Saint-Charles station',
      credit: 'Marseille Saint-Charles station — Raimond Spekking, CC BY-SA 4.0 / Wikimedia Commons',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Fa%C3%A7ade_de_la_gare_de_Marseille-Saint-Charles-7689.jpg',
    },
  },
  {
    id: 'mireille-knoll-2018',
    rank: 12,
    year: '2018',
    location: 'Paris (11th arr.)',
    dateDetail: '23 March 2018',
    locationDetail: 'Social-housing flat, avenue Philippe-Auguste, Paris 11th arrondissement',
    description: '85-year-old Holocaust survivor stabbed 11 times and her flat set alight; antisemitic aggravation retained.',
    expandedOverview:
      'Mireille Knoll, an 85-year-old Holocaust survivor who as a child escaped the 1942 Vél d’Hiv roundup, was stabbed 11 times in her Paris flat, which was then set on fire. The killing came less than a year after the murder of Sarah Halimi and prompted a national silent march. The court found the attack began as a robbery driven by prejudice about supposed Jewish wealth and retained the antisemitic aggravating circumstance.',
    perpetrators:
      'Yacine Mihoub, a neighbour she had known since he was a child, and accomplice Alex Carrimbacus.',
    victims: 'Mireille Knoll, 85 — Holocaust survivor.',
    outcome:
      'In November 2021 Mihoub received life with a 22-year minimum term; Carrimbacus was acquitted of murder but convicted of theft with an antisemitic motive and sentenced to 15 years.',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Murder_of_Mireille_Knoll' },
      { label: 'Euronews', url: 'https://www.euronews.com/2021/11/11/life-sentence-for-anti-semitic-murder-of-mireille-knoll-85-in-paris' },
    ],
  },
  {
    id: 'mulhouse-2025',
    rank: 13,
    year: '2025',
    location: 'Mulhouse (Haut-Rhin)',
    dateDetail: '22 February 2025',
    locationDetail: 'Market in central Mulhouse, during a rally for the Democratic Republic of the Congo',
    description: 'Passer-by killed and police wounded by an Algerian on a terror watchlist whom France had tried to deport ten times.',
    expandedOverview:
      'A man armed with a knife and a screwdriver attacked municipal police officers at a market in Mulhouse, shouting "Allahu Akbar", seriously wounding two of them. A 69-year-old Portuguese resident of Mulhouse, Lino Sousa Loureiro, who had lived in the city since 1992, intervened to protect the officers and was stabbed to death. The attacker was a 37-year-old Algerian national who had already served a prison term for a terrorist offence, was on the FSPRT radicalisation watchlist, was under an OQTF and house-arrest supervision — and whom France had attempted to deport ten times, each attempt refused by Algeria. The case escalated the France–Algeria dispute over consular removals.',
    perpetrators:
      'A 37-year-old Algerian national under an OQTF and judicial supervision, on the counter-terrorism watchlist, previously convicted of a terrorist offence.',
    victims: 'Lino Sousa Loureiro, 69, killed; several police officers wounded, two seriously.',
    outcome:
      'Arrested at the scene and placed under counter-terrorism investigation; the case triggered a government review of removals to Algeria.',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/2025_Mulhouse_stabbing_attack' },
      { label: 'Times of Israel', url: 'https://www.timesofisrael.com/one-dead-several-police-wounded-in-islamist-stabbing-attack-in-france/' },
    ],
  },
  {
    id: 'rambouillet-2021',
    rank: 14,
    year: '2021',
    location: 'Rambouillet (Yvelines)',
    dateDetail: '23 April 2021',
    locationDetail: 'Entrance of the Rambouillet police station, Yvelines',
    description: 'Unarmed police administrative worker Stéphanie Monfermé stabbed in the throat at her station.',
    expandedOverview:
      'Stéphanie Monfermé, a 49-year-old unarmed administrative employee of the national police and mother of two, was stabbed twice in the throat as she returned to the Rambouillet police station and died shortly afterwards. The attacker, who shouted "Allahu Akbar", was shot dead by officers. He was a Tunisian who had entered France illegally in 2009, lived without papers for a decade, and had been regularised in 2020 with a residence permit valid to December 2021; he was not known to the intelligence services, though he had consumed jihadist content online.',
    perpetrators:
      'Jamel Gorchene, 36, Tunisian national who entered France illegally in 2009 and was regularised in 2020; shot dead at the scene.',
    victims: 'Stéphanie Monfermé, 49 — police administrative worker.',
    outcome:
      'The attacker was killed at the scene; several associates were investigated for failing to report a terrorist plan.',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Rambouillet_stabbing' },
      { label: 'France 24', url: 'https://www.france24.com/en/live-news/20210430-france-honours-woman-killed-in-terror-attack-against-police' },
    ],
  },
  {
    id: 'annecy-2023',
    rank: 15,
    year: '2023',
    location: 'Annecy (Haute-Savoie)',
    dateDetail: '8 June 2023',
    locationDetail: 'Playground in the Jardins de l’Europe park, Annecy lakeside',
    description: 'Four toddlers and two adults stabbed in a lakeside playground by a Syrian asylum seeker.',
    expandedOverview:
      'A man attacked a playground beside Lake Annecy with a knife, stabbing four children aged roughly 22 to 36 months, two of them critically, along with two adults. Bystanders — including a young man who became known nationally as "le héros au sac à dos" — confronted him until police arrived. The attacker was a Syrian national who had been granted refugee status in Sweden and had applied unsuccessfully for asylum in France days earlier. All the victims survived.',
    perpetrators:
      'Abdalmasih Hanoun, Syrian national holding Swedish refugee status, whose French asylum application had just been rejected as redundant.',
    victims: 'Four toddlers (22–36 months) and two adults wounded; no deaths.',
    outcome:
      'Referred to the Haute-Savoie assize court for attempted murder in June 2026 after prosecutors requested trial the previous month.',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/2023_Annecy_stabbing' },
      { label: 'BBC', url: 'https://www.bbc.com/news/world-europe-65866514' },
    ],
    image: {
      src: '/incidents/annecy-2023.jpg',
      alt: 'Lake Annecy, beside the playground that was attacked',
      credit: 'Lake Annecy — Guilhem Vellut, CC BY 2.0 / Wikimedia Commons',
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Boat_@_Compagnie_des_Bateaux_du_Lac_d'Annecy_@_Lake_Annecy_@_Saint-Jorioz_(50488289926).jpg",
    },
  },
];
