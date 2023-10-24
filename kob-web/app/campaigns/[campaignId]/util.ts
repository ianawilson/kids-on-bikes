import { Campaign } from "../Campaign"

export async function getCampaign(id: number): Promise<Campaign> {
    const res = await fetch(`http://localhost:3001/campaigns/${id}`)
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    return res.json()
}
