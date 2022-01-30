import { IExtensionState, IPopupState } from "@syncroc/common";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface IMainPageProps {
    state: IPopupState
}

export default function MainPage({ state }: IMainPageProps) {
    const navigate = useNavigate();

    return (
        <div style={{ width: "400px", height: "400px" }}>
            <button onClick={() => navigate("/record")}>Record</button>
        </div>
    );
}
