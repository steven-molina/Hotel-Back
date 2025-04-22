const servicioModel = require("../models/ModelServicio");
const getAllServicios = async () => {
    try {
        const servicios = await servicioModel.find({});
        return servicios;
    } catch (error) {
        console.log(error.message);
        throw { status: 500, message: error.message || error };
    }
};
const getOneServicio = async (id) => {
    try {
        const respuesta = await servicioModel.findOne({ identificador: id });
        return respuesta;
    } catch (error) {
        console.log(error.message);
        throw { status: 500, message: error.message || error };
    }
};
const createServicio = async (habitacion) => {
    try {
        const respuesta = await servicioModel.create(habitacion);
        return respuesta;
    } catch (error) {
        console.log(error.message);
        throw { status: 500, message: error.message || error };
    }
};

const updateServicio = async (id, body) => {
    try {
        const respuesta = await servicioModel.updateOne({ identificador: id }, body);
        return respuesta;
    } catch (error) {
        console.log(error.message);
        throw { status: 500, message: error.message || error };
    }
};

const deleteServicio = async (id) => {
    try {
        const respuesta = await servicioModel.deleteOne({ identificador: id });
        return respuesta;
    } catch (error) {
        console.log(error.message);
        throw { status: 500, message: error.message || error };
    }
};
module.exports = {
    getAllServicios,
    getOneServicio,
    createServicio,
    updateServicio,
    deleteServicio
};