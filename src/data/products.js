import p1 from '../assets/images/productos/341ca07636b34e4f53e8dec19b67a7e5.jpg'
import p2 from '../assets/images/productos/alfajores.jpg'
import p3 from '../assets/images/productos/7dbb062b4e4ee585b8f684d492b68979.jpg'
import p4 from '../assets/images/productos/cupcakeoreo.jpg'
import p5 from '../assets/images/productos/cupcakes.jpg'
import p6 from '../assets/images/productos/minicookies.jpg'

export const products = [
  {
    id: 'p1',
    nombre: 'Torta Red Velvet',
    descripcion: 'Capas suaves de red velvet con relleno de crema de queso premium',
    precio: 45.5,
    imagen: p1,
    categoria: 'Tortas',
    disponible: true
  },
  {
    id: 'p2',
    nombre: 'Alfajores Caseros',
    descripcion: 'Deliciosos alfajores rellenos de dulce de leche artesanal',
    precio: 12.0,
    imagen: p2,
    categoria: 'Alfajores',
    disponible: true
  },
  {
    id: 'p3',
    nombre: 'Cheesecake de Frutos Rojos',
    descripcion: 'Base crocante y crema suave cubierta con frutos rojos frescos',
    precio: 38.0,
    imagen: p3,
    categoria: 'Tortas',
    disponible: true
  },
  {
    id: 'p4',
    nombre: 'Cupcakes Oreo',
    descripcion: 'Cupcakes esponjosos decorados con crema de queso y galletas Oreo',
    precio: 18.0,
    imagen: p4,
    categoria: 'Cupcakes',
    disponible: true
  },
  {
    id: 'p5',
    nombre: 'Cupcakes Variados',
    descripcion: 'Deliciosa variedad de cupcakes con diferentes sabores y decoraciones',
    precio: 16.5,
    imagen: p5,
    categoria: 'Cupcakes',
    disponible: true
  },
  {
    id: 'p6',
    nombre: 'Mini Cookies Artesanales',
    descripcion: 'Galletas pequeñas caseras con chocolate chips y sabor auténtico',
    precio: 8.5,
    imagen: p6,
    categoria: 'Galletas',
    disponible: true
  }
]

export default products
