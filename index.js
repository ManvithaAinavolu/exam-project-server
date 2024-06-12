const express=require('express');
const oracledb=require('oracledb');
const cors=require('cors');
const bodyParser=require('body-parser');
const app=express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());



const dbConfig = {
    user: 'system',
    password: 'manager',
    connectString: 'localhost:/XEXDB'
  };
  
  // Routes
  app.get('/',(req,res)=>{
    res.send('hello manvitha');
  });
  app.get('/college', async (req, res) => {
    try {
      // Create a connection to the database
      const connection = await oracledb.getConnection(dbConfig);
  
      // Execute the SQL query to retrieve the table details
      const query = 'SELECT * FROM  college';
      const result = await connection.execute(query);
  
      // Send the table details back to the client
      res.send(result.rows);
      
      // Release the database connection
      await connection.close();
    } catch (error) {
      // Handle the error
      res.status(500).send(error.message);
    }
  });
  async function insertData(clg_code,clg_name,clg_add,clg_city,clg_district,clg_pincode,clg_state) {
    let conn;
    try {
      conn = await oracledb.getConnection(dbConfig);
  
      const qr = `INSERT INTO college VALUES (:clg_code, :clg_name, :clg_add, :clg_city, :clg_district, :clg_pincode, :clg_state)`;
      const result = await conn.execute(qr, [clg_code, clg_name,clg_add,clg_city,clg_district,clg_pincode,clg_state]);
      conn.commit();
      console.log(result);
  
      // Log the values that were inserted
      console.log(`Inserted values: clg_code=${clg_code},clg_name=${clg_name},clg_add=${clg_add},clg_city=${clg_city},clg_district=${clg_district},clg_pincode=${clg_pincode},clg_state=${clg_state} `);
  
    } catch (err) {
      console.error('Error inserting data:', err);
    } finally {
      if (conn) {
        try {
          await conn.close();
          console.log('Connection closed');
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  
  app.post('/login', async (req, res) => {
    const clg_code = req.body.clg_code;
    const clg_name = req.body.clg_name;
    const clg_add = req.body.clg_add;
    const clg_city = req.body.clg_city;
    const clg_district = req.body.clg_district;
    const clg_pincode = req.body.clg_pincode;
    const clg_state = req.body.clg_state;
    
  
    // Log the values being inserted
    console.log(`Inserted values: clg_code=${clg_code},clg_name=${clg_name},clg_add=${clg_add},clg_city=${clg_city},clg_district=${clg_district},clg_pincode=${clg_pincode},clg_state=${clg_state}`);
  
    await insertData(clg_code,clg_name,clg_add,clg_city,clg_district,clg_pincode,clg_state);
  
    res.send({
      message: 'Data inserted'
    });
  });
  async function deleteData(clg_code) {
    let conn;
    try {
      conn = await oracledb.getConnection(dbConfig);
  
      const qr = `DELETE FROM college WHERE clg_code = :clg_code`;
      const result = await conn.execute(qr, [clg_code]);
      conn.commit();
      console.log(result);
  
      // Log the values that were deleted
      console.log(`Deleted value: clg_code=${clg_code}`);
  
    } catch (err) {
      console.error('Error deleting data:', err);
    } finally {
      if (conn) {
        try {
          await conn.close();
          console.log('Connection closed');
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  app.delete('/delete-college', async (req, res) => {
    const clg_code = req.query.clg_code; // extract clg_code parameter from request query
  
    // call deleteData function with clg_code parameter
    await deleteData(clg_code);
  
    res.send(`College with clg_code ${clg_code} has been deleted.`);
  });
  async function updateData(clg_code, clg_name, clg_add, clg_city, clg_district, clg_pincode, clg_state) {
    let conn;
    try {
      conn = await oracledb.getConnection(dbConfig);
  
      const result = await conn.execute(
        `UPDATE college SET clg_code = :clg_code,clg_name = :clg_name, clg_add = :clg_add, clg_city = :clg_city, clg_district = :clg_district, clg_pincode = :clg_pincode, clg_state = :clg_state WHERE clg_code = :clg_code`,
        { 
          clg_code,
          clg_name, 
          clg_add, 
          clg_city, 
          clg_district, 
          clg_pincode, // convert to number 
          clg_state,
          
        }
      );
  
      conn.commit();
      console.log(result);
  
      // Log the values that were updated
      console.log(`Updated value: clg_code=${clg_code}, clg_name=${clg_name}`);
  
    } catch (err) {
      console.error('Error updating data:', err);
    } finally {
      if (conn) {
        try {
          await conn.close();
          console.log('Connection closed');
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  
  app.put('/college/:clg_code', async (req, res) => {
    try {
      const clg_code = req.params.clg_code;
      const { clg_name, clg_add, clg_city, clg_district, clg_pincode, clg_state } = req.body;
  
      await updateData(clg_code, clg_name, clg_add, clg_city, clg_district, clg_pincode, clg_state);
  
      res.status(200).json({ message: 'College with clg_code 1 has been updated.' });

    } catch (err) {
      console.error('Error updating college:', err);
      res.status(500).send('Error updating college.');
    }
  });
  let conn;
  app.get('/college/:clg_code', async (req, res) => {
    let conn;
    try {
      conn = await oracledb.getConnection(dbConfig);
      const clg_code = req.params.clg_code;
      const sql = `SELECT * FROM college WHERE clg_code = :clg_code`;
      const result = await conn.execute(sql, [clg_code]);
      res.send(result.rows[0]);
      await conn.commit();
      console.log('data retrived',result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    } finally {
      if (conn) {
        await conn.close();
      }
    }
  });
  
  //This code establishes a connection to the database using the mysql driver, and then executes a SQL query to retrieve data from the college table. The retrieved data is then sent as a JSON response to the client.
  
  
  
  
app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
})