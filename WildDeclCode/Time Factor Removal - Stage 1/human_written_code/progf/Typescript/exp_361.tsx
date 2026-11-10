var _import = require('react');
var create = require('./graph/createGraph');
var GraphElement = require('./component/graph');
require('./App.css');
var Input = require('./component/input');
var input = require('./inputFormat');

interface IGraph { nodes: { id: number, label: string }[], edges: { from: number, to: number }[] }

function App() {
  const [inputString, setinputString] = useState('');
  const [graph, setGraph]         = useState<IGraph>({ nodes: [], edges: [] });
  const [showGraph, setShowGraph] = useState(false);
  const [inputFormat, setinputFormat] = useState("edg");
  const [graphType, setGraphType] = useState("undirected");
  const [error, setError]         = useState("");
  const [isWeighted,setIsWeighted]= useState(false);
  const [is0,setIs0]              = useState(false);
  const [inputType, setInputType] = useState("plain");
  let f=input[is0?"s0":"s1"][inputType][isWeighted?"w":"unw"][inputFormat]
  React.useEffect(function () {
    setinputString(f.in)
  },[f])
  const parse = function () {
    setError("");
    try {
      setGraph(create(inputString.trim(), inputFormat, graphType, isWeighted,is0, inputType==="plain"));
      setShowGraph(true);
    } catch (err) {
      console.error(err)
      console.error(err.message)
      setError("Enter a valid Array according to the format.");
    }
  }

  if (showGraph)
    return <GraphElement
      graph={graph}
      inputString={inputString}
      graphType={graphType}
      inputFormat={inputFormat}
      isDirected={graphType === "directed"}
      isWeighted={isWeighted}
      setShowGraph={setShowGraph}
      is0={is0}
    />
  // var f=isWeighted?inputFormat.w[inputFormat]:inputFormat.unw[inputFormat]
  // if(is0){
  //   f=JSON.parse(JSON.stringify(f).split('').map((e:any)=> (e!==' ' && !isNaN(e))? parseInt(e)-1: e).join(""))
  // }
  const props={
    isWeighted, setIsWeighted,setinputString,
    parse,inputString,setinputFormat, is0,setIs0,
    inputFormat,setGraphType,graphType,error,
    inputType, setInputType,
    format:f
  }
  return  <Input {...props} /> ;
}

module.exports = App;
