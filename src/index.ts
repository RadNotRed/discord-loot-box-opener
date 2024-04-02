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

    const build_number = {
        'client_build_number': 280686
    };

    const response = await fetch('https://discord.com/api/v9/users/@me/lootboxes/open', {
        method: 'POST',
        headers: {
            'authorization': discordToken,
            'x-super-properties': Buffer.from(JSON.stringify(build_number)).toString('base64'),
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