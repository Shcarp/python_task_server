export const userSql = `CREATE TABLE IF NOT EXISTS user (
    id int(11) NOT NULL AUTO_INCREMENT,
    username varchar(50) NOT NULL,
    password varchar(50) NOT NULL,
    email varchar(100) NOT NULL,
    profile_picture varchar(100) DEFAULT NULL,
    last_active datetime DEFAULT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_username (username),
    UNIQUE KEY uk_email (email)
  ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`;


export const platformSql = `CREATE TABLE IF NOT EXISTS platforms (
    id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_name (name)
  ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`;

/**
 * CREATE TABLE IF NOT EXISTS scripts (
    scriptId INT PRIMARY KEY AUTO_INCREMENT, // 主键
    scriptUid VARCHAR(50) NOT NULL, // 脚本唯一标识
    scriptVersion VARCHAR(50) NOT NULL, // 脚本版本
    scriptName VARCHAR(255) NOT NULL, // 脚本名称
    scriptKey VARCHAR(255) NOT NULL, // 脚本关键字
    scriptDescription VARCHAR(255) NOT NULL, // 脚本描述
    scriptDetailedDescription TEXT, // 脚本详细描述
    scriptConfigText TEXT, // 脚本配置
    scriptPlatformId INT, // 脚本所属平台
    scriptVisibility TINYINT NOT NULL DEFAULT 0, // 脚本可见性
    created_at DATETIME NOT NULL, // 创建时间
    updated_at DATETIME NOT NULL, // 更新时间
    FOREIGN KEY (scriptPlatformId) REFERENCES platforms (platformId)
    INDEX idx_scriptUid (scriptUid),
    INDEX idx_scriptVersion (scriptVersion),
    INDEX idx_scriptName (scriptName),
    INDEX idx_scriptPlatformId (scriptPlatformId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
 */
export const scriptSql = `
    CREATE TABLE IF NOT EXISTS scripts (
      scriptId INT PRIMARY KEY AUTO_INCREMENT,
      scriptUid VARCHAR(50) NOT NULL,
      scriptVersion VARCHAR(50) NOT NULL,
      scriptName VARCHAR(255) NOT NULL,
      scriptKey VARCHAR(255) NOT NULL,
      scriptDescription VARCHAR(255) NOT NULL,
      scriptDetailedDescription TEXT,
      scriptConfigText TEXT,
      scriptPlatformId INT,
      scriptVisibility TINYINT NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL,
      updated_at DATETIME NOT NULL,
      FOREIGN KEY (scriptPlatformId) REFERENCES platforms (id),
      UNIQUE KEY idx_scriptUid (scriptUid),
      UNIQUE KEY idx_scriptVersion (scriptVersion),
      UNIQUE KEY idx_scriptName (scriptName),
      UNIQUE KEY idx_scriptPlatformId (scriptPlatformId)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`;

/**
 * CREATE TABLE IF NOT EXISTS script_stats (
    scriptId INT PRIMARY KEY,
    likes INT NOT NULL DEFAULT 0,
    favorites INT NOT NULL DEFAULT 0,
    FOREIGN KEY (scriptId) REFERENCES scripts (scriptId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
 */

export const scriptStatSql = `
    CREATE TABLE IF NOT EXISTS script_stats (
      scriptId INT PRIMARY KEY,
      likes INT NOT NULL DEFAULT 0,
      favorites INT NOT NULL DEFAULT 0,
      FOREIGN KEY (scriptId) REFERENCES scripts (scriptId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`;


export const userScriptSql = `CREATE TABLE IF NOT EXISTS user_scripts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  scriptId INT NOT NULL,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES user (id),
  FOREIGN KEY (scriptId) REFERENCES scripts (scriptId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`;

/**
 * CREATE TABLE IF NOT EXISTS user_favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    scriptId INT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES users (id),
    FOREIGN KEY (scriptId) REFERENCES scripts (scriptId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
 */
export const userFavoriteSql = `
    CREATE TABLE IF NOT EXISTS user_favorites (
      id INT PRIMARY KEY AUTO_INCREMENT,
      userId INT NOT NULL,
      scriptId INT NOT NULL,
      created_at DATETIME NOT NULL,
      FOREIGN KEY (userId) REFERENCES user (id),
      FOREIGN KEY (scriptId) REFERENCES scripts (scriptId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`;


