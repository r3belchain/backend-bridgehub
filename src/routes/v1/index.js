const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const amenityRoute = require('./amenity.route');
const spaceRoute = require('./space.route');
const reservationRoute = require('./reservation.route');
const dashboardRoute = require('./dashboard.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/amenities',
    route: amenityRoute,
  },
  {
    path: '/spaces',
    route: spaceRoute,
  },
  {
    path: '/reservations',
    route: reservationRoute,
  },
  {
    path: '/dashboard',
    route: dashboardRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
