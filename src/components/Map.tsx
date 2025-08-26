import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import Panel from './DronePanel';
import log from 'loglevel';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { getDurationString } from '@/utils';
import { Button } from './ui/button';
import { setSelectedDrone } from '@/features/drone/droneSlice';

function Map() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [panelOpen, setPanelOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const latestMovingDrone = useSelector((state: RootState) => state.drone.latest);
  const selectedDroneRegistration = useSelector((state: RootState) => state.drone.selectedDroneRegistration);
  const options = useSelector((state: RootState) => state.options);
  const droneHistory = useSelector((state: RootState) => state.drone.history);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!import.meta.env.VITE_MAPBOX_PUBLIC_KEY) {
      const storedKey = localStorage.getItem('userMapboxKey');
      if (!storedKey) {
        setError("No Mapbox public key found. Please enter your Mapbox public key.");
      }
    }
  }, []);

  // Handler for user-provided Mapbox key
  function handleMapboxKeySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('mapboxKey') as HTMLInputElement;
    const key = input.value.trim();
    if (key) {
      localStorage.setItem('userMapboxKey', key);
      setError(null);
      window.location.reload();
    }
  }

  // This effect is responsible for initializing the map
  useEffect(() => {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_PUBLIC_KEY ||
        localStorage.getItem('userMapboxKey') ||
        '';

      if (mapContainerRef.current && mapboxgl.accessToken) {
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/tawalaith/cmepvpdxx007i01s80br11fnx',
          center: [35.833615, 31.971666], // Business Park
          zoom: 14,
        });

        mapRef.current.on('load', () => {
          setMapLoaded(true);
          log.info('Mapbox map loaded initially');
        });

        mapRef.current.on('error', (e: mapboxgl.ErrorEvent) => {
          log.error('Mapbox error:', e.error);
          setError("Failed to load the map. Please check your network connection. Ensure correct mapbox public key is provided as well.");
        });
      }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    }
  }, []);

  // This effect handles the logic for cancelling drone selection when the map is dragged
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const handleDrag = () => {
      dispatch(setSelectedDrone(null));
    };

    mapRef.current.off('drag', handleDrag);

    if (options.cancelSelectionOnMapDrag) {
      mapRef.current.on('drag', handleDrag);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.off('drag', handleDrag);
      }
    };
  }, [dispatch, mapLoaded, options.cancelSelectionOnMapDrag]);

  // This effect handles updates to the latest moving drone, drawing its path and updating its marker
  useEffect(() => {
    if (!mapRef.current || !latestMovingDrone || !mapLoaded) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any)._droneMarkers) (window as any)._droneMarkers = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalMarkers = (window as any)._droneMarkers as Record<string, mapboxgl.Marker>;
    
    const reg = latestMovingDrone.features[0].properties.registration;
    const coords = latestMovingDrone.features.map(f => f.geometry.coordinates);
    const lineSourceId = `drone-line-${reg}`;
    const lineLayerId = `drone-line-${reg}`;

    const lastCoord = coords[coords.length - 1];
    const markerId = `drone-marker-${reg}`;
    const props = latestMovingDrone.features[latestMovingDrone.features.length - 1].properties;

    if (coords.length > 1) {
      if (mapRef.current!.getSource(lineSourceId)) {
        // Update existing line (Layer already exists) 
        (mapRef.current!
          .getSource(lineSourceId) as mapboxgl.GeoJSONSource)
          .setData({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: coords },
            properties: {},
          });
      } else {
        mapRef.current!
          .addSource(lineSourceId, { // Otherise, add new source (line) and layer (to show on map)
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: { type: 'LineString', coordinates: coords },
              properties: {},
            },
          });
        
        mapRef.current!
          .addLayer({ // Adding it to the map view
            id: lineLayerId,
            type: 'line',
            source: lineSourceId,
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 
              'line-color': props.registration.startsWith("SD-B") ? "#00ff00" : "#f9000e",
              'line-width': 3,
              'line-emissive-strength': 1 },
          }, mapRef.current!.getStyle().layers?.find(l => l.id === 'road-label')?.id || undefined);
      }
    }

    // Marker logic
    function buildPopupContent(durationStr: string) {
      return `
        <div class="bg-primary text-primary-foreground p-3 pb-2 rounded-xl min-w-[170px] shadow-lg relative text-left">
          <div class="font-bold text-base mb-1.5">${props.Name}</div>
          <div class="flex justify-between gap-4 mb-0.5 text-[0.95em] opacity-85">
            <div>Altitude</div>
            <div>Flight Time</div>
          </div>
          <div class="flex justify-between gap-4 font-mono text-[1.08em]">
            <div>${props.altitude} m</div>
            <div>${durationStr}</div>
          </div>
        </div>
        <style>
          .mapboxgl-popup-content { background: transparent !important; box-shadow: none !important; padding: 0 !important; }
          .mapboxgl-popup-tip { display: none !important; }
        </style>
      `;
    }

    const popup = new mapboxgl.Popup({ offset: 20 }).setHTML(buildPopupContent(getDurationString(latestMovingDrone.flightStartTime)));
    
    function updatePopup() {
      popup.setHTML(buildPopupContent(getDurationString(latestMovingDrone!.flightStartTime)));
    }
    
    let intervalId: number | null = null;
    
    popup.on('open', () => {
      updatePopup();
      intervalId = setInterval(updatePopup, 1000);
    });

    popup.on('close', () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = null;
    });
    
    let marker = globalMarkers[markerId];
    if (!marker) {
      const el = document.createElement('div');

      el.id = markerId;
      el.className = '';
      el.innerHTML = `
        <div class="relative flex items-center justify-center h-7 w-7">

          <div class="absolute -top-3 left-1/2 -translate-x-1/2">
            <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] ${props.registration.startsWith("SD-B") ? "border-b-green-500" : "border-b-red-500"}" style="margin-bottom:2px; border-radius:2px;">
            </div>
          </div>

          <div class="rounded-full ${props.registration.startsWith("SD-B") ? "bg-green-500" : "bg-red-500"} h-7 w-7 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 object-contain invert lucide lucide-drone-icon lucide-drone"><path d="M10 10 7 7"/><path d="m10 14-3 3"/><path d="m14 10 3-3"/><path d="m14 14 3 3"/><path d="M14.205 4.139a4 4 0 1 1 5.439 5.863"/><path d="M19.637 14a4 4 0 1 1-5.432 5.868"/><path d="M4.367 10a4 4 0 1 1 5.438-5.862"/><path d="M9.795 19.862a4 4 0 1 1-5.429-5.873"/><rect x="10" y="8" width="4" height="8" rx="1"/></svg>
          </div>

        </div>
      `;

      el.style.cursor = 'pointer';

      marker = new mapboxgl.Marker(el)
        .setLngLat(lastCoord)
        .addTo(mapRef.current!)
        .setPopup(popup)
        .setRotationAlignment('map')
        .setRotation(props.yaw);
      
      marker.getElement().addEventListener('click', () => {
        dispatch(setSelectedDrone(reg));
      });

      globalMarkers[markerId] = marker;
    } 
    else {
      // Animate marker movement
      const start = marker.getLngLat();
      const end = { lng: lastCoord[0], lat: lastCoord[1] };
      let startTime: number | null = null;
      const duration = 600; // ms
      function animateMarker(ts: number) {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        const lng = start.lng + (end.lng - start.lng) * progress;
        const lat = start.lat + (end.lat - start.lat) * progress;
        marker.setLngLat([lng, lat]).setRotation(props.yaw);
        if (progress < 1) {
          requestAnimationFrame(animateMarker);
        }
      }

      requestAnimationFrame(animateMarker);
    }
  }, [dispatch, latestMovingDrone, mapLoaded]);

  // This effect handles showing/hiding paths and markers based on options and selected drone
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalMarkers = (window as any)._droneMarkers as Record<string, mapboxgl.Marker>;
    const allRegistrations = droneHistory.map(d => d.features[0].properties.registration);

    if (options.showSelectedPathOnly && selectedDroneRegistration) {
      allRegistrations.forEach(reg => {
        const lineLayerId = `drone-line-${reg}`;
        if (mapRef.current!.getLayer(lineLayerId)) {
          mapRef.current!.setLayoutProperty(lineLayerId, 'visibility', reg === selectedDroneRegistration ? 'visible' : 'none');
        }
        const markerId = `drone-marker-${reg}`;
        const marker = globalMarkers ? globalMarkers[markerId] : null;
        if (marker) {
          const markerElement = marker.getElement();
          if (markerElement) {
            markerElement.style.display = reg === selectedDroneRegistration ? 'block' : 'none';
          }
        }
      });
    }

    if (!options.showSelectedPathOnly || (options.showSelectedPathOnly && !selectedDroneRegistration))  {
      allRegistrations.forEach(reg => {
        const lineLayerId = `drone-line-${reg}`;
        if (mapRef.current!.getLayer(lineLayerId)) {
          mapRef.current!.setLayoutProperty(lineLayerId, 'visibility', 'visible');
        }
        const markerId = `drone-marker-${reg}`;
        const marker = globalMarkers ? globalMarkers[markerId] : null;
        if (marker) {
          const markerElement = marker.getElement();
          if (markerElement) {
            markerElement.style.display = 'block';
          }
        }
      });
    }

  }, [options, selectedDroneRegistration, droneHistory, mapLoaded]);

  // This effect recenters the map when a drone is selected from the panel
  useEffect(() => {
    // Only flyTo if map is loaded and a drone is selected
    if (!mapRef.current || !selectedDroneRegistration || !mapLoaded) return;

    const drone = droneHistory.find(d => d.features[0].properties.registration === selectedDroneRegistration);

    if (!drone) return;

    const coords = drone.features[drone.features.length - 1].geometry.coordinates;

    mapRef.current.flyTo({ center: coords, zoom: 14, speed: 1.2 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedDroneRegistration,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    droneHistory.find(d => d.features[0].properties.registration === selectedDroneRegistration)?.features.length
  ]);

  if (error) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary z-20 border-2 border-primary">
        <div className="text-destructive font-bold text-lg mb-2 drop-shadow">{error}</div>
        <form onSubmit={handleMapboxKeySubmit} className="flex flex-col gap-2">
          <input
            type="text"
            name="mapboxKey"
            placeholder="Enter your Mapbox public key"
            className="border p-2 rounded"
            required
          />
          <Button type="submit" variant="default" className='hover:cursor-pointer'>
            Save Key & Reload
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full" id='map-container' ref={mapContainerRef} />
      {panelOpen && !error && (
        <Panel onClose={() => setPanelOpen(false)} />
      )}

      {!panelOpen && !error && (
      <div className="absolute h-[80%]  top-2 left-2 z-50">
        <Button className='text-primary-foreground' variant={'destructive'} onClick={() => setPanelOpen(true)}>
          <b>Show Drones Panel</b>
        </Button>
      </div>
    )}

      {!error && (
      <div className="absolute bottom-6 right-6 z-50">
        <div className="flex items-center bg-[#E0E0E0] rounded-2xl px-4 py-2 shadow-md">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#23272A] mr-3">
          <span className="text-white font-bold text-lg">
          {droneHistory.filter(
            d => d.features[d.features.length - 1].properties.registration.startsWith('SD-B')
          ).length}
          </span>
        </div>
        <span className="text-[#23272A] text-base font-medium">Drone Flying</span>
        </div>
      </div>
      )}
    </div>
  )
}

export default Map;