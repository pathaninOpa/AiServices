"use client"

import Navbar from "../../components/Navbar";
import { useSession } from "next-auth/react";
import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'

export default function Services() {
    const [allies, setAlly] = useState({
        "ally-1": "",
        "ally-2": "",
        "ally-3": "",
        "ally-4": "",
        "ally-5": "",
    });
    const [allyInputValid, setallyInputValid] = useState({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
    })
    const [enemies, setEnemy] = useState({
        "enemy-1": "",
        "enemy-2": "",
        "enemy-3": "",
        "enemy-4": "",
        "enemy-5": "",
    })
    const [enemyInputValid, setenemyInputValid] = useState({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
    })
    const dataListRef = useRef(null);
    const [options, setoptions] = useState([]);
    const [showMars, setshowMars] = useState(false);
    const {data: session} = useSession();

    useEffect(() => {
        if (dataListRef.current) {
            const data = dataListRef.current.querySelectorAll("option");
            const dataArray = Array.from(data).map((hero) => hero.value);
            setoptions(dataArray);
        }
    }, [dataListRef])
    
    const reset = async () => {
        const shieldBash = document.getElementById("shieldBash");

        for (var i = 1; i < 6; i++) {
            const enemyInput = document.getElementById(`enemy-${i}`);
            const counterScore = document.getElementById(`counter-hero-${i}`);
            const allyInput = document.getElementById(`ally-${i}`);
            const allyScore = document.getElementById(`score-ally-${i}`);

            enemyInput.value = "";
            counterScore.innerHTML = "";
            allyInput.value = "";
            allyScore.innerHTML = "";

            enemyInput.classList.remove("bg-red-500");
            enemyInput.classList.remove("text-white");
            enemyInput.classList.add("hover:bg-red-100");

            allyInput.classList.remove("bg-green-500");
            allyInput.classList.remove("text-white");
            allyInput.classList.add("hover:bg-green-100");
        }

        const fL = document.getElementById("full-List");
        fL.innerHTML = "";
        
        shieldBash.play();
        setshowMars(true);
        setTimeout(() => {
            shieldBash.pause();
            shieldBash.currentTime = 0;
            setshowMars(false);
        }, 950);
    }

    const checkAlly = (name) => {
        var id;

        switch(name) {
            case allies["ally-1"]:
                id = 1;
                break;
            case allies["ally-2"]:
                id = 2;
                break;
            case allies["ally-3"]:
                id = 3;
                break;
            case allies["ally-4"]:
                id = 4;
                break;
            case allies["ally-5"]:
                id = 5;
                break;
            default:
                id = 140;
        }
        return {"exists": id != 140, "id": id};
    }

    const checkEnemy = (name) => {
        return name === enemies["enemy-1"] || name === enemies["enemy-2"] || name === enemies["enemy-3"] || name === enemies["enemy-4"] || name === enemies["enemy-5"];
    }

    const handleSetAlly = (name, no) => {
        if (!options.includes(name)) {
            setallyInputValid(prevState => ({
                ...prevState,
                [no]: false,
            }))
            return;
        }

        setAlly(prevState => ({
            ...prevState,
            [`ally-${no}`]: name
        }));

        setallyInputValid(prevState => ({
            ...prevState,
            [no]: true,
        }))

        const fullList = document.getElementById("full-List");
        const rows = fullList.getElementsByTagName("tr");

        for (var row of Array.from(rows)) {
            const data = row.getElementsByTagName("td");
            const rowData = Array.from(data, cell => cell.textContent);

            if (rowData[0] == name) {
                const allyScore = document.getElementById(`score-ally-${no}`);

                row.className = "group text-xs text-left hidden";
                allyScore.innerHTML = `<tr class="group text-xs text-left"><td class="group-hover:bg-white">${name}</td><td class="group-hover:bg-white">${parseFloat(rowData[1]).toFixed(3)}</td></tr>`;
                break;
            }

            row.className = "group text-xs text-left";
        }
        
    }

    const dotaMatchup = async(e, no) => {
        if (!options.includes(e.target.value)) {
            setenemyInputValid(prevState => ({
                ...prevState,
                [no]: false,
            }))
            return;
        }

        e.preventDefault();
        const oHeroName = e.target.value;
        const heroName = e.target.value.toLowerCase().split(" ").join("-");
        // const allHero = ["abaddon","alchemist","ancient-apparition","anti-mage","arc-warden","axe","bane","batrider","beastmaster","bloodseeker","bounty-hunter","brewmaster","bristleback","broodmother","centaur-warrunner","chaos-knight","chen","clinkz","clockwerk","crystal-maiden","dark-seer","dark-willow","dawnbreaker","dazzle","death-prophet","disruptor","doom","dragon-knight","drow-ranger","earth-spirit","earthshaker","elder-titan","ember-spirit","enchantress","enigma","faceless-void","grimstroke","gyrocopter","hoodwink","huskar","invoker","io","jakiro","juggernaut","keeper-of-the-light","kunkka","legion-commander","leshrac","lich","lifestealer","lina","lion","lone-druid","luna","lycan","magnus","marci","mars","medusa","meepo","mirana","monkey-king","morphling","muerta","naga-siren","nature's-prophet","necrophos","night-stalker","nyx-assassin","ogre-magi","omniknight","oracle","outworld-destroyer","pangolier","phantom-assassin","phantom-lancer","phoenix","primal-beast","puck","pudge","pugna","queen-of-pain","razor","riki","rubick","sand-king","shadow-demon","shadow-fiend","shadow-shaman","silencer","skywrath-mage","slardar","slark","snapfire","sniper","spectre","spirit-breaker","storm-spirit","sven","techies","templar-assassin","terrorblade","tidehunter","timbersaw","tinker","tiny","treant-protector","troll-warlord","tusk","underlord","undying","ursa","vengeful-spirit","venomancer","viper","visage","void-spirit","warlock","weaver","windranger","winter-wyvern","witch-doctor","wraith-king","zeus"];

        setenemyInputValid(prevState => ({
            ...prevState,
            [no]: true,
        }))
        setEnemy(prevState => ({
            ...prevState,
            [`enemy-${no}`]: oHeroName
        }));

        const id = "counter-hero-" + no;
        const fullList = document.getElementById("full-List");
        const response = await axios.post("/api/dota-picker", {'hero': heroName});
        if (response.data.status = 140) {
            const parser = new DOMParser();
            const listContainer = document.getElementById(id);
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

                if (Array.from(oRows).length != 0)
                    oScores[rowData[0]] += parseFloat(rowData[1]);
                else
                    oScores[rowData[0]] = parseFloat(rowData[1]);
            })

            const entries = Object.entries(oScores);
            entries.sort((a, b) => b[1] - a[1]);

            var fullInner = "";
            const sortedOScores = Object.fromEntries(entries);
            Object.entries(sortedOScores).forEach(([key, value]) => {
                const allyStatus = checkAlly(key);
                if (checkEnemy(key) || allyStatus.exists || key == oHeroName) {
                    fullInner = fullInner.concat(`<tr class="group text-xs text-left hidden"><td class="group-hover:bg-white">${key}</td><td class="group-hover:bg-white">${parseFloat(value.toFixed(3))}</td></tr>`);

                    if (allyStatus.exists) {
                        const allyScore = document.getElementById(`score-ally-${allyStatus.id}`);
                        allyScore.innerHTML = `<tr class="group text-xs text-left"><td class="group-hover:bg-white">${allies[`ally-${allyStatus.id}`]}</td><td class="group-hover:bg-white">${parseFloat(value.toFixed(3))}</td></tr>`;
                    }
                }
                else {
                    fullInner = fullInner.concat(`<tr class="group text-xs text-left"><td class="group-hover:bg-white">${key}</td><td class="group-hover:bg-white">${parseFloat(value.toFixed(3))}</td></tr>`);
                }
            })
            listContainer.innerHTML = response.data.counters;
            fullList.innerHTML = fullInner;
        }
    }

    return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2">
      <Navbar session = {session}/>
      <div className = "flex items-center justify-center flex-grow">
      <datalist ref={dataListRef} id="heroes">
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
        {!session ? (<p className = "text-center">
          Loading...
        </p>) : (
        <div className="container mx-auto py-5">
            <h1 className="text-center font-berkshire text-3xl m-10">Welcome {session?.user?.name}...This is the Dota Pick Assistance</h1>
            <img id="mars-Jumpscare" src="/images/mars.jpg" className={`absolute w-full h-auto left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ${showMars ? "animate-ping" : "hidden"}`}></img>
            <audio id="shieldBash" src="/sounds/shield-bash.mp3" className="hidden"></audio>
            <p className="text-center">Select lineups</p>
            <div className="flex justify-center">
                <button className="bg-white border-2 p-2 rounded-lg text-sm my-3 w-1/5 hover:bg-red-700 hover:text-white hover:shadow-lg hover:shadow-gray-900" onClick={reset}>Reset</button>
            </div>
            <p className="text-lg hover:text-xl inline-block">Ally Team</p>
            <div className="grid grid-cols-5 w-full">
                <input id="ally-1" onChange={e => handleSetAlly(e.target.value, 1)} className={`p-3 border-2 border-black rounded-lg text-sm m-2 ${allyInputValid[1] ? "bg-green-500 text-white focus:bg-green-700" : "hover:bg-green-100 focus:bg-green-300"}`} autoComplete="on" list="heroes"/>
                <input id="ally-2" onChange={e => handleSetAlly(e.target.value, 2)} className={`p-3 border-2 border-black rounded-lg text-sm m-2 ${allyInputValid[2] ? "bg-green-500 text-white focus:bg-green-700" : "hover:bg-green-100 focus:bg-green-300"}`} autoComplete="on" list="heroes"/>
                <input id="ally-3" onChange={e => handleSetAlly(e.target.value, 3)} className={`p-3 border-2 border-black rounded-lg text-sm m-2 ${allyInputValid[3] ? "bg-green-500 text-white focus:bg-green-700" : "hover:bg-green-100 focus:bg-green-300"}`} autoComplete="on" list="heroes"/>
                <input id="ally-4" onChange={e => handleSetAlly(e.target.value, 4)} className={`p-3 border-2 border-black rounded-lg text-sm m-2 ${allyInputValid[4] ? "bg-green-500 text-white focus:bg-green-700" : "hover:bg-green-100 focus:bg-green-300"}`} autoComplete="on" list="heroes"/>
                <input id="ally-5" onChange={e => handleSetAlly(e.target.value, 5)} className={`p-3 border-2 border-black rounded-lg text-sm m-2 ${allyInputValid[5] ? "bg-green-500 text-white focus:bg-green-700" : "hover:bg-green-100 focus:bg-green-300"}`} autoComplete="on" list="heroes"/>
                <table id="score-ally-1" className="w-full">
                </table>
                <table id="score-ally-2" className="w-full">
                </table>
                <table id="score-ally-3" className="w-full">
                </table>
                <table id="score-ally-4" className="w-full">
                </table>
                <table id="score-ally-5" className="w-full">
                </table>
            </div>
            <p className="mt-4 text-lg hover:text-xl inline-block">Enemy Team</p>
            <div className="grid grid-cols-5 w-full">
                <input id="enemy-1" onChange={(e) => dotaMatchup(e, "1")} className={`p-3 border-2 border-black rounded-lg text-sm m-2 ${enemyInputValid[1] ? "bg-red-500 text-white focus:bg-red-700" : "hover:bg-red-100 focus:bg-red-300"}`} autoComplete="on" list="heroes"/>
                <input id="enemy-2" onChange={(e) => dotaMatchup(e, "2")} className={`p-3 border-2 border-black rounded-lg text-sm m-2 ${enemyInputValid[2] ? "bg-red-500 text-white focus:bg-red-700" : "hover:bg-red-100 focus:bg-red-300"}`} autoComplete="on" list="heroes"/>
                <input id="enemy-3" onChange={(e) => dotaMatchup(e, "3")} className={`p-3 border-2 border-black rounded-lg text-sm m-2 ${enemyInputValid[3] ? "bg-red-500 text-white focus:bg-red-700" : "hover:bg-red-100 focus:bg-red-300"}`} autoComplete="on" list="heroes"/>
                <input id="enemy-4" onChange={(e) => dotaMatchup(e, "4")} className={`p-3 border-2 border-black rounded-lg text-sm m-2 ${enemyInputValid[4] ? "bg-red-500 text-white focus:bg-red-700" : "hover:bg-red-100 focus:bg-red-300"}`} autoComplete="on" list="heroes"/>
                <input id="enemy-5" onChange={(e) => dotaMatchup(e, "5")} className={`p-3 border-2 border-black rounded-lg text-sm m-2 ${enemyInputValid[5] ? "bg-red-500 text-white focus:bg-red-700" : "hover:bg-red-100 focus:bg-red-300"}`} autoComplete="on" list="heroes"/>
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