import { useRef, useState } from "react";
import "./InputPage.css";

const roomOptions = ["Living Room", "Dining Room", "Master bed Room", "Kids bed Room", "Study Room"];
const windowOptions = ["W1", "W2", "W3", "W4"];
const installationOptions = ["Inside Mounting", "Outside Mounting"];
const curtainOptions = ["Pleated", "Wave", "Eyelet", "Others"];
const measurements = [
    ["heightRight", "Right"], ["heightCentre", "Centre"], ["heightLeft", "Left"],
    ["rodDiameter", "Rod diameter"], ["floorClearance", "Desired floor clearance"],
    ["windowWidth", "Window edge to edge"], ["leftExtension", "Extension beyond opening left"],
    ["rightExtension", "Extension beyond opening right"], ["trackRodWidth", "Track or rod size without finials"],
];
const createWindow = (windowNo) => ({
    id: crypto.randomUUID(), windowNo, installationType: "", curtainType: "",
    heightPosition: "belowRod", floorTarget: "floor",
    ...Object.fromEntries(measurements.flatMap(([key]) => [[key, ""], [`${key}Unit`, "in"]])),
});
const createRoom = () => ({ id: crypto.randomUUID(), room: "", windows: [createWindow("W1")] });
const displayMeasurement = (value, unit) => value === "" ? "—" : `${value} ${unit === "in" ? "in" : "cm"}`;

function InputPage({ onConfirmOrder }) {
    const [orderNo, setOrderNo] = useState("");
    const [rooms, setRooms] = useState([]);
    const [reviewOrder, setReviewOrder] = useState(null);
    const [isReviewing, setIsReviewing] = useState(false);
    const [openRooms, setOpenRooms] = useState({});
    const [openWindows, setOpenWindows] = useState({});
    const roomRefs = useRef({});
    const windowRefs = useRef({});

    const resetReview = () => setReviewOrder(null);
    const scrollTo = (ref) => requestAnimationFrame(() => ref?.scrollIntoView({ behavior: "smooth", block: "start" }));

    const handleAddRoom = () => {
        const room = createRoom();
        setRooms((previous) => [...previous, room]);
        setOpenRooms({ [room.id]: true });
        setOpenWindows({ [room.windows[0].id]: true });
        resetReview();
        scrollTo(roomRefs.current[room.id]);
    };
    const handleRemoveRoom = (roomId) => {
        setRooms((previous) => previous.filter((room) => room.id !== roomId));
        resetReview();
    };
    const handleRoomChange = (roomId, value) => {
        setRooms((previous) => previous.map((room) => room.id === roomId ? { ...room, room: value } : room));
        resetReview();
    };
    const handleAddWindow = (roomId) => {
        let addedWindow;
        setRooms((previous) => previous.map((room) => {
            if (room.id !== roomId) return room;
            const available = windowOptions.find((number) => !room.windows.some((window) => window.windowNo === number));
            if (!available) return room;
            addedWindow = createWindow(available);
            return { ...room, windows: [...room.windows, addedWindow] };
        }));
        if (addedWindow) {
            setOpenRooms((previous) => ({ ...previous, [roomId]: true }));
            setOpenWindows((previous) => ({ ...previous, [roomId]: false, [addedWindow.id]: true }));
            resetReview();
            scrollTo(windowRefs.current[addedWindow.id]);
        }
    };
    const handleRemoveWindow = (roomId, windowId) => {
        setRooms((previous) => previous.map((room) => room.id === roomId ? { ...room, windows: room.windows.filter((window) => window.id !== windowId) } : room));
        resetReview();
    };
    const handleWindowChange = (roomId, windowId, field, value) => {
        setRooms((previous) => previous.map((room) => room.id === roomId ? {
            ...room, windows: room.windows.map((window) => window.id === windowId ? { ...window, [field]: value } : window),
        } : room));
        resetReview();
    };
    const toggleUnit = (roomId, window, field) => {
        const unitField = `${field}Unit`;
        const nextUnit = window[unitField] === "in" ? "cm" : "in";
        const numericValue = Number(window[field]);
        const converted = window[field] === "" ? "" : String(Number((nextUnit === "cm" ? numericValue * 2.54 : numericValue / 2.54).toFixed(2)));
        setRooms((previous) => previous.map((room) => room.id !== roomId ? room : {
            ...room, windows: room.windows.map((item) => item.id === window.id ? { ...item, [field]: converted, [unitField]: nextUnit } : item),
        }));
        resetReview();
    };
    const handleReview = (event) => {
        event.preventDefault();
        const order = {
            orderNo,
            rooms: rooms.map((room) => ({ room: room.room, windows: room.windows.map((window) => ({ ...window })) })),
        };
        setReviewOrder(order);
        setIsReviewing(true);
    };
    const getAvailableRooms = (currentRoomId) => {
        const selected = rooms.filter((room) => room.id !== currentRoomId).map((room) => room.room);
        return roomOptions.filter((room) => !selected.includes(room));
    };
    const toggleRoom = (id) => setOpenRooms((previous) => ({ ...previous, [id]: !previous[id] }));
    const toggleWindow = (id) => setOpenWindows((previous) => ({ ...previous, [id]: !previous[id] }));

    return <main className="input-page"><div className="input-container">
        <header className="input-header"><h1>New Curtain Order</h1><p>Enter the order details, rooms, and window specifications.</p></header>
        {isReviewing ? <section className="review-order">
            <header className="review-header"><h2>Review Order</h2><p>Please verify all the details before confirming this order.</p></header>
            <div className="review-summary"><div><span>Order No.</span><strong>{reviewOrder.orderNo}</strong></div><div><span>Total Rooms</span><strong>{reviewOrder.rooms.length}</strong></div><div><span>Total Windows</span><strong>{reviewOrder.rooms.reduce((total, room) => total + room.windows.length, 0)}</strong></div></div>
            <div className="review-rooms">{reviewOrder.rooms.map((room, ri) => <section className="review-room-card" key={ri}>
                <h3>{room.room}</h3><div className="review-windows">{room.windows.map((window) => <div className="review-window-card" key={window.windowNo}>
                    <h4>{window.windowNo}</h4>
                    <div className="review-detail"><span>Installation Type</span><strong>{window.installationType || "—"}</strong></div>
                    <div className="review-detail"><span>Type of Curtain</span><strong>{window.curtainType || "—"}</strong></div>
                    <div className="review-detail"><span>Height position</span><strong>{window.heightPosition === "belowRod" ? "Below rod or track" : "Above rod"}</strong></div>
                    <div className="review-detail"><span>Height measurements</span><strong>Right {displayMeasurement(window.heightRight, window.heightRightUnit)} · Centre {displayMeasurement(window.heightCentre, window.heightCentreUnit)} · Left {displayMeasurement(window.heightLeft, window.heightLeftUnit)}</strong></div>
                    <div className="review-detail"><span>Rod diameter</span><strong>{displayMeasurement(window.rodDiameter, window.rodDiameterUnit)}</strong></div>
                    <div className="review-detail"><span>Length target / floor clearance</span><strong>{window.floorTarget === "floor" ? "Till floor" : "Till window sill"} · {displayMeasurement(window.floorClearance, window.floorClearanceUnit)}</strong></div>
                    <div className="review-detail"><span>Width measurements</span><strong>Edge to edge {displayMeasurement(window.windowWidth, window.windowWidthUnit)} · Left extension {displayMeasurement(window.leftExtension, window.leftExtensionUnit)} · Right extension {displayMeasurement(window.rightExtension, window.rightExtensionUnit)} · Track/rod {displayMeasurement(window.trackRodWidth, window.trackRodWidthUnit)}</strong></div>
                </div>)}</div>
            </section>)}</div>
            <div className="review-actions"><button type="button" className="back-to-edit" onClick={() => setIsReviewing(false)}>Back to Edit</button><button type="button" className="confirm-order" onClick={() => onConfirmOrder(reviewOrder)}>Confirm Order</button></div>
        </section> : <form className="order-form" onSubmit={handleReview}>
            <div className="form-group order-number-group"><label htmlFor="orderNo">Order No.</label><input id="orderNo" value={orderNo} onChange={(event) => { setOrderNo(event.target.value); resetReview(); }} placeholder="e.g. ORD-001" required /></div>
            <div className="rooms-section">{rooms.map((room, roomIndex) => <section className={`room-card ${openRooms[room.id] ? "is-open" : "is-collapsed"}`} key={room.id} ref={(element) => { roomRefs.current[room.id] = element; }}>
                <div className="room-header"><button type="button" className="collapse-heading room-collapse" aria-expanded={!!openRooms[room.id]} onClick={() => toggleRoom(room.id)}>{openRooms[room.id] ? "⌄" : "›"} {room.room || `Room ${roomIndex + 1}`}</button>
                    {openRooms[room.id] && <select aria-label={`Select room ${roomIndex + 1}`} value={room.room} onChange={(event) => handleRoomChange(room.id, event.target.value)} required><option value="">Select Room</option>{getAvailableRooms(room.id).map((name) => <option key={name} value={name}>{name}</option>)}</select>}
                    <button type="button" className="remove-button" onClick={() => handleRemoveRoom(room.id)}>Remove Room</button>
                </div>
                {openRooms[room.id] && <>
                    <div className="windows-section">{room.windows.map((window) => <div className={`window-card ${openWindows[window.id] ? "is-open" : "is-collapsed"}`} key={window.id} ref={(element) => { windowRefs.current[window.id] = element; }}>
                        <div className="window-header"><button type="button" className="collapse-heading" aria-expanded={!!openWindows[window.id]} onClick={() => toggleWindow(window.id)}>{openWindows[window.id] ? "⌄" : "›"} {window.windowNo}</button>{room.windows.length > 1 && <button type="button" className="remove-button" onClick={() => handleRemoveWindow(room.id, window.id)}>Remove Window</button>}</div>
                        {openWindows[window.id] && <div className="window-fields">
                            <div className="window-identifiers">
                                <div className="form-group"><label htmlFor={`windowNo-${window.id}`}>Window No.</label><select id={`windowNo-${window.id}`} value={window.windowNo} onChange={(e) => handleWindowChange(room.id, window.id, "windowNo", e.target.value)}>{windowOptions.filter((n) => !room.windows.some((other) => other.windowNo === n && other.id !== window.id)).map((n) => <option key={n}>{n}</option>)}</select></div>
                                <div className="form-group"><label htmlFor={`installation-${window.id}`}>Installation Type</label><select id={`installation-${window.id}`} value={window.installationType} onChange={(e) => handleWindowChange(room.id, window.id, "installationType", e.target.value)} required><option value="">Select One</option>{installationOptions.map((value) => <option key={value}>{value}</option>)}</select></div>
                                <div className="form-group"><label htmlFor={`curtain-${window.id}`}>Type of Curtain</label><select id={`curtain-${window.id}`} value={window.curtainType} onChange={(e) => handleWindowChange(room.id, window.id, "curtainType", e.target.value)} required><option value="">Select One</option>{curtainOptions.map((value) => <option key={value}>{value}</option>)}</select></div>
                            </div>
                            <section className="measurement-section"><h4>Curtain Height</h4><fieldset className="choice-row"><legend>Measurement reference</legend><label><input type="radio" name={`heightPosition-${window.id}`} checked={window.heightPosition === "belowRod"} onChange={() => handleWindowChange(room.id, window.id, "heightPosition", "belowRod")} /> Below rod or track</label><label><input type="radio" name={`heightPosition-${window.id}`} checked={window.heightPosition === "aboveRod"} onChange={() => handleWindowChange(room.id, window.id, "heightPosition", "aboveRod")} /> Above rod</label></fieldset>
                                <div className="measurement-grid">{measurements.slice(0, 3).map(([field, label]) => <MeasurementInput key={field} window={window} field={field} label={label} roomId={room.id} onChange={handleWindowChange} onToggle={toggleUnit} />)}</div>
                                <MeasurementInput window={window} field="rodDiameter" label="If rod: diameter" roomId={room.id} onChange={handleWindowChange} onToggle={toggleUnit} />
                                <fieldset className="choice-row"><legend>Curtain length</legend><label><input type="radio" name={`floorTarget-${window.id}`} checked={window.floorTarget === "floor"} onChange={() => handleWindowChange(room.id, window.id, "floorTarget", "floor")} /> Till floor</label><label><input type="radio" name={`floorTarget-${window.id}`} checked={window.floorTarget === "sill"} onChange={() => handleWindowChange(room.id, window.id, "floorTarget", "sill")} /> Till window sill</label></fieldset>
                                <MeasurementInput window={window} field="floorClearance" label="Desired floor clearance" roomId={room.id} onChange={handleWindowChange} onToggle={toggleUnit} />
                            </section>
                            <section className="measurement-section"><h4>Curtain Width</h4><div className="measurement-grid">{measurements.slice(5).map(([field, label]) => <MeasurementInput key={field} window={window} field={field} label={label} roomId={room.id} onChange={handleWindowChange} onToggle={toggleUnit} />)}</div></section>
                        </div>}
                    </div>)}
                    {room.windows.length < windowOptions.length && <button type="button" className="add-window-button" onClick={() => handleAddWindow(room.id)}>+ Add Window</button>}</div>
                </>}
            </section>)}</div>
            {rooms.length < roomOptions.length && <button type="button" className="add-room-button" onClick={handleAddRoom}>+ Add Room</button>}
            <button type="submit" className="submit-order" disabled={rooms.length === 0}>Review Order</button>
        </form>}
    </div></main>;
}

function MeasurementInput({ window, field, label, roomId, onChange, onToggle }) {
    const unit = window[`${field}Unit`];
    return <div className="measurement-input"><label htmlFor={`${field}-${window.id}`}>{label}</label><div className="measurement-control"><input type="number" id={`${field}-${window.id}`} value={window[field]} onChange={(event) => onChange(roomId, window.id, field, event.target.value)} min="0" step="any" placeholder="Enter measurement" /><button type="button" className={`unit-toggle ${unit === "cm" ? "is-cm" : ""}`} onClick={() => onToggle(roomId, window, field)} aria-label={`Switch ${label} unit to ${unit === "in" ? "centimetres" : "inches"}`}><span>In</span><span>Cm</span><i /></button></div></div>;
}

export default InputPage;
