# cdk-alps-constructs-demo

That is a AWS CDK demo deployment to demonstrate the use of my AWS CDK ALPS libs:

- https://www.npmjs.com/package/cdk-alps-spec-rest-api
- https://www.npmjs.com/package/cdk-alps-graph-ql

In src/main.ts I create a stack which creates an API Gateway and GraphQL generated out of the ALPS spec src/todo-alps.yaml

Any Feedback is much welcomed.

# Deploy

```
yarn build
yarn deploy [--profile X]
```

# Notice

- It looks interesting in point if you want to savely transit from REST API to GraphQL
