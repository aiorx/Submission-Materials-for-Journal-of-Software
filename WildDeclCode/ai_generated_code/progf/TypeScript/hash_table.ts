/* 
    Hash Table

    Hash Table is a data structure which stores data in an associative manner. In a hash table, data is stored in an array format, where each data value has its own unique index value. Access of data becomes very fast if we know the index of the desired data.

    In Real Life
        1. Databases: Hash tables are used to implement database indexes such as indexes on the primary key of a table.
        2. Caches: Hash tables can be used to implement caches i.e. auxiliary data tables that are used to speed up the access to data.
        3. Object Representation: Hash tables are used to implement objects in most programming languages such as JavaScript, Python, and Ruby. In these languages, every object is represented as a hash table where the object's properties are stored as key-value pairs.

    Description and comments Crafted with standard coding tools and github copilot

 */

class HashTable{
    private currentHashTable: Array<any> = [];
    
    public constructor(size: number){
        for(let i = 0;i<size;i++)
            this.currentHashTable.push(-1);
    }
    
    private hash(dataKey: number): number
    {
        return dataKey % 10;
    }
    
    public get(dataKey: number): any
    {
        return this.currentHashTable[this.hash(dataKey)];
    }
    
    public put(dataKey: number, dataValue: any): void
    {
        const hashedKey: number = this.hash(dataKey); 
        if(this.currentHashTable[hashedKey] == -1)
            this.currentHashTable[hashedKey] = dataValue;
        else{
            let cycleCount = 0;
            let nextEmptyIndex: number = hashedKey;
            while(this.currentHashTable[nextEmptyIndex] != -1){
                nextEmptyIndex++;
                
                if(nextEmptyIndex > this.currentHashTable.length){
                    if(cycleCount > 0){
                        throw new Error("hash table is full");
                    }
                    cycleCount = 1;
                    nextEmptyIndex = 0;
                }
            }
            
            this.currentHashTable[nextEmptyIndex] = dataValue;
        }
            
    }
    
    public del(dataKey: number): void
    {
        this.currentHashTable[dataKey] = -1;
    }
    
    public size(): number
    {
        return this.currentHashTable.length;
    }
    
    public print(): void
    {
        console.log(this.currentHashTable);
    }
}


var myHashTable = new HashTable(10);
myHashTable.put(25, "jane");
myHashTable.put(5, "john");
myHashTable.put(2, "charlie");
myHashTable.put(11, "bob");
myHashTable.print(); // [ -1, 'bob', 'charlie', -1, -1, 'jane', 'john', -1, -1, -1 ]