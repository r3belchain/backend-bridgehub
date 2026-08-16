const allRoles = {
  CUSTOMER: ['getSpaces', 'createReservation', 'getReservations', 'manageReservations'],
  VENDOR: ['getSpaces', 'manageSpaces', 'getReservations', 'manageReservations'],
  ADMIN: [
    'getSpaces',
    'manageSpaces',
    'approveSpaces',
    'createReservation',
    'getReservations',
    'manageReservations',
    'manageUsers',
    'manageAmenities',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
