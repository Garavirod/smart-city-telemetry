export interface UsersModel {
  userId: string;
  name: string;
  email: string;
  lastName: string;
  status: boolean;
  online: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  visibleDependencies: Dependencies[];
  isVerified:boolean;
}

export enum UserRole {
  AdminUser="Admin",
  CommonUser="Common",
}

export enum Dependencies {
  LightRail = "light-rail",
  Sensors = "sensors",
  SewersMonitor = "sewers-monitor",
}

export enum ConnectionType {
  OnlineUsers="online_users",
  TrainLocation="train_location",
}

export interface ConnectionModel {
  connectionId:string;
  connectionType: ConnectionType;
}
