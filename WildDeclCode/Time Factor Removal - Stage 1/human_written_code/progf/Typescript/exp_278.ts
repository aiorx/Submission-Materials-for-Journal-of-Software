/**
 * @jest-environment jsdom
 */
var _ = require('../src');

test('모듈은 기본 내보내기', function () {
	expect(_).toBeTruthy();
});

test('모듈에 포함된 함수 확인', function () {
	expect(typeof _.fetch).toBe('function');
});

test('모듈에 포함된 함수 확인', function () {
	expect(typeof _.pick).toBe('function');
});

test('모듈에 포함된 함수 확인', function () {
	expect(typeof _.omit).toBe('function');
});

test('Selector 동작 확인', function () {
	var divElement = document.createElement('div');
	divElement.innerHTML = "<button class='test-btn'>Continue</button>";
	document.body.appendChild(divElement);

	var buttonElement = _('button.test-btn');
	expect(buttonElement).toBeTruthy();

	document.body.removeChild(buttonElement);
});

test('`_("").innerHTML()`~~~~', function () {});

test('`_("").show()`~~~~', function () {});

test('`_("").hidden()`~~~~', function () {});

test('`_("").addEvent()`~~~~', function () {});
