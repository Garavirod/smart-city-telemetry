export interface TrainCoordsModel {
    trainId: string;
    velocity: number;
    coords: {
        latitude:number;
        longitude:number;
    }
}