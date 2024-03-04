var express = require('express');
const adminController = require('../controllers/AdminController');
const categoryController = require('../controllers/CategoryController')
const orchidController = require('../controllers/OrchidController')
const userController = require('../controllers/UserController');

const adminRouter = express.Router();


const { requireAdmin, ensureAuthenticated } = require('../config/auth');

adminRouter.use([ensureAuthenticated, requireAdmin])

adminRouter.route('/').get(adminController.index);

adminRouter.route('/categories').get(categoryController.renderAdminCategory);
adminRouter.route('/category/:name').get(categoryController.renderCategoryUpdate).post(categoryController.update);
adminRouter.route('/category/:name/delete').get(categoryController.deleteCategory);

adminRouter.route('/categories/create').get(categoryController.renderCreateCategory).post(categoryController.insert)

adminRouter.route('/users').get(userController.renderUserPage);


adminRouter.route('/orchids').get(orchidController.renderAdminOrchid);
adminRouter.route('/orchid/:name').get(orchidController.renderUpdateOrchid).post(orchidController.updateOrchid);
adminRouter.route('/orchid/:name/delete').get(orchidController.deleteOrchid);

adminRouter.route('/orchids/create').get(orchidController.renderCreateOrchid).post(orchidController.createOrchid)

module.exports = adminRouter;