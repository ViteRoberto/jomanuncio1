interface Imagen {
    image: string
}

export interface Propiedad {
    address: string,
    description: string,
    photos: Imagen[]
}