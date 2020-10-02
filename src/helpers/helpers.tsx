import { AStarFinder, Grid } from 'pathfinding'

const helpers = {
    async createGrid(height:number, length:number, roomsNumber:number){
        const room_length = Math.round(length/roomsNumber)
        // const room_height = Math.round(height/1)
        let matrix:any = []
        for(let i=0;i<height;i++){
            matrix.push([])
        }
        for(let Y=0; Y<height;Y++){
            for(let X=0; X<length; X++){
              let isBuildingWall = (X === 0 || Y === 0 || X === length - 1 || Y === height - 1)
              let isBuildingDoor = (Y === height/2 && X === 0)
              let isRoomWall = ((Y === height / 2 + 1 || Y === height / 2 - 1 || X % room_length === 0) && (Y !== height / 2))
              let isRoomDoor = (X % room_length === 1 && Y !== 0 && X!== 0 && Y !== length - 1 && X !== height - 1)
              if((isBuildingWall || isRoomWall) && (isBuildingDoor === false && isRoomDoor === false)){
                matrix[X].push(1)
              }else{
                matrix[X].push(0)
              }
            }
          }
       
        return matrix
    },

    async searchPath(xStart:number, yStart:number, xEnd:number, yEnd:number, grid:Grid) {
      let finder = new AStarFinder()
      let path = finder.findPath(xStart, yStart, xEnd, yEnd, grid)
      return path
    }
}

export default helpers