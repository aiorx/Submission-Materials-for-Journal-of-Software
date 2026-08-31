import "../index.css";
import React, { useEffect, useState } from "react";
import Wheel from "./Wheel";

function Home({ employeeId }) {
  const [spinning, setSpinning] = useState(false);
  const [winners, setWinners] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [visibility, setVisibility] = useState(false);

  if (window.localStorage.getItem("duration") === null)
    localStorage.setItem("duration", 10);

  if (window.localStorage.getItem("wheelColor") === null)
    localStorage.setItem("wheelColor", "#E50303");

  if (window.localStorage.getItem("fontColor") === null)
    localStorage.setItem("fontColor", "#FFFFFF");

  const [duration, setDuration] = useState(
    window.localStorage.getItem("duration")
  );

  const [wheelColor, setWheelColor] = useState(
    window.localStorage.getItem("wheelColor")
  );

  const [fontColor, setFontColor] = useState(
    window.localStorage.getItem("fontColor")
  );

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/projects")
      .then(response => response.json())
      .then(data => {
        setItems(data);
      })
      .catch(error => {
        console.error("Error fetching items:", error);
      });
  }, []);

  function redeemCoupon() {
    var chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var couponlength = 8;
    var code = "";

    for (var i = 0; i <= couponlength; i++) {
      let randomNumber = Math.floor(Math.random() * chars.length);
      code += chars.substring(randomNumber, randomNumber + 1);
    }
    console.log(code);
    setCoupon(code);
    setVisibility(true);
  }
  console.log(coupon);

  const onCopyText = () => {
    navigator.clipboard.writeText(coupon);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const selectResultEventHandler = (data) => {
    if (items.length > 0 && spinning !== true) {
      var selectedIndex = data;
      setSpinning(true);
      //disable spinning
      setTimeout(() => {
        setSpinning(false);
      }, window.localStorage.getItem("duration") * 1000);

      setTimeout(() => {
        setWinners(winners.concat(items[selectedIndex]));
      }, window.localStorage.getItem("duration") * 1000);

      setTimeout(() => {
        setOpenModal(true);
      }, window.localStorage.getItem("duration") * 1000);
    }
  };
  let newWinnerIndex = winners.length - 1;

  return (
    <section
      className="relative min-h-screen justify-evenly align-middle lg:flex md:flex-row sm:flex flex-row"
      style={{
        "align-items": "center",
        "background-color": "rgb(199,249,242)",
      }}
    >
      <Wheel
        items={items}
        onChange={selectResultEventHandler}
        spinning={spinning}
        wheelColor={wheelColor}
        fontColor={fontColor}
        employeeId={employeeId} // Pass the employee ID to the Wheel component
      />
      {openModal && (
        <div className="p-10 bg-gradient-to-t from-green-600 to-green-400  h-1/2  sm:w-full my-3 md:w-1/2 lg:w-1/2 rounded-md">
          <div
            className="flex flex-col justify-center font-bold"
            style={{ alignItems: "center" }}
          >
            <p>Selected:: {winners[newWinnerIndex]}</p>
            {visibility && (
              <div className="flex">
                <p className="rounded-l-full  bg-green-200 p-2 px-2">
                  {coupon}
                </p>
                <button
                  onClick={onCopyText}
                  className="rounded-r-full bg-green-900 p-2 px-3"
                >
                  Copy
                </button>
                <span
                  className={`${isCopied ? "block mx-1" : "hidden"}`}
                  style={{ color: "red" }}
                >
                  Copied!!
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Home;

// Assisted using common GitHub development utilities
