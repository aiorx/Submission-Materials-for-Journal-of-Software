var Component = require('@nestjs/common').Component;
var HttpException = require('@nestjs/core').HttpException;
var Observable = require('rxjs/Observable').Observable;
var CreateUserDTO = require('../DTO/create-users.dto').CreateUserDTO;

//別忘記Component裝飾器
@Component()
class UsersService {
    //假資料
    private users = [
        { "_id": 1, "_name": "Michael", "_age": 25 },
        { "_id": 2, "_name": "Mary", "_age": 27 }
    ];

    //使用Promise，盡可能避免使用callback方式。
    getAllUsers() {
        return Promise.resolve(this.users);
    }
    getUser(id: number) {
        const user = this.users.find(function (user) {
            return user._id === id;
        });
        if (!user) {
            //nestjs對於http exception有API可以調用，建議使用。
            throw new HttpException("user not found", 404);
        }
        return Promise.resolve(user);
    }
    //在nestjs也是可以歡樂使用Rx.js
    addUser(user: CreateUserDTO): Observable<object[]> {
        this.users.push(user);
        return Observable.of(this.users);
    }
}