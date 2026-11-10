```typescript
function rulePhone(value: any) {
  if (!value) {
    return {
      valid: false,
      msg: '请输入手机号码'
    }
  }

  if (/^\d{11}$/.test(value)) {
    return {
      valid: true,
    }
  } else {
    return {
      valid: false,
      msg: '请输入手机号码无效'
    }
  }
}
```