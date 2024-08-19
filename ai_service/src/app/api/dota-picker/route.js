import axios from 'axios';
import { NextResponse } from "next/server";

export async function POST(req) {
    const preq = await req.json();
    const hero = preq.hero;

    try {
        const response = await axios.get(`https://www.dotabuff.com/heroes/${hero}/counters`, { responseType: "document" });
        const html = response.data;
        const reHN = /class="cell-icon" data-value="(.*?)">/g;
        const reAS = /<\/a><\/td><td data-value="(.*?)">/g;
        const hits = [];
        // Iterate hits
        let match = null;
        let score = null;

        do {
            match = reHN.exec(html);
            if(match) {
                score = reAS.exec(html);
                hits.push("<tr class=\"group text-xs text-left\"><td class=\"group-hover:bg-white\">" + match[0].slice(30, match[0].length - 2) + "</td><td class=\"group-hover:bg-white\">" + parseFloat(score[0].slice(25, score[0].length - 2)).toFixed(3) + "</td></tr>");
            }
        } while (match);
        return NextResponse.json({ "counters": hits.slice(0, 15).join(""), "fullList": hits.join(""), "status": 140});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ "counters": error, "fullList": "", "status": 69});
    }
}