// Drafted using common development resources

var DEBUG_FONT_LOG = false;

function loadFont(fontName: string): Promise<void> {
    // Check if font is already loaded
    if (document.fonts.check('1em "' + (fontName) + '"')) {
        if(DEBUG_FONT_LOG) {
            console.log("Font %s already loaded", fontName);
        }
        return Promise.resolve();
    }

    // Create a FontFace object
    var font = new FontFace(fontName, "url(assets/fonts/" + (fontName) + ".woff)");
    if(DEBUG_FONT_LOG) {
        console.log("Created fontface for %s", fontName);
    }

    // Load the font
    font.load().then(function loadedFont {
        if(DEBUG_FONT_LOG) {
            console.log("Loaded font for %s", fontName);
        }
        // Add the loaded font to the document
        document.fonts.add(loadedFont);
        if(DEBUG_FONT_LOG) {
            console.log("Added font to doc for %s", fontName);
        }
    });

    // Return a promise that resolves when the font is available
    var _try = function (_resFunc: () => void) {
        if(DEBUG_FONT_LOG) {
            console.log("Waiting for font %s to be ready...", fontName);
        }
        document.fonts.ready.then(async () => {
            if (document.fonts.check('1em "' + (fontName) + '"')) {
                if(DEBUG_FONT_LOG) {
                    console.log("Font %s ready to use!", fontName);
                }
                _resFunc();
            } else {
                if(DEBUG_FONT_LOG) {
                    console.error("Font ready but not actually ready?! %s", fontName);
                }
                await new Promise((res) => setTimeout(res, 100));
                return _try(_resFunc);
            }
        });
    }
        });
    };
    return new Promise(function resolve { return _try(resolve); });
}