import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

interface LootboxData {
    user_lootbox_data: {
        user_id: string;
        opened_items: Record<string, number>;
        redeemed_prize: boolean;
    };
    opened_item: string;
}

interface ItemNames {
    [key: string]: string;
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const itemNames: ItemNames = {
    '1214340999644446728': 'Dream Hammer',
    '1214340999644446727': 'OHHHHH BANANA',
    '1214340999644446722': 'Wump Shell',
    '1214340999644446725': 'Power Helmet',
    '1214340999644446720': 'Buster Blade',
    '1214340999644446723': 'Speed Boost',
    '1214340999644446724': '→ ↑ ↓ → ↑ ↓',
    '1214340999644446721': 'Cute Plushie',
    '1214340999644446726': 'Quack!!'
};

async function openDiscordLootbox() {
    const discordToken = process.env.DISCORD_TOKEN;
    if (!discordToken) {
        console.log('Discord token is not set in the environment variables.');
        return;
    }

    const response = await fetch('https://discord.com/api/v9/users/@me/lootboxes/open', {
        method: 'POST',
        headers: {
            'accept': '*/*',
            'accept-language': 'en-US',
            'authorization': discordToken,
            'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-discord-locale': 'en-US',
            'x-super-properties': 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRGlzY29yZCBDbGllbnQiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfdmVyc2lvbiI6IjEuMC45MDM4Iiwib3NfdmVyc2lvbiI6IjEwLjAuMjI2MzEiLCJvc19hcmNoIjoieDY0IiwiYXBwX2FyY2giOiJpYTMyIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV09XNjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIGRpc2NvcmQvMS4wLjkwMzggQ2hyb21lLzEyMC4wLjYwOTkuMjkxIEVsZWN0cm9uLzI4LjIuNyBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMjguMi43IiwiY2xpZW50X2J1aWxkX251bWJlciI6MjgwNjg2LCJuYXRpdmVfYnVpbGRfbnVtYmVyIjo0NTUyNCwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0='
        },
        body: null,
    });

    if (response.status === 429) {
        console.log('Too many requests... waiting 10 seconds');
        await delay(10000); // 10 seconds
        return;
    }

    if (!response.ok) {
        console.error(`Failed to open lootbox: ${response.statusText}`);
        return;
    }

    const data = await response.json() as LootboxData;

    const openedItems = Object.entries(data.user_lootbox_data.opened_items).reduce((acc, [id, count]) => {
        const itemName = itemNames[id] || id;
        acc[itemName] = count;
        return acc;
    }, {} as Record<string, number>);

    const openedItem = itemNames[data.opened_item] || data.opened_item;

    console.log(`Lootbox opened successfully, you opened a ${openedItem}`);
}

async function openLootbox() {
    while (true) {
        await openDiscordLootbox();
        await delay(5000); // 5 seconds
    }
}

openLootbox();