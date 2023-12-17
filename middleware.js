// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next(); // User is authenticated, proceed to the next middleware/route
  }

  res.redirect('/about'); // Redirect to login page if not authenticated
};

export default isAuthenticated;
