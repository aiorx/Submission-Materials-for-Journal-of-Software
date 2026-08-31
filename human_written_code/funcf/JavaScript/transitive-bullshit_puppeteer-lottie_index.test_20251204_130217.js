```js
test('bodymovin.json => single frame png', async (t) => {
  const output = tempy.file({ extension: 'png' })

  await renderLottie({
    path: bodymovin,
    quiet: true,
    output
  })

  const image = imageSize(output)
  t.is(image.width, 1820)
  t.is(image.height, 275)

  await fs.remove(output)
})
```