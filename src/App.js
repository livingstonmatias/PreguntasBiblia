import React, { useState, useEffect } from "react";
import "./App.css";

import preguntas from "./Preguntas.json";

let numeroPreguntaActual = 0;

function App() {
  const [start, setStart] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState(preguntas[0]);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState();
  const [versiculo, setVersiculo] = useState("");
  const [cantidadAciertos, setCantidadAciertos] = useState(0);

  const siguentePregunta = () => {
    if (numeroPreguntaActual < preguntas.length - 1) {
      if (respuestaSeleccionada === preguntaActual.correcta) {
        setCantidadAciertos(cantidadAciertos + 1);
        window.$("#modal-versiculo").modal("show");

        fetch(
          `https://api.biblia.com/v1/bible/content/RVR60.txt.json?passage=${preguntaActual.ver}&key=936ff41234f592ebe93025af21c31cbc`
        )
          .then((res) => res.json())
          .then((data) => {
            setVersiculo(data.text);
          });
      } else {
        numeroPreguntaActual = numeroPreguntaActual + 1;
        setPreguntaActual(preguntas[numeroPreguntaActual]);
      }
    } else {
      // Finalizacion
      numeroPreguntaActual = 0;
      setPreguntaActual(preguntas[0]);
      setVersiculo("");
      setStart(false);
    }
  };

  return (
    <div className="App px-2">
      <header className="AppHeader shadow">
        <h5>
          Juego de preguntas de la biblia - {cantidadAciertos}/
          {preguntas.length}
        </h5>
      </header>

      <main className="AppContent">
        {!start && <div>.....</div>}

        {start && (
          <>
            <div className="Pregunta">{preguntaActual.pregunta}</div>

            <div className="Respuestas">
              {preguntaActual.respuestas.map((respuesta) => {
                return (
                  <div
                    key={respuesta}
                    className="custom-control custom-radio d-flex align-items-center mt-2"
                  >
                    <input
                      type="radio"
                      id={respuesta}
                      value={respuesta}
                      name="customRadio"
                      className="custom-control-input"
                      onChange={(e) => setRespuestaSeleccionada(respuesta)}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor={respuesta}
                      style={{ marginTop: 0 }}
                    >
                      {respuesta}
                    </label>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      <footer className="AppFooter">
        {!start && (
          <button
            className="btn btn-success btn-lg w-100 btn-rounded"
            onClick={(e) => {
              setStart(true);
              setCantidadAciertos(0);
            }}
          >
            Comenzar
          </button>
        )}

        {start && (
          <button
            className="btn btn-success btn-lg w-100 btn-rounded"
            disabled={!respuestaSeleccionada ? true : false}
            onClick={siguentePregunta}
          >
            Continuar
          </button>
        )}
      </footer>

      <div id="modal-versiculo" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-body ModalVersiculo">
              <p className="text-dark">
                {versiculo}
                <strong>{preguntaActual.ver}</strong>
              </p>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-success btn-lg w-100 btn-rounded"
                onClick={() => {
                  window.$("#modal-versiculo").modal("hide");

                  numeroPreguntaActual = numeroPreguntaActual + 1;
                  setPreguntaActual(preguntas[numeroPreguntaActual]);
                }}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
