export function loadAllSrcElements() : Promise<void> {
    let elements = document.querySelectorAll("[lc-src]");
    let promises = Array.from(elements).map(element => loadSrcElement(element));
    return Promise.all(promises).then(() => {});
}