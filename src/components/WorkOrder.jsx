function WorkOrder({ room, window }) {
    const heightInches =
        window.curtainHeight !== undefined &&
        window.curtainHeight !== null &&
        window.curtainHeight !== ""
            ? (Number(window.curtainHeight) / 2.54).toFixed(2)
            : "TBD";

    const curtainType = window.curtainType || "TBD";

    return (
        <div className="work-order">
            <table className="work-order-table">
                <colgroup>
                    <col />
                    <col />
                    <col />
                    <col />
                </colgroup>

                <tbody>
                    <tr>
                        <th>CUSTOMER</th>
                        <td colSpan={3}>TBD</td>
                    </tr>

                    <tr>
                        <th>ROOM</th>
                        <td>{room.room || "TBD"}</td>
                        <th>WINDOW</th>
                        <td>{window.windowNo || "TBD"}</td>
                    </tr>

                    <tr>
                        <th>HEIGHT (cm)</th>
                        <td>{window.curtainHeight || "TBD"}</td>
                        <th>WIDTH (cm)</th>
                        <td>TBD</td>
                    </tr>

                    <tr>
                        <th>INCH</th>
                        <td>{heightInches}</td>
                        <th>INCH</th>
                        <td>TBD</td>
                    </tr>

                    <tr>
                        <th colSpan={2}>TYPE OF CURTAIN</th>
                        <td colSpan={2}>TBD</td>
                    </tr>

                    <tr>
                        <th>FABRIC COLLECTION</th>
                        <td colSpan={2}>TBD</td>
                        <td>CURTAIN TYPE</td>
                    </tr>

                    <tr>
                        <th>Design No.</th>
                        <td colSpan={3}>TBD</td>
                    </tr>

                    <tr>
                        <th>LINING</th>
                        <td colSpan={3}>TBD</td>
                    </tr>

                    <tr>
                        <th>PANELS</th>
                        <td colSpan={3}>TBD</td>
                    </tr>

                    <tr>
                        <th>MAIN</th>
                        <th>No. of Panels</th>
                        <th>LENGTH</th>
                        <th>TOTAL</th>
                    </tr>

                    <tr>
                        <td></td>
                        <td>TBD</td>
                        <td>TBD</td>
                        <td>TBD</td>
                    </tr>

                    <tr>
                        <th>LINING</th>
                        <th>No. of Panels</th>
                        <th>LENGTH</th>
                        <th>TOTAL</th>
                    </tr>

                    <tr>
                        <td></td>
                        <td>TBD</td>
                        <td>TBD</td>
                        <td>TBD</td>
                    </tr>

                    <tr>
                        <th>TIE BACK</th>
                        <td colSpan={3}>TBD</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default WorkOrder;