import express from "express";
import {Sql} from "../database/sql";

const router = express.Router();

var check=0;

var users;
var data;
router.get('/',async(req,res)=>{ 
    if(check===1){
        res.render('user', { //user.hbs를 불러와서 화면에 표시하게 됩니다.
            users,
        });
    }
    else{
        res.render('user');
    } 
});

router.post('/', async (req,res)=>{    //값은 req에 저장됩니다.
    const vars=req.body;  
    if(req.body.change_to_reserve === "reserve page"){
        res.redirect('/reserve');
    }
    if(vars.delBtn_user === "delete user"){
        const data1={
            Flight_number: vars.F_n,
            Leg_number: vars.L_n,
            Date: vars.date_,
            Seat_number: vars.s_n,
        }
        await Sql.deleteSeat(data1);
       res.redirect('/user');
    }
    data={
        Flight_number: vars.flight_no,
        Leg_number: vars.leg_no,
        Date: vars.date,
        Seat_number: vars.seat_no,
        Customer_name: vars.name,
        Customer_phone: vars.cphone,
    }
    users=await Sql.getReservation(data); 
    console.log(users);

    var i=0;
    users.map((user) => { //최신 for문 문법
        if(vars.name===user.Customer_name && vars.cphone === user.Customer_phone){ //필드 만들 때 대문자로 만들어서 이렇게 하는 것
            check=1;
            i++;
        }
    })    
    res.redirect('/user');
})

module.exports=router;