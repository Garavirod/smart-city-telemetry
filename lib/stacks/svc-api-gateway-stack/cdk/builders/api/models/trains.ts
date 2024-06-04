export interface TrainCoordsModel {
    idTrain: string;
    velocity: number;
    coords: {
        latitude:number;
        longitude:number;
    }
}