'use client'

import { Campaign } from "@/app/campaigns/Campaign"
import React, { useEffect } from "react"
import { Character, CharacterSheet, getCharacter, hydrateRelationships } from "../../Character"
import { getCampaign } from "../../util"
import Link from "next/link"

export default function Page({ params }: { params: { campaignId: number, characterId: number }}) {
  const [campaign, setCampaign] = React.useState<Campaign>()
  const [character, setCharacter] = React.useState<Character>()

  useEffect(() => {
    getCampaign(params.campaignId).then(setCampaign)
    getCharacter(params.campaignId, params.characterId)
      .then(hydrateRelationships)
      .then(setCharacter)
}, [])

  return (
    <main className="min-h-screen">
      <Link href={`/campaigns/${campaign?.id}`} className="block p-10 text-4xl font-bold text-purple-800 hover:text-purple-600 bg-purple-200">{campaign?.name ?? ''}</Link>
      <div className="px-10 py-4 bg-purple-200 flex justify-between">
        <span className="text-2xl font-bold text-purple-800">{character?.name}</span>
        <Link className="p-2 bg-blue-300 hover:bg-blue-400 text-gray-100 rounded-lg" href={`/campaigns/${campaign?.id}/characters/${character?.id}/edit`}>Edit</Link>
      </div>
      <div className="px-10 py bg-gray-100">
        <CharacterSheet character={character} />
      </div>
    </main>
  )
}