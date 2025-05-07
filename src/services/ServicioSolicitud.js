const dbSolicitud = require("../database/solicitudQuery");
const getAllSolicitudes = async () => {
    try {

        const solicitudes = await dbSolicitud.getAllServicios();
        return solicitudes;
    } catch (error) {
        throw error;
    }
};
const getOneSolicitud = async (searchTerm) => {
    try {
        const solicitud = await dbSolicitud.getOneSolicitudUser(searchTerm);
        return solicitud;
    } catch (error) {
        throw error;
    }
};
const createSolicitud = async (nuevaSolicitud) => {
    try {
        const respuesta = await dbSolicitud.createSolicitud(nuevaSolicitud);

        return respuesta;
    } catch (error) {
        throw error;
    }
};
const deleteSolicitud = async (idHuesped, idServicio) => {
    try {
        const respuesta = await dbSolicitud.deleteSolicitud(idHuesped, idServicio);
        return respuesta;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllSolicitudes,
    getOneSolicitud,
    createSolicitud,
    deleteSolicitud,
};