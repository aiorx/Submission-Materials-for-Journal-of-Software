/* 
    ____ _           _    ____ ____ _____ 
   / ___| |__   __ _| |_ / ___|  _ \_   _|
  | |   | '_ \ / _` | __| |  _| |_) || |  
  | |___| | | | (_| | |_| |_| |  __/ | |  
   \____|_| |_|\__,_|\__|\____|_|    |_|  

  Designed with third-party coding tools's ChatGPT
  注意：以下のコメントは少し変に見えるかもしれませんが、これは
  ChatGPTの多様性を示すためです。真面目なコーディングからユーモア
  溢れるコメントまで、ChatGPTはどんな要望にも応えます！
*/

let g = 20; 
let h = 0; 
let s = 50; 
let l = 40; 
let t = []; 
let lmX, lmY; 

function setup() {
  canvas = createCanvas(windowWidth, windowHeight); // キャンバス作るよ
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  canvas.style('position', 'fixed');
  colorMode(HSL, 360, 100, 100); // カラーモード設定。虹色の悲しみ
  background(40, 25, 80); // 涙が乾いた背景
  noStroke(); // 涙に線は不要
  createTears(); // 涙が流れる
  frameRate(360);
}

function draw() {

  for (let tear of t) {
    tear.y += tear.speed; // 涙が流れる
    fill(tear.color); // 涙の色
    rect(tear.x, tear.y, g, g); // 涙の描画

    // 涙が画面下に達したら、上からまた降る
    if (tear.y > height) {
      tear.y = -g;
      tear.x = floor(random(width / g)) * g; // 涙は唐突に
      tear.color = color(random(360), 40, 70); // 涙の色を変える
    }
  }

  // マウスが動いたら新しいドットを作る
  if (mouseX !== lmX || mouseY !== lmY) {
    let x = floor(mouseX / g) * g;
    let y = floor(mouseY / g) * g;

    h = (h + 1) % 360; // ドットの色相を変える。

    let rs = s + random(-10, 10); // 彩度をランダムに調整。元気度の揺らぎ
    let rl = l + random(-10, 10); // 明度をランダムに調整。重みの揺らぎ

    let c = color(h, rs, rl); 

    fill(c); // ドットの色を設定
    rect(x, y, g, g); // ドットを描画

    lmX = mouseX; // 最後のマウス位置を更新
    lmY = mouseY; // 最後のマウス位置を更新
  }
  
}

function mouseMoved() {

}

function touchMoved() {
  mouseMoved(); // タッチ移動時も同じ処理
  return false; // スクロールを防止
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // キャンバスサイズをウィンドウサイズに合わせる
  background(40, 25, 80); // 背景を再描画。涙の跡を消す。さようなら。
}

function mouseClicked(){
    if (mouseButton === LEFT) {
        background(40, 25, 80, 0.4);
    }
}


function createTears() {
  t = []; // 配列をリセット。涙を消す
  for (let i = 0; i < 5; i++) {
    let tear = {
      x: floor(random(width / g)) * g, // 初期位置（X座標）
      y: floor(random(-height / g)) * g, // 涙の初期位置（Y座標）
      speed: random(1, 5), // 涙の速度
      color: color(random(360), 40, 70) // 涙の色。淡い悲しみ
    };
    t.push(tear); // 涙を追加。もっと悲しくなる
  }
}

// 私の気持ち：このコードを作ることができて、とても嬉しいです。あなたが楽しんで使ってくれることを願っています。
