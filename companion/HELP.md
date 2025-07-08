# Generic TCP and UDP module



## Configuration

| Option                | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| Target IP             | Destination Host name / IP                                      |
| Target Port           | Destination port                                                |
| TCP/UDP               | Connection protocol to use                                      |
| Save TCP Response*    | Option to save the last response received via TCP               |
| Convert TCP Response* | Optionally convert response to 'String' or 'Hex' encoded string |

\* only available if protocol is set to TCP

## Actions

| Action           | Description                                                                   |
| ---------------- | ----------------------------------------------------------------------------- |
| Send Command     | Send printable characters, with optional termination sequence                 |
| Send HEX Command | Send a HEX encoded sequence of characters, with optional termination sequence |

## Variables

If enabled, the last response received via TCP will be stored in `$(NAME:tcp_response)`
