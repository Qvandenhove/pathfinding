import { IonContent, IonHeader, IonItem, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { Fragment } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { Grid } from 'pathfinding'

const Home: React.FC = () => {
  const longueur_canvas:number = 1200
  const hauteur_canvas:number = 600
  const hauteur:number = 60
  const longueur:number = 60
  let matrix:any = []
  for(let X=0; X<hauteur;X++){
    matrix.push([])
    for(let Y=0; Y<longueur; Y++){
      matrix[X].push(0)
    }
  }
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
              console.log(svg_line)
            return <Fragment>{svg_line}</Fragment>
            })}
          </svg>
        </IonItem>
        
      </IonContent>
    </IonPage>
  );
};

export default Home;
