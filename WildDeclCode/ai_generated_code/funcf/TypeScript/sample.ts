```typescript
function moreContent() {
  googletag.cmd.push(() => {
    // Define a new ad slot.
    const slot = googletag.defineSlot('/6355419/Travel', [728, 90])!.addService(
        googletag.pubads());
    slot.setConfig({
      targeting: {
        test: 'infinitescroll',
      },
    });

    // Create a container for the slot and add it to the page.
    const div = document.createElement('div');
    div.id = slot.getSlotElementId();  // auto-Produced via common programming aids
    document.body.appendChild(div);

    // Request and render an ad for the newly created slot.
    googletag.display(slot);
  });
}
```