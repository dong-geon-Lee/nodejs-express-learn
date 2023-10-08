const express = require("express");
const mysql = require("mysql2");
const dontenv = require("dotenv");

const app = express();
const port = 3000;

dontenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

//* GET
const getNotes = () => {
  pool.query(
    `select bin_to_uuid(uuid,true) as uuid,title,contents,created from notes;`,
    (err, rows, fields) => console.log(rows)
  );
};

getNotes();

const getNote = (uuid) => {
  pool.query(
    `select bin_to_uuid(uuid,true) as uuid,title,contents,created from notes where uuid=uuid_to_bin('${uuid}',1);`,
    (err, rows, fields) => console.log(rows)
  );
};

// getNote("8caad803-6501-11ee-a8b7-06b353e9a8e6");

//* POST
const addNotes = (title, contents) => {
  pool.query(
    `insert into notes (title,contents) values ('${title}','${contents}');`,
    (err, rows, fields) => console.log(rows)
  );
};

//* PUT
const updateNote = (uuid, title, contents) => {
  pool.query(
    `update notes set title='${title}',contents='${contents}' where uuid=uuid_to_bin('${uuid}',1);`,
    (err, rows, fields) => console.log(rows)
  );
};

//* DELETE
const deleteNote = (uuid) => {
  pool.query(
    `delete from notes where uuid=uuid_to_bin('${uuid}',1); `,
    (err, rows, fields) => console.log(rows)
  );
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//* 데이터 추가
// addNotes("My third Note", "A note about Content3");

//* 데이터 조회
// getNote("8caad803-6501-11ee-a8b7-06b353e9a8e6");

//* 데이터 수정
// updateNote(
//   "9142dfb5-6506-11ee-a8b7-06b353e9a8e6",
//   "he is hard thinker!",
//   "How to salery increase for two years"
// );

//* 데이터 삭제
// deleteNote("9142dfb5-6506-11ee-a8b7-06b353e9a8e6");

//* crud 쿼리문
// pool.query(
//   `INSERT INTO notes (title, contents) VALUES
// ('My First Note', 'A note about something'),
// ('My Second Note', 'A note about something else');`,
//   (err, rows, fields) => console.log(rows)
// );
// pool.query(`show databases;`, (err, rows, fields) => console.log(rows));
// pool.query("show tables;", (err, rows, fields) => console.log(rows));
// pool.query(
//   `CREATE TABLE notes (
//   uuid BINARY(16) DEFAULT (UUID_TO_BIN(UUID(),1)) PRIMARY KEY,
//   title VARCHAR(255) NOT NULL,
//   contents TEXT NOT NULL,
//   created TIMESTAMP NOT NULL DEFAULT NOW()
// );`,
//   (err, rows, fields) => console.log(rows)
// );
