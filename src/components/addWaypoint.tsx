import { IonLabel, IonItem, IonInput, IonButton, IonPopover } from '@ionic/react'
import React, { Fragment, useState } from 'react'
import helpers from '../helpers/helpers'
import './addWaypoint.css'

let gotWaypoints = false



interface addWaypointProps {
    wpSetter: any
    hauteur: number
    longueur: number
    roomsNumber: number
}

const AddWayPoint:React.FC<addWaypointProps> = ({wpSetter, hauteur, longueur, roomsNumber}) => {
    let [errorPopover, setErrorPopover] = useState(false)
    const [addWpPopover, setWpPopover] = useState(false)
    const [Xend, setXend] = useState(0)
    const [Yend, setYend] = useState(0)
    const [wpLabel, setWpLabel] = useState("")
    const [wpColor, setWpColor] = useState("")

    function updateWaypoints(){
        helpers.getWaypoints().then((value) => {
          if(!gotWaypoints){
            wpSetter(value)
            gotWaypoints = true
          }
        })
      }
      updateWaypoints()
    return <Fragment>
            <IonPopover backdropDismiss={false} onDidDismiss={() => {setWpPopover(false)}} cssClass="addWaypoint" isOpen={addWpPopover}>
                <IonItem color="primary">
                    <IonLabel position="fixed">Ajouter un point de passage : </IonLabel>
                </IonItem>
                <IonItem color="primary">
                    <IonInput onIonChange={(e) => {if (e.detail.value){setXend(parseInt(e.detail.value))}}} name="WantedX" type="number" placeholder="X cherché" />
                </IonItem>
                <IonItem color="primary">
                    <IonInput  onIonChange={(e) => {if (e.detail.value){setYend(parseInt(e.detail.value))}}} name="WantedY" type="number" placeholder="YCherché"/>
                </IonItem>
                <IonItem color="primary">
                    <IonInput onIonChange={(e) => {if(e.detail.value){setWpLabel(e.detail.value)}}} name="label" type="text" placeholder="Label du point"/>
                </IonItem>
                <IonItem color="primary">
                    <IonInput onIonChange={(e) => {if(e.detail.value){setWpColor(e.detail.value)}}} name="color" type="text" placeholder="Couleur du point"/>
                </IonItem>
                <IonItem color="primary">
                    <IonButton className="centered" color="success" onClick={() => {
                    helpers.addWayPoint(Xend, Yend, wpLabel, wpColor, hauteur, longueur, roomsNumber).then((value) => {
                        gotWaypoints = false
                        if(value){
                            updateWaypoints()
                        }else{
                            setErrorPopover(true)
                        }
                    })
                    }} type="submit">Ajouter</IonButton>
                    <IonButton className="center" onClick={() => {setWpPopover(false)}} color="danger">Annuler</IonButton>
                </IonItem>
            </IonPopover>
            <IonItem lines="none" color="white">
                <IonButton onClick={(e) => {
                    setWpPopover(true);
                }
                } 
                className="addWaypoint">Ajouter un point</IonButton>
            <IonPopover onDidDismiss={() => {setErrorPopover(false)}} showBackdrop={false} cssClass="error" isOpen={errorPopover}>Les coordonnées saisies sont dans un mur impossible de trouver un chemin.</IonPopover>
            </IonItem>
        </Fragment>
}

export default AddWayPoint