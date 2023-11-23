'use client'

import Link from "next/link";
import { getCampaign } from "../../util";
import { CampaignLocation, CharacterLocation, createCharacterLocation, deleteCharacterLocation, getCampaignLocation, updateCampaignLocation, updateCharacterLocation } from "../../Location";
import { Campaign } from "@/app/campaigns/Campaign";
import React, { useEffect } from "react";
import { DebounceById, makeDebouncer } from "@/app/util";
import { Character, CharacterCard, characterSearchToQueryable, characterSearchToResult, getCharacters } from "../../Character";
import { Search, SearchHelper, SearchResult } from "@/app/Search";
import Delete from "@/app/Delete";
import Association from "@/app/Association";
import EditableText from "@/app/EditableText";
import Loading from "@/app/Loading";

const debounceLocationUpdate = makeDebouncer()
const debouncersForCharacterLocationUpdates = new DebounceById<CharacterLocation>()

function CharacterLocationAssociation({ characterLocation, removeFunc }: { characterLocation: CharacterLocation, removeFunc: () => void }) {
  const [characterLocationDescription, setCharacterLocationDescription] = React.useState(characterLocation.description)

  const updateCharacterLocationDescription = (value: string) => {
    setCharacterLocationDescription(value)
    const debounce = debouncersForCharacterLocationUpdates.getDebouncer(characterLocation)
    debounce(() => {
      updateCharacterLocation({
        id: characterLocation.id,
        description: value,
      })
    }, 500)
  }
  return (
    <Association>
      <CharacterCard character={characterLocation.character} />
      <textarea className="p-4" value={characterLocationDescription} onChange={(e) => updateCharacterLocationDescription(e.target.value)} />
      <Delete className="" handler={removeFunc} />
    </Association>
  )
}

export default function Page({ params }: { params: { campaignId: number, locationId: number }}) {
  const [loading, setLoading] = React.useState(true)
  const [campaign, setCampaign] = React.useState<Campaign>()
  const [location, setLocation] = React.useState<CampaignLocation>()
  const [allCampaignCharacters, setAllCampaignCharacters] = React.useState<Array<Character>>([])
  const searchHelper = new SearchHelper(allCampaignCharacters, characterSearchToQueryable, characterSearchToResult)

  const [locDescription, setLocDescription] = React.useState(location?.description)

  useEffect(() => {
    const campaignLoaded = getCampaign(params.campaignId).then(setCampaign)
    const locationLoaded = getCampaignLocation(params.campaignId, params.locationId).then((location) => {
      setLocation(location)
      setLocDescription(location.description)
    })
    const charactersLoaded = getCharacters(params.campaignId).then(setAllCampaignCharacters)
    Promise.all([campaignLoaded, locationLoaded, charactersLoaded])
      .then(() => setLoading(false))
  }, [])

  const updateName = (value: string) => {
    updateCampaignLocation({
      id: location?.id,
      campaignId: location?.campaignId,
      name: value,
    })
  }

  const updateDescription = (value: string) => {
    setLocDescription(value)
    debounceLocationUpdate(() => updateCampaignLocation({
      id: location?.id,
      campaignId: location?.campaignId,
      name: location?.name,
      description: locDescription,
    }), 500)
  }

  const associateCharacterWithLocation = (characterId: number) => {
    createCharacterLocation({
      characterId: characterId,
      locationId: location?.id,
    })
      .then(() => getCampaignLocation(params.campaignId, params.locationId))
      .then(setLocation)
  }

  const removeCharacterLocation = (characterLocation: CharacterLocation) => {
    deleteCharacterLocation(characterLocation)
      .then(() => getCampaignLocation(params.campaignId, params.locationId))
      .then(setLocation)
  }

  if (loading) {
    return (<Loading />)
  }
  
  return (
    <main className="min-h-screen">
      <Link href={`/campaigns/${campaign?.id}`} className="block p-10 text-4xl font-bold text-purple-800 hover:text-purple-600 bg-purple-200">{campaign.name}</Link>
      <div className="px-10 py-4 text-2xl font-bold text-purple-800 bg-purple-200">Location: <EditableText className="hover:text-purple-600" initialValue={location.name.length === 0 ? 'Unnamed association' : location.name} saveCallback={updateName} /></div>
      <div className="px-10 py-4">
        <textarea className="w-full h-36 p-4" value={locDescription} onChange={(e) => updateDescription(e.target.value)} />
      </div>
      <Search className="px-10 text-lg font-semibold" description="Associate Characters" placeholder="Type to find characters" searchFunc={searchHelper.search.bind(searchHelper)} selectCallback={associateCharacterWithLocation} />
      <div className="px-10 text-2xl font-bold mt-5">Associated Player Characters</div>
      <div className="px-10 flex flex-wrap gap-4">
        {location?.characterLocations?.filter(cl => cl.character?.isPlayer).map(cl => (
          <CharacterLocationAssociation key={cl.id} characterLocation={cl} removeFunc={() => removeCharacterLocation(cl)} />
        ))}
      </div>
      <div className="px-10 text-2xl font-bold mt-5">Associated Non-Player Characters</div>
      <div className="px-10 flex flex-wrap gap-4">
        {location?.characterLocations?.filter(cl => ! cl.character?.isPlayer).map(cl => (
          <CharacterLocationAssociation key={cl.id} characterLocation={cl} removeFunc={() => removeCharacterLocation(cl)} />
        ))}
      </div>
    </main>
  )
}