const { createSocket } = require("dgram")

module.exports = function getTime(
  server = "pool.ntp.org",
  port = 123,
  timeout = 3000,
  socketType = "udp4"
) {
  return new Promise((resolve, reject) => {
    const socket = createSocket(socketType) // creating a socket

    let packet = Buffer.alloc(48).fill(0) // buffer filled of 0

    packet[0] = 0x1b // 27

    const deadline = setTimeout(
      () => reject(new Error("NTP Timeout was reached")),
      timeout
    )

    socket.on("error", err => {
      clearTimeout(deadline)

      reject(err)
    })

    socket.send(packet, 0, packet.length, port, server, error => {
      if (error) {
        clearTimeout(deadline)

        reject(error)
      }

      socket.once("message", message => {
        clearTimeout(deadline)
        socket.close()

        // super secret part directly stolen from https://github.com/moonpyk/node-ntp-client/blob/master/lib/ntp-client.js

        const offsetTransmitTime = 40

        let secondsPart = 0,
          fractionPart = 0,
          iter = 0

        for (iter = 0; iter <= 3; iter += 1) {
          secondsPart = 256 * secondsPart + message[offsetTransmitTime + iter]
        }

        for (iter = 4; iter <= 7; iter += 1) {
          fractionPart = 256 * fractionPart + message[offsetTransmitTime + iter]
        }

        const ms = secondsPart * 1000 + (fractionPart * 1000) / 0x100000000

        // end of super secret part

        const date = new Date("Jan 01 1900 GMT")

        date.setUTCMilliseconds(date.getUTCMilliseconds() + ms)

        resolve(date)
      })
    })
  })
}
