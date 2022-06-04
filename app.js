const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");

const databasePath = path.join(__dirname, "savedtexts.db");

const app = express();

app.use(express.json());
app.use(cors());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(process.env.PORT || 3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/savedtexts", async (request, response) => {
  const getTodoQuery = `
    SELECT
      *
    FROM
      savedtexts`;
  const todo = await database.all(getTodoQuery);
  response.send(todo);
});

app.post("/", async (request, response) => {
  const { savedtxt } = request.body;

  const postTodoQuery = `
  INSERT INTO
    savedtexts(savedtxt)
  VALUES
    ('${savedtxt}')`;

  console.log(savedtxt);

  await database.run(postTodoQuery);
  response.send("Todo Successfully Added");
});

module.exports = app;
