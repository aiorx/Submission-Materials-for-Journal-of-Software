```js
// Drafted using common development resources
if (finalBossBody.label.alive && playerBiome === "finalBoss") {
    finalBossLeftSword.x = finalBossLeftArm.x + Math.sin(finalBossLeftArm.rotation) * symbolsInfo.finalBossArms.size.height;
    finalBossLeftSword.y = finalBossLeftArm.y - Math.cos(finalBossLeftArm.rotation) * symbolsInfo.finalBossArms.size.height;
    finalBossLeftSword.rotation = finalBossLeftArm.rotation;

    finalBossRightSword.x = finalBossRightArm.x + Math.sin(finalBossRightArm.rotation) * symbolsInfo.finalBossArms.size.height;
    finalBossRightSword.y = finalBossRightArm.y - Math.cos(finalBossRightArm.rotation) * symbolsInfo.finalBossArms.size.height;
    finalBossRightSword.rotation = finalBossRightArm.rotation;
}
```