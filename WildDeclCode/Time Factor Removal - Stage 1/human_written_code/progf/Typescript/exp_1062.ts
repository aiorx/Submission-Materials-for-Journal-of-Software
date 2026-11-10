var Component = require('@angular/core').Component;
var ChangeDetectionStrategy = require('@angular/core').ChangeDetectionStrategy;
var Store = require('@ngrx/store').Store;
var Observable = require('rxjs/Observable').Observable;

var AppState = require('../../store/app.store').AppState;

var appSelectors = require('../../store/app.selectors');
var itemListActions = require('../../store/item-list/item-list.actions');

@Component({
    selector: 'add-item',
    template: '
        <div class="navbar-form navbar-left">
            <div class="form-group">
                <input
                    class="form-control"
                    placeholder="Enter an item to add"
                    [(ngModel)]="newItem"
                    (keyup.enter)="addItem()">
            </div>
            <button class="btn btn-success" (click)="addItem()">Add Item</button>
            <button class="btn btn-danger" (click)="resetItemList()">Reset List</button>
        </div>
    '
})
class AddItemComponent {
    newItem: any = null;

    constructor( private store: Store<AppState> ) { }

    addItem() {
        if (this.newItem) {
            this.store.dispatch(new itemListActions.AddItemAction(this.newItem));
            this.newItem = null;
        }
    }

    resetItemList() {
        this.store.dispatch(new itemListActions.ResetItemListAction(null));
    }
}
