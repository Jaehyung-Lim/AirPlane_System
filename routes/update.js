//final project
import express from "express";//express 모듈을 express 이름으로 사용합니다.
import {Sql} from "../database/sql";//selectSql, updateSql object를 사용합니다.
//수정하기 위해 데이터를 조회해야하므로 selectSql을 사용하고 updateSql을 사용하여 수정합니다.
//이는 모두 export로 함수를 선언했기 때문에 사용할 수 있는 것입니다.
const router=express.Router();
//아래에서 사용하는 get, update함수들은 모두 sql.js에서 정의된 함수들 입니다.

//update시엔 employee를 수정할 것인지, department를 수정할 것인지 페이지로 나눕니다.
//기존의 입력 값 불러오기
router.get('/', async (req,res)=>{ //현재 페이지를 기준으로 /employee를 의미합니다. data처리
    const airport_res=await Sql.getAirport();
    const flight_res = await Sql.getFlight();
    const airplane_res = await Sql.getAirplane();
    res.render('update',{   //update.hbs 에 나타냄
        title1: "공항 정보 갱신",
        title2: "항공편 (Flight) 정보 갱신",
        title3: "항공기 (Airplane) 테이블 갱신",
        airport_res,
        flight_res,
        airplane_res,
    });
});

//수정 버튼을 눌렀을 경우 update query를 실행하여 조회 페이지로 이동
router.post('/', async (req,res)=>{//data처리
    if(req.body.change_to_delete === "delete page"){
        res.redirect('/delete');//삭제 후 /delete 페이지로 돌아갑니다.
    }
    else if(req.body.change_to_insert==="insert page"){
        res.redirect('/insert');//삭제 후 /delete 페이지로 돌아갑니다.
    }
    const vars=req.body;       //입력받은 데이터를 vars 변수에 넣습니다.
    const data={            //왼쪽 값은 sql문에서 data.Airplane_id로 쓸 것, 오른쪽은 .hbs 파일에서 표현된 {{Airplane_id}}
        Airport_code: vars.airport_code, //salary만 수정합니다.
        Name: vars.name,

        Flight_number: vars.flight_number,   
        Airline: vars.airline,

        Airplane_id: vars.airplane_id,   
        Total_number_of_seats: vars.total_number_of_seats,
    }
    console.log(data);


    if(data.Name!=undefined) await Sql.updateAirport(data); 
    else if(data.Airline!=undefined) await Sql.updateFlight(data);
    else if(data.Total_number_of_seats!=undefined)  await Sql.updateAirplane(data);
    res.redirect('/update'); 
});

module.exports=router;