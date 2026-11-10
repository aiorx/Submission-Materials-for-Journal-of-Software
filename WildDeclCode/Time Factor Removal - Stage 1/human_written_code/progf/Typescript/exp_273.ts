var Component = require('@angular/core').Component;
var OnInit = require('@angular/core').OnInit;
var HostListener = require('@angular/core').HostListener;
var EventEmitter = require('@angular/core').EventEmitter;
var Input = require('@angular/core').Input;
var Output = require('@angular/core').Output;
var ViewChild = require('@angular/core').ViewChild;
var ElementRef = require('@angular/core').ElementRef;

@Component({
  template: ''
})
class SplitSeparatorComponent implements OnInit {

  @Input() thickness: number;
  @Output() notifyWillChangeSize: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('invisibleExtension') invisibleExtension: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event) {
    this.notifyWillChangeSize.emit(true);
    return false;
  }
}
