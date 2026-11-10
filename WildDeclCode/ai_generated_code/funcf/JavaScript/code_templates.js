```js
// 2. view, search and 5. search(visitor)
if (req.method === 'GET' && !(req.query.id || req.query.blogs)) {
    let page = Number(req.query.page);
    const pageSize = 10;

    if (!page) {
        page = 1;
    }
    const { title, tags, explanation } = req.query;

    let filter = {};

    if (userV) {
        filter.userID = userV.id;
    }

    if (title) {
        filter.title = { equals: title };
    }
    if (tags) {
        const tt = tags.split(',').map(t => t.trim()).filter(Boolean);
        if (tt.length > 0) {
            filter.tags = { some: { tag: { in: tt } } };
        }
    }
    if (explanation) {
        filter.explanation = { equals: explanation };
    }

    try {
        const code_template2 = await prisma.codeTemplate.findMany({
            where:
                filter,
            include: {
                tags: true,
                blogs: {
                    select: {
                        id: true,
                        title: true,
                        userID: true
                    }
                },
            }
        });
        const code_template22 = paginateArray(code_template2, pageSize, page);
        return res.status(200).json(code_template22);
    } catch (error) {
        return res.status(503).json({ error: 'error' });
    }
}
```