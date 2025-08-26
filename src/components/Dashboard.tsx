import { useSelector } from 'react-redux';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Plane, 
  Clock, 
  Users, 
  Building2, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Gauge,
  Timer,
  User
} from 'lucide-react';
import type { RootState } from '@/store';


function Dashboard() {
  const { history, latest } = useSelector((state: RootState) => state.drone);
  const displayData = history;

  // Calculate statistics
  const totalDrones = displayData.length;
  const activeDrones = displayData.filter(d => d.features[0].properties.registration.startsWith('SD-B')).length;
  const offlineDrones = totalDrones - activeDrones;
  const uniquePilots = new Set(displayData.map(d => d.features[0]?.properties.pilot).filter(Boolean)).size;
  const averageAltitude = totalDrones > 0 ? displayData.reduce((sum, d) => sum + (d.features[d.features.length - 1]?.properties.altitude || 0), 0) / totalDrones : 0;
  const totalFlightTime = displayData.reduce((sum, d) => sum + (Date.now() - d.flightStartTime), 0);

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getFlightDuration = (startTime: number) => {
    const duration = Date.now() - startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-dvh overflow-y-scroll bg-primary p-6 border-t-4 border-dashboard pb-32">
      <div className="max-w-7xl mx-auto space-y-6">
        {displayData.length === 0 ? (
          <div className="text-center py-12">
            <Plane className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2 text-primary-foreground">No Drone Data Available</h2>
            <p className="text-muted-foreground">Connect your drones to start monitoring fleet operations.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-primary-foreground">Drone Operations Dashboard</span>
                <span className="ml-4 text-muted-foreground mt-1">Real-time fleet monitoring and analytics</span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Active Drones */}
              <div className="border border-dashboard bg-secondary px-6 py-4 rounded-none ">
                <div className="flex flex-row items-center justify-between pb-2">
                  <span className="text-sm font-medium text-primary-foreground">Active Drones</span>
                  <Plane className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-primary-foreground">{activeDrones}</div>
                <p className="text-xs text-muted-foreground">
                  {totalDrones > 0 ? Math.round((activeDrones / totalDrones) * 100) : 0}% of fleet online
                </p>
              </div>
              {/* Total Fleet */}
              <div className="border border-dashboard bg-secondary px-6 py-4 rounded-none ">
                <div className="flex flex-row items-center justify-between pb-2">
                  <span className="text-sm font-medium text-primary-foreground">Total Fleet</span>
                  <Activity className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-primary-foreground">{totalDrones}</div>
                <p className="text-xs text-muted-foreground">
                  {offlineDrones} Offline, {activeDrones} Online
                </p>
              </div>
              {/* Active Pilots */}
              <div className="border border-dashboard bg-secondary px-6 py-4 rounded-none ">
                <div className="flex flex-row items-center justify-between pb-2">
                  <span className="text-sm font-medium text-primary-foreground">Active Pilots</span>
                  <Users className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-primary-foreground">{uniquePilots}</div>
                <p className="text-xs text-muted-foreground">Certified operators</p>
              </div>
              {/* Avg Altitude */}
              <div className="border border-dashboard bg-secondary px-6 py-4 rounded-none ">
                <div className="flex flex-row items-center justify-between pb-2">
                  <span className="text-sm font-medium text-primary-foreground">Avg Altitude</span>
                  <Gauge className="h-4 w-4 text-accent" />
                </div>
                <div className="text-2xl font-bold text-primary-foreground">{averageAltitude.toFixed(1)}m</div>
                <p className="text-xs text-muted-foreground">Current fleet average</p>
              </div>
            </div>

            {/* Fleet Status and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fleet Status */}
              <div className="border border-dashboard bg-secondary px-6 py-4 rounded-none ">
                <div className="flex items-center gap-2 text-primary-foreground text-lg font-semibold mb-1">
                  <Activity className="w-5 h-5" />
                  Fleet Status Overview
                </div>
                <div className="text-sm text-muted-foreground mb-4">Current operational status of all registered drones</div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary-foreground">Operational Status</span>
                  <span className="text-sm text-muted-foreground">{activeDrones}/{totalDrones} active</span>
                </div>
                <Progress value={(activeDrones / totalDrones) * 100} className="h-2" />
                <div className="my-3 border-t border-dashboard" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-primary-foreground">Online</span>
                    </div>
                    <Badge variant="default">{activeDrones}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      <span className="text-sm text-primary-foreground">Offline</span>
                    </div>
                    <Badge variant="default">{offlineDrones}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-primary-foreground" />
                      <span className="text-sm text-primary-foreground">Total Flight Time</span>
                    </div>
                    <span className="text-sm font-medium text-primary-foreground">{formatDuration(totalFlightTime)}</span>
                  </div>
                </div>
              </div>
              {/* Recent Activity */}
              <div className="border border-dashboard bg-secondary px-6 py-4 rounded-none ">
                <div className="flex items-center gap-2 text-primary-foreground text-lg font-semibold mb-1">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </div>
                <div className="text-sm text-muted-foreground mb-4">Latest drone operation</div>
                {latest && latest.features && latest.features.length > 0 && (() => {
                  const feature = latest.features[latest.features.length - 1];
                  if (!feature) return null;
                  const isActive = feature.properties.registration.startsWith('SD-B');
                  return (
                    <div key={feature.properties.registration} className="p-6 bg-primary grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-2xl text-primary-foreground">{feature.properties.Name}</span>
                          <Badge variant='default' className={`text-xs px-2 py-1 ${isActive ? "bg-green-400" : "bg-red-500"}`}>
                            {isActive ? "Online" : "Offline"}
                          </Badge>
                          <span className={`w-3 h-3 rounded-full ${isActive ? "bg-green-400" : "bg-red-500"}`} />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Pilot:</div>
                          <div className="text-primary-foreground">{feature.properties.pilot}</div>
                          <div className="text-muted-foreground">Registration:</div>
                          <div className="text-primary-foreground">{feature.properties.registration}</div>
                          <div className="text-muted-foreground">Organization:</div>
                          <div className="text-primary-foreground">{feature.properties.organization}</div>
                          <div className="text-muted-foreground">Serial:</div>
                          <div className="text-primary-foreground font-mono text-xs">{feature.properties.serial}</div>
                          <div className="text-muted-foreground">Coordinates:</div>
                          <div className="text-primary-foreground font-mono text-xs">{feature.geometry.coordinates.join(', ')}</div>
                          <div className="text-muted-foreground">Yaw:</div>
                          <div className="text-primary-foreground">{feature.properties.yaw}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-bold text-primary-foreground">{feature.properties.altitude}m</span>
                          <span className="text-xs text-muted-foreground">Altitude</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-bold text-primary-foreground">{getFlightDuration(latest.flightStartTime)}</span>
                          <span className="text-xs text-muted-foreground">Flight Time</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-bold text-primary-foreground">{formatTime(latest.flightStartTime)}</span>
                          <span className="text-xs text-muted-foreground">Start Time</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Detailed Drone List */}
            <div className="border border-dashboard bg-secondary px-6 py-4 rounded-none ">
              <div className="flex items-center gap-2 text-primary-foreground text-lg font-semibold mb-1">
                <Plane className="w-5 h-5" />
                Drone Fleet Management
              </div>
              <div className="text-sm text-muted-foreground mb-4">Complete overview of all registered drones and their current status</div>
              <div className="space-y-4">
                {displayData.map((drone) => {
                  const feature = drone.features[0];
                  if (!feature) return null;
                  const isActive = feature.properties.registration.startsWith('SD-B');
                  return (
                    <div key={feature.properties.registration} className="bg-primary p-4 mb-2">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-primary-foreground">{feature.properties.Name}</h3>
                            <Badge variant={'default'} className={`${isActive ? "bg-green-400" : "bg-red-500"}`}>
                              {isActive ? "Online" : "Offline"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Registration: {feature.properties.registration}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary-foreground">{feature.properties.altitude}m</div>
                          <div className="text-sm text-muted-foreground">Altitude</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Pilot:</span>
                          <span className="text-primary-foreground">{feature.properties.pilot}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Org:</span>
                          <span className="text-primary-foreground">{feature.properties.organization}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Timer className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Flight Time:</span>
                          <span className="text-primary-foreground">{getFlightDuration(drone.flightStartTime)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;