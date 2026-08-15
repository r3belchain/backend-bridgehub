const allRoles = {
  CUSTOMER: ['getSpaces', 'manageReservations'],
  VENDOR: ['getSpaces', 'manageSpaces', 'manageReservations'],
  ADMIN: ['getSpaces', 'manageSpaces', 'approveSpaces', 'manageReservations', 'manageUsers', 'manageAmenities'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
