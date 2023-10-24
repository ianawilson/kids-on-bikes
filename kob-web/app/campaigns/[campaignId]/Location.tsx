import Card from "@/app/Card";
import Link from "next/link";
import { ApiCharacter, Character, fromApiCharacter } from "./Character";

export type CharacterLocation = {
  id?: number;
  characterId?: number;
  character?: Character;
  locationId?: number;
  description?: string;
}

type ApiCharacterLocation = {
  id?: number;
  character_id?: number;
  character?: ApiCharacter;
  location_id?: number;
  description?: string;
}

function fromApiCharacterLocation(cl: ApiCharacterLocation): CharacterLocation {
  return {
    id: cl.id,
    characterId: cl.character_id,
    character: cl.character ? fromApiCharacter(cl.character) : undefined,
    locationId: cl.location_id,
    description: cl.description,
  }
}

function toApiCharacterLocation(cl: CharacterLocation): ApiCharacterLocation {
  return {
    id: cl.id,
    character_id: cl.characterId,
    location_id: cl.locationId,
    description: cl.description,
  }
}


export type CampaignLocation = {
  id?: number;
  campaignId?: number;
  name?: string;
  description?: string;
  characterLocations?: Array<CharacterLocation>;
}

export type ApiLocation = {
  id?: number;
  campaign_id?: number;
  name?: string;
  description?: string;
  character_locations?: Array<CharacterLocation>;
}

export function fromApiLocation(l: ApiLocation): CampaignLocation {
  return {
    id: l.id,
    campaignId: l.campaign_id,
    name: l.name,
    description: l.description,
    characterLocations: l.character_locations?.map(fromApiCharacterLocation)
  }
}

function toApiLocation(l: CampaignLocation): ApiLocation {
  return {
    // id: l.id,
    // campaign_id: l.campaignId,
    name: l.name,
    description: l.description,
  }
}

export async function getCampaignLocation(campaignId: number, locationId: number): Promise<CampaignLocation> {
  const res = await fetch(`http://localhost:3001/campaigns/${campaignId}/locations/${locationId}`)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json().then(fromApiLocation)
}

export async function updateCampaignLocation(location: CampaignLocation): Promise<CampaignLocation> {
  const options = {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(
        toApiLocation(location),
    ),
  }
  const res = await fetch(`http://localhost:3001/campaigns/${location.campaignId}/locations/${location.id}`, options)

  if (res.ok) {
      return res.json().then(fromApiLocation)
  } else {
      throw new Error('Failed to update location')
  }
}

export async function createCharacterLocation(characterLocation: CharacterLocation): Promise<CharacterLocation> {
  const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(
        toApiCharacterLocation(characterLocation),
    ),
  }
  const res = await fetch(`http://localhost:3001/character_locations`, options)

  if (res.ok) {
      return res.json().then(fromApiCharacterLocation)
  } else {
      throw new Error('Failed to create character location')
  }
}

export async function updateCharacterLocation(characterLocation: CharacterLocation): Promise<CharacterLocation> {
  const options = {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(
        toApiCharacterLocation(characterLocation),
    ),
  }
  const res = await fetch(`http://localhost:3001/character_locations/${characterLocation.id}`, options)

  if (res.ok) {
      return res.json().then(fromApiCharacterLocation)
  } else {
      throw new Error('Failed to update character location')
  }
}

export async function deleteCharacterLocation(characterLocation: CharacterLocation): Promise<undefined> {
  const options = {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
    },
  }
  const res = await fetch(`http://localhost:3001/character_locations/${characterLocation.id}`, options)

  if (res.ok) {
      return
  } else {
      throw new Error('Failed to delete character location')
  }
}


export function LocationCard({location}: {location: CampaignLocation}) {
  return (
    <Card>
      <Link href={`/campaigns/${location.campaignId}/locations/${location.id}`} className="text-2xl font-bold text-pink-700 hover:text-pink-600">{location.name}</Link>
    </Card>
  )
}