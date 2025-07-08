import { InstanceBase, InstanceStatus, runEntrypoint, TCPHelper, UDPHelper, TelnetHelper } from '@companion-module/base'
import { ConfigFields } from './config.js'
import { getActionDefinitions } from './actions.js'

class GenericTcpUdpInstance extends InstanceBase {
	async init(config) {
		this.config = config

		this.setActionDefinitions(getActionDefinitions(this))

		await this.configUpdated(config)
	}

	async configUpdated(config) {
		if (this.udp) {
			this.udp.destroy()
			delete this.udp
		}

		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		this.config = config;

		if (this.config.prot == 'tcp') {
			
			debug = console.log;
			
			log = console.log;
			
			this.init_tcp()

			this.init_tcp_variables()
		}

		if (this.config.prot == 'udp') {
			this.init_udp()

			this.setVariableDefinitions([])
		}
	}

	async destroy() {
		if (this.socket) {
			this.socket.destroy()
		} else if (this.udp) {
			this.udp.destroy()
		} else {
			this.updateStatus(InstanceStatus.Disconnected)
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return ConfigFields
	}

	init_udp() {
		if (this.udp) {
			this.udp.destroy()
			delete this.udp
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.config.host) {
			this.udp = new UDPHelper(this.config.host, this.config.port)
			this.updateStatus(InstanceStatus.Ok)

			this.udp.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
				this.log('error', 'Network error: ' + err.message)
			})

			// If we get data, thing should be good
			this.udp.on('listening', () => {
				this.updateStatus(InstanceStatus.Ok)
			})

			this.udp.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	init_tcp() {
		const maxBufferLength = 2048 
		let receivebuffer = []
		
		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}
		
		this.updateStatus(InstanceStatus.Connecting)
		
		if (this.config.host) {
			this.log("debug", "Connection to " + this.config.host + " port 23");
			
			this.socket = new TelnetHelper(this.config.host, 23);
			
			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})

			this.socket.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
				this.log('error', 'Network error: ' + err.message)
			})

			this.socket.on('data', (buffer) => {
				if (this.config.saveresponse) {
					let dataResponse = buffer

					if (this.config.convertresponse == 'string') {
						dataResponse = buffer.toString()
					} else if (this.config.convertresponse == 'hex') {
						dataResponse = buffer.toString('hex')
					}

					this.setVariableValues({ tcp_response: dataResponse })
				}
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	init_tcp_variables() {
		this.setVariableDefinitions([{ name: 'Last TCP Response', variableId: 'tcp_response' }])

		this.setVariableValues({ tcp_response: '' })
	}
}

runEntrypoint(GenericTcpUdpInstance, [])
