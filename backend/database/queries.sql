-- =====================================================
-- Portfolio CMS - Common SQL Queries Reference
-- =====================================================
-- Useful queries for database management and debugging
-- =====================================================

USE portfolio_cms;

-- =====================================================
-- USER QUERIES
-- =====================================================

-- Get all users
SELECT id, name, email, isAdmin, isVerified, createdAt FROM users;

-- Get admin users
SELECT * FROM users WHERE isAdmin = TRUE;

-- Get unverified users
SELECT * FROM users WHERE isVerified = FALSE;

-- Count total users
SELECT COUNT(*) as total_users FROM users;

-- Get user by email
SELECT * FROM users WHERE email = 'admin@portfolio.com';

-- Update user password (use bcrypt hash in application)
-- UPDATE users SET password = 'hashed_password_here' WHERE id = 1;

-- =====================================================
-- BLOG QUERIES
-- =====================================================

-- Get all published blogs
SELECT * FROM blogs WHERE isPublished = TRUE ORDER BY createdAt DESC;

-- Get blogs by category
SELECT * FROM blogs WHERE category = 'React' ORDER BY createdAt DESC;

-- Get most viewed blogs
SELECT id, title, views, likes, createdAt FROM blogs 
ORDER BY views DESC LIMIT 10;

-- Get most liked blogs
SELECT id, title, views, likes, createdAt FROM blogs 
ORDER BY likes DESC LIMIT 10;

-- Get blogs with tags
SELECT 
    b.id,
    b.title,
    b.category,
    b.views,
    b.likes,
    GROUP_CONCAT(bt.tag SEPARATOR ', ') as tags
FROM blogs b
LEFT JOIN blog_tags bt ON b.id = bt.blog_id
GROUP BY b.id
ORDER BY b.createdAt DESC;

-- Search blogs (full-text search)
SELECT * FROM blogs 
WHERE MATCH(title, content, category) AGAINST('react hooks' IN NATURAL LANGUAGE MODE)
ORDER BY createdAt DESC;

-- Get blog by slug
SELECT * FROM blogs WHERE slug = 'getting-started-with-react-hooks';

-- Count blogs by category
SELECT category, COUNT(*) as count 
FROM blogs 
WHERE isPublished = TRUE
GROUP BY category 
ORDER BY count DESC;

-- Get recent blogs (last 7 days)
SELECT * FROM blogs 
WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY createdAt DESC;

-- =====================================================
-- VISITOR QUERIES
-- =====================================================

-- Get visitor statistics
SELECT * FROM visitor_statistics;

-- Get total visits
SELECT 
    counter as total_visits,
    uniqueVisitors,
    homePageCounter,
    blogPageCounter,
    resumePageCounter,
    contactPageCounter,
    lastVisitDate
FROM visitors;

-- Get device type breakdown
SELECT device_type, SUM(count) as total 
FROM visitor_device_types 
GROUP BY device_type 
ORDER BY total DESC;

-- Get browser breakdown
SELECT browser, SUM(count) as total 
FROM visitor_browsers 
GROUP BY browser 
ORDER BY total DESC;

-- Get country breakdown
SELECT country, SUM(count) as total 
FROM visitor_countries 
GROUP BY country 
ORDER BY total DESC 
LIMIT 10;

-- Get page popularity
SELECT 
    'Home' as page,
    homePageCounter as visits
FROM visitors
UNION ALL
SELECT 
    'Features' as page,
    featurePageCounter as visits
FROM visitors
UNION ALL
SELECT 
    'Blog' as page,
    blogPageCounter as visits
FROM visitors
UNION ALL
SELECT 
    'Resume' as page,
    resumePageCounter as visits
FROM visitors
UNION ALL
SELECT 
    'Contact' as page,
    contactPageCounter as visits
FROM visitors
ORDER BY visits DESC;

-- =====================================================
-- CONTACT QUERIES
-- =====================================================

-- Get all contact messages
SELECT * FROM contacts ORDER BY createdAt DESC;

-- Get unread messages
SELECT * FROM contacts WHERE isRead = FALSE ORDER BY createdAt DESC;

-- Get unreplied messages
SELECT * FROM contacts WHERE isReplied = FALSE ORDER BY createdAt DESC;

-- Get messages by email
SELECT * FROM contacts WHERE email = 'user@example.com' ORDER BY createdAt DESC;

-- Count messages by status
SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN isRead = TRUE THEN 1 ELSE 0 END) as read_count,
    SUM(CASE WHEN isReplied = TRUE THEN 1 ELSE 0 END) as replied_count
FROM contacts;

-- Get recent messages (last 24 hours)
SELECT * FROM contacts 
WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
ORDER BY createdAt DESC;

-- =====================================================
-- ANALYTICS QUERIES
-- =====================================================

-- Get blog performance summary
SELECT 
    COUNT(*) as total_blogs,
    SUM(views) as total_views,
    SUM(likes) as total_likes,
    AVG(views) as avg_views,
    AVG(likes) as avg_likes
FROM blogs
WHERE isPublished = TRUE;

-- Get monthly blog statistics
SELECT 
    DATE_FORMAT(createdAt, '%Y-%m') as month,
    COUNT(*) as blogs_published,
    SUM(views) as total_views
FROM blogs
WHERE isPublished = TRUE
GROUP BY month
ORDER BY month DESC
LIMIT 12;

-- Get top categories
SELECT 
    category,
    COUNT(*) as blog_count,
    SUM(views) as total_views,
    SUM(likes) as total_likes
FROM blogs
WHERE isPublished = TRUE
GROUP BY category
ORDER BY total_views DESC;

-- Get user engagement (if you add user tracking)
-- This is a placeholder for future implementation
-- SELECT 
--     DATE(createdAt) as date,
--     COUNT(DISTINCT user_id) as unique_users,
--     COUNT(*) as total_actions
-- FROM user_activities
-- GROUP BY date
-- ORDER BY date DESC;

-- =====================================================
-- MAINTENANCE QUERIES
-- =====================================================

-- Reset visitor counters (use with caution!)
-- UPDATE visitors SET 
--     counter = 0,
--     homePageCounter = 0,
--     featurePageCounter = 0,
--     blogPageCounter = 0,
--     resumePageCounter = 0,
--     contactPageCounter = 0,
--     uniqueVisitors = 0;

-- Delete old contact messages (older than 1 year)
-- DELETE FROM contacts 
-- WHERE createdAt < DATE_SUB(NOW(), INTERVAL 1 YEAR) 
-- AND isReplied = TRUE;

-- Optimize tables (run periodically)
-- OPTIMIZE TABLE users, blogs, blog_tags, contacts, visitors;

-- Check table sizes
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES
WHERE table_schema = 'portfolio_cms'
ORDER BY size_mb DESC;

-- =====================================================
-- BACKUP QUERIES
-- =====================================================

-- Export users (for backup)
-- SELECT * FROM users INTO OUTFILE '/tmp/users_backup.csv'
-- FIELDS TERMINATED BY ',' ENCLOSED BY '"'
-- LINES TERMINATED BY '\n';

-- Export blogs (for backup)
-- SELECT * FROM blogs INTO OUTFILE '/tmp/blogs_backup.csv'
-- FIELDS TERMINATED BY ',' ENCLOSED BY '"'
-- LINES TERMINATED BY '\n';

-- =====================================================
-- DEBUGGING QUERIES
-- =====================================================

-- Check for duplicate emails
SELECT email, COUNT(*) as count 
FROM users 
GROUP BY email 
HAVING count > 1;

-- Check for duplicate slugs
SELECT slug, COUNT(*) as count 
FROM blogs 
GROUP BY slug 
HAVING count > 1;

-- Check for blogs without tags
SELECT b.id, b.title 
FROM blogs b
LEFT JOIN blog_tags bt ON b.id = bt.blog_id
WHERE bt.id IS NULL;

-- Check for invalid LinkedIn URLs
SELECT id, title, author_linkdin 
FROM blogs 
WHERE author_linkdin NOT REGEXP '^https?://(www\.)?linkedin\.com/in/';

-- Get table row counts
SELECT 
    'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'blogs', COUNT(*) FROM blogs
UNION ALL
SELECT 'blog_tags', COUNT(*) FROM blog_tags
UNION ALL
SELECT 'contacts', COUNT(*) FROM contacts
UNION ALL
SELECT 'visitors', COUNT(*) FROM visitors;

-- =====================================================
-- END OF QUERIES
-- =====================================================

