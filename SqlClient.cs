using System.Data;
using System.Data.SqlClient;
using System.Dynamic;

namespace DBCon.Ui
{
    public class SqlClient
    {
        public SqlClient()
        {
            //  Connecting();
        }



        private List<dynamic> ConvertDstoDict(DataSet ds)
        {
            var result = new Dictionary<string, List<string>>();

            var dataLst = new List<dynamic>();
            
            foreach (DataRow dataRow in ds.Tables[0].Rows)
            {
                var rowData = dataRow.ItemArray;
                var flexible = new ExpandoObject();//as IDictionary<string,string>;
                int count = 0;
                for(int i =0;i< rowData.Length; i++)
                {
                    var colName = ds.Tables[0].Columns[i];
                    var rowvalue = rowData[i];

                    flexible.TryAdd(colName.ColumnName, rowvalue);
                

                }
                dataLst.Add(flexible);
            }

            // Dictionary<string, object> dstoDict = GetDict(ds.Tables[0]);
            //foreach (DataColumn dsc in ds.Tables[0].Columns)
            //{
            //    List<string> list = new List<string>();

            //    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            //    {
            //        list.Add(ds.Tables[0].Rows[i][dsc].ToString());

            //    }

            //    if (result.ContainsKey(dsc.ToString()) == false)
            //    {
            //        result.Add(dsc.ToString(), list);
            //    }
            //}

            return dataLst;
        }

        public QueryResponse GetData(SqlRequest sqlRequest)
        {
            DataSet ds = new DataSet();

            SqlConnection con = null;
            try
            {
                // Creating Connection  
                string ConnectionString = sqlRequest.connectionstring;

                //  "data source=Kishore; database=DBConnector; User ID=newuser; Password=Admin@123";

                con = new SqlConnection(ConnectionString);
                con.Open();
                string queryString = sqlRequest.querystring; //"select * from employees where salary < 90000";
                SqlCommand command = new SqlCommand(queryString, con);
                SqlDataAdapter theDataAdapter = new SqlDataAdapter(command);
                try
                {
                    theDataAdapter.Fill(ds);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
                //command.Parameters.AddWithValue("@tPatSName", "Your-Parm-Value");
                Console.WriteLine("Connection Established Successfully");

            }
            catch (Exception e)
            {
                Console.WriteLine("OOPs, something went wrong.\n" + e);
            }
            finally
            {   // Closing the connection  
                con.Close();
            }
            QueryResponse response = new QueryResponse();
            response.status = "success";
            response.response = ConvertDstoDict((DataSet)ds);
            return response;

        }
    }
}
