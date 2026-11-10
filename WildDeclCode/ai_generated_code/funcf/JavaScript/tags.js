/**
 * Replaces tags found in rawText with their respective
 * innerHTML based on their parameters
 * @param {String} rawText 
 * @returns converted text as raw html
 */
function rawToHTML(rawText) {
    let innerHTML = String(rawText);
    
    tags.forEach(tag => {
        // regex Formed using standard development resources 4.0 with some modifications by me
        let escapedTag = tag.tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        let regex = new RegExp(`@(${escapedTag})\\(([@A-Za-z0-9_,/\\" :\\\\.*\\-#]*?)\\)`, 'g');
        innerHTML = innerHTML.replaceAll(regex, (match) => {
            return convertTag(tag, match);
        });
    })
        
    return innerHTML;
}