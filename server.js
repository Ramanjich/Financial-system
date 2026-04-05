import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import {connectDB} from "./config/db.js";
import UserRouter from './routes/UserRoutes.js';
import FinancialRouter from './routes/FinancialRoutes.js';
import dashboardRouter from './routes/dashboardRoutes.js';


const app=express();
const port=process.env.PORT ;

//middlewares 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true})); 

//db 
connectDB();
//routes 
app.use('/api/user',UserRouter)
app.use("/api/records",FinancialRouter);
app.use("/api/dashboard", dashboardRouter);
app.get('/',(req,res)=>{
    res.send('APIs are working expected')

})

app.listen(port,()=>{
    console.log(`server started on http://localhost:${port} `)
})