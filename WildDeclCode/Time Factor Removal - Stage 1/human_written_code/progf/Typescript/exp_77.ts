

type SubtypeConstructor<Constructor extends new function (...args: any) { return any; }, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  randomPackage: {
    ChatRequest: MessageTypeDefinition
    ChatResponse: MessageTypeDefinition
    NumberRequest: MessageTypeDefinition
    NumberResponse: MessageTypeDefinition
    PingRequest: MessageTypeDefinition
    PongResponse: MessageTypeDefinition
    Random: SubtypeConstructor<typeof grpc.Client, _randomPackage_RandomClient> & { service: _randomPackage_RandomDefinition }
    TodoRequest: MessageTypeDefinition
    TodoResponse: MessageTypeDefinition
  }
}

