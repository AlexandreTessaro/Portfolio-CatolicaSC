import pool from '../config/database.js';
import User from '../domain/User.js';

export class UserRepository {
  async create(userData) {
    const client = await pool.connect();
    try {
      const { email, password, name, bio, skills, socialLinks, profileImage } = userData;
      
      const query = `
        INSERT INTO users (email, password, name, bio, skills, social_links, profile_image, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      
      const values = [
        email,
        password,
        name,
        bio,
        JSON.stringify(skills || []),
        JSON.stringify(socialLinks || {}),
        profileImage,
        new Date(),
        new Date()
      ];
      
      const result = await client.query(query, values);
      const user = result.rows[0];
      
      return new User({
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        bio: user.bio,
        skills: user.skills,
        socialLinks: user.social_links,
        profileImage: user.profile_image,
        isAdmin: user.is_admin,
        isVerified: user.is_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      });
    } finally {
      client.release();
    }
  }

  async findById(id) {
    const client = await pool.connect();
    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await client.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const user = result.rows[0];
      return new User({
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        bio: user.bio,
        skills: user.skills,
        socialLinks: user.social_links,
        profileImage: user.profile_image,
        isAdmin: user.is_admin,
        isVerified: user.is_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      });
    } finally {
      client.release();
    }
  }

  async findByEmail(email) {
    const client = await pool.connect();
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await client.query(query, [email]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const user = result.rows[0];
      return new User({
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        bio: user.bio,
        skills: user.skills,
        socialLinks: user.social_links,
        profileImage: user.profile_image,
        isAdmin: user.is_admin,
        isVerified: user.is_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      });
    } finally {
      client.release();
    }
  }

  async update(id, updates) {
    const client = await pool.connect();
    try {
      const setFields = [];
      const values = [];
      let paramCount = 1;
      
      // Mapear campos do frontend para campos do banco
      const fieldMapping = {
        name: 'name',
        bio: 'bio',
        skills: 'skills',
        socialLinks: 'social_links',
        profileImage: 'profile_image'
      };
      
      Object.entries(updates).forEach(([key, value]) => {
        if (fieldMapping[key] && value !== undefined) {
          setFields.push(`${fieldMapping[key]} = $${paramCount}`);
          
          // Converter arrays e objetos para JSON
          if (key === 'skills' || key === 'socialLinks') {
            values.push(JSON.stringify(value));
          } else {
            values.push(value);
          }
          
          paramCount++;
        }
      });
      
      if (setFields.length === 0) {
        return null;
      }
      
      setFields.push(`updated_at = $${paramCount}`);
      values.push(new Date());
      values.push(id);
      
      const query = `
        UPDATE users 
        SET ${setFields.join(', ')}
        WHERE id = $${paramCount + 1}
        RETURNING *
      `;
      
      const result = await client.query(query, values);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const user = result.rows[0];
      return new User({
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        bio: user.bio,
        skills: user.skills,
        socialLinks: user.social_links,
        profileImage: user.profile_image,
        isAdmin: user.is_admin,
        isVerified: user.is_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      });
    } finally {
      client.release();
    }
  }

  async delete(id) {
    const client = await pool.connect();
    try {
      const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
      const result = await client.query(query, [id]);
      
      if (result.rows.length === 0) {
        return false;
      }
      
      return true;
    } finally {
      client.release();
    }
  }

  async findAll(limit = 50, offset = 0) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT * FROM users 
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
      `;
      
      const result = await client.query(query, [limit, offset]);
      
      return result.rows.map(user => new User({
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        bio: user.bio,
        skills: user.skills,
        socialLinks: user.social_links,
        profileImage: user.profile_image,
        isAdmin: user.is_admin,
        isVerified: user.is_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }));
    } finally {
      client.release();
    }
  }

  async findBySkills(skills, limit = 20) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT * FROM users 
        WHERE skills @> $1::jsonb
        ORDER BY created_at DESC 
        LIMIT $2
      `;
      
      const result = await client.query(query, [JSON.stringify(skills), limit]);
      
      return result.rows.map(user => new User({
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        bio: user.bio,
        skills: user.skills,
        socialLinks: user.social_links,
        profileImage: user.profile_image,
        isAdmin: user.is_admin,
        isVerified: user.is_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }));
    } finally {
      client.release();
    }
  }

  async findByName(name, limit = 20, offset = 0) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT * FROM users 
        WHERE LOWER(name) LIKE LOWER($1)
        ORDER BY created_at DESC 
        LIMIT $2 OFFSET $3
      `;
      
      const result = await client.query(query, [`%${name}%`, limit, offset]);
      
      return result.rows.map(user => new User({
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        bio: user.bio,
        skills: user.skills,
        socialLinks: user.social_links,
        profileImage: user.profile_image,
        isAdmin: user.is_admin,
        isVerified: user.is_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }));
    } finally {
      client.release();
    }
  }

  async searchUsers(filters = {}, limit = 20, offset = 0) {
    const client = await pool.connect();
    try {
      let query = `SELECT * FROM users WHERE 1=1`;
      const params = [];
      let paramCount = 0;

      // Excluir usuário atual se fornecido
      if (filters.excludeUserId) {
        paramCount++;
        query += ` AND id != $${paramCount}`;
        params.push(filters.excludeUserId);
      }

      // Filtro por nome
      if (filters.name && filters.name.trim()) {
        paramCount++;
        query += ` AND LOWER(name) LIKE LOWER($${paramCount})`;
        params.push(`%${filters.name.trim()}%`);
      }

      // Filtro por habilidades
      if (filters.skills && filters.skills.length > 0) {
        paramCount++;
        query += ` AND skills @> $${paramCount}::jsonb`;
        params.push(JSON.stringify(filters.skills));
      }

      // Ordenação
      if (filters.sortBy === 'name') {
        query += ` ORDER BY name ASC`;
      } else if (filters.sortBy === 'oldest') {
        query += ` ORDER BY created_at ASC`;
      } else {
        query += ` ORDER BY created_at DESC`; // newest (padrão)
      }

      // Paginação
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(limit);
      
      paramCount++;
      query += ` OFFSET $${paramCount}`;
      params.push(offset);

      const result = await client.query(query, params);
      
      return result.rows.map(user => new User({
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        bio: user.bio,
        skills: user.skills,
        socialLinks: user.social_links,
        profileImage: user.profile_image,
        isAdmin: user.is_admin,
        isVerified: user.is_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }));
    } finally {
      client.release();
    }
  }

  async findRecommendedUsers(limit = 4, excludeUserId = null) {
    const client = await pool.connect();
    try {
      let query = `
        SELECT * FROM users 
        WHERE skills IS NOT NULL 
        AND jsonb_array_length(skills) > 0
      `;
      
      const params = [];
      
      if (excludeUserId) {
        query += ` AND id != $1`;
        params.push(excludeUserId);
      }
      
      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
      params.push(limit);
      
      const result = await client.query(query, params);
      
      return result.rows.map(user => new User({
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        bio: user.bio,
        skills: user.skills,
        socialLinks: user.social_links,
        profileImage: user.profile_image,
        isAdmin: user.is_admin,
        isVerified: user.is_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }));
    } finally {
      client.release();
    }
  }
}

export default UserRepository;