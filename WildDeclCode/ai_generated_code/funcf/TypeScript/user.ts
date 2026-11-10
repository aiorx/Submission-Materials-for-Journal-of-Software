//   most of this function Produced using common development resources
  async update(id: USER['id'], updatedColumns: object): Promise<USER> {
    try {
      const conn = await db.connect();
      const keys = Object.keys(updatedColumns);
      const values = Object.values(updatedColumns);
      const setExpressions = keys
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');

      const sql = `UPDATE user_table SET ${setExpressions} WHERE id = $1 RETURNING *`;
      const result = await conn.query(sql, [id, ...values]);

      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`unable to update User: ${error}`);
    }
  }