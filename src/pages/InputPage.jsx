import { useState } from "react";
import "./InputPage.css";
import OutputPage from "./OutputPage";

const roomOptions = [
    "Living Room",
    "Dining Room",
    "Master bed Room",
    "Kids bed Room",
    "Study Room",
];

const windowOptions = ["W1", "W2", "W3", "W4"];

const installationOptions = [
    "Inside Mounting",
    "Outside Mounting",
];

const curtainOptions = [
    "Pleated",
    "Wave",
    "Eyelet",
    "Others",
];

const createWindow = (windowNo) => ({
    id: crypto.randomUUID(),
    windowNo,
    installationType: "",
    curtainType: "",
    curtainHeight: "",
});

const createRoom = () => ({
    id: crypto.randomUUID(),
    room: "",
    windows: [createWindow("W1")],
});

function InputPage() {
    const [orderNo, setOrderNo] = useState("");
    const [rooms, setRooms] = useState([]);
    const [reviewOrder, setReviewOrder] = useState(null);
    const [isReviewing, setIsReviewing] = useState(false);
    const [submittedOrder, setSubmittedOrder] = useState(null);

    // Add a new room
    const handleAddRoom = () => {
        setRooms((prevRooms) => [
            ...prevRooms,
            createRoom(),
        ]);

        setSubmittedOrder(null);
    };

    // Remove a room
    const handleRemoveRoom = (roomId) => {
        setRooms((prevRooms) =>
            prevRooms.filter((room) => room.id !== roomId)
        );

        setSubmittedOrder(null);
    };

    // Update the selected room
    const handleRoomChange = (roomId, value) => {
        setRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.id === roomId
                    ? { ...room, room: value }
                    : room
            )
        );

        setSubmittedOrder(null);
    };

    // Add a window to a room
    const handleAddWindow = (roomId) => {
        setRooms((prevRooms) =>
            prevRooms.map((room) => {
                if (room.id !== roomId) {
                    return room;
                }

                const availableWindow = windowOptions.find(
                    (windowNo) =>
                        !room.windows.some(
                            (window) => window.windowNo === windowNo
                        )
                );

                if (!availableWindow) {
                    return room;
                }

                return {
                    ...room,
                    windows: [
                        ...room.windows,
                        createWindow(availableWindow),
                    ],
                };
            })
        );

        setSubmittedOrder(null);
    };

    // Remove a window from a room
    const handleRemoveWindow = (roomId, windowId) => {
        setRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.id === roomId
                    ? {
                        ...room,
                        windows: room.windows.filter(
                            (window) => window.id !== windowId
                        ),
                    }
                    : room
            )
        );

        setSubmittedOrder(null);
    };

    // Update window details
    const handleWindowChange = (
        roomId,
        windowId,
        field,
        value
    ) => {
        setRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.id === roomId
                    ? {
                        ...room,
                        windows: room.windows.map((window) =>
                            window.id === windowId
                                ? {
                                    ...window,
                                    [field]: value,
                                }
                                : window
                        ),
                    }
                    : room
            )
        );

        setSubmittedOrder(null);
    };


    const handleReview = (event) => {
        event.preventDefault();

        const order = {
            orderNo,
            rooms: rooms.map((room) => ({
                room: room.room,
                windows: room.windows.map((window) => ({
                    windowNo: window.windowNo,
                    installationType: window.installationType,
                    curtainType: window.curtainType,
                    curtainHeight: Number(window.curtainHeight),
                })),
            })),
        };

        setReviewOrder(order);
        setIsReviewing(true);
    };

    const handleConfirmOrder = () => {
        setSubmittedOrder(reviewOrder);
        setIsReviewing(false);

        console.log("Confirmed order:", reviewOrder);
    };


    // Prevent duplicate room selections
    const getAvailableRooms = (currentRoomId) => {
        const selectedRooms = rooms
            .filter((room) => room.id !== currentRoomId)
            .map((room) => room.room);

        return roomOptions.filter(
            (room) => !selectedRooms.includes(room)
        );
    };

    if (submittedOrder) {
        return (
            <OutputPage
                order={submittedOrder}
                onBack={() => setSubmittedOrder(null)}
            />
        );
    }

    return (
        <main className="input-page">
            <div className="input-container">

                <header className="input-header">
                    <h1>New Curtain Order</h1>
                    <p>
                        Enter the order details, rooms, and
                        window specifications.
                    </p>
                </header>

                {isReviewing ? (
                    <section className="review-order">

                        <header className="review-header">
                            <h2>Review Order</h2>
                            <p>
                                Please verify all the details before confirming
                                this order.
                            </p>
                        </header>

                        <div className="review-summary">
                            <div>
                                <span>Order No.</span>
                                <strong>{reviewOrder.orderNo}</strong>
                            </div>

                            <div>
                                <span>Total Rooms</span>
                                <strong>{reviewOrder.rooms.length}</strong>
                            </div>

                            <div>
                                <span>Total Windows</span>
                                <strong>
                                    {reviewOrder.rooms.reduce(
                                        (total, room) =>
                                            total + room.windows.length,
                                        0
                                    )}
                                </strong>
                            </div>
                        </div>

                        <div className="review-rooms">

                            {reviewOrder.rooms.map((room, roomIndex) => (

                                <section
                                    className="review-room-card"
                                    key={roomIndex}
                                >

                                    <h3>{room.room}</h3>

                                    <div className="review-windows">

                                        {room.windows.map((window, windowIndex) => (

                                            <div
                                                className="review-window-card"
                                                key={windowIndex}
                                            >

                                                <h4>{window.windowNo}</h4>

                                                <div className="review-detail">
                                                    <span>Installation Type</span>
                                                    <strong>
                                                        {window.installationType}
                                                    </strong>
                                                </div>

                                                <div className="review-detail">
                                                    <span>Curtain Type</span>
                                                    <strong>
                                                        {window.curtainType}
                                                    </strong>
                                                </div>

                                                <div className="review-detail">
                                                    <span>Curtain Height</span>
                                                    <strong>
                                                        {window.curtainHeight} cm
                                                    </strong>
                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                </section>

                            ))}

                        </div>

                        <div className="review-actions">

                            <button
                                type="button"
                                className="back-to-edit"
                                onClick={() => setIsReviewing(false)}
                            >
                                Back to Edit
                            </button>

                            <button
                                type="button"
                                className="confirm-order"
                                onClick={handleConfirmOrder}
                            >
                                Confirm Order
                            </button>

                        </div>

                    </section>
                ) : (
                    <form
                        className="order-form"
                        onSubmit={handleReview}
                    >

                        {/* Order Details */}

                        <div className="form-group order-number-group">
                            <label htmlFor="orderNo">
                                Order No.
                            </label>

                            <input
                                type="text"
                                id="orderNo"
                                value={orderNo}
                                onChange={(event) => {
                                    setOrderNo(event.target.value);
                                    setSubmittedOrder(null);
                                }}
                                placeholder="e.g. ORD-001"
                                required
                            />
                        </div>

                        {/* Rooms */}

                        <div className="rooms-section">

                            {rooms.map((room, roomIndex) => (

                                <section
                                    className="room-card"
                                    key={room.id}
                                >

                                    <div className="room-header">

                                        <h2>
                                            Room {roomIndex + 1}
                                        </h2>

                                        <button
                                            type="button"
                                            className="remove-button"
                                            onClick={() =>
                                                handleRemoveRoom(room.id)
                                            }
                                        >
                                            Remove Room
                                        </button>

                                    </div>

                                    {/* Room Selection */}

                                    <div className="form-group">
                                        <label
                                            htmlFor={`room-${room.id}`}
                                        >
                                            Room
                                        </label>

                                        <select
                                            id={`room-${room.id}`}
                                            value={room.room}
                                            onChange={(event) =>
                                                handleRoomChange(
                                                    room.id,
                                                    event.target.value
                                                )
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select Room
                                            </option>

                                            {getAvailableRooms(room.id).map(
                                                (roomOption) => (
                                                    <option
                                                        key={roomOption}
                                                        value={roomOption}
                                                    >
                                                        {roomOption}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    {/* Windows */}

                                    <div className="windows-section">

                                        {room.windows.map((window, windowIndex) => (

                                            <div
                                                className="window-card"
                                                key={window.id}
                                            >

                                                <div className="window-header">

                                                    <h3>
                                                        Window {windowIndex + 1}
                                                    </h3>

                                                    {room.windows.length > 1 && (
                                                        <button
                                                            type="button"
                                                            className="remove-button"
                                                            onClick={() =>
                                                                handleRemoveWindow(
                                                                    room.id,
                                                                    window.id
                                                                )
                                                            }
                                                        >
                                                            Remove Window
                                                        </button>
                                                    )}

                                                </div>

                                                <div className="window-form-grid">

                                                    {/* Window Number */}

                                                    <div className="form-group">
                                                        <label
                                                            htmlFor={`windowNo-${window.id}`}
                                                        >
                                                            Window No.
                                                        </label>

                                                        <select
                                                            id={`windowNo-${window.id}`}
                                                            value={window.windowNo}
                                                            onChange={(event) =>
                                                                handleWindowChange(
                                                                    room.id,
                                                                    window.id,
                                                                    "windowNo",
                                                                    event.target.value
                                                                )
                                                            }
                                                            required
                                                        >
                                                            {windowOptions
                                                                .filter(
                                                                    (windowNo) =>
                                                                        !room.windows.some(
                                                                            (otherWindow) =>
                                                                                otherWindow.windowNo === windowNo &&
                                                                                otherWindow.id !== window.id
                                                                        )
                                                                )
                                                                .map((windowNo) => (
                                                                    <option
                                                                        key={windowNo}
                                                                        value={windowNo}
                                                                    >
                                                                        {windowNo}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                    </div>

                                                    {/* Installation Type */}

                                                    <div className="form-group">
                                                        <label
                                                            htmlFor={`installationType-${window.id}`}
                                                        >
                                                            Installation Type
                                                        </label>

                                                        <select
                                                            id={`installationType-${window.id}`}
                                                            value={window.installationType}
                                                            onChange={(event) =>
                                                                handleWindowChange(
                                                                    room.id,
                                                                    window.id,
                                                                    "installationType",
                                                                    event.target.value
                                                                )
                                                            }
                                                            required
                                                        >
                                                            <option value="">
                                                                Select One
                                                            </option>

                                                            {installationOptions.map(
                                                                (option) => (
                                                                    <option
                                                                        key={option}
                                                                        value={option}
                                                                    >
                                                                        {option}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>

                                                    {/* Curtain Type */}

                                                    <div className="form-group">
                                                        <label
                                                            htmlFor={`curtainType-${window.id}`}
                                                        >
                                                            Curtain Type
                                                        </label>

                                                        <select
                                                            id={`curtainType-${window.id}`}
                                                            value={window.curtainType}
                                                            onChange={(event) =>
                                                                handleWindowChange(
                                                                    room.id,
                                                                    window.id,
                                                                    "curtainType",
                                                                    event.target.value
                                                                )
                                                            }
                                                            required
                                                        >
                                                            <option value="">
                                                                Select One
                                                            </option>

                                                            {curtainOptions.map(
                                                                (option) => (
                                                                    <option
                                                                        key={option}
                                                                        value={option}
                                                                    >
                                                                        {option}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>

                                                    {/* Curtain Height */}

                                                    <div className="form-group">
                                                        <label
                                                            htmlFor={`curtainHeight-${window.id}`}
                                                        >
                                                            Curtain Height (cm)
                                                        </label>

                                                        <input
                                                            type="number"
                                                            id={`curtainHeight-${window.id}`}
                                                            value={window.curtainHeight}
                                                            onChange={(event) =>
                                                                handleWindowChange(
                                                                    room.id,
                                                                    window.id,
                                                                    "curtainHeight",
                                                                    event.target.value
                                                                )
                                                            }
                                                            placeholder="e.g. 240"
                                                            min="1"
                                                            step="any"
                                                            required
                                                        />
                                                    </div>

                                                </div>

                                            </div>

                                        ))}

                                        {/* Add Window */}

                                        {room.windows.length < 4 && (
                                            <button
                                                type="button"
                                                className="add-window-button"
                                                onClick={() =>
                                                    handleAddWindow(room.id)
                                                }
                                            >
                                                + Add Window
                                            </button>
                                        )}

                                    </div>

                                </section>

                            ))}

                        </div>

                        {/* Add Room */}

                        {rooms.length < roomOptions.length && (
                            <button
                                type="button"
                                className="add-room-button"
                                onClick={handleAddRoom}
                            >
                                + Add Room
                            </button>
                        )}

                        {/* Submit Order */}

                        <button
                            type="submit"
                            className="submit-order"
                            disabled={rooms.length === 0}
                        >
                            Review Order
                        </button>

                    </form>
                )}

            </div>
        </main>
    );
}

export default InputPage;