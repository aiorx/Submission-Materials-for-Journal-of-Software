```python
def predict(): 
    #get the data from request
    data = request.get_json(force=True)
    requestData = numpy.array([data["buying"], data["maint"], data["doors"], data["persons"], data["lug_boot"], data["safety"]])
    requestData = numpy.reshape(requestData, (1, -1))
    
    #get onehotencoding for input_data
    requestData = ohc.transform(requestData) 
    
    #Make prediction using model
    prediction = rfc.predict(requestData)
    return Response(json.dumps(prediction[0]))
```