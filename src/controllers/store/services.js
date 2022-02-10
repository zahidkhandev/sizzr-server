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
    console.log(category);

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
    res.json(newCategory);
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
            _id: catId,
          },
        },
      },
      { new: true }
    );
    res.json(newCategory);
    // res.json({ msg: "Category deleted" });
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
            additionalInfo: service.additionalInfo,
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
    const { category, service } = req.body;

    const checkCategoryExistence = await Store.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(id),
        "services._id": mongoose.Types.ObjectId(category),
        // "services.services._id": mongoose.Types.ObjectId(service),
      },
      {
        $set: {
          services: {
            categoryName: "test",
            services: [],
          },
        },
      },
      // {
      //   "services.services._id": 1,
      //   "services.services.cost": 1,
      // },
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

module.exports = {
  addNewService,
  addNewCategory,
  deleteCategory,
  deleteService,
  updateService,
  getServices,
};
