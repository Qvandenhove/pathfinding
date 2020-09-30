import { IonContent, IonHeader, IonItem, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { Fragment, useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { AStarFinder, Grid } from 'pathfinding'
import helpers from '../helpers/helpers';
let generation = false

function transpose(array:any) {
  return array.reduce((prev:any, next:any) => next.map((item:any, i:any) =>
      (prev[i] || []).concat(next[i])
  ), []);
}

const Home: React.FC = () => {
  const longueur_canvas:number = 800
  const hauteur_canvas:number = 800
  const hauteur:number = 60
  const longueur:number = 60
  var size = longueur_canvas/longueur
  const room_number:number = 6
  const room_size:number = Math.round(longueur/room_number)
  let [matrix, setMatrix] = useState([])
  let [svg_path_string, setSvgString] = useState("")
  
  helpers.createGrid(hauteur, longueur, 6).then((value) => {
    console.log(generation)
    if(generation === false){
      generation = true
      setMatrix(value)
      let grid = new Grid(transpose(value))
      let finder = new AStarFinder()
      let path = finder.findPath(5,5,51,50, grid)
      console.log(value)
      console.log(path)
      let svg_path = []
      svg_path.push(`M${path[0][0] * size + size/2} ${path[0][1] * size + size/2}`)
      for(let i = 1;i < path.length; i++){
        svg_path.push(`L${path[i][0] * size + size/2} ${path[i][1] * size + size/2}`)
      }
      setSvgString(svg_path.join(" "))
        
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
        <IonItem>
          <svg width={longueur_canvas} height={hauteur_canvas}>
            {matrix.map((line:any, index:number) => {
              let svg_line = line.map((cell:any, index_h:any) => {
                let cell_value
                if (cell === 0){
                  cell_value = "white"
                }else{
                  cell_value = "black"
                }
                return <rect x={index * (longueur_canvas/longueur)} y={index_h*(hauteur_canvas/hauteur)} width={longueur_canvas/longueur} height={hauteur_canvas/hauteur} stroke="black" stroke-width="1" fill={cell_value} />
              })
            return <Fragment>{svg_line}</Fragment>
            })}
            <path fill="none" stroke-width="3" stroke="#ffff00" d={svg_path_string} />
          </svg>
        </IonItem>
        
      </IonContent>
    </IonPage>
  );
};

export default Home;
