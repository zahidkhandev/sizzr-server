const Store = require("../../models/Store");
const createError = require("http-errors");
const mongoose = require("mongoose");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../../errors/index");

const addNewCategory = async (req, res, next) => {
  const id = req.params.id;

  if (!req.params.id) {
    throw new BadRequestError("Please provide store ID");
  }

  if (req.user.storeId === id) {
    const { category } = req.body;

    const newCategory = await Store.findByIdAndUpdate(
      id,
      {
        $push: {
          services: {
            categoryName: category,
            services: [],
          },
        },
      },
      { new: true }
    );
    const { services } = await newCategory;
    res.json(services);
  } else {
    throw new UnauthenticatedError(
      `You are not authenticated to this store, please try again ${req.user.storeId}`
    );
  }
};

const getServices = async (req, res, next) => {
  const id = req.params.id;

  if (!req.params.id) {
    throw new BadRequestError("Please provide store ID");
  }

  if (req.user.storeId === id) {
    const newCategory = await Store.findById(
      id,
      {
        services: 1,
      },
      { new: true }
    );
    res.json(newCategory);
  } else {
    throw new UnauthenticatedError(
      `You are not authenticated to this store, please try again ${req.user.storeId}`
    );
  }
};

const getOneService = async (req, res, next) => {
  const id = req.params.id;

  const { category, service } = req.body;

  if (!req.params.id) {
    throw new BadRequestError("Please provide store ID");
  }

  if (!category || !service) {
    throw new BadRequestError("Select category and service");
  }

  if (req.user.storeId === id) {
    const getService = await Store.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
        },
      },
      {
        $project: {
          services: {
            $filter: {
              input: "$services",
              as: "service",
              cond: {
                $eq: ["$$service._id", mongoose.Types.ObjectId(category)],
              },
            },
          },
        },
      },
      {
        $project: {
          services: "$services.services",
        },
      },
      {
        $project: {
          services: {
            $arrayElemAt: ["$services", 0],
          },
        },
      },
      {
        $project: {
          services: {
            $filter: {
              input: "$services",
              as: "service",
              cond: {
                $eq: ["$$service._id", mongoose.Types.ObjectId(service)],
              },
            },
          },
        },
      },
      {
        $project: {
          service: {
            $arrayElemAt: ["$services", 0],
          },
        },
      },
    ]);

    res.status(200).json(getService[0].service);
  } else {
    throw new UnauthenticatedError(
      `You are not authenticated to this store, please try again ${req.user.storeId}`
    );
  }
};

const deleteCategory = async (req, res, next) => {
  const id = req.params.id;
  if (!req.params.id) {
    throw new BadRequestError("Please provide store ID");
  }
  if (req.user.storeId === id) {
    const catId = req.body.category;
    if (!catId) {
      throw new BadRequestError("Please provide category ID");
    }
    const newCategory = await Store.findOneAndUpdate(
      id,
      {
        $pull: {
          services: {
            _id: mongoose.Types.ObjectId(catId),
          },
        },
      },
      { new: true }
    );
    res.json(newCategory);
  } else {
    throw new UnauthenticatedError(
      `You are not authenticated to this store, please try again ${req.user.storeId}`
    );
  }
};

const addNewService = async (req, res, next) => {
  const id = req.params.id;

  if (!req.params.id) {
    throw new BadRequestError("Please provide store ID");
  }

  if (req.user.storeId === id) {
    const { category, service } = req.body;

    const checkCategoryExistence = await Store.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(id),
        "services._id": mongoose.Types.ObjectId(category),
      },
      {
        $push: {
          "services.$.services": {
            name: service.name,
            cost: service.cost,
            duration: service.duration,
            desc: service.desc,
            gender: service.gender,
            forKids: service.forKids,
            priceType: service.priceType,
            varCost: service.varCost,
          },
        },
      },
      { new: true }
    );

    if (checkCategoryExistence === null) {
      throw new NotFoundError("Category not found");
    }

    res.json(checkCategoryExistence);
  } else {
    throw new UnauthenticatedError(
      `You are not authenticated to this store, please try again ${req.user.storeId}`
    );
  }
};

const deleteService = async (req, res, next) => {
  const id = req.params.id;

  if (!req.params.id) {
    throw new BadRequestError("Please provide store ID");
  }

  if (req.user.storeId === id) {
    const { category, service } = req.body;

    const checkCategoryExistence = await Store.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(id),
        "services._id": mongoose.Types.ObjectId(category),
      },
      {
        $pull: {
          "services.$.services": { _id: mongoose.Types.ObjectId(service) },
        },
      },
      { new: true }
    );

    if (checkCategoryExistence === null) {
      throw new NotFoundError("Category or service not found");
    }

    res.json(checkCategoryExistence);
  } else {
    throw new UnauthenticatedError(
      `You are not authenticated to this store, please try again ${req.user.storeId}`
    );
  }
};

const updateService = async (req, res, next) => {
  const id = req.params.id;

  if (!req.params.id) {
    throw new BadRequestError("Please provide store ID");
  }

  if (req.user.storeId === id) {
    const { category, service, update } = req.body;

    console.log(update);

    const { name, gender, forKids, duration, cost, desc, priceType, varCost } =
      update;

    if (!name || !gender || !duration || !cost) {
      throw new BadRequestError("All fields are required");
    }

    const checkCategoryExistence = await Store.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(id),
      },
      {
        $set: {
          "services.$[catId].services.$[updatedService].cost": cost,
          "services.$[catId].services.$[updatedService].name": name,
          "services.$[catId].services.$[updatedService].gender": gender,
          "services.$[catId].services.$[updatedService].forKids": forKids,
          "services.$[catId].services.$[updatedService].duration": duration,
          "services.$[catId].services.$[updatedService].desc": desc,
          "services.$[catId].services.$[updatedService].priceType": priceType,
          "services.$[catId].services.$[updatedService].varCost": varCost,
        },
      },
      {
        arrayFilters: [
          { "catId._id": mongoose.Types.ObjectId(category) },
          { "updatedService._id": mongoose.Types.ObjectId(service) },
        ],
      }
    );

    if (checkCategoryExistence === null) {
      throw new NotFoundError("Category or service not found");
    }

    res.json(update);
  } else {
    throw new UnauthenticatedError(
      `You are not authenticated to this store, please try again ${req.user.storeId}`
    );
  }
};

module.exports = {
  addNewService,
  addNewCategory,
  deleteCategory,
  deleteService,
  updateService,
  getServices,
  getOneService,
};
