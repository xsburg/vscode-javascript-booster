import { JsCodeShift, Collection } from 'jscodeshift';
import { Position } from '../utils/Position';

type CodeModTransform = (
    fileInfo: { path: string; source: string; ast: Collection },
    api: { jscodeshift: JsCodeShift; stats(value: string): void },
    options: {
        selection: {
            startPos: Position;
            endPos: Position;
        };
    }
) => string | undefined | null;

type CanRunFunction = (
    fileInfo: { path: string; source: string; ast: Collection },
    api: { jscodeshift: JsCodeShift; stats(value: string): void },
    options: {
        selection: {
            startPos: Position;
            endPos: Position;
        };
    }
) => boolean;

export interface CodeModExports extends CodeModTransform {
    canRun?: CanRunFunction;
    title?: string;
    description?: string;
    detail?: string;
}

export interface CodeModDefinition {
    name: string;
    description: string;
    detail?: string;
    modFn: CodeModTransform;
    canRun?: CanRunFunction;
}
