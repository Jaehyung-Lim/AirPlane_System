import express from "express";//express 모듈을 express 이름으로 사용합니다.
import {Sql} from "../database/sql";//selectSql, updateSql object를 사용합니다.
//수정하기 위해 데이터를 조회해야하므로 selectSql을 사용하고 updateSql을 사용하여 수정합니다.
//이는 모두 export로 함수를 선언했기 때문에 사용할 수 있는 것입니다.
const router=express.Router();
//아래에서 사용하는 get, delete 관련 함수들은 모두 sql.js에서 정의된 함수들 입니다.

//delete 페이지는 department를 삭제할 것입니다.
//기존의 입력 값 불러오기->이때 값을 보면서 삭제할 수 있게끔 합니다.
router.get('/', async (req,res)=>{ //현재 페이지를 의미합니다.
    const airport=await Sql.getAirport();      //delete.hbs에서 사용할 department를 정의합니다. 이를 통해 getDepartment사용 가능
    const flight=await Sql.getFlight();      //deleteAirport.hbs에서 사용할 flight를 정의합니다. 이를 통해 getDepartment사용 가능
    const airplane=await Sql.getAirplane();      //deleteAirport.hbs에서 사용할 flight를 정의합니다. 이를 통해 getDepartment사용 가능
    res.render('delete',{   //delete.hbs 파일에서 each에 들어가는 내용
        title1: "공항 관리 기능",
        title2: "항공편 (Flight) 관리 기능",
        title3: "비행기 관리 기능",
        airport,
        flight,
        airplane
    })
});
//async 와 await는 항상 함께 옵니다.
router.post('/', async (req,res) =>{
    if(req.body.change_to_insert === "insert page"){
        res.redirect('/insert');//삭제 후 /delete 페이지로 돌아갑니다.
    }
    else if(req.body.change_to_update==="update page"){
        res.redirect('/update');//삭제 후 /delete 페이지로 돌아갑니다.
    }
    
    const data={ //delBtn이 value의 값을 가져오는 것입니다. 
        Airport_code: req.body.delBtn_airport,
    };
    const data_2={
        Flight_number: req.body.delBtn_flight,
    };
    
    const data_3={
        Airplane_id: req.body.delBtn_airplane,
    };

    if(data_2.Flight_number===undefined && data_3.Airplane_id===undefined)await Sql.deleteAirport(data);//post method로 값을 넘겨 받고, 밭은 dataa를 삭제합니다.
    else if(data.Airport_code===undefined && data_3.Airplane_id===undefined)await Sql.deleteFlight(data_2);//post method로 값을 넘겨 받고, 밭은 dataa를 삭제합니다.
    else if(data.Airport_code===undefined && data_2.Flight_number===undefined)await Sql.deleteAirplane(data_3);//post method로 값을 넘겨 받고, 밭은 dataa를 삭제합니다.

    res.redirect('/delete');//삭제 후 /delete 페이지로 돌아갑니다.
});

module.exports=router;//실행