


const Result = async (...Parameters) => {
  
    let Sql;
    console.log(typeof (Parameters[2]));
    Details = Parameters[2];
      try{
        Details = eval(`(${Parameters[2]})`);
      } catch(err){}
   switch (Parameters[1]) {
      case "Insert":
        Sql = `insert into ${Parameters[0]} values('${Details.email}','${Details.password}')`;
        break;
      case "Update":
        Sql = `update ${Parameters[0]} set email = '${Parameters[3].email}', password = '${Parameters[3].password}' where RollNumber = '${Details}'`;
        break;
      case "Delete":
        Sql = `delete from ${Parameters[0]} where email = '${Details}'`;
        break;
      case "Read":
          Sql = `select * from ${Parameters[0]}`;
          if(Details != "All"){
            Sql = `select * from ${Parameters[0]} where email = '${Details}'`;
          }
        break;
      default:
        console.error("Invalid Parameters");
        break;
    }
    console.log(Sql);
    var result = await Query(Sql);
    return result;
  };
  module.exports = Result;