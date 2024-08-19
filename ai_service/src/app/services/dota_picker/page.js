"use client"

import Navbar from "../../components/Navbar";
import { useSession } from "next-auth/react";
import React from 'react'
import axios from 'axios'

export default function Services() {

    const {data: session} = useSession();
    
    const reset = async() => {
        for (var i = 1; i < 6; i++) {
            const inp = document.getElementById(`hero-${i}`);
            const tbl = document.getElementById(`counter-hero-${i}`);

            inp.value = "";
            tbl.innerHTML = "";
        }

        const fL = document.getElementById("full-List");
        fL.innerHTML = "";
    }

    const dotaMatchup = async(e, no) => {
        e.preventDefault();
        const oHeroName = e.target.value;
        const heroName = e.target.value.toLowerCase().split(" ").join("-");
        const allHero = ["abaddon","alchemist","ancient-apparition","anti-mage","arc-warden","axe","bane","batrider","beastmaster","bloodseeker","bounty-hunter","brewmaster","bristleback","broodmother","centaur-warrunner","chaos-knight","chen","clinkz","clockwerk","crystal-maiden","dark-seer","dark-willow","dawnbreaker","dazzle","death-prophet","disruptor","doom","dragon-knight","drow-ranger","earth-spirit","earthshaker","elder-titan","ember-spirit","enchantress","enigma","faceless-void","grimstroke","gyrocopter","hoodwink","huskar","invoker","io","jakiro","juggernaut","keeper-of-the-light","kunkka","legion-commander","leshrac","lich","lifestealer","lina","lion","lone-druid","luna","lycan","magnus","marci","mars","medusa","meepo","mirana","monkey-king","morphling","muerta","naga-siren","nature's-prophet","necrophos","night-stalker","nyx-assassin","ogre-magi","omniknight","oracle","outworld-destroyer","pangolier","phantom-assassin","phantom-lancer","phoenix","primal-beast","puck","pudge","pugna","queen-of-pain","razor","riki","rubick","sand-king","shadow-demon","shadow-fiend","shadow-shaman","silencer","skywrath-mage","slardar","slark","snapfire","sniper","spectre","spirit-breaker","storm-spirit","sven","techies","templar-assassin","terrorblade","tidehunter","timbersaw","tinker","tiny","treant-protector","troll-warlord","tusk","underlord","undying","ursa","vengeful-spirit","venomancer","viper","visage","void-spirit","warlock","weaver","windranger","winter-wyvern","witch-doctor","wraith-king","zeus"];

        if (allHero.includes(heroName)) {
            const id = "counter-hero-" + no;
            const fullList = document.getElementById("full-List");
            const response = await axios.post("/api/dota-picker", {'hero': heroName});

            if (response.data.status == 140){
                const listContainer = document.getElementById(id);

                if (fullList.childNodes.length > 0) {
                    const parser = new DOMParser();
                    const nData = parser.parseFromString(`<table>${response.data.fullList}</table>`, 'text/html');
                    const oData = parser.parseFromString(`<table>${fullList.innerHTML}</table>`, 'text/html');
                    const nRows = nData.getElementsByTagName("tr");
                    const oRows = oData.getElementsByTagName("tr");

                    const oScores = {};

                    Array.from(oRows).forEach(row => {
                        const cells = row.getElementsByTagName("td");
                        const rowData = Array.from(cells, cell => cell.textContent);

                        oScores[rowData[0]] = parseFloat(rowData[1]);
                    });

                    oScores[oHeroName] = -1000;
                    Array.from(nRows).forEach(row => {
                        const cells = row.getElementsByTagName("td");
                        const rowData = Array.from(cells, cell => cell.textContent);

                        oScores[rowData[0]] += parseFloat(rowData[1]);
                    })

                    const entries = Object.entries(oScores);
                    entries.sort((a, b) => b[1] - a[1]);

                    var fullInner = "";
                    const sortedOScores = Object.fromEntries(entries);
                    Object.entries(sortedOScores).forEach(([key, value]) => {
                            fullInner = fullInner.concat(`<tr class="group text-xs text-left"><td class="group-hover:bg-white">${key}</td><td class="group-hover:bg-white">${parseFloat(value.toFixed(3))}</td></tr>`)
                    })
                    listContainer.innerHTML = response.data.counters;
                    fullList.innerHTML = fullInner;
                }
                else {
                    listContainer.innerHTML = response.data.counters;
                    fullList.innerHTML = response.data.fullList + `<tr class="group text-xs text-left"><td class="group-hover:bg-white">${oHeroName}</td><td class="group-hover:bg-white">-1000</td></tr>`; 
                }
            }
        }
    }

    return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2">
      <Navbar session = {session}/>
      <div className = "flex items-center justify-center flex-grow">
        {!session ? (<p className = "text-center">
          Welcome to Ai Services...Please signin/signup at the top right corner
        </p>) : (
        <div className="container mx-auto py-5">
            <h1 className="text-center font-berkshire text-3xl m-10">Welcome {session?.user?.name}...This is the Dota Pick Assistance</h1>
            <datalist id="heroes">
                <option>Abaddon</option>
                <option>Alchemist</option>
                <option>Ancient Apparition</option>
                <option>Anti-Mage</option>
                <option>Arc Warden</option>
                <option>Axe</option>
                <option>Bane</option>
                <option>Batrider</option>
                <option>Beastmaster</option>
                <option>Bloodseeker</option>
                <option>Bounty Hunter</option>
                <option>Brewmaster</option>
                <option>Bristleback</option>
                <option>Broodmother</option>
                <option>Centaur Warrunner </option>
                <option>Chaos Knight</option>
                <option>Chen</option>
                <option>Clinkz</option>
                <option>Clockwerk</option>
                <option>Crystal Maiden</option>
                <option>Dark Seer</option>
                <option>Dark Willow</option>
                <option>Dawnbreaker</option>
                <option>Dazzle</option>
                <option>Death Prophet</option>
                <option>Disruptor</option>
                <option>Doom</option>
                <option>Dragon Knight</option>
                <option>Drow Ranger</option>
                <option>Earth Spirit</option>
                <option>Earthshaker</option>
                <option>Elder Titan</option>
                <option>Ember Spirit</option>
                <option>Enchantress</option>
                <option>Enigma</option>
                <option>Faceless Void</option>
                <option>Grimstroke</option>
                <option>Gyrocopter</option>
                <option>Hoodwink</option>
                <option>Huskar</option>
                <option>Invoker</option>
                <option>Io</option>
                <option>Jakiro</option>
                <option>Juggernaut</option>
                <option>Keeper of the Light</option>
                <option>Kunkka</option>
                <option>Legion Commander</option>
                <option>Leshrac</option>
                <option>Lich</option>
                <option>Lifestealer</option>
                <option>Lina</option>
                <option>Lion</option>
                <option>Lone Druid</option>
                <option>Luna</option>
                <option>Lycan</option>
                <option>Magnus</option>
                <option>Marci</option>
                <option>Mars</option>
                <option>Medusa</option>
                <option>Meepo</option>
                <option>Mirana</option>
                <option>Monkey King</option>
                <option>Morphling</option>
                <option>Muerta</option>
                <option>Naga Siren</option>
                <option>Nature's Prophet</option>
                <option>Necrophos</option>
                <option>Night Stalker</option>
                <option>Nyx Assassin</option>
                <option>Ogre Magi</option>
                <option>Omniknight</option>
                <option>Oracle</option>
                <option>Outworld Destroyer</option>
                <option>Pangolier</option>
                <option>Phantom Assassin</option>
                <option>Phantom Lancer</option>
                <option>Phoenix</option>
                <option>Primal Beast</option>
                <option>Puck</option>
                <option>Pudge</option>
                <option>Pugna</option>
                <option>Queen of Pain</option>
                <option>Razor</option>
                <option>Riki</option>
                <option>Rubick</option>
                <option>Sand King</option>
                <option>Shadow Demon</option>
                <option>Shadow Fiend</option>
                <option>Shadow Shaman</option>
                <option>Silencer</option>
                <option>Skywrath Mage</option>
                <option>Slardar</option>
                <option>Slark</option>
                <option>Snapfire</option>
                <option>Sniper</option>
                <option>Spectre</option>
                <option>Spirit Breaker</option>
                <option>Storm Spirit</option>
                <option>Sven</option>
                <option>Techies</option>
                <option>Templar Assassin</option>
                <option>Terrorblade</option>
                <option>Tidehunter</option>
                <option>Timbersaw</option>
                <option>Tinker</option>
                <option>Tiny</option>
                <option>Treant Protector</option>
                <option>Troll Warlord</option>
                <option>Tusk</option>
                <option>Underlord</option>
                <option>Undying</option>
                <option>Ursa</option>
                <option>Vengeful Spirit</option>
                <option>Venomancer</option>
                <option>Viper</option>
                <option>Visage</option>
                <option>Void Spirit</option>
                <option>Warlock</option>
                <option>Weaver</option>
                <option>Windranger</option>
                <option>Winter Wyvern</option>
                <option>Witch Doctor</option>
                <option>Wraith King</option>
                <option>Zeus</option>
            </datalist>
            <p className="text-center">Select the enemy's lineup</p>
            <div className="flex justify-center">
                <button className="bg-white border-2 p-2 rounded-lg text-sm my-3 w-1/5 hover:bg-red-700 hover:text-white hover:shadow-lg hover:shadow-gray-900" onClick={reset}>Reset</button>
            </div>
            <div className="grid grid-cols-5 w-full">
                <input id="hero-1" onChange={(e) => dotaMatchup(e, "1")} className="p-3 border-2 border-black rounded-lg text-sm m-2" autoComplete="on" list="heroes"/>
                <input id="hero-2" onChange={(e) => dotaMatchup(e, "2")} className="p-3 border-2 border-black rounded-lg text-sm m-2" autoComplete="on" list="heroes"/>
                <input id="hero-3" onChange={(e) => dotaMatchup(e, "3")} className="p-3 border-2 border-black rounded-lg text-sm m-2" autoComplete="on" list="heroes"/>
                <input id="hero-4" onChange={(e) => dotaMatchup(e, "4")} className="p-3 border-2 border-black rounded-lg text-sm m-2" autoComplete="on" list="heroes"/>
                <input id="hero-5" onChange={(e) => dotaMatchup(e, "5")} className="p-3 border-2 border-black rounded-lg text-sm m-2" autoComplete="on" list="heroes"/>
                <table id="counter-hero-1" className="w-full">
                </table>
                <table id="counter-hero-2" className="w-full">
                </table>
                <table id="counter-hero-3" className="w-full">
                </table>
                <table id="counter-hero-4" className="w-full">
                </table>
                <table id="counter-hero-5" className="w-full">
                </table>
            </div>
            <div className="m-3 w-full h-1 shadow-md shadow-stone-700"></div>
            <div className="flex flex-col items-center justify-center flex-grow">
                <h1 className="text-center font-berkshire text-3xl m-10">Overall Scores</h1>
                <table id="full-List" className="items-center justify-center w-48">
                </table>
            </div>
        </div>
        )}
      </div> 
    </main>
  );
}