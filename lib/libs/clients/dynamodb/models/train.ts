export interface TrainModel {
  trainId: string;
  createdAt: string;
  updatedAt: string;
  velocity:number;
  coords: {
    latitude: number;
    longitude: number;
  };
}
