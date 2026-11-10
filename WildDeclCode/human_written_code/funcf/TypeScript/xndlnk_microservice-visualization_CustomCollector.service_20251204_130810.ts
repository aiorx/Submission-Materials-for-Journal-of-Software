```typescript
public async getAllMicroservices(): Promise<MicroService[]> {
  const system = await this.microservicesCreator.transform(new System(''))
  return system.getMicroServices()
}
```