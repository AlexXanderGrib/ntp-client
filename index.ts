import { createSocket, type SocketType } from "dgram"

const TRANSMIT_TIME_OFFSET = 40
const PACKET_SIZE = 48
const TIME_REQUEST = 0x11

const TIME_LOCAL_BASE = new Date(0, 0).getTime()
const TIME_UTC_BASE = Date.UTC(0, 0)

export type GetTimeOptions = Readonly<{
  /**
   * NTP server address
   * @default "pool.ntp.org"
   */
  server?: string

  /**
   * NTP server port
   *
   * @default 123
   */
  port?: number

  /**
   * Timeout in milliseconds
   * @default 5000
   */
  timeout?: number

  /**
   * UDP Socket type (IP)
   * @default "udp4"
   */
  socketType?: SocketType

  /**
   * Whether sync with UTC or Local time
   * @default true
   */
  utc?: boolean
}>

/**
 *
 *
 * @export
 * @param {GetTimeOptions} [options={}]
 * @param {string} [options.server="pool.ntp.org"] NTP server address
 * @param {number} [options.port=123] NTP server port
 * @param {number} [options.timeout=5000] Timeout in milliseconds
 * @param {SocketType} [options.socketType="udp4"] UDP Socket type (IP)
 * @param {boolean} [options.utc=true] Whether use UTC or Local time
 * @return {Promise<Date>} Synced date
 */
export async function getTime({
  server = "pool.ntp.org",
  port = 123,
  timeout = 5000,
  socketType = "udp4",
  utc = true,
}: GetTimeOptions = {}): Promise<Date> {
  const socket = createSocket(socketType)
  const packet = Buffer.alloc(PACKET_SIZE).fill(0)
  packet[0] = TIME_REQUEST

  let onTimeout: CallableFunction = () => {}

  const response = new Promise<Buffer>((resolve, reject) => {
    onTimeout = () => reject(new Error("Timeout exceeded"))

    socket
      .once("error", reject)
      .once("message", resolve)
      .send(packet, port, server, (error) => {
        if (error !== null) reject(error)
      })
  })

  const deadline = setTimeout(() => onTimeout(), timeout)

  const buffer = await response.finally(() => {
    clearInterval(deadline)
    socket.close()
  })

  const seconds = buffer.readUInt32BE(TRANSMIT_TIME_OFFSET)
  const base = utc ? TIME_UTC_BASE : TIME_LOCAL_BASE

  return new Date(base + seconds * 1000)
}
