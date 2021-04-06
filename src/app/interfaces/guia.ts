import { Consultor } from './consultor';

export interface Guia {

    //INFORMACIÓN BÁSICA
        id?: string,
        foto?: string,
        nombre?: string,
        celular?: string,
        email?: string,
        direccion?: string, 
        ine?: string,
        rfc?: string,
    
    //PERFIL JOM!
        padre?: string, //ID DE GUIA PADRE
    
        directos?: number, //SIEMPRE QUE SE CREE UN GUIA, 'DIRECTOS' EMPEZARÁ EN CERO
        indirectos?: number //SIEMPRE QUE SE CREE UN GUIA, 'INDIRECTOS' EMPEZARÁ EN CERO
    
        nivel?: {
            cierresxTrimestre?: number,
            comision?: number,
            founder?: boolean,
            guiasAsociados?: number,
            guiasBronce?: number,
            idNivel?: string,
            leadsxMes?: number,
            primerCierre?: boolean,
            titulo?: string,
        },
    
        dinero?: number,
        sueno?: string
    
        //DATOS CONSULTOR
        consultor?: Consultor,

    //DATOS DE CONTROL
        registro?: Date,
        ultimoIngreso?: Date,
    
        linea?: number, //ES EL NIVEL EN EL QUE SE ENCUENTRA EL GUÍA. POR DEFAULT SIEMPRE EMPEZARÁ EN LÍNEA 1, A MENOS QUE SE INTEGRE A UNA RED
        jom?: string[], //VARIABLE QUE INDICA EL TIPO DE ROL DEL USUARIO: "Administrador", "Consultor", "Enlace" o "Guía"
        prueba?: boolean
        
}