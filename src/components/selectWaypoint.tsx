import { IonSelectOption } from '@ionic/react'
import React, { Fragment } from 'react'

interface selectWaypointsProps{
    waypoints:any
    stateSetter:any
}

const SelectWaypoints:React.FC<selectWaypointsProps> = ({waypoints}) => {
    return <Fragment>
        {waypoints.map((waypoint:any) => {return <IonSelectOption value={waypoint.id}>{waypoint.datas.label}</IonSelectOption>})}
    </Fragment>
}

export default SelectWaypoints