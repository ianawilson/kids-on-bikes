'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

async function createCampaign(name: string) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
        }),
    }
    const res = await fetch('http://localhost:3001/campaigns', options)

    if (res.ok) {
        return await res.json()
    } else {
        throw new Error('Failed to create campaign')
    }
}

export default function Page() {
    const router = useRouter()
    const [name, setName] = React.useState('')

    async function submit(e) {
        e.preventDefault()
        const campaign = await createCampaign(name)
        router.push(`/campaigns/${ campaign.id }`)
    }

    return (
        <main className="min-h-screen">
            <div className="p-10 text-4xl font-bold text-purple-800 bg-purple-200">Create New Campaign</div>
            <form className="px-10" onSubmit={submit}>
                <fieldset className="my-4">
                    <label>
                        <div className="text-xl font-bold my-1">Name</div>
                        <input 
                            className="p-2 rounded" name="name" placeholder="Campaign name ..."
                            value={name} onChange={(event) => { setName(event.target.value )}}
                        />
                    </label>
                </fieldset>
                <button type="submit" className="px-3 py-2 bg-purple-600 rounded text-slate-100 hover:bg-purple-700">Create</button>
            </form>
        </main>
    )
}