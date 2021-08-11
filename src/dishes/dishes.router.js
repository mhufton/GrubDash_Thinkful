const router = require("express").Router();
const controller = require("./dishes.controller")
const ordersRouter = require("../orders/orders.router");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/:dishId/orders", controller.dishExists, ordersRouter)

router 
  .route("/:dishId")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
