import pandas as pd
import numpy as np
from collections import defaultdict

class Algorithms_benchmarks:

    consumos_por_dispositivo = {
        "Piano": 0,
        "Escáner de diapositivas": 15,
        "Capacitat": 0,
        "Traducción simultánea": 30,
        "Conexión a la red (por dispositivo)": 10,
        "Micrófonos de mesa": 3,
        "Doble platina": 10,
        "Grabación y transmisión por internet": 80,
        "Videoconferencia": 100,
        "Micrófono inalámbrico": 5,
        "Faristol": 0,
        "Impresora a color": 50,
        "Impresora láser": 30,
        "Impresora matricial": 20,
        "Micrófono de corbata": 3,
        "Mampares": 0,
        "Pizarra pentagrama": 0,
        "Monitor de ordenador": 20,
        "Negatoscopio": 25,
        "Cámara de vídeo": 20,
        "Reproductor CD/cassette": 15,
        "Tarima": 0,
        "Mesas para personas con movilidad reducida": 0,
        "Filmadora VHS": 15,
        "Minidisc": 5,
        "Cabinas de interpretación": 100,
        "Megafonía": 50,
        "Punter láser": 2,
        "Filmadora diapositivas": 10,
        "Proyector de cuerpos": 300,
        "Grabadores de DVD": 20,
        "Instalación informática": 200,
        "Capturadora de vídeo": 15,
        "Cañón de proyección portátil": 200,
        "Pizarra interactiva": 100,
        "Ordenadores (nombre)": 120,
        "Alargador": 0,
        "Grabadores y reproductores de cassette": 10,
        "Puerta secundaria": 0,
        "Grabadores de CD": 15,
        "Papelógrafo": 0,
        "DVD": 15,
        "Vídeo": 30,
        "Pantalla de carril": 0,
        "Televisor": 100,
        "Capacidad exámenes": 0,
        "Cañón de proyección fijo": 300,
        "Retroproyector": 250,
        "Aire acondicionado": 1000,
        "Conexión red cableada": 5,
        "Conexión red inalámbrica": 5,
        "Proyector de diapositivas": 200,
        "Mobiliario": 0,
        "Acceso para personas con movilidad reducida": 0,
        "Pantalla fija": 0,
        "Pizarra": 0,
        "Ordenador": 100,
        "Capacidad docencia": 0,
        "Teléfono (fijo)": 2,
        "Roseta de red": 0
    }

    def _init_(self, info: pd.DataFrame):
        portatil_Wh = 100

        # Mapear 'features.name' a 'feature_consumo'
        info['feature_consumo'] = info['features.name'].map(
            self.consumos_por_dispositivo).fillna(0)

        # Sumar el consumo por aula
        info['consumo_aula'] = info.groupby('space.id')['feature_consumo'].transform('sum')

        # Determinar si cada fila es de un laboratorio
        info['is_lab'] = info['space.description'].str.contains('lab\. |laboratori', regex=True, case=False)

        # Calcular el consumo total por fila
        info['consumo'] = np.where(
            info['is_lab'],
            (info['consumo_aula'] / 3600) * info['duration'],
            ((info['consumo_aula'] + info['subject_group.real_capacity'] * portatil_Wh) / 3600) * info['duration']
        )

        # Almacenar el DataFrame actualizado
        self.info = info

    def benchmark_without_movement(self):
        horario = defaultdict(dict)

        # Agrupar por 'space.id' y 'dia'
        grouped = self.info.groupby(['space.id', 'dia'])

        for (aula, dia), group in grouped:
            # Ordenar por hora de inicio si es necesario
            group_sorted = group.sort_values('start')
            total_consumo = group_sorted['consumo'].sum()

            horario[aula][dia] = {
                'elements': group_sorted.to_dict('records'),
                'total': total_consumo
            }
        return horario