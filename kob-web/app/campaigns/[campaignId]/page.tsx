'use client'

import Link from "next/link"
import { getCampaign } from "./util"
import { Character, CharacterCard } from "./Character"
import { CampaignLocation, LocationCard, fromApiLocation } from "./Location"
import { Campaign } from "../Campaign"
import React, { useEffect } from "react"
import { getCharacters } from "./Character"
import { useRouter } from "next/navigation"

async function getLocations(campaignId: number): Promise<Array<CampaignLocation>> {
    const res = await fetch(`http://localhost:3001/campaigns/${campaignId}/locations`)
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    const apiData = await res.json()
    return Promise.resolve(apiData.map(fromApiLocation))
}

async function fetchCreateLocation(campaignId: number): Promise<CampaignLocation> {
    const res = await fetch(`http://localhost:3001/campaigns/${campaignId}/locations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: '',
            description: '',
        }),
    })
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    const apiData = await res.json()
    return Promise.resolve(fromApiLocation(apiData))

}

export default function Page({ params }: { params: { campaignId: number }}) {
    const router = useRouter()
    const [campaign, setCampaign] = React.useState<Campaign>()
    const [characters, setCharacters] = React.useState<Array<Character>>([])
    const [locations, setLocations] = React.useState<Array<CampaignLocation>>([])
    useEffect(() => {
        getCampaign(params.campaignId).then(setCampaign)
        getCharacters(params.campaignId).then(setCharacters)
        getLocations(params.campaignId).then(setLocations)
    }, [])

    const createLocation = (campaignId: number) => {
        fetchCreateLocation(campaignId).then((location) => {
            router.push(`/campaigns/${location.campaignId}/locations/${location.id}`)
        })
    }

    return (
        <main className="min-h-screen flex flex-col gap-2">
            <div className="p-10 text-4xl font-bold text-purple-800 bg-purple-200">{campaign?.name ?? ''}</div>
            <div className="px-10 flex gap-4">
                <Link className="inline-block px-3 py-2 bg-purple-400 rounded text-slate-100 hover:bg-purple-600"
                    href={`/campaigns/${params.campaignId}/create-character`}>Create character</Link>
                <button className="inline-block px-3 py-2 bg-purple-400 rounded text-slate-100 hover:bg-purple-600"
                    onClick={() => createLocation(params.campaignId)}>Create location</button>
            </div>
            <div className="px-10 text-2xl font-bold mt-5">Player Characters</div>
            <div className="px-10 flex flex-wrap gap-4">
                {characters.filter(c => c.isPlayer).map(character => (
                    <CharacterCard key={character.id} character={character} />
                ))}
            </div>
            <div className="px-10 text-2xl font-bold mt-5">Non-Player Characters</div>
            <div className="px-10 flex flex-wrap gap-4">
                {characters.filter(c => !c.isPlayer).map(character => (
                    <CharacterCard key={character.id} character={character} />
                ))}
            </div>
            <div className="px-10 text-2xl font-bold mt-5">Locations</div>
            <div className="px-10 flex flex-wrap gap-4">
                {locations.map(location => (
                    <LocationCard key={location.id} location={location} />
                ))}
            </div>
        </main>
    )
}