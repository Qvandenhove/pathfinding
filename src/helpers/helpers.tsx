import { AStarFinder, Grid } from 'pathfinding'
import firebase from 'firebase'

var firebaseConfig = {
  apiKey: "AIzaSyAr2ARyw2PBu7i9l_dvRAgl3X4cgE0Voi4",
  authDomain: "satisfaction-7bbc4.firebaseapp.com",
  databaseURL: "https://satisfaction-7bbc4.firebaseio.com",
  projectId: "satisfaction-7bbc4",
  storageBucket: "satisfaction-7bbc4.appspot.com",
  messagingSenderId: "88882724595",
  appId: "1:88882724595:web:bedad5758bec2ce8420186"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()

const helpers = {
    async createGrid(height:number, length:number, roomsNumber:number){
        const room_length = Math.round(length/roomsNumber)
        let matrix:any = []
        for(let i=0;i<height;i++){
            matrix.push([])
        }
        for(let yEnd=0; yEnd<height;yEnd++){
            for(let xEnd=0; xEnd<length; xEnd++){
              let isBuildingWall = (xEnd === 0 || yEnd === 0 || xEnd === length - 1 || yEnd === height - 1)
              let isBuildingDoor = (yEnd === height/2 && xEnd === 0)
              let isRoomWall = ((yEnd === height / 2 + 1 || yEnd === height / 2 - 1 || xEnd % room_length === 0) && (yEnd !== height / 2))
              let isRoomDoor = (xEnd % room_length === 1 && yEnd !== 0 && xEnd!== 0 && yEnd !== length - 1 && xEnd !== height - 1)
              if((isBuildingWall || isRoomWall) && (isBuildingDoor === false && isRoomDoor === false)){
                matrix[xEnd].push(1)
              }else{
                matrix[xEnd].push(0)
              }
            }
          }
       
        return matrix
    },

    async searchPath(xStart:number, yStart:number, xEnd:number, yEnd:number, grid:Grid) {
      let finder = new AStarFinder()
      let path
      path = finder.findPath(xStart, yStart, xEnd, yEnd, grid)
      return path
    },

    async getWaypoints(){
      let wayPointsList = await db.collection("Waypoints").get()
      let WayPoints:any = []
      wayPointsList.forEach((wayPoint) => {
        WayPoints.push({datas: wayPoint.data(), id: wayPoint.id})
      })
      return WayPoints
    },

    async getWaypoint(pointId:string){
      let waypoint
      if(pointId !== ""){
        waypoint = await (await db.collection("Waypoints").doc(pointId).get()).data()
      }else{
        return
      }
      return waypoint
    },
    async addWayPoint(X:number, Y:number, label:string, color:string, height:number, length:number, roomsNumber:number){
      const room_length = Math.round(length/roomsNumber)
      let isBuildingWall = (X - 1 === 0 || Y - 1 === 0 || X - 1 === length - 1 || Y - 1 === height - 1)
      let isBuildingDoor = (Y - 1 === height/2 && X - 1 === 0)
      let isRoomWall = ((Y - 1 === height / 2 + 1 || Y - 1 === height / 2 - 1 || X - 1 % room_length === 0) && (Y - 1 !== height / 2))
      let isRoomDoor = (X - 1 % room_length === 1 && Y - 1 !== 0 && X - 1!== 0 && Y - 1 !== length - 1 && X - 1 !== height - 1)
      if (((!isBuildingWall && !isRoomWall) || isBuildingDoor || isRoomDoor) && label && color && height > 0 && length > 0 && roomsNumber > 0){
        await db.collection("Waypoints").doc().set({
          "X": X,
          "Y": Y,
          "color":color,
          "label": label
        })
        return true
      }else{
        return false
      }
        
      }
}

export default helpers