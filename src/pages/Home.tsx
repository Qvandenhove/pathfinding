import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonPopover, IonTitle, IonToolbar } from '@ionic/react';
import React, { Fragment, useState } from 'react';
import './Home.css';
import { Grid } from 'pathfinding'
import helpers from '../helpers/helpers';
let generation = false
let gotWaypoints = false

function transpose(array:any) {
  return array.reduce((prev:any, next:any) => next.map((item:any, i:any) =>
      (prev[i] || []).concat(next[i])
  ), []);
}

const Home: React.FC = () => {
  let line_key = 0
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
  // Add Waypoints useStates
  const [wpName, setWpName] = useState("")
  const [wpLabel, setWpLabel] = useState("")
  const [wpColor, setWpColor] = useState("")
  const [Waypoints, setWaypoints] = useState([])
  function updateWaypoints(){
    helpers.getWaypoints().then((value) => {
      if(!gotWaypoints){
        setWaypoints(value)
        gotWaypoints = true
      }
    })
  }
  updateWaypoints()
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
                return <rect key={`${index} - ${index_h}`} x={index * (pixel_length)} y={index_h*(pixel_height)} width={pixel_length} height={pixel_height} stroke="black" strokeWidth="0" fill={cell_value} />
              })
              line_key++
            return <Fragment key={`line - ${line_key}`}>{svg_line}</Fragment>
            })}
            {Waypoints.map((WayPoint:any) => {
              return <Fragment key={WayPoint.id}>
                <text fill="blue" x={WayPoint.datas.X * pixel_length - 40} y={WayPoint.datas.Y * pixel_height - pixel_height}>{WayPoint.datas.label}</text>
                <circle fill={WayPoint.datas.color} cx={WayPoint.datas.X * pixel_length - pixel_length / 2} cy={WayPoint.datas.Y * pixel_height - pixel_height / 2} r={pixel_length/2}/>
              </Fragment>
            })}
            <circle className="end" fill="red" cx={(goTo[0] + 1) * pixel_length - pixel_length / 2} cy={(goTo[1] + 1) * pixel_height - pixel_height / 2} r={pixel_length/2} />
            <path fill="none" strokeWidth="3" stroke="#ffff00" d={svg_path_string} />
          </svg>
        </IonItem>
        <IonItem color="primary">
          <IonLabel position="fixed">Ajouter un point de passage : </IonLabel>
          <IonItem>
            <IonInput onIonChange={(e) => {if (e.detail.value){setXend(parseInt(e.detail.value))}}} name="WantedX" type="number" placeholder="X cherché" />
            <IonInput  onIonChange={(e) => {if (e.detail.value){setYend(parseInt(e.detail.value))}}} name="WantedY" type="number" placeholder="YCherché"/>
            <IonInput onIonChange={(e) => {if(e.detail.value){setWpName(e.detail.value)}}} name="name" type="text" placeholder="Nom du point" />
            <IonInput onIonChange={(e) => {if(e.detail.value){setWpLabel(e.detail.value)}}} name="label" type="text" placeholder="Label du point"/>
            <IonInput onIonChange={(e) => {if(e.detail.value){setWpLabel(e.detail.value)}}} name="color" type="text" placeholder="Couleur du point"/>
          </IonItem>
          <IonButton onClick={() => {
            helpers.addWayPoint(Xend, Yend, wpName, wpLabel, wpColor)
            gotWaypoints = false
            updateWaypoints()
            }} type="submit">Chercher</IonButton>
        </IonItem>
        <IonPopover showBackdrop={false} cssClass="error" isOpen={errorPopover}>Les coordonnées saisies sont dans un mur impossible de trouver un chemin.</IonPopover>
      </IonContent>
    </IonPage>
  );
};

export default Home;
