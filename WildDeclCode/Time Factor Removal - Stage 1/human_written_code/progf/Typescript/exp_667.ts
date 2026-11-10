var qt = require('node-qt-napi');
var convertStyleSheet = require('../utils/convertStyleSheet');

interface Size {
  w: number;
  h: number;
}

function desktopSize(): Size {
  return qt.desktopSize();
}

export abstract class BaseElement {
  element: any;
  hasMouseTracking() {
    return this.element.hasMouseTracking();
  }
  setMouseTracking(v: boolean) {
    this.element.setMouseTracking(v);
  }
  mousePressEvent(func: function () { return void; }) {
    this.element.mousePressEvent(func);
  }
  mouseReleaseEvent(func: function () { return void; }) {
    this.element.mouseReleaseEvent(func);
  }
  mouseMoveEvent(func: function (x: number, y: number) { return void; }) {
    // TODO: Mouse tracking should be turned of when the event handler
    // is being removed (not changed to a new function)
    // This probably needs teardown logic in propsUpdater function
    if (!this.hasMouseTracking()) {
      this.setMouseTracking(true);
    }

    this.element.mouseMoveEvent(func);
  }
  enterEvent(func: function () { return void; }) {
    this.element.enterEvent(func);
  }
  leaveEvent(func: function () { return void; }) {
    this.element.leaveEvent(func);
  }
  moveEvent(func: function (x: number, y: number) { return void; }) {
    this.element.moveEvent(func);
  }
  setStyleSheet(obj: object) {
    this.element.setStyleSheet(convertStyleSheet(obj));
  }
  setParent(elem: BaseElement) {
    //console.log("Set parent", this.element, elem.element);
    this.element.setParent(elem.element);
  }
  del() {
    this.element.del();
  }
  resize(width: number, height: number) {
    this.element.resize(width, height);
  }
  move(left: number, top: number) {
    this.element.move(left, top);
  }
  minSize(): Size {
    return this.element.minimumSizeHint();
  }
  show() {
    this.element.show();
  }
  close() {
    this.element.close();
  }
  width(): number {
    return this.element.width();
  }
  height(): number {
    return this.element.height();
  }
}

class ImageElement extends BaseElement {
  pixElement: any;
  constructor() {
    super();
    this.element = new qt.QLabel();
    this.element.setScaledContents(false);
    this.pixElement = new qt.QPixmap();
  }

  setFromData(data: Buffer) {
    this.pixElement.loadFromData(data);
    this.element.setPixmap(this.pixElement);
  }

  setFromUri(uri: string) {
    this.pixElement.load(uri);
    this.element.setPixmap(this.pixElement);
  }

  scaleImage(
    width: number,
    height: number,
    mode: "cover" | "contain" | "stretch" | "center" | "repeat"
  ) {
    this.element.setAlignment(
      qt.Alignment.AlignLeft | qt.Alignment.AlignVCenter
    );
    if (mode == "cover") {
      this.pixElement.scaled(
        width,
        height,
        qt.AspectRatioMode.KeepAspectRatioByExpanding
      );
    } else if (mode == "contain") {
      this.pixElement.scaled(width, height, qt.AspectRatioMode.KeepAspectRatio);
    } else if (mode == "stretch") {
      this.pixElement.scaled(
        width,
        height,
        qt.AspectRatioMode.IgnoreAspectRatio
      );
    } else if (mode == "center") {
      this.element.setAlignment(qt.Alignment.AlignCenter);
      this.pixElement.scaled(width, height, qt.AspectRatioMode.KeepAspectRatio);
    } else if (mode == "repeat") {
      this.pixElement.scaledTile(width, height);
    }
    this.element.setPixmap(this.pixElement);
    this.element.show();
    this.element.adjustSize();
  }

  isNull(): boolean {
    return this.pixElement.isNull();
  }
}

class WindowElement extends BaseElement {
  constructor() {
    super();
    this.element = new qt.QMainWindow();
  }
  resizeEvent(func: function (width: number, height: number) { return void; }) {
    this.element.resizeEvent(func);
  }
  getClosed(): boolean {
    return this.element.getClosed();
  }
}

class ViewElement extends BaseElement {
  constructor() {
    super();
    this.element = new qt.QWidget();
  }
}

class PickerElement extends BaseElement {
  constructor() {
    super();
    this.element = new qt.QComboBox();
  }

  activatedEvent(func: function (text: string) { return void; }) {
    this.element.activatedEvent(func);
  }

  addItem(label: string) {
    this.element.addItem(label);
  }

  removeItem(index: number) {
    this.element.removeItem(index);
  }

  insertItem(index: number, label: string) {
    this.element.insertItem(index, label);
  }

  setCurrentText(label: string) {
    this.element.setCurrentText(label);
  }
  currentIndex(): number {
    return this.element.currentIndex();
  }
}

class AppElement {
  element: any;
  constructor() {
    this.element = new qt.QApplication();
  }

  runLoop() {
    this.element.sendPostedEvents();
    this.element.processEvents();
  }
}

class TextElement extends BaseElement {
  constructor() {
    super();
    this.element = new qt.QLabel();
  }
  setText(text: string) {
    this.element.setText(text);
  }
}

class TextInputElement extends BaseElement {
  constructor(multi: boolean) {
    super();
    this.element = multi ? new qt.QPlainTextEdit() : new qt.QLineEdit();
  }

  textChangedEvent(func: function (newText: string) { return void; }) {
    this.element.textChangedEvent(func);
  }

  setText(text: string) {
    this.element.setText(text);
  }
}

class ButtonElement extends BaseElement {
  constructor() {
    super();
    this.element = new qt.QPushButton();
  }

  buttonReleasedEvent(func: function () { return void; }) {
    this.element.buttonReleasedEvent(func);
  }

  setText(text: string) {
    this.element.setText(text);
  }
}
