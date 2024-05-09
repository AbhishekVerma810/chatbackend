exports.sendMessage=async (req,res,next)=>{
  try{
    if(!tokenArray.length){
      return res.status(200).json({});
    }
    const message={
      Notification:{
        title:"Your Notification Title",
        body:'You notification body',
      },
      token:tokenArray(),
      };
    admin.messaging ().send(message).then(res=>{
      console.log("successfully sent message",response);
      return res.status(200).json({msg:"send token"});
    })
   }
     catch(err){
    console.log("successfully sent  message ",response);
    return res.status(400).json({error});
   }
}
exports.submitToken=async (req,res,next)=>{
  try{   
       const token=req.body.token;
       if(!token){
        return res.status(401).json({error:"Token not provided"});
       }
       tokenArray.push(token);
       return res.json({msg:"Token recieved successfully"});

  }catch(err){
    console.log('helo',err)
    return res.json({err:"Token not recieved successfully"});
  }
}