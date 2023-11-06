export default {
  dbURL:
    process.env.MONGO_URL ||
    'mongodb+srv://peleg:G1gJ8B8zPcrNWQ3K@cluster0.f1mjs59.mongodb.net/?retryWrites=true&w=majority',
  dbName: process.env.DB_NAME || 'tester_db',
}
