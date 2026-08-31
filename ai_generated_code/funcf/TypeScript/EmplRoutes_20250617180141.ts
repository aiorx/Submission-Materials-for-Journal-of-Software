```typescript
public loadRoutes() {
    this.router.get('/hello', (req, res) => {
        res.send('Hello World');
    });
    this.router.get('/', (req, res) =>{
        this.emplController.getEmployees(req, res);
    });
    this.router.get('/get/:id', (req, res) =>{
        this.emplController.getEmployeeById(req, res);
    });
    this.router.post('/add', (req, res) =>{
        this.emplController.addEmployee(req, res);
    });
    this.router.put('/position/:id', (req, res) =>{
        this.emplController.updateEmployeePosition(req, res);
    });
    this.router.delete('/delete/:id', (req, res) =>{
        this.emplController.deleteEmployee(req, res);
    });
}
```