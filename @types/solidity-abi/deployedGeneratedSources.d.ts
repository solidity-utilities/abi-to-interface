/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

export {};
declare global {
  export namespace Solidity {
    type deployedGeneratedSources = {
      [key: string]: unknown;
      ast: Solidity.Deployed_Generated_Source.nodeType.YulBlock;
      contents: JSON;
      id: number;
      language: "Yul" | string;
      name: "#utility.yul" | string;
    }[];

    namespace Deployed_Generated_Source {
      namespace nodeType {
        interface base {
          [key: string]: unknown;
          nodeType: string;
          src: Solidity.Atoms.src;
        }

        interface YulBlock extends base {
          nodeType: "YulBlock";
          statements: (
            | YulAssignment
            | YulBlock
            | YulExpressionStatement
            | YulIf
            | YulVariableDeclaration
          )[];
        }

        interface YulAssignment extends base {
          value: (YulFunctionCall | YulIdentifier);
          variableNames: YulIdentifier[];
        }

        interface YulExpressionStatement extends base {
          expression: YulFunctionCall;
          nodeType: "YulExpressionStatement";
        }

        interface YulFunctionCall extends base {
          arguments: (YulIdentifier | YulLiteral)[];
          functionName: YulIdentifier;
          nodeType: "YulFunctionCall";
        }

        interface YulFunctionDefinition extends base {
          body: YulBlock;
          name: string;
          nodeType: "YulFunctionDefinition";
          parameters: YulTypedName[];
          returnVariables: YulTypedName[];
          src: Solidity.Atoms.src;
        }

        interface YulTypedName extends base {
          nodeType: "YulTypedName";
          type: string;
        }

        interface YulIdentifier extends base {
          nodeType: "YulIdentifier";
        }

        interface YulIf extends base {
          body: YulBlock;
          condition: YulFunctionCall;
          nodeType: "YulIf";
        }

        interface YulVariableDeclaration extends base {
          value: YulFunctionCall | YulLiteral;
          variables: [];
        }

        interface YulLiteral extends base {
          kind: "number" | string;
          nodeType: "YulLiteral";
          type: string;
          value: string;
        }
      }
    }
  }
}
