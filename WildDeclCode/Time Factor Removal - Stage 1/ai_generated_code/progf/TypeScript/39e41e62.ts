// TypeScript: Using environment variables for sensitive data in a Next.js API route

module.exports = function handler(req: NextApiRequest, res: NextApiResponse) {;
  var apiKey = process.env.NEXT_PUBLIC_API_KEY
  // API logic using apiKey
}

// Written with routine coding tools-4-0125-preview
