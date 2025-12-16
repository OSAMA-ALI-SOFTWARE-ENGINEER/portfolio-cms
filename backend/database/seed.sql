-- =====================================================
-- Portfolio CMS MySQL Database Seed Data
-- =====================================================
-- This file contains sample data for testing and development
-- Run this after schema.sql to populate the database with sample data
-- =====================================================

USE portfolio_cms;

-- =====================================================
-- Sample Users
-- =====================================================
-- Note: Passwords are hashed with bcrypt (12 rounds)
-- Default password for all sample users: "password123"
-- In production, change these passwords immediately!

INSERT INTO users (name, email, password, isAdmin, isVerified, avatar) VALUES
('Osama Admin', 'admin@portfolio.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJqKqKqKq', TRUE, TRUE, 'https://ui-avatars.com/api/?name=Osama+Admin'),
('John Doe', 'john@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJqKqKqKq', FALSE, TRUE, 'https://ui-avatars.com/api/?name=John+Doe'),
('Jane Smith', 'jane@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJqKqKqKq', FALSE, FALSE, NULL)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- =====================================================
-- Sample Blogs
-- =====================================================
INSERT INTO blogs (title, content, category, author, authorImage, author_linkdin, linkdin_followers, blogImage, slug, views, likes, isPublished, readTime) VALUES
(
    'Getting Started with React Hooks',
    '<h1>Introduction to React Hooks</h1><p>React Hooks are a powerful feature that allows you to use state and other React features in functional components. In this comprehensive guide, we will explore the most commonly used hooks and how to implement them in your projects.</p><h2>What are Hooks?</h2><p>Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 and have revolutionized how we write React applications.</p><h2>useState Hook</h2><p>The useState hook allows you to add state to functional components. It returns a pair: the current state value and a function to update it.</p>',
    'React',
    'Osama',
    'https://ui-avatars.com/api/?name=Osama',
    'https://www.linkedin.com/in/osama',
    5000,
    'https://placehold.co/800x400?text=React+Hooks',
    'getting-started-with-react-hooks',
    150,
    25,
    TRUE,
    5
),
(
    'Mastering Node.js and Express',
    '<h1>Building RESTful APIs with Node.js</h1><p>Node.js has become the go-to runtime for building scalable backend applications. Combined with Express.js, it provides a powerful framework for creating RESTful APIs.</p><h2>Why Node.js?</h2><p>Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications.</p><h2>Express.js Basics</h2><p>Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.</p>',
    'Backend',
    'Osama',
    'https://ui-avatars.com/api/?name=Osama',
    'https://www.linkedin.com/in/osama',
    5000,
    'https://placehold.co/800x400?text=Node.js',
    'mastering-nodejs-and-express',
    200,
    40,
    TRUE,
    8
),
(
    'CSS Grid vs Flexbox: When to Use What',
    '<h1>Understanding CSS Layout Systems</h1><p>CSS Grid and Flexbox are two powerful layout systems in CSS, each with its own strengths and use cases. Understanding when to use each is crucial for modern web development.</p><h2>CSS Grid</h2><p>CSS Grid is a two-dimensional layout system, meaning it can handle both columns and rows. It is perfect for complex layouts and page structures.</p><h2>Flexbox</h2><p>Flexbox is a one-dimensional layout method for laying out items in rows or columns. It is ideal for component-level layouts and aligning items.</p>',
    'CSS',
    'Osama',
    'https://ui-avatars.com/api/?name=Osama',
    'https://www.linkedin.com/in/osama',
    5000,
    'https://placehold.co/800x400?text=CSS+Grid',
    'css-grid-vs-flexbox-when-to-use-what',
    120,
    18,
    TRUE,
    6
),
(
    'Introduction to TypeScript',
    '<h1>TypeScript: JavaScript with Types</h1><p>TypeScript is a superset of JavaScript that adds static type definitions. It helps catch errors early and makes code more maintainable.</p><h2>Why TypeScript?</h2><p>TypeScript provides better tooling, improved code quality, and enhanced developer experience through type checking and IntelliSense.</p><h2>Getting Started</h2><p>In this tutorial, we will cover the basics of TypeScript, including types, interfaces, and how to set up a TypeScript project.</p>',
    'TypeScript',
    'Osama',
    'https://ui-avatars.com/api/?name=Osama',
    'https://www.linkedin.com/in/osama',
    5000,
    'https://placehold.co/800x400?text=TypeScript',
    'introduction-to-typescript',
    95,
    15,
    TRUE,
    4
),
(
    'Docker for Developers',
    '<h1>Containerizing Your Applications</h1><p>Docker has revolutionized how we deploy and manage applications. Learn how to containerize your applications for better portability and scalability.</p><h2>What is Docker?</h2><p>Docker is a platform for developing, shipping, and running applications using containerization technology.</p><h2>Benefits</h2><p>Docker provides consistency across environments, isolation, and scalability, making it essential for modern development workflows.</p>',
    'DevOps',
    'Osama',
    'https://ui-avatars.com/api/?name=Osama',
    'https://www.linkedin.com/in/osama',
    5000,
    'https://placehold.co/800x400?text=Docker',
    'docker-for-developers',
    80,
    12,
    FALSE,
    7
)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- =====================================================
-- Sample Blog Tags
-- =====================================================
INSERT INTO blog_tags (blog_id, tag) VALUES
(1, 'react'),
(1, 'hooks'),
(1, 'javascript'),
(1, 'frontend'),
(2, 'nodejs'),
(2, 'express'),
(2, 'backend'),
(2, 'api'),
(3, 'css'),
(3, 'grid'),
(3, 'flexbox'),
(3, 'layout'),
(4, 'typescript'),
(4, 'javascript'),
(4, 'programming'),
(5, 'docker'),
(5, 'devops'),
(5, 'containers'),
(5, 'deployment')
ON DUPLICATE KEY UPDATE tag=VALUES(tag);

-- =====================================================
-- Sample Contacts
-- =====================================================
INSERT INTO contacts (name, email, phoneNumber, message, isRead, isReplied, ipAddress, userAgent) VALUES
(
    'Alice Johnson',
    'alice@example.com',
    '+1234567890',
    'I really enjoyed reading your blog posts about React. Could you write more about advanced patterns?',
    TRUE,
    TRUE,
    '192.168.1.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
),
(
    'Bob Williams',
    'bob@example.com',
    '+1234567891',
    'Your portfolio is amazing! I would like to discuss a potential collaboration.',
    TRUE,
    FALSE,
    '192.168.1.2',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
),
(
    'Charlie Brown',
    'charlie@example.com',
    '+1234567892',
    'Great work on the Node.js tutorial. It helped me a lot!',
    FALSE,
    FALSE,
    '192.168.1.3',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
),
(
    'Diana Prince',
    'diana@example.com',
    '+1234567893',
    'I am interested in learning more about your services. Can we schedule a call?',
    FALSE,
    FALSE,
    '192.168.1.4',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- =====================================================
-- Sample Visitor Data
-- =====================================================
-- Update the default visitor record with sample data
UPDATE visitors SET
    counter = 1250,
    homePageCounter = 450,
    featurePageCounter = 200,
    blogPageCounter = 350,
    resumePageCounter = 150,
    contactPageCounter = 100,
    uniqueVisitors = 800,
    lastVisitDate = NOW()
WHERE id = 1;

-- Sample Device Types
INSERT INTO visitor_device_types (visitor_id, device_type, count) VALUES
(1, 'desktop', 750),
(1, 'mobile', 400),
(1, 'tablet', 100)
ON DUPLICATE KEY UPDATE count=VALUES(count);

-- Sample Browsers
INSERT INTO visitor_browsers (visitor_id, browser, count) VALUES
(1, 'chrome', 800),
(1, 'firefox', 200),
(1, 'safari', 150),
(1, 'edge', 80),
(1, 'other', 20)
ON DUPLICATE KEY UPDATE count=VALUES(count);

-- Sample Countries
INSERT INTO visitor_countries (visitor_id, country, count) VALUES
(1, 'United States', 500),
(1, 'United Kingdom', 200),
(1, 'Canada', 150),
(1, 'Germany', 100),
(1, 'France', 80),
(1, 'India', 120),
(1, 'Australia', 100)
ON DUPLICATE KEY UPDATE count=VALUES(count);

-- =====================================================
-- End of Seed Data
-- =====================================================

