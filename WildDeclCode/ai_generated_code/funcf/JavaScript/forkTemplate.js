```javascript
const forkedTemplate = await prisma.codeTemplate.create({
    data: {
        title,
        explanation,
        code,
        userId: user.id,
        language: language.toLowerCase(),
        isForked: true,
        tags: {
            connect: newTags.map(tagId => ({ id: tagId }))
        },
        parentId: parseInt(template.id),  // This is the key attribute that indicates it's a forked version
        // Children is implicitly empty since it's a new template
    }
});
```