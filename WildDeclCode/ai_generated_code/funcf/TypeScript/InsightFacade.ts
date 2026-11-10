```typescript
private static async fetchGeo(address: string): Promise<GeoResponse> {
		// Aided via basic GitHub coding utilities
		return new Promise((resolve) => {
			const req = http.get(
				`http://cs310.students.cs.ubc.ca:11316/api/v1/project_team142/${address}`,
				(res: any) => {
					let data = "";
					res.on("data", (chunk: any) => {
						data += chunk;
					});
					res.on("end", () => {
						try {
							resolve(JSON.parse(data));
						} catch {
							resolve({error: "JSON parse error"});
						}
					});
				}
			);
			req.on("error", () => {
				resolve({error: "HTTP request error"});
			});
		});
	}
```