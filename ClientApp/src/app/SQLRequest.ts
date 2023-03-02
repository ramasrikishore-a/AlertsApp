export interface SQLRequest {
    connectionString: string;
  querystring: string;
  }

export interface CosmosRequest {
  accountEndPoint: string;
  querystring: string;
  database: string;
  container: string;
}
