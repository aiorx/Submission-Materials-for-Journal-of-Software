// ============================================================================
//  Wii‑Tetris – ESP32 + MAX7219 (32 × 8)                                         
//  ✔ Flicker‑free  ✔ Correct controls  ✔ Start/Restart with PLUS                
//  ✔ Hard‑drop on Wiimote “2”  ✔ Score rotated for portrait display             
//  © 2025 – CC0  -- Code Composed with basic coding tools                                                              
// ============================================================================

enum PieceType { I, J, L, O, S, T, Z, PIECE_COUNT };

#include <Arduino.h>
#include <MD_MAX72xx.h>
#include <SPI.h>
#include <pgmspace.h>
#include <ESP32Wiimote.h>

// ───────────────────────── Display ──────────────────────────────────────────
#define LEDS 4
#define HW   MD_MAX72XX::FC16_HW
#define DIN  14
#define CLK  27
#define CS   16
#define BR   15
MD_MAX72XX mx(HW, DIN, CLK, CS, LEDS);
#define BUFFERED true

// ────────────────── Wiimote helper (fork‑safe) ──────────────────────────────
ESP32Wiimote wiimote; uint16_t prevBtns = 0;
#ifndef BUTTON_LEFT
#define BUTTON_LEFT   0x0800
#define BUTTON_RIGHT  0x0400
#define BUTTON_UP     0x0200
#define BUTTON_DOWN   0x0100
#define BUTTON_A      0x0008
#define BUTTON_B      0x0004
#define BUTTON_PLUS   0x1000
#define BUTTON_HOME   0x0080
#define BUTTON_ONE    0x0002
#define BUTTON_TWO    0x0001
#endif
static inline uint16_t btns()          { return wiimote.getButtonState(); }
static inline bool edge(uint16_t m)    { return (btns() & m) && !(prevBtns & m); }
static inline bool wiiOnline()         { return wiimote.available() >= 0; }

// ───────────────────── Game data ────────────────────────────────────────────
constexpr uint8_t W = 8, H = 20;                                  // 8 wide, 16 high
static bool board[H][W];
static const uint16_t PROGMEM SHP[PIECE_COUNT][4] = {
  {0x0F00,0x2222,0x00F0,0x4444},{0x8E00,0x6440,0x0E20,0x44C0},
  {0x2E00,0x4460,0x0E80,0xC440},{0x6600,0x6600,0x6600,0x6600},
  {0x6C00,0x8C40,0x06C0,0x4620},{0x4E00,0x4640,0x0E40,0x4C40},
  {0xC600,0x4C80,0x0C60,0x2640}
};
struct Piece { PieceType t; uint8_t r; int8_t x; int8_t y; } cur;
uint16_t score = 0; bool running = false;

// 3×5 digit glyphs (upright) --------------------------------------------------
const uint8_t DIG[10][5] PROGMEM = {
  {0b111,0b101,0b101,0b101,0b111},{0b010,0b110,0b010,0b010,0b111},
  {0b111,0b001,0b111,0b100,0b111},{0b111,0b001,0b111,0b001,0b111},
  {0b101,0b101,0b111,0b001,0b001},{0b111,0b100,0b111,0b001,0b111},
  {0b111,0b100,0b111,0b101,0b111},{0b111,0b001,0b010,0b010,0b010},
  {0b111,0b101,0b111,0b101,0b111},{0b111,0b101,0b111,0b001,0b111}
};

// ─── helpers ────────────────────────────────────────────────────────────────
static inline bool cell(PieceType t,uint8_t r,uint8_t x,uint8_t y){
  return pgm_read_word(&SHP[t][r&3]) & (0x8000 >> (y*4 + x)); }
static bool colli(int8_t nx,int8_t ny,uint8_t nr){
  for(uint8_t y=0;y<4;y++) for(uint8_t x=0;x<4;x++) if(cell(cur.t,nr,x,y)){
    int8_t bx=nx+x,by=ny+y; if(bx<0||bx>=W||by>=H) return true; if(by>=0&&board[by][bx]) return true; }
  return false; }
static void merge(){ for(uint8_t y=0;y<4;y++) for(uint8_t x=0;x<4;x++) if(cell(cur.t,cur.r,x,y)){
    int8_t bx=cur.x+x, by=cur.y+y; if(by>=0&&by<H&&bx>=0&&bx<W) board[by][bx]=true; }}
static void clr(){uint8_t c=0; for(int8_t y=H-1;y>=0;y--){ bool f=true; for(uint8_t x=0;x<W;x++) if(!board[y][x]){f=false;break;} if(f){c++; for(int8_t yy=y;yy>0;yy--) memcpy(board[yy],board[yy-1],W); memset(board[0],0,W); y++;}} if(c) score=(score+c)%100;}
static void spawn(){ cur.t=(PieceType)random(PIECE_COUNT); cur.r=0; cur.x=2; cur.y=-2; if(colli(cur.x,cur.y,cur.r)){ memset(board,0,sizeof(board)); score=0; running=false; }}

// ───────────────────── Display mapping ──────────────────────────────────────
constexpr uint8_t XOFF = 4;                              // board left margin
static inline void pset(uint8_t bx,uint8_t by,bool on){  // board→matrix (portrait)
  uint8_t col = by + XOFF;   // vertical
  uint8_t row = bx;          // horizontal (0..7)
  if(col < 32 && row < 8) mx.setPoint(row,col,on); }

// draw digit rotated 90° CW so it’s upright in portrait ----------------------
void drawDigitCW(uint8_t d,uint8_t baseRow,uint8_t baseCol){
  for(uint8_t r=0;r<5;r++){ uint8_t bits = pgm_read_byte(&DIG[d][r]);
    for(uint8_t c=0;c<3;c++) if(bits & (0b100 >> c)) {
      uint8_t row = baseRow + (c);   // width→rows (3)
      uint8_t col = baseCol + r;         // height→cols (5)
      if(row < 8 && col < 32) mx.setPoint(row,col,true); }} }

void drawScore(){ uint8_t t = score/10, o = score%10; drawDigitCW(t,0,27); drawDigitCW(o,5,27); }

static void render(){ mx.clear(); drawScore();
  for(uint8_t y=0;y<H;y++) for(uint8_t x=0;x<W;x++) if(board[y][x]) pset(x,y,true);
  if(running) for(uint8_t y=0;y<4;y++) for(uint8_t x=0;x<4;x++) if(cell(cur.t,cur.r,x,y)){
    int8_t bx=cur.x+x, by=cur.y+y; if(by>=0&&by<H&&bx>=0&&bx<W) pset(bx,by,true); }
  mx.update(); }

// ───────────────────── Timing ───────────────────────────────────────────────
uint32_t dropMS = 500, last = 0;

// ───────────────────── Setup ────────────────────────────────────────────────
void setup(){ Serial.begin(115200); randomSeed((uint32_t)esp_random()); mx.begin(); mx.control(MD_MAX72XX::INTENSITY,BR); if(BUFFERED) mx.control(MD_MAX72XX::UPDATE,MD_MAX72XX::OFF); mx.clear(); wiimote.init(); }

// ───────────────────── Loop ─────────────────────────────────────────────────
void loop(){ wiimote.task(); bool startFrame = false;
  if(wiiOnline()){
    if(!running && edge(BUTTON_PLUS)){ running=true; score=0; memset(board,0,sizeof(board)); spawn(); startFrame=true; }

    if(running){
      if(edge(BUTTON_LEFT)  && !colli(cur.x-1,cur.y,cur.r)) cur.x--;
      if(edge(BUTTON_RIGHT) && !colli(cur.x+1,cur.y,cur.r)) cur.x++;
      if(edge(BUTTON_DOWN)  && !colli(cur.x,  cur.y+1,cur.r)) cur.y++;
      if(edge(BUTTON_A)||edge(BUTTON_ONE)){ uint8_t nr=(cur.r+1)&3; if(!colli(cur.x,cur.y,nr)) cur.r=nr; }
      if(edge(BUTTON_B))                 { uint8_t nr=(cur.r+3)&3; if(!colli(cur.x,cur.y,nr)) cur.r=nr; }
      if(!startFrame && edge(BUTTON_TWO)) while(!colli(cur.x,cur.y+1,cur.r)) cur.y++; // hard‑drop
    }

    if(edge(BUTTON_HOME)){ running=false; memset(board,0,sizeof(board)); score=0; }
    prevBtns = btns(); }

  if(running){ uint32_t now=millis(); if(now-last>=dropMS){ last=now; if(!colli(cur.x,cur.y+1,cur.r)) cur.y++; else { merge(); clr(); spawn(); } }}
  render(); }
