import e from "express";
import express from "express";             //express 모듈을 express 이름으로 사용합니다.
import {Sql } from "../database/sql";//selectSql만 사용할 것이므로 selectSql만 가져옵니다.
        //이 중괄호는 사용자가 만든 모듈을 가져올 때 사용합니다.
const router = express.Router();        //express의 Router 함수를 router 이름으로 사용합니다.

//아래 있는 /는 현재 페이지 즉, /select를 의미하게 됩니다.
router.get('/',async(req,res)=>{ //함수 get을 정의합니다.
    const schedule=await Sql.getSchedule();//selectSql에서 getDepartment 함수를 불러옵니다.
    //그리고 데이터를 res에 전달하여 화면에 표시하게 됩니다.
    res.render('reserve', { //reserve.hbs를 불러와서 화면에 표시하게 됩니다.
        title1: '항공기 예약 시스템',  //title1은 IT공대
        schedule,
    });
    
});

router.post('/', async(req,res) =>{
    if(req.body.change_to_user === "user page"){
        res.redirect('/user');
    }
    const vars=req.body;
    var month;
    var data={
        Flight_number: vars.flight_no,
        Leg_number: vars.leg_no,
        Date: vars.date,
        Seat_number: vars.seat_no,
        Class: vars.class,
        Customer_name: vars.id,
        Cphone: vars.cphone,
        Number_of_available_seats: vars.no_avail_seats,
    }
    if(vars.no_avail_seats<=0){
        res.send("<script>alert('좌석수 초과!!.'); location.href='/';</script>")
        res.redirect('/reserve');
    }
    else{
        if(data.Date.slice(4,7) == 'Jan'){month='01';}
        else if(data.Date.slice(4,7) == 'Feb'){month='02';}
        else if(data.Date.slice(4,7) == 'Mar'){month='03';}
        else if(data.Date.slice(4,7) == 'Apr'){month='04';}
        else if(data.Date.slice(4,7) == 'May'){month='05';}
        else if(data.Date.slice(4,7) == 'Jun'){month='06';}
        else if(data.Date.slice(4,7) == 'Jul'){month='07';}
        else if(data.Date.slice(4,7) == 'Aug'){month='08';}
        else if(data.Date.slice(4,7) == 'Sep'){month='09';}
        else if(data.Date.slice(4,7) == 'Oct'){month='10';}
        else if(data.Date.slice(4,7) == 'Nov'){month='11';}
        else if(data.Date.slice(4,7) == 'Dec'){month='12';}
        const date = `${data.Date[11]}${data.Date[12]}${data.Date[13]}${data.Date[14]}-${month}-${data.Date[8]}${data.Date[9]}`
    

        data.Date=date;
        await Sql.setSeat(data);
        res.redirect('/reserve');
    }
});

module.exports=router;