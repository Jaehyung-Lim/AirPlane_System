//login.js는 데이터 베이스에서 로그인을 구현합니다.
//views 폴더의 login.hbs 파일과 연동 할 것입니다.
import express from "express";//express 모듈을 express라는 이름으로 사용합니다.
import {Sql} from "../database/sql";//삽입, 조회에 관련된 쿼리 함수를 불러옵니다.
                                          //insertSql object만 가져옵니다.
const router = express.Router();//express에서 Router 함수를 사용할 것이고, router 이름으로 사용합니다.

router.get('/',(req,res)=>{
    res.render('login'); //login.hbs파일을 찾아서 웹에 표시하겠다는 의미입니다.
});

//삽입이 눌리면 처리 해야하는 것을 router.post 함수에서 처리합니다.
//그 이유는 login.hbs의 form에서 method를 post로 넘겨주기로 했기 때문입니다.
router.post('/', async (req,res)=>{    //값은 req에 저장됩니다.
    const vars=req.body;    //그리고 vars에 저장합니다.
    const users=await Sql.getUsers(); //const라 값을 추가로 할당할 수 없습니다.
//admin은 delete 페이지로, user면 select 페이지로
    let whoAmI='';
    let checkLogin=false; //login을 확인
    //vars는 object 타입이므로, vars.id 이렇게 사용

    users.map((user) => { //최신 for문 문법
        if(vars.id===user.Id && vars.password === user.Password){ //필드 만들 때 대문자로 만들어서 이렇게 하는 것
            checkLogin = true;
            if(vars.id==='admin'){  //id가 admin일 때 whoAmI=admin
                whoAmI = 'admin';
            }
            else if(vars.id==='test'){//id가 test일 때 whoAmI= users
                whoAmI = 'users';
            }
            //어떤 역할을 할 것인지
            else{
                checkLogin=false;
            }
        }
    })

    console.log('whoAmI: ',whoAmI);
    //whoAmI에 따라 로그인 시에 이동하는 페이지가 달라집니다.
    if(checkLogin && whoAmI === 'admin'){
        res.redirect('/delete');
    }
    else if(checkLogin && whoAmI === 'users'){
        res.redirect('/user');
    }
    else if(!checkLogin){
        res.send("<script>alert('로그인에 실패했습니다.'); location.href='/';</script>")
    }
})

module.exports=router;