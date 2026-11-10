var dndActionZone = require('svelte-dnd-action').dndzone;
var setDebugMode = require('svelte-dnd-action').setDebugMode;
var overrideId = require('svelte-dnd-action').overrideItemIdKeyNameBeforeInitialisingDndZones;
var Options = require('svelte-dnd-action').Options;
var createEffect = require('solid-js').createEffect;
var createRenderEffect = require('solid-js').createRenderEffect;
var onMount = require('solid-js').onMount;
var onCleanup = require('solid-js').onCleanup;
var createFlipper = require('./util/flip').createFlipper;
var Flipper = require('./util/flip').Flipper;
export {
    TRIGGERS,
    SOURCES,
    SHADOW_ITEM_MARKER_PROPERTY_NAME,
    SHADOW_PLACEHOLDER_ITEM_ID,
    DRAGGED_ELEMENT_ID,
    alertToScreenReader,
    setDebugMode
} from "svelte-dnd-action";

const DEFAULT_FLIP_DURATION_MS = 150;
let ID_KEY = "id";
function overrideItemIdKeyNameBeforeInitialisingDndZones(newId:string) {
    overrideId(newId);
    ID_KEY = newId;
}

type SolidOptions = {
    items: function () { return Array<Record<string; }, any>>; /**a getter the list of items (SIGNAL or a getter to STORE value) that was used to generate the children of the given node (the list used in the `<For>` block*/
    type?: string | (function () { return string; }); /**the type of the dnd zone. children dragged from here can only be dropped in other zones of the same type, default to a base type*/
    flipDurationMs?: number | (function () { return number; }); /**the duration of the flip animation. zero means no animation*/
    dragDisabled?: boolean | (function () { return boolean; });
    morphDisabled?: boolean | (function () { return boolean; }); /**whether dragged element should morph to zone dimensions*/
    dropFromOthersDisabled?: boolean | (function () { return boolean; });
    zoneTabIndex?: number | (function () { return number; }); /**set the tabindex of the list container when not dragging*/
    dropTargetStyle?: Record<string, string> | (function () { return Record<string; }, string>);
    dropTargetClasses?: string[] | (function () { return string[]; });
};

function dndzone(node: HTMLElement, optionsGetter: function () { return SolidOptions; }) {
    const options = optionsGetter();
    validateOptions(options);
    const optionsAsGetters = addDefaultOptions(optionsToGetters(options));
    const {flipDurationMs: getFlipDurationMs} = optionsAsGetters;
    const getItems = optionsAsGetters.items as function () { return Array<Record<string; }, any>>;
    let flipper: (Flipper | undefined) = undefined;

    onMount(function () {
        var update = dndActionZone.update;
var destroy = dndActionZone.destroy;(node, gettersToOptions(optionsAsGetters));
        onCleanup(destroy);
        createEffect(function updateOptionsAndTriggerFlip() {
            update(gettersToOptions(optionsAsGetters));
            flipper?.flip(getItems().map(item => item[ID_KEY]));
        });
    });
    createEffect(function updateFlipperWhenFipDurationChanges() {
        flipper = createFlipper(node, getFlipDurationMs())
    })
    createRenderEffect(function storeFlipInformation() {
        function adaptConsider() {
            flipper?.read(getItems().map(function item { return item[ID_KEY]; }));
        }
        function adaptFinalize() {
            flipper?.read(getItems().map(function item { return item[ID_KEY]; }));
        }
        node.addEventListener('consider', adaptConsider);
        node.addEventListener('finalize', adaptFinalize);
        onCleanup(function () {
            node.removeEventListener('consider', adaptConsider);
            node.removeEventListener('finalize', adaptFinalize)
        })
    });
}

/* Helper functions */
function makeGetter(option: any) {
    return (typeof option === "function") ? option : function () { return option; };
}

/**
 * Converts an object with either getters or values to an object of getters so that all of the element can be treated the same
 */
function optionsToGetters(options: Record<string, any>) {
    return Object.keys(options).reduce(function (res:Record<string, any>, optName) {res[optName] = makeGetter(options[optName]); return res;}, {}) as Record<string, function () { return any>; };
}
function validateOptions(options: SolidOptions) {
    if(typeof options.items !== "function") {
        throw new Error("dndzone didn't get an items getter, which is a mandatory option in " + (JSON.stringify(options)) + "");
    }
}
function addDefaultOptions(optionGetters: Record<string, function () { return any>; }) {
    if (typeof optionGetters.flipDurationMs !== "function") {
        return {...optionGetters, flipDurationMs: function () { return DEFAULT_FLIP_DURATION_MS; }}
    }
    return  optionGetters;
}

/**
 * Calls each getter and maps it to its value (so it can be given to the lib
 */
function gettersToOptions(optionGetters: Record<string, function () { return any>; }) : Options {
    return Object.keys(optionGetters).reduce(function (res:Record<string, any>, optName) {res[optName] = optionGetters[optName](); return res;}, {}) as Options;
}
