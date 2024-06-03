export interface TrainModel {
  trainId: string;
  createdAt: string;
  updatedAt: string;
  coords: {
    latitude: number;
    longitude: number;
  };
}
