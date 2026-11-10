var OnInit = require('@angular/core').OnInit;
var EventEmitter = require('@angular/core').EventEmitter;
export declare class EcommerceBestsellerScrollxComponent implements OnInit {
    items: any;
    bestsellerScrollxData: EventEmitter<{}>;
    constructor();
    ngOnInit(): void;
    sendData(item: any): void;
}
