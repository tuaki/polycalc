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

export const UNIT_VARIANT_DEFINITIONS: readonly UnitVariantDefinition[] = [
    {
        id: 'warrior-ship',
        label: '10 HP',
        health: 10,
    },
    {
        id: 'defender-ship',
        label: '15 HP',
        health: 15,
    },
    {
        id: 'veteran-defender-ship',
        label: '20 HP',
        health: 20,
    },
    {
        id: 'giant-ship',
        label: '40 HP',
        health: 40,
    },
];

const diplomacyVariantIds = UNIT_VARIANT_DEFINITIONS.map(v => v.id);
const oceanVariantIds = diplomacyVariantIds.slice(0, 3);

/** The second part of this type is here for the removed units. */
type UnitClassVersionDefinition = UnitClassDefinition | string;

const UNIT_DEFINITIONS_DIPLOMACY: readonly UnitClassVersionDefinition[] = [
    {
        id: 'warrior',
        idShort: 'wr',
        label: 'Warrior',
        health: 10,
        attack: 2,
        defense: 2,
        range: 1,
        skills: [ SkillType.Fortify, SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris, UnitTag.Cymanti ],
    }, {
        id: 'archer',
        idShort: 'ar',
        label: 'Archer',
        health: 10,
        attack: 2,
        defense: 1,
        range: 2,
        skills: [ SkillType.Fortify, SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion ],
    }, {
        id: 'defender',
        idShort: 'df',
        label: 'Defender',
        health: 15,
        attack: 1,
        defense: 3,
        range: 1,
        skills: [ SkillType.Fortify, SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris ],
    }, {
        id: 'rider',
        idShort: 'rd',
        label: 'Rider',
        health: 10,
        attack: 2,
        defense: 1,
        range: 1,
        skills: [ SkillType.Fortify, SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris ],
    }, {
        id: 'swordsman',
        idShort: 'sw',
        label: 'Swordsman',
        health: 15,
        attack: 3,
        defense: 3,
        range: 1,
        skills: [ SkillType.Fortify, SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris, UnitTag.Cymanti ],
    }, {
        id: 'catapult',
        idShort: 'ct',
        label: 'Catapult',
        health: 10,
        attack: 4,
        defense: 0,
        range: 3,
        skills: [ SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris ],
    }, {
        id: 'knight',
        idShort: 'kn',
        label: 'Knight',
        health: 10,
        attack: 3.5,
        defense: 1,
        range: 1,
        skills: [ SkillType.Fortify, SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris ],
    }, {
        id: 'giant',
        idShort: 'gi',
        label: 'Giant',
        health: 40,
        attack: 5,
        defense: 4,
        range: 1,
        skills: [],
        tags: [ UnitTag.Land, UnitTag.Classic ],
    }, {
        id: 'polytaur',
        idShort: 'po',
        label: 'Polytaur',
        health: 15,
        attack: 3,
        defense: 1,
        range: 1,
        skills: [ SkillType.Fortify ],
        tags: [ UnitTag.Land, UnitTag.Elyrion ],
    }, {
        id: 'boat',
        idShort: 'bo',
        label: 'Boat',
        attack: 1,
        defense: 1,
        range: 2,
        skills: [],
        tags: [ UnitTag.Naval, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion ],
        variantIds: diplomacyVariantIds,
    }, {
        id: 'ship',
        idShort: 'sp',
        label: 'Ship',
        attack: 2,
        defense: 2,
        range: 2,
        skills: [],
        tags: [ UnitTag.Naval, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion ],
        variantIds: diplomacyVariantIds,
    }, {
        id: 'battleship',
        idShort: 'bs',
        label: 'Battleship',
        attack: 4,
        defense: 3,
        range: 2,
        skills: [],
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
        skills: [ SkillType.Fortify, SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Naval, UnitTag.Aquarion ],
    }, {
        id: 'tridention',
        idShort: 'tr',
        label: 'Tridention',
        health: 15,
        attack: 3,
        defense: 1,
        range: 2,
        skills: [ SkillType.Fortify, SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Naval, UnitTag.Aquarion ],
    }, {
        id: 'crab',
        idShort: 'cr',
        label: 'Crab',
        health: 40,
        attack: 4,
        defense: 4,
        range: 1,
        skills: [],
        tags: [ UnitTag.Land, UnitTag.Naval, UnitTag.Aquarion ],
    }, {
        id: 'navalon',
        idShort: 'na',
        label: 'Navalon',
        health: 30,
        attack: 4,
        defense: 4,
        range: 1,
        skills: [],
        tags: [ UnitTag.Naval, UnitTag.Elyrion ],
    }, {
        id: 'dragon-egg',
        idShort: 'de',
        label: 'Dragon Egg',
        health: 10,
        attack: 0,
        defense: 2,
        range: 1,
        skills: [ SkillType.Fortify ],
        tags: [ UnitTag.Land, UnitTag.Elyrion ],
    }, {
        id: 'baby-dragon',
        idShort: 'bd',
        label: 'Baby Dragon',
        health: 15,
        attack: 3,
        defense: 3,
        range: 1,
        skills: [],
        tags: [ UnitTag.Land, UnitTag.Naval, UnitTag.Elyrion ],
    }, {
        id: 'fire-dragon',
        idShort: 'fd',
        label: 'Fire Dragon',
        health: 20,
        attack: 4,
        defense: 3,
        range: 2,
        skills: [ SkillType.Splash ],
        tags: [ UnitTag.Land, UnitTag.Naval, UnitTag.Elyrion ],
    }, {
        id: 'ice-archer',
        idShort: 'ia',
        label: 'Ice Archer',
        health: 10,
        attack: 0.1,
        defense: 1,
        range: 2,
        skills: [ SkillType.Freeze, SkillType.Fortify ],
        tags: [ UnitTag.Land, UnitTag.Polaris ],
    }, {
        id: 'battle-sled',
        idShort: 'sl',
        label: 'Battle Sled',
        health: 15,
        attack: 3,
        defense: 2,
        range: 1,
        skills: [ SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Polaris ],
    }, {
        id: 'mooni',
        idShort: 'mo',
        label: 'Mooni',
        health: 10,
        attack: 0,
        defense: 2,
        range: 1,
        skills: [],
        tags: [ UnitTag.Land, UnitTag.Polaris ],
    }, {
        id: 'ice-fortress',
        idShort: 'if',
        label: 'Ice Fortress',
        health: 20,
        attack: 4,
        defense: 3,
        range: 2,
        skills: [ SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Polaris ],
    }, {
        id: 'gaami',
        idShort: 'ga',
        label: 'Gaami',
        health: 30,
        attack: 4,
        defense: 4,
        range: 1,
        skills: [],
        tags: [ UnitTag.Land, UnitTag.Polaris ],
    }, {
        id: 'hexapod',
        idShort: 'hx',
        label: 'Hexapod',
        health: 5,
        attack: 3,
        defense: 1,
        range: 1,
        skills: [ SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Cymanti ],
    }, {
        id: 'kiton',
        idShort: 'kt',
        label: 'Kiton',
        health: 15,
        attack: 1,
        defense: 3,
        range: 1,
        skills: [ SkillType.Poison, SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Cymanti ],
    }, {
        id: 'phychi',
        idShort: 'ph',
        label: 'Phychi',
        health: 5,
        attack: 1,
        defense: 1,
        range: 2,
        skills: [ SkillType.Poison, SkillType.Surprise, SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Naval, UnitTag.Cymanti ],
    }, {
        id: 'raychi',
        idShort: 'rc',
        label: 'Raychi',
        health: 15,
        attack: 3,
        defense: 2,
        range: 1,
        skills: [ SkillType.Explode, SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Naval, UnitTag.Cymanti ],
    }, {
        id: 'exida',
        idShort: 'ex',
        label: 'Exida',
        health: 10,
        attack: 3,
        defense: 1,
        range: 3,
        skills: [ SkillType.Poison, SkillType.Splash, SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Cymanti ],
    }, {
        id: 'doomux',
        idShort: 'dm',
        label: 'Doomux',
        health: 20,
        attack: 4,
        defense: 2,
        range: 1,
        skills: [ SkillType.Explode, SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Cymanti ],
    }, {
        id: 'centipede',
        idShort: 'cp',
        label: 'Centipede',
        health: 20,
        attack: 4,
        defense: 3,
        range: 1,
        skills: [],
        tags: [ UnitTag.Land, UnitTag.Cymanti ],
    }, {
        id: 'segment',
        idShort: 'sg',
        label: 'Segment',
        health: 10,
        attack: 2,
        defense: 2,
        range: 1,
        skills: [ SkillType.Explode ],
        tags: [ UnitTag.Land, UnitTag.Cymanti ],
    }, {
        id: 'cloak',
        idShort: 'cl',
        label: 'Cloak',
        health: 5,
        attack: 0,
        defense: 0.5,
        range: 1,
        skills: [ SkillType.Infiltrate ],
        tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris, UnitTag.Cymanti ],
    }, {
        id: 'dagger',
        idShort: 'dg',
        label: 'Dagger',
        health: 10,
        attack: 2,
        defense: 2,
        range: 1,
        skills: [ SkillType.Surprise ],
        tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris, UnitTag.Cymanti ],
    }, {
        id: 'dinghy',
        idShort: 'di',
        label: 'Dinghy',
        health: 5,
        attack: 0,
        defense: 0.5,
        range: 1,
        skills: [ SkillType.Infiltrate ],
        tags: [ UnitTag.Naval, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion ],
    }, {
        id: 'pirate',
        idShort: 'pi',
        label: 'Pirate',
        health: 10,
        attack: 2,
        defense: 2,
        range: 1,
        skills: [ SkillType.Surprise ],
        tags: [ UnitTag.Naval, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion ],
    }, {
        id: 'mind-bender',
        idShort: 'mb',
        label: 'Mind Bender',
        health: 10,
        attack: 0,
        defense: 1,
        range: 1,
        skills: [ SkillType.Convert ],
        tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris ],
    }, {
        id: 'shaman',
        idShort: 'sh',
        label: 'Shaman',
        health: 10,
        attack: 1,
        defense: 1,
        range: 1,
        skills: [ SkillType.Convert ],
        tags: [ UnitTag.Land, UnitTag.Cymanti ],
    },
] as const;

const UNIT_DEFINITIONS_OCEAN: readonly UnitClassVersionDefinition[] = [
    {
        id: 'swordsman',
        idShort: 'sw',
        label: 'Swordsman',
        health: 15,
        attack: 3,
        defense: 3,
        range: 1,
        skills: [ SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion, UnitTag.Polaris, UnitTag.Cymanti ],
    },
    'boat',
    'ship',
    'battleship',
    {
        id: 'raft',
        idShort: 'rf',
        label: 'Raft',
        attack: 0,
        defense: 1,
        range: 1,
        skills: [],
        tags: [ UnitTag.Naval, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion ],
        variantIds: oceanVariantIds,
    }, {
        id: 'scout',
        idShort: 'sc',
        label: 'Scout',
        attack: 2,
        defense: 1,
        range: 2,
        skills: [],
        tags: [ UnitTag.Naval, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion ],
        variantIds: oceanVariantIds,
    }, {
        id: 'rammer',
        idShort: 'rm',
        label: 'Rammer',
        attack: 3,
        defense: 3,
        range: 1,
        skills: [],
        tags: [ UnitTag.Naval, UnitTag.Classic, UnitTag.Aquarion, UnitTag.Elyrion ],
        variantIds: oceanVariantIds,
    }, {
        id: 'bomber',
        idShort: 'bm',
        label: 'Bomber',
        attack: 4,
        defense: 2,
        range: 3,
        skills: [ SkillType.Splash, SkillType.Stiff ],
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
        skills: [ SkillType.Stiff, SkillType.Stomp ], // Stomp is like splash but still can attack normally
        tags: [ UnitTag.Naval, UnitTag.Classic ],
    }, {
        id: 'tridention',
        idShort: 'tr',
        label: 'Tridention',
        health: 10,
        attack: 3,
        defense: 1,
        range: 2,
        skills: [ SkillType.Fortify, SkillType.Promote ],
        tags: [ UnitTag.Land, UnitTag.Naval, UnitTag.Aquarion ],
    }, {
        id: 'crab',
        idShort: 'cr',
        label: 'Crab',
        health: 40,
        attack: 4,
        defense: 5,
        range: 1,
        skills: [],
        tags: [ UnitTag.Land, UnitTag.Naval, UnitTag.Aquarion ],
    },
    'navalon',
    {
        id: 'mooni',
        idShort: 'mo',
        label: 'Mooni',
        health: 10,
        attack: 0,
        defense: 1,
        range: 1,
        skills: [],
        tags: [ UnitTag.Land, UnitTag.Polaris ],
    }, {
        id: 'gaami',
        idShort: 'ga',
        label: 'Gaami',
        health: 30,
        attack: 4,
        defense: 3,
        range: 1,
        skills: [],
        tags: [ UnitTag.Land, UnitTag.Polaris ],
    }, 
] as const;

export const UNIT_DEFINITIONS: Record<VersionId, readonly UnitClassVersionDefinition[]> = {
    diplomacy: UNIT_DEFINITIONS_DIPLOMACY,
    ocean: UNIT_DEFINITIONS_OCEAN,
};
