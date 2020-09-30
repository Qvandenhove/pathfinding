import { IonContent, IonHeader, IonItem, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { Fragment } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { Grid } from 'pathfinding'

const longueur_canvas:number = 1200
const hauteur_canvas:number = 600
const hauteur:number = 60
const longueur:number = 60
const room_number:number = 6
const room_size:number = Math.round(longueur/room_number)
let matrix:any = []
  for(let Y=0; Y<hauteur;Y++){
    matrix.push([])
    for(let X=0; X<longueur; X++){
      let isBuildingWall = (X === 0 || Y === 0 || X === longueur - 1 || Y === hauteur - 1 || X === hauteur/2 + 1 || X === hauteur/2 - 1)
      let isBuildingDoor = (X === hauteur/2 && Y === 0)
      let isRoomWall = ((Y % room_size === 0 && X !== hauteur/2))
      let isRoomDoor = (Y % room_size === 1 && X !== 0 && Y!== 0 && X !== longueur - 1 && Y !== hauteur - 1)
      if((isBuildingWall || isRoomWall) && (isRoomDoor === false && isBuildingDoor === false)){
        matrix[Y].push(1)
      }else{
        matrix[Y].push(0)
      }
    }
  }

const Home: React.FC = () => {
  
  
  
  let grid = new Grid(matrix)
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
                return <rect x={index * (longueur_canvas/longueur)} y={index_h*(hauteur_canvas/hauteur)} width={longueur_canvas/longueur} height={hauteur_canvas/hauteur} stroke="black" stroke-width="1" fill={cell === 0? "white": "black"} />
              })
            return <Fragment>{svg_line}</Fragment>
            })}
          </svg>
        </IonItem>
        
      </IonContent>
    </IonPage>
  );
};

export default Home;
