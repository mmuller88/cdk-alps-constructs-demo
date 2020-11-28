const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  authorAddress: "damadden88@googlemail.com",
  authorName: "Martin Mueller",
  name: "cdk-alps-constructs-demo",
  defaultReleaseBranch: "main",
  cdkVersion: "1.75.0",
  repository: "https://github.com/mmuller88/cdk-alps-constructs-demo.git",
  cdkDependencies: [
    '@aws-cdk/aws-dynamodb',
    '@aws-cdk/aws-appsync',
    '@aws-cdk/aws-lambda',
  ],
  devDeps: [
    
  ],
  deps: [
    'cdk-alps-spec-rest-api',
    'cdk-alps-graph-ql',
    '@types/uuid',
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

project.addScripts({
  'clean': 'rm -rf ./cdk.out && rm -rf ./cdk.out ./build lib',
  'compile': 'tsc',
  "test": "rm -fr lib/ && yarn run compile && jest --passWithNoTests --updateSnapshot && yarn run eslint",
  "build": "yarn run clean && yarn install && yarn run compile && yarn run test && cp src/lambdas/package.json lib/lambdas && cd lib/lambdas && yarn install ",
});

const common_exclude = ['cdk.out', 'cdk.context.json', 'images', 'yarn-error.log', 'tmp'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);

project.synth();
