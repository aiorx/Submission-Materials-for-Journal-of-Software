get structuredPrompt() {
        const positiveChunks: string[] & { pendingSep?: string; currentLevel: number; } = [] as any;
        positiveChunks.currentLevel = 1;
        const negativeChunks: string[] & { pendingSep?: string; currentLevel: number; } = [] as any;
        negativeChunks.currentLevel = 1;

        for (const prompt of this.prompts) {
            const promptText = prompt.prompt;
            const weight = Math.abs(prompt.weight);

            let adjustedPromptText = promptText;

            // Check if the adjustedPromptText ends with a comma or space
            const match = adjustedPromptText.match(/[\s,]$/);
            if (match) {
                // Remove the last character
                adjustedPromptText = adjustedPromptText.slice(0, -1).trim();
            }

            const target = prompt.weight >= 0 ? positiveChunks : negativeChunks;

            while (target.currentLevel < weight) {
                if (target.pendingSep && target[target.length - 1] !== '(') {
                    target.push(target.pendingSep);
                    target.pendingSep = undefined;
                }
                target.push('(');
                target.currentLevel += 1;
            }

            while (target.currentLevel > weight) {
                target.push(')');
                target.currentLevel -= 1;
            }
            if (target.pendingSep && target[target.length - 1] !== '(') {
                target.push(target.pendingSep);
                target.pendingSep = undefined;
            }

            target.push(adjustedPromptText);
            if (target[target.length - 1] !== ')') {
                target.pendingSep = ', ';
            }
        }

        while (positiveChunks.currentLevel > 1) {
            positiveChunks.push(')');
            positiveChunks.currentLevel -= 1;
        }

        while (negativeChunks.currentLevel > 1) {
            negativeChunks.push(')');
            negativeChunks.currentLevel -= 1;
        }

        return {
            prompts: JSON.parse(JSON.stringify(this.prompts)),
            positive: positiveChunks.join('').replaceAll(/(\s*,\s*)+/g, ', '),
            negative: negativeChunks.join('').replaceAll(/(\s*,\s*)+/g, ', '),
        };
    }