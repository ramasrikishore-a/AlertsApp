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

    public class GetRequest
    {
        public int size { get; set; }
    }

    public class Alert
    {
        public string Id { get; set; }
        public string Name { get; set; }

        public string Condition { get; set; }

        public string Request { get; set; }
        public string FrequencyofEvaluation { get; set; }

        public string Source { get; set; }

        public string User { get; set; }

        public string actiongroup { get; set; }

        public string? Created { get; set; }

        public string? Modified { get; set; }

        public string threshold { get; set; }
        public string? ModifiedBy { get; set; }
        public string? CreatedBy { get; set; }
    }
}
