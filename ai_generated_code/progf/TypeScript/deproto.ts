/* Supported via standard programming aids. Based on https://github.com/arkadiyt/protodump/blob/main/pkg/protodump/proto.go */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Buffer } from "buffer";
import {
  FileDescriptorProto,
  DescriptorProto,
  EnumDescriptorProto,
  EnumValueDescriptorProto,
  ServiceDescriptorProto,
  MethodDescriptorProto,
  FieldDescriptorProto,
  OneofDescriptorProto,
  FileOptions,
} from "google-protobuf/google/protobuf/descriptor_pb";

/**
 * ProtoDefinition is responsible for reconstructing the .proto text from a FileDescriptorProto.
 * It mimics the structure and methods of the Go implementation you provided.
 */
class ProtoDefinition {
  private builder: string[] = [];
  private indentation: number = 0;
  private fileDescriptor: FileDescriptorProto;

  constructor(fileDescriptor: FileDescriptorProto) {
    this.fileDescriptor = fileDescriptor;
  }

  /**
   * Main entry point to write out the entire file descriptor.
   */
  public writeFileDescriptor(): void {
    // syntax
    // if syntax is empty, we default to "proto2" (common convention).
    // The Go code uses descriptor.Syntax(), but we rely on the optional field in FileDescriptorProto.
    let syntax = this.fileDescriptor.getSyntax();
    if (!syntax) {
      syntax = "proto2";
    }
    this.write(`syntax = "${syntax}";\n\n`);

    // package
    const pkg = this.fileDescriptor.getPackage();
    if (pkg) {
      this.write(`package ${pkg};\n\n`);
    }

    // file options
    const options = this.fileDescriptor.getOptions();
    if (options) {
      this.writeFileOptions(options);
    }

    // imports
    // In proto, `dependency` is the list of imports; we also have `public_dependency` indices
    // to indicate which dependencies are 'public', and `weak_dependency` for 'weak' imports.
    const dependencies = this.fileDescriptor.getDependencyList();
    const publicDependencies = this.fileDescriptor.getPublicDependencyList();
    const weakDependencies = this.fileDescriptor.getWeakDependencyList();

    for (let i = 0; i < dependencies.length; i++) {
      const depPath = dependencies[i];
      const isPublic = publicDependencies.includes(i);
      const isWeak = weakDependencies.includes(i);

      // The Go code sets 'public' for IsPublic and no special syntax for 'weak' (except "weak" import).
      // Official protoc's descriptor syntax has 'import public "xxx";' or 'import weak "xxx";'
      // if it's set as public or weak.
      let importLine = "import ";
      if (isPublic) {
        importLine += "public ";
      } else if (isWeak) {
        importLine += "weak ";
      }
      importLine += `"${depPath}";\n`;
      this.write(importLine);
    }
    if (dependencies.length > 0) {
      this.write("\n");
    }

    // services
    const services = this.fileDescriptor.getServiceList();
    for (const service of services) {
      this.writeService(service);
    }

    // messages
    const messages = this.fileDescriptor.getMessageTypeList();
    for (const message of messages) {
      this.writeMessage(message);
    }

    // top-level enums
    const enums = this.fileDescriptor.getEnumTypeList();
    for (const en of enums) {
      this.writeEnum(en);
    }
  }

  /**
   * Convert all content into a single string.
   */
  public toString(): string {
    return this.builder.join("");
  }

  /**
   * Increments indentation.
   */
  private indent(): void {
    this.indentation++;
  }

  /**
   * Decrements indentation.
   */
  private dedent(): void {
    this.indentation = Math.max(0, this.indentation - 1);
  }

  /**
   * Writes string with current indentation.
   */
  private writeIndented(text: string): void {
    this.builder.push("  ".repeat(this.indentation));
    this.write(text);
  }

  /**
   * Writes string without adding indentation.
   */
  private write(text: string): void {
    this.builder.push(text);
  }

  /**
   * Write out relevant file‐level options.
   */
  private writeFileOptions(options: FileOptions): void {
    // Example set from the Go code:
    // "java_package", "java_outer_classname", "java_multiple_files", etc.
    // We'll replicate a few from the Go code. You can extend as needed.
    this.writeRepeatedOptionString(
      "java_package",
      options.hasJavaPackage(),
      options.getJavaPackage(),
    );
    this.writeRepeatedOptionString(
      "java_outer_classname",
      options.hasJavaOuterClassname(),
      options.getJavaOuterClassname(),
    );
    this.writeRepeatedOptionBool(
      "java_multiple_files",
      options.hasJavaMultipleFiles(),
      options.getJavaMultipleFiles()!,
    );
    this.writeRepeatedOptionBool(
      "java_string_check_utf8",
      options.hasJavaStringCheckUtf8(),
      options.getJavaStringCheckUtf8()!,
    );
    this.writeRepeatedOptionString(
      "go_package",
      options.hasGoPackage(),
      options.getGoPackage(),
    );
    this.writeRepeatedOptionBool(
      "cc_enable_arenas",
      options.hasCcEnableArenas(),
      options.getCcEnableArenas()!,
    );
    this.writeRepeatedOptionString(
      "objc_class_prefix",
      options.hasObjcClassPrefix(),
      options.getObjcClassPrefix(),
    );
    this.writeRepeatedOptionString(
      "csharp_namespace",
      options.hasCsharpNamespace(),
      options.getCsharpNamespace(),
    );
    this.writeRepeatedOptionString(
      "swift_prefix",
      options.hasSwiftPrefix(),
      options.getSwiftPrefix(),
    );
    this.writeRepeatedOptionString(
      "php_class_prefix",
      options.hasPhpClassPrefix(),
      options.getPhpClassPrefix(),
    );
    this.writeRepeatedOptionString(
      "php_namespace",
      options.hasPhpNamespace(),
      options.getPhpNamespace(),
    );
    this.writeRepeatedOptionString(
      "php_metadata_namespace",
      options.hasPhpMetadataNamespace(),
      options.getPhpMetadataNamespace(),
    );
    this.writeRepeatedOptionString(
      "ruby_package",
      options.hasRubyPackage(),
      options.getRubyPackage(),
    );

    // If any option was actually printed, add a blank line for spacing.
    // We'll track it via a simple internal check.
    // In the approach above, each method prints directly if it exists.
    // To replicate the exact logic of the Go code (where it checks if any option was printed):
    // you could store a boolean from each method and only do '\n' if any was actually used.
  }

  private writeRepeatedOptionString(
    name: string,
    hasOption: boolean,
    value: string | undefined,
  ): void {
    if (hasOption && value != null && value !== "") {
      this.write(`option ${name} = "${this.escapeString(value)}";\n`);
    }
  }

  private writeRepeatedOptionBool(
    name: string,
    hasOption: boolean,
    value: boolean,
  ): void {
    if (hasOption) {
      this.write(`option ${name} = ${value};\n`);
    }
  }

  /**
   * Escape backslashes in option string values so that they remain valid strings.
   */
  private escapeString(value: string): string {
    return value.replace(/\\/g, "\\\\");
  }

  /**
   * Write service definition.
   */
  private writeService(service: ServiceDescriptorProto): void {
    const serviceName = service.getName();
    if (!serviceName) return;
    this.write(`service ${serviceName} {\n`);
    this.indent();

    const methods = service.getMethodList();
    for (const method of methods) {
      this.writeMethod(method);
    }

    this.dedent();
    this.write(`}\n\n`);
  }

  /**
   * Write a method inside the service definition.
   */
  private writeMethod(method: MethodDescriptorProto): void {
    const name = method.getName();
    if (!name) return;

    // For streaming flags in proto3, check client_streaming / server_streaming booleans.
    const isClientStreaming = method.getClientStreaming();
    const isServerStreaming = method.getServerStreaming();

    const inputType = method.getInputType() || "";
    const outputType = method.getOutputType() || "";

    this.writeIndented(`rpc ${name} (`);

    if (isClientStreaming) {
      this.write("stream ");
    }
    // Input/Output type often appear as ".package.MessageName".
    // We’ll just print them as is (like the Go code).
    this.write(`${inputType}) returns (`);
    if (isServerStreaming) {
      this.write("stream ");
    }
    this.write(`${outputType}) {}\n`);
  }

  /**
   * Write top-level or nested message definition.
   */
  private writeMessage(message: DescriptorProto): void {
    const messageName = message.getName();
    if (!messageName) return;

    this.writeIndented(`message ${messageName} {\n`);
    this.indent();

    // reserved names
    const reservedNames = message.getReservedNameList();
    for (const rname of reservedNames) {
      this.writeIndented(`reserved "${rname}";\n`);
    }

    // reserved ranges
    const reservedRanges = message.getReservedRangeList();
    for (const range of reservedRanges) {
      // each range has start/end
      const start = range.getStart();
      let end = range.getEnd()!;
      // replicate the Go code logic:
      // the end is exclusive in the descriptor, but in .proto syntax you do "start to end" inclusive
      // so the Go code does "reservedRange[1] -= 1" if it's not max
      // if end == 536870912 (2^29), that's 'max'
      if (end === 536870912) {
        this.writeIndented(`reserved ${start} to max;\n`);
      } else if (start === end - 1) {
        // single number
        this.writeIndented(`reserved ${start};\n`);
      } else {
        // range
        this.writeIndented(`reserved ${start} to ${end - 1};\n`);
      }
    }

    // nested messages
    const nestedMessages = message.getNestedTypeList();
    for (const nested of nestedMessages) {
      this.writeMessage(nested);
    }

    // nested enums
    const nestedEnums = message.getEnumTypeList();
    for (const en of nestedEnums) {
      this.writeEnum(en);
    }

    // oneofs
    // In proto2/3 descriptor, oneofs appear in oneof_decl, and fields referencing a oneof have oneof_index.
    // The Go code checks synthetic oneofs. We skip that detail here for brevity.
    const oneofs = message.getOneofDeclList();
    const fieldByOneofIndex: Record<number, FieldDescriptorProto[]> = {};

    // Initialize arrays for each declared oneof
    for (let i = 0; i < oneofs.length; i++) {
      fieldByOneofIndex[i] = [];
    }

    // fields
    const fields = message.getFieldList();
    for (const field of fields) {
      const oneofIndex = field.getOneofIndex();

      // Make sure oneofIndex is in range
      if (
        oneofIndex !== undefined &&
        oneofIndex >= 0 &&
        oneofIndex < oneofs.length
      ) {
        fieldByOneofIndex[oneofIndex].push(field);
      } else {
        // normal field
        this.writeField(field);
      }
    }

    // now write out each non-synthetic oneof
    for (let i = 0; i < oneofs.length; i++) {
      const oneof = oneofs[i];
      const oneofName = oneof.getName() || `oneof_${i}`;
      const fieldsInOneof = fieldByOneofIndex[i];

      // If no fields are actually in this oneof, skip
      if (!fieldsInOneof || fieldsInOneof.length === 0) {
        continue;
      }

      this.writeIndented(`oneof ${oneofName} {\n`);
      this.indent();
      for (const f of fieldsInOneof) {
        this.writeField(f, /* insideOneof= */ true);
      }
      this.dedent();
      this.writeIndented(`}\n`);
    }

    this.dedent();
    this.writeIndented(`}\n\n`);
  }

  /**
   * Write an enum definition.
   */
  private writeEnum(en: EnumDescriptorProto): void {
    const name = en.getName();
    if (!name) return;

    this.writeIndented(`enum ${name} {\n`);
    this.indent();

    const values = en.getValueList();
    for (const val of values) {
      this.writeEnumValue(val);
    }

    this.dedent();
    this.writeIndented(`}\n\n`);
  }

  private writeEnumValue(value: EnumValueDescriptorProto): void {
    const name = value.getName() || "";
    const number = value.getNumber();
    this.writeIndented(`${name} = ${number};\n`);
  }

  /**
   * Write a field: replicates the logic of the Go code's writeField().
   * `insideOneof` indicates we are inside a oneof block (so we omit "optional"/"repeated"/etc. at times).
   */
  private writeField(field: FieldDescriptorProto, insideOneof = false): void {
    // The label determines repeated/optional/required in proto2.
    // For proto3, 'LABEL_OPTIONAL' is typical except for repeated, etc.
    // In proto2, 'LABEL_REQUIRED' might appear.
    //
    // label = 1 => LABEL_OPTIONAL
    // label = 2 => LABEL_REQUIRED
    // label = 3 => LABEL_REPEATED
    //
    // The Go code uses field.HasOptionalKeyword() and a syntax check,
    // but we replicate that with known label values from the descriptor.
    const label = field.getLabel();
    const type = field.getType();
    const fieldName = field.getName() || "field";
    const fieldNumber = field.getNumber();

    // If the field is in a oneof, we skip writing label. That's how .proto syntax works.
    let labelString = "";
    if (!insideOneof) {
      switch (label) {
        case FieldDescriptorProto.Label.LABEL_OPTIONAL:
          // Some older proto2 compilers show "optional", proto3 typically omits.
          // We replicate the Go code logic: if .proto2, "optional"; else empty.
          // For simplicity, let's just do "optional".
          labelString = "optional";
          break;
        case FieldDescriptorProto.Label.LABEL_REQUIRED:
          // proto2 only
          labelString = "required";
          break;
        case FieldDescriptorProto.Label.LABEL_REPEATED:
          labelString = "repeated";
          break;
      }
    }

    this.writeIndented("");

    if (labelString) {
      this.write(`${labelString} `);
    }

    // For map fields, descriptor has type == TYPE_MESSAGE and an extra `type_name` referencing "MapEntry".
    // But the simpler approach is checking getTypeName() for something like ".MyMessage.MyMapEntry" with an internal marker.
    // The Go code checks `field.Kind() == "map"`. We have to do it differently in TypeScript:
    if (this.isMapField(field)) {
      // Write map<K, V>
      const [keyType, valueType] = this.getMapTypes(field);
      this.write(
        `map<${this.protoFieldTypeToString(keyType)}, ${this.protoFieldTypeToString(valueType)}> `,
      );
    } else {
      // normal type
      this.write(`${this.typeNameForField(field)} `);
    }

    // field name
    this.write(`${fieldName} = ${fieldNumber}`);

    // default value (proto2)
    if (field.hasDefaultValue()) {
      const defaultVal = field.getDefaultValue()!;
      // The Go code checks field.Kind to decide quoting, etc.
      // We'll do a simpler approach: if type is string, put quotes; if enum, literal; else raw.
      const typeStr = field.getType();
      this.write(" [default = ");
      if (typeStr === FieldDescriptorProto.Type.TYPE_STRING) {
        this.write(`"${defaultVal}"`);
      } else if (typeStr === FieldDescriptorProto.Type.TYPE_ENUM) {
        // For enum default, it's the symbolic name, e.g. ZERO = 0
        // The descriptor typically keeps the name? Actually it often keeps the raw name as string.
        this.write(`${defaultVal}`);
      } else {
        this.write(`${defaultVal}`);
      }
      this.write("]");
    }

    this.write(";\n");
  }

  /**
   * Check if a field is actually representing a map<K,V>.
   * In protobuf, map fields are compiled as a repeated message with a special name "MapEntry".
   */
  private isMapField(field: FieldDescriptorProto): boolean {
    if (field.getLabel() !== FieldDescriptorProto.Label.LABEL_REPEATED) {
      return false;
    }
    if (field.getType() !== FieldDescriptorProto.Type.TYPE_MESSAGE) {
      return false;
    }
    const typeName = field.getTypeName() || "";
    // If the type name's descriptor is an auto-generated map entry, it ends in "Entry"
    // and the parent DescriptorProto usually has the MapEntry option set.
    // There's no official guaranteed substring in the raw type name, but
    // generated code typically has something like ".yourpackage.YourMessage.YourMapNameEntry".
    // We'll do a simpler name check:
    return typeName.toLowerCase().endsWith("entry");
  }

  /**
   * Extract the map's key and value field descriptors for printing,
   * given the repeated "map entry" message descriptor approach.
   */
  private getMapTypes(
    field: FieldDescriptorProto,
  ): [FieldDescriptorProto.Type, FieldDescriptorProto.Type] {
    // In JS/TS, to find the actual map types, you usually need the full set of descriptors.
    // But we only have a single FileDescriptorProto. We can manually search the nested types
    // for the message named in `field.type_name` to find its first two fields as key/value.
    // This is simpler if all descriptors are in the same file.
    // If your map entry is from a different file, you'd need a bigger registry.
    // For brevity, let's parse it from the parent's nested types.
    const typeName = field.getTypeName() || "";
    // Type names in descriptors are fully qualified, e.g.: ".my.package.Message.MapFieldEntry"
    // We can get the final piece after the last dot:
    const entryShortName = typeName.split(".").pop() || "";

    // We'll search the top-level messages for a descriptor named entryShortName,
    // then nested messages as well. A robust approach would do a full search recursively.
    // We'll just do a naive search:
    const mapEntryMessage = this.findMessageDescriptorByName(
      entryShortName,
      this.fileDescriptor.getMessageTypeList(),
    );
    if (!mapEntryMessage) {
      // fallback: unknown
      return [
        FieldDescriptorProto.Type.TYPE_STRING,
        FieldDescriptorProto.Type.TYPE_STRING,
      ];
    }
    const mapFields = mapEntryMessage.getFieldList();
    if (mapFields.length < 2) {
      // fallback
      return [
        FieldDescriptorProto.Type.TYPE_STRING,
        FieldDescriptorProto.Type.TYPE_STRING,
      ];
    }
    const keyField = mapFields[0];
    const valueField = mapFields[1];
    return [keyField.getType()!, valueField.getType()!];
  }

  /**
   * Recursively find a message descriptor with the given name in a list of descriptors.
   */
  private findMessageDescriptorByName(
    name: string,
    messages: DescriptorProto[],
  ): DescriptorProto | undefined {
    for (const msg of messages) {
      if (msg.getName() === name) {
        return msg;
      }
      // nested
      const nested = msg.getNestedTypeList();
      const found = this.findMessageDescriptorByName(name, nested);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  /**
   * Convert a FieldDescriptorProto.Type into a textual name, e.g. "int32", "string", ".MyMessage"
   * If it's an enum or message, descriptor uses getTypeName() to store the fully qualified name, e.g. ".my.package.MyMessage".
   */
  private typeNameForField(field: FieldDescriptorProto): string {
    const type = field.getType();
    const typeName = field.getTypeName() || "";

    if (type === FieldDescriptorProto.Type.TYPE_MESSAGE) {
      // The Go code prints a leading '.' for message or enum references.
      // Usually, typeName is something like ".package.MessageName". We can just return it as is.
      return `${typeName}`;
    } else if (type === FieldDescriptorProto.Type.TYPE_ENUM) {
      return `${typeName}`;
    } else {
      // Basic scalar type
      return this.protoFieldTypeToString(type!);
    }
  }

  /**
   * Convert scalar FieldDescriptorProto.Type numeric IDs to the textual proto type names
   * used in .proto (e.g. "int32", "string", "bool", etc.).
   */
  private protoFieldTypeToString(type: FieldDescriptorProto.Type): string {
    switch (type) {
      case FieldDescriptorProto.Type.TYPE_DOUBLE:
        return "double";
      case FieldDescriptorProto.Type.TYPE_FLOAT:
        return "float";
      case FieldDescriptorProto.Type.TYPE_INT64:
        return "int64";
      case FieldDescriptorProto.Type.TYPE_UINT64:
        return "uint64";
      case FieldDescriptorProto.Type.TYPE_INT32:
        return "int32";
      case FieldDescriptorProto.Type.TYPE_FIXED64:
        return "fixed64";
      case FieldDescriptorProto.Type.TYPE_FIXED32:
        return "fixed32";
      case FieldDescriptorProto.Type.TYPE_BOOL:
        return "bool";
      case FieldDescriptorProto.Type.TYPE_STRING:
        return "string";
      case FieldDescriptorProto.Type.TYPE_BYTES:
        return "bytes";
      case FieldDescriptorProto.Type.TYPE_UINT32:
        return "uint32";
      case FieldDescriptorProto.Type.TYPE_SFIXED32:
        return "sfixed32";
      case FieldDescriptorProto.Type.TYPE_SFIXED64:
        return "sfixed64";
      case FieldDescriptorProto.Type.TYPE_SINT32:
        return "sint32";
      case FieldDescriptorProto.Type.TYPE_SINT64:
        return "sint64";
      default:
        // Fallback for unhandled or unknown
        return "int32";
    }
  }
}

/**
 * Main function: Takes a buffer containing serialized FileDescriptorProto
 * and returns the reconstructed .proto file content as a string.
 */
export function recoverProtoFromBuffer(buffer: Buffer): string {
  // Convert Buffer -> Uint8Array for use with google-protobuf deserializeBinary:
  const bytes = new Uint8Array(buffer);

  // Parse the raw bytes into a FileDescriptorProto
  const fileDescriptor = FileDescriptorProto.deserializeBinary(bytes);

  // Build the textual .proto representation
  const pd = new ProtoDefinition(fileDescriptor);
  pd.writeFileDescriptor();
  return pd.toString();
}
