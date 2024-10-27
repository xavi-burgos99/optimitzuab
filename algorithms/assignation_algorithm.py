import pandas as pd
import numpy as np
import time
from queue import PriorityQueue

class Elemento:
    def __init__(self, valor:pd.DataFrame):
        self.valor = valor

    # Método de comparación
    def __lt__(self, other):
        return self['start'] < other['start']

class Algorithms_benckmarks:

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
    horario = dict

    def __init__(self, info: pd.DataFrame):
        portatil_Wh = 100

        # Get unique combinations of 'space.id' and 'features.name'
        aulas_features = info[['space.id', 'features.name']].drop_duplicates()

        # Map 'features.name' to consumption values
        aulas_features['feature_consumo'] = aulas_features['features.name'].map(
            self.consumos_por_dispositivo).fillna(0)

        # Sum consumption per 'space.id' (classroom)
        consumo_aula = aulas_features.groupby('space.id')['feature_consumo'].sum().reset_index()
        consumo_aula.rename(columns={'feature_consumo': 'consumo_aula'}, inplace=True)

        # Merge the total classroom consumption back into the original DataFrame
        info = info.merge(consumo_aula, on='space.id', how='left')

        # Calculate total consumption per row
        if info['space.description'].str.contains('lab. | laboratori'):
            info['consumo'] = (info['consumo_aula']/3600)*info['duration']
        else:
            info['consumo'] = ((info['consumo_aula'] + info['subject_group.real_capacity'] * portatil_Wh)/3600)*info['duration']

        # Store the updated DataFrame
        self.info = info

    def benckmark_without_movement(self):
        for dia in self.info['dias'].unique():
            disorder_info = self.info[self.info['dias'] == dia]
            if (len(self.horario)==0):
                self.horario[dia]=pd.DataFrame

            P
