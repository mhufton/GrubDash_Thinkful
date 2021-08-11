const { resolve } = require("path");
const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

function namePropInBody(req, res, next) {
  const { data: { name } } = req.body;
  if (name) {
    res.locals.name = name;
    next();
  }
  next({
    status: 400,
    message: "Dish must include a name"
  });
}

function descriptionPropInBody(req, res, next) {
  const { data: { description } } = req.body;
  if (description) {
    res.locals.description = description;
    next();
  }
  next({
    status: 400,
    message: "Dish must incldue a description"
  })
}

function pricePropInBody(req, res, next) {
  const { data: { price} } = req.body;
  if (price <= 0 || typeof price != "number") {
    next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    })
  }
  if (price) {
    res.locals.price = price;
    next();
  }
  next({
    status: 400,
    message: "Dish must include a price"
  })
}

function imagePropInBody(req, res, next) {
  const { data: { image_url} } = req.body;
  if (image_url) {
    res.locals.image_url = image_url;
    next()
  }
  next({
    status: 400,
    message: "Dish must include an image_url"
  })
}

function create(req, res, next) {
  const newDish = {
    id: nextId(),
    name: res.locals.name,
    description: res.locals.description,
    price: res.locals.price,
    image_url: res.locals.image_url
  }
  dishes.push(newDish);
  res.status(201).json({ data: newDish })
}

function list(req, res) {
  res.json({ data: dishes })
}

function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dishId = dishId;
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish does not exist: ${dishId}`
  })
}

function read(req, res) {
  res.status(200).json({ data: res.locals.dish })
}

function update(req, res, next) {
  const { data: {id} } = req.body;
  if (
    id === "" ||
    id === undefined || 
    id === null ||
    id === res.locals.dishId
  ) {
    const updatedDish = {
      id: res.locals.dishId,
      name: res.locals.name,
      description: res.locals.description,
      price: res.locals.price,
      image_url: res.locals.image_url
    }
    res.status(200).json({ data: updatedDish })
  }
  next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${res.locals.dishId}`
  })
}

module.exports = {
  create: [namePropInBody, descriptionPropInBody, pricePropInBody, imagePropInBody, create],
  list,
  read: [dishExists, read],
  update: [dishExists, namePropInBody, descriptionPropInBody, pricePropInBody, imagePropInBody, update]
}