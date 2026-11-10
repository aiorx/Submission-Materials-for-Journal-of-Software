var Injectable = require('@angular/core').Injectable;
var Actions = require('@ngrx/effects').Actions;
var Effect = require('@ngrx/effects').Effect;
var ofType = require('@ngrx/effects').ofType;
var Observable = require('rxjs').Observable;
var HttpErrorResponse = require('@angular/common/http').HttpErrorResponse;
var map = require('rxjs/operators').map;
var switchMap = require('rxjs/operators').switchMap;
var IAction = require('../i-action').IAction;
var __name__Action = require('./__name__(kebabCase).action').__name__Action;
var ErrorsAction = require('../errors/errors.action').ErrorsAction;
var __name__Service = require('./__name__(kebabCase).service').__name__Service;
var __model__ResponseModel = require('./models/__model__(kebabCase)-response.model').__model__ResponseModel;

@Injectable()
class __name__Effect {
    constructor(private _statusService: __name__Service, private _actions$: Actions) {}

    @Effect()
    public get__model__(): Observable<IAction<__model__ResponseModel | HttpErrorResponse>> {
        return this._actions$.pipe(
            ofType(__name__Action.LOAD___model__(constantCase)),
            switchMap(function (action: IAction<void>) {
                return this._statusService.get__model__().pipe(
                    map((responseModel: __model__ResponseModel | HttpErrorResponse) => {
                        if (responseModel instanceof HttpErrorResponse) {
                            return ErrorsAction.requestFailure(responseModel);
                        }

                        return __name__Action.load__model__Success(responseModel);
                    }),
                );
            }),
        );
    }

}
