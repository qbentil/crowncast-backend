const CreateError = (message: string, code: number) => {
    const error = new Error() as any;
    error.message = message;
    error.statusCode = code;
    return error;
}