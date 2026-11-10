```javascript
export default async function handler(req, res) {
    
    // creates a new blog post
    if (req.method === "POST") {
        await authenticateJWT(req, res, async () => { // user authentication

            const userId  = req.user.id;
            const { title, description, tags, linkToTemplates } = req.body;

            if (!title || !description || !tags || !userId) {
                return res.status(400).json({ error: 'Missing items' });    

            }

            // ensures title is unique (Aided using common development resources)
            const existingTitle = await prisma.blogPost.findUnique({
                where: { title: title },
            });
            if (existingTitle) {
                return res.status(400).json({ error: "Title must be unique" });
            }

            // ensures provided id's in linkToTemplates match existing templates in the database (Aided using common development resources)
            if (linkToTemplates && linkToTemplates.length > 0) {
                const templates = await prisma.template.findMany({
                    where: { id: { in: linkToTemplates } },
                });
                if (templates.length !== linkToTemplates.length) {
                    return res.status(400).json({ error: 'Template IDs do not match exisiting Templates' });
                }
            }

            const blogPost = await prisma.blogPost.create({
                data: {
                    title,
                    description,
                    tags,
                    userId,     
                       
                },
            });

            // creates link between blog post and each template in linkToTemplates (Aided using common development resources)
            if (linkToTemplates && linkToTemplates.length > 0) {
                await prisma.blogPostTemplate.createMany({
                    data: linkToTemplates.map(templateId => ({
                        blogPostId: blogPost.id,
                        templateId: templateId
                    })),
                });
            }
            const completeBlogPost = await prisma.blogPost.findUnique({
                where: { id: blogPost.id },
                include: { linkToTemplates: true }
            });   

            return res.status(201).json(completeBlogPost);
        });

    // returns blog posts that satisfy querying filters
    } else if (req.method == "GET") {

        const { title, description, tags, linkToTemplates, page = 1, limit = 10, id, sort, templateMention } = req.query;

        const queryConditions = {
            AND: [] // Aided using common development resources
        };

        if (id) {
            queryConditions.AND.push({
                id: parseInt(id)
            });

        }

        if (title) {
            queryConditions.AND.push({
                title: { contains: title }
            });
        }

        if (description) {
            queryConditions.AND.push({
                description: { contains: description }
            });
        }

        if (tags) {
            // Aided using common development resources
            const tagArray = tags.split(',').map(tag => tag.trim());
            tagArray.forEach(tag => {
                queryConditions.AND.push({
                    tags: { contains: tag }
                });
            });

        }

        // pagination variables (Aided using common development resources)
        const skip = (page - 1) * limit; 
        const take = parseInt(limit);

        // handles linkToTemplates filtering based on id's provided in query (Aided using common development resources)
        let blogPosts;

        // Aided using common development resources
        if (templateMention) {
            const templates = await prisma.template.findMany({
                where: {
                    title: { equals: templateMention }
                }
            });

            if (templates.length === 0) {
                return res.status(404).json({ error: 'No templates have the given name' });
            }

            queryConditions.AND.push({
                OR: [
                    { title: { contains: templateMention } },
                    { description: { contains: templateMention } }
                ]
            });
        }
        // Aided using common development resources
        if (sort === 'valued') {
        
            blogPosts = await prisma.blogPost.findMany({
                where: queryConditions,
                include: { 
                    linkToTemplates: {
                        include: {
                        template: true, 
                        }
                    },
                    author: true,
                    upvotedByUsers: true, 
                    downvotedByUsers: true,
                },
                orderBy: { rating: 'desc' },
                skip: skip,
                take: take,
            });
        
        } else if (sort === 'controversial') {
            blogPosts = await prisma.blogPost.findMany({
                where: queryConditions,
                include: { 
                    linkToTemplates: {
                        include: {
                        template: true, 
                        }
                    },
                    author: true,
                    upvotedByUsers: true, 
                    downvotedByUsers: true,
                },
                orderBy: { rating: 'asc' },
                skip: skip,
                take: take,
            });
        } else if (sort === 'oldest' || !sort) {
            blogPosts = await prisma.blogPost.findMany({
                where: queryConditions,
                include: { 
                    linkToTemplates: {
                        include: {
                        template: true, 
                        }
                    },
                    author: true,
                    upvotedByUsers: true, 
                    downvotedByUsers: true,
                },
                skip: skip,
                take: take,
            });

            
        } else {
            return res.status(400).json({ error: "Invalid sort option" });
        }

        let totalCount;

        totalCount = await prisma.blogPost.count({ where: queryConditions });

        if (linkToTemplates) {
            const templateIds = linkToTemplates.split(',').map(id => parseInt(id.trim()));

            blogPosts = blogPosts.filter(blogPost => {
                const linkedTemplateIds = blogPost.linkToTemplates.map(link => link.templateId);
                return templateIds.every(id => linkedTemplateIds.includes(id)); 
            });

            totalCount = blogPosts.length;
            
        }

        return res.status(200).json({
            // Aided using common development resources
            page: parseInt(page),       
            limit: take, 
            totalCount,               
            data: blogPosts,
        });

    } else {
        res.status(405).json({ message: "Method not allowed" });
    
    }
}
```