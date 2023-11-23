'use client'

import React, { useContext, useEffect, useState } from 'react'
import { Campaign } from '../Campaign';
import Link from 'next/link';
import Card from '@/app/Card';
import Association from '@/app/Association';
import { DebounceById } from '@/app/util';
import { Search, SearchHelper } from '@/app/Search';
import Delete from '@/app/Delete';
import { MetaContext, StrengthDetails, getFreeStrengthForAge } from '@/app/Meta';

export type Character = {
    id?: number;
    campaignId?: number;
    name?: string;
    isPlayer?: boolean;
    headline?: string;
    age?: number | null;
    ageGroup?: string;
    fear?: string;
    motivation?: string;
    flaws?: string;
    description?: string;
    statBrains?: number | null;
    statBrawn?: number | null;
    statCharm?: number | null;
    statFight?: number | null;
    statFlight?: number | null;
    statGrit?: number | null;
    statBrainsModifier?: number;
    statBrawnModifier?: number;
    statCharmModifier?: number;
    statFightModifier?: number;
    statFlightModifier?: number;
    statGritModifier?: number;
    strengthFree?: string;
    strength1?: string;
    strength2?: string;
    strengthFreeDetails?: StrengthDetails;
    strength1Details?: StrengthDetails;
    strength2Details?: StrengthDetails;
    adversityTokens?: number | null;
    _persistedRelationships?: Array<PersistedRelationship>
    relationships?: Array<Relationship>;
}

export type ApiCharacter = {
    id?: number;
    campaign_id?: number;
    name?: string;
    is_player?: boolean;
    headline?: string;
    age?: number | null;
    age_group?: string;
    fear?: string;
    motivation?: string;
    flaws?: string;
    description?: string;
    stat_brains?: number | null;
    stat_brawn?: number | null;
    stat_charm?: number | null;
    stat_fight?: number | null;
    stat_flight?: number | null;
    stat_grit?: number | null;
    stat_brains_modifier?: number;
    stat_brawn_modifier?: number;
    stat_charm_modifier?: number;
    stat_fight_modifier?: number;
    stat_flight_modifier?: number;
    stat_grit_modifier?: number;
    strength_free?: string;
    strength_1?: string;
    strength_2?: string;
    strength_free_details?: StrengthDetails;
    strength_1_details?: StrengthDetails;
    strength_2_details?: StrengthDetails;
    adversity_tokens?: number | null;
    relationships?: Array<ApiRelationship>;
}

export function toApiCharacter(c: Character): ApiCharacter {
    return {
        // id: c.id,
        // campaign_id: c.campaignId,
        name: c.name,
        is_player: c.isPlayer,
        headline: c.headline,
        age: c.age,
        fear: c.fear,
        motivation: c.motivation,
        flaws: c.flaws,
        description: c.description,
        stat_brains: c.statBrains,
        stat_brawn: c.statBrawn,
        stat_charm: c.statCharm,
        stat_fight: c.statFight,
        stat_flight: c.statFlight,
        stat_grit: c.statGrit,
        strength_1: c.strength1,
        strength_2: c.strength2,
        adversity_tokens: c.adversityTokens,
    }
}

export function fromApiCharacter(c: ApiCharacter): Character {
    return {
        id: c.id,
        campaignId: c.campaign_id,
        name: c.name,
        isPlayer: c.is_player,
        headline: c.headline,
        age: c.age,
        ageGroup: c.age_group,
        fear: c.fear,
        motivation: c.motivation,
        flaws: c.flaws,
        description: c.description,
        statBrains: c.stat_brains,
        statBrawn: c.stat_brawn,
        statCharm: c.stat_charm,
        statFight: c.stat_fight,
        statFlight: c.stat_flight,
        statGrit: c.stat_grit,
        statBrainsModifier: c.stat_brains_modifier,
        statBrawnModifier: c.stat_brawn_modifier,
        statCharmModifier: c.stat_charm_modifier,
        statFightModifier: c.stat_fight_modifier,
        statFlightModifier: c.stat_flight_modifier,
        statGritModifier: c.stat_grit_modifier,
        strengthFree: c.strength_free,
        strength1: c.strength_1,
        strength2: c.strength_2,
        strengthFreeDetails: c.strength_free_details,
        strength1Details: c.strength_1_details,
        strength2Details: c.strength_2_details,
        adversityTokens: c.adversity_tokens,
        _persistedRelationships: c.relationships?.map(fromApiRelationship),
    }
}

type BaseRelationship = {
    character1Id: number;
    character2Id: number;
    description: string;
}

type UnpersistedRelationship = BaseRelationship & {
    // id: undefined;
}

type PersistedRelationship = BaseRelationship & {
    id: number;
}

export type Relationship = PersistedRelationship & {
    otherCharacter: Character;
}

export type ApiRelationship = {
    id?: number;
    character_1_id: number;
    character_2_id: number;
    description: string;
}

function fromApiRelationship(r: ApiRelationship): PersistedRelationship {
    if (r.id === undefined) {
        throw new Error('Cannot convert from ApiRelationship without id')
    }
    return {
        id: r.id,
        character1Id: r.character_1_id,
        character2Id: r.character_2_id,
        description: r.description,
    }
}

function toApiRelationship(r: UnpersistedRelationship | PersistedRelationship): ApiRelationship {
    return {
        id: Object.hasOwn(r, 'id') ? r.id : undefined,
        character_1_id: r.character1Id,
        character_2_id: r.character2Id,
        description: r.description,
    }
}

export async function getCharacters(campaignId: number): Promise<Array<Character>> {
    const res = await fetch(`http://localhost:3001/campaigns/${campaignId}/characters`)
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    const apiData = await res.json()
    return Promise.resolve(apiData.map(c => fromApiCharacter(c)))
}

async function createCharacter(character: Character): Promise<Character> {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            toApiCharacter(character),
        ),
    }
    const res = await fetch(`http://localhost:3001/campaigns/${character.campaignId}/characters`, options)

    if (res.ok) {
        return res.json().then(fromApiCharacter)
    } else {
        throw new Error('Failed to create character')
    }
}

export async function getCharacter(campaignId: number, characterId: number): Promise<Character> {
    const res = await fetch(`http://localhost:3001/campaigns/${campaignId}/characters/${characterId}`)

    if (res.ok) {
        return res.json().then(fromApiCharacter)
    } else {
        throw new Error('Failed to get character')
    }
}

async function putCharacter(character: Character): Promise<Character> {
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            toApiCharacter(character),
        ),
    }
    const res = await fetch(`http://localhost:3001/campaigns/${character.campaignId}/characters/${character.id}`, options)

    if (res.ok) {
        return res.json().then(fromApiCharacter)
    } else {
        throw new Error('Failed to update character')
    }
}

async function patchCharacter(character: Character): Promise<Character> {
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            toApiCharacter(character),
        ),
    }
    const res = await fetch(`http://localhost:3001/campaigns/${character.campaignId}/characters/${character.id}`, options)

    if (res.ok) {
        return res.json().then(fromApiCharacter)
    } else {
        throw new Error('Failed to update character')
    }
}

async function createRelationship(relationship: UnpersistedRelationship): Promise<PersistedRelationship> {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            toApiRelationship(relationship),
        ),
    }
    const res = await fetch(`http://localhost:3001/relationships`, options)

    if (res.ok) {
        return res.json().then(fromApiRelationship)
    } else {
        throw new Error('Failed to create relationships')
    }
}

async function getRelationship(relationshipId: number): Promise<PersistedRelationship> {
    const res = await fetch(`http://localhost:3001/relationships/${relationshipId}`)

    if (res.ok) {
        return res.json().then(fromApiRelationship)
    } else {
        throw new Error('Failed to get character')
    }
}

export async function hydrateRelationships(character: Character): Promise<Character> {
    if (character.campaignId === undefined || character._persistedRelationships === undefined) {
        return Promise.resolve(character)
    }

    character.relationships = []

    return Promise.all(character._persistedRelationships.map(relationship => {
        let otherCharacterId;
        if (character.id === relationship.character1Id) {
            otherCharacterId = relationship.character2Id
        } else {
            otherCharacterId = relationship.character1Id
        }
        return getCharacter(character.campaignId, otherCharacterId)
            .then((otherCharacter) => character.relationships.push({
                ...relationship,
                otherCharacter: otherCharacter
            }))
    }))
        .then(() => character)
}

async function patchRelationship(relationship: PersistedRelationship): Promise<Relationship> {
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            toApiRelationship(relationship),
        ),
    }
    const res = await fetch(`http://localhost:3001/relationships/${relationship.id}`, options)

    if (res.ok) {
        return res.json().then(fromApiRelationship)
    } else {
        throw new Error('Failed to update relationships')
    }
}

async function deleteRelationship(relationship: PersistedRelationship): Promise<undefined> {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const res = await fetch(`http://localhost:3001/relationships/${relationship.id}`, options)

    if (res.ok) {
        return
    } else {
        throw new Error('Failed to delete relationship')
    }
}

const parseNumberOrEmpty = (v: string) => {
    if (v === '') {
        return null
    } else {
        return parseInt(v)
    }
}

export const characterSearchToQueryable = (c: Character) => ({ key: c.id, value: c.name})
export const characterSearchToResult = (c: Character) => ({ key: c.id, value: c.name + (c.isPlayer ? ' (Player)' : '')})

function Stat(props: { name: string, value: number | undefined | null, setValue: (v: number | undefined | null) => void}) {
    return (
        <div className="p-1">
            <label>
                <span className="text-xl font-bold my-1 mr-2">{props.name}</span>
                <select className="p-2" onChange={(e) => props.setValue(parseNumberOrEmpty(e.target.value))} value={props.value}>
                    <option value="">-</option>
                    <option value="4">d4</option>
                    <option value="6">d6</option>
                    <option value="8">d8</option>
                    <option value="10">d10</option>
                    <option value="12">d12</option>
                    <option value="20">d20</option>
                </select>
            </label>
        </div>
    )
}

export function AdversityTokens({ character }: { character: Character}) {
    const [tokens, setTokens] = useState<number | undefined | null>(character.adversityTokens)
    const updateTokens = (value: number | undefined | null) => {
        patchCharacter({
            campaignId: character.campaignId,
            id: character.id,
            adversityTokens: value,
        })
        setTokens(value)
    }
    return (
        <label className="flex gap-1">
            <span className="font-semibold">Adversity Tokens:</span>
            <input className="w-12 text-right" type="number" value={tokens ?? ''} onChange={(e) => updateTokens(parseNumberOrEmpty(e.target.value))} />
        </label>
    )
}

function Die({ name, stat, statModifier }: {name: string, stat?: number | null, statModifier?: number}) {
    if (stat) {
        return (
            <div className="px-1.5 rounded bg-slate-200 w-max">
                <span>{name}: d{stat}</span>
                <DieModifier modifier={statModifier} />
            </div>
        )
    }
}

function DieModifier({ modifier}: { modifier?: number }) {
    if (modifier) {
        if (modifier > 0) {
            return <span> +{modifier}</span>
        } else if (modifier < 0) {
            return <span> {modifier}</span>
        }
    }
}

export function CharacterSubtitle({ character }: { character: Character }) {
    return (
        <>
            {character.age && (<span>{character.age} year old {character.ageGroup}</span>)}
            {character.age && character.headline && (<span> &bull; </span>)}
            {character.headline ?? (<span>{character.headline}</span>)}
        </>
    )
}

function CharacterDescriptor({ name, value }: { name: string, value: string }) {
    return (
        <div>
            <p><span className="text-lg font-semibold">{name}:</span> {value}</p>
        </div>
    )
}

export function CharacterStats({ character }: { character: Character }) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <Die name="Brains" stat={character.statBrains} statModifier={character.statBrainsModifier} />
            <Die name="Brawn" stat={character.statBrawn} statModifier={character.statBrawnModifier} />
            <Die name="Charm" stat={character.statCharm} statModifier={character.statCharmModifier} />
            <Die name="Fight" stat={character.statFight} statModifier={character.statFightModifier} />
            <Die name="Flight" stat={character.statFlight} statModifier={character.statFlightModifier} />
            <Die name="Grit" stat={character.statGrit} statModifier={character.statGritModifier} />
        </div>
    )
}

function Strength({ strength }: {strength: StrengthDetails }) {
    return (
        <div>
            <p>
                <span className="font-semibold">{strength.name}:</span> {strength.description}
            </p>
        </div>
    )
}

export function CharacterCard({ character }: { character: Character }) {
    return (
        <Card>
            <div>
                <Link href={`/campaigns/${character.campaignId}/characters/${character.id}`} className="text-2xl font-bold text-pink-700 hover:text-pink-600">{character.name}</Link>
                <div className="text-neutral-500">
                    <CharacterSubtitle character={character} />
                </div>
            </div>
            <CharacterStats character={character} />
            {character.isPlayer ? (<AdversityTokens character={character} />) : null}
        </Card>
    )
}

const debouncersForRelationshipDescriptionUpdates = new DebounceById<Relationship>()

function RelationshipAssociation({ relationship, removeFunc }: { relationship: Relationship, removeFunc: () => void }) {
    const [description, setDescription] = React.useState(relationship.description)

    const updateDescription = (value: string) => {
        setDescription(value)
        const debounce = debouncersForRelationshipDescriptionUpdates.getDebouncer(relationship)
        debounce(() => {
            patchRelationship({
                id: relationship.id,
                character1Id: relationship.character1Id,
                character2Id: relationship.character2Id,
                description: value,
            })
        }, 500)
    }

    return (
        <Association>
            <CharacterCard character={relationship.otherCharacter} />
            <textarea className="p-4" value={description} onChange={(e) => updateDescription(e.target.value)} />
            <Delete handler={removeFunc} />
        </Association>
    )
}

export function CharacterSheet(props: { character: Character }) {
    if (props.character === undefined) return (<></>)

    const [character, setCharacter] = React.useState<Character>(props.character)
    const [allCampaignCharacters, setAllCampaignCharacters] = React.useState<Array<Character>>([])

    const searchHelper = new SearchHelper(allCampaignCharacters, characterSearchToQueryable, characterSearchToResult)

    useEffect(() => {
        if (character.campaignId === undefined) {
            throw new Error('Cannot create CharacterSheet for characters without campaigns')
        }
        getCharacters(character.campaignId).then(setAllCampaignCharacters)
    }, [])

    const handleCreateRelationship = (otherCharacterId: number) => {
        if (character.id === undefined || character.campaignId === undefined) {
            throw new Error('Cannot create relationship with character that is missing essential ids')
        }
        createRelationship({
            character1Id: character.id,
            character2Id: otherCharacterId,
            description: '',
        })
            .then(() => getCharacter(character.campaignId, character.id))
            .then(hydrateRelationships)
            .then(setCharacter)
    }

    const handleRemoveRelationship = (relationship: Relationship) => {
        deleteRelationship(relationship)
            .then(() => getCharacter(character.campaignId, character.id))
            .then(hydrateRelationships)
            .then(setCharacter)
    }
    
    return (
        <div className="py-4 flex flex-col gap-2">
            <div className="flex gap-4 justify-between">
                <div className="flex gap-2 flex-col">
                    <div className="text-neutral-500 text-lg font-semibold">
                        <CharacterSubtitle character={character} />
                    </div>
                    {character.fear !== undefined && (<CharacterDescriptor name="Fear" value={character.fear} />)}
                    {character.motivation !== undefined && (<CharacterDescriptor name="Motivation" value={character.motivation} />)}
                    {character.flaws !== undefined && (<CharacterDescriptor name="Flaws" value={character.flaws} />)}
                    {character.description !== undefined && (<CharacterDescriptor name="Description" value={character.description} />)}
                    <div>
                        <div className="text-lg font-semibold">Strengths</div>
                        <div className="pl-4 flex flex-col gap-2">
                        {character.strengthFreeDetails && (<Strength strength={character.strengthFreeDetails} />)}
                        {character.strength1Details && (<Strength strength={character.strength1Details} />)}
                        {character.strength2Details && (<Strength strength={character.strength2Details} />)}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 flex-col shrink-0">
                    <CharacterStats character={character} />
                    {character.isPlayer ? (<AdversityTokens character={character} />) : null}
                </div>
            </div>
            <div>NOTES TODO</div>
            <div className="flex justify-between">
                <div className="text-xl font-bold">Relationships</div>
                <div className=""><Search className="" description="Add Relationship" placeholder="Character name" searchFunc={searchHelper.search.bind(searchHelper)} selectCallback={handleCreateRelationship} /></div>
            </div>
            <div className="flex flex-wrap gap-4">
                {(character.relationships !== undefined ? character.relationships : [])
                    .filter(relationship => relationship.otherCharacter !== undefined)
                    .map(relationship => (
                        <RelationshipAssociation key={relationship.id} relationship={relationship} removeFunc={() => handleRemoveRelationship(relationship)} />
                    ))}
            </div>
        </div>
    )
}

function BaseCharacterForm(actionText: string, action: (character: Character) => Promise<Character>, postActionCallback: (character: Character) => void, campaign?: Campaign, character?: Character) {
    const meta = useContext(MetaContext)
    const [campaignState, setCampaign] = React.useState<Campaign | undefined>(campaign)
    const [characterState, setCharacter] = React.useState<Character | undefined>(character)

    const [name, setName] = React.useState(character?.name ?? '')
    const [isPlayer, setIsPlayer] = React.useState(character?.isPlayer ?? false)
    const [headline, setHeadline] = React.useState(character?.headline ?? '')
    const [age, setAge] = React.useState<number | null | undefined>(character?.age)
    const [fear, setFear] = React.useState(character?.fear ?? '')
    const [motivation, setMotivation] = React.useState(character?.motivation ?? '')
    const [flaws, setFlaws] = React.useState(character?.flaws ?? '')
    const [description, setDescription] = React.useState(character?.description ?? '')
    const [statBrains, setStatBrains] = React.useState<number | null | undefined>(character?.statBrains)
    const [statBrawn, setStatBrawn] = React.useState<number | null | undefined>(character?.statBrawn)
    const [statCharm, setStatCharm] = React.useState<number | null | undefined>(character?.statCharm)
    const [statFight, setStatFight] = React.useState<number | null | undefined>(character?.statFight)
    const [statFlight, setStatFlight] = React.useState<number | null | undefined>(character?.statFlight)
    const [statGrit, setStatGrit] = React.useState<number | null | undefined>(character?.statGrit)
    const [strengths, setStrengths] = React.useState<Array<string>>([])

    // TODO: This seems like a mess
    useEffect(() => {
        setName(character?.name ?? '')
        setIsPlayer(character?.isPlayer ?? false)
        setHeadline(character?.headline ?? '')
        setAge(character?.age)
        setFear(character?.fear ?? '')
        setMotivation(character?.motivation ?? '')
        setFlaws(character?.flaws ?? '')
        setDescription(character?.description ?? '')
        setStatBrains(character?.statBrains)
        setStatBrawn(character?.statBrawn)
        setStatCharm(character?.statCharm)
        setStatFight(character?.statFight)
        setStatFlight(character?.statFlight)
        setStatGrit(character?.statGrit)    
    }, [character])

    const freeStrength = getFreeStrengthForAge(age)
    const handleStrengthChange = (key: string) => {
        if (strengths.includes(key)) {
            setStrengths(strengths.filter((k) => k !== key))
        } else {
            setStrengths(strengths.concat([key]))
        }
    }

    async function submit(e) {
        e.preventDefault()
        if (campaign === undefined) {
            return
        }

        action({
            id: character?.id,
            campaignId: campaign.id,
            name,
            isPlayer,
            headline,
            age,
            fear,
            motivation,
            flaws,
            description,
            statBrains,
            statBrawn,
            statCharm,
            statFight,
            statFlight,
            statGrit,
            strength1: strengths[0],
            strength2: strengths[1],
        }).then(postActionCallback)
    }

    return (
        <form className="px-10 py-4 flex flex-col space-y-12" onSubmit={submit}>
            <fieldset className="flex space-x-4 items-end">
                <label className="grow">
                    <div className="text-xl font-bold my-1">Name</div>
                    <input className="p-2 rounded w-full" name="name" placeholder="Name"
                        value={name} onChange={(event) => { setName(event.target.value)}} />
                </label>
                <label className="grow">
                <div className="text-xl font-bold my-1">Headline or Trope</div>
                    <input className="p-2 rounded w-full" name="headline" placeholder="Headline or trope"
                        value={headline} onChange={(event) => { setHeadline(event.target.value)}} />
                </label>
                <label>
                    <span className="text-xl my-1">Is a player?</span>
                    <input className="m-2" name="isPlayer" type="checkbox"
                        checked={isPlayer} onChange={(event) => setIsPlayer(event.target.checked)} />
                </label>
            </fieldset>
            <div className="flex space-x-12">
                <fieldset>
                    <label>
                        <div className="text-xl font-bold my-1">Age</div>
                        <input className="p-2 rounded" name="age" type="number" placeholder="Age"
                            value={age ?? age?.toString()} onChange={(event) => setAge(parseNumberOrEmpty(event.target.value))} />
                    </label>
                    <label>
                        <div className="text-xl font-bold my-1">Fear</div>
                        <input className="p-2 rounded" name="fear" placeholder="Fear"
                            value={fear} onChange={(event) => setFear(event.target.value )} />
                    </label>
                    <label>
                        <div className="text-xl font-bold my-1">Motivation</div>
                        <input className="p-2 rounded" name="motivation" placeholder="Motivation"
                            value={motivation} onChange={(event) => setMotivation(event.target.value )} />
                    </label>
                    <label>
                        <div className="text-xl font-bold my-1">Flaws</div>
                        <input className="p-2 rounded" name="flaws" placeholder="Flaws"
                            value={flaws} onChange={(event) => setFlaws(event.target.value )} />
                    </label>
                    <label>
                        <div className="text-xl font-bold my-1">Description</div>
                        <textarea className="p-2 rounded" name="description" placeholder="Description"
                            value={description} onChange={(event) => setDescription(event.target.value )} />
                    </label>
                </fieldset>
                <fieldset>
                    <Stat name='Brains' value={statBrains} setValue={setStatBrains}></Stat>
                    <Stat name='Brawn' value={statBrawn} setValue={setStatBrawn}></Stat>
                    <Stat name='Charm' value={statCharm} setValue={setStatCharm}></Stat>
                    <Stat name='Fight' value={statFight} setValue={setStatFight}></Stat>
                    <Stat name='Flight' value={statFlight} setValue={setStatFlight}></Stat>
                    <Stat name='Grit' value={statGrit} setValue={setStatGrit}></Stat>
                </fieldset>
            </div>
            <fieldset className="flex flex-col space-y-3">
                {Object.values(meta.strengths).map((strength) => {
                    const thisIsTheFreeStrength = freeStrength !== undefined && freeStrength.key === strength.key
                    return (
                        <label className="flex space-x-2">
                            <input type="checkbox" disabled={thisIsTheFreeStrength} checked={thisIsTheFreeStrength || strengths.includes(strength.key)}
                                onChange={(event) => handleStrengthChange(strength.key)} />
                            <Strength strength={strength} />
                        </label>
                    )
                })}
            </fieldset>
            <button type="submit" className="px-3 py-2 bg-purple-600 rounded text-slate-100 hover:bg-purple-700">{actionText}</button>
        </form>
    )
}

export function CreateCharacter({postActionCallback, campaign}: { postActionCallback: (character: Character) => void, campaign?: Campaign }) {
    return BaseCharacterForm('Create', createCharacter, postActionCallback, campaign)
}

export function EditCharacter({postActionCallback, campaign, character}: {postActionCallback: (character: Character) => void, campaign?: Campaign, character?: Character}) {
    return BaseCharacterForm('Save', putCharacter, postActionCallback, campaign, character)
}
