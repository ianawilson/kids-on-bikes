'use client'

import { Campaign } from "@/app/campaigns/Campaign"
import React from "react"
import { useEffect } from "react"
import { getCampaign } from "../../util"
import Link from "next/link"

export default function Page({ params }: { params: { campaignId: number }}) {
    const [campaign, setCampaign] = React.useState<Campaign>()

    useEffect(() => {
        getCampaign(params.campaignId).then(setCampaign)
    }, [])
    
    return (
        <main className="min-h-screen">
            <Link href={`/campaigns/${campaign?.id}`} className="block p-10 text-4xl font-bold text-purple-800 hover:text-purple-700 bg-purple-200">{campaign?.name ?? ''}</Link>
            TODO
        </main>
    )
}