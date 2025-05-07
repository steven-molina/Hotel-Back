const solicitudModel = require("../models/ModelSolicitudes");
const getAllSolicitudes = async () => {
    try {
        const solicitudes = await solicitudModel.find({});
        return solicitudes;
    } catch (error) {
        console.log(error.message);
        throw { status: 500, message: error.message || error };
    }
};
const getOneSolicitudUser = async (searchTerm) => {
    try {
        const respuesta = await solicitudModel.findOne({
            $or: [
                { idServicio: searchTerm },     
                { idHuesped: searchTerm },  
            ]
        })
        .lean();

        const [servicio, huesped] = await Promise.all([
            servicioModel.findOne({ identificador: respuesta.idServicio }).lean(),
            userModel.findById(respuesta.idHuesped).lean()
        ]);

        if (!respuesta) {
            throw { status: 404, message: "Solicitud no encontrada" };
        }

        return {
            ...respuesta,
            servicio,
            huesped
        };

    } catch (error) {
        console.log(error.message);
        throw { status: error.status || 500, message: error.message || error };
    }
};
const createSolicitud = async (solicitud) => {
    try {
        const respuesta = await solicitudModel.create(solicitud);
        return respuesta;
    } catch (error) {
        console.log(error.message);
        throw { status: 500, message: error.message || error };
    }
};


const deleteSolicitud = async (idhuesped, idservicio) => {
    try {
        const respuesta = await solicitudModel.deleteOne({ idHuesped: idhuesped, idServicio: idservicio });
        return respuesta;
    } catch (error) {
        console.log(error.message);
        throw { status: 500, message: error.message || error };
    }
};
module.exports = {
    getAllSolicitudes,
    getOneSolicitudUser,
    createSolicitud,
    deleteSolicitud
};