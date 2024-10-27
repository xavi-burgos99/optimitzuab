# OptimitzUAB!
Este repositorio contiene el código y la documentación para nuestro proyecto desarrollado durante el evento *Datathon UAB 2024*.

## Introducción
OptimitzUAB! es la solución innovadora para gestionar y optimizar el uso de los espacios universitarios en la UAB. Con un enfoque en eficiencia energética y sostenibilidad, esta herramienta permite analizar patrones de ocupación y aplicar estrategias de ahorro energético, maximizando el uso eficiente de los recursos para un campus más equilibrado y responsable con el medio ambiente.

## Características
- [x] **Característica 1: Limpieza de Datos**  
  Realizamos un proceso exhaustivo de limpieza de datos para asegurar la consistencia y calidad de la información. Esto incluyó la conversión de formatos de fecha y hora, la eliminación de columnas irrelevantes y la verificación de datos faltantes o inconsistentes. Esta etapa garantiza una base de datos sólida para el análisis y la modelización.

- [x] **Característica 2: Modelado de Asignación de Aulas**  
  Implementamos un modelo para asignar aulas a grupos basado en la capacidad de cada aula y el horario de cada grupo. Utilizamos técnicas de programación y verificación de solapamientos para evitar conflictos de horarios, optimizando la distribución de aulas en función de la disponibilidad y las necesidades de cada grupo.

- [x] **Característica 3: Optimización Energética**  
  Además de la asignación de aulas, nuestro modelo incorpora consideraciones de eficiencia energética, asignando aulas de acuerdo con criterios de uso óptimo de recursos. Esto busca reducir el consumo energético al minimizar el uso de aulas con gran capacidad cuando solo se requiere un espacio reducido, maximizando el ahorro de recursos y la sostenibilidad.

## Instalación
Debes clonar el repositorio y seguir los pasos que se muestran a continuación para ejecutar el proyecto en local.

```bash
git clone https://github.com/xavi-burgos99/optimitzuab.git
cd optimitzuab
```

Para seguir con la instalación del proyecto en local, puedes seguir los pasos que se muestran en el archivo [INSTALL.md](INSTALL.md).

## Implementación
El proyecto sigue una serie de pasos lógicos para asignar aulas a los grupos de una manera optimizada, asegurando que cada grupo tenga el espacio adecuado sin conflictos de horario.

Este procedimiento permite que las aulas se asignen de manera óptima, brindando una solución práctica y sostenible para la gestión de espacios en un entorno académico.

### Carga y Limpieza de Datos
El proceso comienza con la carga de datos relevantes sobre horarios de los grupos y características de las aulas disponibles.

A continuación, se realiza una limpieza de los datos, que incluye la conversión de formatos de fecha y hora y la eliminación de columnas innecesarias para optimizar el análisis.

### Modelado de Asignación de Aulas

Una vez los datos están listos, se implementa un modelo de asignación. Este modelo toma en cuenta la capacidad de cada aula y los horarios de cada grupo. 

Para cada grupo, el sistema identifica las aulas que pueden acomodar el número de estudiantes requerido y las selecciona como posibles opciones para ese grupo.

#### Verificación de Conflictos de Horario 

Para evitar que dos grupos coincidan en el mismo espacio a la misma hora, se introduce un paso de verificación de conflictos. El sistema revisa los horarios de cada aula asignada para asegurarse de que no haya solapamientos de tiempo en las reservas. 

Cuando se detecta un conflicto, se selecciona una aula alternativa de las opciones disponibles.

### Optimización y Eficiencia Energética 
Por redactar...

## Tecnologías utilizadas
- Python/Jupyter notebooks
- Pandas
- Kaggle
- Seaborn (heatmap generation)

## Creadores
- **Xavi Burgos**
  GitHub: [@xavi-burgos99](https://github.com/xavi-burgos99)
  LinkedIn: [in/xavi-burgos](https://www.linkedin.com/in/xavi-burgos/)

- **Gabriel Juan**
  GitHub: [@GabrielJuan349](https://github.com/GabrielJuan349)
  LinkedIn: [in/gabi-juan](https://www.linkedin.com/in/gabi-juan)

- **Samya Karzazi**
  GitHub: [@SamyaKarzaziElBachiri](https://github.com/SamyaKarzaziElBachiri)
  LinkedIn: [in/samya-k](https://www.linkedin.com/in/samya-k-2ba678235)

- **Jan Gras**
  GitHub: [@JG03dev](https://github.com/JG03dev)
  LinkedIn: [in/jangras](https://www.linkedin.com/in/jangras/)

- **Yeray Cordero**
  GitHub: [@yeray142](https://github.com/yeray142)
  LinkedIn: [in/yeray142](https://www.linkedin.com/in/yeray142/)


## Licencia

Este proyecto está bajo la Licencia que se muestra en archivo [LICENSE](LICENSE).
