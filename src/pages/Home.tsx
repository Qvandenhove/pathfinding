import { IonButton, IonContent, IonHeader, IonItem, IonList, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { Fragment, useState } from 'react';
import './Home.css';
import { Grid } from 'pathfinding'
import helpers from '../helpers/helpers';
import AddWayPoint from '../components/addWaypoint';
import AskPoints from '../components/askPoints';
let generation = false

function transpose(array:any) {
  return array.reduce((prev:any, next:any) => next.map((item:any, i:any) =>
      (prev[i] || []).concat(next[i])
  ), []);
}

const Home: React.FC = () => {
  let line_key = 0
  const longueur_canvas:number = window.innerWidth < 720 ? window.innerWidth * (8/10) : Math.round(window.innerWidth * (2/3)) // longueur de la grille sur l'écran
  const hauteur_canvas:number = window.innerHeight * (8/10) // hauteur de la grille sur l'écran
  const margin = window.innerWidth >= 720 ? (window.innerWidth - longueur_canvas)/2 : (window.innerWidth - longueur_canvas)/4 // Écart à réaliser pour centrer sur lécran
  const hauteur:number = 100 // Nombre de pixel en hateur de la grille
  const longueur:number = 100 // Nombre de pixel en longueur de la grille
  const pixel_height = hauteur_canvas/hauteur // Hauteur d'un pixel
  const pixel_length = longueur_canvas/longueur // Longueur d'un pixel
  const room_number:number = 6 // nombre de salles de part et d'autre du couloir
  const [matrix, setMatrix] = useState([]) // La grille utilisée par pathfinding
  const [fromPoint, setFromPoint] = useState("") // Point de départ
  const [toPoint, setToPoint] = useState("") // Point d'arrivée
  const [svg_path_string, setSvgString] = useState("") // Chemin à suivre
  
  const [grid, setGrid] = useState(new Grid(0,0))
  // Add Waypoints useStates
  const [Waypoints, setWaypoints] = useState([])
  //Génération de la grille
  helpers.createGrid(hauteur, longueur, room_number).then((value) => {
    if(generation === false){
      generation = true
      setMatrix(value)
      setGrid(new Grid(transpose(value)))
    }
  })
  // Recherche de chemin à emprunter
  async function goToWayPoint(startPoint:string, endPoint:string){
    let startDatas = await helpers.getWaypoint(startPoint)
    let endDatas = await helpers.getWaypoint(toPoint)
    if(startDatas && endDatas){
      let path:any = await helpers.searchPath(startDatas.X - 1, startDatas.Y - 1, endDatas.X - 1, endDatas.Y - 1, grid.clone())
      let svg_path = []
      if (typeof(path) !== "string"){
        svg_path.push(`M${path[0][0] * pixel_length + pixel_length/2 + margin} ${(path[0][1]) * pixel_height + pixel_height/2}`)
        for(let i = 1;i < path.length; i++){
          svg_path.push(`L${path[i][0] * pixel_length + pixel_length/2 + margin} ${(path[i][1]) * pixel_height + pixel_height/2}`)
        }
        setSvgString(svg_path.join(" "))
      }
    }
  }
  
  
  return (
    <IonPage>
      <IonHeader>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossOrigin="anonymous" />
        <IonToolbar>
        <IonItem lines="none" color="white">
          <IonTitle>Carte du Bâtiment</IonTitle>
        </IonItem>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonItem className="map">
          <svg width={window.innerWidth} height={hauteur_canvas}>
            {matrix.map((line:any, index:number) => {
              let svg_line = line.map((cell:any, index_h:any) => {
                let cell_value
                if (cell === 0){
                  cell_value = "white"
                }else{
                  cell_value = "black"
                }
                return <rect key={`${index} - ${index_h}`} x={index * (pixel_length) + margin} y={index_h*(pixel_height)} width={pixel_length} height={pixel_height} stroke="black" strokeWidth="0" fill={cell_value} />
              })
              line_key++
            return <Fragment key={`line - ${line_key}`}>{svg_line}</Fragment>
            })}
            {Waypoints.map((WayPoint:any) => {
              let labelX, labelY
              if (WayPoint.datas.X > longueur / 2 && WayPoint.datas.Y > hauteur / 2){
                labelX = WayPoint.datas.X * pixel_length - (WayPoint.datas.label.length * 1.5) + margin
                labelY = WayPoint.datas.Y * pixel_height - 15
              }else if (WayPoint.datas.X <= longueur / 2 && WayPoint.datas.Y <= hauteur / 2){
                labelX = WayPoint.datas.X * pixel_length + (WayPoint.datas.label.length * 1.5) + margin
                labelY = WayPoint.datas.Y * pixel_height + 15
              }else if (WayPoint.datas.X <= longueur / 2 && WayPoint.datas.Y > hauteur / 2){
                labelX = WayPoint.datas.X * pixel_length + (WayPoint.datas.label.length * 1.5) + margin
                labelY = WayPoint.datas.Y * pixel_height - 15
              }else if (WayPoint.datas.X > longueur / 2 && WayPoint.datas.Y <= hauteur / 2){
                labelX = WayPoint.datas.X * pixel_length - (WayPoint.datas.label.length * 1.5) + margin
                labelY = WayPoint.datas.Y * pixel_height + 15
              }
              return <Fragment key={WayPoint.id}>
                <text fill="blue" x={labelX} y={labelY}>{WayPoint.datas.label}</text>
                <circle fill={WayPoint.datas.color} cx={WayPoint.datas.X * pixel_length - pixel_length / 2 + margin} cy={WayPoint.datas.Y * pixel_height - pixel_height / 2} r={pixel_length * (window.innerWidth < 720 ? 1 : 0.5)}/>
              </Fragment>
            })}
            <path fill="none" strokeWidth="3" stroke="#ffff00" d={svg_path_string} />
          </svg>
        </IonItem>
        <IonItem lines="none" className="centered searchPoints">
          <IonList className="row col-12 justify-content-center">
            <AskPoints waypoints={Waypoints} setFromPoint={setFromPoint} setToPoint={setToPoint} />
            <IonButton className="col-xl-2" onClick={() => {goToWayPoint(fromPoint, toPoint)}}>Chercher</IonButton>
          </IonList>
        </IonItem>
        <AddWayPoint wpSetter={setWaypoints} hauteur={hauteur} longueur={longueur} roomsNumber={room_number} />
        <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossOrigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossOrigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossOrigin="anonymous"></script>
      </IonContent>
    </IonPage>
  );
};

export default Home;
