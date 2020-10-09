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
  const longueur_canvas:number = window.innerWidth < 720 ? window.innerWidth * (9/10) : Math.round(window.innerWidth * (2/3))
  const hauteur_canvas:number = window.innerHeight * (8/10)
  const hauteur:number = 100
  const longueur:number = 100
  const pixel_height = hauteur_canvas/hauteur
  const pixel_length = longueur_canvas/longueur
  const currentX = 5
  const currentY = 5
  const room_number:number = 6
  const [matrix, setMatrix] = useState([])
  const [fromPoint, setFromPoint] = useState("")
  const [toPoint, setToPoint] = useState("")
  const [svg_path_string, setSvgString] = useState("")
  
  const [grid, setGrid] = useState(new Grid(0,0))
  // Add Waypoints useStates
  const [Waypoints, setWaypoints] = useState([])

  helpers.createGrid(hauteur, longueur, room_number).then((value) => {
    if(generation === false){
      generation = true
      setMatrix(value)
      setGrid(new Grid(transpose(value)))
    }
  })

  async function goToWayPoint(startPoint:string, endPoint:string){
    let startDatas = await helpers.getWaypoint(startPoint)
    let endDatas = await helpers.getWaypoint(toPoint)
    if(startDatas && endDatas){
      let path:any = await helpers.searchPath(startDatas.X, startDatas.Y, endDatas.X, endDatas.Y, grid.clone())
      let svg_path = []
      if (typeof(path) !== "string"){
        svg_path.push(`M${path[0][0] * pixel_length + pixel_length/2} ${path[0][1] * pixel_height + pixel_height/2}`)
        for(let i = 1;i < path.length; i++){
          svg_path.push(`L${path[i][0] * pixel_length + pixel_length/2} ${path[i][1] * pixel_height + pixel_height/2}`)
        }
        setSvgString(svg_path.join(" "))
      }
    }
  }
  
  
  return (
    <IonPage>
      <IonHeader>
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
              let labelX, labelY
              if (WayPoint.datas.X > longueur / 2 && WayPoint.datas.Y > hauteur / 2){
                labelX = WayPoint.datas.X * pixel_length - (WayPoint.datas.label.length * 5)
                labelY = WayPoint.datas.Y * pixel_height - 15
              }else if (WayPoint.datas.X <= longueur / 2 && WayPoint.datas.Y <= hauteur / 2){
                labelX = WayPoint.datas.X * pixel_length + (WayPoint.datas.label.length * 5)
                labelY = WayPoint.datas.Y * pixel_height + 15
              }else if (WayPoint.datas.X <= longueur / 2 && WayPoint.datas.Y > hauteur / 2){
                labelX = WayPoint.datas.X * pixel_length + (WayPoint.datas.label.length * 5)
                labelY = WayPoint.datas.Y * pixel_height - 15
              }else if (WayPoint.datas.X > longueur / 2 && WayPoint.datas.Y <= hauteur / 2){
                labelX = WayPoint.datas.X * pixel_length - (WayPoint.datas.label.length * 5)
                labelY = WayPoint.datas.Y * pixel_height + 15
              }
              return <Fragment key={WayPoint.id}>
                <text fill="blue" x={labelX} y={labelY}>{WayPoint.datas.label}</text>
                <circle fill={WayPoint.datas.color} cx={WayPoint.datas.X * pixel_length - pixel_length / 2} cy={WayPoint.datas.Y * pixel_height - pixel_height / 2} r={pixel_length/2}/>
              </Fragment>
            })}
            <path fill="none" strokeWidth="3" stroke="#ffff00" d={svg_path_string} />
          </svg>
        </IonItem>
        <IonItem lines="none" className="centered searchPoints">
          <AskPoints waypoints={Waypoints} setFromPoint={setFromPoint} setToPoint={setToPoint} />
          <IonButton onClick={() => {goToWayPoint(fromPoint, toPoint)}}>Chercher le chemin</IonButton>
        </IonItem>
        <AddWayPoint wpSetter={setWaypoints} hauteur={hauteur} longueur={longueur} roomsNumber={room_number} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
