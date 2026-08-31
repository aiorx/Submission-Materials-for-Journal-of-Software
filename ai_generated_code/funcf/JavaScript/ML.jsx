async function classifyDigit(imageData, modelPath) {
    // Step 1: Preprocess the image
    const inputTensorData = toTensor(imageData);
    // Step 2: Create a tensor of shape [1, 1, 28, 28]
    const tensor = new ort.Tensor('float32', inputTensorData, [1, 28*28]);

    // Step 3: Load the ONNX model
    // enable DEBUG flag
    ort.env.debug = true;

    // set global logging level
    ort.env.logLevel = 'info';
    ort.env.wasm.wasmPaths = '/'; // or 'public/' if that's where you put the files
    const session = await ort.InferenceSession.create(modelPath);

    // Step 4: Get model input name (assume only one input)
    const inputName = session.inputNames[0];

    // Step 5: Run inference
    const feeds = { [inputName]: tensor };
    const results = await session.run(feeds);

    // Step 6: Get output (assume single output with shape [1, 10])
    const output = results[session.outputNames[0]].data;

    // Step 7: Get predicted class (index of max value)
    const predicted = output.indexOf(Math.max(...output));
    return predicted;
}