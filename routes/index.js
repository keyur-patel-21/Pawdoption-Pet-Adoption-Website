//import routes
import petRoutes from './pets.js';
import userRoutes from './users.js';

const constructorMethod = (app) => {
	app.use('/pets', petRoutes);
	app.use('/', userRoutes);

	app.use('*', (req, res) => {
		res.render("errors/no_route", { layout: "account" });
	});
};

export default constructorMethod;