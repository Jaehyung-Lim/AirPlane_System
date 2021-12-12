import mysql from "mysql2"; //mysql2 모듈을 사용합니다.

//데이터베이스 연결
const pool = mysql.createPool(  //sql에서 사용할 pool을 만들어줍니다.
    process.env.JAWSDB_URL ??{
        host: 'localhost',
        user: 'root',
        database: 'final', //sql에 등록한 database가 termproject임
        password: '8903056',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit:0
    }
);

const promisePool = pool.promise();


export const Sql = {      
    getUsers : async () =>{
        const [rows] = await promisePool.query(`select * from user`);
        return rows
    },
    getAirport : async () =>{
        const [rows] = await promisePool.query(`select * from airport`);
        return rows
    },
    getFlight: async () => {
        const [rows] = await promisePool.query(`select * from flight`);
        return rows
    },
    getAirplane: async () => {
        const [rows] = await promisePool.query(`select * from airplane`);
        return rows
    },
    getSchedule: async () => {
        const [rows] = await promisePool.query(`select * from schedule`);
        return rows
    },
    getSeatReservation: async (data) =>{
        const [rows] = await promisePool.query(`select * from seat_reservation 
        where customer_name="${data.Customer_name}" and customer_phone="${data.Customer_phone}"`);
        return rows
    },
    getReservation: async (data) =>{
        const [rows] = await promisePool.query(`select 
        L.Flight_number, L.Leg_number, L.Date, A1.name as n1, A2.name as n2, L.departure_time, L.arrival_time,
        seat_number, Class, Customer_name, Customer_phone 
        from seat_reservation as S, leg_instance as L, airport as A1, airport as A2
        where customer_name="${data.Customer_name}" and customer_phone="${data.Customer_phone}"
        and L.flight_number=S.flight_number and L.leg_number = S.leg_number and L.date=S.date
        and L.departure_airport_code=A1.airport_code and L.Arrival_airport_code=A2.airport_code`);
        return rows
    },
    setAirport : async (data) => { 
        const sql= `insert into airport values (   
            "${data.Airport_code}", "${data.Name}", "${data.City}","${data.State}")`;
            await promisePool.query(sql);
    },        
    setAirplane : async (data) => { 
        const sql= `insert into airplane values (   
            "${data.Airplane_id}", "${data.Total_number_of_seats}", "${data.Airplane_type}")`;
            await promisePool.query(sql);
    },   
    setFlight : async (data) => {  
      const sql=`insert into flight values (
          "${data.Flight_number}", "${data.Airline}","${data.Weekdays}")`;  
          await promisePool.query(sql);
    },
    setSeat : async (data) => {
        try{
            const sql_1=`start transaction`;
            await promisePool.query(sql_1);
            const sql_2=`insert into seat_reservation values ("${data.Flight_number}","${data.Leg_number}",
            "${data.Date}","${data.Seat_number}", "${data.Class}","${data.Customer_name}","${data.Cphone}")`;
            await promisePool.query(sql_2);
            const sql_3=`update leg_instance 
            set number_of_available_seats = number_of_available_seats - 1 
            where flight_number=${data.Flight_number} and leg_number=${data.Leg_number} and date="${data.Date}"`
            await promisePool.query(sql_3);
            const sql_4=`commit`;
            await promisePool.query(sql_4);
        }
        catch(e){
            const sql=`rollback`;
            await promisePool.query(sql);
        }
    },
    deleteAirport : async (data) =>{ 
        console.log('deleteSql.deleteAirport: ', data.Airport_code);       
        const sql=`delete from Airport where Airport_code = ${data.Airport_code}`;
        await promisePool.query(sql);
    },
    deleteAirplane : async (data) =>{ 
        console.log('deleteSql.deleteAirplane: ', data.Airplane_id);       
        const sql=`delete from Airplane where Airplane_id = ${data.Airplane_id}`;
        await promisePool.query(sql);
    },
    deleteFlight : async (data) => {
        console.log('deleteSql.deleteFlight: ', data.Flight_number);    
        const sql=`delete from Flight where Flight_number = ${data.Flight_number}`;   
        await promisePool.query(sql);
    }, 
    deleteSeat : async (data) => {
        try{
            const sql_1=`start transaction`;
            await promisePool.query(sql_1); 
            const sql_2=`delete from Seat_Reservation where Flight_number = ${data.Flight_number}
            and Leg_number = ${data.Leg_number} and Date = "${data.Date}" and Seat_number = ${data.Seat_number}`;   
            await promisePool.query(sql_2);
            const sql_3=`update leg_instance 
                set number_of_available_seats = number_of_available_seats + 1 
                where flight_number=${data.Flight_number} and leg_number=${data.Leg_number} and date="${data.Date}"`
                await promisePool.query(sql_3);
            const sql_4=`commit`;
            await promisePool.query(sql_4);
        }
        catch(e){
            const sql=`rollback`;
            await promisePool.query(sql);
        }
    },
    updateAirport : async (data) => {
        const sql=`update Airport set name = "${data.Name}" where Airport_code = ${data.Airport_code}`; 
        await promisePool.query(sql);
    },
    updateAirplane : async (data) => {
        const sql=`update Airplane set total_number_of_seats = "${data.Total_number_of_seats}" 
        where Airplane_id = ${data.Airplane_id}`;
        await promisePool.query(sql);
    },
    updateFlight : async (data) =>{ 
        const sql=`update flight set airline= "${data.Airline}"  
        where Flight_number = ${data.Flight_number}`;
        await promisePool.query(sql);
    },
}
