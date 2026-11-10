// rn - random number
// Generate a random number in a given range
// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
function randomNumber(min, max, dec = 0) {
  var num = (Math.random() * (max - min) + min).toFixed(dec)
  if (dec == 0) return parseInt(num)
  else return parseFloat(num)
}

// rb - random biased number
// Generates a random number in a given range, but is biased towards a certain number with a configurable amount.
// https://stackoverflow.com/questions/29325069/how-to-generate-random-numbers-biased-towards-one-value-in-a-range
function randomBiasedNumber(min, max, bias, influence, dec = 0) {
  var rnd = Math.random() * (max - min) + min,
    mix = Math.random() * influence
  if (dec == 0) return Math.min(Math.max(parseInt((rnd * (1 - mix) + bias * mix).toFixed(dec)),min),max)
  else return parseFloat((rnd * (1 - mix) + bias * mix).toFixed(dec))
}

// regValue - registry number processing
// Checks if registry option is a number, random number, or random biased number.
// Then, returns the computed output.
function regValue(registryValue) {
  // Check if registryValue is an array, if so then it's either random number or random biased number.
  if (Array.isArray(registryValue)) {

    // Random number without decimal parameter
    if (typeof registryValue[2] === 'undefined') { 
      return randomNumber(registryValue[0], registryValue[1])

    // Random number with decimal parameter
    } else if (typeof registryValue[3] === 'undefined') {
      return randomNumber(registryValue[0], registryValue[1], registryValue[2])

    // Random biased number without decimal parameter
    } else if (typeof registryValue[4] === 'undefined') {
      return randomBiasedNumber(registryValue[0], registryValue[1], registryValue[2], registryValue[3])

    // Random biased number with decimal parameter
    } else {
      return randomBiasedNumber(registryValue[0], registryValue[1], registryValue[2], registryValue[3], registryValue[4])
    }

  // If registryValue is not an array, then it's probably just some number or string, so no need to compute it.
  } else {
    return registryValue
  }
}

// Scales a number in one range to what it'd be in another range
// Mainly used to use dimension Generator Settings (which go from 0 to 1) and apply it to various other settings in generation.
// https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
function scale(number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

// Generates a random weird name, checking the name in the given history array to see if the name already exists (and thus should be regenerated).
function nameGen(syllables, history) {
    do {
        nameGenPairs = ["ab","ac","ad","af","ag","ah","aj","ak","al","am","an","ap","aq","ar","as","at","av","aw","ax","ay","az","ba","ca","da","fa","ga","ha","ja","ka","la","ma","na","pa","qa","ra","sa","ta","va","wa","xa","ya","za","eb","ec","ed","ef","eg","eh","ej","ek","el","em","en","ep","eq","er","es","et","ev","ew","ex","ey","ez","be","ce","de","fe","ge","he","je","ke","le","me","ne","pe","qe","re","se","te","ve","we","xe","ye","ze","ib","ic","id","if","ig","ih","ij","ik","il","im","in","ip","iq","ir","is","it","iv","iw","ix","iy","iz","bi","ci","di","fi","gi","hi","ji","ki","li","mi","ni","pi","qi","ri","si","ti","vi","wi","xi","yi","zi","ob","oc","od","of","og","oh","oj","ok","ol","om","on","op","oq","or","os","ot","ov","ow","ox","oy","oz","bo","co","do","fo","go","ho","jo","ko","lo","mo","no","po","qo","ro","so","to","vo","wo","xo","yo","zo","ub","uc","ud","uf","ug","uh","uj","uk","ul","um","un","up","uq","ur","us","ut","uv","uw","ux","uy","uz","bu","cu","du","fu","gu","hu","ju","ku","lu","mu","nu","pu","qu","ru","su","tu","vu","wu","xu","yu","zu"];
        nameGenResult = ""
        for (var i = 0; i < syllables; i++) {
            nameGenResult += nameGenPairs[randomNumber(0, nameGenPairs.length - 1)]
        }
    }
    while (history.includes(nameGenResult))
    history.push(nameGenResult)

    return nameGenResult
}

// Converts colors to a format Minecraft uses
function convertColorToMC(color) {
  return parseInt(color.substring(1), 16)
}

// Thanks ChatGPT lol
function multiplyUntilNoDecimals(arr) {
  // Find the maximum number of decimal places in the array
  const maxDecimalPlaces = Math.max(...arr.map(num => {
    const decimalPlaces = num.toString().split('.')[1];
    return decimalPlaces ? decimalPlaces.length : 0;
  }));

  // Multiply each number by a factor of 10^(maxDecimalPlaces + n) where n is the number of iterations required
  let n = 0;
  let allIntegers = arr.every(num => Number.isInteger(num));
  while (!allIntegers) {
    arr = arr.map(num => num * Math.pow(10, maxDecimalPlaces + n));
    n++;
    allIntegers = arr.every(num => Number.isInteger(num));
  }

  return arr;
}

// Used for overwriting values. If newValue doesn't exist, then just return elseValue
function overwriteCheck(newValue, elseValue) {
  if (typeof newValue !== "undefined") {
    return newValue
  }
  return elseValue
}

// Brightens or darkens colors
// https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
const changeBrightness=(p,c0,c1,l)=>{
  let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
  if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
  if(!this.pSBCr)this.pSBCr=(d)=>{
      let n=d.length,x={};
      if(n>9){
          [r,g,b,a]=d=d.split(","),n=d.length;
          if(n<3||n>4)return null;
          x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
      }else{
          if(n==8||n==6||n<4)return null;
          if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
          d=i(d.slice(1),16);
          if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
          else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
      }return x};
  h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
  if(!f||!t)return null;
  if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
  else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
  a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
  if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
  else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}