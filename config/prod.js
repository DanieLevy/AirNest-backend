export default {
  dbURL:
    process.env.MONGO_URL ||
    'mongodb+srv://peleg:G1gJ8B8zPcrNWQ3K@airnest.tomb5ll.mongodb.net/',
  dbName: process.env.DB_NAME || 'airnest',
}
