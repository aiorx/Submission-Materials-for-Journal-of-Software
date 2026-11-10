```typescript
export async function createPost(req: Request, res: Response) {
    const newPost: Post = req.body;
    const conn = await connect();
    await conn.query('INSERT INTO posts SET ?', [newPost]);
    res.json({
        message: 'New Post Created'
    });
}
```