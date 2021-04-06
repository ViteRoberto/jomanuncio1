export interface Oportunidad{

    //INTERESADO
        id?: string,
        nombre?: string,
        celular?: string,
        email?: string,
    
    //INTERESES
        habitaciones?: number,
        superficie?: number,
        precio?: number,
        direccion?:string,
        descripcion?: string,
        tipo?: string, // 'Casa', 'Departamento', 'Terreno', 'Local Comercial', 'Otro' 
        accion?: string, //'compra', 'venta', 'renta-cliente', 'renta-propietario'
        propiedad?: string, //ID DE PROPIEDAD TOKKOBROKER //PARA SABER SI VIENE DE WEB - POR MIENTRAS
        
    //DATOS DE CONTROL
        fechaRegistro?: Date, //FECHA DE REGISTRO DE LA OPORTUNIDAD
        fechaActualizacion?: any, //FECHA OBTENIDA DEL METADATO DEL DOC
        origen?: string, //'Facebook', 'Lona', 'Propia', 'Directa', 'Web'
        estado?: string, //'Validado', 'Sin Validar', [TODOS LOS DEMÁS ESTADOS QUE GENERA TOKKOBROKER]
        tokkobroker?: string, //ID DEL LEAD GENERADO EN TOKKOBROKER
        consultor?: string, //ID DEL CONSULTOR DE LA COLECCIÓN DE 'CONSULTORES' EN FIREBASE
    
      }