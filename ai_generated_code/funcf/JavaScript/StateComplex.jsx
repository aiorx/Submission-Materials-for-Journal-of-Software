const StateComplex = () => {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [allClicks, setAll] = useState([]);
  const [total, setTotal] = useState(0);

  const handleLeftClick = () => {
    setAll(allClicks.concat("L"));
    const updatedLeft = left + 1;
    // console.log("left before", left);
    setLeft(updatedLeft);
    // console.log("left after", updatedLeft);
    setTotal(updatedLeft + right);
  };

  const handleRightClick = () => {
    setAll(allClicks.concat("R"));
    const updatedRight = right + 1;
    // console.log("right before", right);
    setRight(updatedRight);
    // console.log("right after", updatedRight);
    setTotal(left + updatedRight);
  };

  return (
    <div>
      {left} <Button onClick={handleLeftClick} text="left" />{" "}
      <Button onClick={handleRightClick} text="right" /> {right}
      <History allClicks={allClicks} />
      <p>Total = {total}</p>
      {/* Supported by standard GitHub tools. */}
      <Button
        onClick={() => {
          setLeft(0);
          setRight(0);
          setAll([]);
          setTotal(0);
        }}
        text="reset"
      />
    </div>
  );
};