//not found 
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found: ${req.originalUrl}`); //new error same with error
    res.status(404);
    next(error)
};

//Error Handler 
export const errorHandler = (err, req, res, next) => {
    const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
    req.status(statuscode);
    res.json({
        message: err?.message ,
        stack: err?.stack
    }) //NB: stack error shows the error build up 
};
