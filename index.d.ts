/**
 * Fetches NTP server and gets time from it
 *
 *
 * @param server  NTP server host, default pool.ntp.org
 * @param port NTP server port, default 123
 * @param timeout Timeout to response in MS, default 3000 (3s)
 * @param socketType Socket type udp4 or udp6, default udp4
 *
 * @returns Promise with Date on NTP server as result
 *
 *
 * @see https://github.com/moonpyk/node-ntp-client
 */

export default function getTime(
  server: string = "pool.ntp.org",
  port: number = 123,
  timeout: number = 3000,
  socketType: "udp4" | "udp6" = "udp4"
): Promise<Date>
