import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import '../styles/locationPicker.css';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const DEFAULT_CENTER = { lat: 14.5995, lng: 120.9842 };

const RecenterMap = ({ center }) => {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom(), { animate: true });
        }
    }, [center, map]);

    return null;
};

RecenterMap.propTypes = {
    center: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
    }),
};

const MapEvents = ({ onSelect }) => {
    useMapEvents({
        click: (event) => {
            onSelect(event.latlng);
        },
    });

    return null;
};

MapEvents.propTypes = {
    onSelect: PropTypes.func.isRequired,
};

const LocationPicker = ({ value, onChange, onError }) => {
    const hasValue = Number.isFinite(value?.latitude) && Number.isFinite(value?.longitude);
    const initialPosition = hasValue
        ? { lat: value.latitude, lng: value.longitude }
        : null;
    const [position, setPosition] = useState(initialPosition);
    const [locating, setLocating] = useState(false);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        if (hasValue) {
            setPosition({ lat: value.latitude, lng: value.longitude });
        }
    }, [hasValue, value?.latitude, value?.longitude]);

    const center = useMemo(() => position || DEFAULT_CENTER, [position]);

    const updatePosition = (latlng) => {
        const next = { lat: latlng.lat, lng: latlng.lng };
        setPosition(next);
        onChange({
            latitude: Number(latlng.lat.toFixed(6)),
            longitude: Number(latlng.lng.toFixed(6)),
        });
    };

    const handleLocate = () => {
        if (!navigator.geolocation) {
            onError?.('Geolocation is not supported by this browser.');
            return;
        }

        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                updatePosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setLocating(false);
            },
            (err) => {
                const message = err?.message || 'Unable to access your location.';
                onError?.(message);
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    return (
        <div className="location-picker">
            <div className="location-actions">
                <button
                    type="button"
                    className="location-btn"
                    onClick={handleLocate}
                    disabled={locating}
                >
                    {locating ? 'Detecting location...' : 'Use my current location'}
                </button>
                <p className="location-hint">
                    Click on the map to drop a pin or drag the marker to adjust.
                </p>
            </div>

            <div className={`location-map-shell ${mapReady ? 'ready' : ''}`}>
                {!mapReady && <div className="location-map-loading">Loading map...</div>}
                <MapContainer
                    center={center}
                    zoom={13}
                    scrollWheelZoom
                    className="location-map"
                    whenReady={() => setMapReady(true)}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <RecenterMap center={position} />
                    <MapEvents onSelect={updatePosition} />
                    {position && (
                        <Marker
                            position={position}
                            draggable
                            eventHandlers={{
                                dragend: (event) => {
                                    const latlng = event.target.getLatLng();
                                    updatePosition(latlng);
                                },
                            }}
                        />
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

LocationPicker.propTypes = {
    value: PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
    }),
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func,
};

export default LocationPicker;
