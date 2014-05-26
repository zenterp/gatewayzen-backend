var GatewayClient = require(__dirname+'/../lib/gateway_client.js');

var client = new GatewayClient('50.17.39.241', 'admin@doge-gate.com', 'b8fb8959f02f072c57c1ac6191f7adfd06624c3df68ef5f8cbcb73cca8cac4d6');

client.getColdWallet(console.log);

