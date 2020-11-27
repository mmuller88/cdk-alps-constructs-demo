const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  authorAddress: "damadden88@googlemail.com",
  authorName: "Martin Mueller",
  name: "cdk-alps-constructs-demo",
  defaultReleaseBranch: "main",
  cdkVersion: "1.75.0",
  repository: "https://github.com/mmuller88/cdk-alps-constructs-demo.git",
  deps: [
    'cdk-alps-spec-rest-api',
    'cdk-alps-graph-ql',
  ],
  keywords: [
    'cdk',
    'aws',
    'alps',
    'appsync',
    'graphql',
    'apigateway',
  ],

});

project.synth();
