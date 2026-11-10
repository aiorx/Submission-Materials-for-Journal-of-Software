"""
    This script was initially Crafted via basic programming aids4.0 in a request to write a script that converts
    an openapi schema to Dart classes that are json serializable.

    It was then modified to account for special cases (e.g. handling of enums, imports and more)
"""

import re
import yaml

# Read the yaml file
with open("shared/openapi.yaml", "r") as file:
    openapi_schema = yaml.safe_load(file)

# Extract components
components = openapi_schema.get("components", {}).get("schemas", {})


def to_camel_case(snake_str):
    if "-" in snake_str:
        components = snake_str.split("-")
    else:
        components = snake_str.split("_")
    return components[0] + "".join(x.title() for x in components[1:])


camel_pattern = re.compile(r"(?<!^)(?=[A-Z])")


def to_snake_case(name):
    return camel_pattern.sub("_", name).lower()


def to_dart_type(property):
    p_type = property.get("type", "Object")
    p_fmt = property.get("format", None)

    imports = []

    if p_type == "array":
        item_info = property.get("items", {})
        item_type = item_info.get("type", "Object")
        if "$ref" in item_info:
            item_type = item_info["$ref"].split("/")[-1]
            imports.append(item_type)
            return "List<{}>".format(item_type), imports
        else:
            t, imp = to_dart_type(item_info)
            imports.extend(imp)
            return "List<{}>".format(t), imports
    elif "$ref" in property:
        dart_type = property["$ref"].split("/")[-1]
        imports.append(dart_type)
        return dart_type, imports
    elif p_type == "integer":
        return "int", []
    elif p_type == "string":
        if p_fmt == "date-time":
            return "DateTime", []
        return "String", []
    elif p_type == "number":
        return "double", []
    elif p_type == "boolean":
        return "bool", []
    else:
        return "Map<String, dynamic>", []


def is_standart_dart_type(t):
    if is_basic_dart_type(t):
        return True

    if t.startswith("Map"):
        return True

    if t.startswith("List"):
        return True


def is_basic_dart_type(t):
    if t in ["String", "int", "bool", "double"]:
        return True

    return False


def parse_enum(name, component):
    type_ = component.get("type")
    members = component.get("enum")

    values = "\n".join(["  @JsonValue('{}') {},".format(m, m) for m in members])
    template = "enum {} {{
{}
}}
".format(name, values)
    return template


def generate_dart_classes_new(components):
    class_templates = []
    enum_templates = []

    for class_name, component in components.items():
        if component.get("enum"):
            enum_templates.append((class_name, parse_enum(class_name, component)))
            continue

        properties = component.get("properties", {})
        required_properties = component.get("required", [])

        class_properties = []
        class_property_names_and_req = []
        imports = []

        for property_name, property_info in properties.items():
            p_type = property_info.get("type", "Object")
            p_fmt = property_info.get("format", None)
            is_required = property_name in required_properties
            property_name_camel_case = to_camel_case(property_name)

            dart_type, imports_ = to_dart_type(property_info)
            imports.extend(imports_)

            null_suffix = "" if is_required else "?"
            class_property_names_and_req.append((property_name_camel_case, is_required))

            json_key = ""
            if property_name_camel_case != property_name:
                json_key = '  @JsonKey(name: "{}")
'.format(property_name)

            class_properties.append(
                json_key
                + "  final {}{} {};".format(dart_type, null_suffix, property_name_camel_case)
            )

        class_template = "@JsonSerializable(explicitToJson: true, includeIfNull: false)
class {} {{
".format(class_name)
        class_template += "\n".join(class_properties)
        class_template += "\n\n"

        constructor_args = ",\n".join(
            [
                " " * 4 + ("required " if r else "") + "this.{}".format(p)
                for p, r in class_property_names_and_req
            ]
        )

        class_template += "  {}({{
{}}});".format(class_name, constructor_args)
        class_template += "

  factory {}.fromJson(Map<String, dynamic> json) => _${}FromJson(json);
".format(class_name, class_name)
        class_template += (
            "
  Map<String, dynamic> toJson() => _${}ToJson(this);
".format(class_name)
        )
        class_template += "}\n"

        class_templates.append((class_template, class_name, imports))

    return class_templates, enum_templates


class_templates, enum_templates = generate_dart_classes_new(components)

header = "/// THIS FILE HAS BEEN GENERATED BY THE SCRIPT openapi-to-dart.py
///
/// IT IS BEST NOT TO MODIFY IT TO AVOID INCOMPATABILITIES WITH THE API SCHEMA.

"

export_file = open("lib/model/generated.dart", "w")
export_file.write(
    "/// THIS FILE HAS BEEN GENERATED BY THE SCRIPT openapi-to-dart.py\n\n"
)

for t, name, imports in class_templates:
    snake_case = to_snake_case(name)
    with open("lib/model/generated/{}.dart".format(snake_case), "w") as f:
        f.write(header)
        f.write("import 'package:json_annotation/json_annotation.dart';\n\n")
        for imp in imports:
            f.write(
                "import 'package:app/model/generated/{}.dart';
".format(to_snake_case(imp))
            )
        f.write("part '{}.g.dart';

".format(snake_case))
        f.write(t)

    export_file.write("export 'generated/{}.dart' show {};
".format(snake_case, name))

for name, t in enum_templates:
    snake_case = to_snake_case(name)
    with open("lib/model/generated/{}.dart".format(snake_case), "w") as f:
        f.write(header)
        f.write("import 'package:json_annotation/json_annotation.dart';\n\n")
        f.write(t)

    export_file.write("export 'generated/{}.dart' show {};
".format(snake_case, name))

export_file.close()


""" HERE COMES THE GENERATING OF ENDPOINT CLASSES AND FUNCTIONS """


def indent(string, indent=2):
    indent_str = " " * indent
    lines = string.split("\n")
    return "\n".join(["{}{}".format(indent_str, line) for line in lines])


paths = openapi_schema.get("paths", None)
classes = {}

for path, content in paths.items():
    for method, info in content.items():
        # print(f"{method} {path} {info.get('operationId')}")
        path_segments = path.split("/")
        class_ = path_segments[1]
        if class_ not in classes:
            classes[class_] = []

        parameters = info.get("parameters", [])

        # list of tuples,
        # each being parameter schema, name, required bool, and where the param is applied
        input_args = []

        for param in parameters:
            schema_ = param.get("schema")
            input_args.append(
                (
                    schema_,  # .get("$ref").split("/")[-1],
                    param.get("name"),
                    param.get("required", False),
                    param.get("in"),
                )
            )

        request_body = info.get("requestBody")
        send_body_arg = ""
        additional_headers = None
        encode_to_json = True
        if request_body is not None:

            def process_body_schema(body):
                add_headers = None
                enc_json = True
                if "application/json" in body.get("content"):
                    body_schema = (
                        body.get("content").get("application/json").get("schema")
                    )
                elif "application/x-www-form-urlencoded" in body.get("content"):
                    body_schema = (
                        body.get("content")
                        .get("application/x-www-form-urlencoded")
                        .get("schema")
                    )
                    add_headers = 'additionalHeaders: {"Content-Type": "application/x-www-form-urlencoded"}'
                    enc_json = False
                else:
                    return "", None, True

                r = body.get("required", False)
                input_args.append((body_schema, "data", r, "body"))
                if is_standart_dart_type(to_dart_type(body_schema)[0]):
                    return "body: data", add_headers, enc_json
                else:
                    return "body: data.toJson()", add_headers, enc_json

            send_body_arg, additional_headers, encode_to_json = process_body_schema(
                request_body
            )

        input_args_string = ",\n".join(
            [
                ("required " if r else "")
                + "{}{} {}".format(to_dart_type(s)[0], '' if r else '?', to_camel_case(n))
                for s, n, r, _ in input_args
            ]
        )

        if len(input_args) == 0:
            input_args_string = ""
        elif len(input_args) == 1:
            input_args_string = "{{{}}}
".format(input_args_string)
        else:
            input_args_string = "{{
{}
}}".format(indent(input_args_string, 2))

        # construct the query Map if any are given
        query_params = [x for x in input_args if x[3] == "query"]
        q_string = ""
        if len(query_params) > 0:
            lines = []
            for q in query_params:
                prefix = ""
                q_snake = q[1]
                q_camel = to_camel_case(q_snake)
                if not q[2]:  # required?
                    prefix = "if ({} != null) ".format(q_camel)

                # if the arg is bool, int, double or String, it will be converted to String
                conversion = (
                    ".toString()" if is_basic_dart_type(to_dart_type(q[0])[0]) else ""
                )
                lines.append('{}"{}": {}{}'.format(prefix, q_snake, q_camel, conversion))
            lines = ",\n".join(lines)
            q_string = (
                "final Map<String, dynamic> __q = {{
{}
}};
".format(indent(lines, 2))
            )

        # path_params = [x for x in input_args if x[3] == "path"]
        for i, seg in enumerate(path_segments):
            if seg.startswith("{"):
                path_segments[i] = "${}".format(to_camel_case(seg[1:-1]))

        format_path_string = '"' + "/".join(path_segments) + '"'
        send_request_args = ["HttpMethod.{}".format(method), "{}".format(format_path_string)]
        if q_string != "":
            send_request_args.append("queryParams: __q")

        if send_body_arg != "":
            send_request_args.append(send_body_arg)

        if additional_headers:
            send_request_args.append(additional_headers)

        if not encode_to_json:
            send_request_args.append("encodeToJson: false")

        return_type = "void"
        response = info.get("responses").get("200")
        try:
            respSchema = response.get("content").get("application/json").get("schema")
            if respSchema:
                t, _ = to_dart_type(respSchema)
                return_type = t
        except Exception:
            pass

        return_statement = ""
        response_body_type = ""
        if return_type != "void":
            if return_type.startswith("List"):
                t = return_type.removeprefix("List<")[:-1]
                return_statement = (
                    "return responseBody.map((item) => {}.fromJson(item)).toList();".format(t)
                )
                response_body_type = "List "
            else:
                if is_standart_dart_type(return_type):
                    return_statement = "return responseBody;"
                else:
                    return_statement = "return {}.fromJson(responseBody);".format(return_type)

            return_statement = "\n" + return_statement

        send_request_args_string = ",\n".join(send_request_args)
        send_request_prefix = ""
        if return_type != "void":
            send_request_prefix = "final {}responseBody = ".format(response_body_type)

        function_body = (
            "{}{}await BackendService.instance.sendRequest(
{}
);{}".format(q_string, send_request_prefix, indent(send_request_args_string, 2), return_statement)
        )
        function_string = (
            "/// {}
static Future<{}> {}({}) async {{
{}
}}".format(info.get('summary', ''), return_type, to_camel_case(info.get('operationId')), input_args_string, indent(function_body, 2))
        )

        classes[class_].append(function_string)

for class_, functions in classes.items():
    with open("lib/provider/generated/{}_provider.dart".format(class_), "w") as f:
        f.write("import 'package:app/model/generated.dart';\n")
        f.write("import 'package:app/provider/backend.dart';\n\n")

        f.write("class {}Provider {{".format(class_.title()))
        for fun in functions:
            f.write("
{}
".format(indent(fun, 2)))
        f.write("}\n")
