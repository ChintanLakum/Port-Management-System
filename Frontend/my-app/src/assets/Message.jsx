const Message= (M)=>{
    let {message , error } = M;
    // console.log("message  Message.jsx  3"+message)
    // console.log("error Message.jsx 4"+error)
    return(
    <>

    {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md h-10 text-center text-sm sm:text-base">
            {message.message}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-center text-sm sm:text-base">
            {error}
          </div>
        )}
    </>
        
    )  
}
export default Message;