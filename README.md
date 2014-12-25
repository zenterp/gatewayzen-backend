# GatewayZen Backend

Purpose: To automatically build and maintain a fleet of gatewayd servers using
a simple state machine. That can be triggered by an external application through
postgres.

## States

- New

Gatewayds in the 'new' state have just been imagined, but no computing resources exist 
yet. 'New' is an idle state that will not proceed without external intervention.

- Instance

Gatewayds in the 'instance' state will be queued for creation of the AWS server instance
on which the gatewayd software will run. A golden Amazon Machine Image is used to build
the gatewayd server. Once complete, the state will advance to 'key'.

- Key

Gatewayds in the 'key' state will be queued for access via SSH to set and retrieve the
gatewayd API Key in order to access the Gatewayd API from the public internet. Once
complete the state will advance to 'start'.

- Start

Gatewayds in the 'start' state are not yet running and are queued for access via SSH
to start the gatewayd processes and web server. Once complete the state will advance
to 'wallet'

- Wallet

Gatewayds in the 'wallet' state do yet have a cold wallet set, and will be queued for
access via HTTP to set the public key of the cold wallet. The private key of the cold
wallet will be stored in postgres.

- Live

Gatewayds in the 'live' state are ready to be used to make money through the Ripple
network. 'Live' is an idle state that will not proceed without external intervention.

- Stop

Gatewayds in the 'stop' state are currently 'live' and are queued for stopping. Once complete
the state will advance to 'stopped'.

- Stopped

Gatewayds in the 'stopped' state are not running and must be restarted my moving them
to the 'start' state. 'Stopped' is an idle state that will not proceed without external
intervention.

- Update

Gatewayds in the 'update' state are either in the 'live' state or the 'stopped' state, and
are queued to be updated to another release version of Gatewayd. Upon completion
the gatewayd will move into the 'stopped' state.

