# Marca FranMaxi

Guía para mantener la misma identidad en la web y en las redes.

## Idea

Cyberpunk del NOA: neón sobre negro, cortes en las esquinas y una cordillera en wireframe que remite a las montañas de Tucumán.

**Frase de marca:** Código que escala. IA que resuelve.

**Instagram:** [@franmaxi.dev](https://www.instagram.com/franmaxi.dev/)

## Logo

| Archivo | Cuándo usarlo |
|---|---|
| `logo/logo-sobre-oscuro.svg` | Versión principal, sobre fondos oscuros |
| `logo/logo-sobre-claro.svg` | Sobre fondos claros |
| `logo/simbolo.svg` | Espacios chicos, como favicon o marca de agua |
| `export/logo/avatar-instagram.png` | Foto de perfil de Instagram |
| `export/logo/simbolo-1024.png` | Símbolo en PNG con fondo transparente |

Dejá alrededor del logo un margen de al menos la altura del símbolo. No lo estires, no le cambies los colores y no le agregues sombras.

## Colores

| Nombre | Hex | Uso |
|---|---|---|
| Vacío | `#05060A` | Fondo principal |
| Panel | `#0B0D14` | Tarjetas y bloques |
| Línea | `#262B3B` | Bordes |
| Hueso | `#EDF1F7` | Títulos y texto principal |
| Niebla | `#9AA2B7` | Texto secundario |
| Volt | `#C8FF2E` | Color principal: botones y una frase destacada por pieza |
| Hot | `#FF2D78` | Todo lo que esté en construcción y la marca changas.cv |
| Ice | `#29E6FF` | Detalles técnicos y avisos, en poca cantidad |

Usá un solo color de acento fuerte por pieza. El texto sobre Volt siempre va en Vacío.

## Tipografía

| Fuente | Uso |
|---|---|
| Oxanium 800, en mayúsculas | Titulares |
| Geist 400 | Texto corrido |
| JetBrains Mono 500 y 700, en mayúsculas | Etiquetas, datos y botones |

## Cómo escribimos

- Hablamos de vos, en español rioplatense.
- Frases cortas y concretas: decimos qué hace el sistema y para quién.
- Usamos solo lo que se puede comprobar. Si no tenemos un número real, no ponemos un número.
- Sin emojis en las piezas.

## Piezas de Instagram

Las imágenes listas para subir están en `export/instagram/`.

| Formato | Tamaño | Archivos |
|---|---|---|
| Posteo | 1080 × 1350 | `post-01` a `post-03` |
| Carrusel | 1080 × 1350 | `carrusel-1` a `carrusel-5`. La cordillera sigue de una imagen a la otra al deslizar |
| Historia | 1080 × 1920 | `historia-1` y `historia-2`, esta última sin texto para escribir en la app |

En las historias, dejá libres los 250 px de arriba y los 340 px de abajo, porque Instagram los tapa con su interfaz.

## Crear o editar una pieza

1. Editá los textos o sumá una entrada en `posts.mjs`.
2. Corré `npm run brand`. Para exportar solo algunas, usá `npm run brand -- carrusel`.
3. Buscá el PNG en `export/`.

Hace falta Firefox instalado y conexión a internet para cargar las fuentes. Para regenerar el relieve, borrá los archivos de `assets/` antes de exportar.
