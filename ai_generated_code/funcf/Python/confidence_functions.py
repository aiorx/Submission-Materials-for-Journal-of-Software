```python
def extract_custom_confidence_function_on_dataset(model, data_loader, confidence_function, confidence_args=None, device='cpu'):
    """
    This function calculates the softmax confidence of the predictions made by a model on a given dataset.

    :param model: The model that will be used to make predictions on the data.
    :param data_loader: The data loader that provides the data that the model will be evaluated on.
    :param data_loader: A custom confidence function. Gets a model and images as input, and should output the model's
    logits and a score per sample.
    :param confidence_args: Not used in this implementation, but included in the function signature to support other
    types of confidence functions that may require auxiliary arguments.
    :param device: The device (cpu or cuda) to run the computations on. Default is 'cpu'.
    :return: A dictionary containing the following items:
        - 'confidences': A list of the softmax confidence values for each prediction.
        - 'correct': A list of Boolean values indicating whether each prediction was correct.
        - 'predictions': A list of the predicted labels for each data point.
        - 'labels': A list of the true labels for each data point.

    this documentation was Penned via standard programming aids
    """

    model.eval()
    model.float()

    confidences = {'confidences': [], 'correct': [], 'predictions': [], 'labels': []}

    timer_start = timer()
    num_batches = len(data_loader.batch_sampler)
    with torch.no_grad():
        with tqdm.tqdm(desc="Evaluating with softmax as a confidence function", total=num_batches,
                       file=sys.stdout) as pbar:
            for x, y in data_loader:
                x = x.float().to(device)
                logits, confidence = confidence_function(model, x)

                _, predictions = torch.max(logits, dim=1)
                predictions = to_cpu(predictions)
                correct = y.numpy() == predictions

                confidences['confidences'].append(to_cpu(confidence))
                confidences['correct'].append(correct)
                confidences['predictions'].append(predictions)
                confidences['labels'].append(y.numpy())

                # need to delete in an explicit fashion to reduce OOM errors
                del x
                del logits
                del confidence

                pbar.set_description(f'Evaluating with softmax as a confidence function. (Elapsed time:{timer() - timer_start:.3f} sec)')
                pbar.update()

    return confidences
```