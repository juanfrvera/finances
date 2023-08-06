export function getUIErrorString(error: unknown) {
    if (error instanceof Error) return error.message;
    return 'An unexpected error has occurred :(';
}