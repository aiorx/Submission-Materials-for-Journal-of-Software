```python
def add_EmbeddedAssistantServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'Converse': grpc.stream_stream_rpc_method_handler(
          servicer.Converse,
          request_deserializer=google_dot_assistant_dot_embedded_dot_v1alpha1_dot_embedded__assistant__pb2.ConverseRequest.FromString,
          response_serializer=google_dot_assistant_dot_embedded_dot_v1alpha1_dot_embedded__assistant__pb2.ConverseResponse.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'google.assistant.embedded.v1alpha1.EmbeddedAssistant', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))
```