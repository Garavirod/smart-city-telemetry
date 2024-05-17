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
}

export enum UserRole {
  AdminUser,
  CommonUser,
}

export enum Dependencies {
  LightRail = "light-rail",
  Sensors = "sensors",
  SewersMonitor = "sewers-monitor",
}
