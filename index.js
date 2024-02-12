const express=require("express")
const fs=require("fs")



const app=express()
//const readable=fs.createReadStream('video.mp4')
//readable.on('data')
app.set("view engine","ejs")
app.get("/video",(req,res)=>{
    
    
    const videoPath='video.mp4'
    const videoSize=fs.statSync(videoPath).size
    const range=req.headers.range
    console.log(req.headers);
    if(range){
        const [start, end] = range.replace(/bytes=/, '').split('-');
        const startByte = parseInt(start, 10) || 0;
        const endByte = end ? parseInt(end, 10) : videoSize - 1;
    
        const chunkSize = endByte - startByte + 1;
        /*const chunksize=10**6
        const start=Number(range.replace(/\D/g, ""))
        //console.log(start);
        const end=Math.min(start + chunksize,videoSize - 1)
        const contentLength=end - start + 1*/
        
        
        res.writeHead(206,{
             'Content-Range': `bytes ${startByte}-${endByte}/${videoSize}`,
             'Accept-Ranges': 'bytes',
             'Content-Length': chunkSize,
             'Content-Type': 'video/mp4',
        })
        const fileStream=fs.createReadStream(videoPath,{start:startByte,end:endByte})
        fileStream.pipe(res)
        
    
    
        
    }else{
    res.writeHead(200,{
        'Content-Length': videoSize,
        'Content-Type': 'video/mp4',
   })
    const fileStream=fs.createReadStream(videoPath)
    fileStream.pipe(res)
   }
})
app.listen(process.env.PORT || 3003,()=>{
    console.log('server is running');
})


