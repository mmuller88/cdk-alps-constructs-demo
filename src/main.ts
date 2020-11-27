import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import { AlpsGraphQL } from 'cdk-alps-graph-ql';
import { AlpsSpecRestApi } from 'cdk-alps-spec-rest-api';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // define resources here...
  }
}

// for development, use account/region from cdk cli
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

const stack = new MyStack(app, 'my-stack-dev', { env: env });

new AlpsSpecRestApi(stack, 'AlpsSpecRestApi', {
  alpsSpecFile: 'src/todo-alps.yaml',
});

new AlpsGraphQL(stack, 'AlpsGraphQL', {
  name: 'demo',
  alpsSpecFile: 'src/todo-alps.yaml',
});

app.synth();