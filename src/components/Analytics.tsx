import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Link as LinkIcon,
  TrendingUp,
  Visibility,
  Schedule,
  ExpandMore,
  Language,
  Devices,
  Source,
  AccessTime,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { urlService, type AnalyticsData } from '../services/urlService';

const Analytics: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadAnalytics = async () => {
    try {
      const data = await urlService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Alert severity="info">
          Please log in to view your analytics dashboard.
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography>Loading analytics...</Typography>
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Alert severity="error">
          Failed to load analytics data.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Track the performance of your shortened URLs
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: 200 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LinkIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Total URLs
                </Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {analytics.totalUrls}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: 200 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Visibility color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Total Clicks
                </Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {analytics.totalClicks}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: 200 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUp color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Avg. Clicks/URL
                </Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {analytics.totalUrls > 0 ? Math.round(analytics.totalClicks / analytics.totalUrls) : 0}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: 200 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Schedule color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Active URLs
                </Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {analytics.topUrls.filter(url => url.isActive).length}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Top Performing URLs */}
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Top Performing URLs
          </Typography>
          
          {analytics.topUrls.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Short URL</TableCell>
                    <TableCell>Original URL</TableCell>
                    <TableCell align="center">Clicks</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Created</TableCell>
                    <TableCell align="center">Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.topUrls.map((url) => (
                    <TableRow key={url.id}>
                      <TableCell>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                          {url.shortUrl}
                        </Typography>
                        {url.customCode && (
                          <Chip
                            label="Custom"
                            size="small"
                            color="secondary"
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={url.originalUrl}
                        >
                          {url.originalUrl}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={url.clicks}
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={url.isActive ? 'Active' : 'Inactive'}
                          color={url.isActive ? 'success' : 'default'}
                          size="small"
                        />
                        {url.expiresAt && (
                          <Typography variant="caption" display="block">
                            Expires: {new Date(url.expiresAt).toLocaleDateString()}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {new Date(url.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="caption">View Details</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant="subtitle2" gutterBottom>
                              Recent Click Details:
                            </Typography>
                            <List dense>
                              {url.clickDetails.slice(0, 5).map((click, index) => (
                                <ListItem key={index}>
                                  <ListItemText
                                    primary={`${click.source} • ${click.country}`}
                                    secondary={`${click.device} • ${new Date(click.timestamp).toLocaleString()}`}
                                  />
                                </ListItem>
                              ))}
                            </List>
                            {url.clickDetails.length > 5 && (
                              <Typography variant="caption" color="textSecondary">
                                ... and {url.clickDetails.length - 5} more clicks
                              </Typography>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
              No URLs created yet. Start by shortening your first URL!
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Detailed Analytics */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {/* Clicks by Source */}
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 300 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Source color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Clicks by Source
              </Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Source</TableCell>
                    <TableCell align="right">Clicks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(analytics.detailedAnalytics.clicksBySource)
                    .sort(([,a], [,b]) => b - a)
                    .map(([source, clicks]) => (
                    <TableRow key={source}>
                      <TableCell>{source}</TableCell>
                      <TableCell align="right">{clicks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* Clicks by Country */}
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 300 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Language color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Clicks by Country
              </Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Country</TableCell>
                    <TableCell align="right">Clicks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(analytics.detailedAnalytics.clicksByCountry)
                    .sort(([,a], [,b]) => b - a)
                    .map(([country, clicks]) => (
                    <TableRow key={country}>
                      <TableCell>{country}</TableCell>
                      <TableCell align="right">{clicks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* Clicks by Device */}
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 300 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Devices color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Clicks by Device
              </Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Device</TableCell>
                    <TableCell align="right">Clicks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(analytics.detailedAnalytics.clicksByDevice)
                    .sort(([,a], [,b]) => b - a)
                    .map(([device, clicks]) => (
                    <TableRow key={device}>
                      <TableCell>{device}</TableCell>
                      <TableCell align="right">{clicks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* Clicks by Hour */}
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 300 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTime color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Clicks by Hour of Day
              </Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 300 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Hour</TableCell>
                    <TableCell align="right">Clicks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(analytics.detailedAnalytics.clicksByHour)
                    .map(([hour, clicks]) => (
                    <TableRow key={hour}>
                      <TableCell>{hour}:00</TableCell>
                      <TableCell align="right">{clicks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>

      {/* Click History Chart (simplified table view) */}
      <Paper elevation={3}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Click History (Last 7 Days)
          </Typography>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Clicks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analytics.clickHistory.slice(-7).map((day) => (
                  <TableRow key={day.date}>
                    <TableCell>
                      {new Date(day.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      {day.clicks}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default Analytics;
