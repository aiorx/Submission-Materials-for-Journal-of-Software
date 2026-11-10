/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {
        

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "") {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        public clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        public resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                
                } else if (chr === String.fromCharCode(8)) {  // the Backspace key
                    this.backspace();

                } else if (chr === String.fromCharCode(9)) { //Tab key time
                    this.tab();
                  
                } else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        }
        
        
        public tab(): void {
            const autoCompleteOptions = {  //a list of partial inputs as keys and their corresponding autocompleted endings as values. 
                "v": "er",
                "ve": "r",
                "d": "ate",
                "da": "te",
                "dat": "e",
                "t": "herapy",
                "th": "erapy",
                "the": "rapy",
                "ther": "apy",
                "wheream": "i",
                "w":  "hereami",
                "wh": "ereami",
                "whe": "reami",
                "s": "hutdown",
                "sh": "utdown",
                "shu": "tdown",
                "shut": "down",
                "c": "ls",
                "cl": "s",
                "m": "an",
                "ma": "n",
                "tr": "ace",
                "tra": "ce",
                "r": "ot13",
                "ro": "t13",
                "rot": "13",
                "p": "rompt",
                "pr": "ompt",
                "pro": "mpt",
                "prom": "pt",   // Took your advice and listened to Squeeze - Tempted. Interesting 
                "h": "elp",
                "he": "lp",
                "hel": "p"
            };
        
            const autoCompleteText = autoCompleteOptions[this.buffer];  ////If the current buffer's content matches any of the keys in the dictionary, the system will autocomplete it based on the associated value from the dictionary.
           
            if (autoCompleteText) {
                this.putText(autoCompleteText);
                this.buffer += autoCompleteText;
            }
        } 
        
        
        public backspace(): void {
            
            if (this.buffer.length > 0 ) {  //Check if there is any letters in the buffer
                
                const lastChar = this.buffer[this.buffer.length - 1]; // if there is then take the last letter from the buffer.  

                //Then you take away the last like it was never there 
                this.buffer = this.buffer.substring(0, this.buffer.length - 1);

                // But I need to find how much space the letter is going to take, becuase every letter has a different width 
                const charWidth = _DrawingContext.measureText(this.currentFont, this.currentFontSize, lastChar);
                
                //Then we go back after that 
                this.currentXPosition -= charWidth;

                //Start by erasing from the top-left corner of the last character
                // Then Use currentXPosition for the horizontal start and adjust currentYPosition for the vertical start.
                // The width to erase is the character's width, and height includes the font and margin, that's how clerrect erases the exact space of the last character.
                _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - this.currentFontSize, charWidth, this.currentFontSize + _FontHeightMargin);
            }
        }
            

        public putText(text): void {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
                if (this.currentXPosition > 440){
                    this.advanceLine();
                }
            }
         }

        public advanceLine(scroll = true): void {  //Changed to a boolean value so if true it scrolls and if false, >never built off this.
            const lineHeight = _DefaultFontSize +  // Line heght is just the height of the single line text 
                       _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                       _FontHeightMargin;

            const totalLines = Math.floor(_Canvas.height / lineHeight);  // totalLines represents the number of line that fit in the canvas  
        
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            
            //OpenAI. 2021. "Simulating Scrollable Console in JavaScript." Response Supported via standard programming aids. Accessed August 30, 2023. https://www.openai.com. 
            if(scroll) {  // If scrolling is required then move up the entire content one line up. This is simulated with...
                const imageData = _DrawingContext.getImageData(0, lineHeight, _Canvas.width, _Canvas.height - lineHeight); // THIS
                
                _DrawingContext.clearRect(0,0, _Canvas.width, _Canvas.height);
                _DrawingContext.putImageData(imageData, 0, 0);
                
                // Draws a blank line at the bottom to simulate scrolling
                _DrawingContext.clearRect(0, _Canvas.height - lineHeight, _Canvas.width, lineHeight);
                
                // adjusts the canvas to the bottom of the visible area 
                this.currentYPosition = _Canvas.height - lineHeight;
            } else {

                // Moves the next line without scrolling 
                this.currentYPosition += lineHeight;
            }
                //Removes the weird indent that happens with scrolling 
                this.currentXPosition = 0;

                }
            } 
            
        }


