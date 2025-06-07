import express from 'express';
import session from 'express-session';
import { storage } from './storage';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration for admin API
app.use(session({
  secret: process.env.SESSION_SECRET || 'admin-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Admin credentials
const ADMIN_USERNAME = 'usahome_admin';
const ADMIN_PASSWORD = 'Admin2025!USA';

// Authentication middleware
const requireAdminAuth = (req: any, res: any, next: any) => {
  if (!req.session?.isAdminAuthenticated) {
    return res.status(401).json({ message: 'Admin authentication required' });
  }
  next();
};

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAdminAuthenticated = true;
    req.session.adminUsername = username;
    res.json({ 
      message: 'Admin login successful',
      username: username
    });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
});

// Admin logout endpoint
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy((err: any) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Admin logout successful' });
  });
});

// Check admin auth status
app.get('/api/admin/status', (req, res) => {
  if (req.session?.isAdminAuthenticated) {
    res.json({ 
      authenticated: true,
      username: req.session.adminUsername
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Admin dashboard stats
app.get('/api/admin/stats', requireAdminAuth, async (req, res) => {
  try {
    const professionals = await storage.getAllProfessionals();
    const totalUsers = professionals.length;
    const activeProfessionals = professionals.filter(p => p.isActive).length;
    const totalRevenue = professionals.reduce((sum, p) => {
      return sum + parseFloat(p.totalMonthlyFee || '0');
    }, 0);

    res.json({
      totalUsers,
      totalProfessionals: totalUsers,
      activeProfessionals,
      totalRevenue: totalRevenue.toFixed(2),
      monthlyRevenue: totalRevenue.toFixed(2)
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Get all professionals
app.get('/api/admin/professionals', requireAdminAuth, async (req, res) => {
  try {
    const professionals = await storage.getAllProfessionals();
    res.json(professionals);
  } catch (error) {
    console.error('Error fetching professionals:', error);
    res.status(500).json({ message: 'Failed to fetch professionals' });
  }
});

// Get deletion requests
app.get('/api/admin/deletion-requests', requireAdminAuth, async (req, res) => {
  try {
    const requests = await storage.getAllDeletionRequests();
    res.json(requests);
  } catch (error) {
    console.error('Error fetching deletion requests:', error);
    res.status(500).json({ message: 'Failed to fetch deletion requests' });
  }
});

// Update professional status
app.patch('/api/admin/professionals/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    await storage.updateUser(parseInt(id), updates);
    res.json({ message: 'Professional updated successfully' });
  } catch (error) {
    console.error('Error updating professional:', error);
    res.status(500).json({ message: 'Failed to update professional' });
  }
});

// Process deletion request
app.patch('/api/admin/deletion-requests/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log('Updating deletion request:', { id, status, body: req.body });
    
    await storage.updateDeletionRequest(parseInt(id), {
      status,
      processedAt: new Date()
    });
    
    console.log('Deletion request updated successfully');
    res.json({ message: 'Deletion request updated successfully' });
  } catch (error) {
    console.error('Error updating deletion request:', error);
    res.status(500).json({ message: 'Failed to update deletion request' });
  }
});

// Send notification to professional
app.post('/api/admin/send-notification', requireAdminAuth, async (req, res) => {
  try {
    const { professionalId, message, type } = req.body;
    
    const notification = await storage.createNotification({
      professionalId,
      message,
      type: type || 'admin'
    });
    
    res.json({ 
      message: 'Notification sent successfully',
      notificationId: notification.id
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
});

// Bulk operations
app.post('/api/admin/bulk-action', requireAdminAuth, async (req, res) => {
  try {
    const { action, professionalIds, data } = req.body;
    
    let results = [];
    
    for (const id of professionalIds) {
      switch (action) {
        case 'deactivate':
          await storage.updateUser(id, { isActive: false });
          results.push({ id, status: 'deactivated' });
          break;
        case 'activate':
          await storage.updateUser(id, { isActive: true });
          results.push({ id, status: 'activated' });
          break;
        case 'notify':
          const notification = await storage.createNotification({
            professionalId: id,
            message: data.message,
            type: 'admin'
          });
          results.push({ id, status: 'notified', notificationId: notification.id });
          break;
      }
    }
    
    res.json({ 
      message: `Bulk ${action} completed`,
      results
    });
  } catch (error) {
    console.error('Error performing bulk action:', error);
    res.status(500).json({ message: 'Failed to perform bulk action' });
  }
});

// Health check
app.get('/api/admin/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'USA Home Admin API'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'USA Home Admin API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      login: 'POST /api/admin/login',
      logout: 'POST /api/admin/logout',
      status: 'GET /api/admin/status',
      stats: 'GET /api/admin/stats',
      professionals: 'GET /api/admin/professionals',
      deletionRequests: 'GET /api/admin/deletion-requests',
      health: 'GET /api/admin/health'
    }
  });
});

const PORT = process.env.ADMIN_API_PORT || 5001;

app.listen(PORT, () => {
  console.log(`🔧 Admin API Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin API accessible at http://localhost:${PORT}/api/admin`);
  console.log(`🔐 Admin credentials: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD}`);
});

export default app;