/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

export {};
declare global {
  export namespace Parsed {
    interface ast {
      [key: string]: string | Object;
      contracts: { [key: string]: AST.Contract };
      enums: { [key: string]: AST.EnumDefinition };
      imports: { [key: string]: AST.ImportDirective };
      license: string;
      pragma: string;
      relativePath: string;
      structs: { [key: string]: AST.StructDefinition };
    }

    namespace AST {
      interface base {
        [key: string]: unknown;
      }

      interface Contract extends base {
        [key: string]: string | Object;
        enums: { [key: string]: EnumDefinition };
        events: { [key: string]: EventDefinition };
        functions: { [key: string]: FunctionDefinition };
        name: string;
        structs: { [key: string]: StructDefinition };
        variables: { [key: string]: VariableDeclaration };
      }

      interface Documentation extends base {
        [key: string]: Object | undefined | string;
        details?: string;
        keyName: `${string}(${string})` | string;
        notice?: string;
        params?: {
          [key: string]: string;
        };
        returns?: {
          [key: string]: string;
        };
        customs?: {
          [key: string]: string;
        }
      }

      interface EventDefinition extends base {
        name: string;
        parameters: string[];
      }

      interface FunctionDefinition extends base {
        comments?: string[];
        documentation: Documentation;
        name: string;
        parameters?: string[];
        returns?: string[];
        stateMutability: string;
        visibility: string;
      }

      interface StructDefinition extends base {
        canonicalName: string;
        emit: boolean;
        members: string[];
        name: string;
        required: boolean;
      }

      interface EnumDefinition extends base {
        canonicalName: string;
        emit: boolean;
        members: string[];
        name: string;
        required: boolean;
      }

      interface ImportDirective extends base {
        absolutePath: string;
        // file: string;
        symbolAliases: symbolAliases;
      }

      interface symbolAliases {
        [key: string]: {
          [key: string]: boolean | string;
          name: string;
          required: boolean;
        };
      }

      interface VariableDeclaration extends base {
        comments?: string[];
        documentation: Documentation;
        name: string;
        parameters?: string[];
        returns: string[];
        stateMutability: string;
        visibility: string;
      }
    }
  }
}
