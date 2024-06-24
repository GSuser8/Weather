import express from "express";
import axios from 'axios';
import bodyParser from 'body-parser';
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const apiKey="de5ad2b727ddb06562f5a95570fb067d";
const apiURL="https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const app=express();
const port=3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
  console.log("Code is "+req.query.code);
    if(req.query.code==undefined){
      console.log("Apple");
      res.render("index.ejs",{
        beginning:0
      }); 
    }
     else if(req.query.code==404){
       console.log("Orange");
       res.render("index.ejs",{
         notFound:0
       });
     }
    else{
      console.log("Strawberry");
      res.render("index.ejs",{
        cityName:req.query.city,
        temp:req.query.temp,
        humidity:Math.round(req.query.humidity),
        windSpeed:Math.round(req.query.wind)
      });
    }
});



app.post("/submit",async (req, res)=>{
  const nameUser=req.body.cityUser;
    try{
      const response=await axios.get(apiURL+nameUser+`&appid=${apiKey}`);
      console.log(response.status);
      console.log(response.data);
      if(response.status === 200){
        var cityName=response.data.name;
        var temp=response.data.main.temp;
        var humidity=response.data.main.humidity;
        var windSpeed=response.data.wind.speed;
        res.redirect(`/?city=${cityName}&temp=${temp}&humidity=${humidity}&wind=${windSpeed}&code=200`);
      }
      else{
        res.redirect(`/?code=${response.status}`);
      }
    }
    catch(error){
      if(error.response.status==404){
        res.redirect(`/?code=${error.response.status}`);
      }
    }
  });

app.listen(port,()=>{
  console.log(`Listening on port ${port}`);
});
