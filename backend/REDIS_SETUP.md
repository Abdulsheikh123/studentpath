# Redis Integration Guide

## Overview
Redis is now fully integrated into your StudentPath backend for **caching**, **session management**, **rate limiting**, and **real-time data storage**.

## 📦 Files Added/Modified

### Configuration Files
- **`src/config/redis.config.js`** - Redis client initialization
- **`src/utils/redisHelpers.js`** - Helper functions for Redis operations
- **`src/middlewares/cacheMiddleware.js`** - Caching middleware for routes

### Example Files
- **`src/controllers/REDIS_EXAMPLES.js`** - Implementation examples

### Updated Files
- **`package.json`** - Added `redis` package
- **`src/server.js`** - Redis connection initialization
- **`Dockerfile`** - Redis environment variables configured
- **`docker-compose.local.yml`** - Already has Redis service
- **`docker-compose.prod.yml`** - Already has Redis service

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Add to `.env`:
```
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=        # Leave empty if no password
```

Or use Redis URL:
```
REDIS_URL=redis://localhost:6379
```

### 3. Docker Setup
Using local environment:
```bash
docker-compose -f docker-compose.local.yml up
```

Using production:
```bash
docker-compose -f docker-compose.prod.yml up
```

### 4. Verify Connection
When the backend starts, you should see:
```
✅ Redis connected successfully at localhost:6379
✅ Redis is ready for commands
```

---

## 📚 API Reference

### Basic Operations

#### `setRedisValue(key, value, expiry = 3600)`
Store a value in Redis with optional expiry (in seconds).
```javascript
import { setRedisValue } from '../utils/redisHelpers.js';

await setRedisValue('user:1:profile', { name: 'Ahmed', email: 'ahmed@example.com' }, 60 * 60);
```

#### `getRedisValue(key)`
Retrieve a value from Redis. Returns `null` if not found.
```javascript
const profile = await getRedisValue('user:1:profile');
```

#### `deleteRedisKey(key)`
Delete a single key from Redis.
```javascript
await deleteRedisKey('user:1:profile');
```

#### `deleteRedisKeys(keys)`
Delete multiple keys.
```javascript
await deleteRedisKeys(['user:1:profile', 'user:2:profile']);
```

#### `clearRedisByPattern(pattern)`
Clear all keys matching a pattern.
```javascript
await clearRedisByPattern('user:*:profile'); // Deletes all user profiles
```

#### `incrementRedisCounter(key, increment = 1, expiry = 3600)`
Atomic counter increment (useful for rate limiting, counters).
```javascript
const count = await incrementRedisCounter('api:requests:today', 1);
```

#### `redisKeyExists(key)`
Check if a key exists.
```javascript
const exists = await redisKeyExists('user:1:profile');
```

#### `getRedisExpiry(key)`
Get time-to-live (TTL) for a key in seconds.
```javascript
const ttl = await getRedisExpiry('user:1:profile'); // Returns -1 if no expiry
```

#### `cacheOrFetch(key, fetchFn, expiry = 3600)`
**Recommended for most caching use cases**. Attempts to get from cache, if not found calls `fetchFn` and caches result.
```javascript
const colleges = await cacheOrFetch(
  'colleges:all',
  async () => {
    return await prisma.college.findMany();
  },
  60 * 60  // 1 hour expiry
);
```

---

## 💡 Common Patterns

### Pattern 1: Cache Database Queries
```javascript
export const getColleges = async (req, res) => {
  const colleges = await cacheOrFetch(
    'colleges:all',
    async () => await prisma.college.findMany(),
    60 * 60  // Cache for 1 hour
  );
  res.json(colleges);
};
```

### Pattern 2: Cache Invalidation on Update
```javascript
export const updateCollege = async (req, res) => {
  const college = await prisma.college.update({
    where: { id: req.params.id },
    data: req.body
  });

  // Invalidate related caches
  await deleteRedisKey('colleges:all');
  await deleteRedisKey(`college:${college.id}`);

  res.json(college);
};
```

### Pattern 3: User Search History
```javascript
export const recordSearch = async (req, res) => {
  const { query, userId } = req.query;

  // Store in Redis list
  const key = `searches:${userId}`;
  await redis.lpush(key, JSON.stringify({ query, timestamp: Date.now() }));
  await redis.ltrim(key, 0, 19); // Keep last 20 searches
  await redis.expire(key, 30 * 24 * 60 * 60); // Expire after 30 days
};
```

### Pattern 4: Rate Limiting
```javascript
export const rateLimitMiddleware = async (req, res, next) => {
  const userId = req.user?.id;
  const limit = 100;
  const window = 3600; // 1 hour

  const key = `ratelimit:${userId}`;
  const count = await incrementRedisCounter(key, 1, window);

  if (count > limit) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  next();
};
```

### Pattern 5: Session/Token Blacklist
```javascript
export const logoutUser = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    // Blacklist token for remaining lifetime (24 hours)
    await setRedisValue(`blacklist:${token}`, true, 24 * 60 * 60);
  }

  res.json({ message: 'Logged out' });
};

// Use in authentication middleware
export const verifyTokenBlacklist = async (token) => {
  const isBlacklisted = await getRedisValue(`blacklist:${token}`);
  return !isBlacklisted; // Token is valid if NOT blacklisted
};
```

### Pattern 6: Using Caching Middleware
```javascript
import cacheMiddleware from '../middlewares/cacheMiddleware.js';

// Automatically cache GET responses for 10 minutes
router.get('/colleges', cacheMiddleware('colleges', 600), getColleges);
```

---

## 🔍 Debugging

### Check Redis Connection Status
```javascript
// In your route
router.get('/health/redis', async (req, res) => {
  try {
    await redis.ping();
    res.json({ status: 'connected', redis: true });
  } catch (error) {
    res.json({ status: 'disconnected', error: error.message });
  }
});
```

### View Redis Stats
```bash
# Using Redis CLI
redis-cli
> INFO # Get server stats
> DBSIZE # Show number of keys
> KEYS * # List all keys
> FLUSHDB # Clear all keys (dangerous!)
```

### Monitor Cache Hits/Misses
The helper functions already log cache hits/misses:
```
Cache HIT for key: colleges:all
Cache MISS for key: colleges:all
```

---

## ⚙️ Production Considerations

### 1. **Password Protection**
```env
REDIS_PASSWORD=your_secure_password_here
```

### 2. **Memory Management**
```bash
# Set max memory in redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru  # Evict LRU keys when memory limit reached
```

### 3. **Persistence**
Redis persistence is configured in `docker-compose.prod.yml` with volume mapping:
```yaml
redis:
  volumes:
    - redis_prod_data:/data
```

### 4. **Monitoring**
Monitor Redis memory:
```bash
docker exec studentpath_redis_prod redis-cli INFO memory
```

### 5. **Replication Setup** (Optional)
For high availability, set up Redis replication with master-slave architecture.

---

## 🧪 Testing

### Test Redis Connection Locally
```bash
# Start only Redis
docker-compose -f docker-compose.local.yml up redis

# Or use local Redis
redis-server
```

### Test in Your Controller
```javascript
import redis from '../config/redis.config.js';

export const testRedis = async (req, res) => {
  try {
    await redis.set('test', 'hello');
    const value = await redis.get('test');
    res.json({ success: true, value });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
```

---

## 🚨 Troubleshooting

### Issue: "Redis connection refused"
- Make sure Redis container is running: `docker ps`
- Check REDIS_HOST and REDIS_PORT env vars
- For local development: `redis-server` must be running

### Issue: "Cannot find module 'redis'"
```bash
npm install redis
```

### Issue: Data not persisting
- Check that Redis volume is mounted in docker-compose
- Verify `/data` folder has write permissions

### Issue: High memory usage
- Reduce cache expiry times
- Use `MAXMEMORY` policy in Redis config
- Monitor with `redis-cli INFO memory`

---

## 📖 Additional Resources
- [Node Redis Documentation](https://github.com/redis/node-redis)
- [Redis Commands](https://redis.io/commands/)
- [Docker Redis Image](https://hub.docker.com/_/redis)

---

## ✅ Integration Checklist
- [x] Redis package added to `package.json`
- [x] Redis config file created
- [x] Redis helpers created
- [x] Server initialization updated
- [x] Dockerfile configured
- [x] Docker-compose already has Redis
- [x] Examples and documentation provided

**You're ready to use Redis in your application! 🎉**
