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
        <div className="row col-xl-10 col-12">
            <IonSelect className="col" placeholder="Sélectionnez un point de départ" onIonChange={(e) => {setFromPoint(e.detail.value)}}>
                <SelectWaypoints waypoints={waypoints} stateSetter={setFromPoint} />
            </IonSelect>
            <IonSelect className="col" placeholder="Sélectionnez un point d'arrivé" onIonChange={(e) => {setToPoint(e.detail.value)}}>
                <SelectWaypoints waypoints={waypoints} stateSetter={setToPoint} />
            </IonSelect>
        </div>
    </Fragment>
}

export default AskPoints