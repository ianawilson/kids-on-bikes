'use client'

import React, { useEffect } from 'react'
import { getCampaign } from '../../../util'
import { useRouter } from 'next/navigation'
import { Character, EditCharacter, getCharacter } from '../../../Character'
import { Campaign } from '../../../../Campaign'
import Link from 'next/link'


export default function Page({ params }: { params: { campaignId: number, characterId: number }}) {
    const router = useRouter()
    const [campaign, setCampaign] = React.useState<Campaign>()
    const [character, setCharacter] = React.useState<Character>()

    useEffect(() => {
        getCampaign(params.campaignId).then(setCampaign)
        getCharacter(params.campaignId, params.characterId).then(setCharacter)
    }, [])

    const postActionCallback = (character: Character) => {
        if (campaign) {
            router.push(`/campaigns/${campaign.id}/characters/${character.id}`)
        }
    }

    return (
        <main className="min-h-screen">
            <Link href={`/campaigns/${campaign?.id}`} className="block p-10 text-4xl font-bold text-purple-800 hover:text-purple-700 bg-purple-200">{campaign?.name ?? ''}</Link>
            <div className="px-10 py-4 text-2xl font-bold text-purple-800 bg-purple-200">Edit Character - {character?.name}</div>
            <EditCharacter postActionCallback={postActionCallback} campaign={campaign} character={character} />
        </main>
    )
}
