const asyncHandler=(requestHandler)=>{
    return(req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}
export {asyncHandler}



//const asyncHandler=(fn)=>{}
    //asyncHandler=(fn)=>{async()=>{}}
/*const asyncHandler=(fn)=>{async(req,res,next)=>{
    try {
        awaitfn(req,res,ne)
    } catch (error) {
        res.status(error.code||500).jason({
            success:false,
            message:error.message
        })
        console.error("error:",error)
    }
}}*/