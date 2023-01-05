import { Request, Response, NextFunction } from 'express';


const ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const stack = process.env.NODE_ENV === 'production' ? '🥞' : err.stack;
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        stack,
    })
}

export default ErrorHandler;