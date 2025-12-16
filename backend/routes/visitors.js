const express = require('express');
const db = require('../config/db');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Helper to get visitor record (ID 1)
const getVisitorRecord = async () => {
  const rows = await db.query('SELECT * FROM visitors WHERE id = 1');
  if (rows.length === 0) {
    // Create default record if not exists
    await db.query('INSERT INTO visitors (id) VALUES (1)');
    const newRows = await db.query('SELECT * FROM visitors WHERE id = 1');
    return newRows[0];
  }
  return rows[0];
};

// @desc    Update visitor counter
// @route   POST /api/visitors/update
// @access  Public
router.post('/update', async (req, res) => {
  try {
    const { page } = req.body;
    
    if (!page) {
      return res.status(400).json({
        success: false,
        message: 'Page parameter is required'
      });
    }

    // Map page names to column names
    const pageMap = {
      'home': 'homePageCounter',
      'features': 'featurePageCounter',
      'blog': 'blogPageCounter',
      'resume': 'resumePageCounter',
      'contact': 'contactPageCounter'
    };

    const column = pageMap[page.toLowerCase()];
    
    if (column) {
      await db.query(`UPDATE visitors SET counter = counter + 1, ${column} = ${column} + 1 WHERE id = 1`);
    } else {
      await db.query('UPDATE visitors SET counter = counter + 1 WHERE id = 1');
    }

    const visitor = await getVisitorRecord();

    res.status(200).json({
      success: true,
      message: 'Visitor counter updated successfully',
      data: {
        counter: visitor.counter,
        homePageCounter: visitor.homePageCounter,
        featurePageCounter: visitor.featurePageCounter,
        blogPageCounter: visitor.blogPageCounter,
        resumePageCounter: visitor.resumePageCounter,
        contactPageCounter: visitor.contactPageCounter
      }
    });
  } catch (error) {
    console.error('Update visitor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating visitor counter'
    });
  }
});

// @desc    Get visitor statistics
// @route   GET /api/visitors/stats
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const visitor = await getVisitorRecord();
    
    // Fetch related data
    const deviceRows = await db.query('SELECT * FROM visitor_device_types WHERE visitor_id = 1');
    const browserRows = await db.query('SELECT * FROM visitor_browsers WHERE visitor_id = 1');
    
    const deviceTypes = deviceRows.reduce((acc, row) => {
      acc[row.device_type] = row.count;
      return acc;
    }, { desktop: 0, mobile: 0, tablet: 0 });

    const browsers = browserRows.reduce((acc, row) => {
      acc[row.browser] = row.count;
      return acc;
    }, { chrome: 0, firefox: 0, safari: 0, edge: 0, other: 0 });

    res.status(200).json({
      success: true,
      data: {
        counter: visitor.counter,
        homePageCounter: visitor.homePageCounter,
        featurePageCounter: visitor.featurePageCounter,
        blogPageCounter: visitor.blogPageCounter,
        resumePageCounter: visitor.resumePageCounter,
        contactPageCounter: visitor.contactPageCounter,
        uniqueVisitors: visitor.uniqueVisitors,
        lastVisitDate: visitor.lastVisitDate,
        deviceTypes,
        browsers
      }
    });
  } catch (error) {
    console.error('Get visitor stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching visitor statistics'
    });
  }
});

// @desc    Get detailed visitor analytics (Admin only)
// @route   GET /api/visitors/analytics
// @access  Private (Admin only)
router.get('/analytics', protect, isAdmin, async (req, res) => {
  try {
    const visitor = await getVisitorRecord();
    
    // Fetch related data
    const deviceRows = await db.query('SELECT * FROM visitor_device_types WHERE visitor_id = 1');
    const browserRows = await db.query('SELECT * FROM visitor_browsers WHERE visitor_id = 1');
    const countryRows = await db.query('SELECT * FROM visitor_countries WHERE visitor_id = 1');

    const deviceTypes = deviceRows.reduce((acc, row) => {
      acc[row.device_type] = row.count;
      return acc;
    }, { desktop: 0, mobile: 0, tablet: 0 });

    const browsers = browserRows.reduce((acc, row) => {
      acc[row.browser] = row.count;
      return acc;
    }, { chrome: 0, firefox: 0, safari: 0, edge: 0, other: 0 });

    const countries = countryRows.map(row => ({
      country: row.country,
      count: row.count
    }));

    // Calculate additional analytics
    const totalPageViews = visitor.homePageCounter + 
                          visitor.featurePageCounter + 
                          visitor.blogPageCounter + 
                          visitor.resumePageCounter + 
                          visitor.contactPageCounter;

    const pageViewsData = [
      { page: 'Home', views: visitor.homePageCounter },
      { page: 'Features', views: visitor.featurePageCounter },
      { page: 'Blog', views: visitor.blogPageCounter },
      { page: 'Resume', views: visitor.resumePageCounter },
      { page: 'Contact', views: visitor.contactPageCounter }
    ];

    const deviceData = [
      { device: 'Desktop', count: deviceTypes.desktop },
      { device: 'Mobile', count: deviceTypes.mobile },
      { device: 'Tablet', count: deviceTypes.tablet }
    ];

    const browserData = [
      { browser: 'Chrome', count: browsers.chrome },
      { browser: 'Firefox', count: browsers.firefox },
      { browser: 'Safari', count: browsers.safari },
      { browser: 'Edge', count: browsers.edge },
      { browser: 'Other', count: browsers.other }
    ];

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalVisitors: visitor.counter,
          uniqueVisitors: visitor.uniqueVisitors,
          totalPageViews,
          lastVisitDate: visitor.lastVisitDate
        },
        pageViews: pageViewsData,
        deviceTypes: deviceData,
        browsers: browserData,
        countries: countries
      }
    });
  } catch (error) {
    console.error('Get visitor analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching visitor analytics'
    });
  }
});

// @desc    Update device and browser analytics
// @route   POST /api/visitors/device-info
// @access  Public
router.post('/device-info', async (req, res) => {
  try {
    const { deviceType, browser } = req.body;
    
    // Update device type
    if (deviceType) {
      await db.query(
        'INSERT INTO visitor_device_types (visitor_id, device_type, count) VALUES (1, ?, 1) ON DUPLICATE KEY UPDATE count = count + 1',
        [deviceType.toLowerCase()]
      );
    }
    
    // Update browser
    if (browser) {
      await db.query(
        'INSERT INTO visitor_browsers (visitor_id, browser, count) VALUES (1, ?, 1) ON DUPLICATE KEY UPDATE count = count + 1',
        [browser.toLowerCase()]
      );
    }

    res.status(200).json({
      success: true,
      message: 'Device information updated successfully'
    });
  } catch (error) {
    console.error('Update device info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating device information'
    });
  }
});

// @desc    Reset visitor counters (Admin only)
// @route   POST /api/visitors/reset
// @access  Private (Admin only)
router.post('/reset', protect, isAdmin, async (req, res) => {
  try {
    // Reset main counters
    await db.query(`
      UPDATE visitors SET 
        counter = 0, 
        homePageCounter = 0, 
        featurePageCounter = 0, 
        blogPageCounter = 0, 
        resumePageCounter = 0, 
        contactPageCounter = 0, 
        uniqueVisitors = 0 
      WHERE id = 1
    `);
    
    // Reset device and browser data
    await db.query('UPDATE visitor_device_types SET count = 0 WHERE visitor_id = 1');
    await db.query('UPDATE visitor_browsers SET count = 0 WHERE visitor_id = 1');
    await db.query('UPDATE visitor_countries SET count = 0 WHERE visitor_id = 1');

    res.status(200).json({
      success: true,
      message: 'Visitor counters reset successfully'
    });
  } catch (error) {
    console.error('Reset visitor counters error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resetting visitor counters'
    });
  }
});

module.exports = router;
