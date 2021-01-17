const { io } = require('../server')
const { TicketControl } = require('../classes/ticket-control')
const ticketcontrol = new TicketControl()
io.on('connection', (client) => {
  client.on('siguienteTicket', (data, callback) => {
    let siguiente = ticketcontrol.siguiente()
    callback(siguiente)
  })
  client.emit('estadoActual', {
    actual: ticketcontrol.getUltimoTicket(),
    ultimos4: ticketcontrol.getUltimos4(),
  })
  client.on('atenderTicket', (data, callback) => {
    if (!data.escritorio) {
      return callback({
        err: true,
        mensaje: 'el escritorio es necesario',
      })
    }
    let atenderTicket = ticketcontrol.atenderTickets(data.escritorio)
    callback(atenderTicket)
    client.broadcast.emit('ultimos4', {
      ultimos4: ticketcontrol.getUltimos4(),
    })
  })
})
