export function assertNever<T extends never>(value: T) {
    throw new Error(
        `This code should never execute according to the type system. Please check the call stack, asserted value: ${value}.`
    );
}

export function createError(message: string, name?: string): Error {
    const error: any = new Error(message);
    error.name = name || 'Error';
    error.description = message;
    return error;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

export const identity = <T>(x: T) => x;
