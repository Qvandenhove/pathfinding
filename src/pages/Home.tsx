import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonPage, IonPopover, IonTitle, IonToolbar } from '@ionic/react';
import React, { Fragment, useState } from 'react';
import './Home.css';
import { Grid } from 'pathfinding'
import helpers from '../helpers/helpers';
let generation = false

function transpose(array:any) {
  return array.reduce((prev:any, next:any) => next.map((item:any, i:any) =>
      (prev[i] || []).concat(next[i])
  ), []);
}

const Home: React.FC = () => {
  let [errorPopover, setErrorPopover] = useState(false)
  const longueur_canvas:number = Math.round(window.innerWidth * (2/3))
  const hauteur_canvas:number = window.innerHeight
  const hauteur:number = 100
  const longueur:number = 100
  const pixel_height = hauteur_canvas/hauteur
  const pixel_length = longueur_canvas/longueur
  const currentX = 5
  const currentY = 5
  const [goTo, setGoTo] = useState([currentX, currentY])
  const room_number:number = 6
  const [matrix, setMatrix] = useState([])
  const [svg_path_string, setSvgString] = useState("")
  const [Xend, setXend] = useState(currentX)
  const [Yend, setYend] = useState(currentY)
  const [grid, setGrid] = useState(new Grid(0,0))
  
  helpers.createGrid(hauteur, longueur, room_number).then((value) => {
    if(generation === false){
      generation = true
      setMatrix(value)
      setGrid(new Grid(transpose(value)))
    }
  })

  
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonItem className="map">
          <svg width={longueur_canvas} height={hauteur_canvas}>
            {matrix.map((line:any, index:number) => {
              let svg_line = line.map((cell:any, index_h:any) => {
                let cell_value
                if (cell === 0){
                  cell_value = "white"
                }else{
                  cell_value = "black"
                }
                return <rect x={index * (pixel_length)} y={index_h*(pixel_height)} width={pixel_length} height={pixel_height} stroke="black" stroke-width="0" fill={cell_value} />
              })
            return <Fragment>{svg_line}</Fragment>
            })}
            <text fill="blue" x={currentX * pixel_length - 40} y={currentY * pixel_height - pixel_height}>Vous êtes ici</text>
            <circle className="start" fill="green" cx={currentX * pixel_length - pixel_length / 2} cy={currentY * pixel_height - pixel_height / 2} r={pixel_length/2}/>
            <circle className="end" fill="red" cx={(goTo[0] + 1) * pixel_length - pixel_length / 2} cy={(goTo[1] + 1) * pixel_height - pixel_height / 2} r={pixel_length/2} />
            <path fill="none" stroke-width="3" stroke="#ffff00" d={svg_path_string} />
          </svg>
        </IonItem>
        <IonItem color="primary">
          <IonInput onIonChange={(e) => {if (e.detail.value){setXend(parseInt(e.detail.value))}}} name="WantedX" type="number" placeholder="X cherché" />
          <IonInput  onIonChange={(e) => {if (e.detail.value){setYend(parseInt(e.detail.value))}}} name="WantedY" type="number" placeholder="YCherché"/>
          <IonButton onClick={() => {helpers.searchPath(currentX, currentY, Xend, Yend, longueur, hauteur, room_number, grid.clone()).then((path_value) => {
            let svg_path = []
            let path:any = path_value
            if (typeof(path) !== "string"){
              svg_path.push(`M${path[0][0] * pixel_length + pixel_length/2} ${path[0][1] * pixel_height + pixel_height/2}`)
              for(let i = 1;i < path.length; i++){
                svg_path.push(`L${path[i][0] * pixel_length + pixel_length/2} ${path[i][1] * pixel_height + pixel_height/2}`)
              }
              setSvgString(svg_path.join(" "))
              setGoTo([Xend, Yend])
              document.querySelector("circle.end")?.classList.remove("end")
            }else{
              console.log("erreur")
              setErrorPopover(true)
              setTimeout(() => {setErrorPopover(false)}, 2000)
            }
            
          })}} type="submit">Chercher</IonButton>
        </IonItem>
        <IonPopover showBackdrop={false} cssClass="error" isOpen={errorPopover}>Les coordonnées saisies sont dans un mur impossible de trouver un chemin.</IonPopover>
      </IonContent>
    </IonPage>
  );
};

export default Home;
