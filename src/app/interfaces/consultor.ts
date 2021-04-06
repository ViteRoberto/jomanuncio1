export interface Consultor {
    logo?: string,

    colorPrincipal?: string,
    textoPrincipal?: string,
    colorSecundario?: string,
    textoSecundario?: string,

    url?: string,
    subdominio?: string,
    facebook?: string,
    celular?: string,
    email?: string,
    ubicacion?: {
        nombre?: string,
        direccion?: string,
        coordenadas?: any
    }
}