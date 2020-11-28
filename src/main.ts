import { join } from 'path';
import * as appsync from '@aws-cdk/aws-appsync';
import * as db from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import { App, Construct, Stack, StackProps, RemovalPolicy } from '@aws-cdk/core';
import { AlpsGraphQL } from 'cdk-alps-graph-ql';
import { AlpsSpecRestApi } from 'cdk-alps-spec-rest-api';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);
  }
}

// for development, use account/region from cdk cli
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

const stack = new MyStack(app, 'my-stack-dev', { env: env });

const todoTable = new db.Table(stack, 'TodoTable', {
  removalPolicy: RemovalPolicy.DESTROY,
  partitionKey: {
    name: 'id',
    type: db.AttributeType.STRING,
  },
});

///////// ALPS REST API
new AlpsSpecRestApi(stack, 'AlpsSpecRestApi', {
  alpsSpecFile: 'src/todo-alps.yaml',
});

const getAllLambda = new lambda.Function(stack, 'getAllLambda', {
  functionName: 'todoList',
  code: new lambda.AssetCode('lib/lambdas'),
  handler: 'get-all.handler',
  runtime: lambda.Runtime.NODEJS_12_X,
  environment: {
    TABLE_NAME: todoTable.tableName,
    PRIMARY_KEY: 'id',
  },
});

const createOne = new lambda.Function(stack, 'createOne', {
  functionName: 'todoAdd',
  code: new lambda.AssetCode('lib/lambdas'),
  handler: 'create.handler',
  runtime: lambda.Runtime.NODEJS_12_X,
  environment: {
    TABLE_NAME: todoTable.tableName,
    PRIMARY_KEY: 'id',
  },
});

const deleteOne = new lambda.Function(stack, 'deleteOne', {
  functionName: 'todoRemove',
  code: new lambda.AssetCode('lib/lambdas'),
  handler: 'delete-one.handler',
  runtime: lambda.Runtime.NODEJS_12_X,
  environment: {
    TABLE_NAME: todoTable.tableName,
    PRIMARY_KEY: 'id',
  },
});

todoTable.grantReadWriteData(getAllLambda);
todoTable.grantReadWriteData(createOne);
todoTable.grantReadWriteData(deleteOne);
//////////////////

///////// ALPS Graph QL
const graphQlApi = new AlpsGraphQL(stack, 'AlpsGraphQL', {
  name: 'demo',
  alpsSpecFile: 'src/todo-alps.yaml',
  tmpFile: join(__dirname, '../tmp/schema.graphql'),
});

const todoDS = graphQlApi.addDynamoDbDataSource('todoDataSource', todoTable);

todoDS.createResolver({
  typeName: 'Query',
  fieldName: 'todoList',
  requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
  responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
});

todoDS.createResolver({
  typeName: 'Mutation',
  fieldName: 'todoAdd',
  requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(appsync.PrimaryKey.partition('id').auto(), appsync.Values.attribute('body').is('$ctx.args.todoItem')),
  responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
});

todoDS.createResolver({
  typeName: 'Mutation',
  fieldName: 'todoRemove',
  requestMappingTemplate: appsync.MappingTemplate.dynamoDbDeleteItem('id', 'id'),
  responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
});
//////////////////

app.synth();