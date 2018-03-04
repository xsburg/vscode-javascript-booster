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
    scope?: 'global' | 'cursor';
    title?: string;
    description?: string;
    detail?: string;
}

export enum CodeModScope {
    Global = 'global',
    Cursor = 'cursor'
}

export interface CodeModDefinition {
    name: string;
    description: string;
    detail?: string;
    scope: CodeModScope;
    modFn: CodeModTransform;
    canRun?: CanRunFunction;
}
