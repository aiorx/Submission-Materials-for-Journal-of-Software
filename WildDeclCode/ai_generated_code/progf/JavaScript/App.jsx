import { useState } from 'react'


const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

//below are Designed via basic programming aids
// StatisticLine 组件定义
const StatisticLine = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>

// Statistics 组件定义
const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = total > 0 ? (good - bad) / total : 0;
  const positivePercentage = total > 0 ? (good / total) * 100 : 0;

  if (total === 0) {
    return <p>No feedback given</p>;
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={average.toFixed(1)} />
        <StatisticLine text="positive" value={positivePercentage.toFixed(1) + '%'} />
      </tbody>
    </table>
  );
};

// App 组件定义
const App = () => {
  // State hooks for each feedback type
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  // Event handlers for each button
  const increaseGood = () => setGood(good + 1);
  const increaseNeutral = () => setNeutral(neutral + 1);
  const increaseBad = () => setBad(bad + 1);

  return (
    <div>
      <h1>Give feedback</h1>
      <Button text="good" handleClick={increaseGood} />
      <Button text="neutral" handleClick={increaseNeutral} />
      <Button text="bad" handleClick={increaseBad} />

      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};





//codes below are writed by myself
/*
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const [allClicks, setAllclicks] = useState([])
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)


  const increaseByOneGood = () => {
    setAllclicks(allClicks.concat('good'))
    console.log('allClicks:',allClicks)
    const new_good = good + 1
    setGood(new_good)
    console.log('new_good:',new_good)

    const new_all = new_good + neutral + bad
    setAll(new_all)
    console.log('new_all:',new_all)

    const new_average = ( new_good*1 + neutral*0 + bad*(-1) ) / new_all
    setAverage(new_average)

    const new_positive = new_good / new_all * 100 + "%"
    setPositive(new_positive)
  }
  
  const increaseByOneNeutral = () => {
    setAllclicks(allClicks.concat('neutral'))
    console.log('allClicks:',allClicks)
    const new_neutral = neutral + 1
    setNeutral(new_neutral)
    console.log('new_neutral:',new_neutral)

    const new_all = good + new_neutral + bad
    setAll(new_all)
    console.log('new_all:',new_all)

    const new_average = ( good*1 + new_neutral*0 + bad*(-1) ) / new_all
    setAverage(new_average)

    const new_positive = good / new_all * 100 + "%"
    setPositive(new_positive)
  }
  
  const increaseByOneBad = () => {
    setAllclicks(allClicks.concat('bad'))
    console.log('allClicks:',allClicks)
    const new_bad = bad + 1
    setBad(new_bad)
    console.log('new_bad:',new_bad)

    const new_all = good + neutral + new_bad
    setAll(new_all)
    console.log('new_all:',new_all)

    const new_average = ( good*1 + neutral*0 + new_bad*(-1) ) / new_all
    setAverage(new_average)

    const new_positive = good / new_all * 100 + "%"
    setPositive(new_positive)
  }

  if (allClicks.length === 0) {
    return (
      <div>
        <h1>give feedback</h1>
        <Button handleClick={increaseByOneGood} text='good'/>
        <Button handleClick={increaseByOneNeutral} text='neutral'/>
        <Button handleClick={increaseByOneBad} text='bad'/>

        <h2>statistics</h2>
        No feedback given
      </div>
    )
  }
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={increaseByOneGood} text='good'/>
      <Button handleClick={increaseByOneNeutral} text='neutral'/>
      <Button handleClick={increaseByOneBad} text='bad'/>

      <h2>statistics</h2>
      <StatisticsLine text='good' counter={good} />
      <StatisticsLine text='neutral' counter={neutral} />
      <StatisticsLine text='bad' counter={bad} />
      <StatisticsLine text='all' counter={all} />
      <StatisticsLine text='average' counter={average} />
      <StatisticsLine text='positive' counter={positive} />


    </div>
  )
}
*/

export default App
