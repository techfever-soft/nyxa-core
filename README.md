# Nyxa Core : Connecting Client and API Nodes Visually

## Overview

Nyxa-Core is the core engine of a larger project designed to facilitate the visual connection of client nodes to API nodes or other services. It provides a structured foundation for managing connections, handling API requests, and ensuring seamless interactions between front-end applications and back-end services through an intuitive UI.

## Features

- **Node-Based Connection Management**: Enables visually connecting client nodes to API or other service nodes.
- **Event-Driven Architecture**: Utilizes an event bus system for optimized communication.
- **Request & Response Management**: Ensures smooth and structured API interactions.
- **Reactive State Management**: Built with RxJS for real-time data updates.
- **Modular and Scalable**: Easily integrates into various applications with a flexible approach.

## Installation

To install Nyxa-Core, use the following command:

```sh
npm install nyxa-core
```

## Getting Started

### Importing Nyxa-Core

```ts
import { NyxaConnectionManager } from "nyxa-core";
```

### Creating a Connection & optionally a request

```ts
const connectionManager = NyxaConnectionManager.getInstance();

const clientNode: NyxaClientNodeInterface = {
  id: "login-button",
  name: "Login Button",
  type: "action",
  request: <NyxaRequestInterface>{
    method: "GET",
    endpoint: "/login",
  },
};

const apiNode: NyxaServerNodeInterface = {
  id: "login-endpoint",
  name: "Login Endpoint",
  type: "endpoint",
  endpoint: "/login",
};

const connection = await connectionManager.createConnection(
  actionNode,
  apiNode
);

console.log("connection created => ", connection);
```

### Managing API Requests

```ts
import { NyxaRequestManager } from "nyxa-core";

const requestManager = NyxaRequestManager.getInstance();

const response = await requestManager.createRequest(connection);

console.log("API Response => ", response);
```

### Subscribing to events

```ts
NyxaEventBus.on("connectionCreated", (connection) => {
  console.log("✅ Connection created :", connection);
});

NyxaEventBus.on("connectionCancelled", (connection) => {
  console.log("❌ Connection deleted :", connection);
});

NyxaEventBus.on("connectionUpdated", (connection) => {
  console.log("🔄 Connection updated :", connection);
});

NyxaEventBus.on("responseReceived", ({ connection, response }) => {
  console.log(
    `📩 Response received from ${connection.source.id} -> ${connection.target.id}:`,
    response
  );
});
```

## Use Cases

- **Node-Based UI for Connecting Clients to APIs**: Provides a visual interface for managing and linking different nodes.
- **Single Page Applications (SPAs)**: Seamless interaction between the front-end and API.
- **Microservices Communication**: Managing API endpoints efficiently.
- **Real-time Data Processing**: Using the event bus for real-time updates.

## What's Next?
- Explore the full API documentation (coming soon).
- Try integrating Nyxa-Core with your own API.
- Contribute to the project by reporting issues or suggesting improvements.

## Contributing

We welcome contributions! Feel free to open an issue or submit a pull request.

## License

Nyxa is released under the **MIT License**.

## Contact

For any inquiries or support, please reach out via techfever.dev@gmail.com
