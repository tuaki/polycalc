import { type EmptyIntersection } from '../utils/common';
import { SkillType } from './Skill';
import { type UnitClassDefinition, type UnitVariantDefinition } from './UnitClass';
import { type VersionId } from './Version';

export enum UnitTag {
    Classic = 'classic',
    Aquarion = 'aquarion',
    Elyrion = 'elyrion',
    Polaris = 'polaris',
    Cymanti = 'cymanti',
    Land = 'land',
    Naval = 'naval',
}

export const UNIT_VARIANT_DEFINITIONS: readonly UnitVariantDefinition[] = [ {
    id: 'warrior-ship',
    label: '10 HP',
    health: 10,
}, {
    id: 'defender-ship',
    label: '15 HP',
    health: 15,
}, {
    id: 'veteran-defender-ship',
    label: '20 HP',
    health: 20,
}, {
    id: 'giant-ship',
    label: '40 HP',
    health: 40,
} ];

const diplomacyVariantIds = UNIT_VARIANT_DEFINITIONS.map(v => v.id);
const oceanVariantIds = diplomacyVariantIds.slice(0, 3);

type UnitDefinitionOperation<TOperation extends string, TData = void> = {
    operation: TOperation;
    id: string;
} & (TData extends void ? EmptyIntersection : TData);

type UnitClassVersionDefinition =
    UnitClassDefinition
    | UnitDefinitionOperation<'update', Partial<Omit<UnitClassDefinition, 'idShort'>> & ({ health?: number } | { variantIds?: readonly string[] })>
    | UnitDefinitionOperation<'delete'>;

const UNIT_DEFINITIONS_DIPLOMACY: readonly UnitClassVersionDefinition[] = [ {
    id: 'warrior',
    idShort: 'wr',
    label: 'Warrior',
    health: 10,
    attack: 2,
    defense: 2,
    range: 1,
    skills: [ SkillType.Fortify ],
    tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris, UnitTag.Cymanti ],
}, {
    id: 'archer',
    idShort: 'ar',
    label: 'Archer',
    health: 10,
    attack: 2,
    defense: 1,
    range: 2,
    skills: [ SkillType.Fortify ],
    tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion ],
}, {
    id: 'defender',
    idShort: 'df',
    label: 'Defender',
    health: 15,
    attack: 1,
    defense: 3,
    range: 1,
    skills: [ SkillType.Fortify ],
    tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris ],
}, {
    id: 'rider',
    idShort: 'rd',
    label: 'Rider',
    health: 10,
    attack: 2,
    defense: 1,
    range: 1,
    skills: [ SkillType.Fortify ],
    tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris ],
}, {
    id: 'swordsman',
    idShort: 'sw',
    label: 'Swordsman',
    health: 15,
    attack: 3,
    defense: 3,
    range: 1,
    skills: [ SkillType.Fortify ],
    tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris, UnitTag.Cymanti ],
}, {
    id: 'catapult',
    idShort: 'ct',
    label: 'Catapult',
    health: 10,
    attack: 4,
    defense: 0,
    range: 3,
    skills: [],
    tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris ],
}, {
    id: 'knight',
    idShort: 'kn',
    label: 'Knight',
    health: 10,
    attack: 3.5,
    defense: 1,
    range: 1,
    skills: [ SkillType.Fortify ],
    tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris ],
}, {
    id: 'giant',
    idShort: 'gi',
    label: 'Giant',
    health: 40,
    attack: 5,
    defense: 4,
    range: 1,
    skills: [ SkillType.Static ],
    tags: [ UnitTag.Land, UnitTag.Classic ],
}, {
    id: 'polytaur',
    idShort: 'po',
    label: 'Polytaur',
    health: 15,
    attack: 3,
    defense: 1,
    range: 1,
    skills: [ SkillType.Fortify, SkillType.Static ],
    tags: [ UnitTag.Land, UnitTag.Elyrion ],
}, {
    id: 'boat',
    idShort: 'bo',
    label: 'Boat',
    attack: 1,
    defense: 1,
    range: 2,
    skills: [ SkillType.Static ],
    tags: [ UnitTag.Naval, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion ],
    variantIds: diplomacyVariantIds,
}, {
    id: 'ship',
    idShort: 'sp',
    label: 'Ship',
    attack: 2,
    defense: 2,
    range: 2,
    skills: [ SkillType.Static ],
    tags: [ UnitTag.Naval, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion ],
    variantIds: diplomacyVariantIds,
}, {
    id: 'battleship',
    idShort: 'bs',
    label: 'Battleship',
    attack: 4,
    defense: 3,
    range: 2,
    skills: [ SkillType.Static ],
    tags: [ UnitTag.Naval, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion ],
    variantIds: diplomacyVariantIds,
}, {
    id: 'amphibian',
    idShort: 'am',
    label: 'Amphibian',
    health: 10,
    attack: 2,
    defense: 1,
    range: 1,
    skills: [ SkillType.Fortify ],
    tags: [ UnitTag.Land, UnitTag.Naval, UnitTag.Aquarion ],
}, {
    id: 'tridention',
    idShort: 'tr',
    label: 'Tridention',
    health: 15,
    attack: 3,
    defense: 1,
    range: 2,
    skills: [ SkillType.Fortify ],
    tags: [ UnitTag.Land, UnitTag.Naval, UnitTag.Aquarion ],
}, {
    id: 'crab',
    idShort: 'cr',
    label: 'Crab',
    health: 40,
    attack: 4,
    defense: 4,
    range: 1,
    skills: [ SkillType.Static ],
    tags: [ UnitTag.Land, UnitTag.Naval, UnitTag.Aquarion ],
}, {
    id: 'navalon',
    idShort: 'na',
    label: 'Navalon',
    health: 30,
    attack: 4,
    defense: 4,
    range: 1,
    skills: [ SkillType.Static ],
    tags: [ UnitTag.Naval, UnitTag.Elyrion ],
}, {
    id: 'dragon-egg',
    idShort: 'de',
    label: 'Dragon Egg',
    health: 10,
    attack: 0,
    defense: 2,
    range: 1,
    skills: [ SkillType.Fortify, SkillType.Static ],
    tags: [ UnitTag.Land, UnitTag.Elyrion ],
}, {
    id: 'baby-dragon',
    idShort: 'bd',
    label: 'Baby Dragon',
    health: 15,
    attack: 3,
    defense: 3,
    range: 1,
    skills: [ SkillType.Static ],
    tags: [ UnitTag.Land, UnitTag.Naval, UnitTag.Elyrion ],
}, {
    id: 'fire-dragon',
    idShort: 'fd',
    label: 'Fire Dragon',
    health: 20,
    attack: 4,
    defense: 3,
    range: 2,
    skills: [ SkillType.Splash, SkillType.Static ],
    tags: [ UnitTag.Land, UnitTag.Naval, UnitTag.Elyrion ],
}, {
    id: 'ice-archer',
    idShort: 'ia',
    label: 'Ice Archer',
    health: 10,
    attack: 0.1,
    defense: 1,
    range: 2,
    skills: [ SkillType.Freeze, SkillType.Fortify, SkillType.Static ],
    tags: [ UnitTag.Land, UnitTag.Polaris ],
}, {
    id: 'battle-sled',
    idShort: 'sl',
    label: 'Battle Sled',
    health: 15,
    attack: 3,
    defense: 2,
    range: 1,
    skills: [],
    tags: [ UnitTag.Land, UnitTag.Polaris ],
}, {
    id: 'mooni',
    idShort: 'mo',
    label: 'Mooni',
    health: 10,
    attack: 0,
    defense: 2,
    range: 1,
    skills: [ SkillType.Static ],
    tags: [ UnitTag.Land, UnitTag.Polaris ],
}, {
    id: 'ice-fortress',
    idShort: 'if',
    label: 'Ice Fortress',
    health: 20,
    attack: 4,
    defense: 3,
    range: 2,
    skills: [],
    tags: [ UnitTag.Land, UnitTag.Polaris ],
}, {
    id: 'gaami',
    idShort: 'ga',
    label: 'Gaami',
    health: 30,
    attack: 4,
    defense: 4,
    range: 1,
    skills: [ SkillType.Static ],
    tags: [ UnitTag.Land, UnitTag.Polaris ],
}, {
    id: 'hexapod',
    idShort: 'hx',
    label: 'Hexapod',
    health: 5,
    attack: 3,
    defense: 1,
    range: 1,
    skills: [],
    tags: [ UnitTag.Land, UnitTag.Cymanti ],
}, {
    id: 'kiton',
    idShort: 'kt',
    label: 'Kiton',
    health: 15,
    attack: 1,
    defense: 3,
    range: 1,
    skills: [ SkillType.Poison ],
    tags: [ UnitTag.Land, UnitTag.Cymanti ],
}, {
    id: 'phychi',
    idShort: 'ph',
    label: 'Phychi',
    health: 5,
    attack: 1,
    defense: 1,
    range: 2,
    skills: [ SkillType.Poison, SkillType.Surprise ],
    tags: [ UnitTag.Land, UnitTag.Naval, UnitTag.Cymanti ],
}, {
    id: 'raychi',
    idShort: 'rc',
    label: 'Raychi',
    health: 15,
    attack: 3,
    defense: 2,
    range: 1,
    skills: [ SkillType.Explode ],
    tags: [ UnitTag.Land, UnitTag.Naval, UnitTag.Cymanti ],
}, {
    id: 'exida',
    idShort: 'ex',
    label: 'Exida',
    health: 10,
    attack: 3,
    defense: 1,
    range: 3,
    skills: [ SkillType.Poison, SkillType.Splash ],
    tags: [ UnitTag.Land, UnitTag.Cymanti ],
}, {
    id: 'doomux',
    idShort: 'dm',
    label: 'Doomux',
    health: 20,
    attack: 4,
    defense: 2,
    range: 1,
    skills: [ SkillType.Explode ],
    tags: [ UnitTag.Land, UnitTag.Cymanti ],
}, {
    id: 'centipede',
    idShort: 'cp',
    label: 'Centipede',
    health: 20,
    attack: 4,
    defense: 3,
    range: 1,
    skills: [ SkillType.Static ],
    tags: [ UnitTag.Land, UnitTag.Cymanti ],
}, {
    id: 'segment',
    idShort: 'sg',
    label: 'Segment',
    health: 10,
    attack: 2,
    defense: 2,
    range: 1,
    skills: [ SkillType.Explode, SkillType.Static ],
    tags: [ UnitTag.Land, UnitTag.Cymanti ],
}, {
    id: 'cloak',
    idShort: 'cl',
    label: 'Cloak',
    health: 5,
    attack: 0,
    defense: 0.5,
    range: 1,
    skills: [ SkillType.Infiltrate, SkillType.Static ],
    tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris, UnitTag.Cymanti ],
}, {
    id: 'dagger',
    idShort: 'dg',
    label: 'Dagger',
    health: 10,
    attack: 2,
    defense: 2,
    range: 1,
    skills: [ SkillType.Surprise, SkillType.Static ],
    tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris, UnitTag.Cymanti ],
}, {
    id: 'dinghy',
    idShort: 'di',
    label: 'Dinghy',
    health: 5,
    attack: 0,
    defense: 0.5,
    range: 1,
    skills: [ SkillType.Infiltrate, SkillType.Static ],
    tags: [ UnitTag.Naval, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion ],
}, {
    id: 'pirate',
    idShort: 'pi',
    label: 'Pirate',
    health: 10,
    attack: 2,
    defense: 2,
    range: 1,
    skills: [ SkillType.Surprise, SkillType.Static ],
    tags: [ UnitTag.Naval, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion ],
}, {
    id: 'mind-bender',
    idShort: 'mb',
    label: 'Mind Bender',
    health: 10,
    attack: 0,
    defense: 1,
    range: 1,
    skills: [ SkillType.Convert, SkillType.Static ],
    tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris ],
}, {
    id: 'shaman',
    idShort: 'sh',
    label: 'Shaman',
    health: 10,
    attack: 1,
    defense: 1,
    range: 1,
    skills: [ SkillType.Convert, SkillType.Static ],
    tags: [ UnitTag.Land, UnitTag.Cymanti ],
} ];

const UNIT_DEFINITIONS_OCEAN_0: readonly UnitClassVersionDefinition[] = [ {
    // Swordsman loses fortify.
    operation: 'update',
    id: 'swordsman',
    skills: [],
}, {
    // Tridention health goes from 15 to 10.
    operation: 'update',
    id: 'tridention',
    health: 10,
}, {
    // Crab defense goes from 4 to 5.
    operation: 'update',
    id: 'crab',
    defense: 5,
}, {
    // Mooni defense goes from 2 to 1.
    operation: 'update',
    id: 'mooni',
    defense: 1,
}, {
    // Gaami defense goes from 4 to 3.
    operation: 'update',
    id: 'gaami',
    defense: 3,
}, {
    operation: 'delete',
    id: 'navalon',
}, {
    operation: 'delete',
    id: 'boat',
}, {
    operation: 'delete',
    id: 'ship',
}, {
    operation: 'delete',
    id: 'battleship',
}, {
    id: 'raft',
    idShort: 'rf',
    label: 'Raft',
    attack: 0,
    defense: 1,
    range: 1,
    skills: [ SkillType.Static ],
    tags: [ UnitTag.Naval, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion ],
    variantIds: oceanVariantIds,
}, {
    id: 'scout',
    idShort: 'sc',
    label: 'Scout',
    attack: 2,
    defense: 1,
    range: 2,
    skills: [ SkillType.Static ],
    tags: [ UnitTag.Naval, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion ],
    variantIds: oceanVariantIds,
}, {
    id: 'rammer',
    idShort: 'rm',
    label: 'Rammer',
    attack: 3,
    defense: 3,
    range: 1,
    skills: [ SkillType.Static ],
    tags: [ UnitTag.Naval, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion ],
    variantIds: oceanVariantIds,
}, {
    id: 'bomber',
    idShort: 'bm',
    label: 'Bomber',
    attack: 4,
    defense: 2,
    range: 3,
    skills: [ SkillType.Splash, SkillType.Stiff, SkillType.Static ],
    tags: [ UnitTag.Naval, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion ],
    variantIds: oceanVariantIds,
}, {
    id: 'juggernaut',
    idShort: 'jg',
    label: 'Juggernaut',
    health: 40,
    attack: 4,
    defense: 4,
    range: 1,
    skills: [ SkillType.Stiff, SkillType.Stomp, SkillType.Static ],
    tags: [ UnitTag.Naval, UnitTag.Classic ],
},
];

const UNIT_DEFINITIONS_OCEAN_1: readonly UnitClassVersionDefinition[] = [ {
    // Bomber attack goes from 4 to 3.
    operation: 'update',
    id: 'bomber',
    attack: 3,
} ];

const UNIT_DEFINITIONS_AQUARION_0: readonly UnitClassVersionDefinition[] = [ {
    // Tridention loses fortify. Attack goes from 3 to 2.5. It also gains the persist ability, but that's not important for us.
    operation: 'update',
    id: 'tridention',
    attack: 2.5,
    skills: [],
}, {
    // Amphibian loses fortify.
    operation: 'update',
    id: 'amphibian',
    skills: [],
}, {
    // Aquarion loses all ships.
    operation: 'update',
    id: 'raft',
    tags:[ UnitTag.Naval, UnitTag.Classic, UnitTag.Elyrion ],
}, {
    operation: 'update',
    id: 'scout',
    tags:[ UnitTag.Naval, UnitTag.Classic, UnitTag.Elyrion ],
}, {
    operation: 'update',
    id: 'rammer',
    tags:[ UnitTag.Naval, UnitTag.Classic, UnitTag.Elyrion ],
}, {
    operation: 'update',
    id: 'bomber',
    tags:[ UnitTag.Naval, UnitTag.Classic, UnitTag.Elyrion ],
}, {
    id: 'shark',
    idShort: 'sk',
    label: 'Shark',
    health: 10,
    attack: 3,
    defense: 2,
    range: 1,
    skills: [ SkillType.Surprise ],
    tags: [ UnitTag.Naval, UnitTag.Aquarion ],
}, {
    id: 'jelly',
    idShort: 'je',
    label: 'Jelly',
    health: 20,
    attack: 0,
    defense: 2,
    range: 1,
    skills: [ SkillType.Stiff, SkillType.Tentacles, SkillType.Static ],
    tags: [ UnitTag.Naval, UnitTag.Aquarion ],
}, {
    operation: 'update',
    id: 'catapult',
    tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Elyrion, UnitTag.Polaris ],
}, {
    id: 'puffer',
    idShort: 'pf',
    label: 'Puffer',
    health: 10,
    attack: 4,
    defense: 0,
    range: 3,
    skills: [],
    tags: [ UnitTag.Naval, UnitTag.Aquarion ],
} ];
// Also, crab gains the escape ability, but that's not important for us.

const UNIT_DEFINITIONS_AQUARION_1: readonly UnitClassVersionDefinition[] = [ {
    // Shark attack goes from 3 to 3.5.
    operation: 'update',
    id: 'shark',
    attack: 3.5,
}, {
    // Jelly attack goes from 0 to 2.
    // This brings a minor change to how the Jelly works (it can now attack directly), however it doesn't affect the math (the attack does the same damage as the tentacles would).
    operation: 'update',
    id: 'jelly',
    attack: 2,
}, {
    // Crab defense goes from 5 to 4 (where it was originally).
    operation: 'update',
    id: 'crab',
    tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Elyrion, UnitTag.Polaris ],
} ];

const UNIT_DEFINITIONS_CYMANTI_0: readonly UnitClassVersionDefinition[] = [ {
    // Hexapod attack has been reduced from 3 to 2.5
    operation: 'update',
    id: 'hexapod',
    attack: 2.5,
}, {
    // Ice Fortresses now have Escape and Static traits.
    operation: 'update',
    id: 'ice-fortress',
    skills: [ SkillType.Static ],
}, {
    // Ice Archers now have 1 Attack.
    operation: 'update',
    id: 'ice-archer',
    attack: 1,
}, {
    // Raychi no longer explodes.
    operation: 'update',
    id: 'raychi',
    skills: [],
}, {
    id: 'boomchi',
    idShort: 'bc',
    label: 'Boomchi',
    health: 10,
    attack: 3,
    defense: 2,
    range: 0,
    skills: [ SkillType.Explode ],
    tags: [ UnitTag.Naval, UnitTag.Cymanti ],
    // TODO find icon.
    noIcon: true,
}, {
    id: 'living-island',
    idShort: 'li',
    label: 'Living Island',
    health: 20,
    attack: 4,
    defense: 4,
    range: 1,
    skills: [ SkillType.Stomp, SkillType.Static, SkillType.Stiff ],
    tags: [ UnitTag.Naval, UnitTag.Cymanti ],
    // TODO find icon.
    noIcon: true,
} ];

export const UNIT_DEFINITIONS: Record<VersionId, readonly UnitClassVersionDefinition[]> = {
    'diplomacy': UNIT_DEFINITIONS_DIPLOMACY,
    'ocean-0': UNIT_DEFINITIONS_OCEAN_0,
    'ocean-1': UNIT_DEFINITIONS_OCEAN_1,
    'aquarion-0': UNIT_DEFINITIONS_AQUARION_0,
    'aquarion-1': UNIT_DEFINITIONS_AQUARION_1,
    'cymanti-0': UNIT_DEFINITIONS_CYMANTI_0,
};
