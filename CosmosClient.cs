using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;


namespace DBCon.Ui
{
    public class CosmosClientDB
    {
        private CosmosClient cosmosClient;
        private Database db;
        private Container container;
        public CosmosClientDB(CosmosRequest cosmosRequest)
        {
            //string.IsNullOrEmpty(cosmosRequest.accountEndpoint) ?  
          //  "AccountEndpoint=https://a77342b4-0ee0-4-231-b9ee.documents.azure.com:443/;AccountKey=HfqAdpWgJfNNprW93Ltpm9AUkwvRFJjg6UelcW398lV9gKDHdO5NfTQzAzyU5sWDU9dlJncQlqOhACDbSiK8Hg==;" : cosmosRequest.accountEndpoint,
                              
            cosmosClient = new CosmosClient( cosmosRequest.accountEndpoint,
                                           new CosmosClientOptions()
                                           {
                                               ApplicationRegion = Regions.EastUS2,
                                           });

            db = cosmosClient.GetDatabase(cosmosRequest.database);
            container = cosmosClient.GetContainer(cosmosRequest.database, cosmosRequest.container);
        }

        public async Task<QueryResponse> ExecuteQuery(string querytext)
        {

            Newtonsoft.Json.Linq.JArray returnData = new Newtonsoft.Json.Linq.JArray();
            // Query multiple items from container
            using FeedIterator<dynamic> feed = container.GetItemQueryIterator<dynamic>(
                queryText: querytext// "SELECT * FROM Employee e where e.salary > 90000"
            );

            // Iterate query result pages
            while (feed.HasMoreResults)
            {
                FeedResponse<dynamic> response = await feed.ReadNextAsync();

                // Iterate query results
                foreach (var item in response)
                {
                    if(item is Newtonsoft.Json.Linq.JObject)
                    {
                        returnData.Add(item as Newtonsoft.Json.Linq.JObject);

                    }
                }
            }

            QueryResponse queryResponse = new QueryResponse();

            queryResponse.response = JsonConvert.SerializeObject(returnData);

            return queryResponse;
        }

        //public async Task<Newtonsoft.Json.Linq.JArray> ExecuteQuery(string querytext)
        //{

        //    Newtonsoft.Json.Linq.JArray returnData = new Newtonsoft.Json.Linq.JArray();
        //    // Query multiple items from container
        //    using FeedIterator<dynamic> feed = container.GetItemQueryIterator<dynamic>(
        //        queryText: querytext// "SELECT * FROM Employee e where e.salary > 90000"
        //    );

        //    // Iterate query result pages
        //    while (feed.HasMoreResults)
        //    {
        //        FeedResponse<dynamic> response = await feed.ReadNextAsync();

        //        // Iterate query results
        //        foreach (var item in response)
        //        {
        //            if (item is Newtonsoft.Json.Linq.JObject)
        //            {
        //                returnData.Add(item as Newtonsoft.Json.Linq.JObject);

        //            }
        //        }
        //    }

        //    return returnData;
        //}

    }

    public record Employee(
    string id,
    string employeeid,
    string lastname,
    string firstname, 
    int salary
);
}
