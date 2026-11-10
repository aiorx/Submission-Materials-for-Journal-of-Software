var DefaultButton = require('@fluentui/react').DefaultButton;
var IButtonStyles = require('@fluentui/react').IButtonStyles;
var ITextField = require('@fluentui/react').ITextField;
var KeyCodes = require('@fluentui/react').KeyCodes;
var PrimaryButton = require('@fluentui/react').PrimaryButton;
var Stack = require('@fluentui/react').Stack;
var TextField = require('@fluentui/react').TextField;
var _import = require('react');
import {
    useBabylonContext,
    useBabylonResetSceneDispatch
} from "../context/babylonContext";
import {
    useCodexResetStateDispatch,
    useCodexStateContext
} from "../context/codexContext";
require('./Form.css');

const controlHeight: number = 50; // px
const buttonStyle: IButtonStyles = { root: { minWidth: 150, height: controlHeight, fontSize: 23 } };

module.exports = function Form() {;
    const serverUrl = "http://localhost:" + (process.env.SERVER_PORT) + "";
    const codeDivRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<ITextField>(null);

    var state = useCodexStateContext.state;();
    var scene = useBabylonContext.scene;();
    const resetBabylonScene = useBabylonResetSceneDispatch();
    const resetCodexState = useCodexResetStateDispatch();

    const [currentCommand, setCurrentCommand] = useState<string>();
    const [isSendingCommand, setIsSendingCommand] = useState<boolean>(false);

    useEffect(function () {
        if(!isSendingCommand) {
            inputRef.current?.focus();
        }
    },[isSendingCommand]);

    const evalAsync = async function (code) {
        await eval("(async () => { " + code + "})()");
    };

    const handleSubmit = useCallback(function () {
        
        setIsSendingCommand(true);
        
        const nlCommand = currentCommand;
        console.log("Sending natural language command: " + nlCommand);

        fetch("" + (serverUrl) + "/codegen", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                text: nlCommand
            })
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Received the following code: " + (data.code) + "");
                console.log("Received the following sensitiveContentFlag: " + (data.sensitiveContentFlag) + "");

                if(data.sensitiveContentFlag > 0) {
                    var warning = data.sensitiveContentFlag === 1
                    ? "Your message or the model's response may have contained sensitive content."
                    : "Your message or the model's response may have contained unsafe content.";

                    setCurrentCommand(""); 
                    console.warn(warning);

                    if (codeDivRef.current != null) {
                        codeDivRef.current.innerText = "Potentially sensitive language detected in prompt or completion. Try another prompt using different language.";
                    }
                }else if (data.error && codeDivRef.current != null) {
                            codeDivRef.current.innerText = data.error;
                }else {
                    if (codeDivRef.current != null && currentCommand !== undefined) {
                        codeDivRef.current.innerText = data.code;
                        
                        setCurrentCommand("");                    
                        evalAsync(data.code);
                    }
                }

                setIsSendingCommand(false);
            })
            .catch((error) => {
                console.error(error);
                setIsSendingCommand(false);
            });
    }, [currentCommand, serverUrl]);

    const handleReset = useCallback(function () {
        if (codeDivRef.current != null) {
            codeDivRef.current.innerText = "";
        }
        console.log("resetting context");
        fetch("" + (serverUrl) + "/reset")
            .then((response) => response.json())
            .then((res) => {
                console.log("Reset context: " + (res.context) + "");
            })
            .catch((error) => console.error(error));

        // reset
        for (const key in state.intervals) {
            if (state.intervals.hasOwnProperty(key)) {
                const interval = state.intervals[key];
                console.log("Clearing interval " + (key) + "");
                clearInterval(interval);
            }
        }
        
        resetBabylonScene();
        resetCodexState();
    }, [resetBabylonScene, resetCodexState, serverUrl]);

    return (
        <>
            <Stack className='commandDiv' horizontal tokens={{ childrenGap: 5 }} horizontalAlign='start'>
                <TextField
                    componentRef={inputRef}
                    disabled={isSendingCommand}
                    onChange={function (e,newValue) { return setCurrentCommand(newValue); }}
                    value={currentCommand}
                    autoComplete="off"
                    styles={{ root: { minWidth: "75%" }, fieldGroup: { height: controlHeight } }}
                    inputClassName="nlInput"
                    onKeyUp={function (k) { return k.code === "Enter" ? handleSubmit() : ()=>{}; }}
                    placeholder="Enter Natural Language Command (e.g. 'create a cube')"
                />
                <PrimaryButton
                    styles={buttonStyle}
                    disabled={isSendingCommand}
                    onClick={handleSubmit}
                >
                    Enter
                </PrimaryButton>
                <DefaultButton
                    styles={buttonStyle}
                    disabled={isSendingCommand}
                    onClick={handleReset}
                >
                    Reset
                </DefaultButton>
                <div className="codeDiv">
                    <p ref={codeDivRef}></p>
                </div>
            </Stack>
        </>
    );
}
