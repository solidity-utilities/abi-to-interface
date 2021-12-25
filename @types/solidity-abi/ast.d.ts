/**
 * @file Define `ast` namespaces and types for Solidity ABI JSON file(s)
 * @author S0AndS0
 * @license AGPL-3.0
 */

export {};
declare global {
  /**
   * Solidity type descriptions for ABI JSON file(s)
   * @namespace {Object} Solidity
   */
  export namespace Solidity {
    /**
     * @typedef {Object} Solidity.ast
     * @prop {string} absolutePath
     * @prop {Solidity.AST.exportedSymbols} exportedSymbols
     * @prop {number} id
     * @prop {string} license
     * @prop {Solidity.AST.nodes} nodes
     * @prop {string} src
     */
    interface ast {
      absolutePath: `project:${string}` | string;
      exportedSymbols: AST.exportedSymbols;
      id: number;
      license: string;
      nodeType: "SourceUnit";
      nodes: AST.nodes;
      src: Solidity.Atoms.src;
    }

    /**
     * Type descriptions for {Solidity.ast}
     * @namespace {Solidity} AST
     */
    namespace AST {
      /**
       * @typedef {Object<Array<number>>} exportedSymbols
       */
      interface exportedSymbols {
        [key: string]: number[];
      }

      /**
       * @typedef {Array<Solidity.AST.nodeType.(ContractDefinition | PragmaDirective | StructDefinition)>} nodes
       */
      type nodes = (
        | AST.nodeType.ContractDefinition
        | AST.nodeType.EnumDefinition
        | AST.nodeType.FunctionDefinition
        | AST.nodeType.ImportDirective
        | AST.nodeType.PragmaDirective
        | AST.nodeType.StructDefinition
      )[];

      /**
       * @typedef {number":"number":"number} nameLocation
       */
      type nameLocation = `${number}:${number}:${number}`;

      /**
       * @typedef {"external"|"public"|"internal"|string} visibility
       */
      type visibility = "external" | "public" | "internal" | string;

      /**
       * stateMutability {"nonpayable"|string} stateMutability
       */
      type stateMutability = "nonpayable" | string;

      /**
       * @typedef {Object} typeDescriptions
       * @prop {string} typeIdentifier
       * @prop {string} typeString
       */
      interface typeDescriptions {
        [key: string]: string;
        typeIdentifier: string;
        typeString: string;
      }

      /**
       * Type descriptions for {Solidity.ast.nodes[]}
       * @namespace {Solidity.AST} nodeType
       */
      namespace nodeType {
        /**
         *
         */
        interface base {
          [key: string]: unknown;
          id: number;
          nodeType: string;
          src: Solidity.Atoms.src;
        }

        interface ImportDirective extends base {
          absolutePath: `project:${string}.sol` | string;
          file: `${string}.sol` | string;
          nameLocation: nameLocation;
          nodeType: "ImportDirective";
          scope: number;
          sourceUnit: number;
          symbolAliases: {
            [key: string]: unknown;
            foreign: Identifier;
            nameLocation: nameLocation;
          }[];
          unitAlias: string;
        }

        interface PragmaDirective extends base {
          literals: ["solidity", `${number}.${number}`, `.${number}`];
          nodeType: "PragmaDirective";
        }

        interface ContractDefinition extends base {
          abstract: boolean;
          baseContracts: unknown[];
          contractDependencies: unknown[];
          contractKind: "contract" | string;
          documentation?: StructuredDocumentation;
          fullyImplemented: boolean;
          linearizedBaseContracts: number[];
          name: string;
          nameLocation: nameLocation;
          nodes: (
            | EnumDefinition
            | EventDefinition
            | FunctionDefinition
            | StructDefinition
            | VariableDeclaration
          )[];
          nodeType: "ContractDefinition";
          scope: number;
          usedErrors: unknown[];
        }

        interface StructDefinition extends base {
          canonicalName: string;
          members: VariableDeclaration[];
          name: string;
          nameLocation: nameLocation;
          nodeType: "StructDefinition";
          scope: number;
          visibility: visibility;
        }

        interface VariableDeclaration extends base {
          constant: boolean;
          mutability: "mutable" | string;
          name: string;
          nameLocation: nameLocation;
          nodeType: "VariableDeclaration";
          scope: number;
          stateVariable: boolean;
          storageLocation: "calldata" | "default" | "memory" | string;
          typeDescriptions: typeDescriptions;
          typeName:
            | ArrayTypeName
            | ElementaryTypeName
            | Mapping
            | UserDefinedTypeName;
          visibility: visibility;
        }

        interface ArrayTypeName extends base {
          baseType:
            | ArrayTypeName
            | ElementaryTypeName
            | Mapping
            | UserDefinedTypeName;
          nodeType: "ArrayTypeName";
          typeDescriptions: typeDescriptions;
        }

        interface ElementaryTypeName extends base {
          name: string;
          nodeType: "ElementaryTypeName";
          stateMutability: stateMutability;
          typeDescriptions: typeDescriptions;
        }

        interface Mapping extends base {
          keyType: ElementaryTypeName | UserDefinedTypeName;
          nodeType: "Mapping";
          typeDescriptions: typeDescriptions;
          valueType:
            | ArrayTypeName
            | ElementaryTypeName
            | Mapping
            | UserDefinedTypeName;
        }

        interface UserDefinedTypeName extends base {
          nodeType: "UserDefinedTypeName";
          pathNode: IdentifierPath;
          referencedDeclaration: number;
          typeDescriptions: typeDescriptions;
        }

        interface IdentifierPath extends base {
          name: string;
          nodeType: "IdentifierPath";
          referencedDeclaration: number;
        }

        interface Block extends base {
          nodeType: "Block";
          statements: (
            | VariableDeclarationStatement
            | ExpressionStatement
            | Return
          )[];
        }

        interface VariableDeclarationStatement extends base {
          assignments: number[];
          declarations: VariableDeclaration[];
        }

        interface ExpressionStatement extends base {
          expression: Assignment;
        }

        interface EnumDefinition extends base {
          canonicalName: string;
          name: string;
          members: EnumValue[];
          nameLocation: nameLocation;
          nodeType: "EnumDefinition";
        }

        interface EnumValue extends base {
          name: string;
          nameLocation: nameLocation;
          nodeType: "EnumValue";
        }

        interface EventDefinition extends base {
          anonymous: boolean;
          name: string;
          nameLocation: nameLocation;
          nodeType: "EventDefinition";
          parameters: ParameterList;
        }

        interface Return extends base {
          functionReturnParameters: number;
          nodeType: "Return";
        }

        interface Assignment extends base {
          isConstant: boolean;
          isLValue: boolean;
          isPure: boolean;
          lValueRequested: boolean;
          leftHandSide: Identifier;
          nodeType: "Assignment";
          operator: "=" | string;
          rightHandSide: Identifier;
          typeDescriptions: typeDescriptions;
        }

        interface Identifier extends base {
          name: string;
          nodeType: "Identifier";
          overloadedDeclarations: unknown[];
          referencedDeclaration: number;
          typeDescriptions: typeDescriptions;
        }

        interface ParameterList extends base {
          nodeType: "ParameterList";
          parameters: VariableDeclaration[];
        }

        interface FunctionDefinition extends base {
          body: Block;
          documentation?: StructuredDocumentation;
          implemented: boolean;
          kind: "constructor" | "function" | string;
          modifiers: unknown[];
          name: string;
          nameLocation: nameLocation;
          nodeType: "FunctionDefinition";
          parameters: ParameterList;
          returnParameters: ParameterList;
          scope: number;
          stateMutability: stateMutability;
          virtual: boolean;
          visibility: visibility;
        }

        interface StructuredDocumentation extends base {
          nodeType: "StructuredDocumentation";
          text: string;
        }
      }
    }
  }
}
