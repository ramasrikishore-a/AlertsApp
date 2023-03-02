using Microsoft.AspNetCore.Mvc;
using DBCon.Ui;
using Newtonsoft.Json;

namespace DBCon.Ui.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DatabaseController : ControllerBase
    {

        [HttpPost("Executesql")]
        public JsonResult ExecuteSql(SqlRequest sqlRequest)
        {
            
            try
            {
                SqlClient sqlClient = new SqlClient();

                QueryResponse data = sqlClient.GetData(sqlRequest);

                return new JsonResult(data);

            }
            catch(Exception ex)
            {
                QueryResponse errorResp = new QueryResponse();
                errorResp.status = "error";
                errorResp.message = ex.Message;
                //dbconexception dbconexception = new dbconexception();
                //dbconexception.ErrorMessage = ex.Message;
                //dbconexception.StackTrace = ex.StackTrace;
                return new JsonResult(errorResp);

            }

        }

        [HttpPost("ExecuteCosmosQ")]
        public  JsonResult ExecuteCosmosQ(CosmosRequest csRequest)
        {
            try
            {
                CosmosClientDB cosmosClientDB = new CosmosClientDB(csRequest);
                QueryResponse response = cosmosClientDB.ExecuteQuery(csRequest.querystring).Result;

                response.status = "success";

                return new JsonResult(response);
            }
            catch(Exception ex)
            {
                QueryResponse errorResp = new QueryResponse();
                errorResp.status = "error";
                errorResp.message = ex.Message;
                //dbconexception dbconexception = new dbconexception();
                //dbconexception.ErrorMessage = ex.Message;
                //dbconexception.StackTrace = ex.StackTrace;
                return new JsonResult(errorResp);

            }

            // return 10;
        }
    }
}
