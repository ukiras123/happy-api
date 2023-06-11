# happy-api

## How to run Server locally
- `npm install`
- `npm run start:dev` or `npm run start`
- `http://localhost:3000/api/accounts/pageSize/10/page/3`

## This service is deployed in Lambda
- Endpoint: `https://aaefst2hx6.execute-api.us-east-1.amazonaws.com/Prod/api/accounts/pageSize/5/page/5`

## This service is deployed in ECS (ALB)
- Endpoint: `http://nodejs-test-lb-1300628147.us-east-1.elb.amazonaws.com/api/accounts/pageSize/5/page/5`