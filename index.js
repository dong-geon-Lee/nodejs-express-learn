const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const dontenv = require("dotenv");

const app = express();
const port = 5000;
dontenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* GET
const getNotes = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `select bin_to_uuid(uuid,true) as uuid,title,contents,created from notes;`,
      (err, rows, fields) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

//* GET
const getNote = (uuid) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `select bin_to_uuid(uuid,true) as uuid,title,contents,created from notes where uuid=uuid_to_bin('${uuid}',1);`,
      (err, rows, fields) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

//* POST
const addNotes = (title, contents) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `insert into notes (title,contents) values ('${title}','${contents}');`,
      (err, rows, fields) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

//* PUT
const updateNote = (uuid, title, contents) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `update notes set title='${title}',contents='${contents}' where uuid=uuid_to_bin('${uuid}',1);`,
      (err, rows, fields) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

//* DELETE
const deleteNote = (uuid) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `delete from notes where uuid=uuid_to_bin('${uuid}',1); `,
      (err, rows, fields) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

//* 데이터 조회
app.get("/", async (req, res) => {
  const datas = await getNotes();
  res.json(datas);
});

//* 데이터 조회
app.get("/:id", async (req, res) => {
  const { id: uuid } = req.params;
  const datas = await getNote(uuid);
  res.json(datas);
});

//* 데이터 추가
app.post("/", async (req, res) => {
  const { title, contents } = req.body;
  const response = await addNotes(title, contents);
  res.json(response);
});

//* 데이터 수정
app.put("/:id", async (req, res) => {
  const { id: uuid } = req.params;
  const { title, contents } = req.body;
  const response = await updateNote(uuid, title, contents);
  res.json(response);
});

//* 데이터 삭제
app.delete("/:id", async (req, res) => {
  const { id: uuid } = req.params;
  const response = await deleteNote(uuid);
  res.json(response);
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
