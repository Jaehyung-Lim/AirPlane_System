import express from "express";//express 모듈을 express 이름으로 사용합니다.
import {Sql} from "../database/sql";//selectSql, updateSql object를 사용합니다.
//수정하기 위해 데이터를 조회해야하므로 selectSql을 사용하고 updateSql을 사용하여 수정합니다.
//이는 모두 export로 함수를 선언했기 때문에 사용할 수 있는 것입니다.
const router=express.Router();
//아래에서 사용하는 get, delete 관련 함수들은 모두 sql.js에서 정의된 함수들 입니다.

router.get('/',(req,res)=>{
    res.render('insert'); //insert.hbs파일을 찾아서 웹에 표시하겠다는 의미입니다.
});

router.post('/',(req,res)=>{    //값은 req에 저장됩니다.
    if(req.body.change_to_delete === "delete page"){
        res.redirect('/delete');//삭제 후 /delete 페이지로 돌아갑니다.
    }
    else if(req.body.change_to_update==="update page"){
        res.redirect('/update');//삭제 후 /delete 페이지로 돌아갑니다.
    }
    const vars=req.body;    //그리고 vars에 저장합니다.
    const var_len=Object.keys(req.body).length;
    console.log(vars,var_len);
    //attribute의 개수를 파악할 수 있는 것
    if(var_len===4){//airport
        const data={        //data 객체를 만들어 입력받은 값을 저장합니다.
            Airport_code: vars.Airport_code,  //각 값을 저장합니다.
            Name: vars.Name,                //이때 사용되는 각 변수이 이름은 sql.js에서 넣어준 이름임. data.Name, data.City이런식으로
            City: vars.City,
            State: vars.State,
        };      
        Sql.setAirport(data); //insertSql에서 만든 setEmployee 함수를 통해 data객체를 넘겨줍니다.
    }
    else if(var_len===3 && vars.Flight_number===undefined){
        const data={        //data 객체를 만들어 입력받은 값을 저장합니다.
            Airplane_id: vars.Airplane_id,  //각 값을 저장합니다.
            Total_number_of_seats: vars.Total_number_of_seats,                //이때 사용되는 각 변수이 이름은 sql.js에서 넣어준 이름임. data.Name, data.City이런식으로
            Airplane_type: vars.Airplane_type,
        };
        Sql.setAirplane(data); //insertSql에서 만든 setEmployee 함수를 통해 data객체를 넘겨줍니다.
    }
    else if(var_len===3 && vars.Airplane_id===undefined){//flight
        const data={        //data 객체를 만들어 입력받은 값을 저장합니다.
            Flight_number: vars.Flight_number,  //각 값을 저장합니다.
            Airline: vars.Airline,
            Weekdays: vars.Weekdays,
        };
        Sql.setFlight(data); //insertSql에서 만든 setEmployee 함수를 통해 data객체를 넘겨줍니다.
    }
    res.redirect('/insert'); 
})

module.exports=router;//실행

