import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import dontenv from "dotenv";

dontenv.config();

const uri = process.env.MONGO_DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

await client.connect();
const db = client.db("db_test");
const collection = db.collection("notes");

const addNotes = async (title, contents) => {
  const response = await collection.insertOne({
    title,
    contents,
    created: new Date(),
  });

  console.log(response);
  return response;
};

const getNotes = async () => {
  const cursor = collection.find(
    {},
    {
      projection: {
        _id: 0,
        id: { $toString: "$_id" },
        title: 1,
        contents: 1,
        created: 1,
      },
    }
  );

  const results = await cursor.toArray();
  console.log(results);

  return results;
};

const getNote = async (id) => {
  const response = await collection.findOne(
    { _id: new ObjectId(id) },
    {
      projection: {
        _id: 0,
        id: { $toString: "$_id" },
        title: 1,
        contents: 1,
        created: 1,
      },
    }
  );

  return response;
};

const updateNote = async (id, title, contents) => {
  const response = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { title: title, contents: contents } },
    {
      projection: {
        _id: 0,
        id: { $toString: "$_id" },
        title: 1,
        contents: 1,
        created: 1,
      },
    }
  );

  return response;
};

const deleteNote = async (id) => {
  const response = await collection.deleteOne(
    { _id: new ObjectId(id) },
    {
      projection: {
        _id: 0,
        id: { $toString: "$_id" },
        title: 1,
        contents: 1,
        created: 1,
      },
    }
  );

  return response;
};

await getNotes();

const run = async () => {
  try {
    console.log("You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
};

run().catch(console.dir);
