import { IonButton, IonItem, IonList, IonSelect } from '@ionic/react'
import React, { Fragment, useState } from 'react'
import helpers from '../helpers/helpers'
import SelectWaypoints from './selectWaypoint'
interface askPointsProps {
    waypoints:any
    setFromPoint:any
    setToPoint:any
} 

const AskPoints:React.FC<askPointsProps> = ({waypoints, setFromPoint, setToPoint}) => {
    
    return <Fragment>
                <IonSelect placeholder="Sélectionnez un point de départ" onIonChange={(e) => {setFromPoint(e.detail.value)}}>
                    <SelectWaypoints waypoints={waypoints} stateSetter={setFromPoint} />
                </IonSelect>
                <IonSelect placeholder="Sélectionnez un point d'arrivé" onIonChange={(e) => {setToPoint(e.detail.value)}}>
                    <SelectWaypoints waypoints={waypoints} stateSetter={setToPoint} />
                </IonSelect>
    </Fragment>
}

export default AskPoints