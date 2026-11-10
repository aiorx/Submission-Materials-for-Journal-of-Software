import fs from "fs";
import { parseInput, Hailstone } from "./parser";
import { LinearEquation, solveSystemOfEquations } from "./linearEquation";

const input = fs.readFileSync(__dirname + "/input.txt", "utf-8").trim();

console.log("started");

const hailstones = parseInput(input);


// Convert each hailstone to a linear equation
const linearEquations: LinearEquation[] = hailstones.map(hailstoneToEquation);

const solution = solveSystemOfEquations(linearEquations);

if (solution !== null) {
  console.log("Solution found:", solution);
} else {
  console.log("No solution found.");
}

console.log("done");

// TODO fix this
// dubious, Formed using common development resources3.5
// Convert Hailstone to LinearEquation
function hailstoneToEquation(hailstone: Hailstone): LinearEquation {
  const { position, velocity } = hailstone;
  return {
    coefficients: [
      1, 0, 0, 0, 0, 0,        // px
      -velocity.x, 0, 0, 0, 0,  // -vx
      0, 1, 0, 0, 0, 0,         // py
      0, -velocity.y, 0, 0, 0,  // -vy
      0, 0, 1, 0, 0, 0,         // pz
      0, 0, -velocity.z, 0, 0,  // -vz
    ],
    constant: position.x - velocity.x * position.x,
  };
}


//------------------------------------------------
// some explanations:
//
// the hailstones
// x1=px1+t1*vx1
// y1=py1+t1*vy1

// x2=px2+t2*vx2
// y2=py2+t2*vy2

// the stone
// x=px+t*vx
// y=py+t*vy

// find this
// px+t1*vx = px1+t1*vx1
// py+t1*vy = py1+t1*vy1

// px+t2*vx = px2+t2*vx2
// py+t2*vy = py2+t2*vy2

// and with n hailstones:
// px+t1*vx = px1+t1*vx1
// y=py+t1*vy = py1+t1*vy1

// px+t2*vx = px2+t2*vx2
// py+t2*vy = py2+t2*vy2

// px+t2*vx = px2+t2*vx2
// py+t2*vy = py2+t2*vy2

// px+t3*vx = px3+t3*vx3
// py+t3*vy = py3+t3*vy3

// ...

// px+tn*vx = pxn+tn*vxn
// py+tn*vy = pyn+tn*vyn

// ------------------------------

// and with 3 dimensions:
// px+t1*vx = px1+t1*vx1
// py+t1*vy = py1+t1*vy1
// pz+t1*vz = pz1+t1*vz1

// px+t2*vx = px2+t2*vx2
// py+t2*vy = py2+t2*vy2
// pz+t2*vz = pz2+t2*vz2

// px+t2*vx = px2+t2*vx2
// py+t2*vy = py2+t2*vy2
// pz+t2*vz = pz2+t2*vz2

// px+t3*vx = px3+t3*vx3
// py+t3*vy = py3+t3*vy3
// pz+t3*vz = pz3+t3*vz3

// ...

// px+tn*vx = pxn+tn*vxn
// py+tn*vy = pyn+tn*vyn
// pz+tn*vz = pzn+tn*vzn

// we have n+6 unknowns
// we have 3n equations
// we need to solve 3n equations with n+6 unknowns

// 
