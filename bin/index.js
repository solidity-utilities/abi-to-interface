#!/usr/bin/env node
"use strict";
require("source-map-support").install();
const fs = require("fs");
const path = require("path");
(function () {
    const package_data = require(path.join(path.dirname(__dirname), "package.json"));
    const configurations = package_data.cli;
    const cli_parameters = parseCLI({
        parameters: process.argv,
        configurations,
    });
    if (cli_parameters.verbose) {
        console.log({ cli_parameters });
    }
    if (cli_parameters.help) {
        console.log(formatHelp({ configurations, package_data }));
        return;
    }
    else if (cli_parameters.version) {
        console.log(formatVersion(package_data));
        return;
    }
    if (!cli_parameters.abi) {
        throw new Error("Missing '--abi' CLI argument");
    }
    else if (!fs.existsSync(cli_parameters["abi"])) {
        throw new Error(`ABI file does not exist -> ${cli_parameters.abi}`);
    }
    let writter_callback = ({ path, content, }) => {
        console.log(content);
    };
    if (cli_parameters.out) {
        if (fs.existsSync(cli_parameters.out) && !cli_parameters.clobber) {
            throw new Error("Missing '--clobber' CLI argument");
        }
        writter_callback = ({ path, content, }) => {
            fs.writeFileSync(path, content);
        };
    }
    if (cli_parameters.abi && !fs.existsSync(cli_parameters.abi)) {
        throw new Error(`ABI file does not exist -> ${cli_parameters.abi}`);
    }
    const solidity_data = JSON.parse(fs.readFileSync(cli_parameters.abi));
    const parsed_ast = parse_ast({
        configurations: cli_parameters,
        solidity_data,
    });
    const content = build_interface({
        configurations: cli_parameters,
        parsed_ast,
    });
    if (cli_parameters.verbose) {
        console.log(JSON.stringify(parsed_ast, null, 2));
    }
    writter_callback({ content, path: cli_parameters.out });
})();
("use strict");
function build_interface_enums({ configurations, enums, indentation = 0, }) {
    return Object.entries(enums)
        .reduce((accumulator, [key, data]) => {
        if (!data.required) {
            if (configurations.verbose) {
                console.log("build_interface_enums skipping ->", { key });
            }
            return accumulator;
        }
        const indentation_value = "    ";
        const output = [
            `${indentation_value.repeat(indentation)}enum ${data.name} {`,
        ];
        output.push(data.members
            .map((member) => {
            return `${indentation_value.repeat(indentation + 1)}${member}`;
        })
            .join(",\n"));
        output.push("}");
        accumulator.push(output.join("\n"));
        return accumulator;
    }, [])
        .join("\n\n");
}
("use strict");
function build_interface({ configurations, parsed_ast, }) {
    const chunks = [];
    if (!!parsed_ast.license.length) {
        chunks.push(`// SPDX-License-Identifier: ${parsed_ast.license}`);
    }
    if (!!parsed_ast.pragma.length) {
        chunks.push(`${parsed_ast.pragma};`);
    }
    if (!!chunks.length) {
        chunks.push("");
    }
    const imports = build_interface_imports({
        configurations,
        imports: parsed_ast.imports,
    });
    if (!!imports.length) {
        chunks.push(imports);
        chunks.push("");
    }
    const enums = build_interface_enums({
        configurations,
        enums: parsed_ast.enums,
        indentation: 0,
    });
    if (!!enums.length) {
        chunks.push(enums);
    }
    const structs = build_interface_structs({
        configurations,
        structs: parsed_ast.structs,
        indentation: 0,
    });
    if (!!structs.length) {
        if (!!enums.length) {
            chunks.push("");
        }
        chunks.push(structs);
    }
    const contracts = build_interface_contracts({
        configurations,
        contracts: parsed_ast.contracts,
    });
    if (!!contracts.length) {
        if (!!structs.length) {
            chunks.push("");
        }
        chunks.push(contracts);
    }
    return chunks.join("\n");
}
("use strict");
function build_interface_structs({ configurations, indentation = 0, structs, }) {
    return Object.entries(structs)
        .reduce((accumulator, [key, data]) => {
        if (!data.required) {
            if (configurations.verbose) {
                console.log("build_interface_structs skipping ->", { key });
            }
            return accumulator;
        }
        const indentation_value = "    ";
        const output = [
            `${indentation_value.repeat(indentation)}struct ${data.name} {`,
        ];
        output.push(data.members
            .map((member) => {
            return `${indentation_value.repeat(indentation + 1)}${member};`;
        })
            .join("\n"));
        output.push("}");
        accumulator.push(output.join("\n"));
        return accumulator;
    }, [])
        .join("\n\n");
}
("use strict");
function build_interface_contracts_events({ configurations, events, }) {
    return Object.entries(events).map(([key, data]) => {
        return `    event ${data.name}(${data.parameters.join(", ")};)`;
    });
}
("use strict");
function build_interface_contracts({ configurations, contracts, }) {
    return Object.entries(contracts)
        .reduce((accumulator, [key, contract]) => {
        const prefix = configurations.prefix !== undefined && !!configurations.prefix.length
            ? configurations.prefix
            : "";
        const suffix = configurations.suffix !== undefined && !!configurations.suffix.length
            ? configurations.suffix
            : "";
        const output = [
            "/// @title Automatically generated by `@solidity-utilities/abi-to-interface`",
            `interface ${prefix}${key}${suffix} {`,
        ];
        const enums = build_interface_enums({
            configurations,
            enums: contract.enums,
            indentation: 1,
        });
        if (!!enums.length) {
            output.push("    /* Enum definitions */");
            output.push("");
            output.push(enums);
        }
        const structs = build_interface_structs({
            configurations,
            structs: contract.structs,
            indentation: 1,
        });
        if (!!structs.length) {
            if (!!enums.length) {
                output.push("");
            }
            output.push("    /* Struct definitions */");
            output.push("");
            output.push(structs);
        }
        const events = build_interface_contracts_events({
            configurations,
            events: contract.events,
        });
        if (!!events.length) {
            if (!!structs.length || !!enums.length) {
                output.push("");
            }
            output.push("    /* Event definitions */");
            output.push("");
            output.push(events.join("\n\n"));
        }
        const variables = build_interface_contracts_variables({
            configurations,
            variables: contract.variables,
        });
        if (!!variables.length) {
            if (!!events.length || !!structs.length || !!enums.length) {
                output.push("");
            }
            output.push("    /* Variable getters */");
            output.push("");
            output.push(variables.join("\n\n"));
        }
        const functions = build_interface_contracts_functions({
            configurations,
            functions: contract.functions,
        });
        if (!!functions.length) {
            if (!!variables.length ||
                !!events.length ||
                !!structs.length ||
                !!enums.length) {
                output.push("");
            }
            output.push("    /* Function definitions */");
            output.push("");
            output.push(functions.join("\n\n"));
        }
        output.push("}");
        accumulator.push(output.join("\n"));
        return accumulator;
    }, [])
        .join("\n\n");
}
("use strict");
function build_interface_contracts_variables({ configurations, variables, }) {
    return Object.entries(variables).map(([key, data]) => {
        const output = [];
        const signature = [`    function ${data.name}`];
        if (data.parameters !== undefined && !!data.parameters.length) {
            signature.push(`(${data.parameters.join(", ")})`);
        }
        else {
            signature.push("()");
        }
        signature.push(` external`);
        signature.push(` returns (${data.returns.join(", ")})`);
        output.push(`${signature.join("")};`);
        return output.join("\n");
    });
}
("use strict");
function build_interface_contracts_functions_documentation({ configurations, documentation, }) {
    const output = [];
    if (documentation.notice !== undefined && !!documentation.notice.length) {
        output.push(`    /// @notice ${documentation.notice}`);
    }
    if (documentation.params !== undefined &&
        !!Object.keys(documentation.params).length) {
        Object.entries(documentation.params).forEach(([key, value]) => {
            output.push(`    /// @param ${key} ${value}`);
        });
    }
    if (documentation.returns !== undefined &&
        !!Object.keys(documentation.returns).length) {
        Object.entries(documentation.returns).forEach(([_key, value]) => {
            output.push(`    /// @return ${value}`);
        });
    }
    if (documentation.details !== undefined && !!documentation.details.length) {
        output.push(`    /// @dev ${documentation.details}`);
    }
    if (documentation.customs !== undefined &&
        !!Object.keys(documentation.customs).length) {
        Object.entries(documentation.customs).forEach(([key, value]) => {
            output.push(`    /// @${key} ${value}`);
        });
    }
    return output;
}
("use strict");
function build_interface_contracts_functions({ configurations, functions, }) {
    return Object.entries(functions).map(([key, data]) => {
        const output = [];
        if (configurations.include_documentation &&
            data.documentation !== undefined) {
            const documentation = build_interface_contracts_functions_documentation({
                configurations,
                documentation: data.documentation,
            });
            output.push(...documentation);
        }
        const signature = [`    function ${data.name}`];
        if (data.parameters !== undefined && !!data.parameters.length) {
            signature.push(`(${data.parameters.join(", ")})`);
        }
        else {
            signature.push("()");
        }
        signature.push(` external`);
        if ("nonpayable" !== data.stateMutability) {
            signature.push(` ${data.stateMutability}`);
        }
        if (data.returns !== undefined && !!data.returns.length) {
            signature.push(` returns (${data.returns.join(", ")})`);
        }
        output.push(`${signature.join("")};`);
        return output.join("\n");
    });
}
("use strict");
function build_interface_imports({ configurations, imports, }) {
    return Object.entries(imports)
        .reduce((accumulate_required, [absolute_path, import_directive]) => {
        const names = Object.values(import_directive.symbolAliases).reduce((accumulate_names, symbol_alias) => {
            if (symbol_alias.required) {
                accumulate_names.push(symbol_alias.name);
            }
            return accumulate_names;
        }, []);
        if (!!names.length) {
            const file_path = build_interface_imports_path({
                configurations,
                absolute_path,
            });
            if (names.length > 1) {
                const parts = [
                    `import {`,
                    names.map((name) => `    ${name}`).join(",\n"),
                    `} from "${file_path}";`,
                ];
                accumulate_required.push(parts.join("\n"));
            }
            else {
                accumulate_required.push(`import { ${names.join(", ")} } from "${file_path}";`);
            }
        }
        return accumulate_required;
    }, [])
        .join("\n");
}
("use strict");
function build_interface_imports_path({ configurations, absolute_path, }) {
    if (!configurations.abi) {
        throw new Error("");
    }
    if (!configurations.out) {
        return absolute_path;
    }
    if (!absolute_path.startsWith("project:")) {
        return absolute_path;
    }
    if (configurations.out.startsWith("/")) {
        let package_json = configurations.package_json;
        if (!package_json) {
            const abi_path_parts = configurations.abi.split(path.sep);
            for (const index of Object.keys(abi_path_parts).reverse()) {
                const p = abi_path_parts
                    .slice(0, Number(index))
                    .concat("package.json")
                    .join(path.sep);
                if (fs.existsSync(p)) {
                    package_json = p;
                    break;
                }
            }
        }
        if (!package_json) {
            throw new Error("");
        }
        const package_json_data = require(package_json);
        const package_name = package_json_data["name"];
        if (!package_name) {
            throw new Error("");
        }
        return absolute_path.replace(/project:/, package_name);
    }
    const target_parts = absolute_path.replace("project:/", "").split("/");
    const iter_target = function* () {
        for (const value of target_parts) {
            yield value;
        }
    };
    const dependent_parts = configurations.out.split("/");
    const iter_dependent = function* () {
        for (const value of dependent_parts) {
            yield value;
        }
    };
    const zipper = function* (...iters) {
        let index = 0;
        while (true) {
            const results = iters.map((iter) => iter.next());
            if (results.every(({ done }) => done === true)) {
                break;
            }
            yield [index++, results.map(({ value }) => value)];
        }
    };
    let index = -1;
    for (const [i, [target, dependent]] of zipper(iter_target(), iter_dependent())) {
        if (target !== dependent) {
            index = i;
            break;
        }
    }
    const divergent_target_parts = target_parts.slice(index);
    const divergent_dependent_parts = dependent_parts.slice(index);
    if (divergent_dependent_parts.length > 1) {
        return divergent_dependent_parts
            .slice(0, divergent_dependent_parts.length - 1)
            .map((part, i) => {
            if (i <= index) {
                return "..";
            }
            else {
                return part;
            }
        })
            .concat(divergent_target_parts[divergent_target_parts.length - 1])
            .join("/");
    }
    else {
        return `./${divergent_target_parts.join("/")}`;
    }
}
function parse_ast_import_node({ configurations, node, parsed_ast, solidity_data, }) {
    if (!["ContractDefinition", "EnumDefinition", "StructDefinition"].some((kind) => kind === node.nodeType)) {
        const message = [
            `parse_ast_import_node sent incorect node type -> ${node.nodeType}`,
            'Acceptable types are; "ContractDefinition", "EnumDefinition", or "StructDefinition"',
            JSON.stringify(node, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    const absolute_path = solidity_data.ast.absolutePath;
    const import_directive = parsed_ast.imports.hasOwnProperty(absolute_path)
        ? parsed_ast.imports[absolute_path]
        : {
            absolutePath: absolute_path,
            symbolAliases: {},
        };
    const symbol_aliase = import_directive.symbolAliases.hasOwnProperty(node.name)
        ? import_directive.symbolAliases[node.name]
        : {
            name: node.name,
            required: false,
        };
    import_directive.symbolAliases[node.name] = symbol_aliase;
    parsed_ast.imports[absolute_path] = import_directive;
}
function parse_ast({ configurations, solidity_data, }) {
    const { ast, sourcePath } = solidity_data;
    const target_contract = configurations.abi.split(path.sep).at(-1).split(".")[0];
    const parsed_ast = {
        contracts: {},
        enums: {},
        imports: {},
        license: solidity_data.ast.license,
        pragma: "",
        relativePath: parse_ast_path({ solidity_data }),
        structs: {},
    };
    return solidity_data.ast.nodes.reduce((accumulator, node) => {
        if ("ContractDefinition" === node.nodeType) {
            if (configurations.import_contracts) {
                parse_ast_import_node({
                    configurations,
                    node,
                    parsed_ast,
                    solidity_data,
                });
            }
            if (node.name === target_contract || !configurations.import_contracts) {
                accumulator.contracts[node.name] = parse_ast_contract({
                    configurations,
                    contract_definition: node,
                    parsed_ast,
                    solidity_data,
                });
            }
        }
        else if ("EnumDefinition" === node.nodeType) {
            if (configurations.import_enums) {
                parse_ast_import_node({
                    configurations,
                    node,
                    parsed_ast,
                    solidity_data,
                });
            }
            else if (!accumulator.enums.hasOwnProperty(node.name)) {
                accumulator.enums[node.name] = parse_ast_enum_definition({
                    configurations,
                    parsed_ast,
                    solidity_data,
                    enum_definition: node,
                });
            }
        }
        else if ("FunctionDefinition" === node.nodeType &&
            configurations.verbose) {
            console.log("// NOTICE: parse_ast ignoring FunctionDefinition ->", {
                node,
            });
        }
        else if ("ImportDirective" === node.nodeType) {
            accumulator.imports[node.absolutePath] = parse_ast_import_directive({
                configurations,
                parsed_ast,
                solidity_data,
                import_directive: node,
            });
        }
        else if ("PragmaDirective" == node.nodeType) {
            const version = node.literals
                .filter((literal) => {
                return literal !== "solidity";
            })
                .join("");
            accumulator.pragma = `pragma solidity ${version}`;
        }
        else if ("StructDefinition" === node.nodeType) {
            if (configurations.import_structs) {
                parse_ast_import_node({
                    configurations,
                    node,
                    parsed_ast,
                    solidity_data,
                });
            }
            else if (!accumulator.structs.hasOwnProperty(node.name)) {
                accumulator.structs[node.name] = parse_ast_struct_definition({
                    configurations,
                    parsed_ast,
                    solidity_data,
                    struct_definition: node,
                });
            }
        }
        return accumulator;
    }, parsed_ast);
}
function parse_ast_path({ solidity_data: { sourcePath, ast: { absolutePath }, }, }) {
    const project_name = sourcePath
        .replace(absolutePath.replace("project:", ""), "")
        .split(path.sep)
        .slice(-1)[0];
    return absolutePath.replace("project:", project_name);
}
function parse_ast_enum_definition({ configurations, parsed_ast, solidity_data, enum_definition, }) {
    if ("EnumDefinition" !== enum_definition.nodeType) {
        const message = [
            `parse_ast_enum_definition sent incorect node type -> ${enum_definition.nodeType}`,
            'Acceptable type is "EnumDefinition"',
            JSON.stringify(enum_definition, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    if (enum_definition.canonicalName.includes(".")) {
        const contract_name = enum_definition.canonicalName.split(".")[0];
        if (parsed_ast.contracts.hasOwnProperty(contract_name) &&
            parsed_ast.contracts[contract_name].enums.hasOwnProperty(enum_definition.name)) {
            return parsed_ast.contracts[contract_name].enums[enum_definition.name];
        }
    }
    return {
        canonicalName: enum_definition.canonicalName,
        members: enum_definition.members.map((member) => {
            return member.name;
        }),
        name: enum_definition.name,
        required: false,
    };
}
function parse_ast_import_directive({ configurations, parsed_ast, solidity_data, import_directive, }) {
    if ("ImportDirective" !== import_directive.nodeType) {
        const message = [
            `parse_ast_import_directive sent incorect node type -> ${import_directive.nodeType}`,
            'Acceptable node type is "ImportDirective"',
            JSON.stringify(import_directive, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    const symbolAliases = import_directive.symbolAliases.reduce((accumulator, alias) => {
        accumulator[alias.foreign.name] = {
            name: alias.foreign.name,
            required: false,
        };
        return accumulator;
    }, {});
    return {
        absolutePath: import_directive.absolutePath,
        symbolAliases,
    };
}
("use strict");
function parse_ast_struct_definition({ configurations, parsed_ast, solidity_data, struct_definition, }) {
    if ("StructDefinition" !== struct_definition.nodeType) {
        const message = [
            `parse_ast_struct_definition sent incorect node type -> ${struct_definition.nodeType}`,
            'Acceptable type is "StructDefinition"',
            JSON.stringify(struct_definition, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    if (struct_definition.canonicalName.includes(".")) {
        const contract_name = struct_definition.canonicalName.split(".")[0];
        if (parsed_ast.contracts.hasOwnProperty(contract_name) &&
            parsed_ast.contracts[contract_name].structs.hasOwnProperty(struct_definition.name)) {
            return parsed_ast.contracts[contract_name].structs[struct_definition.name];
        }
    }
    const members = struct_definition.members.map((member) => {
        let type_name;
        if ("ArrayTypeName" === member.typeName.nodeType) {
            type_name = parse_ast_type_name_array({
                array_type_name: member.typeName,
                configurations,
                parsed_ast,
                parsed_variable_declaration: {},
                solidity_data,
            });
        }
        else if ("ElementaryTypeName" === member.typeName.nodeType) {
            type_name = member.typeName.typeDescriptions.typeString;
        }
        else if ("Mapping" === member.typeName.nodeType) {
            const key = parse_ast_type_name_mapping_key({
                configurations,
                mapping: member.typeName,
                parsed_ast,
                solidity_data,
            });
            const value = parse_ast_type_name_mapping_value({
                configurations,
                mapping: member.typeName,
                parsed_ast,
                solidity_data,
            });
            type_name = `mapping(${key} => ${value})`;
        }
        else if ("UserDefinedTypeName" === member.typeName.nodeType) {
            type_name = parse_ast_type_name_user_defined({
                configurations,
                parsed_ast,
                solidity_data,
                user_defined_type_name: member.typeName,
            });
        }
        return `${type_name} ${member.name}`;
    });
    return {
        canonicalName: struct_definition.canonicalName,
        name: struct_definition.name,
        members,
        required: false,
    };
}
function parse_ast_contract({ configurations, contract_definition, parsed_ast, solidity_data, }) {
    if ("ContractDefinition" !== contract_definition.nodeType) {
        const message = [
            `parse_ast_contract sent incorect node type -> ${contract_definition.nodeType}`,
            'Acceptable type is "ContractDefinition"',
            JSON.stringify(contract_definition, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    const contract_name = contract_definition.name;
    const parsed_ast_contract = parsed_ast.hasOwnProperty(contract_name)
        ? parsed_ast[contract_name]
        : {
            enums: {},
            events: {},
            functions: {},
            name: contract_name,
            structs: {},
            variables: {},
        };
    return contract_definition.nodes.reduce((accumulator, node) => {
        if ("EnumDefinition" === node.nodeType &&
            !accumulator.enums.hasOwnProperty(node.name)) {
            accumulator.enums[node.canonicalName] = parse_ast_enum_definition({
                configurations,
                parsed_ast,
                solidity_data,
                enum_definition: node,
            });
        }
        else if ("EventDefinition" === node.nodeType &&
            !configurations.exclude_events &&
            !accumulator.events.hasOwnProperty(node.name)) {
            accumulator.events[node.name] = parse_ast_contract_event_definition({
                configurations,
                contract_definition,
                parsed_ast,
                solidity_data,
                event_definition: node,
            });
        }
        else if ("FunctionDefinition" === node.nodeType &&
            !configurations.exclude_functions &&
            "constructor" !== node.kind &&
            "internal" !== node.visibility &&
            !accumulator.functions.hasOwnProperty(node.name)) {
            accumulator.functions[node.name] = parse_ast_contract_function_definition({
                configurations,
                contract_definition,
                parsed_ast,
                solidity_data,
                node,
            });
        }
        else if ("StructDefinition" === node.nodeType &&
            !accumulator.structs.hasOwnProperty(node.name)) {
            accumulator.structs[node.canonicalName] = parse_ast_struct_definition({
                configurations,
                parsed_ast,
                solidity_data,
                struct_definition: node,
            });
        }
        else if ("VariableDeclaration" === node.nodeType &&
            !configurations.exclude_variables &&
            !accumulator.variables.hasOwnProperty(node.name)) {
            accumulator.variables[node.name] = parse_ast_variable_declaration({
                configurations,
                parsed_ast,
                solidity_data,
                node,
            });
        }
        return accumulator;
    }, parsed_ast_contract);
}
function parse_ast_contract_event_definition({ configurations, contract_definition, parsed_ast, solidity_data, event_definition, }) {
    if ("EventDefinition" !== event_definition.nodeType) {
        const message = [
            `parse_ast_contract_event_definition sent incorect event_definition type -> ${event_definition.nodeType}`,
            'Acceptable type is "EventDefinition"',
            JSON.stringify(event_definition, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    return {
        name: event_definition.name,
        parameters: parse_ast_parameter_list({
            configurations,
            contract_definition,
            parsed_ast,
            solidity_data,
            parameters: event_definition.parameters,
        }),
    };
}
("use strict");
function parse_ast_contract_function_definition({ configurations, contract_definition, parsed_ast, solidity_data, node, }) {
    var _a, _b, _c, _d;
    if ("FunctionDefinition" !== node.nodeType) {
        const message = [
            `parse_ast_contract_function_definition sent incorect node type -> ${node.nodeType}`,
            'Acceptable type is "FunctionDefinition"',
            JSON.stringify(node, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    const function_definition = {
        name: node.name,
        visibility: node.visibility,
        stateMutability: node.stateMutability,
    };
    function_definition.parameters = parse_ast_parameter_list({
        configurations,
        contract_definition,
        parsed_ast,
        solidity_data,
        parameters: node.parameters,
    });
    function_definition.returns = parse_ast_parameter_list({
        configurations,
        contract_definition,
        parsed_ast,
        solidity_data,
        parameters: node.returnParameters,
    });
    if (configurations.include_documentation) {
        const parameter_types = node.parameters.parameters.map((parameter) => {
            return parameter.typeDescriptions.typeString.split(" ")[0];
        });
        const keyName = `${function_definition.name}(${parameter_types.join(",")})`;
        const customs = Object.entries(solidity_data.devdoc.methods[keyName]).reduce((accumulator, [key, value]) => {
            if (key.startsWith("custom:")) {
                accumulator[key] = value;
            }
            return accumulator;
        }, {});
        function_definition.documentation = {
            customs,
            details: (_a = solidity_data.devdoc.methods[keyName]) === null || _a === void 0 ? void 0 : _a.details,
            keyName,
            notice: (_b = solidity_data.userdoc.methods[keyName]) === null || _b === void 0 ? void 0 : _b.notice,
            params: (_c = solidity_data.devdoc.methods[keyName]) === null || _c === void 0 ? void 0 : _c.params,
            returns: (_d = solidity_data.devdoc.methods[keyName]) === null || _d === void 0 ? void 0 : _d.returns,
        };
    }
    return function_definition;
}
function parse_ast_parameter_list_array_type({ configurations, contract_definition, parsed_ast, solidity_data, array_type_name, }) {
    if ("ArrayTypeName" !== array_type_name.nodeType) {
        const message = [
            `parse_ast_parameter_list_array_type sent incorect node type -> ${array_type_name.nodeType}`,
            'Acceptable type is "ArrayTypeName"',
            JSON.stringify(array_type_name, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    let type_name;
    if ("ArrayTypeName" === array_type_name.baseType.nodeType) {
        type_name = parse_ast_parameter_list_array_type({
            configurations,
            contract_definition,
            parsed_ast,
            solidity_data,
            array_type_name: array_type_name.baseType,
        });
    }
    else if ("ElementaryTypeName" === array_type_name.baseType.nodeType) {
        type_name = array_type_name.baseType.name;
    }
    else if ("Mapping" === array_type_name.baseType.nodeType) {
        type_name = parse_ast_parameter_list_mapping_type({
            configurations,
            contract_definition,
            parsed_ast,
            solidity_data,
            mapping: array_type_name.baseType,
        });
    }
    else if ("UserDefinedTypeName" === array_type_name.baseType.nodeType) {
        type_name = parse_ast_parameter_list_user_defined_type({
            configurations,
            contract_definition,
            parsed_ast,
            solidity_data,
            user_defined_type_name: array_type_name.baseType,
        });
    }
    return `${type_name}[]`;
}
function parse_ast_parameter_list_elementary({ configurations, contract_definition, parsed_ast, solidity_data, elementary_type_name, }) {
    if ("ElementaryTypeName" !== elementary_type_name.nodeType) {
        const message = [
            `parse_ast_parameter_list_elementary sent incorect node type -> ${elementary_type_name.nodeType}`,
            'Acceptable type is "ElementaryTypeName"',
            JSON.stringify(elementary_type_name, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    return elementary_type_name.name;
}
function parse_ast_parameter_list({ configurations, contract_definition, parsed_ast, solidity_data, parameters, }) {
    if ("ParameterList" !== parameters.nodeType) {
        const message = [
            `parse_ast_parameter_list sent incorect node type -> ${parameters.nodeType}`,
            'Acceptable type is "ContractDefinition"',
            JSON.stringify(parameters, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    return parameters.parameters.map((parameter) => {
        const parts = [];
        if ("ArrayTypeName" === parameter.typeName.nodeType) {
            const parameter_type = parse_ast_parameter_list_array_type({
                configurations,
                contract_definition,
                parsed_ast,
                solidity_data,
                array_type_name: parameter.typeName,
            });
            parts.push(parameter_type, "memory");
        }
        else if ("ElementaryTypeName" === parameter.typeName.nodeType) {
            const parameter_type = parse_ast_parameter_list_elementary({
                configurations,
                contract_definition,
                parsed_ast,
                solidity_data,
                elementary_type_name: parameter.typeName,
            });
            parts.push(parameter_type);
            if ("string" === parameter.typeName.typeDescriptions.typeString) {
                parts.push("memory");
            }
        }
        else if ("Mapping" === parameter.typeName.nodeType) {
            const parameter_type = parse_ast_parameter_list_mapping_type({
                configurations,
                contract_definition,
                parsed_ast,
                solidity_data,
                mapping: parameter.typeName,
            });
            parts.push(parameter_type, "storage");
        }
        else if ("UserDefinedTypeName" === parameter.typeName.nodeType) {
            const parameter_type = parse_ast_type_name_user_defined({
                configurations,
                parsed_ast,
                solidity_data,
                user_defined_type_name: parameter.typeName,
            });
            if (parameter.typeName.typeDescriptions.typeString.startsWith("struct ")) {
                parts.push(parameter_type, "memory");
            }
            else {
                parts.push(parameter_type);
            }
        }
        if (!parts.length) {
            console.log(JSON.stringify(parameter, null, 2));
            throw new Error("parse_ast_parameter_list failed to parse above parameter");
        }
        if (!!parameter.name && parameter.name !== parts[0]) {
            parts.push(parameter.name);
        }
        return parts.join(" ");
    });
}
function parse_ast_parameter_list_mapping_type({ configurations, contract_definition, parsed_ast, solidity_data, mapping, }) {
    if ("Mapping" !== mapping.nodeType) {
        const message = [
            `parse_ast_parameter_list_mapping_type sent incorect node type -> ${mapping.nodeType}`,
            'Acceptable type is "Mapping"',
            JSON.stringify(mapping, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    const type_key = parse_ast_type_name_mapping_key({
        configurations,
        mapping,
        parsed_ast,
        solidity_data,
    });
    const type_value = parse_ast_type_name_mapping_value({
        configurations,
        mapping,
        parsed_ast,
        solidity_data,
    });
    return `mapping(${type_key} => ${type_value})`;
}
function parse_ast_parameter_list_user_defined_type({ configurations, contract_definition, parsed_ast, solidity_data, user_defined_type_name, }) {
    if ("UserDefinedTypeName" !== user_defined_type_name.nodeType) {
        const message = [
            `parse_ast_parameter_list_user_defined_type sent incorect node type -> ${user_defined_type_name.nodeType}`,
            'Acceptable type is "Mapping"',
            JSON.stringify(user_defined_type_name, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    let type_name;
    const type_string = user_defined_type_name.typeDescriptions.typeString;
    if (type_string.startsWith("contract ")) {
        type_name = type_string.split(" ").at(-1);
    }
    else if (type_string.startsWith("enum ")) {
        type_name = type_string.split(" ").at(-1);
        parsed_ast_requires_enum({
            configurations,
            parsed_ast,
            type_name,
        });
    }
    else if (type_string.startsWith("struct ")) {
        type_name = type_string.split(" ").at(-1);
    }
    if (!type_name) {
        const message = [
            `parse_ast_parameter_list_user_defined_type failed to parse type string -> ${type_string}`,
            JSON.stringify(user_defined_type_name, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    parsed_ast_requires_import({
        configurations,
        parsed_ast,
        type_name,
    });
    return type_name;
}
function parse_ast_variable_declaration({ configurations, node, parsed_ast, solidity_data, }) {
    if ("VariableDeclaration" !== node.nodeType) {
        const message = [
            `parse_ast_variable_declaration sent incorect node type -> ${node.nodeType}`,
            'Acceptable type is "VariableDeclaration"',
            JSON.stringify(node, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    const parsed_variable_declaration = {
        name: node.name,
        stateMutability: node.stateMutability,
        visibility: node.visibility,
    };
    parsed_variable_declaration.parameters =
        parse_ast_variable_declaration_parameters({
            configurations,
            node,
            parsed_ast,
            solidity_data,
        });
    parsed_variable_declaration.returns = parse_ast_variable_declaration_returns({
        configurations,
        node,
        parsed_ast,
        solidity_data,
    });
    return parsed_variable_declaration;
}
function parse_ast_variable_declaration_parameters_array({ array_type_name, configurations, parsed_ast, solidity_data, }) {
    if ("ArrayTypeName" !== array_type_name.nodeType) {
        const message = [
            `parse_ast_variable_declaration_parameters_array sent incorect node type -> ${array_type_name.nodeType}`,
            'Acceptable type is "ArrayTypeName"',
            JSON.stringify(array_type_name, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    const parts = ["uint256"];
    if ("ArrayTypeName" === array_type_name.baseType.nodeType) {
        const type_name = parse_ast_variable_declaration_parameters_array({
            array_type_name: array_type_name.baseType,
            configurations,
            parsed_ast,
            solidity_data,
        });
        parts.push(...type_name);
    }
    else if ("Mapping" === array_type_name.baseType.nodeType) {
        const type_name = parse_ast_type_name_mapping_key({
            configurations,
            mapping: array_type_name.baseType,
            parsed_ast,
            solidity_data,
        });
        parts.push(type_name);
    }
    return parts;
}
function parse_ast_variable_declaration_parameters({ configurations, node, parsed_ast, solidity_data, }) {
    if ("VariableDeclaration" !== node.nodeType) {
        const message = [
            `parse_ast_variable_declaration_parameters sent incorect node type -> ${node.nodeType}`,
            'Acceptable type is "VariableDeclaration"',
            JSON.stringify(node, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    const type_name_parts = [];
    if ("ArrayTypeName" === node.typeName.nodeType) {
        const type_names = parse_ast_variable_declaration_parameters_array({
            array_type_name: node.typeName,
            configurations,
            parsed_ast,
            solidity_data,
        });
        type_name_parts.push(...type_names);
    }
    else if ("Mapping" === node.typeName.nodeType) {
        const type_name = parse_ast_type_name_mapping_key({
            configurations,
            mapping: node.typeName,
            parsed_ast,
            solidity_data,
        });
        type_name_parts.push(type_name);
    }
    return type_name_parts;
}
function parse_ast_variable_declaration_returns_array({ array_type_name, configurations, parsed_ast, solidity_data, }) {
    if ("ArrayTypeName" !== array_type_name.nodeType) {
        const message = [
            `parse_ast_variable_declaration_returns_array sent incorect node type -> ${array_type_name.nodeType}`,
            'Acceptable type is "ArrayTypeName"',
            JSON.stringify(array_type_name, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    const parts = [];
    if ("ArrayTypeName" === array_type_name.baseType.nodeType) {
        const type_name = parse_ast_variable_declaration_returns_array({
            array_type_name: array_type_name.baseType,
            configurations,
            parsed_ast,
            solidity_data,
        });
        parts.push(...type_name);
    }
    else if ("ElementaryTypeName" === array_type_name.baseType.nodeType) {
        const type_name = parse_ast_variable_declaration_returns_elementary({
            configurations,
            elementary_type_name: array_type_name.baseType,
            parsed_ast,
            solidity_data,
        });
        parts.push(type_name);
    }
    else if ("Mapping" === array_type_name.baseType.nodeType) {
        const type_name = parse_ast_variable_declaration_returns_mapping({
            configurations,
            mapping: array_type_name.baseType,
            parsed_ast,
            solidity_data,
        });
        parts.push(type_name);
    }
    else if ("UserDefinedTypeName" === array_type_name.baseType.nodeType) {
        const type_name = parse_ast_variable_declaration_returns_user_defined({
            configurations,
            parsed_ast,
            solidity_data,
            user_defined_type_name: array_type_name.baseType,
        });
        parts.push(type_name);
    }
    return parts;
}
function parse_ast_variable_declaration_returns_elementary({ configurations, elementary_type_name, parsed_ast, solidity_data, }) {
    if ("ElementaryTypeName" !== elementary_type_name.nodeType) {
        const message = [
            `parse_ast_variable_declaration_returns_elementary sent incorect node type -> ${elementary_type_name.nodeType}`,
            'Acceptable type is "ElementaryTypeName"',
            JSON.stringify(elementary_type_name, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    return elementary_type_name.name;
}
function parse_ast_variable_declaration_returns({ configurations, node, parsed_ast, solidity_data, }) {
    if ("VariableDeclaration" !== node.nodeType) {
        const message = [
            `parse_ast_variable_declaration_returns sent incorect node type -> ${node.nodeType}`,
            'Acceptable type is "VariableDeclaration"',
            JSON.stringify(node, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    const type_name_parts = [];
    if ("ArrayTypeName" === node.typeName.nodeType) {
        const type_names = parse_ast_variable_declaration_returns_array({
            array_type_name: node.typeName,
            configurations,
            parsed_ast,
            solidity_data,
        });
        type_name_parts.push(...type_names);
    }
    else if ("ElementaryTypeName" === node.typeName.nodeType) {
        const type_name = parse_ast_variable_declaration_returns_elementary({
            configurations,
            elementary_type_name: node.typeName,
            parsed_ast,
            solidity_data,
        });
        if ("string" === node.typeName.typeDescriptions.typeString) {
            type_name_parts.push(`${type_name} memory`);
        }
        else {
            type_name_parts.push(type_name);
        }
    }
    else if ("Mapping" === node.typeName.nodeType) {
        const type_name = parse_ast_variable_declaration_returns_mapping({
            configurations,
            mapping: node.typeName,
            parsed_ast,
            solidity_data,
        });
        type_name_parts.push(`${type_name} memory`);
    }
    else if ("UserDefinedTypeName" === node.typeName.nodeType) {
        const type_name = parse_ast_variable_declaration_returns_user_defined({
            configurations,
            parsed_ast,
            solidity_data,
            user_defined_type_name: node.typeName,
        });
        type_name_parts.push(`${type_name} memory`);
    }
    return type_name_parts;
}
function parse_ast_variable_declaration_returns_mapping({ mapping, configurations, parsed_ast, solidity_data, }) {
    if ("Mapping" !== mapping.nodeType) {
        const message = [
            `parse_ast_variable_declaration_returns_mapping sent incorect node type -> ${mapping.nodeType}`,
            'Acceptable type is "Mapping"',
            JSON.stringify(mapping, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    if ("ElementaryTypeName" === mapping.valueType.nodeType) {
        return parse_ast_variable_declaration_returns_elementary({
            configurations,
            elementary_type_name: mapping.valueType,
            parsed_ast,
            solidity_data,
        });
    }
    return parse_ast_type_name_mapping_value({
        configurations,
        mapping,
        parsed_ast,
        solidity_data,
    });
}
function parse_ast_variable_declaration_returns_user_defined({ configurations, parsed_ast, solidity_data, user_defined_type_name, }) {
    if ("UserDefinedTypeName" !== user_defined_type_name.nodeType) {
        const message = [
            `parse_ast_variable_declaration_returns_user_defined sent incorect node type -> ${user_defined_type_name.nodeType}`,
            'Acceptable type is "UserDefinedTypeName"',
            JSON.stringify(user_defined_type_name, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    return parse_ast_type_name_user_defined({
        configurations,
        parsed_ast,
        solidity_data,
        user_defined_type_name,
    });
}
function parsed_ast_requires_contract({ configurations, parsed_ast, type_name, }) {
    if (parsed_ast.contracts.hasOwnProperty(type_name)) {
        parsed_ast.contracts[type_name].required = true;
        return;
    }
}
("use strict");
function parsed_ast_requires_enum({ configurations, parsed_ast, type_name, }) {
    if (parsed_ast.enums.hasOwnProperty(type_name)) {
        parsed_ast.enums[type_name].required = true;
        return;
    }
    for (const [key, contract] of Object.entries(parsed_ast.contracts)) {
        if (contract.enums.hasOwnProperty(type_name)) {
            contract.enums[type_name].required = true;
            return;
        }
    }
}
function parsed_ast_requires_import({ configurations, parsed_ast, type_name, }) {
    for (const [key, data] of Object.entries(parsed_ast.imports)) {
        if (data.symbolAliases.hasOwnProperty(type_name)) {
            data.symbolAliases[type_name].required = true;
            break;
        }
    }
}
function parsed_ast_requires_struct({ configurations, parsed_ast, type_name, }) {
    if (parsed_ast.structs.hasOwnProperty(type_name)) {
        parsed_ast.structs[type_name].required = true;
        return;
    }
    for (const [key, contract] of Object.entries(parsed_ast.contracts)) {
        if (contract.structs.hasOwnProperty(type_name)) {
            contract.structs[type_name].required = true;
            return;
        }
    }
}
function parse_ast_type_name_array({ array_type_name, configurations, parsed_ast, parsed_variable_declaration, solidity_data, }) {
    if ("ArrayTypeName" !== array_type_name.nodeType) {
        const message = [
            `parse_ast_type_name_array sent incorect node type -> ${array_type_name.nodeType}`,
            'Acceptable type is "ArrayTypeName"',
            JSON.stringify(array_type_name, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    let type_name;
    if ("ArrayTypeName" === array_type_name.baseType.nodeType) {
        type_name = parse_ast_type_name_array({
            array_type_name: array_type_name.baseType,
            configurations,
            parsed_ast,
            parsed_variable_declaration,
            solidity_data,
        });
    }
    else if ("ElementaryTypeName" === array_type_name.baseType.nodeType) {
        type_name = array_type_name.baseType.name;
    }
    else if ("Mapping" === array_type_name.baseType.nodeType) {
        const key = array_type_name.baseType.keyType.name;
        const value = parse_ast_type_name_mapping_value({
            mapping: array_type_name.baseType,
            configurations,
            parsed_ast,
            parsed_variable_declaration,
            solidity_data,
        });
        if (typeof parsed_variable_declaration === "object") {
            parsed_variable_declaration.emit = false;
        }
        type_name = `mapping(${key} => ${value})`;
    }
    else if ("UserDefinedTypeName" === array_type_name.baseType.nodeType) {
        type_name = parse_ast_type_name_user_defined({
            configurations,
            parsed_ast,
            solidity_data,
            user_defined_type_name: array_type_name.baseType,
        });
    }
    if (!type_name) {
        const message = [
            "parse_ast_type_name_array failed to parse type name",
            JSON.stringify(array_type_name, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    return `${type_name}[]`;
}
function parse_ast_type_name_mapping_key({ configurations, mapping, parsed_ast, solidity_data, }) {
    if ("Mapping" !== mapping.nodeType) {
        const message = [
            `parse_ast_type_name_mapping_key sent incorect node type -> ${mapping.nodeType}`,
            'Acceptable type is "Mapping"',
            JSON.stringify(mapping, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    const type_name_parts = [];
    if ("ElementaryTypeName" === mapping.keyType.nodeType) {
        const type_name = mapping.keyType.typeDescriptions.typeString;
        type_name_parts.push(type_name);
        if ("string" === type_name) {
            type_name_parts.push("memory");
        }
    }
    else if ("UserDefinedTypeName" === mapping.keyType.nodeType) {
        const type_name = parse_ast_type_name_user_defined({
            configurations,
            user_defined_type_name: mapping.keyType,
            parsed_ast,
            solidity_data,
        });
        type_name_parts.push(mapping.keyType.pathNode.name);
        type_name_parts.push("memory");
    }
    if (!type_name_parts.length) {
        const message = [
            "parse_ast_type_name_mapping_key failed to parse type name",
            JSON.stringify(mapping, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    return type_name_parts.join(" ");
}
function parse_ast_type_name_mapping_value({ configurations, mapping, parsed_ast, parsed_variable_declaration, solidity_data, }) {
    if ("Mapping" !== mapping.nodeType) {
        const message = [
            `parse_ast_type_name_mapping_value sent incorect node type -> ${mapping.nodeType}`,
            'Acceptable type is "Mapping"',
            JSON.stringify(mapping, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    if ("ArrayTypeName" === mapping.valueType.nodeType) {
        return parse_ast_type_name_array({
            array_type_name: mapping.valueType,
            configurations,
            parsed_ast,
            parsed_variable_declaration,
            solidity_data,
        });
    }
    else if ("ElementaryTypeName" === mapping.valueType.nodeType) {
        return mapping.valueType.typeDescriptions.typeString;
    }
    else if ("Mapping" === mapping.valueType.nodeType) {
        const key = parse_ast_type_name_mapping_key({
            mapping: mapping.valueType,
            configurations,
            parsed_ast,
            solidity_data,
        });
        const type_name = parse_ast_type_name_mapping_value({
            mapping: mapping.valueType,
            configurations,
            parsed_ast,
            parsed_variable_declaration,
            solidity_data,
        });
        if (typeof parsed_variable_declaration === "object") {
            parsed_variable_declaration.emit = false;
        }
        return `mapping(${key} => ${type_name})`;
    }
    else if ("UserDefinedTypeName" === mapping.valueType.nodeType) {
        return parse_ast_type_name_user_defined({
            user_defined_type_name: mapping.valueType,
            configurations,
            parsed_ast,
            solidity_data,
        });
    }
    const message = [
        "parse_ast_type_name_mapping_value failed to parse type name",
        JSON.stringify(mapping, null, 2),
    ];
    throw new Error(message.join("\n"));
}
function parse_ast_type_name_user_defined({ configurations, parsed_ast, solidity_data, user_defined_type_name, }) {
    if ("UserDefinedTypeName" !== user_defined_type_name.nodeType) {
        const message = [
            `parse_ast_type_name_user_defined sent incorect node type -> ${user_defined_type_name.nodeType}`,
            'Acceptable type is "UserDefinedTypeName"',
            JSON.stringify(user_defined_type_name, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    let type_name;
    const type_string = user_defined_type_name.typeDescriptions.typeString;
    if (type_string.startsWith("contract ")) {
        type_name = type_string.split(" ").at(-1);
        parsed_ast_requires_contract({
            configurations,
            parsed_ast,
            type_name,
        });
    }
    else if (type_string.startsWith("enum ")) {
        type_name = type_string.split(" ").at(-1);
        parsed_ast_requires_enum({
            configurations,
            parsed_ast,
            type_name,
        });
    }
    else if (type_string.startsWith("struct ")) {
        type_name = type_string.split(" ").at(-1);
        parsed_ast_requires_struct({
            configurations,
            parsed_ast,
            type_name,
        });
    }
    if (!type_name) {
        const message = [
            "parse_ast_type_name_user_defined failed to parse type name",
            JSON.stringify(user_defined_type_name, null, 2),
        ];
        throw new Error(message.join("\n"));
    }
    parsed_ast_requires_import({
        configurations,
        parsed_ast,
        type_name,
    });
    return type_name;
}
function formatHelp({ configurations, package_data, }) {
    const message = [
        `${package_data.description}\n\n`,
        `Usage: solidity-abi-to-interface [OPTIONS]...\n\n`,
    ];
    const usage = Object.entries(configurations).forEach(([key, config]) => {
        message.push(config.parameters.join("    "));
        message.push(`    ${config.help}\n`);
    });
    return message.join("\n");
}
function formatVersion({ package_data, }) {
    return [
        `${package_data.name} - ${package_data.version}`,
        package_data.license,
        `Written by ${package_data.author}`,
    ].join("\n");
}
function parseCLI({ parameters, configurations, }) {
    return Object.entries(configurations).reduce((accumulator, [key, config]) => {
        accumulator[key] = config.value_default;
        for (let index = 0; index < parameters.length; index++) {
            let parameter = parameters[index];
            if (parameter.includes("=")) {
                parameter = parameter.split("=")[0];
            }
            if (!config.parameters.includes(parameter)) {
                continue;
            }
            if (config.value_type === "boolean") {
                accumulator[key] = !config.value_default;
            }
            else {
                let value;
                if (parameters[index].includes("=")) {
                    value = parameters[index].split("=").slice(1).join("=");
                }
                else {
                    index++;
                    value = parameters[index];
                }
                if (config.value_type === "number") {
                    index++;
                    accumulator[key] = Number(value);
                }
                else if (config.value_type === "string") {
                    index++;
                    accumulator[key] = value;
                }
            }
        }
        return accumulator;
    }, {});
}
//# sourceMappingURL=index.js.map