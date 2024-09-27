"use client"

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap';
import CustomModal from "@/app/components/CustomModal";
import axios from 'axios';
import Navbar from "../../components/Navbar";
import "../../../../styles/wealth_maker.css";

export default function Services() {

  const {data: session} = useSession()
  const [gamblerExist, setgamblerExist] = useState(null);
  const [balance, setbalance] = useState(0);
  const [gained, setgained] = useState(0);
  const [masterCode, setmasterCode] = useState("");
  const [showAdminModal, setshowAdminModal] = useState(false);
  const secret = process.env.NEXT_PUBLIC_MASTER_CODE;
  const totalPercent = 100;
  const [emojiSlots, setemojiSlots] = useState({
    1: "",
    2: "",
    3: "",
  });
  const [visual, setvisual] = useState({
    spinAnimation: false,
    buttonDisable: false,
    imageHidden: true,
  });
  const [randomWeight, setrandomWeight] = useState("");
  const weight = !(masterCode === secret) ? randomWeight : "6".repeat(totalPercent);
  const emojis = {
    0: "🥢",
    1: "🥮",
    2: "👲",
    3: "🇨🇳",
    4: "🧧",
    5: "🐉",
    6: "🎰",
  };
  const [openShop, setopenShop] = useState(false);
  const shopItems = {
    "Item 1": 1000,
    "Item 2": 20,
    "Item 3": 200,
  }

  useEffect(() => {
    if (session) {
        initComponent();
    }   
  }, [session]);

  const initComponent = async () => {
    await checkExistingGambler();
    setSlotEmojis(2, 5, 6);
    setRandomWeight({
      r6: 1,
      r5: 3,
      r4: 7,
      r3: 14,
      r2: 20,
      r1: 25,
      r0: 30,
    });
  }

  const setRandomWeight = (weightPairs) => {
    const sum = Object.keys(weightPairs)
    .map(key => weightPairs[key])
    .reduce((cur, val) => cur + val, 0);

    if (sum !== totalPercent) {
      weightPairs["r0"] += totalPercent - sum;
    }

    const { r6, r5, r4, r3, r2, r1, r0 } = weightPairs;
    setrandomWeight("6".repeat(r6).concat("5".repeat(r5)).concat("4".repeat(r4)).concat("3".repeat(r3)).concat("2".repeat(r2)).concat("1".repeat(r1)).concat("0".repeat(r0)));
  }

  const setSlotEmojis = (key1, key2, key3) => {
    const emojiStates = {
        1: emojis[key1],
        2: emojis[key2],
        3: emojis[key3],
    };
    
    setemojiSlots({...emojiSlots, ...emojiStates})
  }

  const createGambler = async () => {
    const response = await axios.post("/api/wealth_maker/create", {
        "email": session.user.email,
        "balance": 1000,
    });

    if (response.status == 200) {
        alert("Welcome !!!");
        setgamblerExist(true);
    }
  }

  const checkExistingGambler = async () => {
    if (session?.user?.email) {
        const response = await axios.post("/api/wealth_maker/check_exist", {
            "email": session?.user?.email,
        })
    
        if (response.status == 200) {
            if (response.data.exist) {
                setgamblerExist(true);
                setbalance(response.data.balance);
            }
            else {
                setgamblerExist(false);
            }
        }
    }
  }

  const updateGamblerBalance = async (email, balance) => {
    const response = await axios.post("/api/wealth_maker/update_balance", {
        "email": email,
        "balance": balance,
    });

    if (response.data.status === 500) {
        alert("Unable to save your balance");
    }
  }

  const spinSlot = () => {
    if (balance <= 0) {
        alert("Bro's broke 😭🙏");
        return;
    }

    setvisual({...visual, ...{ spinAnimation: true, buttonDisable: true }})
    const slot2 = parseInt(weight.charAt(Math.floor(Math.random() * totalPercent)));
    const slot1 = parseInt(weight.charAt(Math.floor(Math.random() * totalPercent)));

    if (!(masterCode === secret)) {
        var slot3 = (slot1 + Math.floor(Math.random() * 3) - 1);
        if (slot3 > 6) {
            slot3 = (slot3 % 6) - 1;
        }
        if (slot3 < 0) {
            slot3 += 7;
        }
    }
    else {
        var slot3 = 6;
    }
    
    setTimeout(() => {
        setSlotEmojis(slot1, slot2, slot3);
        if (slot1 == slot2 && slot1 == slot3) {
            visual.imageHidden = false;
            const audio = document.getElementById("gong");
            const gain = (slot1 + 1) * 100 * Math.pow(10, slot1);
            const bal = balance + gain - 20;
            audio.play();
            setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
                setvisual({...visual, ...{ imageHidden: true }})
            }, 6500);
            setgained(gain);
            setbalance(bal);
            updateGamblerBalance(session.user.email, bal);
        }
        else {
            setbalance(balance - 20);
            setgained(0);
            updateGamblerBalance(session.user.email, balance - 20);
        }
        setvisual({...visual, ...{ spinAnimation: false , buttonDisable: false }});
    }, 800);
  }

  const handleShowAdminModal = (show) => {
    setshowAdminModal(show);
  }

  const handleSetMasterCode = () => {
    const code = document.getElementById("masterCode").value;
    setmasterCode(code);
  }

  const handleshowShop = (show) => {
    setopenShop(show);
  }

  const populateShopModal = () => {
    return (<>
      <div className="grid grid-cols-3 w-full justify-items-center">
        {Object.entries(shopItems).map(([itemName, price]) => (
          <div className="card" key={itemName}>
            <p>{itemName}</p>
            <Button className="w-4/5" variant="success">{price} $</Button>
          </div>
        ))}
      </div>
    </>)
  }

  const populateAdminCodeModal = () => {
    return (<>
      <input id="masterCode" className="w-11/12 px-3 py-2 mt-2 mb-3 rounded-md border-3 border-slate-300 bg-transparent" type="text" placeholder="Type here..."></input>
    </>)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2">
      <Navbar session = {session}/>
      <div className = "flex items-center justify-center flex-grow">
        {!session || gamblerExist === null ? (
            <h1 className="text-center">Loading...</h1>
        ) : gamblerExist === true ? (
        <div className="container mx-auto py-5">
            <img id="slotsWin" src="/images/slotsWin.jpg" className={`absolute w-auto h-full left-0 top-0 ${(visual["imageHidden"]) ? "hidden" : "animate-ping"}`}></img>
            <audio id="gong" src="/sounds/gong.mp3" className="hidden"></audio>
            <CustomModal show={openShop}
              setShow={setopenShop}
              content={populateShopModal}
              header={`Ni Hao Welcome to Shop`}
            />
            <CustomModal show={showAdminModal}
              setShow={setshowAdminModal}
              content={populateAdminCodeModal}
              header={`Enter Admin Code`}
              size={`sm`}
              onClose={handleSetMasterCode}
              closeText={`Submit`}
            />
            <Button className="shopButton" variant="primary" onClick={() => handleshowShop(true)}>Shop</Button>
            <Button className="adminButton" variant="secondary" onClick={() => handleShowAdminModal(true)}>Admin</Button>
            <h1 className="text-center font-bold text-3xl">Slot machine of Infinite Wealth 🙏</h1>
            <p className="text-center">Welcome {session?.user?.name}...Let's make money</p>
            <p className="text-center font-semibold">Your balance: ${balance}</p>
            <br></br>
            <div className="grid grid-cols-3 w-full justify-items-center">
                <div className="card" id="slot-1">
                    <p className={(visual["spinAnimation"]) ? "spin" : ""}>{emojiSlots[1]}</p>
                </div>
                <div className="card" id="slot-2">
                    <p className={(visual["spinAnimation"]) ? "spin" : ""}>{emojiSlots[2]}</p>
                </div>
                <div className="card" id="slot-3">
                    <p className={(visual["spinAnimation"]) ? "spin" : ""}>{emojiSlots[3]}</p>
                </div>
            </div>
            <br></br>
            <p className="text-center font-semibold">You've gained: ${gained}</p>
            <br></br>
            <div className={"text-center"}>
                <button className={`${(visual["buttonDisable"]) ? "cursor-not-allowed" : ""}`} style={{
                    borderColor: "darkgreen",
                    borderWidth: "2px",
                    borderRadius: "3px",
                    width: "40%",
                    color: "white",
                    backgroundColor: "green",
                    padding: "5px 10px 5px 10px",
                }} disabled={visual["buttonDisable"]} onClick={spinSlot}>Make Money</button>
            </div>
        </div>
        ) : (
        <div className="container mx-auto py-5">
          <div className="flex justify-center">
            <button onClick={createGambler} style={{
                borderColor: "black",
                borderWidth: "2px",
                color: "white",
                backgroundColor: "#faa118",
                padding: "5px 10px 5px 10px",
            }}>Become Rich !!!</button>
          </div>
        </div>
        )}
      </div> 
    </main>
  );
}