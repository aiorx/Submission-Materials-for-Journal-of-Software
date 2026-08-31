```python
def retranslateUi(self, Dialog):
    _translate = QtCore.QCoreApplication.translate
    Dialog.setWindowTitle(_translate("Dialog", "Dialog"))
    self.groupBox.setTitle(_translate("Dialog", "城市天气预报"))
    self.comboBox.setItemText(0, _translate("Dialog", "北京"))
    self.comboBox.setItemText(1, _translate("Dialog", "上海"))
    self.comboBox.setItemText(2, _translate("Dialog", "天津"))
    self.label.setText(_translate("Dialog", "城市"))
    self.queryBtn.setText(_translate("Dialog", "查询"))
    self.clearBtn.setText(_translate("Dialog", "清空"))
```