import { JsCodeShift } from "./jscodeshift";

type CodeModTransform = (
    fileInfo: { path: string; source: string },
    api: { jscodeshift: JsCodeShift; stats: any },
    options: {
        selection: {
            startPos: number;
            endPos: number;
        };
    }) => string | undefined | null;

export interface CodeModExports extends CodeModTransform {
    canRun?: (
        fileInfo: { path: string; source: string },
        api: { jscodeshift: JsCodeShift; stats: any },
        options: {
            selection: {
                startPos: number;
                endPos: number;
            };
        }) => boolean;
    name?: string;
    description?: string;
    detail?: string;
}

export interface CodeModDefinition {
    name: string;
    description: string;
    detail?: string;
    modFn: CodeModTransform;
}
