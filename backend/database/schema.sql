-- =====================================================
-- Portfolio CMS MySQL Database Schema
-- =====================================================
-- This file creates the complete database structure
-- for the Portfolio CMS application
-- =====================================================

-- Create database (uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS portfolio_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE portfolio_cms;

-- =====================================================
-- Table: users
-- Description: User authentication and profile data
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(500) DEFAULT NULL,
    isAdmin BOOLEAN DEFAULT FALSE,
    isVerified BOOLEAN DEFAULT FALSE,
    resetPasswordToken VARCHAR(255) DEFAULT NULL,
    resetPasswordExpire DATETIME DEFAULT NULL,
    verificationToken VARCHAR(255) DEFAULT NULL,
    verificationExpire DATETIME DEFAULT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_email (email),
    INDEX idx_isAdmin (isAdmin),
    INDEX idx_isVerified (isVerified),
    INDEX idx_resetPasswordToken (resetPasswordToken),
    INDEX idx_verificationToken (verificationToken)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: blogs
-- Description: Blog posts with rich content
-- =====================================================
CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content LONGTEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    author VARCHAR(100) NOT NULL,
    authorImage VARCHAR(500) DEFAULT NULL,
    author_linkdin VARCHAR(255) NOT NULL,
    linkdin_followers INT NOT NULL DEFAULT 0,
    blogImage VARCHAR(500) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    isPublished BOOLEAN DEFAULT TRUE,
    readTime INT DEFAULT 5 COMMENT 'Reading time in minutes',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_slug (slug),
    INDEX idx_category (category),
    INDEX idx_isPublished (isPublished),
    INDEX idx_createdAt (createdAt DESC),
    INDEX idx_views (views DESC),
    INDEX idx_likes (likes DESC),
    FULLTEXT INDEX idx_search (title, content, category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: blog_tags
-- Description: Tags for blog posts (many-to-many relationship)
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blog_id INT NOT NULL,
    tag VARCHAR(50) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key
    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_blog_id (blog_id),
    INDEX idx_tag (tag),
    UNIQUE KEY unique_blog_tag (blog_id, tag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: visitors
-- Description: Website analytics and visitor tracking
-- =====================================================
CREATE TABLE IF NOT EXISTS visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    counter INT DEFAULT 0,
    homePageCounter INT DEFAULT 0,
    featurePageCounter INT DEFAULT 0,
    blogPageCounter INT DEFAULT 0,
    resumePageCounter INT DEFAULT 0,
    contactPageCounter INT DEFAULT 0,
    uniqueVisitors INT DEFAULT 0,
    lastVisitDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CHECK (counter >= 0),
    CHECK (homePageCounter >= 0),
    CHECK (featurePageCounter >= 0),
    CHECK (blogPageCounter >= 0),
    CHECK (resumePageCounter >= 0),
    CHECK (contactPageCounter >= 0),
    CHECK (uniqueVisitors >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: visitor_device_types
-- Description: Device type analytics
-- =====================================================
CREATE TABLE IF NOT EXISTS visitor_device_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_id INT NOT NULL,
    device_type ENUM('desktop', 'mobile', 'tablet') NOT NULL,
    count INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key
    FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_visitor_id (visitor_id),
    INDEX idx_device_type (device_type),
    UNIQUE KEY unique_visitor_device (visitor_id, device_type),
    
    -- Constraints
    CHECK (count >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: visitor_browsers
-- Description: Browser analytics
-- =====================================================
CREATE TABLE IF NOT EXISTS visitor_browsers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_id INT NOT NULL,
    browser ENUM('chrome', 'firefox', 'safari', 'edge', 'other') NOT NULL,
    count INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key
    FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_visitor_id (visitor_id),
    INDEX idx_browser (browser),
    UNIQUE KEY unique_visitor_browser (visitor_id, browser),
    
    -- Constraints
    CHECK (count >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: visitor_countries
-- Description: Geographic visitor analytics
-- =====================================================
CREATE TABLE IF NOT EXISTS visitor_countries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_id INT NOT NULL,
    country VARCHAR(100) NOT NULL,
    count INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key
    FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_visitor_id (visitor_id),
    INDEX idx_country (country),
    UNIQUE KEY unique_visitor_country (visitor_id, country),
    
    -- Constraints
    CHECK (count >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: contacts
-- Description: Contact form submissions
-- =====================================================
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,
    isReplied BOOLEAN DEFAULT FALSE,
    replyMessage TEXT DEFAULT NULL,
    repliedAt DATETIME DEFAULT NULL,
    ipAddress VARCHAR(45) DEFAULT NULL COMMENT 'Supports IPv6',
    userAgent VARCHAR(500) DEFAULT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_email (email),
    INDEX idx_isRead (isRead),
    INDEX idx_isReplied (isReplied),
    INDEX idx_createdAt (createdAt DESC),
    INDEX idx_ipAddress (ipAddress)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Insert default visitor record
-- =====================================================
INSERT INTO visitors (counter, homePageCounter, featurePageCounter, blogPageCounter, resumePageCounter, contactPageCounter, uniqueVisitors)
VALUES (0, 0, 0, 0, 0, 0, 0)
ON DUPLICATE KEY UPDATE id=id;

-- =====================================================
-- Create Views for easier querying
-- =====================================================

-- View: blog_summary
CREATE OR REPLACE VIEW blog_summary AS
SELECT 
    b.id,
    b.title,
    b.slug,
    b.category,
    b.author,
    b.views,
    b.likes,
    b.isPublished,
    b.readTime,
    b.createdAt,
    COUNT(DISTINCT bt.id) as tagCount
FROM blogs b
LEFT JOIN blog_tags bt ON b.id = bt.blog_id
GROUP BY b.id;

-- View: visitor_statistics
CREATE OR REPLACE VIEW visitor_statistics AS
SELECT 
    v.id,
    v.counter as totalVisits,
    v.homePageCounter,
    v.featurePageCounter,
    v.blogPageCounter,
    v.resumePageCounter,
    v.contactPageCounter,
    v.uniqueVisitors,
    v.lastVisitDate,
    COALESCE(SUM(vdt.count), 0) as totalDeviceVisits,
    COALESCE(SUM(vb.count), 0) as totalBrowserVisits
FROM visitors v
LEFT JOIN visitor_device_types vdt ON v.id = vdt.visitor_id
LEFT JOIN visitor_browsers vb ON v.id = vb.visitor_id
GROUP BY v.id;

-- =====================================================
-- Stored Procedures
-- =====================================================

-- Procedure: Update visitor counter
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS UpdateVisitorCounter(
    IN page_path VARCHAR(50)
)
BEGIN
    DECLARE visitor_id INT;
    
    -- Get or create visitor record
    SELECT id INTO visitor_id FROM visitors LIMIT 1;
    
    IF visitor_id IS NULL THEN
        INSERT INTO visitors (counter, homePageCounter, featurePageCounter, blogPageCounter, resumePageCounter, contactPageCounter, uniqueVisitors)
        VALUES (0, 0, 0, 0, 0, 0, 0);
        SET visitor_id = LAST_INSERT_ID();
    END IF;
    
    -- Update counters based on page
    UPDATE visitors 
    SET 
        counter = counter + 1,
        lastVisitDate = CURRENT_TIMESTAMP,
        homePageCounter = CASE WHEN page_path = '/' THEN homePageCounter + 1 ELSE homePageCounter END,
        featurePageCounter = CASE WHEN page_path = '/features' THEN featurePageCounter + 1 ELSE featurePageCounter END,
        blogPageCounter = CASE WHEN page_path = '/blog' THEN blogPageCounter + 1 ELSE blogPageCounter END,
        resumePageCounter = CASE WHEN page_path = '/resume' THEN resumePageCounter + 1 ELSE resumePageCounter END,
        contactPageCounter = CASE WHEN page_path = '/contacts' THEN contactPageCounter + 1 ELSE contactPageCounter END
    WHERE id = visitor_id;
END //
DELIMITER ;

-- Procedure: Get blog with tags
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS GetBlogWithTags(
    IN blog_id INT
)
BEGIN
    SELECT 
        b.*,
        GROUP_CONCAT(bt.tag ORDER BY bt.tag SEPARATOR ',') as tags
    FROM blogs b
    LEFT JOIN blog_tags bt ON b.id = bt.blog_id
    WHERE b.id = blog_id
    GROUP BY b.id;
END //
DELIMITER ;

-- =====================================================
-- Triggers
-- =====================================================

-- Trigger: Auto-generate slug from title
DELIMITER //
CREATE TRIGGER IF NOT EXISTS generate_blog_slug
BEFORE INSERT ON blogs
FOR EACH ROW
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        SET NEW.slug = LOWER(REPLACE(REPLACE(REPLACE(NEW.title, ' ', '-'), '.', ''), ',', ''));
        SET NEW.slug = SUBSTRING(NEW.slug, 1, 50);
    END IF;
END //
DELIMITER ;

-- Trigger: Calculate read time
DELIMITER //
CREATE TRIGGER IF NOT EXISTS calculate_read_time
BEFORE INSERT ON blogs
FOR EACH ROW
BEGIN
    DECLARE word_count INT;
    DECLARE words_per_minute INT DEFAULT 200;
    
    -- Remove HTML tags and count words
    SET word_count = (LENGTH(NEW.content) - LENGTH(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(NEW.content, '<', ''), '>', ''), ' ', ''), CHAR(10), ''), CHAR(13), ''), '')) / 5);
    
    SET NEW.readTime = CEIL(word_count / words_per_minute);
    
    IF NEW.readTime < 1 THEN
        SET NEW.readTime = 1;
    END IF;
END //
DELIMITER ;

-- =====================================================
-- End of Schema
-- =====================================================

