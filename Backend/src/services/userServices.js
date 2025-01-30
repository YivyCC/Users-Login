import { query } from "../db.js";

export const getUsers = async() =>{
  const {rows} = await query("SELECT * FROM users_tb");
  return rows;
}

export const createUser = async (userData) => {
  const { firstName, lastName, email, password, isActive } = userData;

  const fullName = `${firstName} ${lastName}`;

  const { rows } = await query(
    `INSERT INTO users_tb (name, email, password, isActive) VALUES ($1, $2, $3, $4) RETURNING *`, 
    [fullName, email, password, isActive]
  );
  return rows[0];
};


export const updateUser = async(userId, userData) =>{
  const {name, email, isBlocked} = userData;

  const {rows} = await query(
    `UPDATE users_tb SET name = $1, email = $2, isblocked = $3 WHERE id = $4 RETURNING *`, [name, email, isBlocked, userId]
  );
  return rows[0];
}

export const deleteUser = async(userId) =>{
  const {rowCount} = await query(`DELETE FROM users_tb WHERE id = $1`, [userId]);
  return rowCount > 0; 
}

export const loginUser = async (email, password) => {
  try {
    const { rows } = await query(
      `SELECT * FROM users_tb WHERE email = $1`, [email]
    );

    if (rows.length === 0) {
      return { success: false, message: 'Invalid credentials' };
    }

    const user = rows[0];

    if (user.password === password) {
      return { success: true, user };
    } else {
      return { success: false, message: 'Invalid credentials' };
    }
  } catch (err) {
    console.error('Error logging in:', err);
    return { success: false, message: 'An error occurred' };
  }
};

// Update isActive and last_login_time after the user logs in
export const updateLoginDetails = async (email) => {
  try {
    const { rows } = await query(
      `UPDATE users_tb SET isActive = true, last_login_time = NOW() WHERE email = $1 RETURNING *`,
      [email]
    );

    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (err) {
    console.error('Error updating login details:', err);
    throw err;
  }
};

// Update isActive and last_login_time after the user logs in
export const updateIsActiveOffline = async (email) => {
  try {
    const { rows } = await query(
      `UPDATE users_tb SET isActive = false, last_login_time = NOW() WHERE email = $1 RETURNING *`,
      [email]
    );

    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (err) {
    console.error('Error updating login details:', err);
    throw err;
  }
};

// Bulk action on users (block, unblock, delete)
export const bulkActionOnUsers = async (action, emails) => {
  // Set up users to be affected
  const queryStr = emails.map((email, index) => `$${index + 1}`).join(',');

  try {
    let updateQuery;
    
    if (action === "block") {
      updateQuery = `UPDATE users_tb SET isBlocked = true WHERE email IN (${queryStr})`;
    } else if (action === "unblock") {
      updateQuery = `UPDATE users_tb SET isBlocked = false WHERE email IN (${queryStr})`;
    } else if (action === "delete") {
      updateQuery = `DELETE FROM users_tb WHERE email IN (${queryStr})`;
    }
    
    await query(updateQuery, emails);

    return true;
  } catch (error) {
    console.error('Error performing bulk action:', error);
    return false;
  }
};

// Fetch user by email
export const getUserByEmail = async (email) => {
  try {
    const result = await query('SELECT * FROM users_tb WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    console.log('DB result:', result.rows);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error fetching user by email: ${err.message}`);
  }
};