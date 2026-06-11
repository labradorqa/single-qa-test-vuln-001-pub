const DB_CONNECTION_STRING = 'mysql://root:rootpass@127.0.0.1:3306/app';

const fakeDb = {
  query(sql) {
    console.log('SQL:', sql);
    return [{ id: 1, name: 'admin' }];
  }
};

function findUser(req, res) {
  const id = req.query.id;
  const sql = `SELECT * FROM users WHERE id = ${id}`;
  const rows = fakeDb.query(sql);
  res.json({ rows, conn: DB_CONNECTION_STRING });
}

function searchUsers(req, res) {
  const name = req.query.name;
  const sql = "SELECT * FROM users WHERE name LIKE '%" + name + "%'";
  const rows = fakeDb.query(sql);
  res.json(rows);
}

function deleteUser(req, res) {
  const id = req.params.id;
  fakeDb.query(`DELETE FROM users WHERE id = ${id}`);
  res.send('deleted');
}

module.exports = { findUser, searchUsers, deleteUser, DB_CONNECTION_STRING };
