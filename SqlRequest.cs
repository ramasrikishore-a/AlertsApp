namespace DBCon.Ui
{
    public class SqlRequest
    {
        public string connectionstring { get; set; }

        public string querystring { get; set; }
    }

    public class CosmosRequest
    {
        public string accountEndpoint { get; set; }

        public string querystring { get;set; }

        public string database { get; set; }

        public string container { get; set; }
    }
}
