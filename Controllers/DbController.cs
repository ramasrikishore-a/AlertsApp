using Microsoft.AspNetCore.Mvc;
using DBCon.Ui;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Data;

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
            catch (Exception ex)
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



        [HttpPost("savealert")]
        public JsonResult SaveAlert(Alert alert)
        {
            try
            {
                QueryResponse queryResponse = new QueryResponse();
                queryResponse.status = "success";
                queryResponse.response = alert;
                queryResponse.message = "Created Successfully";
                InsertAlert(alert);
                return new JsonResult(queryResponse);
            }
            catch (Exception ex)
            {
                return new JsonResult(null);
            }
        }

        [HttpPost("GetAlerts")]
        public JsonResult GetAlerts(GetRequest getRequest)
        {
            SqlConnection connection = new SqlConnection("data source=Kishore; database=DBConnector; User ID=newuser; Password=Kishore@07;TrustServerCertificate=True");

            var command = new SqlCommand("GetAlerts", connection);
            command.CommandType = System.Data.CommandType.StoredProcedure;
            var parameterName = new SqlParameter("@itemcount", SqlDbType.Int, 50);
            parameterName.Value = getRequest.size;
            command.Parameters.Add(parameterName);
            connection.Open();
            SqlDataReader reader = command.ExecuteReader();

            List<Alert> alerts = new List<Alert>();


            while (reader.Read())
            {
                Alert alert = new Alert();
                alert.Id = reader["AlertId"].ToString();
                alert.Name = reader["AlertName"].ToString();
                alert.FrequencyofEvaluation = reader["frequency"].ToString();
                alert.Condition = reader["condition"].ToString();
                alert.actiongroup = reader["Actiongroup"].ToString();
                alert.Request = reader["Query"].ToString();
                alert.Modified = reader["Modified"].ToString();
                alert.ModifiedBy = reader["Modifiedby"].ToString();
                alert.Created = reader["created"].ToString();
                alert.CreatedBy = reader["createdby"].ToString();
                alerts.Add(alert);
            }

            QueryResponse queryResponse = new QueryResponse();
            queryResponse.response = alerts;
            queryResponse.status = "success";
            return new JsonResult(queryResponse);
        }

        public string? InsertAlert(Alert alert)
        {
            try
            {
                using (var conn = new SqlConnection("data source=Kishore; database=DBConnector; User ID=newuser; Password=Kishore@07;TrustServerCertificate=True"))
                {
                    using (var cmd = new SqlCommand("dbo.InsertAlert", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        var parameterName = new SqlParameter("@alertname", SqlDbType.VarChar, 50);
                        var parameterQuery = new SqlParameter("@query", SqlDbType.VarChar, int.MaxValue);
                        var parameterAction = new SqlParameter("@actiongroup", SqlDbType.VarChar, int.MaxValue);

                        var parameterCondition = new SqlParameter("@condition", SqlDbType.VarChar, 50);
                        var parameterFreq = new SqlParameter("@frequency", SqlDbType.VarChar, 50);
                        var parameterCreated = new SqlParameter("@created", SqlDbType.VarChar, 100);
                        var parameterCreatedBy = new SqlParameter("@createdBy", SqlDbType.VarChar, 100);
                        var parametermodified = new SqlParameter("@modified", SqlDbType.VarChar, 100);
                        var parametermodifiedby = new SqlParameter("@modifiedby", SqlDbType.VarChar, 100);

                        var parameterThreshold = new SqlParameter("@threshold", SqlDbType.VarChar, 100);

                        var parameterAlertId = new SqlParameter("@alertId", SqlDbType.VarChar, 100);

                        parameterAlertId.Direction = ParameterDirection.Output;


                        parameterName.Value = alert.Name;
                        parameterQuery.Value = alert.Request;
                        parameterFreq.Value = alert.FrequencyofEvaluation;
                        parameterCondition.Value = alert.Condition;
                        parameterCreated.Value = DateTime.UtcNow.ToString();
                        parameterCreatedBy.Value = alert.User;
                        parameterThreshold.Value = alert.threshold;
                        parametermodified.Value = DateTime.UtcNow.ToString();
                        parametermodifiedby.Value = alert.User;
                        parameterAction.Value = alert.actiongroup;

                        cmd.Parameters.Add(parameterName);
                        cmd.Parameters.Add(parameterQuery);
                        cmd.Parameters.Add(parameterFreq);
                        cmd.Parameters.Add(parameterCondition);
                        cmd.Parameters.Add(parameterCreated);
                        cmd.Parameters.Add(parameterCreatedBy);
                        cmd.Parameters.Add(parameterAction);
                        cmd.Parameters.Add(parameterThreshold);
                        cmd.Parameters.Add(parametermodified);
                        cmd.Parameters.Add(parametermodifiedby);
                        cmd.Parameters.Add(parameterAlertId);

                        conn.Open();


                        cmd.ExecuteNonQuery();

                        conn.Close();

                        return parameterAlertId == null ? "" : parameterAlertId.Value.ToString();
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost("ExecuteCosmosQ")]
        public JsonResult ExecuteCosmosQ(CosmosRequest csRequest)
        {
            try
            {
                CosmosClientDB cosmosClientDB = new CosmosClientDB(csRequest);
                QueryResponse response = cosmosClientDB.ExecuteQuery(csRequest.querystring).Result;

                response.status = "success";

                return new JsonResult(response);
            }
            catch (Exception ex)
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
