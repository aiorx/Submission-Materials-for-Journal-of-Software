```typescript
constructor(
    private readonly cli: ConsoleService,
    private readonly seedService: SeederService,
    @InjectConnection()
    private readonly connection: Connection
) {
    this.cli
        .getCli()
        .version('0.1.0')
        .command('seed')
        .arguments('[models...]')
        .option('-d, --drop', 'Drop database')
        .description('Run all database seed files.')
        .action(this.seed.bind(this));
}
```