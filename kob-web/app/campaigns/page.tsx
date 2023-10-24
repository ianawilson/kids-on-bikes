import Link from "next/link"
import { Campaign } from "./Campaign";

async function getData(): Promise<Array<Campaign>> {
    const res = await fetch('http://localhost:3001/campaigns')
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    return res.json()
}

export default async function Page() {
    const campaigns = await getData();
    return (
        <main className="min-h-screen p-10">
            <div className="py-4 flex items-baseline space-x-4">
                <div className="flex-none text-4xl font-bold text-purple-800">Campaigns</div>
                <Link href="/campaigns/new" className="flex-none bg-blue-400 hover:bg-blue-500 text-slate-100 text-xs rounded px-2 py-1">New Campaign</Link>
            </div>
            {campaigns.map(campaign => (
                <div className="p-4">
                    <Link href={`/campaigns/${campaign.id}`} className="text-2xl p-1 font-bold text-pink-700 hover:text-pink-600">
                        {campaign.name}
                    </Link>
                </div>
            ))}
        </main>
    );
}