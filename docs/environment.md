# Environment Variables 
## Overview
This document provides a brief overview of the environment variables used to configure the AO Connect SDK.
---
## `.env.example`
To get started, use the `.env.example` [file](../.env.example) as a template for your configuration. It includes all the variables described below.

## Supported Environment Variables
`PATH_TO_WALLET`
Path to the JSON JWK wallet file used for signing and interacting with AO.

`GATEWAY_URL`
The URL of the desired Gateway.

`GRAPHQL_URL`
The URL of the desired Arweave Gateway GraphQL Server.

`GRAPHQL_MAX_RETRIES`
The number of times to retry querying the gateway, utilizing an exponential backoff.

`GRAPHQL_RETRY_BACKOFF`
The initial backoff, in milliseconds (moot if GRAPHQL_MAX_RETRIES is set to 0).

`MU_URL`
The URL of the desired AO Messenger Unit.

`CU_URL`
The URL of the desired AO Compute Unit.

