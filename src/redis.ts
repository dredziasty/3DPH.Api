import redis from 'redis'
import { promisify } from 'util'
import * as config from './config'

const client = redis.createClient(config.REDIS_URL)

export default {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client),
  keysAsync: promisify(client.keys).bind(client),
}
