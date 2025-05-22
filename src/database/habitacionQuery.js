const habitacionModel = require("../models/ModelHabitaciones");
const getAllHabitaciones = async () => {
  try {
    const habitaciones = await habitacionModel.find({});
    return habitaciones;
  } catch (error) {
    console.log(error.message);
    throw { status: 500, message: error.message || error };
  }
};
const getOneHabitacion = async (id) => {
  try {
    const respuesta = await habitacionModel.findOne({ identificador: id });
    return respuesta;
  } catch (error) {
    console.log(error.message);
    throw { status: 500, message: error.message || error };
  }
};

const createHabitacion = async (habitacion) => {
  try {
    const respuesta = await habitacionModel.create(habitacion);
    return respuesta;
  } catch (error) {
    console.log(error.message);
    throw { status: 500, message: error.message || error };
  }
};

const updateHabitacion = async (id, body) => {
  try {
    const respuesta = await habitacionModel.updateOne({ identificador: id }, body,
      { new: true, runValidators: true });
    return respuesta;
  } catch (error) {
    console.log(error.message);
    throw { status: 500, message: error.message || error };
  }
};

const deleteHabitacion = async (id) => {
  try {
    const respuesta = await habitacionModel.deleteOne({ identificador: id });
    return {
      acknowledged: respuesta.acknowledged,
      deletedCount: respuesta.deletedCount
    };
  } catch (error) {
    console.log(error.message);
    throw { status: 500, message: error.message || error };
  }
};

module.exports = {
  getAllHabitaciones,
  createHabitacion,
  getOneHabitacion,
  updateHabitacion,
  deleteHabitacion,
};